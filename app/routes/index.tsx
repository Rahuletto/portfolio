import Header from "@/components/Header";
import HeroMascot from "@/components/HeroMascot";
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
        className="relative h-[60vh] flex flex-col justify-center px-32 pt-36 py-28"
      >
        <p className="text-lg text-light/70">
          Marban is a full-stack developer and a UI designer based in India
        </p>
        <h1 className="text-[96px] font-medium leading-32">
          Being creative is <br />
          what{" "}
          <span className="inline-block align-middle">
            <HeroMascot />
          </span>{" "}
          makes us
          <br />{" "}
          <span className="inline-block align-middle relative -top-6">
            human.
          </span>
        </h1>
      </section>

      <section
        id="developer"
        className="bg-dark h-full w-full min-h-[300vh] rounded-t-[52px] pt-48"
      >
        <Marquee />
      </section>
    </main>
  );
}
