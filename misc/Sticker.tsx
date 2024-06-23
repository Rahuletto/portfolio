/* eslint-disable @next/next/no-img-element */
import { useDevice } from "@/provider/DeviceProvider";
import { getRandomRotation } from "@/utils/random";
import { motion } from "framer-motion";
import { CSSProperties } from "react";

interface StickerProps {
  id: number;
  delay?: number;
  width?: string;
  className?: string;
  scale?: number;
  style?: CSSProperties;
  mobile?: boolean;
  noanim?: boolean;
}

const one = require("@/public/stickers/sticker1.svg");
const two = require("@/public/stickers/sticker2.svg");
const three = require("@/public/stickers/sticker3.svg");
const four = require("@/public/stickers/sticker4.svg");
const five = require("@/public/stickers/sticker5.svg");
const six = require("@/public/stickers/sticker6.svg");
const seven = require("@/public/stickers/sticker7.svg");
const eight = require("@/public/stickers/sticker8.svg");
const nine = require("@/public/stickers/sticker9.svg");
const ten = require("@/public/stickers/sticker10.svg");

const Sticker = ({
  id,
  delay,
  width,
  className,
  style,
  scale,
  mobile,
  noanim,
}: StickerProps) => {
  const device = useDevice();
  if (!mobile && device == "mobile") mobile = true;

  const stickers = [
    {
      id: 1,
      svg: <img src={one} alt="sleek" role="alert" />,
    },
    { id: 2, svg: <img src={two} alt="pleasant" role="alert" /> },
    {
      id: 3,
      svg: <img src={three} alt="users" role="alert" />,
    },
    {
      id: 4,
      svg: <img src={four} alt="pixel" role="alert" />,
    },
    {
      id: 5,
      svg: <img src={five} alt="likes" role="alert" />,
    },
    { id: 6, svg: <img src={six} alt="typescript" role="alert" /> },
    {
      id: 7,
      svg: <img src={seven} alt="success" role="alert" />,
    },
    {
      id: 8,
      svg: <img src={eight} alt="quantity" role="alert" />,
    },
    {
      id: 9,
      svg: <img src={nine} alt="connected" role="alert" />,
    },
    {
      id: 10,
      svg: <img src={ten} alt="oops" role="alert" />,
    },
  ];

  const sticker = stickers.find((sticker) => sticker.id === id);

  return (
    sticker && (
      <motion.div
        className={`origin-center absolute${className ? " " + className : ""}`}
        id="sticker"
        style={{
          display: "inline-block",
          width: width || "auto",
          zIndex: 2,
          ...style,
        }}
        initial={{
          opacity: noanim ? 1 : 0,
          scale: noanim ? scale || 1 : (scale || 1) + (mobile ? 0.3 : 0.6),
          rotateZ: noanim ? 0 : getRandomRotation(),
        }}
        whileInView={{
          opacity: 1,
          scale: scale ? scale - (mobile ? 0.1 : 0) : 1,
          rotateZ: 0,
          transition: { delay: delay || 0.5 },
        }}
        whileHover={{
          rotateZ: getRandomRotation(),
          transition: { delay: 0, margin: { velocity: 2, delay: 0.1 } },
        }}
        transition={{
          margin: { velocity: 2, delay: delay || 0.5 },
          duration: 0.5,
          type: "spring",
          bounce: 0.2,
        }}
        viewport={{ once: true }}
      >
        {sticker?.svg}
      </motion.div>
    )
  );
};

export default Sticker;
