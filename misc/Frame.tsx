/* eslint-disable @next/next/no-img-element */
import { useDevice } from "@/provider/DeviceProvider";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const HeroStickers = dynamic(
  () => import("@/misc/HeroStickers").then((a) => a.default),
  { ssr: false }
);

export default function Frame({ noanim }: { noanim?: boolean }) {
  const device = useDevice();

  const sty =
    device === "mobile"
      ? {
          left: "-26vw",
          width: "100vw",
          maxWidth: "100vw",
          marginLeft: "-24px",
        }
      : {
        marginLeft: "-24px"
      };
  const cont = device === "mobile" ? { scale: "1.4" } : {};

  return (
    <div
      style={{
        ...cont,
        position: "relative",
        width: "76vw",
        height: "auto",
        zIndex: 0,
        transformOrigin: "bottom center",
      }}
    >
      <HeroStickers noanim={noanim} />

      <motion.img
        transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
        viewport={{ once: true }}
        initial={{ opacity: noanim ? 1 : 0 }}
        animate={{ opacity: 1 }}
        style={{
          minWidth: "76vw",
          transformOrigin: "bottom center",
          ...sty,
        }}
        className="md:w-[90vw] lg:w-[76vw] w-[95vw] relative md:flex"
        id="frame"
        src="/frame.svg"
        alt="rahul marban"
      />

      <motion.img
        src="/myself.png"
        loading="lazy"
        layout="preserve-aspect"
        initial={{
          scale: device == "mobile" ? 1.15 : 0.9,
          opacity: noanim ? 1 : 0,
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
        whileHover={{ scale: device == "mobile" ? 1.2 : 1.02, filter: "none" }}
        transition={{ duration: 0.9, bounce: 0.2, type: "spring" }}
        alt="My Photo"
        style={{
          position: "absolute",
          bottom: "0",
          left: "27.774%",
          width: "39.528%",
          height: "auto",
          transformOrigin: "bottom center",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
