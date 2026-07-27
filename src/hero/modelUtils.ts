import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { glassFragmentShader, glassVertexShader } from './glassShaders.ts'

export type LoadedModel = {
  root: THREE.Group
  naturalSize: THREE.Vector3
  naturalCenter: THREE.Vector3
}

export type DecorationSprite = THREE.Sprite & {
  material: THREE.SpriteMaterial
  userData: {
    phase: number
    sizeFrac: number
    offsetX: number
    offsetY: number
    portraitX: number
    portraitY: number
    behind: boolean
  }
}

export function loadModel(loader: GLTFLoader, url: string): Promise<LoadedModel> {
  return loader.loadAsync(url).then((gltf) => {
    const rawScene = gltf.scene
    const bounds = new THREE.Box3().setFromObject(rawScene)
    const naturalCenter = bounds.getCenter(new THREE.Vector3())
    const naturalSize = bounds.getSize(new THREE.Vector3())

    // Shift geometry inside root group so pivot (0,0,0) is at exact center of bounding box
    rawScene.position.sub(naturalCenter)

    const root = new THREE.Group()
    root.add(rawScene)

    return {
      root,
      naturalSize,
      naturalCenter,
    }
  })
}

export function placeModel(
  model: LoadedModel,
  targetSize: number,
  target: { x: number; y: number; z: number },
): void {
  const scale = targetSize / Math.max(
    model.naturalSize.x,
    model.naturalSize.y,
    model.naturalSize.z,
    0.0001,
  )

  model.root.scale.setScalar(scale)
  model.root.position.set(target.x, target.y, target.z)
}

function createGlassMaterial(
  texture: THREE.Texture,
  mesh: THREE.Mesh,
): THREE.ShaderMaterial {
  mesh.geometry.computeBoundingBox()
  const localBounds = mesh.geometry.boundingBox
  const localYMin = localBounds?.min.y ?? -0.5
  const localYMax = localBounds?.max.y ?? 0.5

  return new THREE.ShaderMaterial({
    vertexShader: glassVertexShader,
    fragmentShader: glassFragmentShader,
    uniforms: {
      uTexture: { value: texture },
      uScreenResolutionPx: { value: new THREE.Vector2(2, 2) },
      uLight: { value: new THREE.Vector3(4, 9, 0.5) },
      uTintColorA: { value: new THREE.Vector4(1, 0.6, 0.34, 1) },
      uTintColorB: { value: new THREE.Vector4(0.82, 0.46, 0.32, 1) },
      uTintLocalYRange: { value: new THREE.Vector2(localYMin, localYMax) },
      uFresnelSideDir: { value: new THREE.Vector3(-1, 1, -1) },
      uIorR: { value: 1.15 },
      uIorY: { value: 1.16 },
      uIorG: { value: 1.18 },
      uIorC: { value: 1.22 },
      uIorB: { value: 1.22 },
      uIorP: { value: 1.22 },
      uSaturation: { value: 1.2 },
      uChromaticAberration: { value: 0.14 },
      uRefractPower: { value: 0.72 },
      uFresnelPower: { value: 3 },
      uShininess: { value: 120 },
      uDiffuseness: { value: 0.05 },
      uBrightness: { value: 0.6 },
      uContrast: { value: 0.98 },
      uGamma: { value: 1 },
      uSpecularStrength: { value: 1.4 },
      uFresnelStrength: { value: 0.75 },
      uTintEnabled: { value: 1 },
      uTintMix: { value: 1 },
      uTintThicknessMinAlpha: { value: 1 },
      uTintThicknessMaxAlpha: { value: 0.5 },
      uSceneRefractionEnabled: { value: 1 },
      uRgbRefraction: { value: 1 },
      uDark: { value: 1 },
      uLoop: { value: 2 },
    },
    side: THREE.FrontSide,
    toneMapped: false,
  })
}

export function applyHeroMaterial(
  model: LoadedModel,
  texture: THREE.Texture,
): void {
  model.root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = createGlassMaterial(texture, child)
    }
  })
}

export function forEachGlassMaterial(
  root: THREE.Object3D,
  update: (material: THREE.ShaderMaterial) => void,
): void {
  root.traverse((child) => {
    if (
      child instanceof THREE.Mesh
      && child.material instanceof THREE.ShaderMaterial
    ) {
      update(child.material)
    }
  })
}

export function updateGlassResolution(
  root: THREE.Object3D,
  width: number,
  height: number,
): void {
  forEachGlassMaterial(root, (material) => {
    material.uniforms.uScreenResolutionPx.value.set(width, height)
  })
}

export function updateGlassLight(
  root: THREE.Object3D,
  light: THREE.Vector3,
): void {
  forEachGlassMaterial(root, (material) => {
    material.uniforms.uLight.value.copy(light)
  })
}

export function updateGlassSpecularStrength(
  root: THREE.Object3D,
  strength: number,
): void {
  forEachGlassMaterial(root, (material) => {
    material.uniforms.uSpecularStrength.value = strength
  })
}

export function updateGlassFresnelStrength(
  root: THREE.Object3D,
  strength: number,
): void {
  forEachGlassMaterial(root, (material) => {
    material.uniforms.uFresnelStrength.value = strength
  })
}

export async function loadDecoration(
  loader: THREE.TextureLoader,
  item: {
    path: string
    sizeFrac: number
    offsetX: number
    offsetY: number
    pX: number
    pY: number
    spin: number
    behind?: boolean
  },
): Promise<DecorationSprite> {
  const texture = await loader.loadAsync(item.path)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  texture.anisotropy = 8
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  })
  const behindZ = -1.15
  const frontZ = 0.85
  const z = item.behind ? behindZ : frontZ
  const baseSize = item.sizeFrac * 4.6
  const sprite = new THREE.Sprite(material) as DecorationSprite
  sprite.scale.set(baseSize, baseSize, 1)
  sprite.position.set(item.offsetX, item.offsetY, z)
  if (item.behind) {
    sprite.renderOrder = -1
  }
  sprite.userData = {
    phase: item.spin,
    sizeFrac: item.sizeFrac,
    offsetX: item.offsetX,
    offsetY: item.offsetY,
    portraitX: item.pX,
    portraitY: item.pY,
    behind: !!item.behind,
  }
  return sprite
}
