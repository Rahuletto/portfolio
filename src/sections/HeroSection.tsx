export function HeroSection() {
  return (
    <section className="hero relative z-[1] min-h-svh isolate bg-transparent" id="top">
      <div className="absolute top-[15.5%] right-[5.8vw] left-[5.8vw] z-[2] grid grid-cols-[2.3fr_1fr] items-start gap-[5vw] text-white/78 max-[760px]:top-[14%] max-[760px]:right-[18px] max-[760px]:left-[18px] max-[760px]:block">
        <h2 className="m-0 text-[clamp(17px,1.4vw,26px)] leading-none font-medium tracking-[-.025em] max-[760px]:hidden">Designer and Developer</h2>
        <p className="m-0 max-w-[390px] text-[clamp(18px,1.55vw,29px)] leading-[1.32] font-[450] tracking-[-.02em] max-[760px]:ml-[51%] max-[760px]:text-[10px]">I’m Marban, a full-stack developer, UI/UX designer, and Agentic AI developer building tools that make work more efficient.</p>
      </div>
      <h1 className="absolute bottom-[9.5%] left-[5.8vw] z-[3] m-0 max-w-[52vw] text-[clamp(42px,3.8vw,70px)] leading-[.98] font-semibold tracking-[-.04em] max-[760px]:bottom-[9%] max-[760px]:left-[18px] max-[760px]:max-w-[calc(100vw-36px)] max-[760px]:text-[13vw]">Being <span className="text-[#e05035]">creative</span> is what<br />makes us human.</h1>
    </section>
  )
}
