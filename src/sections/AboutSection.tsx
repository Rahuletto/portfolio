import { useScrollReveal } from '../hooks/useScrollReveal.ts'

export function AboutSection() {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section
      className="about relative z-[1] grid min-h-[110svh] grid-cols-[5fr_7fr] items-center gap-[6vw] px-[5.8vw] pt-[18vh] pb-[14vh] max-[900px]:grid-cols-1 max-[900px]:gap-[8vh] max-[760px]:min-h-0 max-[760px]:px-[18px] max-[760px]:py-[14vh]"
      data-dot-transition-start
      data-scroll-reveal
      ref={sectionRef}
    >
      <div className="about-art reveal relative aspect-[433/388] w-full max-w-[560px] justify-self-start overflow-visible max-[900px]:max-w-[420px] max-[900px]:justify-self-center max-[900px]:mx-auto max-[760px]:w-[88%]" aria-hidden="true">
        <img
          className="block size-full object-contain"
          src="/assets/about-vector.svg"
          alt=""
        />
      </div>
      <div className="about-copy reveal w-full max-w-[880px] text-[clamp(23px,3.4vw,52px)] leading-[1.12] tracking-[-.045em] max-[900px]:mx-auto max-[900px]:text-center max-[760px]:text-[6.8vw]">
        <p className="mb-[.65em]">I’m Rahul Marban, a self-taught full-stack developer building on the web since 2020.</p>
        <p className="text-[#8e93a0]">My work spans <span className="text-[#f4f5f7]">developer tools, AI, and web applications</span>, always with the goal of solving real problems through simple, well-crafted software.</p>
      </div>
    </section>
  )
}
