import Slides from "@/components/Slides";
import LanguageSlider from "../Languages";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useDevice } from "@/provider/DeviceProvider";
import { getRandomDelay } from "@/utils/random";

const Sticker = dynamic(() => import("@/misc/Sticker").then(a => a.default), { ssr: false });
const WipeIcon = dynamic(() => import("@/misc/WipeText").then(a => a.WipeIcon), { ssr: true });
const WipeWord = dynamic(() => import("@/misc/WipeText").then(a => a.WipeWord), { ssr: true });
const WipeText = dynamic(() => import("@/misc/WipeText").then(a => a.WipeText), { ssr: true });

const LuLaptop = dynamic(() => import("react-icons/lu").then(a => a.LuLaptop), { ssr: false });
const HiOutlinePaintBrush = dynamic(() => import("react-icons/hi2").then(a => a.HiOutlinePaintBrush), { ssr: false });
const LiaDumbbellSolid = dynamic(() => import("react-icons/lia").then(a => a.LiaDumbbellSolid), { ssr: false });
const IoConstruct = dynamic(() => import("react-icons/io5").then(a => a.IoConstruct), { ssr: false });
const FaUniversalAccess = dynamic(() => import("react-icons/fa6").then(a => a.FaUniversalAccess), { ssr: false });
const FaWandMagicSparkles = dynamic(() => import("react-icons/fa6").then(a => a.FaWandMagicSparkles), { ssr: false });


export default function About() {
  const device = useDevice();

  return (
    <Slides id="me">
      <p className="lg:text-4xl text-2xl pt-8 py-4 leading-relaxed px-4 font-medium text-color lg:px-16 lg:py-6 lg:pt-24 max-w-[1200px]">
      <WipeWord
          once={true}
          delay={0.05}
          text="I am Rahul Marban, currently pursuing"
        />{" "}
        <WipeIcon once={true} delay={0.7}>
          <LuLaptop className="md:text-4xl text-2xl inline-block pb-1 text-copper-dark" />
        </WipeIcon>{" "}
        <WipeWord
          once={true}
          delay={0.6}
          text="CSE with AIML at SRMIST. While I am passionate about AI, my true love"
        />
        <br />
        <WipeWord once={true} delay={1.9} text="lies in" />
        <WipeIcon once={true} delay={2.4}>
          <HiOutlinePaintBrush className="md:text-4xl text-2xl inline-block pb-1 text-copper-dark" />
        </WipeIcon>{" "}
        <WipeWord
          once={true}
          delay={2.5}
          text="designing interfaces that combine aesthetic appeal with"
        />
        <WipeIcon once={true} delay={3.3}>
          <LiaDumbbellSolid className="md:text-4xl text-2xl inline-block pb-1 text-copper-dark" />
        </WipeIcon>{" "}
        <WipeWord once={true} delay={3.5} text="strong user experiences." />
        <br />
      </p>

      <motion.p
        className="lg:text-4xl text-2xl py-4 px-4 pb-24 font-medium text-color lg:px-16 lg:py-6 lg:pb-48 max-w-[1200px]"
        initial={{ opacity: 0, y: 30 }}
        viewport={{ once: true }}
        style={{lineHeight: 1.3}}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.1, delay: 3.4 }}
      >
        Taught myself to{" "}
        <IoConstruct className="md:text-4xl text-2xl inline-block pb-1 text-copper-dark" />{" "}
        build everything from the visible parts of websites to the
        behind-the-scenes{" "}
        <FaWandMagicSparkles className="md:text-4xl text-2xl inline-block pb-1 text-copper-dark" />{" "}
        magic, making tech accessible and user-friendly{" "}
        <FaUniversalAccess className="md:text-4xl text-2xl inline-block pb-1 text-copper-dark" />
      </motion.p>

      {device === "desktop" && (
        <>
          <Sticker
            id={6}
            delay={1 + getRandomDelay()}
            style={{ bottom: "33%", right: "184px" }}
            className="absolute z-10"
            scale={1.1}
          />

          <Sticker
            id={5}
            delay={2 + getRandomDelay()}
            style={{ bottom: "24%", right: "40px" }}
            className="absolute z-20"
            scale={1.1}
          />
        </>
      )}

      <div className="absolute bottom-24 max-w-[83vw] lg:max-w-[93vw] lg:w-screen left-4">
        <RevealText />
        <LanguageSlider />
      </div>
    </Slides>
  );
}

function RevealText() {
  return (
    <div className="flex gap-4 lg:ml-12 ml-4 justify-start items-center flex-wrap">
      <h2 className="text-md lg:text-lg text-copper">
        <WipeText once text="Typescript" delay={4 + 0} />
      </h2>
      <h2 className="text-md lg:text-lg text-copper">
        <WipeText  text=" • " delay={4 + 0.15} />
      </h2>

      <h2 className="text-md lg:text-lgl text-copper">
        <WipeText once text="Javascript" delay={4 + 0.5} />
      </h2>
      <h2 className="text-md lg:text-lg text-copper">
        <WipeText  text=" • " delay={4 + 0.65} />
      </h2>
      <h2 className="text-md lg:text-lg text-copper">
        <WipeText once text="NextJS" delay={4 + 0.8} />
      </h2>
      <h2 className="text-md lg:text-lg text-copper">
        <WipeText text=" • " delay={4 + 0.85} />
      </h2>
      <h2 className="text-md lg:text-lg text-copper">
        <WipeText once text="TailwindCSS" delay={4 + 1} />
      </h2>
    </div>
  );
}
