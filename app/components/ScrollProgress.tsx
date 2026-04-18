import { useLayoutEffect, useRef } from 'react';

import { getScrollProgress } from '@/lib/dom';

const ScrollProgress = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    progress: 0,
    isInverted: false,
    width: 0,
    dpr: 1,
  });

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const { progress, isInverted, width, dpr } = stateRef.current;
      const height = 32 * dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const tickCount = Math.floor(width / 8);
      const gap = (width * dpr) / tickCount;
      const tickW = 2 * dpr;
      const tickH = 12 * dpr;
      const y = (height - tickH) / 2;

      for (let i = 0; i < tickCount; i++) {
        const tickPos = (i / tickCount) * 100;
        const isCompleted = tickPos <= progress;
        const x = i * gap + gap / 2;

        ctx.beginPath();
        ctx.roundRect(x - tickW / 2, y, tickW, tickH, tickW / 2);

        if (isInverted) {
          ctx.fillStyle = isCompleted
            ? 'rgba(0, 0, 0, 1)'
            : 'rgba(0, 0, 0, 0.3)';
        } else {
          ctx.fillStyle = isCompleted
            ? 'rgba(255, 255, 255, 1)'
            : 'rgba(255, 255, 255, 0.3)';
        }
        ctx.fill();
      }
    };

    let pending = false;
    const handleScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const nextProgress = getScrollProgress() * 100;
        if (Math.abs(nextProgress - stateRef.current.progress) < 0.15) return;
        stateRef.current.progress = nextProgress;
        draw();
      });
    };

    const observer = new IntersectionObserver(
      entries => {
        stateRef.current.isInverted = entries.some(e => e.isIntersecting);
        draw();
      },
      { rootMargin: `-16px 0px -${window.innerHeight - 17}px 0px` }
    );

    const observeElements = () => {
      observer.disconnect();
      document
        .querySelectorAll('[data-color="invert"]')
        .forEach(el => observer.observe(el));
    };

    const handleResize = () => {
      const width = window.innerWidth - 48;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const height = 32;

      stateRef.current.width = width;
      stateRef.current.dpr = dpr;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      observeElements();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 right-0 h-8 px-6 z-45 pointer-events-none"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default ScrollProgress;
