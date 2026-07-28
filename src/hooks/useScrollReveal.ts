import {
  useEffect,
  useRef,
  type RefObject,
} from 'react'
import { getElementScrollProgress } from './scrollProgress.ts'

export function useScrollReveal<T extends HTMLElement>(
  externalRef?: RefObject<T | null>,
  revealOnce = false,
): RefObject<T | null> {
  const internalRef = useRef<T>(null)
  const ref = externalRef ?? internalRef

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let active = true
    let hasRevealed = false
    let cachedTop = 0
    let cachedHeight = 0

    const measure = () => {
      let top = 0
      let cur: HTMLElement | null = element
      while (cur) {
        top += cur.offsetTop
        cur = cur.offsetParent as HTMLElement | null
      }
      cachedTop = top
      cachedHeight = element.offsetHeight
    }

    const update = () => {
      frame = 0
      if (!active && !reducedMotion.matches) return

      if (cachedHeight === 0) measure()
      const topInViewport = cachedTop - window.scrollY
      const progress = reducedMotion.matches
        ? 1
        : getElementScrollProgress(
            topInViewport,
            cachedHeight,
            window.innerHeight,
          )
      const parallax = reducedMotion.matches ? 0 : (0.5 - progress) * 22
      element.style.setProperty('--reveal-progress', progress.toFixed(4))
      element.style.setProperty('--reveal-parallax-y', `${parallax.toFixed(2)}px`)

      if (reducedMotion.matches) {
        element.dataset.revealVisible = 'true'
      }
    }

    const schedule = () => {
      if (frame !== 0) return
      frame = requestAnimationFrame(update)
    }

    const onResize = () => {
      measure()
      schedule()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry?.isIntersecting ?? false
        active = isIntersecting
        if (isIntersecting) hasRevealed = true
        element.dataset.revealVisible = (
          isIntersecting || (revealOnce && hasRevealed)
        ) ? 'true' : 'false'
        if (isIntersecting) {
          measure()
          schedule()
        }
      },
      {
        rootMargin: '-5% 0px -5%',
        threshold: 0.08,
      },
    )

    element.dataset.revealReady = 'true'
    observer.observe(element)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('portfolio:scroll', schedule)
    window.addEventListener('resize', onResize, { passive: true })
    reducedMotion.addEventListener('change', schedule)
    measure()
    update()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('portfolio:scroll', schedule)
      window.removeEventListener('resize', onResize)
      reducedMotion.removeEventListener('change', schedule)
    }
  }, [ref, revealOnce])

  return ref
}
