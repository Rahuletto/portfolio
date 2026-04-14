import Header from "@/components/Header";
import ScrollProgress from "@/components/ScrollProgress";
import EntryScreen from "@/components/EntryScreen";
import { MeshThemeProvider } from "@/context/MeshThemeContext";
import { ViewportProvider } from "@/context/ViewportContext";
import HeroSection from "@/components/sections/HeroSection";
import WorksSection from "@/components/sections/WorksSection";
import SkillsSection from "@/components/sections/SkillsSection";

export default function Home() {
  return (
    <MeshThemeProvider>
      <ViewportProvider>
        <EntryScreen />
        <main className="min-h-screen items-center justify-center text-foreground">
          <ScrollProgress />
          <Header />

          <HeroSection />
          <WorksSection />
          <SkillsSection />
        </main>
      </ViewportProvider>
    </MeshThemeProvider>
  );
}
