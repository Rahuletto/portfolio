import { type ReactNode, memo } from "react";
import { motion } from "motion/react";
import WorkCard from "./works/WorkCard";
import { useViewport } from "@/context/ViewportContext";

type Props = {
  children?: ReactNode;
};

const CARDS = [
  { image: "/assets/works/unix.svg",      type: "short" },
  { image: "/assets/works/mandy.svg",     type: "long"  },
  { image: "/assets/works/simplydjs.svg", type: "long"  },
  { image: "/assets/works/classpro.svg",  type: "long"  },
  { image: "/assets/works/rocket.svg",    type: "short" },
  { image: "/assets/works/Manic.svg",     type: "short" },
  { image: "/assets/works/prism.svg",     type: "short" },
  { image: "/assets/works/ami.svg",       type: "long"  },
  { image: "/assets/works/dreamnity.svg", type: "short" },
] as const;

const HEADER_TRANSITION = { duration: 1.2, ease: [0.16, 1, 0.3, 1] } as const;
const LINE_TRANSITION   = { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 } as const;

function Works({ children }: Props) {
  const { isMobile } = useViewport();

  return (
    <div className="flex flex-col items-center relative gap-12 mt-92 z-20 max-w-7xl w-full px-8 mx-auto pb-48 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={HEADER_TRANSITION}
        className="flex justify-start items-center gap-8 w-full pointer-events-auto"
      >
        <h2 className="text-5xl leading-none text-left font-medium text-light relative z-10">
          Works
        </h2>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={LINE_TRANSITION}
          className="w-full h-0.5 mt-2 rounded-full bg-light origin-left"
        />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full pointer-events-auto mx-auto">
        {CARDS.map((card, index) => {
          const directions = ["left", "center", "right"] as const;
          const autoDir = directions[index % 3];
          const autoDelay = (index % 3) * 0.15;
          
          return (
            <WorkCard
              key={card.image}
              image={card.image}
              dir={isMobile() ? "center" : autoDir}
              type={card.type}
              delay={autoDelay}
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
