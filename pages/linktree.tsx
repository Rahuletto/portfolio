import { motion } from "framer-motion";

import { useDevice } from "@/provider/DeviceProvider";
import Link from "next/link";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Sticker = dynamic(() => import("@/misc/Sticker").then((a) => a.default), {
  ssr: false,
});
const FaDiscord = dynamic(
  () => import("react-icons/fa6").then((a) => a.FaDiscord),
  { ssr: false }
);
const FaGithub = dynamic(
  () => import("react-icons/fa6").then((a) => a.FaGithub),
  { ssr: false }
);
const FaInstagram = dynamic(
  () => import("react-icons/fa6").then((a) => a.FaInstagram),
  { ssr: false }
);
const FaLinkedinIn = dynamic(
  () => import("react-icons/fa6").then((a) => a.FaLinkedinIn),
  { ssr: false }
);

export default function LinkTree() {
  const router = useRouter()
  const device = useDevice();

  return (
    <main className="min-h-screen lg:p-6 p-2 flex justify-center items-center">
      <Head>
        <title>LinkTree.</title>
        <meta
          name="description"
          content="Definitely not the official one but just look at what Marban has to offer to connect!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {device != "desktop" ? (
        <Sticker
          id={9}
          delay={1}
          mobile
          style={{ top: "12%", right: "84px" }}
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
      <div className="grid grid-cols-3 grid-rows-3 gap-2 max-h-auto lg:max-h-[70vh] justify-center items-center justify-items-center">
        <div />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1,
            type: "spring",
            bounce: 0.2,
          }}
        >
          <Link
            href="https://github.com/Rahuletto"
            target="_blank"
            className="flex text-xl text-copper border-2 border-copper-dark px-4 lg:px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
          >
            <FaGithub className="text-4xl inline-block" aria-label="GitHub" />
          </Link>
        </motion.div>
        <div />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 2,
            type: "spring",
            bounce: 0.2,
          }}
        >
          <Link
            href="https://www.linkedin.com/in/rahul-marban"
            target="_blank"
            className="flex text-xl text-copper border-2 border-copper-dark px-4 lg:px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
          >
            <FaLinkedinIn
              className="text-4xl inline-block"
              aria-label="LinkedIn"
            />
          </Link>
        </motion.div>

        <motion.div
          onClick={() => router.push('/')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.3,
            delay: 0,
          }}
          className="bg-copper rounded-3xl lg:rounded-[2.5rem] pt-2"
        >
          <motion.img
            initial={{
              scale: 0.9,
              opacity: 0,
              filter: "saturate(0)",
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.5,
                type: "spring",
                bounce: 0.2,
                delay: 2.3,
              },
            }}
            whileHover={{
              scale: device == "mobile" ? 1.2 : 1.02,
              filter: "none",
            }}
            transition={{ duration: 0.9, bounce: 0.2, type: "spring" }}
            src="/myself.png"
            loading="lazy"
            layout="preserve-aspect"
            style={{
              transformOrigin: "bottom left",
            }}
            className="rounded-3xl lg:rounded-[2.5rem] grayscale"
            alt="Rahul Marban"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.4,
            type: "spring",
            bounce: 0.2,
          }}
        >
          <Link
            href="https://discord.gg/3JzDV9T5Fn"
            target="_blank"
            className="flex text-xl text-copper border-2 border-copper-dark px-4 lg:px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
          >
            <FaDiscord className="text-4xl inline-block" aria-label="Discord" />
          </Link>
        </motion.div>

        <div />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.7,
            type: "spring",
            bounce: 0.2,
          }}
        >
          <Link
            href="https://instagram.com/rahul_marban"
            target="_blank"
            className="flex text-xl text-copper border-2 border-copper-dark px-4 lg:px-12 py-4 font-medium rounded-full hover:bg-copper hover:text-deep transition-all ease-bouncy duration-300"
          >
            <FaInstagram
              className="text-4xl inline-block"
              aria-label="Instagram"
            />
          </Link>
        </motion.div>
        <div />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 1,
          type: "spring",
          bounce: 0.2,
        }}
        className="flex p-1 rounded-full mt-8 gap-2 w-max flex-col absolute bottom-6"
      >
        <Link
          href="/resume"
          target="_blank"
          className="text-xl border-4 border-copper px-12 py-4 font-medium rounded-full bg-copper text-deep transition-all ease-bouncy duration-300"
        >
          Résumé
        </Link>
      </motion.div>
    </main>
  );
}
