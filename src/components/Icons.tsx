import { useState, useEffect, lazy } from "react";
import { useScroll } from "motion/react";
import * as m from "motion/react-m"
import { tw } from "../../twind/twind";
const BallsSVG = lazy(() => import("../svgs/balls"));
const BeanSVG = lazy(() => import("../svgs/bean"));
const MSVG = lazy(() => import("../svgs/m"));
const SpringSVG = lazy(() => import("../svgs/spring"));
const StarSVG = lazy(() => import("../svgs/star"));

export default function Icons() {
  const { scrollY } = useScroll();
  const [top, setTop] = useState("0px");
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setTop(`${latest * -0.3}px`);
    });
  }, [scrollY]);
  
  return (
    <m.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{ top: top, willChange: "opacity, transform" }}
    transition={{
      delay: 1.8,
      duration: 0.1,
    }}
    className="relative w-screen lg:h-[45vh] h-[70vh] mt-12 lg:mt-0"
  >
    <m.div
      className={tw(
        "absolute h-fit w-fit",
      )}
      initial={{ left: "45%", top: "100%", rotate: 0, scale: 0.7 }}
      animate={{
        left: window.innerWidth < 768
          ? "15%"
          : window.innerWidth < 1024
          ? "15%"
          : "10%",
        top: window.innerWidth < 768 ? "50%" : "75%",
        rotate: 316,
        scale: 1.2,
      }}
      transition={{
        duration: 1,
        delay: 1.8,
        ease: [0.25, 0.8, 0.25, 1],
      }}
    >
      <BallsSVG className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-color" />
    </m.div>
    <m.div
      className={tw(
        "absolute h-fit w-fit",
      )}
      initial={{ left: "45%", top: "100%", rotate: 0, scale: 1 }}
      animate={{
        left: window.innerWidth < 768
          ? "24%"
          : window.innerWidth < 1024
          ? "23%"
          : "25%",
        top: "5%",
        rotate: -32,
        scale: 1.3,
      }}
      transition={{
        duration: 1,
        delay: 1.8,
        ease: [0.25, 0.8, 0.25, 1],
      }}
    >
      <SpringSVG className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-color" />
    </m.div>
    <m.div
      className={tw(
        "absolute h-fit w-fit",
      )}
      initial={{ left: "45%", top: "100%", rotate: 0, scale: 1 }}
      animate={{
        left: window.innerWidth < 768
          ? "0%"
          : window.innerWidth < 1024
          ? "0%"
          : "0%",
        top: "-10%",
        rotate: -26,
        scale: 1.3,
      }}
      transition={{
        duration: 1,
        delay: 1.8,
        ease: [0.25, 0.8, 0.25, 1],
      }}
    >
      <StarSVG className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl text-color" />
    </m.div>
    <m.div
      className={tw(
        "absolute h-fit w-fit",
      )}
      initial={{ right: "45%", top: "100%", rotate: 0, scale: 1 }}
      animate={{
        right: window.innerWidth < 768
          ? "2%"
          : window.innerWidth < 1024
          ? "2%"
          : "2%",
        top: "21%",
        rotate: 300,
        scale: 1.3,
      }}
      transition={{
        duration: 1,
        delay: 1.8,
        ease: [0.25, 0.8, 0.25, 1],
      }}
    >
      <StarSVG className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl text-color" />
    </m.div>
    <m.div
      className={tw(
        "absolute h-fit w-fit",
      )}
      initial={{ right: "45%", top: "100%", rotate: -90, scale: 1 }}
      animate={{
        right: window.innerWidth < 768
          ? "20%"
          : window.innerWidth < 1024
          ? "20%"
          : "21%",
        top: "-3%",
        rotate: 18,
        scale: 1.3,
      }}
      transition={{
        duration: 1,
        delay: 1.8,
        ease: [0.25, 0.8, 0.25, 1],
      }}
    >
      <MSVG className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-color" />
    </m.div>
    <m.div
      className={tw(
        "absolute h-fit w-fit",
      )}
      initial={{ right: "45%", top: "100%", rotate: 0, scale: 1 }}
      animate={{
        right: window.innerWidth < 768
          ? "13%"
          : window.innerWidth < 1024
          ? "13%"
          : "13%",
        top: window.innerWidth < 768 ? "50%" : "64%",
        rotate: 26,
        scale: 1.3,
      }}
      transition={{
        duration: 1,
        delay: 1.8,
        ease: [0.25, 0.8, 0.25, 1],
      }}
    >
      <BeanSVG className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-color" />
    </m.div>
  </m.div>
  );
}