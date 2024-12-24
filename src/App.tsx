import { lazy, Suspense, useEffect, useState } from "react";
import { tw } from "../twind/twind";
import { LazyMotion, domAnimation, useScroll } from "motion/react"
import * as m from "motion/react-m"
import ScrollLine from "./components/ScrollLine";

const StarSVG = lazy(() => import("./svgs/star"));
const Paragraph = lazy(() => import("./components/Paragraph"));
const Corner = lazy(() => import("./components/Corner"));
const ServicesSection = lazy(() => import("./components/Skills"));
const Projects = lazy(() => import("./components/Projects"));
const CommentSection = lazy(() => import("./components/CommentSection"));
const LastSegment = lazy(() => import("./components/LastSegment"));
const Footer = lazy(() => import("./components/Footer"));

const Icons = lazy(() => import("./components/Icons"));

function App() {
  const { scrollY } = useScroll();
  const [bgPosition, setBgPosition] = useState("center top");

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setBgPosition(`center ${latest * -0.4}px`);
    });
  }, [scrollY]);

  return (
    <LazyMotion features={domAnimation} strict>
      <ScrollLine />
      <main className={tw("min-h-screen")}>
        <header className={tw("flex sticky top-0 justify-between items-center p-4 px-8")}>
          <div className="nav-blur">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <m.h1
            className={tw("text-lg md:text-xl font-semibold text-center")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: useScroll().scrollYProgress.get() > 0.997 ? "var(--background)" : "var(--color)",
              transition: "color 0.3s ease",
              willChange: "opacity",
            }}
            transition={{ duration: 0.4, ease: [0.645, 0.045, 0.355, 1] }}
          >
            [marban.]
          </m.h1>
          <div className="flex items-center gap-4">
            <m.div
              className={tw("text-xs md:text-sm hidden text-right md:flex items-center gap-1")}
              animate={{ x: useScroll().scrollYProgress.get() > 0.95 ? 100 : 0 }}
              style={{
                willChange: "transform",
              }}
              transition={{ duration: 0.3, delay: useScroll().scrollYProgress.get() > 0.95 ? 0.2 : 0, ease: [0.645, 0.045, 0.355, 1] }}
            >
              <p 
                style={{
                  color: useScroll().scrollYProgress.get() > 0.997 ? "var(--background)" : "var(--color)",
                  transition: "color 0.3s ease",
                }}
              >
                Chennai, India
              </p>
              <span
                className={tw("h-1 w-1 rounded-full mx-3")}
                style={{
                  background: useScroll().scrollYProgress.get() > 0.997 ? "var(--background)" : "var(--color)",
                  transition: "color 0.3s ease",
                }}
              />
              <p
                style={{
                  color: useScroll().scrollYProgress.get() > 0.997 ? "var(--background)" : "var(--color)",
                  transition: "color 0.3s ease",
                }}
              >
                {new Date().toLocaleTimeString("en-US", {
                  timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>
            </m.div>
            <div>
              <m.a
                href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/Rahuletto/auto-resume/main/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={tw("md:border-l p-0 border-color md:py-1 md:px-4 font-semibold cursor-pointer")}
                initial={{
                  background: "#00000000",
                  color: "var(--color)",
                  opacity: 0.9,
                }}
                style={{
                  willChange: "transform, opacity",
                }}
                animate={{
                  x: useScroll().scrollYProgress.get() > 0.95 ? 100 : 0,
                  opacity: useScroll().scrollYProgress.get() > 0.95 ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                Résumé
              </m.a>
            </div>
          </div>
        </header>
        <m.div style={{ backgroundPosition: bgPosition, willChange: "background" }} className="parallax-background" />
        <section className={tw("flex justify-center items-center flex-col py-16 md:py-32 px-4 md:px-8")}>
          <div>
            <m.h3
              className={tw("text-lg md:text-xl lg:text-2xl")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                willChange: "opacity",
              }}
              transition={{
                duration: 0.4,
                delay: 0.4,
                ease: [0.645, 0.045, 0.355, 1],
              }}
            >
              I am Marban and I am a
            </m.h3>
            <h1 className={tw(`flex items-start justify-start flex-col md:!flex-row md:!items-center md:!justify-center gap-2 w-[70vw] md:!w-auto min-w-[300px] md:!gap-8`)}>
              <m.span
                className={tw(`text-4xl md:text-6xl lg:text-8xl font-bold`)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  willChange: "opacity",
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.8,
                  ease: [0.645, 0.045, 0.355, 1],
                }}
              >
                Designer{" "}
              </m.span>
              <m.div
                className={tw("mt-2 hidden md:!block")}
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 360, opacity: 1 }}
                style={{
                  willChange: "transform, opacity",
                }}
                transition={{
                  duration: 1,
                  delay: 1,
                  ease: [0.645, 0.045, 0.355, 1],
                }}
              >
                <StarSVG className="text-2xl md:text-3xl lg:text-4xl text-color" />
              </m.div>{" "}
              <m.span
                className={tw(`text-4xl md:text-6xl lg:text-8xl font-bold before:(content-["&"] inline-block mr-2 md:hidden text-color)`)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  willChange: "opacity",
                }}
                transition={{
                  duration: 0.4,
                  delay: 1.2,
                  ease: [0.645, 0.045, 0.355, 1],
                }}
              >
                Developer
              </m.span>
            </h1>
          </div>
        </section>
        <Suspense fallback={<div>Loading...</div>}>
          <Icons />
        </Suspense>
        <div className={tw("absolute h-[450px] md:h-[650px] lg:h-[700px] bottom-0 w-full items-center justify-center flex")}>
          <m.img
            loading="eager"
            id="marban"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              willChange: "transform, opacity",
            }}
            transition={{
              duration: 0.7,
              delay: 1.2,
              ease: [0.645, 0.045, 0.355, 1],
            }}
            src="/marban.png"
            className={tw("h-[450px] mb-32 md:!mb-0 md:h-[650px] lg:h-[700px] ml-12 object-contain")}
            alt="Marban"
          />
        </div>
        <div className={tw("lg:py-36 relative flex items-center justify-center py-24 px-12 max-w-screen-xl mx-auto w-full h-screen")}>
          <Corner />
          <Paragraph
            text={`I am Rahul Marban, currently pursuing CSE with AIML at SRMIST. While I am passionate about AI, my true love lies in designing interfaces that combine aesthetic appeal with strong user experiences. {} Taught myself to build everything from the visible parts of websites to the behind-the-scenes magic, making tech accessible and user-friendly`}
          />
        </div>
        <div className={tw("max-w-screen-xl mx-12 px-4 md:px-12 lg:!mx-auto py-16 mb-6 md:!mb-24 min-h-screen flex flex-col md:!flex-row items-start justify-between gap-6")}>
          <ServicesSection />
        </div>
        <div className={tw("py-16 min-h-screen")}>
          <div>
            <m.h1
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              style={{
                willChange: "opacity, filter",
              }}
              transition={{
                duration: 1,
                delay: 0.3,
                ease: [0.25, 0.8, 0.25, 1],
              }}
              className={tw("font-semibold text-(lg:5xl md:4xl 3xl) text-center w-fit mx-auto")}
            >
              What i did so far?
            </m.h1>
            <p className={tw("opacity-70 w-fit mx-auto text-color text-center text-base max-w-[300px] mx-auto md:max-w-none md:text-lg mt-3")}>
              You gotta see what my 4-years of experience got me so far.
            </p>
          </div>
          <Projects />
        </div>
        <div className={tw("pt-32 min-h-screen")}>
          <m.h1
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            style={{
              willChange: "opacity, filter",
            }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.25, 0.8, 0.25, 1],
            }}
            className={tw("font-semibold w-fit mx-auto text-(lg:6xl md:5xl 4xl) text-center sticky top-32")}
          >
            People around here<br />loves my{" "}
            <div className={tw("px-1 pr-3 inline-block italic rounded-lg bg-color text-background")}>
              work
            </div>
          </m.h1>
          <CommentSection />
        </div>
        <LastSegment />
        <Footer />
      </main>
    </LazyMotion>
  );
}

export default App;