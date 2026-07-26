import { useEffect, useRef } from 'react'

export function ProjectMedia({ image, hoverImage }: { image: string; hoverImage: string; effect?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (hoverImage === image) return
    const wrap = wrapRef.current
    if (!wrap) return

    let running = true
    let gl: WebGLRenderingContext | null = null
    let frame = 0
    let targetHover = 0
    let currentHover = 0
    let baseTex: WebGLTexture | null = null
    let hoverTex: WebGLTexture | null = null
    let baseImg: HTMLImageElement | null = null
    let overImg: HTMLImageElement | null = null
    let loaded = 0
    let program: WebGLProgram | null = null
    let buf: WebGLBuffer | null = null
    let uRes: WebGLUniformLocation | null = null
    let uBase: WebGLUniformLocation | null = null
    let uHov: WebGLUniformLocation | null = null
    let uProg: WebGLUniformLocation | null = null
    let observer: IntersectionObserver | null = null

    const cleanup = () => {
      running = false
      cancelAnimationFrame(frame)
      if (observer) observer.disconnect()
      if (wrap) {
        // Remove listeners might not be needed if we disconnect observer
      }
      if (gl && program) {
        if (baseTex) gl.deleteTexture(baseTex)
        if (hoverTex) gl.deleteTexture(hoverTex)
        if (buf) gl.deleteBuffer(buf)
        gl.deleteProgram(program)
      }
    }

    const init = () => {
      const canvas = canvasRef.current
      if (!canvas || !running) return
      gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' })
      if (!gl) return

      const vertex = `attribute vec2 position; varying vec2 vUv; void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`
      const fragment = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D baseMap;
      uniform sampler2D hoverMap;
      uniform vec2 resolution;
      uniform vec2 baseSize;
      uniform vec2 hoverSize;
      uniform float hoverProgress;

      vec2 containUv(vec2 uv, vec2 imageSize){
        float ca = resolution.x / max(resolution.y, 1.0);
        float ia = imageSize.x / max(imageSize.y, 1.0);
        if(ca > ia) uv.x = (uv.x - .5) * (ia / ca) + .5;
        else        uv.y = (uv.y - .5) * (ca / ia) + .5;
        return uv;
      }

      void main(){
        vec2 uv = containUv(vUv, baseSize);
        vec4 base = texture2D(baseMap, clamp(uv, 0.0, 1.0));
        vec4 over = texture2D(hoverMap, clamp(uv, 0.0, 1.0));

        float blockPx = 20.0;
        vec2 block = floor(vUv * resolution / blockPx);
        float seed = dot(block, vec2(127.1, 311.7));
        float phase = fract(sin(seed) * 43758.5453);

        float reveal = 0.0;
        if (hoverProgress > 0.01) {
            float t = hoverProgress * 1.4 - 0.2;
            reveal = smoothstep(phase - 0.06, phase + 0.06, t);
        }

        vec3 color = mix(base.rgb, over.rgb, reveal);
        gl_FragColor = vec4(color, base.a);
      }`

      const compile = (type: number, src: string): WebGLShader | null => {
        const s = gl!.createShader(type)
        if (!s) return null
        gl!.shaderSource(s, src)
        gl!.compileShader(s)
        if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
          const log = gl!.getShaderInfoLog(s)
          if (log) console.warn('ProjectMedia shader compile error:', log)
          gl!.deleteShader(s)
          return null
        }
        return s
      }

      program = gl.createProgram()
      if (!program) return

      const vs = compile(gl.VERTEX_SHADER, vertex)
      const fs = compile(gl.FRAGMENT_SHADER, fragment)
      if (!vs || !fs) {
        if (vs) gl.deleteShader(vs)
        if (fs) gl.deleteShader(fs)
        gl.deleteProgram(program); program = null
        return
      }

      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(program)
        if (log) console.warn('ProjectMedia program link error:', log)
        gl.deleteProgram(program); program = null
        return
      }

      gl.useProgram(program)

      buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const pos = gl.getAttribLocation(program, 'position')
      gl.enableVertexAttribArray(pos)
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

      const mkTex = () => {
        const t = gl!.createTexture()!
        gl!.bindTexture(gl!.TEXTURE_2D, t)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
        return t
      }
      baseTex = mkTex()
      hoverTex = mkTex()
      baseImg = new Image()
      overImg = new Image()

      uRes  = gl.getUniformLocation(program, 'resolution')
      uBase = gl.getUniformLocation(program, 'baseSize')
      uHov  = gl.getUniformLocation(program, 'hoverSize')
      uProg = gl.getUniformLocation(program, 'hoverProgress')
      gl.uniform1i(gl.getUniformLocation(program, 'baseMap'), 0)
      gl.uniform1i(gl.getUniformLocation(program, 'hoverMap'), 1)

      const upload = (tex: WebGLTexture, img: HTMLImageElement) => {
        if (!gl || !running) return
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        } catch {
          // texture too large for GPU
        }
        loaded += 1
        if (loaded === 2) {
          requestAnimationFrame(() => {
            if (!running) return
            drawFrame()
            canvas.classList.add('is-ready')
          })
        }
      }

      const onLoaded = () => { if (loaded === 2) drawFrame() }
      baseImg.onload = () => upload(baseTex!, baseImg!)
      overImg.onload = () => upload(hoverTex!, overImg!)
      baseImg.addEventListener('load', onLoaded)
      overImg.addEventListener('load', onLoaded)
      baseImg.src = `/assets/projects/${image}`
      overImg.src = `/assets/projects/${hoverImage}`

      const drawFrame = () => {
        if (!running || loaded < 2 || !gl || !program) return
        const dpr = Math.min(devicePixelRatio, 1.5)
        const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
        const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w; canvas.height = h
          gl.viewport(0, 0, w, h)
        }
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, baseTex)
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, hoverTex)
        gl.uniform2f(uRes,  w, h)
        gl.uniform2f(uBase, baseImg!.naturalWidth,  baseImg!.naturalHeight)
        gl.uniform2f(uHov,  overImg!.naturalWidth,  overImg!.naturalHeight)
        gl.uniform1f(uProg, currentHover)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }

      const loop = () => {
        currentHover += (targetHover - currentHover) * 0.1
        drawFrame()
        const settled = Math.abs(currentHover - targetHover) < 0.002
        if (!settled && running) {
          frame = requestAnimationFrame(loop)
        } else {
          frame = 0
          currentHover = targetHover
          drawFrame()
        }
      }

      const onEnter = () => {
        targetHover = 1
        if (frame === 0) frame = requestAnimationFrame(loop)
      }
      const onLeave = () => {
        targetHover = 0
        if (frame === 0) frame = requestAnimationFrame(loop)
      }

      wrap.addEventListener('pointerenter', onEnter)
      wrap.addEventListener('pointerleave', onLeave)
    }

    observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return
      observer!.disconnect()
      observer = null
      init()
    }, { rootMargin: '200px' })
    observer.observe(wrap)

    return cleanup
  }, [hoverImage, image])

  return (
    <div className="project-shader relative w-full overflow-hidden" ref={wrapRef}>
      <img className="block w-full" src={`/assets/projects/${image}`} alt="" loading="lazy" />
      <canvas className="absolute inset-0 z-[1] size-full opacity-0 transition-opacity duration-[350ms]" ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
