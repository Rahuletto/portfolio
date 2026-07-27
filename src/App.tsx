import { lazy, Suspense } from 'react'
import './App.css'
import { GridOverlay } from './components/GridOverlay.tsx'
import { LazySection } from './components/LazySection.tsx'
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
const GlobalWebGLScene = lazy(async () => {
  const module = await import('./hero/GlobalWebGLScene.tsx')
  return { default: module.GlobalWebGLScene }
})

function App() {
  const intro = useHeroIntro()
  useSmoothScroll(intro.phase === 'revealing' || intro.phase === 'complete')

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
      <HeroIntroOverlay phase={intro.phase} />
      <Suspense fallback={null}>
        <BackgroundDotTransition />
      </Suspense>
      <GridOverlay />
      <SideScrollbar />
      <HeroSection />

      {/* Below-fold sections — each mounts independently as user scrolls near it */}
      <LazySection>
        <Suspense fallback={null}>
          <AboutSection />
        </Suspense>
      </LazySection>

      <LazySection>
        <Suspense fallback={null}>
          <ProjectsSection Media={ProjectMedia} />
        </Suspense>
      </LazySection>

    </main>
  )
}

export default App
