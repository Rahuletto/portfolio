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
        className="absolute inset-x-0 top-0 h-full transform translate-z-0 will-change-opacity backdrop-blur-2xl"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.6) 35%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, black 50%, transparent 70%)",
          maskImage: "radial-gradient(ellipse at center, black 0%, black 50%, transparent 70%)",
        }}
      />
    </div>
  );
};

export default memo(ProgressiveBlur);
