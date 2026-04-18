import { useEffect, useRef, useState, memo } from 'react';
import { MARQUEE_ITEMS, MARQUEE_GAP, MARQUEE_STRETCH } from '@/lib/constants';

const BASE_SPEED = 1.5;
const SCROLL_MULTIPLIER = 0.3;
const MAX_SPEED = 40;
const EASE_BACK = 0.03;

const ItemSet = memo(() => (
  <>
    {MARQUEE_ITEMS.map((item, i) =>
      item.type === 'text' ? (
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
      )
    )}
  </>
));

const Marquee = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(4);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const setEl = setRef.current;
    if (!wrapper || !setEl) return;

    const setsNeeded = Math.ceil(wrapper.offsetWidth / setEl.offsetWidth) + 1;
    setCopies(setsNeeded);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const setEl = setRef.current;
    if (!track || !setEl) return;

    const setWidth = setEl.offsetWidth + MARQUEE_GAP;
    let x = 0;
    let speed = BASE_SPEED;
    let lastScrollY = window.scrollY;
    let rafId: number;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      // delta > 0 = scroll down → speed up forward
      // delta < 0 = scroll up → reverse
      speed = Math.max(
        -MAX_SPEED,
        Math.min(MAX_SPEED, BASE_SPEED + delta * SCROLL_MULTIPLIER)
      );
    };

    const tick = () => {
      // ease speed back toward base
      speed += (BASE_SPEED - speed) * EASE_BACK;
      x -= speed;

      // seamless wrap
      if (x <= -setWidth) x += setWidth;
      else if (x > 0) x -= setWidth;

      track.style.transform = `translate3d(${x}px,0,0)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!visible) {
          visible = true;
          rafId = requestAnimationFrame(tick);
        }
      } else {
        visible = false;
        cancelAnimationFrame(rafId);
      }
    });

    const wrapper = wrapperRef.current;
    if (wrapper) observer.observe(wrapper);

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [copies]);

  return (
    <div className="w-full overflow-hidden border-y-4 border-dark bg-light text-dark select-none">
      <div ref={wrapperRef} className="py-5 overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center will-change-transform"
          style={{ gap: MARQUEE_GAP, width: 'max-content' }}
        >
          {Array.from({ length: copies }, (_, i) => (
            <div
              key={i}
              ref={i === 0 ? setRef : undefined}
              className="flex items-center shrink-0"
              style={{ gap: MARQUEE_GAP }}
            >
              <ItemSet />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Marquee);
