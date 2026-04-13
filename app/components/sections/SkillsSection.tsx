export default function SkillsSection() {
  return (
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

        <div className="w-full bg-light h-[200vh] z-5 pointer-events-auto border-t-4 border-dark"></div>
      </div>
    </section>
  );
}
