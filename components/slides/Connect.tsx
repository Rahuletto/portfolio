import Link from "next/link";
import { useDevice } from "@/provider/DeviceProvider";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Sticker = dynamic(() => import("@/misc/Sticker").then(a => a.default), { ssr: false });
const Slides = dynamic(() => import("@/components/Slides").then(a => a.default), { ssr: true });
const Subhead = dynamic(() => import("@/misc/Subhead").then(a => a.default), { ssr: false });
const Signature = dynamic(() => import("@/misc/Signature").then(a => a.default), { ssr: true });


export default function Connect() {
  const device = useDevice();

  return (
    <Slides id="connect">
      {device != "desktop" ? (
        <Sticker
          id={9}
          delay={1}
          mobile
          style={{ bottom: "22%", right: "84px" }}
          className="absolute z-20"
          scale={0.97}
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
        <div className="lg:px-12 lg:py-12 px-0 py-8 h-[80vh]">
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
            className="container flex border-copper-dark border-4 p-1 lg:rounded-full mt-8 gap-2 w-max flex-col rounded-[2.3rem] lg:flex-row"
          >
            <Link
              href="https://github.com/Rahuletto"
              target="_blank"
              className="text-xl text-copper px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
            >
              Github
            </Link>
            <Link
              href="https://www.linkedin.com/in/rahul-marban"
              target="_blank"
              className="text-xl text-copper px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
            >
              Linkedin
            </Link>
            <Link
              href="https://discord.gg/3JzDV9T5Fn"
              target="_blank"
              className="text-xl text-copper px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
            >
              Discord
            </Link>
            <Link
              href="https://instagram.com/rahul_marban"
              target="_blank"
              className="text-xl text-copper px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
            >
              Instagram
            </Link>
          </motion.div>
          <div className="flex gap-4 flex-col lg:flex-row">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.8,
              type: "spring",
              bounce: 0.2,
            }}
            className="container flex border-copper-dark border-4 p-1 rounded-full mt-8 gap-2 w-max flex-col  lg:flex-row"
          >
            <Link
              href="mailto:rahulmarban@gmail.com"
              target="_blank"
              className="text-xl text-copper px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
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
            className="flex p-1 rounded-full mt-8 gap-2 w-max flex-col"
          >
            <Link
              href="/resume"
              target="_blank"
              className="text-xl border-4 border-copper px-12 py-4 font-medium rounded-full bg-copper text-deep transition-all ease-bouncy duration-300"
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