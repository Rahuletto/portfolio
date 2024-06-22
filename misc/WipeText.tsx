import { motion } from "framer-motion";
import { ReactNode } from "react";

interface WipeProps {
  text: string;
  once?: boolean;
  slow?: boolean;
  delay?: number;
}

interface IconProps {
  children: ReactNode;
  once?: boolean;
  delay?: number;
}

export function WipeText({ text, once, delay = 0, slow }: WipeProps) {
  return (
    <>
      {text.split("").map((el, i) => (
        <motion.span
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          viewport={once ? { once: true } : { once: false }}
          whileInView={{ opacity: 1 }}
          transition={{
            duration: (slow ? 0.5 : 0.25),
            delay: delay + i / 50,
          }}
          key={i}
        >
          {el}
        </motion.span>
      ))}
    </>
  );
}

export function WipeIcon({ children, once, delay = 0 }: IconProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={once ? { once: true } : { once: false }}
      transition={{
        duration: 0.25,
        delay: delay,
      }}
    >
      {children}
    </motion.span>
  );
}

export function WipeWord({ text, once, delay = 0 }: WipeProps) {
  return (
    <>
      {text.split(" ").map((el, i) => (
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          viewport={once ? { once: true } : { once: false }}
          style={{ position: "relative", lineHeight: 1.3 }}
          transition={{
            duration: 0.5,
            delay: delay + 0.1 + i / 10,
          }}
          key={i}
        >
          {el}{" "}
        </motion.span>
      ))}
    </>
  );
}
