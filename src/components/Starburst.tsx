import { useEffect, useRef } from 'react'

export function Starburst({ progressRef }: { progressRef: { current: number } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    })
    if (!canvas || !gl) return

    const vertexShaderSrc = `attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}`
    const fragShaderSrc = `
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
        vec2 origin=R*.5;
        vec2 u=(fragCoord-origin)*2.0/baseScale;
        float t=smoothstep(0.0,1.0,clamp(progress/.68,0.0,1.0));

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
        float intensity=mix(0.0,1.25,t);
        float stripeBlend=hash21(vec2(angleId,19.713));
        vec3 colorA=vec3(.0,.94,1.0);
        vec3 colorB=vec3(.42,.98,1.0);
        vec3 colorC=vec3(.04,.38,1.0);
        vec3 colorD=vec3(.68,.06,1.0);
        vec3 cyanBlue=mix(colorA,colorB,smoothstep(0.0,.58,stripeBlend));
        vec3 blueViolet=mix(colorC,colorD,smoothstep(.55,1.0,stripeBlend));
        vec3 stripeColor=mix(cyanBlue,blueViolet,step(.72,stripeBlend));

        vec3 hsvA=rgb2hsv(max(colorA,vec3(1e-5)));
        vec3 hsvB=rgb2hsv(max(colorB,vec3(1e-5)));
        float dh=abs(hsvA.x-hsvB.x);
        dh=min(dh,1.0-dh);
        float hueBand=clamp(dh*2.0+.035,.05,.16);
        vec3 hsv=rgb2hsv(max(stripeColor,vec3(1e-5)));
        float idHash=hash21(vec2(angleId,6.18));
        float idHash2=hash21(vec2(angleId,91.7));
        float hueAnim=sin(localTime*.52+angleId*.29+idHash*6.2831853)*(hueBand*.5);
        float hueStripe=(idHash-.5)*hueBand;
        hsv.x=fract(hsv.x+hueStripe+hueAnim);
        hsv.y=clamp(hsv.y*mix(.96,1.06,idHash2),0.0,1.0);
        hsv.z=clamp(hsv.z*mix(.97,1.05,idHash),0.0,1.0);
        stripeColor=hsv2rgb(hsv);
        float hotRay=smoothstep(.8,.98,idHash2);
        float pulse=mix(.72,1.08,smoothstep(.14,.5,channelMix));
        pulse*=1.0+hotRay*.55;
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
    gl.getExtension('OES_standard_derivatives')

    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader)
        if (log) console.warn('Starburst shader compile error:', log)
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const program = gl.createProgram()
    if (!program) return () => undefined

    const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSrc)
    const fs = compileShader(gl.FRAGMENT_SHADER, fragShaderSrc)

    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs)
      if (fs) gl.deleteShader(fs)
      gl.deleteProgram(program)
      return () => undefined
    }

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program)
      if (log) console.warn('Starburst program link error:', log)
      gl.deleteProgram(program)
      return () => undefined
    }

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

  return <canvas ref={canvasRef} className="absolute inset-0 -z-[2] size-full" aria-hidden="true" />
}
