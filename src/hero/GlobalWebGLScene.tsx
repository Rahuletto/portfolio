import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  clampPointerDelta,
  getHeroLayout,
  getSimulationSize,
  normalizePointer,
  shouldInjectPointer,
  type Point,
} from './fluidPolicy.ts'
import { FluidSimulation } from './fluidSimulation.ts'
import {
  compositeFragmentShader,
  fullscreenVertexShader,
} from './fluidShaders.ts'
import { glassFragmentShader, glassVertexShader } from './glassShaders.ts'
import {
  additiveCompositeFragmentShader,
  starFlareFragmentShader,
} from './lightShaders.ts'
import {
  backgroundCompositeFragmentShader,
  backgroundFragmentShader,
  backgroundVertexShader,
} from './backgroundShaders.ts'
import {
  bokehFragmentShader,
  swirlFragmentShader,
  voronoiDistortionFragmentShader,
  waveFragmentShader,
} from './postShaders.ts'

type LoadedModel = {
  root: THREE.Group
  naturalSize: THREE.Vector3
  naturalCenter: THREE.Vector3
}

type DecorationSprite = THREE.Sprite & {
  material: THREE.SpriteMaterial
  userData: {
    anchorX: number
    anchorY: number
    anchorZ: number
    phase: number
  }
}

const ACCENT = new THREE.Color(0xe05035)
const OUTPUT_TINT = new THREE.Color(0x351109)

function loadModel(loader: GLTFLoader, url: string): Promise<LoadedModel> {
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

function placeModel(
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
      uTintColorA: {
        value: new THREE.Vector4(1, 0.6, 0.34, 1),
      },
      uTintColorB: {
        value: new THREE.Vector4(0.82, 0.46, 0.32, 1),
      },
      uTintLocalYRange: {
        value: new THREE.Vector2(localYMin, localYMax),
      },
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
      uShininess: { value: 100 },
      uDiffuseness: { value: 0.05 },
      uBrightness: { value: 0.6 },
      uContrast: { value: 0.98 },
      uGamma: { value: 1 },
      uSpecularStrength: { value: 1.2 },
      uFresnelStrength: { value: 0.72 },
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

function applyHeroMaterial(
  model: LoadedModel,
  texture: THREE.Texture,
): void {
  model.root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return

    child.material = createGlassMaterial(texture, child)
  })
}

function updateGlassResolution(root: THREE.Object3D, width: number, height: number): void {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    if (!(child.material instanceof THREE.ShaderMaterial)) return
    child.material.uniforms.uScreenResolutionPx.value.set(width, height)
  })
}

function updateGlassLight(root: THREE.Object3D, light: THREE.Vector3): void {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    if (!(child.material instanceof THREE.ShaderMaterial)) return
    child.material.uniforms.uLight.value.copy(light)
  })
}

function updateGlassSpecularStrength(
  root: THREE.Object3D,
  strength: number,
): void {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    if (!(child.material instanceof THREE.ShaderMaterial)) return
    child.material.uniforms.uSpecularStrength.value = strength
  })
}

function updateGlassFresnelStrength(
  root: THREE.Object3D,
  strength: number,
): void {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    if (!(child.material instanceof THREE.ShaderMaterial)) return
    child.material.uniforms.uFresnelStrength.value = strength
  })
}

async function loadDecoration(
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

export function GlobalWebGLScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const debugView = new URLSearchParams(window.location.search).get('webglDebug')

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
      })
    } catch {
      canvas.dataset.webglUnavailable = 'true'
      return
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 0, 7)

    const backgroundScene = new THREE.Scene()
    const backgroundCamera = new THREE.Camera()
    const backgroundMaterial = new THREE.ShaderMaterial({
      vertexShader: backgroundVertexShader,
      fragmentShader: backgroundFragmentShader,
      uniforms: {
        uRadius: { value: 0.354 },
        uFalloff: { value: 1 },
        uMix: { value: 1 },
        uDisplace: { value: 0 },
        uSkew: { value: 0.54 },
        uAngle: { value: 0 },
        uVignetteColor: { value: new THREE.Color(0x1b1313) },
        uPos: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(2, 2) },
        uClearColor: { value: ACCENT },
        uEdgeIntensity: { value: -0.82 },
      },
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    const backgroundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      backgroundMaterial,
    )
    backgroundScene.add(backgroundMesh)

    scene.add(new THREE.HemisphereLight(0xffe2d8, 0x180706, 3.1))
    const key = new THREE.DirectionalLight(0xfff6f0, 4.3)
    key.position.set(-3.5, 5.5, 5.5)
    scene.add(key)
    const rim = new THREE.PointLight(0xf05b3f, 24, 18)
    rim.position.set(4, -2.5, 4)
    scene.add(rim)

    const loader = new GLTFLoader()
    const textureLoader = new THREE.TextureLoader()
    const backgroundTarget = new THREE.WebGLRenderTarget(2, 2, {
      type: THREE.UnsignedByteType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    })
    const backgroundCompositeScene = new THREE.Scene()
    const backgroundCompositeMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: backgroundCompositeFragmentShader,
      uniforms: {
        tInput: { value: null },
        uBgColor: { value: ACCENT },
        uOutputColor: { value: OUTPUT_TINT },
        uLoaded: { value: 1 },
        uOutputMix: { value: 0.95 },
      },
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    const backgroundCompositeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      backgroundCompositeMaterial,
    )
    backgroundCompositeScene.add(backgroundCompositeMesh)
    const swirlTarget = new THREE.WebGLRenderTarget(2, 2, {
      type: THREE.UnsignedByteType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    })
    const waveTarget = swirlTarget.clone()
    const voronoiTarget = swirlTarget.clone()
    const bokehTarget = voronoiTarget.clone()
    const blueNoiseData = new Uint8Array(128 * 128 * 4)
    let noiseState = 0x9e3779b9
    for (let index = 0; index < blueNoiseData.length; index += 4) {
      noiseState ^= noiseState << 13
      noiseState ^= noiseState >>> 17
      noiseState ^= noiseState << 5
      const value = noiseState & 0xff
      blueNoiseData[index] = value
      blueNoiseData[index + 1] = value
      blueNoiseData[index + 2] = value
      blueNoiseData[index + 3] = 255
    }
    const blueNoiseTexture = new THREE.DataTexture(
      blueNoiseData,
      128,
      128,
      THREE.RGBAFormat,
    )
    blueNoiseTexture.wrapS = THREE.RepeatWrapping
    blueNoiseTexture.wrapT = THREE.RepeatWrapping
    blueNoiseTexture.minFilter = THREE.NearestFilter
    blueNoiseTexture.magFilter = THREE.NearestFilter
    blueNoiseTexture.needsUpdate = true
    const postScene = new THREE.Scene()
    const postCamera = new THREE.Camera()
    const swirlMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: swirlFragmentShader,
      uniforms: {
        tInput: { value: backgroundTarget.texture },
        uRadius: { value: 0.25 },
        uAngle: { value: 0.1 },
        uPhase: { value: 0 },
        uTime: { value: 0 },
        uMix: { value: 0.5 },
        uResolution: { value: new THREE.Vector2(398, 305) },
        uPos: { value: new THREE.Vector2(0.5, 0.5) },
      },
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    const waveMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: waveFragmentShader,
      uniforms: {
        tInput: { value: swirlTarget.texture },
        uMixRadius: { value: 1 },
        uFrequency: { value: 0.35 },
        uAmplitude: { value: 1.18 },
        uRotation: { value: 0 },
        uTime: { value: 0 },
        uPos: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(398, 305) },
        uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
        uTrackMouse: { value: 1 },
      },
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    const voronoiMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: voronoiDistortionFragmentShader,
      uniforms: {
        tInput: { value: waveTarget.texture },
        uAmount: { value: 1 },
        uSpread: { value: 0.9 },
        uAngle: { value: -0.125 },
        uTime: { value: 0 },
        uSkew: { value: 0.9 },
        uCellScale: { value: 16 },
        uPos: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(398, 305) },
        uMixRadius: { value: 1 },
        uMixRadiusInvert: { value: 0 },
        uEasing: { value: 1 },
        uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
        uTrackMouse: { value: 1 },
        uRoundness: { value: 0.02 },
      },
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    const bokehMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: bokehFragmentShader,
      uniforms: {
        tInput: { value: voronoiTarget.texture },
        tBlueNoise: { value: blueNoiseTexture },
        uAmount: { value: 2.35625 },
        uTilt: { value: 0.5 },
        uPos: { value: new THREE.Vector2(0.5, -0.1) },
        uResolution: { value: new THREE.Vector2(398, 305) },
        uBlueNoiseResolution: { value: new THREE.Vector2(128, 128) },
        uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
        uTrackMouse: { value: 1 },
      },
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    const postMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      voronoiMaterial,
    )
    postScene.add(postMesh)
    const refractionTarget = new THREE.WebGLRenderTarget(2, 2, {
      type: THREE.UnsignedByteType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
      samples: 4,
    })
    let hello: LoadedModel | null = null
    let cursor: LoadedModel | null = null
    const decorations: DecorationSprite[] = []
    let disposed = false
    let wake = () => undefined

    void Promise.all([
      loadModel(loader, '/assets/023-hello.gltf'),
      loadModel(loader, '/assets/024-cursor.glb'),
    ]).then(([helloModel, cursorModel]) => {
      if (disposed) {
        helloModel.root.clear()
        cursorModel.root.clear()
        return
      }

      hello = helloModel
      cursor = cursorModel
      applyHeroMaterial(hello, refractionTarget.texture)
      applyHeroMaterial(cursor, refractionTarget.texture)
      updateGlassFresnelStrength(cursor.root, 0)
      const drawingSize = renderer.getDrawingBufferSize(new THREE.Vector2())
      updateGlassResolution(hello.root, drawingSize.x, drawingSize.y)
      updateGlassResolution(cursor.root, drawingSize.x, drawingSize.y)
      hello.root.rotation.set(-0.08, -0.18, -0.03)
      cursor.root.rotation.set(0.16, -0.34, -0.48)
      scene.add(hello.root, cursor.root)
      wake()
    })

    void Promise.all([
      loadDecoration(textureLoader, '/assets/sticker-star.png', 0.72, -2.15, 2.05, 0.3, 0),
      loadDecoration(textureLoader, '/assets/sticker-pixel-coin.png', 1.25, 0.18, -0.08, -0.32, 1.4),
      loadDecoration(textureLoader, '/assets/sticker-eyes.png', 0.62, -2.75, -0.55, 0.3, 2.8),
      loadDecoration(textureLoader, '/assets/sticker-heart.png', 0.58, 2.95, 0.25, 0.3, 4.1),
      loadDecoration(textureLoader, '/assets/sticker-star.png', 0.38, 1.9, -1.38, 0.18, 5.2),
    ]).then((sprites) => {
      if (disposed) {
        sprites.forEach((sprite) => {
          sprite.material.map?.dispose()
          sprite.material.dispose()
        })
        return
      }

      decorations.push(...sprites)
      scene.add(...sprites)
      wake()
    })

    const sceneTarget = new THREE.WebGLRenderTarget(2, 2, {
      type: THREE.UnsignedByteType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
      samples: 4,
    })
    const fluid = new FluidSimulation(renderer)
    const compositeScene = new THREE.Scene()
    const compositeCamera = new THREE.Camera()
    const fluidTarget = new THREE.WebGLRenderTarget(2, 2, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    })
    const flareTarget = new THREE.WebGLRenderTarget(2, 2, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    })
    const flareSourceTarget = new THREE.WebGLRenderTarget(2, 2, {
      type: THREE.UnsignedByteType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
      samples: 4,
    })
    const compositeMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: compositeFragmentShader,
      uniforms: {
        tDiffuse: { value: fluidTarget.texture },
        uVelocity: { value: fluid.velocityTexture },
        uSimSize: { value: new THREE.Vector2(2, 2) },
        uDisplacementStrength: { value: 1 },
        uEffectEnabled: { value: 1 },
      },
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    const compositeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      compositeMaterial,
    )
    compositeScene.add(compositeMesh)
    const flareMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: starFlareFragmentShader,
      uniforms: {
        tDiffuse: { value: flareSourceTarget.texture },
        uResolution: { value: new THREE.Vector2(2, 2) },
        uEnabled: { value: 1 },
        uIntensity: { value: 1.0 },
        uThreshold: { value: 0.99 },
        uStreakScale: { value: 10 },
        uHotspotPower: { value: 32 },
        uGate: { value: 0.88 },
        uStarRays: { value: 6 },
        uTailColor: {
          value: new THREE.Vector3(ACCENT.r, ACCENT.g, ACCENT.b),
        },
      },
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    const finalMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: additiveCompositeFragmentShader,
      uniforms: {
        tBase: { value: sceneTarget.texture },
        tFlare: { value: flareTarget.texture },
      },
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)')
    let reducedMotion = reducedMotionQuery.matches
    let coarsePointer = coarsePointerQuery.matches
    let visible = !document.hidden
    let heroActive = true
    let pointer: Point = { x: 0.5, y: 0.5 }
    let previousPointer: Point = pointer
    let pendingDelta: Point = { x: 0, y: 0 }
    let targetScrollProgress = 0
    let scrollProgress = 0
    let cursorPitch = 0.16
    let cursorYaw = -0.34
    let width = 0
    let height = 0
    let frame = 0
    let interactionUntil = performance.now() + 1200
    let fluidFramesRemaining = 0
    let glassMotionEnergy = 0
    const startedAt = performance.now()
    const decorationSizes = [0.72, 1.25, 0.62, 0.58, 0.38]
    const cursorForwardAxis = new THREE.Vector3(-1, 1, 0).normalize()
    const cursorBaseEuler = new THREE.Euler()
    const cursorDrill = new THREE.Quaternion()
    const glassLight = new THREE.Vector3(4, 9, 0.5)
    const glassLightTarget = new THREE.Vector3(4, 9, 0.5)

    const heroElement = document.getElementById('top')
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroActive = entry?.isIntersecting ?? false
        interactionUntil = performance.now() + 300
        wake()
      },
      { rootMargin: '120px' },
    )
    if (heroElement) heroObserver.observe(heroElement)

    const updateLayout = () => {
      const nextWidth = Math.max(1, window.innerWidth)
      const nextHeight = Math.max(1, window.innerHeight)
      if (nextWidth === width && nextHeight === height) return

      width = nextWidth
      height = nextHeight
      const pixelRatioCap = width * height > 2_000_000 ? 1 : 1.25
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap))
      renderer.setSize(width, height, false)
      const drawingSize = renderer.getDrawingBufferSize(new THREE.Vector2())
      sceneTarget.setSize(drawingSize.x, drawingSize.y)
      refractionTarget.setSize(drawingSize.x, drawingSize.y)
      fluidTarget.setSize(drawingSize.x, drawingSize.y)
      flareTarget.setSize(drawingSize.x, drawingSize.y)
      flareSourceTarget.setSize(drawingSize.x, drawingSize.y)
      flareMaterial.uniforms.uResolution.value.copy(drawingSize)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      backgroundMaterial.uniforms.uResolution.value.set(width, height)

      const simulationSize = getSimulationSize(width, height, 209)
      fluid.resize(simulationSize)
      compositeMaterial.uniforms.uSimSize.value.set(
        simulationSize.width,
        simulationSize.height,
      )
      const postSize = getSimulationSize(width, height, 720)
      backgroundTarget.setSize(postSize.width, postSize.height)
      swirlTarget.setSize(postSize.width, postSize.height)
      waveTarget.setSize(postSize.width, postSize.height)
      voronoiTarget.setSize(postSize.width, postSize.height)
      bokehTarget.setSize(postSize.width, postSize.height)
      swirlMaterial.uniforms.uResolution.value.set(
        postSize.width,
        postSize.height,
      )
      waveMaterial.uniforms.uResolution.value.set(
        postSize.width,
        postSize.height,
      )
      voronoiMaterial.uniforms.uResolution.value.set(
        postSize.width,
        postSize.height,
      )
      bokehMaterial.uniforms.uResolution.value.set(
        postSize.width,
        postSize.height,
      )

      const layout = getHeroLayout(camera.aspect)
      if (hello) placeModel(hello, layout.helloSize, layout.helloPosition)
      if (cursor) placeModel(cursor, layout.cursorSize, layout.cursorPosition)
      if (hello) updateGlassResolution(hello.root, drawingSize.x, drawingSize.y)
      if (cursor) updateGlassResolution(cursor.root, drawingSize.x, drawingSize.y)

      const compact = camera.aspect < 0.82
      decorations.forEach((sprite, index) => {
        if (index === 1) {
          sprite.userData.anchorX = compact ? 0.08 : 0.18
          sprite.userData.anchorY = compact ? 0.02 : -0.08
          sprite.position.z = -0.32
        }
        sprite.visible = heroActive && (!compact || index < 2)
        sprite.scale.setScalar(compact ? 0.44 : (decorationSizes[index] ?? 0.58))
      })
    }

    const onPointerMove = (event: PointerEvent) => {
      const next = normalizePointer(
        event.clientX,
        event.clientY,
        window.innerWidth,
        window.innerHeight,
      )
      const delta = clampPointerDelta(next, previousPointer, 0.018)
      glassMotionEnergy = Math.min(
        1,
        glassMotionEnergy + Math.hypot(delta.x, delta.y) * 18,
      )
      pointer = next
      previousPointer = next
      pendingDelta.x += delta.x
      pendingDelta.y += delta.y
      const pendingMagnitude = Math.hypot(pendingDelta.x, pendingDelta.y)
      if (pendingMagnitude > 0.022) {
        const scale = 0.022 / pendingMagnitude
        pendingDelta.x *= scale
        pendingDelta.y *= scale
      }
      interactionUntil = performance.now() + 1100
      fluidFramesRemaining = 120
      wake()
    }

    const onVisibilityChange = () => {
      visible = !document.hidden
      if (visible) {
        interactionUntil = performance.now() + 300
        wake()
      }
    }
    const onScroll = () => {
      const heroHeight = heroElement?.clientHeight ?? window.innerHeight
      targetScrollProgress = Math.min(
        1,
        Math.max(0, window.scrollY / Math.max(heroHeight, 1)),
      )
      interactionUntil = performance.now() + 900
      wake()
    }
    const onSmoothScroll = (event: Event) => {
      const scroll = (event as CustomEvent<number>).detail
      if (!Number.isFinite(scroll)) return
      const heroHeight = heroElement?.clientHeight ?? window.innerHeight
      targetScrollProgress = Math.min(
        1,
        Math.max(0, scroll / Math.max(heroHeight, 1)),
      )
      interactionUntil = performance.now() + 120
      wake()
    }
    const onResize = () => {
      interactionUntil = performance.now() + 300
      wake()
    }
    const onReducedMotion = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
      wake()
    }
    const onCoarsePointer = (event: MediaQueryListEvent) => {
      coarsePointer = event.matches
      wake()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('portfolio:scroll', onSmoothScroll)
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    reducedMotionQuery.addEventListener('change', onReducedMotion)
    coarsePointerQuery.addEventListener('change', onCoarsePointer)
    onScroll()

    const render = () => {
      frame = 0
      updateLayout()

      if (!visible) return

      const now = performance.now()
      const interactionActive = (
        now < interactionUntil
        || fluidFramesRemaining > 0
        || Math.abs(targetScrollProgress - scrollProgress) > 0.0005
      )

      const elapsed = (now - startedAt) / 1000
      const halfFovTangent = Math.tan(
        THREE.MathUtils.degToRad(camera.fov * 0.5),
      )
      const viewHeightAt = (z: number) => (
        2 * halfFovTangent * (camera.position.z - z)
      )
      glassLightTarget.set(
        4 + (pointer.x - 0.5) * 18,
        9 + (pointer.y - 0.5) * 15,
        0.5 + (pointer.x - 0.5) * 2,
      )
      glassLight.lerp(glassLightTarget, 0.18)
      glassMotionEnergy *= 0.92
      const glassSpecularStrength = 1.2 + glassMotionEnergy * 0.8
      scrollProgress = reducedMotion ? 0 : targetScrollProgress
      const heroDepthOffset = scrollProgress * 5
      decorations.forEach((sprite, index) => {
        const compact = camera.aspect < 0.82
        const heroVisualActive = heroActive && scrollProgress < 0.985
        sprite.visible = heroVisualActive && (!compact || index < 2)
        sprite.scale.setScalar(compact ? 0.44 : (decorationSizes[index] ?? 0.58))
        const drift = reducedMotion
          ? 0
          : Math.sin(elapsed * 0.48 + sprite.userData.phase)
        sprite.position.x = (
          sprite.userData.anchorX
          + (pointer.x - 0.5) * (0.05 + index * 0.012)
        )
        sprite.position.z = sprite.userData.anchorZ - heroDepthOffset
        const spriteScrollOffset = scrollProgress * viewHeightAt(sprite.position.z)
        sprite.position.y = (
          sprite.userData.anchorY
          + drift * 0.045
          + (pointer.y - 0.5) * 0.045
          + spriteScrollOffset
        )
        sprite.material.rotation = drift * 0.035
      })

      if (hello && cursor) {
        const layout = getHeroLayout(camera.aspect)
        const helloZ = layout.helloPosition.z - scrollProgress * 5.2
        const cursorZ = layout.cursorPosition.z - scrollProgress * 4.6
        placeModel(
          hello,
          layout.helloSize * (1 - scrollProgress * 0.22),
          {
            x: layout.helloPosition.x,
            y: (
              layout.helloPosition.y
              + scrollProgress * viewHeightAt(helloZ)
            ),
            z: helloZ,
          },
        )
        placeModel(cursor, layout.cursorSize * (1 - scrollProgress * 0.28), {
          x: layout.cursorPosition.x + (pointer.x - 0.5) * 0.14,
          y: (
            layout.cursorPosition.y
            + (pointer.y - 0.5) * 0.1
            + scrollProgress * viewHeightAt(cursorZ)
          ),
          z: cursorZ,
        })
        hello.root.rotation.x = (
          -0.08
          + (pointer.y - 0.5) * 0.07
        )
        hello.root.rotation.y = (
          -0.18
          + scrollProgress * 1.42
          + (pointer.x - 0.5) * 0.11
        )
        hello.root.rotation.z = -0.03
        cursorPitch += (
          0.16
          + scrollProgress * 0.52
          + (pointer.y - 0.5) * 0.22
          - cursorPitch
        ) * 0.055
        cursorYaw += (
          -0.34
          + scrollProgress * 1.1
          + (pointer.x - 0.5) * 0.3
          - cursorYaw
        ) * 0.055
        cursorBaseEuler.set(cursorPitch, cursorYaw, -0.48)
        cursor.root.quaternion.setFromEuler(cursorBaseEuler)
        cursorDrill.setFromAxisAngle(
          cursorForwardAxis,
          scrollProgress * Math.PI * 3.2,
        )
        cursor.root.quaternion.multiply(cursorDrill)
        updateGlassLight(hello.root, glassLight)
        updateGlassLight(cursor.root, glassLight)
        updateGlassSpecularStrength(hello.root, glassSpecularStrength)
      }

      swirlMaterial.uniforms.uTime.value = elapsed
      swirlMaterial.uniforms.uPos.value.set(pointer.x, pointer.y)
      waveMaterial.uniforms.uTime.value = elapsed
      waveMaterial.uniforms.uMousePos.value.set(pointer.x, pointer.y)
      voronoiMaterial.uniforms.uTime.value = elapsed
      voronoiMaterial.uniforms.uMousePos.value.set(pointer.x, pointer.y)
      bokehMaterial.uniforms.uMousePos.value.set(pointer.x, pointer.y)

      renderer.setRenderTarget(backgroundTarget)
      renderer.render(backgroundScene, backgroundCamera)

      postMesh.material = swirlMaterial
      renderer.setRenderTarget(swirlTarget)
      renderer.render(postScene, postCamera)

      postMesh.material = waveMaterial
      renderer.setRenderTarget(waveTarget)
      renderer.render(postScene, postCamera)

      postMesh.material = voronoiMaterial
      renderer.setRenderTarget(voronoiTarget)
      renderer.render(postScene, postCamera)

      postMesh.material = bokehMaterial
      renderer.setRenderTarget(bokehTarget)
      renderer.render(postScene, postCamera)

      backgroundCompositeMaterial.uniforms.tInput.value = bokehTarget.texture
      const renderBackdropAndScene = (target: THREE.WebGLRenderTarget) => {
        renderer.setRenderTarget(target)
        renderer.render(backgroundCompositeScene, backgroundCamera)
        renderer.autoClear = false
        renderer.clearDepth()
        renderer.render(scene, camera)
        renderer.autoClear = true
      }

      if (hello) hello.root.visible = false
      if (cursor) cursor.root.visible = false
      renderBackdropAndScene(refractionTarget)
      const heroVisualActive = heroActive && scrollProgress < 0.985
      if (hello) hello.root.visible = heroVisualActive
      if (cursor) cursor.root.visible = heroVisualActive

      renderBackdropAndScene(sceneTarget)
      if (cursor) cursor.root.visible = false
      renderBackdropAndScene(flareSourceTarget)
      if (cursor) cursor.root.visible = heroVisualActive

      const inject = shouldInjectPointer({
        reducedMotion,
        coarsePointer,
        visible,
      }) && Math.hypot(pendingDelta.x, pendingDelta.y) > 0.00005

      if (inject || fluidFramesRemaining > 0) {
        fluid.step({
          pointer,
          pointerDelta: pendingDelta,
          viewport: { width, height },
          inject,
        })
        fluidFramesRemaining = Math.max(0, fluidFramesRemaining - 1)
        if (fluidFramesRemaining === 0) fluid.clearVelocity()
      }
      pendingDelta.x = 0
      pendingDelta.y = 0

      compositeMesh.material = flareMaterial
      renderer.setRenderTarget(flareTarget)
      renderer.render(compositeScene, compositeCamera)

      compositeMesh.material = finalMaterial
      renderer.setRenderTarget(fluidTarget)
      renderer.render(compositeScene, compositeCamera)

      compositeMaterial.uniforms.uVelocity.value = fluid.velocityTexture
      compositeMaterial.uniforms.uEffectEnabled.value = reducedMotion ? 0 : 1
      compositeMaterial.uniforms.tDiffuse.value = fluidTarget.texture
      if (debugView) {
        const debugTextures: Record<string, THREE.Texture> = {
          background: backgroundTarget.texture,
          swirl: swirlTarget.texture,
          wave: waveTarget.texture,
          voronoi: voronoiTarget.texture,
          bokeh: bokehTarget.texture,
          source: refractionTarget.texture,
          base: sceneTarget.texture,
          flareSource: flareSourceTarget.texture,
          flare: flareTarget.texture,
          composite: fluidTarget.texture,
        }
        compositeMaterial.uniforms.tDiffuse.value = (
          debugTextures[debugView] ?? fluidTarget.texture
        )
        compositeMaterial.uniforms.uEffectEnabled.value = 0
      }
      compositeMesh.material = compositeMaterial
      renderer.setRenderTarget(null)
      renderer.render(compositeScene, compositeCamera)

      if (interactionActive) wake()
    }
    wake = () => {
      if (!visible || disposed || frame !== 0) return
      frame = requestAnimationFrame(render)
    }
    wake()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('portfolio:scroll', onSmoothScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      reducedMotionQuery.removeEventListener('change', onReducedMotion)
      coarsePointerQuery.removeEventListener('change', onCoarsePointer)
      heroObserver.disconnect()
      fluid.dispose()
      sceneTarget.dispose()
      refractionTarget.dispose()
      backgroundTarget.dispose()
      swirlTarget.dispose()
      waveTarget.dispose()
      voronoiTarget.dispose()
      bokehTarget.dispose()
      fluidTarget.dispose()
      flareTarget.dispose()
      flareSourceTarget.dispose()
      compositeMesh.geometry.dispose()
      compositeMaterial.dispose()
      flareMaterial.dispose()
      finalMaterial.dispose()
      backgroundCompositeMesh.geometry.dispose()
      backgroundCompositeMaterial.dispose()
      postMesh.geometry.dispose()
      swirlMaterial.dispose()
      waveMaterial.dispose()
      voronoiMaterial.dispose()
      bokehMaterial.dispose()
      blueNoiseTexture.dispose()
      backgroundMesh.geometry.dispose()
      backgroundMaterial.dispose()
      scene.traverse((child) => {
        if (child instanceof THREE.Sprite) {
          child.material.map?.dispose()
          child.material.dispose()
          return
        }
        if (!(child instanceof THREE.Mesh)) return
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose())
        } else {
          child.material.dispose()
        }
      })
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="global-webgl"
      aria-hidden="true"
    />
  )
}
