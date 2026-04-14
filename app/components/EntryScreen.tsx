import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "motion/react";
import { MeshGradient } from "@mesh-gradient/react";
import { useMeshTheme } from "@/context/MeshThemeContext";
import { useLenis } from "lenis/react";

export default function EntryScreen() {
  const { currentColors, seed } = useMeshTheme();

  const [isVisible, setIsVisible] = useState(true);

  const scaleOuter = useMotionValue(0.2);

  const clipPathSize = useTransform(scaleOuter, (s) => {
    const halfH = 40 * s;
    const halfW = 134.5 * s;
    const r = 40 * s;
    return `inset(calc(50% - ${halfH}px) calc(50% - ${halfW}px) calc(50% - ${halfH}px) calc(50% - ${halfW}px) round ${r}px)`;
  });

  const mascotOpacity = useTransform(scaleOuter, [0.7, 1.5], [1, 0]);

  const lenis = useLenis();

  useEffect(() => {
    if (isVisible) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [isVisible, lenis]);

  useEffect(() => {
    animate(scaleOuter, 0.7, { duration: 1.8, ease: [0.76, 0, 0.24, 1] });

    const expandTimeout = setTimeout(() => {
      animate(scaleOuter, 25, {
        duration: 2,
        ease: [0.83, 0, 0.17, 1]
      }).then(() => {
        setIsVisible(false);
      });
    }, 2000);

    return () => clearTimeout(expandTimeout);
  }, [scaleOuter]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 -z-10 bg-dark pointer-events-none overflow-hidden">

        <motion.div
          style={{ clipPath: clipPathSize }}
          className="fixed inset-0 z-10 w-full h-full"
        >
          <MeshGradient
            key={`${seed}-${currentColors.join("-")}`}
            className="w-full h-full"
            options={{
              seed,
              animationSpeed: 3,
              colors: currentColors as any,
            }}
          />
        </motion.div>

        <motion.img
          src="/assets/mascots/hero/idle.svg"
          alt="Mascot"
          className="fixed z-20 w-[285px] h-[123px] pointer-events-none"
          style={{
            scale: scaleOuter,
            opacity: mascotOpacity,
            left: "calc(50% - 142.5px)",
            top: "calc(50% - 48px)",
            transformOrigin: "50% 48px"
          }}
        />
      </div>
    </AnimatePresence>
  );
}
