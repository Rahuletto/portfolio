export function AboutSection() {
  return (
    <section
      className="about relative z-[1] grid min-h-[115svh] grid-cols-[4fr_7fr] items-center gap-[8vw] px-[4vw] pt-[20vh] pb-[12vh] max-[760px]:min-h-0 max-[760px]:grid-cols-1 max-[760px]:gap-[10vh] max-[760px]:px-[18px] max-[760px]:py-[16vh]"
      data-dot-transition-start
    >
      <div className="reveal relative aspect-[433/388] w-[min(100%,500px)] overflow-visible max-[760px]:w-[84%]" aria-hidden="true">
        <img
          className="block size-full object-contain"
          src="/assets/about-vector.svg"
          alt=""
        />
      </div>
      <div className="reveal max-w-[900px] text-[clamp(27px,4.2vw,67px)] leading-[1.08] tracking-[-.055em] max-[760px]:text-[7.3vw]">
        <p className="mb-[.7em]">I’m Marban, a full-stack developer, UI/UX designer, and Agentic AI developer building tools that make work more efficient.</p>
        <p className="mb-[.7em] text-[#8e93a0]">I move from <u className="text-[#f4f5f7] underline decoration-1 underline-offset-[.1em]">product thinking</u> and interface design to <u className="text-[#f4f5f7] underline decoration-1 underline-offset-[.1em]">production code</u>, creating thoughtful systems where people and AI work better together.</p>
      </div>
    </section>
  )
}
