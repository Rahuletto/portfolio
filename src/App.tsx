import './App.css'
import { BackgroundDotTransition } from './components/BackgroundDotTransition.tsx'
import { GridOverlay } from './components/GridOverlay.tsx'
import { ModelScene } from './components/ModelScene.tsx'
import { ProjectMedia } from './components/ProjectMedia.tsx'
import { GlobalWebGLScene } from './hero/GlobalWebGLScene.tsx'
import { AboutSection } from './sections/AboutSection.tsx'
import { FinaleSection } from './sections/FinaleSection.tsx'
import { HeroSection } from './sections/HeroSection.tsx'
import { Manifesto } from './sections/Manifesto.tsx'
import { ProjectsSection } from './sections/ProjectsSection.tsx'
import { useSmoothScroll } from './useSmoothScroll.ts'

function App() {
  useSmoothScroll()

  return (
    <main className="site relative min-h-screen isolate overflow-clip bg-transparent text-[#f4f5f7] antialiased">
      <GlobalWebGLScene />
      <BackgroundDotTransition />
      <GridOverlay />

      <aside className="side-progress fixed right-6 top-1/2 z-50 h-[120px] w-1 rounded-[10px] border border-white/55 mix-blend-difference max-[760px]:hidden" aria-hidden="true"><span /></aside>
      <div className="fixed-meta pointer-events-none fixed bottom-[26px] left-[5.8vw] z-50 font-mono text-[13px]/none tracking-[.06em] text-white mix-blend-difference max-[760px]:bottom-[18px] max-[760px]:left-[18px] max-[760px]:text-[11px]">GMT <b className="text-[#e05035]">+0530</b> · INDIA</div>

      <HeroSection />
      <AboutSection />
      <ProjectsSection Media={ProjectMedia} />

      <Manifesto />

      <FinaleSection Model={ModelScene} />
    </main>
  )
}

export default App
