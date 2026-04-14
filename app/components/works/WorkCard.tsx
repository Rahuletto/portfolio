import { memo } from "react";
import { motion, type Variants } from "motion/react";
import { type WorkCardProps } from "@/types/works";
import { WORK_CARD_DIR_MAP, WORK_CARD_ORIGIN_MAP, WORK_CARD_TYPE_MAP, WORK_CARD_VIEWPORT, WORK_CARD_TRANSITION } from "@/lib/constants";

const cardVariants: Variants = {
  hidden: (custom: { direction: number; delay: number }) => ({
    opacity: 0,
    y: 100,
    x: custom.direction,
    scale: 1.1,
    transition: WORK_CARD_TRANSITION
  }),
  visible: (custom: { direction: number; delay: number }) => ({
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: { ...WORK_CARD_TRANSITION, delay: custom.delay }
  })
};

function WorkCard({
  image,
  delay = 0,
  type = "short",
  dir = "center",
  className = ""
}: WorkCardProps) {
  const direction = WORK_CARD_DIR_MAP[dir as keyof typeof WORK_CARD_DIR_MAP] || 0;
  const typeClasses = WORK_CARD_TYPE_MAP[type as keyof typeof WORK_CARD_TYPE_MAP] || WORK_CARD_TYPE_MAP.short;
  const originClass = WORK_CARD_ORIGIN_MAP[dir as keyof typeof WORK_CARD_ORIGIN_MAP] || WORK_CARD_ORIGIN_MAP.center;

  const custom = { direction, delay };

  return (
    <motion.div
      custom={custom}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={WORK_CARD_VIEWPORT}
      className={`bg-light rounded-[44px] [corner-shape:superellipse(1.2)] overflow-hidden relative ${typeClasses} ${originClass} ${className}`}
    >
      <img
        src={image}
        alt="Work Showcase"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        decoding="async"
        loading="lazy"
      />
    </motion.div>
  );
}

export default memo(WorkCard);
