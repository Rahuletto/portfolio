import Link from "next/link";
import { useDevice } from "@/provider/DeviceProvider";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Sticker = dynamic(() => import("@/misc/Sticker").then((a) => a.default), {
  ssr: false,
});
const Slides = dynamic(
  () => import("@/components/Slides").then((a) => a.default),
  { ssr: true }
);
const Subhead = dynamic(() => import("@/misc/Subhead").then((a) => a.default), {
  ssr: false,
});
const Signature = dynamic(
  () => import("@/misc/Signature").then((a) => a.default),
  { ssr: true }
);

export default function Connect() {
  const device = useDevice();

  return (
    <Slides id="connect">
      {device != "desktop" ? (
        <Sticker
          id={9}
          delay={1}
          mobile
          style={{ bottom: "15%", right: "20px" }}
          className="absolute z-20"
          scale={0.85}
        />
      ) : (
        <Sticker
          id={9}
          delay={1}
          style={{ top: "32%", right: "99px" }}
          className="absolute z-20"
          scale={1.3}
        />
      )}

      <div className="lg:p-6 p-0">
        <Subhead text="Connect" />
        <div className="lg:px-12 lg:py-12 px-4 py-8 h-[80vh]">
          <h3 className="lg:text-3xl text-2xl text-color">
            How can you finish it off without stalking my profile?!
          </h3>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1,
              type: "spring",
              bounce: 0.2,
            }}
            className="container flex border-copper-dark border-4 p-1 lg:rounded-full mt-8 gap-2 md:w-max w-full flex-col rounded-[2.3rem] lg:flex-row"
          >
            <Link
              tabIndex={0}
              role="link"
              aria-label="connect"
              href="https://github.com/Rahuletto"
              target="_blank"
              className="md:text-xl md:h-auto h-full text-lg text-copper px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
            >
              Github
            </Link>
            <Link
              tabIndex={0}
              role="link"
              aria-label="connect"
              href="https://www.linkedin.com/in/rahul-marban"
              target="_blank"
              className="md:text-xl text-lg text-copper px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
            >
              Linkedin
            </Link>
            <Link
              tabIndex={0}
              role="link"
              aria-label="connect"
              href="https://discord.gg/3JzDV9T5Fn"
              target="_blank"
              className="md:text-xl text-lg text-copper px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
            >
              Discord
            </Link>
            <Link
              tabIndex={0}
              role="link"
              aria-label="connect"
              href="https://instagram.com/rahul_marban"
              target="_blank"
              className="md:text-xl text-lg text-copper px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
            >
              Instagram
            </Link>
          </motion.div>
          <div className="flex md:gap-4 gap-1 flex-wrap flex-row md:mt-8 mt-3">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 1.8,
                type: "spring",
                bounce: 0.2,
              }}
              className="container flex border-copper-dark border-4 p-1 rounded-full  gap-2 w-max flex-col lg:flex-row"
            >
              <Link
                tabIndex={0}
                role="link"
                aria-label="connect"
                href="mailto:rahulmarban@gmail.com"
                target="_blank"
                className="md:text-xl text-lg text-copper px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
              >
                Email
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 2.1,
                type: "spring",
                bounce: 0.2,
              }}
              className="flex p-1 rounded-full gap-2 w-max flex-col"
            >
              <Link
                tabIndex={0}
                role="link"
                aria-label="connect"
                href="/resume"
                target="_blank"
                className="md:text-xl text-lg border-4 border-copper px-12 py-4 font-medium rounded-full bg-copper text-deep transition-all ease-bouncy duration-300"
              >
                Résumé
              </Link>
            </motion.div>
          </div>
          <Signature />
        </div>
      </div>
    </Slides>
  );
}
