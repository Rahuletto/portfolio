import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroMascot from "@/components/HeroMascot";
import Marquee from "@/components/Marquee";
import MeshGradientBg from "@/components/MeshGradientBg";
import RainbowStrings from "@/components/RainbowStrings";
import ScrollProgress from "@/components/ScrollProgress";
import { PALETTES, type ThemeColor } from "@/components/~themes";

export default function Home() {
  const [currentColors, setCurrentColors] = useState<[string, string, string, string]>(
    PALETTES.purple as unknown as [string, string, string, string]
  );
  const [seed, setSeed] = useState(5);

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme") as ThemeColor;
    if (savedTheme && PALETTES[savedTheme]) {
      setCurrentColors(PALETTES[savedTheme] as unknown as [string, string, string, string]);
    }
  }, []);

  const handleColorClick = (color: ThemeColor) => {
    setCurrentColors(PALETTES[color] as unknown as [string, string, string, string]);
    setSeed(s => s + 1);
    localStorage.setItem("portfolio-theme", color);
  };

  return (
    <main className="min-h-screen  items-center justify-center text-foreground">
      <ScrollProgress />
      <Header />
      <MeshGradientBg colors={currentColors} seed={seed} />

      <section
        id="hero"
        className="relative h-[65vh] flex flex-col justify-center px-32 pt-36 py-28 pointer-events-none"
      >
        <p className="text-lg text-light">
          Marban is a full-stack developer and a UI designer based in India
        </p>
        <h1 className="text-[96px] font-medium leading-32">
          Being creative is <br />
          what{" "}
          <span className="inline-block align-middle pointer-events-auto">
            <HeroMascot />
          </span>{" "}
          makes us
          <br />{" "}
          <span className="inline-block align-middle relative -top-10">
            human.
          </span>
        </h1>
      </section>

      <section
        id="developer"
        className="bg-dark h-full w-full rounded-t-[52px] relative"
      >
        <div className="absolute top-40 z-20">
          <Marquee />
        </div>
        <RainbowStrings className="mt-2" onColorClick={handleColorClick} />


      </section>
      <section data-color="invert">
        <div className="relative -mt-62 left-0 w-full z-20 pointer-events-none">
          <div className="max-w-6xl mx-auto w-full px-8 relative h-0">
            <div className="absolute bottom-32 left-8">
              <p className="text-[54px] tracking-tight font-medium leading-tight text-white mb-4">
                Core disciplines — where <br />
                thinking becomes design.
              </p>
            </div>
            <div className="absolute bottom-[-8px] z-2 -mb-2 right-[10%]">
              <img
                src="/assets/mascots/wave.svg"
                alt="Waving Mascot"
                className="h-[180px] pointer-events-auto"
              />
            </div>
          </div>

          <div className="w-full bg-light h-[200vh] z-5 pointer-events-auto border-t-4 border-dark">
          </div>
        </div>
      </section>
    </main >
  );
}
