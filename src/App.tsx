import './App.css'
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
    <main className="site relative min-h-screen overflow-x-clip antialiased">
      <GlobalWebGLScene />
      <GridOverlay />

      <aside className="side-progress" aria-hidden="true"><span /></aside>
      <div className="fixed-meta fixed-meta--left">GMT <b>+0530</b> · INDIA</div>

      <HeroSection />
      <AboutSection />
      <ProjectsSection Media={ProjectMedia} />

      <Manifesto />

      <FinaleSection Model={ModelScene} />
    </main>
  )
}

export default App
