'use client';

import React, { useEffect, useRef, useState } from 'react';

const FPS = 30;

const RocketBlast = () => {
  const [frames, setFrames] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/assets/data/rocket-ascii.json')
      .then(res => res.json())
      .then(data => setFrames(data))
      .catch(err => console.error('Failed to load ASCII frames:', err));
  }, []);

  useEffect(() => {
    if (frames.length === 0) return;
    const el = containerRef.current;
    if (!el) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isVisible = false;

    const start = () => {
      if (intervalId) return;
      intervalId = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % frames.length);
      }, 1000 / FPS);
    };

    const stop = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) start();
      else stop();
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [frames.length]);

  if (frames.length === 0) {
    return (
      <div className="fixed inset-0 bg-dark z-[-1] flex items-center justify-center">
        <div className="text-white/20 font-mono text-xs uppercase tracking-widest animate-pulse">
          Establishing Satellite Link...
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-dark z-[-1] flex items-center justify-center overflow-hidden pointer-events-none"
    >
      <pre
        className="font-mono text-[min(0.5vw,0.8vh)] leading-[1.1] whitespace-pre text-white/40 mix-blend-screen transition-opacity duration-1000 select-none"
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          textShadow: '0 0 10px rgba(255,255,255,0.2)',
        }}
      >
        {frames[currentFrame]}
      </pre>

      <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 bg-radial-vignette opacity-40 pointer-events-none" />
    </div>
  );
};

export default RocketBlast;
