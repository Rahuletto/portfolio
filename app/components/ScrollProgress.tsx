import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tickCount, setTickCount] = useState(40);
  const [isInverted, setIsInverted] = useState(false);

  useEffect(() => {
    const calculateTicks = () => {
      const width = window.innerWidth;
      const count = Math.floor(width / 8);
      setTickCount(Math.max(20, Math.min(count, 300)));
    };

    calculateTicks();
    window.addEventListener("resize", calculateTicks);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrolled);

      const elements = document.querySelectorAll('[data-color="invert"]');
      let found = false;
      const sampleY = 16;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (sampleY >= rect.top && sampleY <= rect.bottom) {
          found = true;
        }
      });
      setIsInverted(found);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateTicks);
    };
  }, []);

  const ticks = Array.from(
    { length: tickCount },
    (_, i) => (i / tickCount) * 100,
  );

  return (
    <div className="fixed top-0 left-0 right-0 h-8 z-40">
      <div className="absolute inset-0 flex items-center justify-between px-4">
        {ticks.map((tickPos, i) => {
          const isCompleted = tickPos <= scrollProgress;
          return (
            <div
              key={i}
              className={`h-3 rounded-full w-0.5 transition-all duration-300 ${isInverted
                ? (isCompleted ? "opacity-100 bg-dark" : "opacity-30 bg-dark")
                : (isCompleted ? "opacity-100 bg-white" : "opacity-30 bg-white")
                }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ScrollProgress;
