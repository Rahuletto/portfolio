import {
  useEffect,
  useRef,
  type RefObject,
} from 'react'
import { getElementScrollProgress } from './scrollProgress.ts'

export function useScrollReveal<T extends HTMLElement>(
  externalRef?: RefObject<T | null>,
): RefObject<T | null> {
  const internalRef = useRef<T>(null)
  const ref = externalRef ?? internalRef

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let active = true

    const update = () => {
      frame = 0
      if (!active && !reducedMotion.matches) return

      const rect = element.getBoundingClientRect()
      const progress = reducedMotion.matches
        ? 1
        : getElementScrollProgress(
            rect.top,
            rect.height,
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry?.isIntersecting ?? false
        active = isIntersecting
        element.dataset.revealVisible = isIntersecting ? 'true' : 'false'
        if (isIntersecting) {
          element.style.setProperty('--reveal-progress', '1')
          element.style.setProperty('--reveal-parallax-y', '0px')
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
    window.addEventListener('resize', schedule, { passive: true })
    reducedMotion.addEventListener('change', schedule)
    update()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('portfolio:scroll', schedule)
      window.removeEventListener('resize', schedule)
      reducedMotion.removeEventListener('change', schedule)
    }
  }, [ref])

  return ref
}
