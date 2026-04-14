import { memo } from "react";
import { motion } from "motion/react";

interface ProgressiveBlurProps {
  className?: string;
}

const ProgressiveBlur = ({ className = "" }: ProgressiveBlurProps) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.6, duration: 2 }}
        className="absolute inset-x-0 top-0 h-full transform translate-z-0"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          willChange: "backdrop-filter, opacity",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
};

export default memo(ProgressiveBlur);
