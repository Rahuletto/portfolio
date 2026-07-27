import { useEffect, useRef } from 'react'
import { Starburst } from '../components/Starburst.tsx'
import { useScrollReveal } from '../hooks/useScrollReveal.ts'
import { ManifestoSection } from './ManifestoSection.tsx'
import { animEngine } from '../engine/animEngine.ts'

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  useScrollReveal(sectionRef)

  useEffect(() => {
    let removeTask: (() => void) | null = null

    const update = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(1, Math.max(0, -rect.top / distance))
      progressRef.current = progress
      section.style.setProperty('--manifest-progress', progress.toFixed(4))
    }

    const onScroll = () => {
      if (!removeTask) {
        removeTask = animEngine.addTask('manifestoUpdate', () => {
          update()
          removeTask = null
          return false
        })
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (removeTask) removeTask()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <ManifestoSection
      sectionRef={sectionRef}
      Starburst={Starburst}
      progressRef={progressRef}
    />
  )
}
