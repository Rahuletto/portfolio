import { Fragment, useEffect, useRef, memo } from "react";
import { 
  MARQUEE_ITEMS, 
  MARQUEE_REPEATS, 
  MARQUEE_SPEED, 
  MARQUEE_MAX_SPEED,
  MARQUEE_GAP,
  MARQUEE_SCROLL_SCALE,
  MARQUEE_LERP,
  MARQUEE_STRETCH
} from "@/lib/constants";

const Marquee = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const speedRef = useRef(MARQUEE_SPEED);
  const lastScrollY = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    const setEl = setRef.current;
    if (!track || !setEl) return;

    const setWidth = setEl.offsetWidth + MARQUEE_GAP;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;
      
      const targetSpeed = MARQUEE_SPEED + delta * MARQUEE_SCROLL_SCALE;
      speedRef.current = Math.max(-MARQUEE_MAX_SPEED, Math.min(MARQUEE_MAX_SPEED, targetSpeed));
    };

    const animate = () => {
      speedRef.current += (MARQUEE_SPEED - speedRef.current) * MARQUEE_LERP;
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
    Array.from({ length: MARQUEE_REPEATS }, (_, r) => (
      <Fragment key={r}>
        {MARQUEE_ITEMS.map((item, i) =>
          item.type === "text" ? (
            <span
              key={i}
              className="bold text-3xl md:text-[64px] leading-none whitespace-nowrap"
              style={{ fontStretch: MARQUEE_STRETCH }}
            >
              {item.content}
            </span>
          ) : (
            <img
              key={i}
              src={item.src}
              alt=""
              className="h-8 w-8 md:h-14 md:w-14 pt-1.5 shrink-0"
              style={{ margin: `0 ${MARQUEE_GAP / 2}px` }}
            />
          ),
        )}
      </Fragment>
    ));

  return (
    <div className="w-full overflow-hidden border-y-4 border-dark bg-light text-dark select-none">
      <div className="py-5 overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center w-max will-change-transform"
          style={{ gap: MARQUEE_GAP }}
        >
          <div 
            ref={setRef} 
            className="flex items-center shrink-0"
            style={{ gap: MARQUEE_GAP }}
          >
            {renderSet()}
          </div>
          <div 
            className="flex items-center shrink-0"
            style={{ gap: MARQUEE_GAP }}
          >
            {renderSet()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Marquee);
