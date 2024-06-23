import { motion } from "framer-motion";

import Link from "next/link";
import Head from "next/head";
import { WipeText, WipeWord } from "@/misc/WipeText";
import dynamic from "next/dynamic";

const Sticker = dynamic(() => import("@/misc/Sticker").then((a) => a.default), {
  ssr: false,
});
const Scroller = dynamic(
  () => import("@/components/Scroller").then((a) => a.default),
  { ssr: false }
);
const Slides = dynamic(
  () => import("@/components/Slides").then((a) => a.default),
  { ssr: false }
);

export default function Error() {
  return (
    <>
      <Head>
        <title>404.</title>
        <meta name="description" content="Look? Wait where is the" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sticker
        id={10}
        delay={1.4}
        style={{ bottom: "32%", left: "99px", rotate: "-23deg" }}
        className="absolute z-20"
        scale={1.3}
      />

      <Scroller>
        <Slides id="404">
          <motion.main
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: false }}
            className="min-h-full lg:p-16 gap-6 p-6 flex flex-col justify-center items-center"
          >
            <motion.h1
              viewport={{ once: true }}
              animate={{
                letterSpacing: ["0px", "12px", "12px", "12px", "0px"],
                transition: {
                  ease: "linear",
                  duration: 0.8,
                  delay: 6,
                  repeatDelay: 6,
                  repeat: Infinity,
                },
              }}
              whileHover={{ letterSpacing: "-6px" }}
              transition={{ opacity: { duration: 0.5, type: "spring" } }}
              id="stroke"
              className="m-0 lg:m-0 inline-block lg:text-9xl font-bold text-transparent transition-all md:text-6xl sm:text-5xl text-4xl duration-500"
            >
              <WipeText slow once text="404." />
            </motion.h1>
            <h2 className="text-xl lg:text-2xl text-color">
              <WipeWord
                once={true}
                delay={1.5}
                text="Look! Wait where is the thing??"
              />
            </h2>
            <motion.button
              initial={{
                opacity: 0,
              }}
              viewport={{ once: true }}
              whileInView={{
                opacity: 1,
                transition: {
                  delay: 2 + 0.5,
                  duration: 1,
                  type: "spring",
                  bounce: 0.2,
                },
              }}
              transition={{
                scale: { delay: 0, duration: 0.2, bounce: 0.4 },
              }}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 0.95 }}
              className="bg-copper-dark text-deep py-4 px-8 rounded-full text-xl font-semibold mt-4"
            >
              <Link href="/">Go back</Link>
            </motion.button>
          </motion.main>
        </Slides>
      </Scroller>
    </>
  );
}
