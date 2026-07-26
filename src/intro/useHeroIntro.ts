import { useCallback, useEffect, useRef, useState } from 'react'

export type HeroIntroPhase =
  | 'loading'
  | 'loader-exit'
  | 'revealing'
  | 'complete'

export type HeroIntroState = {
  phase: HeroIntroPhase
  loadProgress: number
  loadProgressRef: React.RefObject<number>
  revealProgress: number
  introProgressRef: React.RefObject<number>
  interactionReadyRef: React.RefObject<boolean>
  reportAssetsReady: () => void
}

const LOAD_FINISH_MS = 550
const LOADER_EXIT_MS = 650
const REVEAL_MS = 1600
const REDUCED_REVEAL_MS = 160

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function useHeroIntro(): HeroIntroState {
  const [assetsReady, setAssetsReady] = useState(false)
  const [phase, setPhase] = useState<HeroIntroPhase>('loading')
  const [loadProgress, setLoadProgress] = useState(0)
  const [revealProgress, setRevealProgress] = useState(0)
  const loadProgressRef = useRef(0)
  const introProgressRef = useRef(0)
  const interactionReadyRef = useRef(false)
  const displayedLoadRef = useRef(0)

  const reportAssetsReady = useCallback(() => {
    setAssetsReady(true)
  }, [])



  useEffect(() => {
    if (assetsReady) return

    // Fallback safety timeout if asset loading hangs
    const timer = window.setTimeout(() => {
      setAssetsReady(true)
    }, 3000)

    const startedAt = performance.now()
    let frame = 0

    const update = (now: number) => {
      const elapsed = now - startedAt
      const next = Math.min(0.94, 1 - Math.exp(-elapsed / 780))
      displayedLoadRef.current = Math.max(displayedLoadRef.current, next)
      loadProgressRef.current = displayedLoadRef.current
      setLoadProgress(displayedLoadRef.current)
      frame = requestAnimationFrame(update)
    }

    frame = requestAnimationFrame(update)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [assetsReady])

  useEffect(() => {
    if (!assetsReady) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const startedAt = performance.now()
    const initialLoad = displayedLoadRef.current
    const revealDuration = reducedMotion ? REDUCED_REVEAL_MS : REVEAL_MS
    const exitDuration = reducedMotion ? 80 : LOADER_EXIT_MS
    let frame = 0

    const update = (now: number) => {
      const elapsed = now - startedAt
      const loadT = clamp01(elapsed / LOAD_FINISH_MS)
      const nextLoad = initialLoad + (1 - initialLoad) * loadT
      displayedLoadRef.current = nextLoad
      setLoadProgress(nextLoad)

      if (elapsed < LOAD_FINISH_MS) {
        setPhase('loading')
      } else if (elapsed < LOAD_FINISH_MS + exitDuration) {
        setPhase('loader-exit')
      } else {
        const revealElapsed = elapsed - LOAD_FINISH_MS - exitDuration
        const nextReveal = clamp01(revealElapsed / revealDuration)
        const easedReveal = 1 - Math.pow(1 - nextReveal, 3)

        introProgressRef.current = reducedMotion ? 1 : easedReveal

        if (nextReveal >= 1) {
          setRevealProgress(1)
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

  useEffect(() => {
    if (phase === 'complete') return

    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [phase])

  return {
    phase,
    loadProgress,
    loadProgressRef,
    revealProgress,
    introProgressRef,
    interactionReadyRef,
    reportAssetsReady,
  }
}
