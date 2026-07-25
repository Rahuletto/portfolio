export const fullscreenVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

export const curlFragmentShader = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float left = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
    float right = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
    float top = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
    float bottom = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
    float value = 0.5 * (right - left - top + bottom);
    gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
  }
`

export const splatFragmentShader = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform vec2 uTexelSize;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform vec2 uPointerDelta;
  uniform float uCurlStrength;
  uniform float uSplatRadius;
  uniform float uSplatForce;
  uniform float uInject;
  varying vec2 vUv;

  void main() {
    float left = abs(texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x);
    float right = abs(texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x);
    float top = abs(texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x);
    float bottom = abs(texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x);
    float center = texture2D(uCurl, vUv).x;

    vec2 force = vec2(top - bottom, right - left);
    float forceLength = length(force);
    force = forceLength > 0.0001 ? force / forceLength : vec2(0.0);
    force *= uCurlStrength * center;
    force.y *= -1.0;

    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * 0.016;

    vec2 mouseUv = uPointer / max(uResolution, vec2(0.0001));
    vec2 diff = vUv - mouseUv;
    diff.x *= uResolution.x / max(uResolution.y, 0.0001);
    float pointerMask = exp(-dot(diff, diff) / max(uSplatRadius, 0.0001));
    velocity += (uPointerDelta / max(uResolution, vec2(0.0001)))
      * pointerMask
      * uSplatForce
      * uInject;

    gl_FragColor = vec4(clamp(velocity, vec2(-1000.0), vec2(1000.0)), 0.0, 1.0);
  }
`

export const divergenceFragmentShader = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float left = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
    float right = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
    float top = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
    float bottom = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
    float divergence = 0.5 * (right - left + top - bottom);
    gl_FragColor = vec4(divergence, 0.0, 0.0, 1.0);
  }
`

export const clearFragmentShader = `
  void main() {
    gl_FragColor = vec4(0.0);
  }
`

export const pressureFragmentShader = `
  precision highp float;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float left = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float right = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float top = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    float bottom = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (left + right + top + bottom - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`

export const projectionFragmentShader = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform sampler2D uPressure;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float left = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float right = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float top = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    float bottom = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity -= vec2(right - left, top - bottom);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`

export const advectionFragmentShader = `
  precision highp float;
  uniform sampler2D uProjectedVelocity;
  uniform vec2 uTexelSize;
  uniform float uDissipation;
  varying vec2 vUv;

  void main() {
    vec2 velocity = texture2D(uProjectedVelocity, vUv).xy;
    vec2 coord = clamp(vUv - velocity * uTexelSize * 0.016, 0.0, 1.0);
    vec2 advected = texture2D(uProjectedVelocity, coord).xy;
    advected /= 1.0 + uDissipation * 0.016;
    gl_FragColor = vec4(advected, 0.0, 1.0);
  }
`

export const compositeFragmentShader = `
  precision highp float;
  uniform sampler2D tDiffuse;
  uniform sampler2D uVelocity;
  uniform vec2 uSimSize;
  uniform float uDisplacementStrength;
  uniform float uEffectEnabled;
  varying vec2 vUv;

  vec3 linearToSrgb(vec3 value) {
    return mix(
      pow(value, vec3(0.41666)) * 1.055 - vec3(0.055),
      value * 12.92,
      lessThanEqual(value, vec3(0.0031308))
    );
  }

  void main() {
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    float enabled = step(0.5, uEffectEnabled);
    vec2 displacement = velocity / max(uSimSize, vec2(1.0))
      * uDisplacementStrength
      * enabled;
    float magnitude = length(displacement);

    const int samples = 4;
    vec4 color = vec4(0.0);
    vec3 weightSum = vec3(0.0);

    for (int index = 0; index < samples; index++) {
      float t = float(index) / float(samples - 1);
      vec3 weight = max(
        vec3(0.0),
        cos((t - vec3(0.0, 0.5, 1.0)) * 3.14159 * 0.5)
      );
      vec2 sampleUv = clamp(
        vUv - displacement * 0.3 * (t + 0.3) * magnitude,
        0.0,
        1.0
      );
      vec4 sampleColor = texture2D(tDiffuse, sampleUv);
      color.rgb += sampleColor.rgb * weight;
      color.a += sampleColor.a * (weight.r + weight.g + weight.b) / 3.0;
      weightSum += weight;
    }

    color.rgb /= max(weightSum, vec3(0.0001));
    color.a /= max((weightSum.r + weightSum.g + weightSum.b) / 3.0, 0.0001);

    gl_FragColor = vec4(linearToSrgb(max(color.rgb, 0.0)), color.a);
  }
`
