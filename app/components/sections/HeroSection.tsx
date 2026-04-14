import HeroMascot from "@/components/HeroMascot";
import { motion } from "motion/react";

export default function HeroSection() {
  const baseDelay = 0.7;

  return (
    <section
      id="hero"
      className="relative min-h-[65vh] flex flex-col justify-center px-6 md:px-16 lg:px-32 pt-36 py-20 md:py-28 pointer-events-none"
    >
      <div className="overflow-hidden mb-4 md:mb-6">
        <motion.p
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: baseDelay,
            duration: 1,
            ease: [0.19, 1, 0.22, 1],
          }}
          className="text-base md:text-xl text-light"
        >
          Marban is a full-stack developer and a UI designer based in India
        </motion.p>
      </div>
      <h1 className="text-[9vw] md:text-7xl lg:text-[96px] font-medium leading-[1.3] md:leading-32 flex flex-col items-start">
        <div className="flex flex-wrap">
          {["Being", "creative", "is"].map((word, i) => (
            <div key={word} className="overflow-hidden mr-[0.3em]">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: baseDelay + 0.2 + i * 0.1,
                  duration: 1,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center">
          {["what"].map((word, i) => (
            <div key={word} className="overflow-hidden mr-[0.3em] relative">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: baseDelay + 0.5 + i * 0.1,
                  duration: 1,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </div>
          ))}
          <div className="relative">
            <motion.span
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: baseDelay + 0.6,
                duration: 1,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="inline-block align-middle pointer-events-auto h-12 md:h-26 lg:h-32"
            >
              <HeroMascot />
            </motion.span>
          </div>
          {["makes", "us"].map((word, i) => (
            <div key={word} className="overflow-hidden ml-[0.3em] mr-[0.3em]">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: baseDelay + 0.7 + i * 0.1,
                  duration: 1,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </div>
          ))}
        </div>

        <div className="overflow-hidden">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: baseDelay + 0.9,
              duration: 1,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="inline-block align-middle relative md:-top-4"
          >
            human.
          </motion.span>
        </div>
      </h1>
    </section>
  );
}
