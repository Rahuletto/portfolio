import Header from "@/components/Header";
import MeshGradientBg from "@/components/MeshGradientBg";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <main className="min-h-screen  items-center justify-center text-foreground">
      <ScrollProgress />
      <Header />
      <MeshGradientBg />

      <section id="hero" className="h-[60vh] py-28 px-32">
        <h2>
          Marban is a full-stack developer and a UI designer based in India
        </h2>
      </section>
      <section
        id="developer"
        className="bg-dark h-full w-full min-h-screen rounded-t-[52px]"
      ></section>
    </main>
  );
}
