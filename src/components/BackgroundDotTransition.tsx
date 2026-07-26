import { useEffect, useRef } from 'react'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function BackgroundDotTransition() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    const startAnchor = document.querySelector<HTMLElement>('[data-dot-transition-start]')
    const endAnchor = document.querySelector<HTMLElement>('[data-dot-transition-end]')
    if (!layer || !startAnchor || !endAnchor) return

    let frame = 0
    let previousProgress = -1
    const update = () => {
      frame = 0
      const viewportHeight = window.innerHeight
      const start = startAnchor.offsetTop
        + startAnchor.offsetHeight * 0.75
        - viewportHeight * 0.5
      const end = endAnchor.offsetTop - viewportHeight * 0.3
      const progress = clamp01((window.scrollY - start) / Math.max(end - start, 1))
      if (Math.abs(progress - previousProgress) < 0.001) return
      previousProgress = progress
      layer.style.setProperty('--dot-progress', progress.toFixed(4))
    }
    const requestUpdate = () => {
      if (frame === 0) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  return (
    <div
      ref={layerRef}
      className="dot-transition pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
