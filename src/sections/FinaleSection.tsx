import type { ComponentType } from 'react'

type ModelSceneProps = {
  model: string
  variant: 'hello' | 'cursor' | 'finale'
}

type FinaleSectionProps = {
  Model: ComponentType<ModelSceneProps>
}

export function FinaleSection({ Model }: FinaleSectionProps) {
  return (
    <footer className="finale relative z-[1] flex min-h-[120svh] flex-col justify-center px-[4vw] pt-[14vh] pb-[5vh] isolate bg-transparent max-[760px]:min-h-svh max-[760px]:px-[18px] max-[760px]:pt-[15vh] max-[760px]:pb-[28px]" id="contact">
      <Model model="/assets/025-cnt.gltf" variant="finale" />
      <h2 className="relative z-[2] m-0 text-[clamp(52px,9vw,148px)] leading-[.79] tracking-[-.08em] uppercase max-[760px]:text-[14vw]">Let’s create<br />something<br /><span className="text-[#e05035]">extraordinary</span></h2>
      <p className="relative z-[2] mt-[8vh] self-start font-mono text-[14px]/none uppercase max-[760px]:text-[10px]">Available for ambitious work ↗</p>
      <div className="relative z-[2] mt-auto flex items-end justify-between pt-[18vh] font-mono text-[11px]/[1.3] uppercase max-[760px]:block max-[760px]:pt-[24vh]">
        <p className="m-0">DESIGN · CODE · AI<br />MARBAN © 2026</p>
        <div className="flex gap-[3vw] max-[760px]:mt-7 max-[760px]:justify-between max-[760px]:gap-[10px]">
          <a className="border-b border-current py-2" href="#top">Home</a>
          <a className="border-b border-current py-2" href="#work">Work</a>
          <a className="border-b border-current py-2" href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  )
}
