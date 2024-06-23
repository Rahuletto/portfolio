/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";

import { useDevice } from "@/provider/DeviceProvider";
import Link from "next/link";
import Head from "next/head";

import dynamic from "next/dynamic";

const Sticker = dynamic(() => import("@/misc/Sticker").then((a) => a.default), {
  ssr: false,
});
const BsArrowUpRightCircle = dynamic(
  () => import("react-icons/bs").then((a) => a.BsArrowUpRightCircle),
  { ssr: false }
);

export default function Resume() {
  const device = useDevice();

  return (
    <>
      <Head>
        <title>Resume.</title>
        <meta name="description" content="Look what i did for 4 years!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {device != "desktop" ? null : (
        <Sticker
          id={9}
          delay={1}
          style={{ top: "32%", right: "99px" }}
          className="absolute z-20"
          scale={1.3}
        />
      )}
      <motion.main
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: false }}
        className="min-h-screen lg:p-16 gap-6 p-6 flex flex-col justify-center items-center"
      >
        <motion.h1 className="m-0 lg:m-0 inline-block lg:text-4xl font-semibold text-copper transition-all md:text-4xl sm:text-2xl text-2xl duration-500">
          Résumé
        </motion.h1>
        <div className="flex flex-col lg:flex-row max-h-auto justify-center items-center w-full gap-6">
          <motion.div
            className="relative w-full h-[40vh] lg:h-max"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              type: "spring",
              bounce: 0.2,
            }}
          >
            <Link
              id="project"
              href="/resume.pdf"
              target="_blank"
              className=" rounded-[3.2rem] w-full h-[40vh] lg:h-max"
            >
              <div
                id="text"
                className="rounded-full bg-[rgba(8,8,8,0.4)] flex justify-between items-center m-4 absolute bottom-0 left-0 z-10 w-[94%] p-5 lg:opacity-0"
              >
                <h2 className="text-color">Designer</h2>
                <BsArrowUpRightCircle className="text-color" />
              </div>
              <div className="w-full h-full absolute flex justify-center items-center">
                <div className="py-4 px-12 rounded-full bg-copper-dark text-deep w-max font-semibold">
                  Designer
                </div>
              </div>
              <img
                className="object-cover rounded-[3.2rem] w-full h-[40vh] lg:h-max"
                src="/resource/resume.webp"
                alt="print"
              />
            </Link>
          </motion.div>

          <motion.div
            className="relative w-full h-[40vh] lg:h-max"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.8,
              type: "spring",
              bounce: 0.2,
            }}
          >
            <Link
              id="project"
              href="/resume-print.pdf"
              target="_blank"
              className=" rounded-[3.2rem] w-full h-[40vh] lg:h-max"
            >
              <div
                id="text"
                className="rounded-full bg-[rgba(8,8,8,0.4)] flex justify-between items-center m-4 absolute bottom-0 left-0 z-10 w-[94%] p-5 lg:opacity-0"
              >
                <h2 className="text-color">Recruiter</h2>
                <BsArrowUpRightCircle className="text-color" />
              </div>
              <div className="w-full h-full absolute flex justify-center items-center">
                <div className="py-4 px-12 rounded-full bg-copper-dark text-deep w-max font-semibold">
                  Recruiter
                </div>
              </div>
              <img
                className="object-cover rounded-[3.2rem] w-full h-[40vh] lg:h-max"
                src="/resource/print.webp"
                alt="print"
              />
            </Link>
          </motion.div>
        </div>
      </motion.main>
    </>
  );
}
