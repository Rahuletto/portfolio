export const starFlareFragmentShader = `
  precision highp float;
  uniform sampler2D tDiffuse;
  uniform vec2 uResolution;
  uniform float uEnabled;
  uniform float uIntensity;
  uniform float uThreshold;
  uniform float uStreakScale;
  uniform float uHotspotPower;
  uniform float uGate;
  uniform float uStarRays;
  uniform vec3 uTailColor;
  varying vec2 vUv;

  float luma(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
  }

  float brightMask(float luminance) {
    float mask = max(luminance - uThreshold, 0.0)
      / max(1.0 - uThreshold, 0.00001);
    mask = clamp(mask, 0.0, 1.0);
    mask = mask * mask * (3.0 - 2.0 * mask);
    mask = pow(mask, max(uHotspotPower, 1.0));
    float gated = clamp(
      (mask - uGate) / max(1.0 - uGate, 0.00001),
      0.0,
      1.0
    );
    return mask * gated;
  }

  vec3 sampleBright(vec2 uv) {
    vec3 color = texture2D(tDiffuse, uv).rgb;
    return color * brightMask(luma(color));
  }

  vec3 streak(vec2 direction) {
    vec3 accumulated = vec3(0.0);
    vec2 pixel = floor(vUv * uResolution);
    float hash = fract(
      52.9829189 * fract(dot(pixel, vec2(0.06711056, 0.00583715)))
    );
    float phase = step(0.5, hash) * 0.5;

    for (int index = 1; index <= 8; index++) {
      float distancePx = float(index) * 1.5 + phase;
      float weight = 1.0 / (1.0 + distancePx * 0.22);
      weight *= weight;
      float tail = pow(clamp(distancePx / 8.0, 0.0, 1.0), 0.5);
      vec3 ramp = mix(vec3(1.0), uTailColor, tail);
      vec2 offset = direction * distancePx;
      accumulated += sampleBright(vUv + offset) * weight * ramp;
      accumulated += sampleBright(vUv - offset) * weight * ramp;
    }

    return accumulated;
  }

  void main() {
    vec3 flare = vec3(0.0);

    if (uEnabled >= 0.5 && uIntensity > 0.0001) {
      vec2 pixel = (1.0 / max(uResolution, vec2(1.0))) * uStreakScale;

      if (uStarRays >= 7.5) {
        const float cosine45 = 0.70710678;
        flare += streak(vec2(pixel.x, 0.0));
        flare += streak(vec2(0.0, pixel.y));
        flare += streak(vec2(pixel.x * cosine45, pixel.y * cosine45));
        flare += streak(vec2(pixel.x * cosine45, -pixel.y * cosine45));
      } else if (uStarRays >= 5.5) {
        const float cosine30 = 0.8660254;
        const float sine30 = 0.5;
        flare += streak(vec2(0.0, pixel.y));
        flare += streak(vec2(pixel.x * cosine30, pixel.y * sine30));
        flare += streak(vec2(pixel.x * cosine30, -pixel.y * sine30));
      } else {
        flare += streak(vec2(pixel.x, 0.0));
        flare += streak(vec2(0.0, pixel.y));
      }
    }

    gl_FragColor = vec4(flare * uIntensity * 0.75, 1.0);
  }
`

export const additiveCompositeFragmentShader = `
  precision highp float;
  uniform sampler2D tBase;
  uniform sampler2D tFlare;
  varying vec2 vUv;

  void main() {
    vec3 base = texture2D(tBase, vUv).rgb;
    vec3 flare = texture2D(tFlare, vUv).rgb;
    gl_FragColor = vec4(base + flare, 1.0);
  }
`
