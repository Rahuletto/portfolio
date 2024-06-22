import { useDevice } from "@/provider/DeviceProvider";
import { motion } from "framer-motion";
import { CSSProperties, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const Sticker = dynamic(() => import("@/misc/Sticker").then((a) => a.default), {
  ssr: false,
});
const JourneyPath = dynamic(
  () => import("@/misc/Path").then((a) => a.default),
  { ssr: true }
);
const Subhead = dynamic(() => import("@/misc/Subhead").then((a) => a.default), {
  ssr: false,
});
const Slides = dynamic(
  () => import("@/components/Slides").then((a) => a.default),
  { ssr: true }
);

export default function Journey() {
  const device = useDevice();
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function resizer() {
      const path = document.querySelector("#svgpath");
      if (grid.current && path && device == "desktop")
        grid.current.style.height =
          path?.getBoundingClientRect().height + 120 + "px";
    }
    resizer();
    window.addEventListener("resize", resizer);
    return () => {
      window.removeEventListener("resize", resizer);
    };
  }, [device]);

  return (
    <Slides id="journey">
      {device != "desktop" ? (
        <Sticker
          id={7}
          delay={4.5}
          mobile
          style={{ bottom: "7%", right: "69px" }}
          className="absolute z-20"
          scale={1.3}
        />
      ) : (
        <Sticker
          id={7}
          delay={4.5}
          style={{ top: "39%", right: "69px" }}
          className="absolute z-20"
          scale={1.3}
        />
      )}

      <div className="lg:p-6 p-0">
        <Subhead text="Journey" />
        <div className="lg:my-20 my-12 relative w-[89vw] h-[72vh] px-2 lg:px-0">
          <JourneyPath />
          <div
            ref={grid}
            style={device == "desktop" ? { height: "auto !important" } : {}}
            className="lg:pt-12 lg:grid lg:border-0 border-l-2 border-copper-dark lg:grid-cols-8 h-max md:gap-4 gap-2 lg:grid-rows-3 lg:h-full lg:ml-16 flex flex-col ml-3 pl-3 lg:pl-0"
          >
            {device == "desktop" && (
              <div className="relative h-full lg:p-6 p-2 col-span-2"></div>
            )}
            <div className="relative h-full lg:p-6 p-2 col-span-2">
              <JourneyText
                delay={0.1}
                head="First steps"
                text={`Started to learn coding and made a Discord bot called Simply Dumb`}
              />
            </div>
            <div className="relative h-full lg:p-6 p-2 col-span-2">
              <JourneyText
                delay={0.4}
                head="Publish"
                text={`Published simply-djs, a third-party discord.js module`}
              />
            </div>
            {device == "desktop" && (
              <div className="relative h-full lg:p-6 p-2 col-span-2 pr-10">
                <JourneyText
                  delay={0.7}
                  head="Typescript"
                  text={`Learnt Typescript and redid many of my old projects`}
                />
              </div>
            )}
            {device == "desktop" && <div className="h-full"></div>}
            {/* Empty */}
            <div className="relative h-full lg:p-6 p-2 col-span-2">
              <JourneyText
                delay={device == "desktop" ? 1.9 : 0.9}
                head="Stacked"
                text={`My first full-stack application called Codeboard`}
              />
            </div>
            {device == "desktop" && (
              <div className="relative h-full lg:p-6 p-2 col-span-2">
                <JourneyText
                  delay={1.5}
                  head="Simply Develop"
                  text={`Grew a community of 300 members called “Simply Develop”`}
                />
              </div>
            )}
            <div className="relative h-full lg:p-6 p-2 col-span-2">
              <JourneyText
                delay={1.1}
                head="Milestone"
                text={`simply-djs reached 400k+ downloads per year?!`}
              />
            </div>
            {device == "desktop" && <div className="h-full"></div>}
            {/* Empty */}
            {device == "desktop" && (
              <div className="relative h-full lg:p-6 p-2 col-span-2 lg:pt-10">
                <JourneyText
                  delay={2}
                  head="University"
                  text={`Joined SRMIST KTR to pursue bachelor's in CSE AIML`}
                />
              </div>
            )}
            <div className="relative h-full lg:p-6 p-2 col-span-2 lg:pt-10">
              <JourneyText
                delay={device == "desktop" ? 2.4 : 1.4}
                head="Remake"
                text={`Made some wrapper sites of our university services`}
              />
            </div>
            <div className="relative h-full lg:p-6 p-2 col-span-2 lg:pt-10">
              <JourneyText
                delay={device == "desktop" ? 2.8 : 1.8}
                head="Blowup"
                text={`Reached overwhelming response of 40k+ active users under a month`}
              />
            </div>
            <div className="relative h-full lg:p-6 lg: p-3 col-span-2 lg:pt-12 lg:justify-center lg:items-start lg:flex">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: device == "desktop" ? (4.4 || 0) + 2 : 4 + 2,
                  duration: 0.5,
                  type: "spring",
                  bounce: 0.2,
                }}
              >
                <h2 className="text-2xl font-medium text-color">Present</h2>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Slides>
  );
}

interface JourneyTextProps {
  delay?: number;
  head: string;
  text: string;
  className?: string;
  style?: CSSProperties;
}
function JourneyText({
  delay,
  head,
  text,
  className,
  style,
}: JourneyTextProps) {
  return (
    <motion.div
      style={style}
      className={className}
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: (delay || 0) + 3,
        duration: 0.5,
        type: "spring",
        bounce: 0.2,
      }}
    >
      <h2 className="md:text-2xl text-xl font-medium text-color">{head}</h2>
      <p className="md:text-md font-regular text-color opacity-75 lg:max-w-[200px]">
        {text}
      </p>
    </motion.div>
  );
}
