import { useEffect, useRef, type RefObject } from 'react'
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
import {
  applyHeroMaterial,
  forEachGlassMaterial,
  loadDecoration,
  loadModel,
  placeModel,
  updateGlassFresnelStrength,
  updateGlassLight,
  updateGlassResolution,
  updateGlassSpecularStrength,
  type DecorationSprite,
  type LoadedModel,
} from './modelUtils.ts'
import {
  AdaptiveRenderQuality,
  getInitialRenderQuality,
} from './renderQuality.ts'

const ACCENT = new THREE.Color(0xe05035)
const OUTPUT_TINT = new THREE.Color(0x351109)

type GlobalWebGLSceneProps = {
  introProgressRef: RefObject<number>
  interactionReadyRef: RefObject<boolean>
  onAssetsReady: () => void
}

export function GlobalWebGLScene({
  introProgressRef,
  interactionReadyRef,
  onAssetsReady,
}: GlobalWebGLSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

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
      onAssetsReady()
      return
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25

    const deviceMemory = (
      navigator as Navigator & { deviceMemory?: number }
    ).deviceMemory
    const initialQuality = getInitialRenderQuality({
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      deviceMemory,
      coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    })
    const adaptiveQuality = new AdaptiveRenderQuality(initialQuality)
    let renderQuality = initialQuality

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
      samples: initialQuality.samples,
    })
    let hello: LoadedModel | null = null
    let cursor: LoadedModel | null = null
    const decorations: DecorationSprite[] = []
    let disposed = false
    let wake = () => undefined

    const yieldMainThread = (ms = 40) => new Promise((r) => setTimeout(r, ms))

    const loadAssetsAsync = async () => {
      // Let signature intro render for 150ms with 100% CPU capacity before WebGL model parsing
      await yieldMainThread(150)
      if (disposed) return

      try {
        const helloModel = await loadModel(loader, '/assets/3d/sign.glb')
        if (disposed) return
        hello = helloModel
        lastGlassQuality = null
        applyHeroMaterial(hello, refractionTarget.texture)
        hello.root.rotation.set(-0.08, -0.18, -0.03)
        scene.add(hello.root)
        wake()

        await yieldMainThread(30)
        if (disposed) return

        const cursorModel = await loadModel(loader, '/assets/3d/024-cursor.glb')
        if (disposed) return
        cursor = cursorModel
        applyHeroMaterial(cursor, refractionTarget.texture)
        updateGlassFresnelStrength(cursor.root, 0.72)
        cursor.root.rotation.set(0.16, -0.34, -0.48)
        scene.add(cursor.root)

        const drawingSize = renderer.getDrawingBufferSize(new THREE.Vector2())
        updateGlassResolution(hello.root, drawingSize.x, drawingSize.y)
        updateGlassResolution(cursor.root, drawingSize.x, drawingSize.y)
        wake()

        await yieldMainThread(30)
        if (disposed) return

        // Stickers are placed at world-space offsets from the glass model's
        // center, scaled proportionally with the model size so they stay
        // spread across the screen on every breakpoint. behind = sticker sits
        // behind the glass and peeks out from an edge; front = floats above.
        // Portrait offsets (pX/pY) spread stickers vertically on tall screens.
        // spin = base material rotation in radians for per-sticker tilt.
        const stickerFiles = [
          { path: '/assets/stickers/sticker-pen.png',    sizeFrac: 0.12, offsetX: -1.95, offsetY:  0.82, pX: -0.72, pY:  1.3,  behind: false, spin: -0.25 },
          { path: '/assets/stickers/sticker-eyes.png',   sizeFrac: 0.11, offsetX: -2.55, offsetY: -0.85, pX:  0.78, pY:  0.6,  behind: false, spin: 0.3  },
          { path: '/assets/stickers/sticker-heart.png',  sizeFrac: 0.17, offsetX: -0.7,  offsetY:  0.01,  pX: -0.5,  pY:  0.8,  behind: true,  spin: 0.1  },
          { path: '/assets/stickers/sticker-star.webp',  sizeFrac: 0.15, offsetX:  0.85, offsetY:  0.75, pX:  0.42, pY:  0.8,  behind: true,  spin: 0.1  },
          { path: '/assets/stickers/sticker-2026.png',   sizeFrac: 0.11, offsetX:  2.05, offsetY: -0.38, pX:  0.92, pY: -0.95, behind: false, spin: -0.15 },
          { path: '/assets/stickers/sticker-hand.png',   sizeFrac: 0.20, offsetX:  0.85, offsetY: -2.1,  pX: -0.85, pY: -2.32, behind: false, spin: 0.4  },
        ]

        for (const item of stickerFiles) {
          if (disposed) break
          const sprite = await loadDecoration(textureLoader, item)
          decorations.push(sprite)
          scene.add(sprite)
          await yieldMainThread(20)
        }
      } catch (err) {
        console.warn('Hero asset load note:', err)
      }

      if (!disposed) {
        onAssetsReady()
        wake()
      }
    }

    void loadAssetsAsync()

    const sceneTarget = new THREE.WebGLRenderTarget(2, 2, {
      type: THREE.UnsignedByteType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
      samples: initialQuality.samples,
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
    const compositeMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: compositeFragmentShader,
      uniforms: {
        tDiffuse: { value: fluidTarget.texture },
        uVelocity: { value: fluid.velocityTexture },
        uSimSize: { value: new THREE.Vector2(2, 2) },
        uDisplacementStrength: { value: 0.6 },
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
        tDiffuse: { value: sceneTarget.texture },
        uResolution: { value: new THREE.Vector2(2, 2) },
        uEnabled: { value: 1 },
        uIntensity: { value: 0.45 },
        uThreshold: { value: 0.72 },
        uStreakScale: { value: 8 },
        uHotspotPower: { value: 24 },
        uGate: { value: 0.5 },
        uStarRays: { value: 4 },
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
    let appliedQualityName = ''
    let previousRenderAt = 0
    let frame = 0
    let lastGlassQuality: string | null = null
    let interactionUntil = performance.now() + 1200
    let fluidFramesRemaining = 0
    let glassMotionEnergy = 0
    const startedAt = performance.now()
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
      if (
        nextWidth === width
        && nextHeight === height
        && appliedQualityName === renderQuality.name
      ) return

      width = nextWidth
      height = nextHeight
      appliedQualityName = renderQuality.name
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, renderQuality.pixelRatioCap),
      )
      renderer.setSize(width, height, false)
      const drawingSize = renderer.getDrawingBufferSize(new THREE.Vector2())
      sceneTarget.samples = renderQuality.samples
      refractionTarget.samples = renderQuality.samples
      sceneTarget.setSize(drawingSize.x, drawingSize.y)
      refractionTarget.setSize(drawingSize.x, drawingSize.y)
      fluidTarget.setSize(drawingSize.x, drawingSize.y)
      flareTarget.setSize(drawingSize.x, drawingSize.y)
      flareMaterial.uniforms.tDiffuse.value = sceneTarget.texture
      finalMaterial.uniforms.tBase.value = sceneTarget.texture
      finalMaterial.uniforms.tFlare.value = flareTarget.texture
      compositeMaterial.uniforms.tDiffuse.value = fluidTarget.texture
      flareMaterial.uniforms.uResolution.value.copy(drawingSize)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      backgroundMaterial.uniforms.uResolution.value.set(width, height)

      const simulationSize = getSimulationSize(
        width,
        height,
        renderQuality.simulationLongAxis,
      )
      fluid.resize(simulationSize)
      compositeMaterial.uniforms.uSimSize.value.set(
        simulationSize.width,
        simulationSize.height,
      )
      const postSize = getSimulationSize(
        width,
        height,
        renderQuality.postLongAxis,
      )
      backgroundTarget.setSize(postSize.width, postSize.height)
      swirlTarget.setSize(postSize.width, postSize.height)
      waveTarget.setSize(postSize.width, postSize.height)
      voronoiTarget.setSize(postSize.width, postSize.height)
      bokehTarget.setSize(postSize.width, postSize.height)
      swirlMaterial.uniforms.tInput.value = backgroundTarget.texture
      waveMaterial.uniforms.tInput.value = swirlTarget.texture
      voronoiMaterial.uniforms.tInput.value = waveTarget.texture
      bokehMaterial.uniforms.tInput.value = voronoiTarget.texture
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
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!interactionReadyRef.current) return

      const next = normalizePointer(
        event.clientX,
        event.clientY,
        window.innerWidth,
        window.innerHeight,
      )
      const delta = clampPointerDelta(next, previousPointer, 0.1)
      glassMotionEnergy = Math.min(
        1,
        glassMotionEnergy + Math.hypot(delta.x, delta.y) * 18,
      )
      pointer = next
      previousPointer = next
      pendingDelta.x += delta.x
      pendingDelta.y += delta.y
      const pendingMagnitude = Math.hypot(pendingDelta.x, pendingDelta.y)
      if (pendingMagnitude > 0.15) {
        const scale = 0.15 / pendingMagnitude
        pendingDelta.x *= scale
        pendingDelta.y *= scale
      }
      interactionUntil = performance.now() + 600
      fluidFramesRemaining = 48
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
      const introProgress = Math.min(
        1,
        Math.max(0, introProgressRef.current),
      )
      const introEase = 1 - Math.pow(1 - introProgress, 3)
      const introAnimating = introProgress < 0.999
      const interactionActive = (
        now < interactionUntil
        || fluidFramesRemaining > 0
        || Math.abs(targetScrollProgress - scrollProgress) > 0.0005
        || introAnimating
      )
      if (
        interactionReadyRef.current
        && previousRenderAt > 0
      ) {
        const nextQuality = adaptiveQuality.sample(now - previousRenderAt)
        if (nextQuality) renderQuality = nextQuality
      }
      previousRenderAt = now

      const lowQuality = renderQuality.name === 'low'

      // Pause WebGL rendering during loading screen so signature loader gets 100% CPU/GPU frame capacity
      if (introProgressRef.current < 0.05) {
        frame = requestAnimationFrame(render)
        return
      }

      if (renderQuality.name !== lastGlassQuality) {
        lastGlassQuality = renderQuality.name
        const refractionEnabled = lowQuality ? 0 : 1
        const updateGlass = (root: THREE.Object3D) => {
          forEachGlassMaterial(root, (material) => {
            material.uniforms.uSceneRefractionEnabled.value = refractionEnabled
          })
        }
        if (hello) updateGlass(hello.root)
        if (cursor) updateGlass(cursor.root)
      }

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
      glassLight.lerp(glassLightTarget, 0.7)
      glassMotionEnergy *= 0.92
      const glassSpecularStrength = 1.2 + glassMotionEnergy * 0.8
      scrollProgress = reducedMotion ? 0 : targetScrollProgress
      const heroDepthOffset = scrollProgress * 5
      decorations.forEach((sprite, index) => {
        const heroVisualActive = heroActive && scrollProgress < 0.985
        sprite.visible = heroVisualActive && !!hello

        // Staggered spring pop-in reveal calculation (Delayed cascade after loader exit)
        const baseDelay = 0.15
        const stickerDelay = baseDelay + index * 0.16
        const windowSize = 0.25
        const rawProgress = Math.max(
          0,
          Math.min(1, (introEase - stickerDelay) / windowSize),
        )
        const springPop = rawProgress === 0
          ? 0
          : rawProgress >= 1
            ? 1
            : Math.sin(rawProgress * Math.PI * 0.5) * (1 + 0.38 * Math.sin(rawProgress * Math.PI))

        // Stickers track the glass model's live position and spread across the
        // view frustum so they fill the screen on every breakpoint. On portrait
        // (tall) screens, portrait offsets spread stickers vertically instead
        // of bunching them in a horizontal band.
        const stickerLayout = getHeroLayout(camera.aspect)
        const modelCenterX = stickerLayout.helloPosition.x
        const isPortrait = camera.aspect < 0.8

        const targetSize = stickerLayout.helloSize * sprite.userData.sizeFrac
        sprite.scale.setScalar(targetSize * springPop)

        // Subtle rotation settlement on pop
        const popRotation = (1 - rawProgress) * (index % 2 === 0 ? 0.45 : -0.45)
        if (sprite.material) {
          sprite.material.rotation = sprite.userData.phase + popRotation
        }

        // Out-of-sync floating drift
        const floatSpeed = 0.42 + (index % 3) * 0.15
        const drift = reducedMotion
          ? 0
          : Math.sin(elapsed * floatSpeed + sprite.userData.phase)

        // Drop-in Y position offset during spring pop
        const dropOffset = (1 - rawProgress) * 0.35

        // Depth layer: behind stickers render past the glass and peek out;
        // front stickers float above the glass.
        const baseZ = sprite.userData.behind ? -1.15 : 0.85
        sprite.position.z = (
          baseZ
          - heroDepthOffset
          + THREE.MathUtils.lerp(-0.8, 0, introEase)
        )

        // Compute the live view frustum at the sprite's depth, then place
        // stickers as fractions of that frustum so the spread adapts to the
        // actual screen size on every breakpoint. Horizontal is clamped to
        // stay on-screen; vertical follows the model's scroll parallax.
        const viewHalfW = viewHeightAt(sprite.position.z) * camera.aspect * 0.5
        const viewHalfH = viewHeightAt(sprite.position.z) * 0.5
        const marginX = targetSize * 0.55
        const marginY = targetSize * 0.55
        const driftX = (pointer.x - 0.5) * (0.05 + index * 0.012)
        const driftY = drift * 0.045 + (pointer.y - 0.5) * 0.045
        const spriteScrollOffset = scrollProgress * viewHeightAt(sprite.position.z)

        // Reference frustum half-extents for normalizing offsets to fractions.
        // Landscape uses the desktop reference; portrait uses a taller one so
        // vertical offsets map to more screen space.
        const REF_HALF_W = isPortrait ? 1.05 : 3.2
        const REF_HALF_H = isPortrait ? 1.45 : 1.9
        const srcX = isPortrait ? sprite.userData.portraitX : sprite.userData.offsetX
        const srcY = isPortrait ? sprite.userData.portraitY : sprite.userData.offsetY
        const fracX = srcX / REF_HALF_W
        const fracY = srcY / REF_HALF_H

        sprite.position.x = Math.max(
          -viewHalfW + marginX,
          Math.min(viewHalfW - marginX, modelCenterX + fracX * (viewHalfW - marginX) + driftX),
        )

        sprite.position.y = (
          stickerLayout.helloPosition.y
          + fracY * (viewHalfH - marginY)
          + dropOffset
          + driftY
          + spriteScrollOffset
        )

        sprite.material.rotation = (
          sprite.userData.phase
          + Math.sin(elapsed * 0.4 + sprite.userData.phase) * 0.12
          + (pointer.x - 0.5) * 0.08
        )
      })

      const idlePhase = elapsed * 0.45
      const idleFloatY = Math.sin(idlePhase) * 0.03
      const idleFloatPitch = Math.sin(idlePhase * 0.7) * 0.03
      const idleFloatYaw = Math.cos(idlePhase * 0.6) * 0.025

      if (hello && cursor) {
        const layout = getHeroLayout(camera.aspect)
        const introDepth = THREE.MathUtils.lerp(-1.15, 0, introEase)
        const helloIntroScale = THREE.MathUtils.lerp(0.68, 1, introEase)
        const cursorIntroScale = THREE.MathUtils.lerp(0.76, 1, introEase)
        const helloZ = (
          layout.helloPosition.z
          - scrollProgress * 5.2
          + introDepth
        )
        const cursorZ = (
          layout.cursorPosition.z
          - scrollProgress * 4.6
          + introDepth * 0.82
        )
        placeModel(
          hello,
          (
            layout.helloSize
            * (1 - scrollProgress * 0.22)
            * helloIntroScale
          ),
          {
            x: layout.helloPosition.x,
            y: (
              layout.helloPosition.y
              + scrollProgress * viewHeightAt(helloZ)
            ),
            z: helloZ,
          },
        )
        placeModel(cursor, (
          layout.cursorSize
          * (1 - scrollProgress * 0.28)
          * cursorIntroScale
        ), {
          x: layout.cursorPosition.x + (pointer.x - 0.5) * 0.14,
          y: (
            layout.cursorPosition.y
            + (pointer.y - 0.5) * 0.1
            + idleFloatY
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
          + idleFloatPitch
          - cursorPitch
        ) * 0.45
        cursorYaw += (
          -0.34
          + scrollProgress * 1.1
          + (pointer.x - 0.5) * 0.3
          + idleFloatYaw
          - cursorYaw
        ) * 0.45
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
        updateGlassSpecularStrength(cursor.root, glassSpecularStrength * 1.4)
      }

      const waveLoop = Math.sin(elapsed * 0.6)
      const glowX = 0.5 + (pointer.x - 0.5) * 0.3 + Math.cos(elapsed * 0.4) * 0.06
      const glowY = 0.5 + (pointer.y - 0.5) * 0.3 + waveLoop * 0.05
      backgroundMaterial.uniforms.uPos.value.set(glowX, glowY)
      backgroundMaterial.uniforms.uAngle.value = waveLoop * 0.08 + (pointer.x - 0.5) * 0.12

      swirlMaterial.uniforms.uTime.value = elapsed
      swirlMaterial.uniforms.uPos.value.set(pointer.x, pointer.y)
      waveMaterial.uniforms.uTime.value = elapsed
      waveMaterial.uniforms.uMousePos.value.set(pointer.x, pointer.y)
      voronoiMaterial.uniforms.uTime.value = elapsed * 0.25
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

      const heroVisualActive = heroActive && scrollProgress < 0.985
      const skipRefraction = lowQuality || !heroVisualActive
      if (!skipRefraction) {
        if (hello) hello.root.visible = false
        if (cursor) cursor.root.visible = false
        renderBackdropAndScene(refractionTarget)
      }
      if (hello) hello.root.visible = heroVisualActive
      if (cursor) cursor.root.visible = heroVisualActive

      renderBackdropAndScene(sceneTarget)

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

      renderer.setRenderTarget(flareTarget)
      if (heroVisualActive) {
        compositeMesh.material = flareMaterial
        renderer.render(compositeScene, compositeCamera)
      } else {
        renderer.clear()
      }

      compositeMesh.material = finalMaterial
      renderer.setRenderTarget(fluidTarget)
      renderer.render(compositeScene, compositeCamera)

      compositeMaterial.uniforms.uVelocity.value = fluid.velocityTexture
      compositeMaterial.uniforms.uEffectEnabled.value = reducedMotion ? 0 : 1
      compositeMaterial.uniforms.tDiffuse.value = fluidTarget.texture
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
  }, [interactionReadyRef, introProgressRef, onAssetsReady])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 block size-full"
      aria-hidden="true"
    />
  )
}
