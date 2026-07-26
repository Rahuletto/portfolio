import { useEffect } from 'react'
import Lenis from 'lenis'

export function useSmoothScroll(): void {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.15,
    })
    const onLenisScroll = ({ scroll }: { scroll: number }) => {
      window.dispatchEvent(new CustomEvent('portfolio:scroll', {
        detail: scroll,
      }))
    }
    lenis.on('scroll', onLenisScroll)

    let frame = 0
    const animate = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(animate)
    }

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return

      const selector = anchor.getAttribute('href')
      if (!selector || selector === '#') return
      const section = document.querySelector<HTMLElement>(selector)
      if (!section) return

      event.preventDefault()
      lenis.scrollTo(section, {
        offset: 0,
        duration: 1.25,
        easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
      })
    }

    document.addEventListener('click', onAnchorClick)
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('click', onAnchorClick)
      lenis.off('scroll', onLenisScroll)
      lenis.destroy()
    }
  }, [])
}
