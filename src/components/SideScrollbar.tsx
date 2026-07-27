import { useEffect, useRef, useState } from 'react'

const FADE_DELAY = 1400

export function SideScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const draggingRef = useRef(false)
  const hideTimerRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!track || !thumb) return

    let maxScroll = 1
    const updateMaxScroll = () => {
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    }

    const updateThumb = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll))
      const trackHeight = 200
      const thumbHeight = 36
      const y = progress * (trackHeight - thumbHeight)
      thumb.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`

      setVisible(true)
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = window.setTimeout(() => {
        if (!draggingRef.current) setVisible(false)
      }, FADE_DELAY)
    }

    const scrollToPointer = (clientY: number) => {
      const rect = track.getBoundingClientRect()
      const thumbHeight = 36
      const relativeY = clientY - rect.top - thumbHeight / 2
      const progress = Math.min(1, Math.max(0, relativeY / (rect.height - thumbHeight)))
      const targetScroll = progress * maxScroll

      window.scrollTo({ top: targetScroll, behavior: 'auto' })
      updateThumb()
    }

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      draggingRef.current = true
      setVisible(true)
      scrollToPointer(e.clientY)

      const onMove = (moveEvt: PointerEvent) => scrollToPointer(moveEvt.clientY)
      const onUp = () => {
        draggingRef.current = false
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        hideTimerRef.current = window.setTimeout(() => setVisible(false), FADE_DELAY)
      }

      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerup', onUp, { passive: true })
    }

    const onResize = () => {
      updateMaxScroll()
      updateThumb()
    }

    updateMaxScroll()
    window.addEventListener('scroll', updateThumb, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    track.addEventListener('pointerdown', onPointerDown)

    return () => {
      window.removeEventListener('scroll', updateThumb)
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
