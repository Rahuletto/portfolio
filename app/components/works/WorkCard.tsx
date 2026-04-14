import { memo } from "react";
import { motion, type Variants } from "motion/react";

export enum WorkCardType {
  LONG = "long",
  SHORT = "short",
}

export enum WorkCardDir {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

const transitionEvent = {
  duration: 1.4,
  ease: [0.16, 1, 0.3, 1]
} as const;

const cardVariants: Variants = {
  hidden: (custom: { direction: number; delay: number }) => ({
    opacity: 0,
    y: 100,
    x: custom.direction,
    scale: 1.1,
    transition: transitionEvent
  }),
  visible: (custom: { direction: number; delay: number }) => ({
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: { ...transitionEvent, delay: custom.delay }
  })
};

const VIEWPORT = { once: false, amount: 0.2, margin: "10000px 0px -5% 0px" } as const;

const DIR_MAP = {
  [WorkCardDir.LEFT]: -100,
  [WorkCardDir.CENTER]: 0,
  [WorkCardDir.RIGHT]: 100
};

const ORIGIN_MAP = {
  [WorkCardDir.LEFT]: "origin-bottom-left",
  [WorkCardDir.CENTER]: "origin-bottom",
  [WorkCardDir.RIGHT]: "origin-bottom-right"
};

const TYPE_MAP = {
  [WorkCardType.LONG]: "row-span-2 col-span-1 aspect-[324/488]",
  [WorkCardType.SHORT]: "row-span-1 col-span-1 aspect-[324/236]",
};

type Props = {
  image: string;
  delay?: number;
  type?: WorkCardType | "long" | "short";
  dir?: WorkCardDir | "left" | "center" | "right";
  className?: string;
};

function WorkCard({
  image,
  delay = 0,
  type = WorkCardType.SHORT,
  dir = WorkCardDir.CENTER,
  className = ""
}: Props) {
  const direction = DIR_MAP[dir] || 0;
  const typeClasses = TYPE_MAP[type] || TYPE_MAP.short;
  const originClass = ORIGIN_MAP[dir] || ORIGIN_MAP.center;

  const custom = { direction, delay };

  return (
    <motion.div
      custom={custom}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
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
