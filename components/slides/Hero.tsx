import { useDevice } from "@/provider/DeviceProvider";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";


const Slides = dynamic(() => import("@/components/Slides").then(a => a.default), { ssr: true });
const Frame = dynamic(() => import("@/misc/Frame").then(a => a.default), { ssr: true });
const Line = dynamic(() => import("@/misc/Line").then(a => a.default), { ssr: false });
const WipeText = dynamic(() => import("@/misc/WipeText").then(a => a.WipeText), { ssr: true });


export default function Hero({ noanim }: { noanim?: boolean }) {
  const device = useDevice();

  return (
    <Slides id="me">
      <div className="lg:px-12 lg:py-16 px-2 py-2 max-h-[265px]">
        <motion.h1
          viewport={{ once: true }}
          animate={device == 'mobile' ? {} : {
            letterSpacing: ["0px", "-8px", "-8px", "-8px", "0px"],
            transition: {
              ease: "linear",
              duration: 0.8,
              delay: 6,
              repeatDelay: 6,
              repeat: Infinity,
            },
          }}
          whileHover={device == 'mobile' ? {} : { letterSpacing: "-6px" }}
          transition={{ opacity: { duration: 0.5, type: "spring" } }}
          id="stroke"
          className="m-0 lg:m-0 inline-block lg:text-8xl font-semibold md:normal-case capitalize text-transparent transition-all md:text-6xl leading-relaxed text-5xl duration-500"
        >
          <Link href="https://www.linkedin.com/in/rahul-marban" target="_blank">
            {noanim ? (
              "rahul marban"
            ) : (
              <WipeText slow once text="rahul marban" />
            )}
          </Link>
        </motion.h1>
        <RevealText noanim={noanim} />
      </div>
      <div className="flex lg:mt-12 md:gap-8 gap-3 mt-24 flex-col lg:flex-row items-start lg:justify-stretch lg:items-stretch">
        <Frame noanim={noanim} />
        <motion.a
        href="/resume"
          initial={{
            maxWidth: noanim ? (device === "desktop" ? "14vw" : "80vw") : (device === "desktop" ? "2vw" : "80vw"),
            opacity: noanim ? 1 : 0,
          }}
          viewport={{ once: true }}
          whileInView={{
            maxWidth: device === "desktop" ? "14vw" : "80vw",
            opacity: 1,
            transition: {
              delay: 2 + 0.5,
              duration: 1.2,
              type: "spring",
              bounce: 0.2,
            },
          }}
          transition={{
           
          }}
          whileTap={{ scale: 0.85 }}
          style={{ width: `${device === "desktop" ? "14vw" : "80vw"}` }}
          whileHover={{ scale: 0.95 }}
          className="lg:mt-0 mt-12 flex w-full border-4 border-copper rounded-full items-center justify-center lg:py-0 lg:px-0 px-12 py-6 max-w-[80vw] lg:max-w-[14vw]"
        >
          <p className="lg:text-4xl text-2xl font-medium lg:rotate-90 text-copper-dark">
            Résumé
          </p>
        </motion.a>
      </div>

      <p className="opacity-70 italic font-medium pl-3 absolute md:bottom-12 bottom-24 text-lg pr-2">
        {noanim ? (
          device === "desktop" ? (
            "Tip: Try to hover on things"
          ) : (
            '"Failure is the crucible where greatness is forged"'
          )
        ) : (
          <WipeText
            text={
              device === "desktop"
                ? "Tip: Try to hover on things"
                : '"Failure is the crucible where greatness is forged"'
            }
            delay={6}
            once
          />
        )}
      </p>
    </Slides>
  );
}

function RevealText({ noanim }: { noanim?: boolean }) {
  return (
    <div className="flex gap-4 mt-4 justify-start items-center flex-wrap">
      <h2 className="text-xl lg:text-2xl text-copper">
        {noanim ? (
          "UI Designer"
        ) : (
          <WipeText once text="UI Designer" delay={1 + 0} />
        )}
      </h2>
      <Line delay={1.2} />
      <h2 className="text-xl lg:text-2xl text-copper">
        {noanim ? (
          "Full Stack"
        ) : (
          <WipeText once text="Full Stack" delay={1 + 0.3} />
        )}
      </h2>
      <Line delay={1.6} />
      <h2 className="text-xl lg:text-2xl text-copper">
        {noanim ? (
          "AIML Student"
        ) : (
          <WipeText once text="AIML Student" delay={1 + 0.6} />
        )}
      </h2>
      <Line delay={1.8} />
      <h2 className="text-xl lg:text-2xl text-copper">
        {noanim ? (
          "Self-taught"
        ) : (
          <WipeText once text="Self-taught" delay={1 + 0.8} />
        )}
      </h2>
    </div>
  );
}
