import { useDevice } from "@/provider/DeviceProvider";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

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
const Project = dynamic(
  () => import("@/components/Projects").then((a) => a.default),
  { ssr: false }
);

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
              image="/works/lirics.png"
            />
            <Project
              title="Rocket"
              link="https://github.com/Rahuletto/rocket"
              image="/works/rocket.png"
            />
            <Project
              title="SimplyDJS"
              link="https://simplyd.js.org"
              image="/works/simplyd.webp"
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
              image="/works/passket.png"
            />
            <Project
              title="AcademiaPro"
              link="https://github.com/Rahuletto/academiapro"
              left
              image="/works/academia.png"
            />
            <Project
              title="Betterlab"
              link="https://github.com/Rahuletto/betterlab"
              image="/works/betterlab.png"
            />

            <Project
              left
              title="Unix dots"
              link="https://unixporn-dots.vercel.app"
              image="/works/unix.webp"
            />
            <Project
              left
              title="Codeboard"
              link="https://codeboard.tech"
              image="/works/codeboard.webp"
            />
            <motion.a
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
                duration: 0.5,
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
              href="https://github.com/Rahuletto?tab=repositories"
              target="_blank"
              className="text-4xl font-medium underline col-span-2 aspect-video h-full w-full p-6 text-deep bg-copper-dark rounded-[2.5rem] flex justify-center items-center snap-center"
            >
              See more.
            </motion.a>
          </motion.div>
        </div>
      </div>
    </Slides>
  );
}