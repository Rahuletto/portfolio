import { animEngine } from './animEngine.ts'

class SharedProjectGL {
  private canvas: HTMLCanvasElement | null = null
  private gl: WebGLRenderingContext | null = null
  private prog: WebGLProgram | null = null
  private textureCache = new Map<string, { texture: WebGLTexture; width: number; height: number }>()
  private activeCardId: string | null = null
  private currentProgress = 0
  private lerpControl: ReturnType<typeof animEngine.addLerp> | null = null

  private init(): boolean {
    if (this.gl) return true
    if (typeof window === 'undefined') return false

    this.canvas = document.createElement('canvas')
    this.canvas.width = 800
    this.canvas.height = 600
    this.gl = this.canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    })

    if (!this.gl) return false

    const vert = `
      attribute vec2 p;
      varying vec2 v;
      void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`

    const frag = `
      precision mediump float;
      varying vec2 v;
      uniform sampler2D base, over;
      uniform vec2 res, baseSz, overSz;
      uniform float prog;

      vec2 fit(vec2 uv, vec2 sz){
        float cr = res.x / max(res.y, 1.0);
        float ir = sz.x  / max(sz.y,  1.0);
        if (cr > ir) uv.x = (uv.x - .5) * (ir / cr) + .5;
        else         uv.y = (uv.y - .5) * (cr / ir) + .5;
        return uv;
      }

      void main(){
        vec4 b = texture2D(base, clamp(fit(v, baseSz), 0., 1.));
        vec4 o = texture2D(over, clamp(fit(v, overSz), 0., 1.));

        vec2 blk = floor(v * res / 20.0);
        float seed = dot(blk, vec2(127.1, 311.7));
        float jitter = fract(sin(seed) * 43758.5453) * 0.18;
        float dist = length(v - vec2(0.5)) * 1.4142;
        float phase = clamp(dist + jitter, 0., 1.);

        float t = prog * 1.35 - 0.15;
        float reveal = smoothstep(phase - 0.07, phase + 0.07, t);

        gl_FragColor = vec4(mix(b.rgb, o.rgb, reveal), b.a);
      }`

    const compile = (type: number, src: string) => {
      const s = this.gl!.createShader(type)!
      this.gl!.shaderSource(s, src)
      this.gl!.compileShader(s)
      return s
    }

    this.prog = this.gl.createProgram()!
    const vs = compile(this.gl.VERTEX_SHADER, vert)
    const fs = compile(this.gl.FRAGMENT_SHADER, frag)
    this.gl.attachShader(this.prog, vs)
    this.gl.attachShader(this.prog, fs)
    this.gl.linkProgram(this.prog)
    this.gl.deleteShader(vs)
    this.gl.deleteShader(fs)

    if (!this.gl.getProgramParameter(this.prog, this.gl.LINK_STATUS)) {
      this.gl = null
      return false
    }

    this.gl.useProgram(this.prog)

    const buf = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      this.gl.STATIC_DRAW
    )
    const loc = this.gl.getAttribLocation(this.prog, 'p')
    this.gl.enableVertexAttribArray(loc)
    this.gl.vertexAttribPointer(loc, 2, this.gl.FLOAT, false, 0, 0)

    this.gl.uniform1i(this.gl.getUniformLocation(this.prog, 'base'), 0)
    this.gl.uniform1i(this.gl.getUniformLocation(this.prog, 'over'), 1)

    return true
  }

  public preloadTexture(imagePath: string): Promise<void> {
    if (this.textureCache.has(imagePath)) return Promise.resolve()
    if (!this.init()) return Promise.resolve()

    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        if (!this.gl) return resolve()
        this.gl.activeTexture(this.gl.TEXTURE0)
        const texture = this.gl.createTexture()!
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img)

        this.textureCache.set(imagePath, {
          texture,
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
        resolve()
      }
      img.onerror = () => resolve()
      img.src = `/assets/projects/${imagePath}`
    })
  }

  public startHover(
    cardId: string,
    image: string,
    hoverImage: string,
    targetCanvas: HTMLCanvasElement
  ) {
    if (!this.init()) return

    this.activeCardId = cardId

    Promise.all([
      this.preloadTexture(image),
      this.preloadTexture(hoverImage),
    ]).then(() => {
      if (this.activeCardId !== cardId) return

      if (!this.lerpControl) {
        this.lerpControl = animEngine.addLerp({
          id: `hover_${cardId}`,
          current: this.currentProgress,
          target: 1.0,
          speed: 0.14,
          onUpdate: (val) => {
            this.currentProgress = val
            this.renderToCanvas(image, hoverImage, targetCanvas, val)
          },
          onComplete: () => {
            this.lerpControl = null
          },
        })
      } else {
        this.lerpControl.setTarget(1.0)
      }
    })
  }

  public stopHover(
    cardId: string,
    image: string,
    hoverImage: string,
    targetCanvas: HTMLCanvasElement
  ) {
    if (this.activeCardId !== cardId) return

    if (!this.lerpControl) {
      this.lerpControl = animEngine.addLerp({
        id: `hover_${cardId}`,
        current: this.currentProgress,
        target: 0.0,
        speed: 0.14,
        onUpdate: (val) => {
          this.currentProgress = val
          this.renderToCanvas(image, hoverImage, targetCanvas, val)
        },
        onComplete: () => {
          this.lerpControl = null
          this.activeCardId = null
          const ctx = targetCanvas.getContext('2d')
          if (ctx) ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height)
          targetCanvas.classList.remove('is-ready')
        },
      })
    } else {
      this.lerpControl.setTarget(0.0)
    }
  }

  private renderToCanvas(
    baseKey: string,
    hoverKey: string,
    targetCanvas: HTMLCanvasElement,
    progress: number
  ) {
    if (!this.gl || !this.prog || !this.canvas) return
    const base = this.textureCache.get(baseKey)
    const over = this.textureCache.get(hoverKey)
    if (!base || !over) return

    const dpr = Math.min(window.devicePixelRatio, 1.25)
    const w = Math.max(1, Math.round(targetCanvas.clientWidth * dpr))
    const h = Math.max(1, Math.round(targetCanvas.clientHeight * dpr))

    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
      this.gl.viewport(0, 0, w, h)
    }

    if (targetCanvas.width !== w || targetCanvas.height !== h) {
      targetCanvas.width = w
      targetCanvas.height = h
    }

    this.gl.useProgram(this.prog)

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, base.texture)

    this.gl.activeTexture(this.gl.TEXTURE1)
    this.gl.bindTexture(this.gl.TEXTURE_2D, over.texture)

    this.gl.uniform2f(this.gl.getUniformLocation(this.prog, 'res'), w, h)
    this.gl.uniform2f(this.gl.getUniformLocation(this.prog, 'baseSz'), base.width, base.height)
    this.gl.uniform2f(this.gl.getUniformLocation(this.prog, 'overSz'), over.width, over.height)
    this.gl.uniform1f(this.gl.getUniformLocation(this.prog, 'prog'), progress)

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3)

    const targetCtx = targetCanvas.getContext('2d')
    if (targetCtx) {
      targetCtx.clearRect(0, 0, w, h)
      targetCtx.drawImage(this.canvas, 0, 0)
      targetCanvas.classList.add('is-ready')
    }
  }
}

export const sharedProjectGL = new SharedProjectGL()
