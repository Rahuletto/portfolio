import React from 'react';
import {  useScroll, useTransform } from 'framer-motion';
import * as m from "motion/react-m"

const ScrollLine: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.95, 1],
    ['var(--color)', 'var(--color-light)', 'var(--color)']
  );
  const width = useTransform(scrollYProgress, [0, 1], ['2px', '4px']);

  return (
    <m.div
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
      <m.div
        style={{
          height: height.get(),
          width: width.get(),
          backgroundColor: backgroundColor.get(),
          willChange: 'height, background, width',
        }}
        className="rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
    </m.div>
  );
};

export default ScrollLine;