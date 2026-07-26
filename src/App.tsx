import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import './App.css'
import { GridOverlay } from './components/GridOverlay.tsx'
import { projects } from './data/projects.ts'
import { GlobalWebGLScene } from './hero/GlobalWebGLScene.tsx'
import { useSmoothScroll } from './useSmoothScroll.ts'

type ModelSceneProps = {
  model: string
  variant: 'hello' | 'cursor' | 'finale'
}

function ProjectMedia({ image, hoverImage, effect }: { image: string; hoverImage: string; effect: number }) {
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
    <div className="project-shader" ref={wrapRef}>
      <img src={`/assets/${image}`} alt="" loading="lazy" />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}

function ModelScene({ model, variant }: ModelSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0, 7)
    scene.add(new THREE.HemisphereLight(0xffddd4, 0x21100d, variant === 'cursor' ? 3.8 : 2.8))
    const key = new THREE.DirectionalLight(0xffffff, 4.5)
    key.position.set(-3, 5, 5)
    scene.add(key)
    const rim = new THREE.PointLight(0xe05035, 25, 20)
    rim.position.set(4, -2, 4)
    scene.add(rim)

    let root: THREE.Group | null = null
    let frame = 0
    let pointerX = 0
    let pointerY = 0
    let disposed = false
    let inViewport = false
    const basePosition = variant === 'cursor'
      ? new THREE.Vector3(1.72, -0.72, 0.5)
      : new THREE.Vector3(0, 0, 0)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const viewportObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry?.isIntersecting ?? false
      },
      { rootMargin: '160px' },
    )
    viewportObserver.observe(canvas)

    new GLTFLoader().load(model, (gltf) => {
      if (disposed) return
      root = gltf.scene
      const box = new THREE.Box3().setFromObject(root)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      const targetSize = variant === 'hello' ? 5.1 : variant === 'cursor' ? 1.55 : 7.2
      const scale = targetSize / Math.max(size.x, size.y, size.z)
      root.scale.setScalar(scale)
      root.position.copy(center).multiplyScalar(-scale).add(basePosition)
      root.rotation.set(
        variant === 'cursor' ? 0.16 : -0.08,
        variant === 'cursor' ? -0.34 : -0.18,
        variant === 'cursor' ? -0.48 : -0.03,
      )
      root.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return
        child.material = new THREE.MeshPhysicalMaterial({
          color: variant === 'hello' ? 0xe05035 : 0xd8462d,
          metalness: variant === 'cursor' ? 0.04 : 0.12,
          roughness: variant === 'cursor' ? 0.1 : 0.18,
          clearcoat: 1,
          clearcoatRoughness: variant === 'cursor' ? 0.03 : 0.08,
          transmission: variant === 'cursor' ? 0.12 : 0,
          thickness: variant === 'cursor' ? 1.1 : 0,
          ior: variant === 'cursor' ? 1.22 : 1.5,
          iridescence: variant === 'cursor' ? 0.38 : 0.22,
          iridescenceIOR: 1.35,
        })
      })
      scene.add(root)
    })

    const resize = () => {
      const { clientWidth, clientHeight } = canvas
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / Math.max(clientHeight, 1)
      camera.updateProjectionMatrix()
    }
    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5
      pointerY = event.clientY / window.innerHeight - 0.5
    }
    const startedAt = performance.now()
    const render = () => {
      if (!inViewport || document.hidden) {
        frame = requestAnimationFrame(render)
        return
      }
      resize()
      if (root) {
        const t = (performance.now() - startedAt) / 1000
        const targetX = variant === 'cursor'
          ? 0.16 + (reduceMotion ? 0 : pointerY * 0.34)
          : reduceMotion ? 0 : pointerY * 0.18
        const targetY = variant === 'cursor'
          ? -0.34 + (reduceMotion ? 0 : pointerX * 0.42)
          : reduceMotion ? -0.18 : -0.18 + pointerX * 0.3
        root.rotation.x += (targetX - root.rotation.x) * 0.035
        root.rotation.y += (targetY - root.rotation.y) * 0.035
        if (!reduceMotion) {
          root.position.y = basePosition.y + Math.sin(t * (variant === 'cursor' ? 1.1 : 0.75)) * (variant === 'cursor' ? 0.13 : 0.08)
          if (variant === 'cursor') root.rotation.z = -0.48 + Math.sin(t * 0.7) * 0.045
        }
      }
      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    render()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      viewportObserver.disconnect()
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) child.material.forEach((item) => item.dispose())
          else child.material.dispose()
        }
      })
      renderer.dispose()
    }
  }, [model, variant])

  return <canvas ref={canvasRef} className={`model-canvas model-canvas--${variant}`} aria-hidden="true" />
}

function Starburst({ progressRef }: { progressRef: { current: number } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    })
    if (!canvas || !gl) return

    const vertex = `attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}`
    gl.getExtension('OES_standard_derivatives')
    const fragment = `
      #extension GL_OES_standard_derivatives : enable
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float progress;

      float hash21(vec2 p){
        return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);
      }

      vec3 rgb2hsv(vec3 c){
        vec4 K=vec4(0.0,-1.0/3.0,2.0/3.0,-1.0);
        vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));
        vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));
        float d=q.x-min(q.w,q.y);
        return vec3(abs(q.z+(q.w-q.y)/(6.0*d+1e-10)),d/(q.x+1e-10),q.x);
      }

      vec3 hsv2rgb(vec3 c){
        vec4 K=vec4(1.0,2.0/3.0,1.0/3.0,3.0);
        vec3 p=abs(fract(c.xxx+K.xyz)*6.0-K.www);
        return c.z*mix(K.xxx,clamp(p-K.xxx,0.0,1.0),c.y);
      }

      vec3 hyperspace(vec2 fragCoord){
        vec2 R=resolution;
        float baseScale=max(1.0,min(R.x,R.y));
        vec2 origin=vec2(R.x*.585,R.y*.525);
        vec2 u=(fragCoord-origin)*2.0/baseScale;
        float t=smoothstep(0.0,1.0,clamp(progress/.24,0.0,1.0));

        const float cellDensity=100.0;
        vec2 polar=vec2(atan(u.y,u.x)/3.0,length(u));
        float angleCoord=(6.0-polar.x)*cellDensity;
        float angleId=floor(angleCoord)+.5;
        float angleCell=abs(fract(angleCoord)-.5);
        float radialCoord=(6.0-polar.y)*cellDensity;
        vec2 q=vec2(angleId,radialCoord);

        float keepProbability=mix(.18,1.0,t);
        float scrollSpeed=mix(.7,3.6,t);
        float trailLength=mix(2.7,.975,t);
        float raySeq=fract((angleId+.5)*.61803398875);
        float keepMask=1.0-smoothstep(keepProbability-.025,keepProbability+.025,raySeq);
        float localTime=clamp(progress*2.0,0.0,2.0);
        float phaseBase=(q.y*.02+q.x*.4)*fract(q.x*.61);
        vec4 spark=max(1.0-fract(vec4(7.0,6.0,4.0,0.0)*.02+phaseBase+localTime*scrollSpeed)*trailLength,0.0);
        float channelMix=max(max(spark.r,spark.g),spark.b);
        float edge=max(fwidth(channelMix)*1.5,2.0/max(resolution.y,1.0));
        float star=smoothstep(.12-edge,.12+edge,channelMix);
        float thinEdge=max(fwidth(angleCell)*1.5,.002);
        float thinMask=1.0-smoothstep(.13-thinEdge,.13+thinEdge,angleCell);
        star*=thinMask*keepMask;

        float radialBoost=pow(smoothstep(.1,1.0,polar.y),1.25);
        float intensity=mix(0.0,6.5,t*1.2);
        float stripeBlend=hash21(vec2(angleId,19.713));
        vec3 colorA=vec3(.878,.314,.208);
        vec3 colorB=vec3(1.0,.405,.25);
        vec3 stripeColor=mix(colorA,colorB,stripeBlend);

        vec3 hsvA=rgb2hsv(max(colorA,vec3(1e-5)));
        vec3 hsvB=rgb2hsv(max(colorB,vec3(1e-5)));
        float dh=abs(hsvA.x-hsvB.x);
        dh=min(dh,1.0-dh);
        float hueBand=clamp(dh*1.25+.018,.025,.09);
        vec3 hsv=rgb2hsv(max(stripeColor,vec3(1e-5)));
        float idHash=hash21(vec2(angleId,6.18));
        float idHash2=hash21(vec2(angleId,91.7));
        float hueAnim=sin(localTime*.52+angleId*.29+idHash*6.2831853)*(hueBand*.5);
        float hueStripe=(idHash-.5)*hueBand;
        hsv.x=fract(hsv.x+hueStripe+hueAnim);
        hsv.y=clamp(hsv.y*mix(.96,1.06,idHash2),0.0,1.0);
        hsv.z=clamp(hsv.z*mix(.97,1.05,idHash),0.0,1.0);
        stripeColor=hsv2rgb(hsv);
        float pulse=mix(.78,1.0,smoothstep(.14,.5,channelMix));
        return intensity*radialBoost*stripeColor*pulse*star;
      }

      void main(){
        vec3 stripes=hyperspace(gl_FragCoord.xy);
        float reveal=smoothstep(0.0,.18,progress);
        float luma=dot(stripes,vec3(.299,.587,.114));
        vec3 orange=vec3(.878,.314,.208);
        float crackGuard=1.0-smoothstep(.68,.94,reveal);
        float gap=(1.0-smoothstep(.035,.12,luma))*reveal;
        vec3 color=stripes*reveal+orange*gap*.035*crackGuard;
        float alpha=clamp(max(max(color.r,color.g),color.b),0.0,1.0);
        gl_FragColor=vec4(color,alpha);
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
    const position = gl.getAttribLocation(program, 'p')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const resolution = gl.getUniformLocation(program, 'resolution')
    const time = gl.getUniformLocation(program, 'time')
    const progress = gl.getUniformLocation(program, 'progress')
    const started = performance.now()
    let frame = 0
    const draw = () => {
      const dpr = Math.min(devicePixelRatio, 1.6)
      const width = Math.round(canvas.clientWidth * dpr)
      const height = Math.round(canvas.clientHeight * dpr)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
      gl.uniform2f(resolution, width, height)
      gl.uniform1f(time, (performance.now() - started) / 1000)
      gl.uniform1f(progress, progressRef.current)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(frame)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [progressRef])

  return <canvas ref={canvasRef} className="burst-canvas" aria-hidden="true" />
}

function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(1, Math.max(0, -rect.top / distance))
      progressRef.current = progress
      section.style.setProperty('--manifest-progress', progress.toFixed(4))
      setStage(progress < 0.22 ? 0 : progress < 0.46 ? 1 : progress < 0.72 ? 2 : 3)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="manifesto" ref={sectionRef}>
      <div className={`manifesto-sticky stage-${stage}`}>
        <Starburst progressRef={progressRef} />
        <div className="manifesto-line manifesto-line--one"><span>Innovate</span><span>with</span><span>purpose</span></div>
        <div className="manifesto-line manifesto-line--two"><span>Innovate with</span><span>a human touch</span></div>
        <div className="orbit" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <ul className="orbit-notes">
          <li>Building tomorrow’s digital products</li>
          <li>Independent by design &amp; engineering</li>
          <li>Clarity first. Delight second.</li>
          <li>Ship in small loops. Aim for long arcs.</li>
        </ul>
        <div className="manifesto-line manifesto-line--three"><span>Future-first</span><span>always</span></div>
      </div>
    </section>
  )
}

function App() {
  useSmoothScroll()

  return (
    <main className="site relative min-h-screen overflow-x-clip antialiased">
      <GlobalWebGLScene />
      <GridOverlay />

      <aside className="side-progress" aria-hidden="true"><span /></aside>
      <div className="fixed-meta fixed-meta--left">GMT <b>+0530</b> · INDIA</div>

      <section className="hero" id="top">
        <div className="hero-meta">
          <h2>Designer and Developer</h2>
          <p>I’m Marban, a full-stack developer, UI/UX designer, and Agentic AI developer building tools that make work more efficient.</p>
        </div>
        <h1>Being <span>creative</span> is what<br />makes us human.</h1>
      </section>

      <section className="about">
        <div className="portrait-wrap reveal grid place-items-center" aria-hidden="true">
          <div className="portrait-monogram">M.</div>
          <svg className="signature" viewBox="0 0 260 120" aria-hidden="true"><path d="M9 90C35 4 40 13 26 90c35-88 28 37 63-30 10-19 19-5 5 18-8 14 19 7 31-9 19-25 28-14 8 10-9 11 18 2 30-10 17-18 31-9 15 9-12 14 20-1 33-15 20-20 27-8 8 10" /></svg>
        </div>
        <div className="about-copy reveal">
          <p>I’m Marban, a full-stack developer, UI/UX designer, and Agentic AI developer building tools that make work more efficient.</p>
          <p className="muted">I move from <u>product thinking</u> and interface design to <u>production code</u>, creating thoughtful systems where people and AI work better together.</p>
        </div>
      </section>

      <section className="projects" id="work" aria-label="Selected work">
        {projects.map((project) => (
          <article className={`project group ${project.wide ? 'project--wide' : ''} ${project.compact ? 'project--compact' : ''} ${project.portrait ? 'project--portrait' : ''}`} key={project.name}>
            <div className="project-media">
              <ProjectMedia image={project.image} hoverImage={project.hover} effect={project.effect} />
              {project.name !== 'Product experiences' && <span className="project-badge">Selected project</span>}
            </div>
            <div className="project-caption"><h3>{project.name}</h3><p>{project.year}</p></div>
          </article>
        ))}
      </section>

      <Manifesto />

      <footer className="finale" id="contact">
        <ModelScene model="/assets/025-cnt.gltf" variant="finale" />
        <h2>Let’s create<br />something<br /><span>extraordinary</span></h2>
        <p className="email">Available for ambitious work ↗</p>
        <div className="footer-row">
          <p>DESIGN · CODE · AI<br />MARBAN © 2026</p>
          <div><a href="#top">Home</a><a href="#work">Work</a><a href="#contact">Contact</a></div>
        </div>
      </footer>
    </main>
  )
}

export default App
