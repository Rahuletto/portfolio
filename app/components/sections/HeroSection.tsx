import HeroMascot from "@/components/HeroMascot";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[65vh] flex flex-col justify-center px-6 md:px-16 lg:px-32 pt-36 py-20 md:py-28 pointer-events-none"
    >
      <div className="overflow-hidden mb-4 md:mb-6">
        <p className="text-base md:text-xl text-light animate-reveal-up [animation-delay:200ms]">
          Marban is a full-stack developer and a UI designer based in India
        </p>
      </div>
      <h1 className="text-[9vw] md:text-7xl lg:text-[96px] font-medium leading-[1.3] md:leading-32 flex flex-col items-start">
        <div className="flex flex-wrap">
          {["Being", "creative", "is"].map((word, i) => (
            <div key={word} className="overflow-hidden mr-[0.3em]">
              <span
                className="inline-block animate-reveal-up"
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center">
          {["what"].map((word, i) => (
            <div key={word} className="overflow-hidden mr-[0.3em] relative">
              <span
                className="inline-block animate-reveal-up"
                style={{ animationDelay: `${700 + i * 100}ms` }}
              >
                {word}
              </span>
            </div>
          ))}
          <div className="relative">
            <span
              className="inline-block align-middle pointer-events-auto h-12 md:h-26 lg:h-32 animate-reveal-up"
              style={{ animationDelay: "800ms" }}
            >
              <HeroMascot />
            </span>
          </div>
          {["makes", "us"].map((word, i) => (
            <div key={word} className="overflow-hidden ml-[0.3em] mr-[0.3em]">
              <span
                className="inline-block animate-reveal-up"
                style={{ animationDelay: `${900 + i * 100}ms` }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        <div className="overflow-hidden">
          <span
            className="inline-block align-middle relative md:-top-10 animate-reveal-up"
            style={{ animationDelay: "1100ms" }}
          >
            human.
          </span>
        </div>
      </h1>
    </section>
  );
}
