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
    let cachedTear = 0
    let startAnchor: HTMLElement | null = null
    let endAnchor: HTMLElement | null = null
    let tearAnchor: HTMLElement | null = null
    let removeTask: (() => void) | null = null

    const recalculateAnchors = () => {
      if (!startAnchor) startAnchor = document.querySelector<HTMLElement>('[data-dot-transition-start]')
      if (!endAnchor) endAnchor = document.querySelector<HTMLElement>('[data-dot-transition-end]')
      if (!tearAnchor) tearAnchor = document.querySelector<HTMLElement>('[data-dot-transition-tear]')
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
      cachedEnd = endTop + endAnchor.offsetHeight * 0.2 - viewportHeight * 0.3

      if (tearAnchor) {
        let tearTop = 0
        cur = tearAnchor
        while (cur) {
          tearTop += cur.offsetTop
          cur = cur.offsetParent as HTMLElement | null
        }
        cachedTear = tearTop + tearAnchor.offsetHeight * 0.6 - viewportHeight * 0.4
      }

      return true
    }

    const update = () => {
      if (cachedStart === 0 || cachedEnd === 0) {
        const ok = recalculateAnchors()
        if (!ok) return
      }

      const scrollY = window.scrollY
      let progress = 0

      if (scrollY <= cachedStart) {
        progress = 0
      } else if (scrollY <= cachedEnd) {
        progress = clamp01((scrollY - cachedStart) / Math.max(cachedEnd - cachedStart, 1))
      } else if (cachedTear > cachedEnd && scrollY > cachedEnd) {
        const tearT = clamp01((scrollY - cachedEnd) / Math.max(cachedTear - cachedEnd, 1))
        progress = 1 - tearT
      } else {
        progress = 1
      }

      if (Math.abs(progress - previousProgress) < 0.001) return
      previousProgress = progress
      layer.style.setProperty('--dot-progress', progress.toFixed(4))
    }

    const onScroll = () => {
      if (!removeTask) {
        removeTask = animEngine.addTask('dotTransition', () => {
          update()
          removeTask = null
          return false
        })
      }
    }

    const onResize = () => {
      recalculateAnchors()
      onScroll()
    }

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
