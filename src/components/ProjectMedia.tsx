import { useEffect, useRef } from 'react'

export function ProjectMedia({ image, hoverImage }: { image: string; hoverImage: string; effect?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const gl = canvas?.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' })
    if (!canvas || !wrap || !gl) return

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

      // 4x4 Bayer ordered dither matrix (normalised to 0..1)
      float bayer4x4(vec2 pos) {
        int x = int(mod(pos.x, 4.0));
        int y = int(mod(pos.y, 4.0));
        float m[16];
        m[0]  =  0.0/16.0; m[1]  =  8.0/16.0; m[2]  =  2.0/16.0; m[3]  = 10.0/16.0;
        m[4]  = 12.0/16.0; m[5]  =  4.0/16.0; m[6]  = 14.0/16.0; m[7]  =  6.0/16.0;
        m[8]  =  3.0/16.0; m[9]  = 11.0/16.0; m[10] =  1.0/16.0; m[11] =  9.0/16.0;
        m[12] = 15.0/16.0; m[13] =  7.0/16.0; m[14] = 13.0/16.0; m[15] =  5.0/16.0;
        return m[y * 4 + x];
      }

      vec2 coverUv(vec2 uv, vec2 imageSize){
        float ca = resolution.x / max(resolution.y, 1.0);
        float ia = imageSize.x / max(imageSize.y, 1.0);
        if(ca > ia) uv.y = (uv.y - .5) * (ia / ca) + .5;
        else        uv.x = (uv.x - .5) * (ca / ia) + .5;
        return uv;
      }

      void main(){
        vec2 screenPos = vUv * resolution;
        vec2 cell = floor(screenPos / 4.0);
        float threshold = bayer4x4(cell);
        float reveal = step(threshold, hoverProgress);
        vec2 baseUv  = coverUv(vUv, baseSize);
        vec2 hoverUv = coverUv(vUv, hoverSize);
        vec4 base = texture2D(baseMap,  clamp(baseUv,  0.0, 1.0));
        vec4 over = texture2D(hoverMap, clamp(hoverUv, 0.0, 1.0));
        gl_FragColor = mix(base, over, reveal);
      }`

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment))
    gl.linkProgram(program)
    gl.useProgram(program)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const mkTex = () => {
      const t = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, t)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      return t
    }
    const baseTex = mkTex()
    const hoverTex = mkTex()
    const baseImg = new Image()
    const overImg = new Image()
    let loaded = 0
    let running = true

    const uRes  = gl.getUniformLocation(program, 'resolution')
    const uBase = gl.getUniformLocation(program, 'baseSize')
    const uHov  = gl.getUniformLocation(program, 'hoverSize')
    const uProg = gl.getUniformLocation(program, 'hoverProgress')
    gl.uniform1i(gl.getUniformLocation(program, 'baseMap'), 0)
    gl.uniform1i(gl.getUniformLocation(program, 'hoverMap'), 1)

    const upload = (tex: WebGLTexture, img: HTMLImageElement) => {
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      loaded += 1
      if (loaded === 2) canvas.classList.add('is-ready')
    }
    baseImg.onload = () => upload(baseTex, baseImg)
    overImg.onload = () => upload(hoverTex, overImg)
    baseImg.src = `/assets/${image}`
    overImg.src = `/assets/${hoverImage}`

    let targetHover = 0
    let currentHover = 0
    let frame = 0

    // Draw a single frame — only draws, never schedules next frame itself
    const drawFrame = () => {
      if (!running || loaded < 2) return
      const dpr = Math.min(devicePixelRatio, 1.5)
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      currentHover += (targetHover - currentHover) * 0.1
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, baseTex)
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, hoverTex)
      gl.uniform2f(uRes,  w, h)
      gl.uniform2f(uBase, baseImg.naturalWidth,  baseImg.naturalHeight)
      gl.uniform2f(uHov,  overImg.naturalWidth,  overImg.naturalHeight)
      gl.uniform1f(uProg, currentHover)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    // Loop only runs while hover is transitioning
    const loop = () => {
      drawFrame()
      const settled = Math.abs(currentHover - targetHover) < 0.002
      if (!settled && running) {
        frame = requestAnimationFrame(loop)
      } else {
        frame = 0
        // Snap to target and draw final frame
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

    // Draw one frame on load so canvas shows correct initial state
    const onLoaded = () => { if (loaded === 2) drawFrame() }
    baseImg.addEventListener('load', onLoaded)
    overImg.addEventListener('load', onLoaded)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      wrap.removeEventListener('pointerenter', onEnter)
      wrap.removeEventListener('pointerleave', onLeave)
      gl.deleteTexture(baseTex)
      gl.deleteTexture(hoverTex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(program)
    }
  }, [hoverImage, image])

  return (
    <div className="project-shader relative aspect-[1.45] w-full overflow-hidden max-[760px]:aspect-[1.25]" ref={wrapRef}>
      <img className="absolute inset-0 block size-full object-cover" src={`/assets/${image}`} alt="" loading="lazy" />
      <canvas className="absolute inset-0 z-[1] block size-full object-cover opacity-0 transition-opacity duration-[350ms]" ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
