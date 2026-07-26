import { lazy, Suspense } from 'react'
import './App.css'
import { GridOverlay } from './components/GridOverlay.tsx'
import { SideScrollbar } from './components/SideScrollbar.tsx'
import { HeroIntroOverlay } from './intro/HeroIntroOverlay.tsx'
import { useHeroIntro } from './intro/useHeroIntro.ts'
import { HeroSection } from './sections/HeroSection.tsx'
import { useSmoothScroll } from './useSmoothScroll.ts'
const BackgroundDotTransition = lazy(async () => {
  const m = await import('./components/BackgroundDotTransition.tsx')
  return { default: m.BackgroundDotTransition }
})
const AboutSection = lazy(async () => {
  const m = await import('./sections/AboutSection.tsx')
  return { default: m.AboutSection }
})
const ProjectsSection = lazy(async () => {
  const m = await import('./sections/ProjectsSection.tsx')
  return { default: m.ProjectsSection }
})
const ProjectMedia = lazy(async () => {
  const m = await import('./components/ProjectMedia.tsx')
  return { default: m.ProjectMedia }
})
const Manifesto = lazy(async () => {
  const m = await import('./sections/Manifesto.tsx')
  return { default: m.Manifesto }
})
const SkillsPlaceholderSection = lazy(async () => {
  const m = await import('./sections/SkillsPlaceholderSection.tsx')
  return { default: m.SkillsPlaceholderSection }
})
const GlobalWebGLScene = lazy(async () => {
  const module = await import('./hero/GlobalWebGLScene.tsx')
  return { default: module.GlobalWebGLScene }
})

function App() {
  useSmoothScroll()
  const intro = useHeroIntro()

  return (
    <main
      className="site relative min-h-screen isolate overflow-clip bg-transparent text-[#f4f5f7] antialiased"
      data-intro-phase={intro.phase}
      aria-busy={intro.phase !== 'complete'}
    >
      <Suspense fallback={null}>
        <GlobalWebGLScene
          introProgressRef={intro.introProgressRef}
          interactionReadyRef={intro.interactionReadyRef}
          onAssetsReady={intro.reportAssetsReady}
        />
      </Suspense>
      <HeroIntroOverlay
        phase={intro.phase}
        loadProgress={intro.loadProgress}
        loadProgressRef={intro.loadProgressRef}
        revealProgress={intro.revealProgress}
        introProgressRef={intro.introProgressRef}
      />
      <Suspense fallback={null}>
        <BackgroundDotTransition />
      </Suspense>
      <GridOverlay />

      <SideScrollbar />
      <div className="fixed-meta pointer-events-none fixed bottom-[26px] left-[5.8vw] z-50 font-mono text-[13px]/none tracking-[.06em] text-white mix-blend-difference max-[760px]:bottom-[18px] max-[760px]:left-[18px] max-[760px]:text-[11px]">GMT <b className="text-[#e05035]">+0530</b> · INDIA</div>

      <HeroSection />

      <Suspense fallback={null}>
        <AboutSection />
        <ProjectsSection Media={ProjectMedia} />
        <Manifesto />
        <SkillsPlaceholderSection />
      </Suspense>
    </main>
  )
}

export default App
