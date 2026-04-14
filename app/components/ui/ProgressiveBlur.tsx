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
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.6) 85%, transparent)",
        }}
      />
    </div>
  );
};

export default memo(ProgressiveBlur);
