import { type ReactNode, useState, useLayoutEffect } from "react";
import { motion, type Variants } from "motion/react";

type Props = {
  children?: ReactNode;
};

const transitionEvent = {
  duration: 1.4,
  ease: [0.16, 1, 0.3, 1]
};

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

function WorkCard({
  className,
  direction,
  delay,
  isMobile
}: {
  className: string;
  direction: number;
  delay: number;
  isMobile: boolean;
}) {
  return (
    <motion.div
      custom={{ direction: isMobile ? 0 : direction, delay }}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2, margin: "10000px 0px -5% 0px" }}
      className={`bg-light rounded-[32px] [corner-shape:superellipse(1.2)] ${className}`}
    />
  );
}

export default function Works({ children }: Props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useLayoutEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center relative gap-12 mt-92 z-20 max-w-7xl w-full px-8 mx-auto pb-48 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-start items-center gap-8 w-full pointer-events-auto"
      >
        <h2 className="text-5xl leading-none text-left font-medium text-light relative z-10">
          Works
        </h2>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full h-0.5 mt-2 rounded-full bg-light origin-left"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full auto-rows-[220px] pointer-events-auto">
        <WorkCard isMobile={isMobile} direction={-100} delay={0} className="row-span-2 col-span-1 origin-bottom-left" />
        <WorkCard isMobile={isMobile} direction={0} delay={0.15} className="row-span-1 col-span-1 origin-bottom" />
        <WorkCard isMobile={isMobile} direction={100} delay={0.3} className="row-span-1 col-span-1 origin-bottom" />
        <WorkCard isMobile={isMobile} direction={0} delay={0.45} className="row-span-2 col-span-1 origin-bottom-right" />
      </div>

      <div className="pointer-events-auto w-full">
        {children}
      </div>
    </div>
  );
}
