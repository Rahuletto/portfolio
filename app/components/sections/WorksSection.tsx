import Marquee from "@/components/Marquee";
import RainbowStrings from "@/components/RainbowStrings";
import { useMeshTheme } from "@/context/MeshThemeContext";

export default function WorksSection() {
  const { setTheme } = useMeshTheme();

  return (
    <section
      id="developer"
      className="bg-dark h-full w-full rounded-t-[52px] relative"
    >
      <div className="absolute top-40 z-20">
        <Marquee />
      </div>
      <RainbowStrings className="mt-2" onColorClick={setTheme} />
    </section>
  );
}
