import { useEffect } from 'react'
import Lenis from 'lenis'
import { animEngine } from './engine/animEngine.ts'

export function useSmoothScroll(enabled: boolean = true): void {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.15,
    })

    let isScrolling = false
    let removeTask: (() => void) | null = null

    const wakeLenis = () => {
      if (removeTask) return
      removeTask = animEngine.addTask('lenisScroll', (_dt, now) => {
        lenis.raf(now)
        if (lenis.isScrolling || isScrolling) return true
        removeTask = null
        return false
      })
    }

    if (!enabled) {
      lenis.stop()
    } else {
      lenis.start()
      wakeLenis()
    }

    const onLenisScroll = ({ scroll }: { scroll: number }) => {
      window.dispatchEvent(new CustomEvent('portfolio:scroll', {
        detail: scroll,
      }))
    }
    lenis.on('scroll', onLenisScroll)

    const onWheelOrTouch = () => {
      isScrolling = true
      wakeLenis()
      clearTimeout(scrollTimeout)
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false
      }, 300)
    }

    let scrollTimeout = 0
    window.addEventListener('wheel', onWheelOrTouch, { passive: true })
    window.addEventListener('touchmove', onWheelOrTouch, { passive: true })

    const onScrollTo = (event: Event) => {
      if (!enabled) return
      const detail = (event as CustomEvent<number | { target: number; immediate?: boolean }>).detail
      const target = typeof detail === 'number' ? detail : detail?.target
      const immediate = typeof detail === 'object' ? !!detail.immediate : false
      if (typeof target !== 'number' || !Number.isFinite(target)) return
      wakeLenis()
      lenis.scrollTo(target, {
        immediate,
        duration: immediate ? 0 : 0.75,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    }

    const onAnchorClick = (event: MouseEvent) => {
      if (!enabled) return
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return

      const selector = anchor.getAttribute('href')
      if (!selector || selector === '#') return
      const section = document.querySelector<HTMLElement>(selector)
      if (!section) return

      event.preventDefault()
      wakeLenis()
      lenis.scrollTo(section, {
        offset: 0,
        duration: 1.25,
        easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
      })
    }

    document.addEventListener('click', onAnchorClick)
    window.addEventListener('portfolio:scroll-to', onScrollTo)

    return () => {
      if (removeTask) removeTask()
      clearTimeout(scrollTimeout)
      window.removeEventListener('wheel', onWheelOrTouch)
      window.removeEventListener('touchmove', onWheelOrTouch)
      document.removeEventListener('click', onAnchorClick)
      window.removeEventListener('portfolio:scroll-to', onScrollTo)
      lenis.off('scroll', onLenisScroll)
      lenis.destroy()
    }
  }, [enabled])
}
