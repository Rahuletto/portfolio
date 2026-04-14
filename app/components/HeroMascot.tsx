import { useEffect, useRef } from "react";
import { ASSETS, TIMES } from "@/lib/constants";
import { randomRange } from "@/lib/math";

const { IDLE, WAVE, SURPRISED } = ASSETS.MASCOTS.HERO;
const { WAVE_MIN_DELAY, WAVE_MAX_DELAY, WAVE_DURATION } = TIMES;

const getRandomDelay = () => randomRange(WAVE_MIN_DELAY, WAVE_MAX_DELAY);

export default function HeroMascot() {
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const isHoveredRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const scheduleWaveRef = useRef<() => void>(() => { });

  useEffect(() => {
    new Image().src = WAVE;
    new Image().src = SURPRISED;

    const clearPending = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const updateStyle = (src: string, transform: string) => {
      if (imgRef.current) {
        imgRef.current.src = src;
        imgRef.current.style.transform = transform;
      }
    };

    const setIdle = () => updateStyle(IDLE, "scale(1.02) translateY(18px)");
    const setWave = () => updateStyle(WAVE, "scale(0.98) translateY(4px)");

    const scheduleWave = () => {
      clearPending();
      if (!visibleRef.current) return;

      timeoutRef.current = window.setTimeout(() => {
        if (isHoveredRef.current) return;
        setWave();

        timeoutRef.current = window.setTimeout(() => {
          if (isHoveredRef.current) return;
          setIdle();
          scheduleWave();
        }, WAVE_DURATION);
      }, getRandomDelay());
    };

    scheduleWaveRef.current = scheduleWave;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          scheduleWave();
        } else {
          clearPending();
        }
      },
      { threshold: 0 }
    );

    if (wrapperRef.current) observer.observe(wrapperRef.current);

    scheduleWave();

    return () => {
      clearPending();
      observer.disconnect();
    };
  }, []);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (imgRef.current) {
      imgRef.current.src = SURPRISED;
      imgRef.current.style.transform = "scale(0.98) translateY(4px)";
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (imgRef.current) {
      imgRef.current.src = IDLE;
      imgRef.current.style.transform = "scale(1.02) translateY(18px)";
    }
    if (visibleRef.current) {
      scheduleWaveRef.current();
    }
  };

  return (
    <span
      ref={wrapperRef}
      className="inline-flex items-center justify-center h-30 select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imgRef}
        src={IDLE}
        alt="Mascot"
        fetchPriority="high"
        className="h-30 w-75 object-contain relative transition-none pointer-events-none"
        style={{ transform: "scale(1.02) translateY(18px)" }}
      />
    </span>
  );
}
