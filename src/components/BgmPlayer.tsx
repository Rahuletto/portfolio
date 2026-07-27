import { useCallback, useEffect, useRef } from 'react'

const DEFAULT_VOLUME = 0.35

export function BgmPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<number | null>(null)
  const isStartingRef = useRef<boolean>(false)

  const stopFade = useCallback(() => {
    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current)
      fadeIntervalRef.current = null
    }
  }, [])

  const fadeVolumeTo = useCallback(
    (targetVol: number, durationMs = 600) => {
      const audio = audioRef.current
      if (!audio) return

      stopFade()
      const startVol = audio.volume
      const startTime = performance.now()

      fadeIntervalRef.current = window.setInterval(() => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(1, elapsed / durationMs)
        const current = startVol + (targetVol - startVol) * progress
        audio.volume = Math.max(0, Math.min(1, current))

        if (progress >= 1) {
          stopFade()
        }
      }, 20)
    },
    [stopFade]
  )

  const playAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused || isStartingRef.current) return

    isStartingRef.current = true
    audio.loop = true

    if (audio.currentTime === 0 || audio.volume === 0) {
      audio.volume = 0
    }

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isStartingRef.current = false
          fadeVolumeTo(DEFAULT_VOLUME)
        })
        .catch((err) => {
          isStartingRef.current = false
          console.warn('Autoplay waiting for user gesture:', err)
        })
    } else {
      isStartingRef.current = false
    }
  }, [fadeVolumeTo])

  const handleEnded = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch((err) => {
      console.warn('Loop replay failed:', err)
    })
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.loop = true
    }

    const handleUserInteraction = () => {
      const a = audioRef.current
      if (a && a.paused) {
        playAudio()
      }
    }

    playAudio()

    const events = ['pointerdown', 'click', 'keydown', 'scroll', 'touchstart']
    events.forEach((evt) => window.addEventListener(evt, handleUserInteraction, { passive: true }))

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleUserInteraction))
    }
  }, [playAudio])

  return (
    <audio
      ref={audioRef}
      loop
      preload="auto"
      onEnded={handleEnded}
      className="hidden"
      aria-hidden="true"
    >
      <source src="/audio/bgm-loop.mp3" type="audio/mpeg" />
      <source src="/audio/bgm-loop.wav" type="audio/wav" />
    </audio>
  )
}

