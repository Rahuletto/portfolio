import { Fragment, useEffect, useRef, memo } from "react";

const items = [
  { type: "text" as const, content: "DESIGNER" },
  { type: "icon" as const, src: "/assets/icons/me.svg" },
  { type: "text" as const, content: "DEVELOPER" },
  { type: "icon" as const, src: "/assets/icons/spanner.svg" },
];

const REPEATS = 6;

const Marquee = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const baseSpeed = 1.5;
  const speedRef = useRef(baseSpeed);
  const lastScrollY = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    const setEl = setRef.current;
    if (!track || !setEl) return;

    const gap = 24; // gap-6 = 1.5rem = 24px
    const setWidth = setEl.offsetWidth + gap;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;
      speedRef.current = baseSpeed + delta * 0.3;
    };

    const animate = () => {
      speedRef.current += (baseSpeed - speedRef.current) * 0.03;
      xRef.current -= speedRef.current;

      if (xRef.current <= -setWidth) {
        xRef.current += setWidth;
      } else if (xRef.current > 0) {
        xRef.current -= setWidth;
      }

      track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const renderSet = () =>
    Array.from({ length: REPEATS }, (_, r) => (
      <Fragment key={r}>
        {items.map((item, i) =>
          item.type === "text" ? (
            <span
              key={i}
              className="bold text-[64px] leading-none whitespace-nowrap"
              style={{ fontStretch: "200%" }}
            >
              {item.content}
            </span>
          ) : (
            <img
              key={i}
              src={item.src}
              alt=""
              className="h-14 w-14 pt-1.5 shrink-0 mx-6"
            />
          ),
        )}
      </Fragment>
    ));

  return (
    <div className="absolu w-full overflow-hidden border-y-4 border-dark bg-light text-dark select-none">
      <div className="py-5 overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center gap-6 w-max will-change-transform"
        >
          <div ref={setRef} className="flex items-center gap-6 shrink-0">
            {renderSet()}
          </div>
          <div className="flex items-center gap-6 shrink-0">{renderSet()}</div>
        </div>
      </div>
    </div>
  );
};

export default memo(Marquee);
