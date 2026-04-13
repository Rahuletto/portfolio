import { useEffect, useRef } from "react";

const IDLE = "/assets/mascots/hero/idle.svg";
const WAVE = "/assets/mascots/hero/wave.svg";
const SURPRISED = "/assets/mascots/hero/surprised.svg";

const WAVE_MIN_DELAY = 4000;
const WAVE_MAX_DELAY = 9000;
const WAVE_DURATION = 1600;

const randomDelay = () =>
  WAVE_MIN_DELAY + Math.random() * (WAVE_MAX_DELAY - WAVE_MIN_DELAY);

export default function HeroMascot() {
  const imgRef = useRef<HTMLImageElement>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    new Image().src = WAVE;
    new Image().src = SURPRISED;

    let nextWaveAt = performance.now() + randomDelay();
    let waveEndAt = 0;
    let isWaving = false;
    let rafId: number;

    const tick = (now: number) => {
      if (!isHoveredRef.current && imgRef.current) {
        if (isWaving && now >= waveEndAt) {
          imgRef.current.src = IDLE;
          imgRef.current.style.transform = "scale(1.02)";
          imgRef.current.style.top = "14px";
          isWaving = false;
          nextWaveAt = now + randomDelay();
        } else if (!isWaving && now >= nextWaveAt) {
          imgRef.current.src = WAVE;
          imgRef.current.style.transform = "scale(1)";
          imgRef.current.style.top = "0px";
          isWaving = true;
          waveEndAt = now + WAVE_DURATION;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <span
      className="inline-flex items-center justify-center h-30"
      onMouseEnter={() => {
        isHoveredRef.current = true;
        if (imgRef.current) {
          imgRef.current.src = SURPRISED;
          imgRef.current.style.transform = "scale(1)";
          imgRef.current.style.top = "0px";
        }
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        if (imgRef.current) {
          imgRef.current.src = IDLE;
          imgRef.current.style.transform = "scale(1.02)";
          imgRef.current.style.top = "14px";
        }
      }}
    >
      <img
        ref={imgRef}
        src={IDLE}
        alt="Mascot"
        className="h-30 w-75 object-contain transition-transform relative duration-300"
        style={{ transform: "scale(1.02)", top: "14px" }}
      />
    </span>
  );
}
