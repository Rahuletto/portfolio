import { memo } from "react";
import { motion } from "motion/react";
import WorkCard from "./works/WorkCard";
import { useViewport } from "@/context/ViewportContext";
import { type ChildrenProps } from "@/types/common";
import { WORK_CARDS, WORKS_HEADER_TRANSITION, WORKS_LINE_TRANSITION } from "@/lib/constants";

const DIRECTIONS = ["left", "center", "right"] as const;

function Works({ children }: ChildrenProps) {
  const { isMobile } = useViewport();

  return (
    <div className="flex flex-col items-center relative gap-12 mt-92 z-20 max-w-7xl w-full px-8 mx-auto pb-64 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={WORKS_HEADER_TRANSITION}
        className="flex justify-start items-center gap-8 w-full pointer-events-auto"
      >
        <h2 className="lg:text-5xl md:text-4xl text-3xl leading-none text-left font-medium text-light relative z-10">
          Works
        </h2>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={WORKS_LINE_TRANSITION}
          className="w-full h-0.5 mt-2 rounded-full bg-light origin-left"
        />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full pointer-events-auto mx-auto">
        {WORK_CARDS.map((card, index) => {
          const autoDir = DIRECTIONS[index % 3];
          const autoDelay = (index % 3) * 0.15;

          return (
            <WorkCard
              key={card.image}
              image={card.image}
              dir={isMobile() ? "center" : autoDir}
              type={card.type}
              delay={autoDelay}
              index={index}
            />
          );
        })}
      </div>

      <div className="pointer-events-auto w-full">
        {children}
      </div>
    </div>
  );
}

export default memo(Works);
