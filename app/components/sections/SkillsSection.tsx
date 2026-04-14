export default function SkillsSection() {
  return (
    <section data-color="invert" className="-pt-62">
      <div className="relative mt-62 left-0 w-full z-20 pointer-events-none">
        <div className="max-w-6xl mx-auto w-full px-8 relative h-0 z-10">
          <div className="absolute bottom-20 md:bottom-32 left-4 md:left-8">
            <p className="text-3xl md:text-5xl mb-12 lg:text-[54px] tracking-tight font-medium leading-tight text-white mb-4">
              Core disciplines — where <br />
              thinking becomes design.
            </p>
          </div>
          <div className="absolute bottom-[-8px] z-10 -mb-2 right-[5%] md:right-[10%]">
            <img
              src="/assets/mascots/wave.svg"
              alt="Waving Mascot"
              className="h-[120px] md:h-[180px] pointer-events-auto"
            />
          </div>
        </div>

        <div className="w-full bg-light h-[200vh] z-0 pointer-events-auto border-t-4 border-dark"></div>
      </div>
    </section>
  );
}
