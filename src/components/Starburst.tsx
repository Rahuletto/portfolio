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

