import { useLayoutEffect, useRef, useCallback, useMemo, memo } from 'react';
import { type ThemeColor } from '@/types/theme';
import { motion } from 'motion/react';
import { clamp, lerp, cubicBezier } from '@/lib/math';
import { type RainbowStringsProps } from '@/types/common';
import { RAINBOW_MAP } from '@/lib/constants';
import ProgressiveBlur from './ui/ProgressiveBlur';
import Works from './Works';

const RainbowStrings = ({
  children,
  className = '',
  onColorClick,
}: RainbowStringsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const layoutRef = useRef({
    scrollable: 0,
    offsetTop: 0,
    dpr: 1,
    width: 0,
    height: 0,
  });
  const locsRef = useRef<{
    res: WebGLUniformLocation | null;
    op: WebGLUniformLocation | null;
    pos: number;
    col: number;
  } | null>(null);
  const buffersRef = useRef<{
    pos: WebGLBuffer | null;
    col: WebGLBuffer | null;
  } | null>(null);
  const arraysRef = useRef<{ pos: Float32Array; col: Float32Array } | null>(
    null
  );

  const current = useRef(0);
  const target = useRef(0);
  const rafId = useRef(0);
  const isAnimatingRef = useRef(false);
  const isAtTopRef = useRef(true);
  const entryStartRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  const RAINBOW_COLORS = useMemo(
    () => Object.keys(RAINBOW_MAP) as ThemeColor[],
    []
  );
  const N = RAINBOW_COLORS.length;

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };

  const colorsRgb = useMemo(
    () => RAINBOW_COLORS.map(c => hexToRgb(RAINBOW_MAP[c])),
    [RAINBOW_COLORS]
  );

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false });
    if (!gl) return;
    glRef.current = gl;

    const vs = `
      attribute vec2 position;
      attribute vec3 color;
      varying vec3 vColor;
      uniform vec2 resolution;
      void main() {
        vColor = color;
        vec2 zeroToOne = position / resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      }
    `;

    const fs = `
      precision mediump float;
      varying vec3 vColor;
      uniform float opacity;
      void main() {
        gl_FragColor = vec4(vColor, opacity);
      }
    `;

    const createShader = (
      gl: WebGL2RenderingContext,
      type: number,
      source: string
    ) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    programRef.current = program;

    locsRef.current = {
      res: gl.getUniformLocation(program, 'resolution'),
      op: gl.getUniformLocation(program, 'opacity'),
      pos: gl.getAttribLocation(program, 'position'),
      col: gl.getAttribLocation(program, 'color'),
    };

    buffersRef.current = {
      pos: gl.createBuffer(),
      col: gl.createBuffer(),
    };

    const vertexCount = N * 6;
    arraysRef.current = {
      pos: new Float32Array(vertexCount * 2),
      col: new Float32Array(vertexCount * 3),
    };

    if (
      buffersRef.current?.pos &&
      buffersRef.current?.col &&
      arraysRef.current
    ) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffersRef.current.pos);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        arraysRef.current.pos.byteLength,
        gl.DYNAMIC_DRAW
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, buffersRef.current.col);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        arraysRef.current.col.byteLength,
        gl.DYNAMIC_DRAW
      );
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  }, [N]);

  const draw = useCallback(() => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    const locs = locsRef.current;
    const buffers = buffersRef.current;
    const arrays = arraysRef.current;
    if (
      !gl ||
      !programRef.current ||
      !canvas ||
      !locs ||
      !buffers ||
      !arrays ||
      !isVisibleRef.current
    ) {
      return false;
    }

    current.current = lerp(current.current, target.current, 0.08);
    const p = current.current;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const program = programRef.current;
    gl.useProgram(program);
    gl.uniform2f(locs.res, canvas.width, canvas.height);

    const { width, dpr } = layoutRef.current;
    const isMobile = width < 768;
    const baseW = (isMobile ? 32 : 52) * dpr;
    const targetW = (isMobile ? 48 : 72) * dpr;
    const baseGap = (isMobile ? 3 : 5) * dpr;

    const basePhase = clamp(p / 0.6, 0, 1);
    const currentW = lerp(baseW, targetW, basePhase);
    const currentGap = lerp(2 * dpr, baseGap, basePhase);

    const easedExpand = cubicBezier(clamp((p - 0.9) / 0.1, 0, 1));
    const fadeT = clamp((p - 0.95) / 0.05, 0, 1);
    const currentOpacity = 1 - fadeT;

    const centerDist = currentW + currentGap;
    const maxSpread = canvas.width / (N - 1);

    gl.uniform1f(locs.op, currentOpacity);

    const ENTRY_DELAY = 400;
    const ENTRY_DURATION = 900;
    const ENTRY_STAGGER = 120;
    const now = performance.now();
    const entryStart = entryStartRef.current ?? now;

    let posOffset = 0;
    let colorOffset = 0;
    const positions = arrays.pos;
    const colors = arrays.col;

    RAINBOW_COLORS.forEach((color, i) => {
      const rgb = colorsRgb[i];
      const side = i - (N - 1) / 2;
      const baseX = canvas.width / 2 + side * centerDist;
      const targetX = canvas.width / 2 + side * maxSpread;
      const exitBoost = fadeT * 0.5 * maxSpread;
      const currentX = lerp(baseX, targetX, easedExpand) + side * exitBoost;
      const scaleX = 1 - 0.95 * Math.min(easedExpand, 1);
      const rectW = currentW * scaleX;

      const staggerIndex = Math.abs(i - (N - 1) / 2);
      const elapsed =
        now - entryStart - ENTRY_DELAY - staggerIndex * ENTRY_STAGGER;
      const entryT = clamp(elapsed / ENTRY_DURATION, 0, 1);
      const entryEased = cubicBezier(entryT);
      const slideOffset = (1 - entryEased) * canvas.height;

      const x1 = currentX - rectW / 2;
      const x2 = currentX + rectW / 2;
      const y1 = slideOffset;
      const y2 = canvas.height + slideOffset;

      positions[posOffset++] = x1;
      positions[posOffset++] = y1;
      positions[posOffset++] = x2;
      positions[posOffset++] = y1;
      positions[posOffset++] = x1;
      positions[posOffset++] = y2;
      positions[posOffset++] = x1;
      positions[posOffset++] = y2;
      positions[posOffset++] = x2;
      positions[posOffset++] = y1;
      positions[posOffset++] = x2;
      positions[posOffset++] = y2;

      for (let j = 0; j < 6; j++) {
        colors[colorOffset++] = rgb[0];
        colors[colorOffset++] = rgb[1];
        colors[colorOffset++] = rgb[2];
      }
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    gl.enableVertexAttribArray(locs.pos);
    gl.vertexAttribPointer(locs.pos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.col);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, colors);
    gl.enableVertexAttribArray(locs.col);
    gl.vertexAttribPointer(locs.col, 3, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLES, 0, posOffset / 2);

    const ENTRY_TOTAL = 1500 + 900 + Math.ceil(N / 2) * 120;
    const entryDone =
      entryStartRef.current !== null &&
      performance.now() - entryStartRef.current > ENTRY_TOTAL;

    return !entryDone || Math.abs(current.current - target.current) > 0.0001;
  }, [RAINBOW_COLORS, N, colorsRgb]);

  const startAnimationLoop = useCallback(() => {
    if (isAnimatingRef.current || !isVisibleRef.current) return;
    isAnimatingRef.current = true;

    const tick = () => {
      const keepAnimating = draw();
      if (!keepAnimating) {
        isAnimatingRef.current = false;
        return;
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
  }, [draw]);

  useLayoutEffect(() => {
    initGL();
    const updateLayout = () => {
      const el = sectionRef.current;
      const canvas = canvasRef.current;
      const gl = glRef.current;
      if (!el || !canvas || !gl) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);

      layoutRef.current = {
        scrollable: el.scrollHeight - window.innerHeight,
        offsetTop: el.offsetTop,
        dpr,
        width: window.innerWidth,
        height: window.innerHeight,
      };
      startAnimationLoop();
    };

    const onScroll = () => {
      const { scrollable, offsetTop } = layoutRef.current;
      if (!scrollable) return;
      target.current = clamp(
        (window.scrollY - offsetTop) / Math.max(scrollable, 1),
        0,
        1.0
      );
      isAtTopRef.current = window.scrollY < 50;
      startAnimationLoop();
    };

    updateLayout();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (entryStartRef.current === null) {
            entryStartRef.current = performance.now();
          }
          startAnimationLoop();
        } else if (isAnimatingRef.current) {
          cancelAnimationFrame(rafId.current);
          isAnimatingRef.current = false;
        }
      },
      { threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateLayout);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateLayout);
      cancelAnimationFrame(rafId.current);
      isAnimatingRef.current = false;
      if (glRef.current) {
        if (buffersRef.current?.pos)
          glRef.current.deleteBuffer(buffersRef.current.pos);
        if (buffersRef.current?.col)
          glRef.current.deleteBuffer(buffersRef.current.col);
        if (programRef.current) glRef.current.deleteProgram(programRef.current);
      }
    };
  }, [initGL, startAnimationLoop]);

  return (
    <div ref={sectionRef} className={`relative w-full ${className}`}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            onClick={e => {
              if (!isAtTopRef.current) return;
              const x = e.clientX * layoutRef.current.dpr;
              const canvas = canvasRef.current;
              if (!canvas) return;
              const dpr = layoutRef.current.dpr;
              const p = current.current;
              const isMobile = layoutRef.current.width < 768;
              const baseW = (isMobile ? 32 : 52) * dpr;
              const targetW = (isMobile ? 38 : 78) * dpr;
              const baseGap = (isMobile ? 3 : 5) * dpr;
              const currentW = lerp(baseW, targetW, clamp(p / 0.2, 0, 1));
              const currentGap = lerp(2 * dpr, baseGap, clamp(p / 0.2, 0, 1));
              const easedExpand = cubicBezier(clamp((p - 0.6) / 0.2, 0, 1));
              const centerDist = currentW + currentGap;
              const maxSpread = canvas.width / (N - 1);

              RAINBOW_COLORS.forEach((color, i) => {
                const side = i - (N - 1) / 2;
                const baseX = canvas.width / 2 + side * centerDist;
                const targetX = canvas.width / 2 + side * maxSpread;
                const currentX = lerp(baseX, targetX, easedExpand);
                const rectW = currentW * (1 - 0.95 * easedExpand);
                if (Math.abs(x - currentX) < rectW / 2 + 10)
                  onColorClick?.(color);
              });
            }}
            style={{ pointerEvents: 'auto' }}
          />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.2, duration: 1 }}
        className="relative w-full z-20 py-24 md:py-48 pointer-events-none !pb-64"
      >
        <Works>{children}</Works>
        <ProgressiveBlur className="z-[11] h-full max-h-[140vh] top-96" />
      </motion.div>
    </div>
  );
};

export default memo(RainbowStrings);
