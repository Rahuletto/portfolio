import { useEffect, useRef } from 'react'
import { animEngine } from '../engine/animEngine.ts'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function BackgroundDotTransition() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    let startAnchor: HTMLElement | null = null
    let endAnchor: HTMLElement | null = null
    let vanishAnchor: HTMLElement | null = null

    let currentProgress = 0
    let targetProgress = 0

    let cachedStart = 0
    let cachedEnd = 0
    let cachedVanishStart = 0
    let cachedVanishEnd = 0
    let removeTask: (() => void) | null = null
    let initialized = false
    let lastRadius = ''
    let lastOpacity = ''

    const findAnchors = () => {
      startAnchor ??= document.querySelector<HTMLElement>('[data-dot-transition-start]')
      endAnchor ??= document.querySelector<HTMLElement>('[data-dot-transition-end]')
      vanishAnchor ??= document.querySelector<HTMLElement>('[data-dot-transition-vanish]')
      return !!startAnchor && !!endAnchor
    }

    const documentTop = (element: HTMLElement) => (
      element.getBoundingClientRect().top + window.scrollY
    )

    const recalculateAnchors = () => {
      if (!findAnchors() || !startAnchor || !endAnchor) return false

      const viewportHeight = window.innerHeight
      cachedStart = documentTop(startAnchor)
        + startAnchor.offsetHeight * 0.75
        - viewportHeight * 0.5
      cachedEnd = documentTop(endAnchor) - viewportHeight * 0.3

      if (vanishAnchor) {
        cachedVanishStart = documentTop(vanishAnchor) - viewportHeight * 0.82
        cachedVanishEnd = documentTop(vanishAnchor) - viewportHeight * 0.45
      }

      return true
    }

    const renderProgress = (progress: number) => {
      const radius = `${(0.8 + progress * 5.2).toFixed(2)}px`
      const opacity = clamp01(progress * 8).toFixed(4)
      if (radius !== lastRadius) {
        lastRadius = radius
        layer.style.setProperty('--dot-radius', radius)
      }
      if (opacity !== lastOpacity) {
        lastOpacity = opacity
        layer.style.setProperty('--dot-opacity', opacity)
      }
    }

    const wakeAnimation = () => {
      if (removeTask || Math.abs(targetProgress - currentProgress) <= 0.0005) return

      removeTask = animEngine.addTask('dot-bg-transition-lerp', (dt) => {
        if (Math.abs(targetProgress - currentProgress) > 0.0005) {
          const smoothing = 1 - Math.exp(-dt * 11)
          currentProgress += (targetProgress - currentProgress) * smoothing
          renderProgress(currentProgress)
          return true
        }

        currentProgress = targetProgress
        renderProgress(currentProgress)
        removeTask = null
        return false
      })
    }

    const calculateTarget = () => {
      if (!startAnchor || !endAnchor) return
      const scrollY = window.scrollY

      if (scrollY < cachedStart) {
        targetProgress = 0
      } else if (scrollY <= cachedEnd) {
        targetProgress = clamp01((scrollY - cachedStart) / Math.max(cachedEnd - cachedStart, 1))
      } else if (!vanishAnchor || scrollY <= cachedVanishStart) {
        targetProgress = 1
      } else if (scrollY <= cachedVanishEnd) {
        const vanishRange = Math.max(cachedVanishEnd - cachedVanishStart, 1)
        targetProgress = 1 - clamp01((scrollY - cachedVanishStart) / vanishRange)
      } else {
        targetProgress = 0
      }

      if (initialized) wakeAnimation()
    }

    const updateLayout = () => {
      if (recalculateAnchors()) calculateTarget()
    }

    updateLayout()
    currentProgress = targetProgress
    renderProgress(currentProgress)
    initialized = true

    const onScroll = () => calculateTarget()
    const mutationObserver = new MutationObserver(() => {
      if (!findAnchors()) return
      updateLayout()
      if (vanishAnchor) mutationObserver.disconnect()
    })
    const resizeObserver = new ResizeObserver(updateLayout)
    if (!startAnchor || !endAnchor || !vanishAnchor) {
      mutationObserver.observe(document.body, { childList: true, subtree: true })
    }
    resizeObserver.observe(document.body)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('portfolio:scroll', onScroll)
    window.addEventListener('resize', updateLayout, { passive: true })
    window.addEventListener('load', updateLayout)

    return () => {
      removeTask?.()
      removeTask = null
      mutationObserver.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('portfolio:scroll', onScroll)
      window.removeEventListener('resize', updateLayout)
      window.removeEventListener('load', updateLayout)
    }
  }, [])

  return (
    <div
      ref={layerRef}
      className="dot-transition pointer-events-none fixed inset-0 z-0 h-[100lvh] w-full"
      aria-hidden="true"
    />
  )
}
