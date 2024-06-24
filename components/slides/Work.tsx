import { WipeText } from "@/misc/WipeText";
import { useDevice } from "@/provider/DeviceProvider";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";

const Sticker = dynamic(() => import("@/misc/Sticker").then((a) => a.default), {
  ssr: false,
});
const Subhead = dynamic(() => import("@/misc/Subhead").then((a) => a.default), {
  ssr: false,
});
const Slides = dynamic(
  () => import("@/components/Slides").then((a) => a.default),
  { ssr: true }
);
import Project from "@/components/Projects";

const unix = require("@/public/works/unix.webp");
const codeboard = require("@/public/works/codeboard.webp");
const betterlab = require("@/public/works/betterlab.webp");
const academia = require("@/public/works/academia.webp");
const passket = require("@/public/works/passket.webp");
const lirics = require("@/public/works/lirics.webp");
const simplyd = require("@/public/works/simplyd.webp");
const rocket = require("@/public/works/rocket.webp");

export default function Work() {
  const device = useDevice();

  return (
    <Slides id="work">
      {device != "desktop" ? (
        <Sticker
          id={8}
          delay={2}
          mobile
          style={{ top: "12%", right: "84px" }}
          className="absolute z-20"
          scale={1.3}
        />
      ) : (
        <Sticker
          id={8}
          delay={2.5}
          style={{ top: "18%", right: "84px" }}
          className="absolute z-20"
          scale={1.3}
        />
      )}

      <div className="lg:p-6 p-0">
        <Subhead text="Work" />

        <div className="lg:px-12 lg:py-6 px-0 py-8 h-[80vh]">
          <motion.div
            id="works"
            className="transform-all ease-bouncy duration-500 lg:grid lg:grid-cols-7 lg:grid-rows-3 lg:gap-6 h-full lg:h-full mt-0 flex flex-row flex-wrap gap-3 lg:rotate-[-8deg] scale-90 lg:overflow-hidden overflow-auto rounded-[2.5rem] snap-y snap-mandatory"
          >
            <Project
              title="lirics."
              link="https://github.com/Rahuletto/lirics"
              image={lirics}
            />
            <Project
              title="Rocket"
              link="https://github.com/Rahuletto/rocket"
              image={rocket}
            />
            <Project
              title="SimplyDJS"
              link="https://simplyd.js.org"
              image={simplyd}
            />
            {device == "desktop" && (
              <>
                <div />
                <div />
              </>
            )}
            <Project
              title="Passket"
              link="https://passket.vercel.app"
              image={passket}
            />
            <Project
              title="AcademiaPro"
              link="https://github.com/Rahuletto/academiapro"
              left
              image={academia}
            />
            <Project
              title="Betterlab"
              link="https://github.com/Rahuletto/betterlab"
              image={betterlab}
            />

            <Project
              left
              title="Unix dots"
              link="https://unixporn-dots.vercel.app"
              image={unix}
            />
            <Project
              left
              title="Codeboard"
              link="https://codeboard.tech"
              image={codeboard}
            />
            <motion.button
              initial={{
                opacity: 0,
                x: 5,
                color: "var(--deep-black)",
                background: "var(--copper-dark)",
                border: "2px solid transparent",
              }}
              exit={{
                opacity: 0,
                x: 5,
                color: "var(--deep-black)",
                background: "var(--copper-dark)",
                border: "2px solid transparent",
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                color: "var(--deep-black)",
                background: "var(--copper-dark)",
                border: "2px solid transparent",
              }}
              transition={{
                duration: 0.6,
                delay: 0,
                type: "spring",
                bounce: 0.2,
              }}
              whileHover={{
                scale: 0.95,
                border: "6px solid var(--copper)",
                background: "rgba(0,0,0,0.01)",
                color: "var(--copper)",
              }}
              whileTap={{ scale: 0.9 }}
              whileFocus={{
                scale: 0.95,
                border: "6px solid var(--copper)",
                background: "rgba(0,0,0,0.01)",
                color: "var(--copper)",
              }}
              tabIndex={0}
              onClick={() => window.open("https://github.com/Rahuletto")}
              className="text-4xl font-medium underline col-span-2 aspect-video h-full w-full p-6 text-deep bg-copper-dark rounded-[2.5rem] flex justify-center items-center snap-center"
            >
              See more.
            </motion.button>
          </motion.div>

          {device == "mobile" && (
            <p className="opacity-70 italic font-medium pl-3 absolute bottom-12 text-lg pr-2">
              <WipeText text={"Scroll through the projects"} delay={2} once />
            </p>
          )}
        </div>
      </div>
    </Slides>
  );
}
