import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollLine: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['var(--color)', 'var(--color)', 'var(--color-light)']
  );
  const width = useTransform(scrollYProgress, [0, 1], ['2px', '4px']);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        right: '0px',
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        zIndex: 50,
      }}
    >
      <motion.div
        style={{
          height,
          width,
          backgroundColor,
        }}
        className="rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

export default ScrollLine;