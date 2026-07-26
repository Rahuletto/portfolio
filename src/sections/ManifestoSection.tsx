import type { ComponentType, MutableRefObject, RefObject } from 'react'

type ManifestoSectionProps = {
  sectionRef: RefObject<HTMLElement | null>
  Starburst: ComponentType<{
    progressRef: MutableRefObject<number>
  }>
  progressRef: MutableRefObject<number>
}

export function ManifestoSection({
  sectionRef,
  Starburst,
  progressRef,
}: ManifestoSectionProps) {
  return (
    <section className="manifesto relative z-[2] h-[145vh] bg-[#141314] max-[760px]:h-[135vh]" data-scroll-reveal ref={sectionRef}>
      <div className="manifesto-sticky sticky top-0 grid h-svh place-items-center overflow-hidden bg-[#141314] isolate">
        <Starburst progressRef={progressRef} />
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-white opacity-[clamp(0,calc((var(--manifest-progress)-.68)*3.125),1)]"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
