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
  className = "",
  index
}: WorkCardProps) {
  const direction = WORK_CARD_DIR_MAP[dir as keyof typeof WORK_CARD_DIR_MAP] || 0;
  const typeClasses = WORK_CARD_TYPE_MAP[type as keyof typeof WORK_CARD_TYPE_MAP] || WORK_CARD_TYPE_MAP.short;
  const originClass = WORK_CARD_ORIGIN_MAP[dir as keyof typeof WORK_CARD_ORIGIN_MAP] || WORK_CARD_ORIGIN_MAP.center;

  const isPriority = index < 3;

  return (
    <motion.div
      custom={{ direction, delay }}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={WORK_CARD_VIEWPORT}
      className={`bg-light rounded-[44px] [corner-shape:superellipse(1.2)] overflow-hidden relative ${typeClasses} ${originClass} ${className}`}
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transform translate-z-0"
        style={{ imageRendering: "auto" }}
        decoding={isPriority ? "sync" : "async"}
        loading={isPriority ? "eager" : "lazy"}
        {...(isPriority ? { fetchpriority: "high" } : {})}
      />
    </motion.div>
  );
}

export default memo(WorkCard);
