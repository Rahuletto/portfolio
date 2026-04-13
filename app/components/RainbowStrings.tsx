import Works from "./Works";
import { useEffect, useRef, useCallback, useState, type ReactNode } from "react";
import { type ThemeColor } from "./~themes";

const RAINBOW_MAP: Record<ThemeColor, string> = {
  purple: "#a860ff",
  blurple: "#575fff",
  blue: "#57beff",
  green: "#84ff57",
  yellow: "#ffd557",
  orange: "#ff7057",
  red: "#ff5757",
};

const RAINBOW_COLORS = Object.keys(RAINBOW_MAP) as ThemeColor[];

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Props = {
  children?: ReactNode;
  className?: string;
  onColorClick?: (color: ThemeColor) => void;
};

export default function RainbowStrings({ children, className = "", onColorClick }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isAtTop, setIsAtTop] = useState(true);

  const current = useRef(0);
  const target = useRef(0);
  const rafId = useRef(0);

  const N = RAINBOW_COLORS.length;

  const tick = useCallback(() => {
    current.current = lerp(current.current, target.current, 0.05);
    const p = current.current;

    if (Math.abs(current.current - target.current) < 0.001) {
      current.current = target.current;
    } else {
      rafId.current = requestAnimationFrame(tick);
    }

    const vw = window.innerWidth;

    const basePhase = clamp(p / 0.4, 0, 1);
    const currentW = lerp(52, 64, basePhase);
    const currentGap = lerp(2, 5, basePhase);
    const centerDist = currentW + currentGap;

    const expandPhase = clamp((p - 0.35) / 0.55, 0, 1);
    const easedExpand = expandPhase < 0.5
      ? 4 * expandPhase * expandPhase * expandPhase
      : 1 - Math.pow(-2 * expandPhase + 2, 3) / 2;

    const fadePhase = clamp((p - 0.7) / 0.2, 0, 1);
    const currentOpacity = 1 - fadePhase;

    const maxSpread = Math.max(vw / 4, 200);

    barRefs.current.forEach((el, i) => {
      if (!el) return;
      const side = i - (N - 1) / 2;

      const baseX = side * centerDist;
      const targetX = side * maxSpread;

      const currentX = lerp(baseX, targetX, easedExpand);
      const currentScaleX = 1 - 0.95 * easedExpand;

      el.style.width = `${currentW}px`;
      el.style.transform = `translateX(-50%) translateX(${currentX}px) scaleX(${currentScaleX})`;
      el.style.opacity = `${currentOpacity}`;
    });

  }, [N]);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const scrollable = el.scrollHeight - window.innerHeight;

      const progress = clamp(-rect.top / Math.max(scrollable, 1), 0, 0.9);
      target.current = progress;

      const atTop = progress < 0.05;
      setIsAtTop(atTop);

      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [tick]);

  return (
    <div
      ref={sectionRef}
      className={`relative w-full ${className}`}
      style={{ height: "290vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden z-10">
        <div className="absolute inset-0 h-full w-full">
          {RAINBOW_COLORS.map((color, i) => (
            <div
              key={color}
              ref={(el) => {
                barRefs.current[i] = el;
              }}
              onClick={() => {
                if (isAtTop) {
                  onColorClick?.(color);
                }
              }}
              className={`absolute top-0 h-full origin-center transition-opacity duration-300 ${isAtTop ? "cursor-pointer hover:brightness-110 pointer-events-auto" : "pointer-events-none"}`}
              style={{
                left: "50%",
                width: "52px",
                backgroundColor: RAINBOW_MAP[color],
                willChange: "transform, opacity, width",
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full z-20 pt-48 pointer-events-none">
        <Works>{children}</Works>
      </div>
    </div>
  );
}
