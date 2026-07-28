export function HeroSection() {
  return (
    <section className="hero relative z-[1] min-h-svh isolate bg-transparent" id="top" aria-labelledby="hero-title">
      <div className="hero-meta absolute top-[7vh] right-[5.8vw] left-[5.8vw] z-[2] grid grid-cols-[2.3fr_1fr] items-start gap-[5vw] text-white/78 max-[760px]:top-[6vh] max-[760px]:right-[18px] max-[760px]:left-[18px] max-[760px]:block">
        <p className="hero-copy hero-copy--eyebrow m-0 text-[clamp(17px,1.4vw,26px)] leading-none font-medium tracking-[-.025em] max-[760px]:hidden">
          <span className="block overflow-hidden pb-[0.15em] -mb-[0.15em]">
            <span className="block">Designer and Developer</span>
          </span>
        </p>
        <p className="hero-copy hero-copy--intro m-0 max-w-[410px] text-[clamp(18px,1.55vw,29px)] leading-[1.32] font-[450] tracking-[-.02em] max-[760px]:ml-0 max-[760px]:text-left max-[760px]:max-w-[calc(100vw-36px)] max-[760px]:text-[clamp(18px,5vw,24px)] max-[760px]:leading-[1.32]">
          <span className="block overflow-hidden"><span className="block">I’m Marban, a full-stack developer,</span></span>
          <span className="block overflow-hidden"><span className="block">UI/UX designer, and Agentic AI</span></span>
          <span className="block overflow-hidden"><span className="block">developer building tools that make</span></span>
          <span className="block overflow-hidden"><span className="block">work more efficient.</span></span>
        </p>
      </div>
      <h1 id="hero-title" className="hero-title hero-copy hero-copy--statement absolute bottom-[14vh] left-[5.8vw] z-[3] m-0 max-w-[52vw] text-[clamp(42px,3.8vw,70px)] leading-[1.05] font-semibold tracking-[-.04em] max-[760px]:bottom-[12vh] max-[760px]:left-[18px] max-[760px]:max-w-[calc(100vw-36px)] max-[760px]:text-[13vw]">
        <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <span className="block">Being <span className="hero-copy__accent text-[#e05035]">creative</span> is what</span>
        </span>
        <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <span className="block">makes us human.</span>
        </span>
      </h1>
    </section>
  )
}
