import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { animEngine } from '../engine/animEngine.ts'

export function ProjectMedia({ image, hoverImage }: { image: string; hoverImage: string; effect?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (reducedMotion) return
    if (!hoverImage || hoverImage === image) return
    const wrap = wrapRef.current
    if (!wrap) return
    const link = wrap.closest('a')

    let alive     = true
    let inited    = false
    let gl: WebGLRenderingContext | null = null
    let prog: WebGLProgram | null       = null
    let buf: WebGLBuffer | null         = null
    let baseTex: WebGLTexture | null    = null
    let hoverTex: WebGLTexture | null   = null
    let uProg: WebGLUniformLocation | null = null
    let loaded    = 0
    let cur       = 0
    let lerpControl: ReturnType<typeof animEngine.addLerp> | null = null
    let roObs: ResizeObserver | null = null
    let ioGcObs: IntersectionObserver | null = null
    let initGeneration = 0
    let readyFrame = 0
    let disposeTimer = 0

    const cancelScheduledDispose = () => {
      if (!disposeTimer) return
      clearTimeout(disposeTimer)
      disposeTimer = 0
    }

    const disposeGL = () => {
      cancelScheduledDispose()
      initGeneration += 1
      if (readyFrame) cancelAnimationFrame(readyFrame)
      readyFrame = 0
      inited = false
      loaded = 0
      lerpControl?.stop()
      lerpControl = null
      roObs?.disconnect()
      roObs = null

      const canvas = canvasRef.current
      if (canvas) canvas.classList.remove('is-ready')

      if (gl) {
        if (baseTex)  { gl.deleteTexture(baseTex); baseTex = null }
        if (hoverTex) { gl.deleteTexture(hoverTex); hoverTex = null }
        if (buf)      { gl.deleteBuffer(buf); buf = null }
        if (prog)     { gl.deleteProgram(prog); prog = null }
        const loseExt = gl.getExtension('WEBGL_lose_context')
        if (loseExt) loseExt.loseContext()
        gl = null
      }
    }

    const disposeAll = () => {
      alive = false
      cancelScheduledDispose()
      disposeGL()
      ioGcObs?.disconnect()
      wrap.removeEventListener('pointerenter', onPointerEnter)
      wrap.removeEventListener('pointerleave', onPointerLeave)
      link?.removeEventListener('focus', onPointerEnter)
      link?.removeEventListener('blur', onPointerLeave)
    }

    const draw = (progressVal: number) => {
      if (!alive || loaded < 2 || !gl || !prog) return
      gl.uniform1f(uProg, progressVal)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const onResize = () => {
      const canvas = canvasRef.current
      if (!canvas || !gl || !prog) return
      const dpr = Math.min(devicePixelRatio, 1.25)
      const w = Math.max(1, Math.round(canvas.clientWidth  * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width === w && canvas.height === h) return
      canvas.width  = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(gl.getUniformLocation(prog, 'res'), w, h)
      draw(cur)
    }

    const initGL = () => {
      if (inited || !alive) return
      inited = true
      const generation = ++initGeneration

      const canvas = canvasRef.current
      if (!canvas) {
        inited = false
        return
      }

      gl = canvas.getContext('webgl', {
        alpha:                 true,
        antialias:             false,
        depth:                 false,
        stencil:               false,
        preserveDrawingBuffer: false,
        powerPreference:       'high-performance',
      })
      if (!gl) {
        inited = false
        return
      }

      const vert = `
        attribute vec2 p;
        varying   vec2 v;
        void main(){ v = p*.5+.5; gl_Position = vec4(p,0.,1.); }`

      const frag = `
        precision mediump float;
        varying vec2 v;
        uniform sampler2D base, over;
        uniform vec2 res, baseSz, overSz;
        uniform float prog;

        vec2 fit(vec2 uv, vec2 sz){
          float cr = res.x / max(res.y, 1.0);
          float ir = sz.x  / max(sz.y,  1.0);
          if (cr > ir) uv.x = (uv.x-.5)*(ir/cr)+.5;
          else         uv.y = (uv.y-.5)*(cr/ir)+.5;
          return uv;
        }

        void main(){
          vec4 b = texture2D(base, clamp(fit(v, baseSz), 0., 1.));
          vec4 o = texture2D(over, clamp(fit(v, overSz), 0., 1.));

          vec2  blk    = floor(v * res / 20.0);
          float seed   = dot(blk, vec2(127.1, 311.7));
          float jitter = fract(sin(seed) * 43758.5453) * 0.18;
          float dist   = length(v - vec2(0.5)) * 1.4142;
          float phase  = clamp(dist + jitter, 0., 1.);

          float t      = prog * 1.35 - 0.15;
          float reveal = smoothstep(phase - 0.07, phase + 0.07, t);

          gl_FragColor = vec4(mix(b.rgb, o.rgb, reveal), b.a);
        }`

      const compile = (type: number, src: string) => {
        const s = gl!.createShader(type)!
        gl!.shaderSource(s, src)
        gl!.compileShader(s)
        return s
      }

      prog = gl.createProgram()!
      const vs = compile(gl.VERTEX_SHADER,   vert)
      const fs = compile(gl.FRAGMENT_SHADER, frag)
      gl.attachShader(prog, vs); gl.attachShader(prog, fs)
      gl.linkProgram(prog)
      gl.deleteShader(vs); gl.deleteShader(fs)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.deleteProgram(prog); prog = null; inited = false; return
      }
      gl.useProgram(prog)

      buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, 'p')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

      gl.uniform1i(gl.getUniformLocation(prog, 'base'), 0)
      gl.uniform1i(gl.getUniformLocation(prog, 'over'), 1)
      uProg = gl.getUniformLocation(prog, 'prog')

      const mkTex = (unit: number): WebGLTexture => {
        gl!.activeTexture(unit)
        const t = gl!.createTexture()!
        gl!.bindTexture(gl!.TEXTURE_2D, t)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
        return t
      }

      baseTex  = mkTex(gl.TEXTURE0)
      hoverTex = mkTex(gl.TEXTURE1)
      const context = gl
      const initialBaseTex = baseTex
      const initialHoverTex = hoverTex

      const upload = (tex: WebGLTexture, unit: number, img: HTMLImageElement, szUniform: string) => {
        if (!gl || !prog || !alive) return
        gl.activeTexture(unit)
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img) } catch {}
        gl.uniform2f(gl.getUniformLocation(prog, szUniform), img.naturalWidth, img.naturalHeight)
        loaded++
        if (loaded === 2) {
          onResize()
          draw(cur)
          if (cur > 0) {
            startLerpTo(cur)
          }
          readyFrame = requestAnimationFrame(() => {
            readyFrame = 0
            if (alive && generation === initGeneration) canvas.classList.add('is-ready')
          })
        }
      }

      const baseImg  = new Image()
      const overImg  = new Image()
      baseImg.onload = () => {
        if (generation !== initGeneration || gl !== context) return
        upload(initialBaseTex, context.TEXTURE0, baseImg, 'baseSz')
      }
      overImg.onload = () => {
        if (generation !== initGeneration || gl !== context) return
        upload(initialHoverTex, context.TEXTURE1, overImg, 'overSz')
      }
      baseImg.src = `/assets/projects/${image}`
      overImg.src = `/assets/projects/${hoverImage}`

      roObs = new ResizeObserver(onResize)
      roObs.observe(canvas)
    }

    const startLerpTo = (targetVal: number) => {
      if (!lerpControl) {
        lerpControl = animEngine.addLerp({
          current: cur,
          target: targetVal,
          speed: 0.14,
          onUpdate: (val) => {
            cur = val
            draw(val)
          },
          onComplete: () => {
            lerpControl = null
          },
        })
      } else {
        lerpControl.setTarget(targetVal)
      }
    }

    const onPointerEnter = () => {
      cancelScheduledDispose()
      if (!inited) initGL()
      startLerpTo(1)
    }

    const onPointerLeave = () => {
      startLerpTo(0)
    }

    ioGcObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        cancelScheduledDispose()
        if (!inited) initGL()
      } else if (!entry.isIntersecting && inited) {
        cancelScheduledDispose()
        disposeTimer = window.setTimeout(() => {
          disposeTimer = 0
          if (alive) disposeGL()
        }, 1500)
      }
    }, { rootMargin: '400px' })
    ioGcObs.observe(wrap)

    wrap.addEventListener('pointerenter', onPointerEnter, { passive: true })
    wrap.addEventListener('pointerleave', onPointerLeave, { passive: true })
    link?.addEventListener('focus', onPointerEnter)
    link?.addEventListener('blur', onPointerLeave)

    return disposeAll
  }, [hoverImage, image, reducedMotion])

  return (
    <div className="project-shader relative w-full overflow-hidden" ref={wrapRef}>
      <img className="block w-full" src={`/assets/projects/${image}`} alt="" loading="lazy" />
      <canvas
        className="absolute inset-0 z-[1] size-full opacity-0 transition-opacity duration-[350ms]"
        ref={canvasRef}
        aria-hidden="true"
      />
    </div>
  )
}
