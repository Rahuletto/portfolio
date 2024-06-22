/* eslint-disable @next/next/no-img-element */
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
  const stickers = [
    {
      id: 1,
      svg: (
        <img src="/stickers/sticker1.svg" alt="Sleek & minimal yet modern" role="presentation" />
      ),
    },
    { id: 2, svg: <img src="/stickers/sticker2.svg" alt="Pleasant colors" role="presentation" /> },
    {
      id: 3,
      svg: <img src="/stickers/sticker3.svg" alt="40K+ active users" role="presentation" />,
    },
    {
      id: 4,
      svg: (
        <img
          src="/stickers/sticker4.svg"
          alt="Building the future pixel by pixel"
          role="presentation"
        />
      ),
    },
    {
      id: 5,
      svg: <img src="/stickers/sticker5.svg" alt="Really likes NextJS" role="presentation" />,
    },
    { id: 6, svg: <img src="/stickers/sticker6.svg" alt="Loves Typescript" role="presentation" /> },
    {
      id: 7,
      svg: (
        <img
          src="/stickers/sticker7.svg"
          alt="Failure is better than success"
          role="presentation"
        />
      ),
    },
    {
      id: 8,
      svg: <img src="/stickers/sticker8.svg" alt="Quality over quantity" role="presentation" />,
    },
    {
      id: 9,
      svg: <img src="/stickers/sticker9.svg" alt="Let's get connected" role="presentation" />,
    },
    {
      id: 10,
      svg: <img src="/stickers/sticker10.svg" alt="oops" role="presentation" />,
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
          scale: scale || 1,
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
