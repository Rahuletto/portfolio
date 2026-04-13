import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import MeshGradientBg from "@/components/MeshGradientBg";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <main className="min-h-screen  items-center justify-center text-foreground">
      <ScrollProgress />
      <Header />
      <MeshGradientBg />

      <section
        id="hero"
        className="relative h-[60vh] flex flex-col justify-center px-32 py-28"
      >
        <p className="text-lg text-light/70 mb-12">
          Marban is a full-stack developer and a UI designer based in India
        </p>
        <h1 className="text-[96px]">
          Being creative is what{" "}
          <span className="inline-block align-middle relative top-1">
            <img
              src="/assets/mascots/hero/idle.svg"
              alt="Mascot"
              className="h-[120px] w-auto"
            />
          </span>{" "}
          makes us human.
        </h1>
      </section>

      <section
        id="developer"
        className="bg-dark h-full w-full min-h-screen rounded-t-[52px] pt-32"
      >
        <Marquee />
      </section>
    </main>
  );
}
