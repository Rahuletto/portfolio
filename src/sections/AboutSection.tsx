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
      <div className="about-art reveal group relative aspect-[433/388] w-full max-w-[560px] cursor-pointer justify-self-start overflow-visible max-[900px]:mx-auto max-[900px]:max-w-[420px] max-[900px]:justify-self-center max-[760px]:w-[88%]" aria-label="Rahul Marban portrait artwork">
        <div className="relative size-full overflow-visible transition-all duration-500 ease-out group-hover:scale-[1.03]">
          <div className="relative aspect-[369/368] w-[85.2%] overflow-hidden rounded-[54px] bg-[#1a1919]">
            <img
              className="block size-full object-cover"
              src="/assets/marban-photo.webp"
              alt="Rahul Marban portrait artwork"
            />

            <div className="pointer-events-none absolute inset-0 size-full opacity-100 transition-opacity duration-500 ease-out group-hover:opacity-0">
              <img
                className="block size-full object-cover"
                src="/assets/xray.png"
                alt=""
              />
              <div className="xray-scanline pointer-events-none absolute inset-0 size-full" />
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 z-20 w-[48.4%] aspect-[210/66] transition-transform duration-300 group-hover:scale-[1.04]">
            <img
              className="block size-full object-contain"
              src="/assets/about-pill.svg"
              alt="Rahul Marban signature"
            />
          </div>
        </div>
      </div>
      <div className="about-copy reveal-group w-full max-w-[880px] text-[clamp(23px,3.4vw,52px)] leading-[1.12] tracking-[-.045em] max-[900px]:mx-auto max-[900px]:text-center max-[760px]:text-[6.8vw]">
        <p className="about-line about-line--1 mb-[.65em]">I’m Rahul Marban, a self-taught full-stack developer building on the web since 2020.</p>
        <p className="about-line about-line--2 text-[#8e93a0]">My work spans <span className="text-[#f4f5f7]">developer tools, AI, web recon, and web applications</span>, always with the goal of solving real problems through simple, well-crafted software.</p>
      </div>
    </section>
  )
}
