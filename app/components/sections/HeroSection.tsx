import HeroMascot from '@/components/HeroMascot';
import { motion } from 'motion/react';
import { MotionText } from '@/components/ui/MotionText';

export default function HeroSection() {
  const baseDelay = 4.0;

  return (
    <section
      id="hero"
      className="relative min-h-[65vh] flex flex-col justify-center px-6 md:px-16 lg:px-32 pt-36 py-20 md:py-28 pointer-events-none"
    >
      <div className="overflow-hidden mb-4 md:mb-6">
        <motion.p
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: baseDelay,
            duration: 1,
            ease: [0.19, 1, 0.22, 1],
          }}
          className="text-base md:text-xl text-light"
        >
          Marban is a full-stack developer and a UI designer based in India
        </motion.p>
      </div>
      <h1 className="text-[9vw] md:text-7xl lg:text-[96px] font-medium leading-[1.3] md:leading-32 flex flex-col items-start translate-y-[-0.1em]">
        <MotionText text="Being creative is" delay={baseDelay + 0.2} />

        <div className="flex flex-wrap items-center">
          <MotionText
            text="what"
            delay={baseDelay + 0.5}
            className="mr-[0.25em]"
          />
          <div className="relative">
            <motion.span
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: baseDelay + 0.6,
                duration: 1,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="inline-block align-middle pointer-events-auto h-12 md:h-26 lg:h-32"
            >
              <HeroMascot />
            </motion.span>
          </div>
          <MotionText
            text={['makes', 'us']}
            delay={baseDelay + 0.7}
            className="ml-[0.25em]"
          />
        </div>

        <MotionText
          text="human."
          delay={baseDelay + 0.9}
          wordClassName="align-middle relative md:-top-4"
        />
      </h1>
    </section>
  );
}
