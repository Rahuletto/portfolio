import Header from "@/components/Header";
import ScrollProgress from "@/components/ScrollProgress";
import MeshGradientBg from "@/components/MeshGradientBg";
import { MeshThemeProvider } from "@/context/MeshThemeContext";
import HeroSection from "@/components/sections/HeroSection";
import WorksSection from "@/components/sections/WorksSection";
import SkillsSection from "@/components/sections/SkillsSection";

export default function Home() {
  return (
    <MeshThemeProvider>
      <main className="min-h-screen items-center justify-center text-foreground">
        <ScrollProgress />
        <Header />
        <MeshGradientBg />

        <HeroSection />
        <WorksSection />
        <SkillsSection />
      </main>
    </MeshThemeProvider>
  );
}
