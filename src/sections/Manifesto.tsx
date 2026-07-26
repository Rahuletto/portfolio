import { useEffect, useRef, useState } from 'react'
import { Starburst } from '../components/Starburst.tsx'
import { ManifestoSection } from './ManifestoSection.tsx'

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const [stage, setStage] = useState(0)

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
      setStage(progress < 0.22 ? 0 : progress < 0.46 ? 1 : progress < 0.72 ? 2 : 3)
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
      stage={stage}
      Starburst={Starburst}
      progressRef={progressRef}
    />
  )
}

