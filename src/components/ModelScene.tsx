import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

type ModelSceneProps = {
  model: string
  variant: 'hello' | 'cursor' | 'finale'
}

export function ModelScene({ model, variant }: ModelSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0, 7)
    scene.add(new THREE.HemisphereLight(0xffddd4, 0x21100d, variant === 'cursor' ? 3.8 : 2.8))
    const key = new THREE.DirectionalLight(0xffffff, 4.5)
    key.position.set(-3, 5, 5)
    scene.add(key)
    const rim = new THREE.PointLight(0xe05035, 25, 20)
    rim.position.set(4, -2, 4)
    scene.add(rim)

    let root: THREE.Group | null = null
    let frame = 0
    let pointerX = 0
    let pointerY = 0
    let disposed = false
    let inViewport = false
    const basePosition = variant === 'cursor'
      ? new THREE.Vector3(1.72, -0.72, 0.5)
      : new THREE.Vector3(0, 0, 0)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const viewportObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry?.isIntersecting ?? false
      },
      { rootMargin: '160px' },
    )
    viewportObserver.observe(canvas)

    new GLTFLoader().load(model, (gltf) => {
      if (disposed) return
      root = gltf.scene
      const box = new THREE.Box3().setFromObject(root)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      const targetSize = variant === 'hello' ? 5.1 : variant === 'cursor' ? 1.55 : 7.2
      const scale = targetSize / Math.max(size.x, size.y, size.z)
      root.scale.setScalar(scale)
      root.position.copy(center).multiplyScalar(-scale).add(basePosition)
      root.rotation.set(
        variant === 'cursor' ? 0.16 : -0.08,
        variant === 'cursor' ? -0.34 : -0.18,
        variant === 'cursor' ? -0.48 : -0.03,
      )
      root.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return
        child.material = new THREE.MeshPhysicalMaterial({
          color: variant === 'hello' ? 0xe05035 : 0xd8462d,
          metalness: variant === 'cursor' ? 0.04 : 0.12,
          roughness: variant === 'cursor' ? 0.1 : 0.18,
          clearcoat: 1,
          clearcoatRoughness: variant === 'cursor' ? 0.03 : 0.08,
          transmission: variant === 'cursor' ? 0.12 : 0,
          thickness: variant === 'cursor' ? 1.1 : 0,
          ior: variant === 'cursor' ? 1.22 : 1.5,
          iridescence: variant === 'cursor' ? 0.38 : 0.22,
          iridescenceIOR: 1.35,
        })
      })
      scene.add(root)
    })

    const resize = () => {
      const { clientWidth, clientHeight } = canvas
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / Math.max(clientHeight, 1)
      camera.updateProjectionMatrix()
    }
    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5
      pointerY = event.clientY / window.innerHeight - 0.5
    }
    const startedAt = performance.now()
    const render = () => {
      if (!inViewport || document.hidden) {
        frame = requestAnimationFrame(render)
        return
      }
      resize()
      if (root) {
        const t = (performance.now() - startedAt) / 1000
        const targetX = variant === 'cursor'
          ? 0.16 + (reduceMotion ? 0 : pointerY * 0.34)
          : reduceMotion ? 0 : pointerY * 0.18
        const targetY = variant === 'cursor'
          ? -0.34 + (reduceMotion ? 0 : pointerX * 0.42)
          : reduceMotion ? -0.18 : -0.18 + pointerX * 0.3
        root.rotation.x += (targetX - root.rotation.x) * 0.035
        root.rotation.y += (targetY - root.rotation.y) * 0.035
        if (!reduceMotion) {
          root.position.y = basePosition.y + Math.sin(t * (variant === 'cursor' ? 1.1 : 0.75)) * (variant === 'cursor' ? 0.13 : 0.08)
          if (variant === 'cursor') root.rotation.z = -0.48 + Math.sin(t * 0.7) * 0.045
        }
      }
      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    render()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      viewportObserver.disconnect()
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) child.material.forEach((item) => item.dispose())
          else child.material.dispose()
        }
      })
      renderer.dispose()
    }
  }, [model, variant])

  const variantClass = variant === 'finale'
    ? 'opacity-[.72] [transform:scale(1.25)_translateY(10%)] max-[760px]:[transform:scale(1.5)_translateY(14%)]'
    : variant === 'cursor'
      ? 'z-[1]'
      : 'translate-y-[2%]'

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 -z-[1] size-full ${variantClass}`}
      aria-hidden="true"
    />
  )
}
