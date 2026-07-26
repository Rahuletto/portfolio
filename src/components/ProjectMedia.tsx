import { useEffect, useRef } from 'react'

export function ProjectMedia({ image, hoverImage, effect }: { image: string; hoverImage: string; effect: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const gl = canvas?.getContext('webgl', { alpha: true, antialias: false })
    if (!canvas || !wrap || !gl) return

    const vertex = `attribute vec2 position; varying vec2 vUv; void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`
    const fragment = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D baseMap;
      uniform sampler2D hoverMap;
      uniform vec2 resolution;
      uniform vec2 baseSize;
      uniform vec2 hoverSize;
      uniform vec2 pointer;
      uniform vec2 velocity;
      uniform float hoverProgress;
      uniform float time;
      uniform float effectMode;

      vec2 coverUv(vec2 uv,vec2 imageSize){
        float canvasAspect=resolution.x/max(resolution.y,1.0);
        float imageAspect=imageSize.x/max(imageSize.y,1.0);
        if(canvasAspect>imageAspect){
          uv.y=(uv.y-.5)*(imageAspect/canvasAspect)+.5;
        }else{
          uv.x=(uv.x-.5)*(canvasAspect/imageAspect)+.5;
        }
        return uv;
      }

      vec2 swirl(vec2 uv,vec2 center,float radius,float angle){
        vec2 p=uv-center;
        p.x*=resolution.x/resolution.y;
        float distanceToCenter=length(p);
        if(distanceToCenter<radius){
          float rotation=angle*pow(1.0-distanceToCenter/radius,2.0);
          float c=cos(rotation),s=sin(rotation);
          p=mat2(c,-s,s,c)*p;
        }
        p.x/=resolution.x/resolution.y;
        return p+center;
      }

      float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

      void main(){
        vec2 uv=vUv;
        vec2 p=pointer;
        float h=hoverProgress;
        if(effectMode<.5){
          float curl=sin(uv.y*3.14159265)*h;
          uv.x+=(p.x-.5)*curl*.075+velocity.x*curl*.16;
          uv.y+=(p.y-.5)*sin(uv.x*3.14159265)*h*.026;
        }else if(effectMode<1.5){
          float frequency=19.0;
          uv.x+=sin((uv.y+p.y)*frequency+time*1.2)*.013*h;
          uv.y+=sin((uv.x-p.x)*frequency-time*.9)*.008*h;
        }else if(effectMode<2.5){
          uv=swirl(uv,p,.38,h*.58+length(velocity)*1.8);
        }else{
          vec2 cells=floor(uv*vec2(42.0,30.0));
          float noise=hash21(cells);
          uv+=(noise-.5)*velocity*.34*h;
        }

        vec2 baseUv=coverUv(uv,baseSize);
        vec2 hoverUv=coverUv(uv,hoverSize);
        vec2 aberration=normalize(uv-p+vec2(.0001))*length(velocity)*.8*h;
        vec4 base=texture2D(baseMap,clamp(baseUv,0.0,1.0));
        vec4 over=texture2D(hoverMap,clamp(hoverUv,0.0,1.0));
        if(length(velocity)>.0001){
          over.r=texture2D(hoverMap,clamp(hoverUv+aberration,0.0,1.0)).r;
          over.b=texture2D(hoverMap,clamp(hoverUv-aberration,0.0,1.0)).b;
        }
        float distanceToPointer=distance(vUv*vec2(resolution.x/resolution.y,1.0),p*vec2(resolution.x/resolution.y,1.0));
        float localReveal=1.0-smoothstep(.08,.58,distanceToPointer);
        float reveal=smoothstep(.04,.92,h+localReveal*h*.22);
        vec3 color=mix(base.rgb,over.rgb,reveal);
        vec3 orange=vec3(.878,.314,.208);
        float glow=exp(-distanceToPointer*8.5)*h;
        color=mix(color,1.0-(1.0-color)*(1.0-orange),glow*.16);
        float edgeGlow=smoothstep(.18,.0,abs(distanceToPointer-.17))*h;
        color+=orange*edgeGlow*.055;
        gl_FragColor=vec4(color,mix(base.a,over.a,reveal));
      }`
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return shader
    }
    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment))
    gl.linkProgram(program)
    gl.useProgram(program)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const createTexture = () => {
      const texture = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      return texture
    }
    const baseTexture = createTexture()
    const hoverTexture = createTexture()
    const baseImage = new Image()
    const overImage = new Image()
    let loaded = 0
    let running = true
    let inViewport = false
    const upload = (texture: WebGLTexture, source: HTMLImageElement) => {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
      loaded += 1
      if (loaded === 2) canvas.classList.add('is-ready')
    }
    baseImage.onload = () => upload(baseTexture, baseImage)
    overImage.onload = () => upload(hoverTexture, overImage)
    baseImage.src = `/assets/${image}`
    overImage.src = `/assets/${hoverImage}`

    const uniforms = {
      resolution: gl.getUniformLocation(program, 'resolution'),
      baseSize: gl.getUniformLocation(program, 'baseSize'),
      hoverSize: gl.getUniformLocation(program, 'hoverSize'),
      pointer: gl.getUniformLocation(program, 'pointer'),
      velocity: gl.getUniformLocation(program, 'velocity'),
      hoverProgress: gl.getUniformLocation(program, 'hoverProgress'),
      time: gl.getUniformLocation(program, 'time'),
      effectMode: gl.getUniformLocation(program, 'effectMode'),
    }
    gl.uniform1i(gl.getUniformLocation(program, 'baseMap'), 0)
    gl.uniform1i(gl.getUniformLocation(program, 'hoverMap'), 1)
    const mouse = { x: .5, y: .5, previousX: .5, previousY: .5 }
    let targetHover = 0
    let currentHover = 0
    let frame = 0
    const started = performance.now()
    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      mouse.x = (event.clientX - rect.left) / rect.width
      mouse.y = 1 - (event.clientY - rect.top) / rect.height
    }
    const onEnter = () => { targetHover = 1 }
    const onLeave = () => { targetHover = 0 }
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerenter', onEnter)
    wrap.addEventListener('pointerleave', onLeave)

    const draw = () => {
      if (!running || !inViewport || document.hidden) {
        frame = 0
        return
      }
      const dpr = Math.min(devicePixelRatio, 1.5)
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
      currentHover += (targetHover - currentHover) * .075
      const velocityX = mouse.x - mouse.previousX
      const velocityY = mouse.y - mouse.previousY
      mouse.previousX += velocityX * .22
      mouse.previousY += velocityY * .22
      if (loaded === 2) {
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, baseTexture)
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, hoverTexture)
        gl.uniform2f(uniforms.resolution, width, height)
        gl.uniform2f(uniforms.baseSize, baseImage.naturalWidth, baseImage.naturalHeight)
        gl.uniform2f(uniforms.hoverSize, overImage.naturalWidth, overImage.naturalHeight)
        gl.uniform2f(uniforms.pointer, mouse.x, mouse.y)
        gl.uniform2f(uniforms.velocity, velocityX, velocityY)
        gl.uniform1f(uniforms.hoverProgress, currentHover)
        gl.uniform1f(uniforms.time, (performance.now() - started) / 1000)
        gl.uniform1f(uniforms.effectMode, effect)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }
      frame = requestAnimationFrame(draw)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry?.isIntersecting ?? false
        if (inViewport && running && frame === 0) draw()
        if (!inViewport && frame !== 0) {
          cancelAnimationFrame(frame)
          frame = 0
        }
      },
      { rootMargin: '160px' },
    )
    const onVisibilityChange = () => {
      if (!document.hidden && inViewport && running && frame === 0) draw()
    }
    observer.observe(wrap)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerenter', onEnter)
      wrap.removeEventListener('pointerleave', onLeave)
      gl.deleteTexture(baseTexture)
      gl.deleteTexture(hoverTexture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [effect, hoverImage, image])

  return (
    <div className="project-shader relative aspect-[1.45] w-full overflow-hidden max-[760px]:aspect-[1.25]" ref={wrapRef}>
      <img className="absolute inset-0 block size-full object-cover" src={`/assets/${image}`} alt="" loading="lazy" />
      <canvas className="absolute inset-0 z-[1] block size-full object-cover opacity-0 transition-opacity duration-[350ms]" ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
