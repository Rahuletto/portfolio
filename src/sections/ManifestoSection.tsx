import type { ComponentType, MutableRefObject, RefObject } from 'react'

type ManifestoSectionProps = {
  sectionRef: RefObject<HTMLElement | null>
  stage: number
  Starburst: ComponentType<{
    progressRef: MutableRefObject<number>
  }>
  progressRef: MutableRefObject<number>
}

export function ManifestoSection({
  sectionRef,
  stage,
  Starburst,
  progressRef,
}: ManifestoSectionProps) {
  return (
    <section className="manifesto" ref={sectionRef}>
      <div className={`manifesto-sticky stage-${stage}`}>
        <Starburst progressRef={progressRef} />
        <div className="manifesto-line manifesto-line--one">
          <span>Innovate</span><span>with</span><span>purpose</span>
        </div>
        <div className="manifesto-line manifesto-line--two">
          <span>Innovate with</span><span>a human touch</span>
        </div>
        <div className="orbit" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <ul className="orbit-notes">
          <li>Building tomorrow’s digital products</li>
          <li>Independent by design &amp; engineering</li>
          <li>Clarity first. Delight second.</li>
          <li>Ship in small loops. Aim for long arcs.</li>
        </ul>
        <div className="manifesto-line manifesto-line--three">
          <span>Future-first</span><span>always</span>
        </div>
      </div>
    </section>
  )
}
