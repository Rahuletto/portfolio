import { useEffect, useRef } from 'react'
import { animEngine } from '../engine/animEngine.ts'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function BackgroundDotTransition() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    let previousProgress = -1
    let cachedStart = 0
    let cachedEnd = 0
    let startAnchor: HTMLElement | null = null
    let endAnchor: HTMLElement | null = null
    let removeTask: (() => void) | null = null

    const recalculateAnchors = () => {
      if (!startAnchor) startAnchor = document.querySelector<HTMLElement>('[data-dot-transition-start]')
      if (!endAnchor) endAnchor = document.querySelector<HTMLElement>('[data-dot-transition-end]')
      if (!startAnchor || !endAnchor) return false

      const viewportHeight = window.innerHeight
      let startTop = 0
      let cur: HTMLElement | null = startAnchor
      while (cur) {
        startTop += cur.offsetTop
        cur = cur.offsetParent as HTMLElement | null
      }

      let endTop = 0
      cur = endAnchor
      while (cur) {
        endTop += cur.offsetTop
        cur = cur.offsetParent as HTMLElement | null
      }

      cachedStart = startTop + startAnchor.offsetHeight * 0.5 - viewportHeight * 0.5
      cachedEnd = endTop + endAnchor.offsetHeight - viewportHeight * 0.3
      return true
    }

    const update = () => {
      if (cachedStart === 0 || cachedEnd === 0) {
        const ok = recalculateAnchors()
        if (!ok) return
      }

      const progress = clamp01((window.scrollY - cachedStart) / Math.max(cachedEnd - cachedStart, 1))
      if (Math.abs(progress - previousProgress) < 0.001) return
      previousProgress = progress
      layer.style.setProperty('--dot-progress', progress.toFixed(4))
    }

    const onScroll = () => {
      if (!removeTask) {
        removeTask = animEngine.addTask('dotTransition', () => {
          update()
          removeTask = null
          return false // auto remove after 1 frame update
        })
      }
    }

    const onResize = () => {
      recalculateAnchors()
      onScroll()
    }

    // Use MutationObserver so if lazy-loaded sections mount later, anchors are automatically detected
    const mo = new MutationObserver(() => {
      if (recalculateAnchors()) {
        onScroll()
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    recalculateAnchors()
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('portfolio:scroll', onScroll)
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      if (removeTask) removeTask()
      mo.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('portfolio:scroll', onScroll)
      window.removeEventListener('resize', onResize)
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
