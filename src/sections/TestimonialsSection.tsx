import { useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from 'motion/react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { loadModel, placeModel, type LoadedModel } from '../hero/modelUtils.ts'

const testimonials = [
  {
    quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.',
    name: 'Aarav Mehta',
    role: 'Founder, Placeholder Studio',
  },
  {
    quote: 'Sed posuere consectetur est at lobortis. Donec ullamcorper nulla non metus auctor fringilla.',
    name: 'Maya Chen',
    role: 'Product Lead, Example Labs',
  },
  {
    quote: 'Aenean lacinia bibendum nulla sed consectetur. Maecenas faucibus mollis interdum.',
    name: 'Noah Williams',
    role: 'Engineer, Sample Systems',
  },
  {
    quote: 'Cras mattis consectetur purus sit amet fermentum. Vestibulum id ligula porta felis euismod semper.',
    name: 'Isha Kapoor',
    role: 'Researcher, Demo Institute',
  },
  {
    quote: 'Nullam quis risus eget urna mollis ornare vel eu leo. Praesent commodo cursus magna.',
    name: 'Elias Martin',
    role: 'Creative Director, Draft Works',
  },
  {
    quote: 'Etiam porta sem malesuada magna mollis euismod. Curabitur blandit tempus porttitor.',
    name: 'Sofia Ramirez',
    role: 'Co-founder, Temp Company',
  },
]

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const smoothstep = (start: number, end: number, value: number) => {
  const t = clamp01((value - start) / (end - start))
  return t * t * (3 - 2 * t)
}

function TestimonialArtifact({
  progressRef,
  sectionRef,
}: {
  progressRef: RefObject<number>
  sectionRef: RefObject<HTMLElement | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      })
    } catch {
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    camera.position.z = 8
    scene.add(new THREE.HemisphereLight(0xffd6c9, 0x320d08, 3.4))
    const key = new THREE.DirectionalLight(0xffffff, 5.2)
    key.position.set(-4, 5, 6)
    scene.add(key)
    const rim = new THREE.PointLight(0xff8a68, 18, 16)
    rim.position.set(4, -2, 4)
    scene.add(rim)

    let model: LoadedModel | null = null
    let frame = 0
    let active = false
    let disposed = false
    let width = 0
    let height = 0
    const loader = new GLTFLoader()

    const resize = () => {
      const nextWidth = Math.max(1, canvas.clientWidth)
      const nextHeight = Math.max(1, canvas.clientHeight)
      if (nextWidth === width && nextHeight === height) return
      width = nextWidth
      height = nextHeight
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.35))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const render = () => {
      frame = 0
      if (!active || disposed) return
      resize()

      if (model) {
        const progress = progressRef.current
        const intro = smoothstep(0.005, 0.13, progress)
        const outro = smoothstep(0.91, 0.995, progress)
        const portrait = camera.aspect < 0.8
        const parkedX = portrait ? 0.9 : 2.45
        const parkedY = portrait ? 1.65 : 1.45
        const size = THREE.MathUtils.lerp(portrait ? 3.9 : 5.2, portrait ? 2.25 : 2.8, intro)

        placeModel(model, size * (1 - outro * 0.3), {
          x: THREE.MathUtils.lerp(0, parkedX, intro),
          y: THREE.MathUtils.lerp(0.05, parkedY, intro) - outro * 4,
          z: THREE.MathUtils.lerp(-1.8, 0.2, intro),
        })
        model.root.rotation.x = THREE.MathUtils.lerp(1.18, -0.08, intro)
        model.root.rotation.y = progress * Math.PI * 5.5
        model.root.rotation.z = THREE.MathUtils.lerp(-0.22, 0.08, intro) + Math.sin(progress * Math.PI * 10) * 0.035
      }

      renderer.render(scene, camera)
    }

    const start = () => {
      if (frame || !active || disposed) return
      frame = requestAnimationFrame(render)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry?.isIntersecting ?? false
        if (active) start()
        else if (frame) {
          cancelAnimationFrame(frame)
          frame = 0
        }
      },
      { rootMargin: '120px' },
    )
    observer.observe(section)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    window.addEventListener('portfolio:testimonials-update', start)

    void loadModel(loader, '/assets/3d/creative.glb').then((loaded) => {
      if (disposed) {
        loaded.root.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return
          child.geometry.dispose()
          if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose())
          else child.material.dispose()
        })
        return
      }

      const material = new THREE.MeshPhysicalMaterial({
        color: 0x21100d,
        metalness: 0.28,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      })
      loaded.root.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return
        if (Array.isArray(child.material)) child.material.forEach((item) => item.dispose())
        else child.material.dispose()
        child.material = material
      })
      model = loaded
      scene.add(model.root)
      start()
    }).catch(() => undefined)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('portfolio:testimonials-update', start)
      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return
        child.geometry.dispose()
        if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose())
        else child.material.dispose()
      })
      renderer.dispose()
    }
  }, [progressRef, reducedMotion, sectionRef])

  return (
    <canvas
      aria-hidden="true"
      className="testimonials-artifact pointer-events-none absolute inset-0 size-full"
      ref={canvasRef}
    />
  )
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const quoteRefs = useRef<(HTMLLIElement | null)[]>([])
  const counterRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    if (!section) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const distance = Math.max(1, rect.height - innerHeight)
      const progress = clamp01(-rect.top / distance)
      const intro = smoothstep(0, 0.135, progress)
      const reveal = smoothstep(0.095, 0.15, progress) * (1 - smoothstep(0.94, 0.995, progress))
      const quotePosition = clamp01((progress - 0.12) / 0.78) * (testimonials.length - 1)
      const activeIndex = Math.round(quotePosition)

      progressRef.current = progress
      section.style.setProperty('--testimonial-radius', `${(7 + intro * 125).toFixed(2)}%`)
      section.style.setProperty('--testimonial-heading-y', `${(-intro * 24).toFixed(2)}px`)
      section.style.setProperty('--testimonial-heading-opacity', (1 - smoothstep(0.065, 0.145, progress)).toFixed(4))
      section.style.setProperty('--testimonial-counter-opacity', (0.12 + intro * 0.88).toFixed(4))

      quoteRefs.current.forEach((quote, index) => {
        if (!quote) return
        const distanceFromActive = index - quotePosition
        const visibility = clamp01(1 - Math.abs(distanceFromActive)) * reveal
        quote.style.setProperty('--quote-opacity', visibility.toFixed(4))
        quote.style.setProperty('--quote-y', `${(distanceFromActive * 70).toFixed(2)}px`)
        quote.style.setProperty('--quote-scale', (0.96 + visibility * 0.04).toFixed(4))
      })

      if (counterRef.current) {
        counterRef.current.textContent = String(activeIndex + 1).padStart(2, '0')
      }
      window.dispatchEvent(new Event('portfolio:testimonials-update'))
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('portfolio:scroll', schedule)
    window.addEventListener('resize', schedule, { passive: true })
    update()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('portfolio:scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [reducedMotion])

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="testimonials relative z-[2] h-[720svh]"
      id="testimonials"
      ref={sectionRef}
    >
      <div className="testimonials-stage sticky top-0 h-[100svh] overflow-hidden text-[#21100d]">
        <div aria-hidden="true" className="testimonials-wash absolute inset-0 bg-[#e05035]" />
        <TestimonialArtifact progressRef={progressRef} sectionRef={sectionRef} />

        <div className="testimonials-heading pointer-events-none absolute inset-x-[5.8vw] top-[8vh] z-[2] flex items-start justify-between gap-6 max-[760px]:inset-x-[18px] max-[760px]:top-[6vh]">
          <div>
            <p className="m-0 text-[clamp(12px,1vw,15px)] font-bold uppercase tracking-[.18em]">Field notes / 06</p>
            <h2 id="testimonials-heading" className="mt-2 max-w-[8ch] text-[clamp(48px,7vw,118px)] font-black uppercase leading-[.78] tracking-[-.065em] max-[760px]:text-[16vw]">
              Word gets around.
            </h2>
          </div>
          <span className="mt-1 text-[clamp(11px,.9vw,14px)] font-bold uppercase tracking-[.15em]">Keep scrolling ↓</span>
        </div>

        <ol className="testimonials-quotes absolute inset-0 z-[3] m-0 list-none p-0">
          {testimonials.map((testimonial, index) => (
            <li
              className="testimonial-quote absolute inset-x-[5.8vw] top-[30vh] max-w-[min(980px,78vw)] max-[760px]:inset-x-[18px] max-[760px]:top-[34vh] max-[760px]:max-w-none"
              key={testimonial.name}
              ref={(element) => {
                quoteRefs.current[index] = element
              }}
            >
              <figure className="m-0">
                <blockquote className="m-0 text-[clamp(40px,5.15vw,82px)] font-semibold leading-[.94] tracking-[-.055em] max-[760px]:text-[clamp(34px,10.4vw,54px)]">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-[6vh] flex items-end gap-4 border-t-2 border-[#21100d] pt-3 text-[clamp(13px,1.05vw,16px)] font-bold uppercase leading-tight tracking-[.08em] max-[760px]:mt-[4vh]">
                  <span className="text-[clamp(28px,3.2vw,52px)] font-black leading-none tracking-[-.04em]">{String(index + 1).padStart(2, '0')}</span>
                  <span>{testimonial.name}<br /><span className="opacity-60">{testimonial.role}</span></span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <p aria-hidden="true" className="testimonials-counter absolute bottom-[5vh] right-[5.8vw] z-[3] m-0 text-[clamp(68px,10vw,160px)] font-black leading-none tracking-[-.08em] max-[760px]:right-[18px] max-[760px]:bottom-[3vh] max-[760px]:text-[24vw]">
          <span ref={counterRef}>01</span><span className="opacity-35">/06</span>
        </p>
      </div>
    </section>
  )
}

export default TestimonialsSection
