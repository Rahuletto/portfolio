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
    anchorX: number
    anchorY: number
    anchorZ: number
    phase: number
  }
}

export function loadModel(loader: GLTFLoader, url: string): Promise<LoadedModel> {
  return loader.loadAsync(url).then((gltf) => {
    const root = gltf.scene
    const bounds = new THREE.Box3().setFromObject(root)

    return {
      root,
      naturalSize: bounds.getSize(new THREE.Vector3()),
      naturalCenter: bounds.getCenter(new THREE.Vector3()),
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
  model.root.position
    .copy(model.naturalCenter)
    .multiplyScalar(-scale)
    .add(new THREE.Vector3(target.x, target.y, target.z))
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
      uTintThicknessMaxAlpha: { value: 0.4 },
      uSceneRefractionEnabled: { value: 1 },
      uRgbRefraction: { value: 1 },
      uDark: { value: 1 },
      uLoop: { value: 3 },
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

function forEachGlassMaterial(
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
  url: string,
  size: number,
  x: number,
  y: number,
  z: number,
  phase: number,
): Promise<DecorationSprite> {
  const texture = await loader.loadAsync(url)
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
  const sprite = new THREE.Sprite(material) as DecorationSprite
  sprite.scale.set(size, size, 1)
  sprite.position.set(x, y, z)
  sprite.userData = { anchorX: x, anchorY: y, anchorZ: z, phase }
  return sprite
}
