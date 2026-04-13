import HeroMascot from "@/components/HeroMascot";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[65vh] flex flex-col justify-center px-6 md:px-16 lg:px-32 pt-36 py-20 md:py-28 pointer-events-none"
    >
      <p className="text-base md:text-xl text-light mb-4 md:mb-6">
        Marban is a full-stack developer and a UI designer based in India
      </p>
      <h1 className="text-[9vw] md:text-7xl lg:text-[96px] font-medium leading-[1.3] md:leading-32">
        Being creative is <br />
        <span className="whitespace-nowrap">
          what{" "}
          <span className="inline-block align-middle pointer-events-auto h-10 md:h-24 lg:h-30">
            <HeroMascot />
          </span>{" "}
          makes us
        </span>
        <br />{" "}
        <span className="inline-block align-middle relative md:-top-10">
          human.
        </span>
      </h1>
    </section>
  );
}
