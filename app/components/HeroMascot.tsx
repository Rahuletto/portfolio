import { useEffect, useRef } from "react";

import { ASSETS, TIMES } from "@/lib/constants";
import { randomRange } from "@/lib/math";

const { IDLE, WAVE, SURPRISED } = ASSETS.MASCOTS.HERO;
const { WAVE_MIN_DELAY, WAVE_MAX_DELAY, WAVE_DURATION } = TIMES;

const getRandomDelay = () => randomRange(WAVE_MIN_DELAY, WAVE_MAX_DELAY);

export default function HeroMascot() {
  const imgRef = useRef<HTMLImageElement>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    new Image().src = WAVE;
    new Image().src = SURPRISED;

    let nextWaveAt = performance.now() + getRandomDelay();
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
          nextWaveAt = now + getRandomDelay();
        } else if (!isWaving && now >= nextWaveAt) {
          imgRef.current.src = WAVE;
          imgRef.current.style.transform = "scale(0.98)";
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
          imgRef.current.style.transform = "scale(0.98)";
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
