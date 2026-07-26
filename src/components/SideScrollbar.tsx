import { useEffect, useRef, useState } from 'react'

const PROXIMITY_RANGE = 120
const FADE_DELAY = 1400

export function SideScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const draggingRef = useRef(false)
  const hideTimerRef = useRef(0)
  const nearRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!track || !thumb) return

    const maxScroll = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

    const setThumbPosition = (scrollPx: number) => {
      const maxS = maxScroll()
      const progress = Math.min(1, Math.max(0, scrollPx / maxS))
      const trackHeight = track.clientHeight
      const thumbHeight = 36
      const maxThumbY = Math.max(0, trackHeight - thumbHeight)
      const y = progress * maxThumbY
      thumb.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
    }

    const show = () => {
      setVisible(true)
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = window.setTimeout(() => {
        if (!draggingRef.current && !nearRef.current) setVisible(false)
      }, FADE_DELAY)
    }

    const onNativeScroll = () => {
      setThumbPosition(window.scrollY || document.documentElement.scrollTop)
      show()
    }

    const onSmoothScroll = (event: Event) => {
      const scroll = (event as CustomEvent<number>).detail
      if (typeof scroll === 'number' && Number.isFinite(scroll)) {
        setThumbPosition(scroll)
        show()
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (draggingRef.current) return
      const trackRect = track.getBoundingClientRect()
      const distance = Math.abs(
        event.clientX - trackRect.left - trackRect.width / 2,
      )
      const wasNear = nearRef.current
      nearRef.current = distance < PROXIMITY_RANGE
      if (nearRef.current) {
        show()
      } else if (wasNear) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = window.setTimeout(() => {
          if (!draggingRef.current && !nearRef.current) setVisible(false)
        }, FADE_DELAY)
      }
    }

    const scrollToPointer = (clientY: number) => {
      const trackRect = track.getBoundingClientRect()
      const trackHeight = trackRect.height
      const thumbHeight = 36
      const usable = Math.max(1, trackHeight - thumbHeight)
      const relativeY = clientY - trackRect.top - thumbHeight / 2
      const progress = Math.min(1, Math.max(0, relativeY / usable))
      const target = progress * maxScroll()

      setThumbPosition(target)
      window.dispatchEvent(
        new CustomEvent('portfolio:scroll-to', {
          detail: { target, immediate: false },
        }),
      )
    }

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault()
      draggingRef.current = true
      setVisible(true)
      clearTimeout(hideTimerRef.current)
      scrollToPointer(event.clientY)
      const onMove = (e: PointerEvent) => scrollToPointer(e.clientY)
      const onUp = () => {
        draggingRef.current = false
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        hideTimerRef.current = window.setTimeout(
          () => {
            if (!nearRef.current) setVisible(false)
          },
          FADE_DELAY,
        )
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    }

    const onResize = () => {
      setThumbPosition(window.scrollY || document.documentElement.scrollTop)
    }

    window.addEventListener('scroll', onNativeScroll, { passive: true })
    window.addEventListener('portfolio:scroll', onSmoothScroll)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    track.addEventListener('pointerdown', onPointerDown)
    onNativeScroll()

    return () => {
      window.removeEventListener('scroll', onNativeScroll)
      window.removeEventListener('portfolio:scroll', onSmoothScroll)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
      track.removeEventListener('pointerdown', onPointerDown)
      clearTimeout(hideTimerRef.current)
    }
  }, [])

  return (
    <div
      ref={trackRef}
      className="side-scrollbar fixed right-5 top-1/2 z-50 h-[200px] w-2 -translate-y-1/2 cursor-pointer select-none rounded-full bg-white/15 backdrop-blur-xs transition-opacity duration-300 max-[760px]:hidden"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        ref={thumbRef}
        className="absolute left-0 w-full rounded-full bg-white/90 shadow-none transition-colors duration-150 active:cursor-grabbing"
        style={{ height: 36, willChange: 'transform' }}
      />
    </div>
  )
}
