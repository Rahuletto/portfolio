import HeroMascot from "@/components/HeroMascot";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative h-[65vh] flex flex-col justify-center px-32 pt-36 py-28 pointer-events-none"
    >
      <p className="text-xl text-light mb-6">
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
  );
}
