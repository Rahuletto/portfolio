import { useEffect, useRef, type RefObject } from 'react'

// Pure IntersectionObserver — zero scroll listeners, zero rAF during scroll,
// zero getBoundingClientRect calls. Parallax removed as it was the main
// source of continuous main-thread work during scroll.
export function useScrollReveal<T extends HTMLElement>(
  externalRef?: RefObject<T | null>,
): RefObject<T | null> {
  const internalRef = useRef<T>(null)
  const ref = externalRef ?? internalRef

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reducedMotion.matches) {
      el.dataset.revealVisible = 'true'
      return
    }

    const observer = new IntersectionObserver(
      ([io]) => {
        el.dataset.revealVisible = (io?.isIntersecting ?? false) ? 'true' : 'false'
      },
      { rootMargin: '-5% 0px -5%', threshold: 0.08 },
    )

    el.dataset.revealReady = 'true'
    observer.observe(el)

    const onMotion = () => {
      if (!reducedMotion.matches) return
      el.dataset.revealVisible = 'true'
      observer.disconnect()
    }
    reducedMotion.addEventListener('change', onMotion)

    return () => {
      observer.disconnect()
      reducedMotion.removeEventListener('change', onMotion)
    }
  }, [ref])

  return ref
}
