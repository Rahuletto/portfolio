import { useEffect, useRef } from 'react'
import { Starburst } from '../components/Starburst.tsx'
import { useScrollReveal } from '../hooks/useScrollReveal.ts'
import { ManifestoSection } from './ManifestoSection.tsx'

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  useScrollReveal(sectionRef)

  useEffect(() => {
    let frame = 0
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
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
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
