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
    <section className="manifesto relative z-[1] h-[520vh] bg-transparent max-[760px]:h-[460vh]" ref={sectionRef}>
      <div className={`manifesto-sticky sticky top-0 grid h-svh place-items-center overflow-hidden isolate stage-${stage}`}>
        <Starburst progressRef={progressRef} />
        <div className="manifesto-line manifesto-line--one absolute inset-0 flex flex-col items-center justify-center text-center text-[clamp(104px,14.5vw,232px)] leading-[.72] font-normal tracking-[-.075em] uppercase max-[760px]:p-3 max-[760px]:text-[21vw] max-[760px]:leading-[.78]">
          <span>Innovate</span><span>with</span><span>purpose</span>
        </div>
        <div className="manifesto-line manifesto-line--two absolute inset-0 flex flex-col items-center justify-center text-center text-[clamp(82px,11.5vw,184px)] leading-[.72] font-normal tracking-[-.075em] uppercase max-[760px]:p-3 max-[760px]:text-[17vw] max-[760px]:leading-[.78]">
          <span>Innovate with</span><span>a human touch</span>
        </div>
        <div className="orbit absolute top-1/2 left-1/2 -z-[1] aspect-square w-[min(54vw,700px)] opacity-0 max-[760px]:w-[92vw]" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <ul className="orbit-notes absolute inset-[14%_8%] m-0 list-none p-0 font-mono text-[11px]/[1.2] uppercase opacity-0 max-[760px]:inset-[13%_5%] max-[760px]:text-[8px]">
          <li>Building tomorrow’s digital products</li>
          <li>Independent by design &amp; engineering</li>
          <li>Clarity first. Delight second.</li>
          <li>Ship in small loops. Aim for long arcs.</li>
        </ul>
        <div className="manifesto-line manifesto-line--three absolute inset-0 flex flex-col items-center justify-center text-center text-[clamp(92px,13vw,208px)] leading-[.72] font-normal tracking-[-.075em] uppercase max-[760px]:p-3 max-[760px]:text-[17vw] max-[760px]:leading-[.78]">
          <span>Future-first</span><span>always</span>
        </div>
      </div>
    </section>
  )
}
