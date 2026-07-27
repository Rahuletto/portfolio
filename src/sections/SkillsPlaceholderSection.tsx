import { useScrollReveal } from '../hooks/useScrollReveal.ts'

export function SkillsPlaceholderSection() {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section
      className="skills-section relative z-[2] min-h-svh bg-white"
      aria-label="Skills"
      data-scroll-reveal
      ref={sectionRef}
    />
  )
}

