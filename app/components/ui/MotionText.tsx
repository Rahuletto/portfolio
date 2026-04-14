import { motion } from "motion/react";
import { type MotionTextProps } from "@/types/ui";

export const MotionText = ({
  text,
  delay = 0,
  stagger = 0.1,
  className = "",
  wordClassName = "",
  transition = { duration: 1, ease: [0.19, 1, 0.22, 1] }
}: MotionTextProps) => {
  const words = Array.isArray(text) ? text : text.split(" ");
  
  return (
    <div className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <div key={`${word}-${i}`} className="overflow-hidden mr-[0.25em] relative">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              ...transition,
              delay: delay + i * stagger,
            }}
            className={`inline-block ${wordClassName}`}
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  );
};
