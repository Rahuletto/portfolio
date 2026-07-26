export const backgroundVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const backgroundFragmentShader = `
  precision mediump float;
  precision mediump int;

  uniform float uRadius;
  uniform float uFalloff;
  uniform float uMix;
  uniform float uDisplace;
  uniform float uSkew;
  uniform float uAngle;
  uniform vec3 uVignetteColor;
  uniform vec2 uPos;
  uniform vec2 uResolution;
  uniform vec3 uClearColor;
  uniform float uEdgeIntensity;
  varying vec2 vUv;

  mat2 rot(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  }

  void main() {
    vec2 uv = vUv;
    vec4 color = vec4(vec3(1.0), 0.0);
    float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    float displacement = (luma - 0.5) * uDisplace * 0.5;
    vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 skew = vec2(uSkew, 1.0 - uSkew);
    float halfRadius = uRadius * 0.5;
    float innerEdge = halfRadius - uFalloff * halfRadius * 0.5;
    float outerEdge = halfRadius + uFalloff * halfRadius * 0.5;
    vec2 scaledUv = uv
      * aspectRatio
      * rot(uAngle * 6.28318530718)
      * skew;
    vec2 scaledPos = uPos
      * aspectRatio
      * rot(uAngle * 6.28318530718)
      * skew;
    float radius = distance(scaledUv, scaledPos);
    float falloff = smoothstep(
      innerEdge + displacement,
      outerEdge + displacement,
      radius
    );
    float brighten = max(uEdgeIntensity, 0.0);
    float darken = max(-uEdgeIntensity, 0.0);
    falloff = mix(falloff, 0.0, brighten);
    falloff = mix(falloff, 1.0, darken);

    vec3 mixed = mix(uClearColor, uVignetteColor, falloff);
    gl_FragColor = vec4(mixed, falloff);
  }
`

export const backgroundCompositeFragmentShader = `
  precision mediump float;
  precision mediump int;

  varying vec2 vUv;
  uniform sampler2D tInput;
  uniform vec3 uBgColor;
  uniform vec3 uOutputColor;
  uniform int uLoaded;
  uniform float uOutputMix;
  uniform float uGridIntensity;
  uniform vec2 uGridResolution;

  vec3 overlay(vec3 base, vec3 blend) {
    return mix(
      2.0 * base * blend,
      1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
      step(0.5, base)
    );
  }

  void main() {
    if (uLoaded != 1) {
      gl_FragColor = vec4(197.0 / 255.0, 136.0 / 255.0, 122.0 / 255.0, 1.0);
      return;
    }

    vec3 bgTex = vec3(1.0);
    vec3 base = mix(uBgColor, overlay(uBgColor, bgTex), 0.61);
    vec4 inTex = texture2D(tInput, vUv);
    vec3 tint = uOutputColor * 0.35;
    vec3 blend = clamp(inTex.rgb + tint, 0.0, 1.0);
    vec3 finalColor = base * mix(
      vec3(1.0),
      blend,
      clamp(uOutputMix, 0.0, 1.0)
    );

    gl_FragColor = vec4(finalColor, 1.0);
  }
`
