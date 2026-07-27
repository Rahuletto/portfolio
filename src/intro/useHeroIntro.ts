import { useCallback, useEffect, useRef, useState } from 'react'

export type HeroIntroPhase =
  | 'loading'
  | 'loader-exit'
  | 'revealing'
  | 'complete'

export type HeroIntroState = {
  phase: HeroIntroPhase
  loadProgressRef: React.RefObject<number>
  introProgressRef: React.RefObject<number>
  interactionReadyRef: React.RefObject<boolean>
  reportAssetsReady: () => void
}

const LOAD_FINISH_MS  = 550
const LOADER_EXIT_MS  = 650
const REVEAL_MS       = 1600
const REDUCED_REVEAL_MS = 160

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export function useHeroIntro(): HeroIntroState {
  const [assetsReady, setAssetsReady] = useState(false)
  const [phase, setPhase] = useState<HeroIntroPhase>('loading')

  // All progress is kept in refs — never triggers React renders
  const loadProgressRef    = useRef(0)
  const introProgressRef   = useRef(0)
  const interactionReadyRef = useRef(false)
  const displayedLoadRef   = useRef(0)

  const reportAssetsReady = useCallback(() => setAssetsReady(true), [])

  // Phase 1: animate load ref (no setState — zero re-renders per frame)
  useEffect(() => {
    if (assetsReady) return
    const timer = window.setTimeout(() => setAssetsReady(true), 3000)
    const startedAt = performance.now()
    let frame = 0
    const update = (now: number) => {
      const next = Math.min(0.94, 1 - Math.exp(-(now - startedAt) / 780))
      displayedLoadRef.current  = Math.max(displayedLoadRef.current, next)
      loadProgressRef.current   = displayedLoadRef.current
      frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => { clearTimeout(timer); cancelAnimationFrame(frame) }
  }, [assetsReady])

  // Phase 2: drive intro phases after assets ready (phase changes are infrequent)
  useEffect(() => {
    if (!assetsReady) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const startedAt     = performance.now()
    const initialLoad   = displayedLoadRef.current
    const revealDuration = reducedMotion ? REDUCED_REVEAL_MS : REVEAL_MS
    const exitDuration   = reducedMotion ? 80 : LOADER_EXIT_MS
    let frame = 0

    const update = (now: number) => {
      const elapsed = now - startedAt
      const loadT   = clamp01(elapsed / LOAD_FINISH_MS)
      displayedLoadRef.current = initialLoad + (1 - initialLoad) * loadT
      loadProgressRef.current  = displayedLoadRef.current

      if (elapsed < LOAD_FINISH_MS) {
        setPhase('loading')
      } else if (elapsed < LOAD_FINISH_MS + exitDuration) {
        setPhase('loader-exit')
      } else {
        const revealElapsed = elapsed - LOAD_FINISH_MS - exitDuration
        const nextReveal    = clamp01(revealElapsed / revealDuration)
        introProgressRef.current = reducedMotion ? 1 : 1 - Math.pow(1 - nextReveal, 3)

        if (nextReveal >= 1) {
          setPhase('complete')
          interactionReadyRef.current = true
          return
        }
        setPhase('revealing')
      }
      frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [assetsReady])

  // Lock scroll during intro
  useEffect(() => {
    if (phase === 'complete') return
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const preventScroll = (e: Event) => {
      e.preventDefault()
    }

    const preventScrollKeys = (e: KeyboardEvent) => {
      const keys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End']
      if (keys.includes(e.code) || keys.includes(e.key)) {
        e.preventDefault()
      }
    }

    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
    window.addEventListener('keydown', preventScrollKeys, { passive: false })

    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('keydown', preventScrollKeys)
    }
  }, [phase])

  return { phase, loadProgressRef, introProgressRef, interactionReadyRef, reportAssetsReady }
}
