import { useLayoutEffect, useRef } from "react";

const ScrollProgress = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const invertElements = useRef<NodeListOf<Element> | null>(null);
  const stateRef = useRef({
    progress: 0,
    isInverted: false,
    width: 0,
    dpr: 1
  });

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateInversion = () => {
      if (!invertElements.current) {
        invertElements.current = document.querySelectorAll('[data-color="invert"]');
      }
      let found = false;
      const sampleY = 16;
      invertElements.current.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (sampleY >= rect.top && sampleY <= rect.bottom) found = true;
      });
      stateRef.current.isInverted = found;
    };

    const draw = () => {
      const { progress, isInverted, width, dpr } = stateRef.current;
      const height = 32 * dpr;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const tickCount = Math.floor((width / 8));
      const gap = (width * dpr) / tickCount;
      const tickW = 2 * dpr;
      const tickH = 12 * dpr;
      const y = (height - tickH) / 2;

      for (let i = 0; i < tickCount; i++) {
        const tickPos = (i / tickCount) * 100;
        const isCompleted = tickPos <= progress;
        const x = i * gap + (gap / 2);

        ctx.beginPath();
        ctx.roundRect(x - tickW / 2, y, tickW, tickH, tickW / 2);
        
        if (isInverted) {
          ctx.fillStyle = isCompleted ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.3)";
        } else {
          ctx.fillStyle = isCompleted ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.3)";
        }
        ctx.fill();
      }
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      stateRef.current.progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      updateInversion();
      draw();
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const dpr = window.devicePixelRatio || 1;
      const height = 32;
      
      stateRef.current.width = width;
      stateRef.current.dpr = dpr;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      invertElements.current = document.querySelectorAll('[data-color="invert"]');
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 right-0 h-8 z-45 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default ScrollProgress;
