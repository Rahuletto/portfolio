export const swirlFragmentShader = `
  precision mediump float;
  precision mediump int;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform sampler2D tInput;
  uniform float uRadius;
  uniform float uAngle;
  uniform float uPhase;
  uniform float uTime;
  uniform float uMix;
  uniform vec2 uPos;

  void main() {
    vec2 uv = vUv;
    vec2 originalUv = uv;
    uv -= uPos;
    vec2 radiusUv = vec2(
      uv.x * uResolution.x / uResolution.y,
      uv.y
    );
    float distanceToCenter = length(radiusUv);
    if (distanceToCenter <= uRadius) {
      float rotation = atan(radiusUv.y, radiusUv.x)
        + uAngle * 10.0
        * smoothstep(uRadius, 0.0, distanceToCenter);
      uv = vec2(
        cos(rotation + uTime / 20.0 + uPhase * 6.28318530718),
        sin(rotation + uTime / 20.0 + uPhase * 6.28318530718)
      );
      uv = distanceToCenter * uv + uPos;
    }
    float edge = smoothstep(0.0, uRadius, distanceToCenter);
    vec2 mixedUv = mix(uv, originalUv, edge);
    gl_FragColor = texture2D(
      tInput,
      mix(vUv, mixedUv, uMix)
    );
  }
`

export const waveFragmentShader = `
  precision mediump float;
  precision mediump int;
  varying vec2 vUv;
  uniform sampler2D tInput;
  uniform float uMixRadius;
  uniform vec2 uPos;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uRotation;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMousePos;
  uniform float uTrackMouse;

  void main() {
    vec2 uv = vUv;
    vec2 waveCoord = vUv * 2.0 - 1.0;
    float time = uTime * 0.25;
    float frequency = 20.0 * uFrequency;
    float amplitude = uAmplitude * 0.2;
    float waveX = sin(
      (waveCoord.y + uPos.y) * frequency + time
    ) * amplitude;
    float waveY = sin(
      (waveCoord.x - uPos.x) * frequency + time
    ) * amplitude;
    waveCoord += vec2(
      mix(waveX, 0.0, uRotation),
      mix(0.0, waveY, uRotation)
    );
    vec2 finalUv = waveCoord * 0.5 + 0.5;
    float aspectRatio = uResolution.x / uResolution.y;
    vec2 mousePosition = uPos + mix(
      vec2(0.0),
      uMousePos - 0.5,
      uTrackMouse
    );
    float distanceMask = max(
      0.0,
      1.0 - distance(
        uv * vec2(aspectRatio, 1.0),
        mousePosition * vec2(aspectRatio, 1.0)
      ) * 4.0 * (1.0 - uMixRadius)
    );
    gl_FragColor = texture2D(
      tInput,
      mix(uv, finalUv, distanceMask)
    );
  }
`

export const voronoiDistortionFragmentShader = `
  precision mediump float;
  precision mediump int;

  varying vec2 vUv;
  uniform sampler2D tInput;
  uniform float uAmount;
  uniform float uSpread;
  uniform float uAngle;
  uniform float uTime;
  uniform float uSkew;
  uniform float uCellScale;
  uniform vec2 uPos;
  uniform vec2 uResolution;
  uniform float uMixRadius;
  uniform int uMixRadiusInvert;
  uniform int uEasing;
  uniform vec2 uMousePos;
  uniform float uTrackMouse;
  uniform float uRoundness;

  vec2 random2(vec2 point) {
    return fract(sin(vec2(
      dot(point, vec2(127.1, 311.7)),
      dot(point, vec2(269.5, 183.3))
    )) * 43758.5453);
  }

  mat2 rot(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  }

  float ease(int mode, float value) {
    if (mode == 1) {
      return 1.0 - (1.0 - value) * (1.0 - value);
    }
    if (mode == 2) {
      return value < 0.5
        ? 4.0 * value * value * value
        : 1.0 - pow(-2.0 * value + 2.0, 3.0) / 2.0;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float aspectRatio = uResolution.x / uResolution.y;
    vec2 skew = mix(vec2(1.0), vec2(1.0, 0.0), uSkew);
    vec2 st = (uv - uPos)
      * vec2(aspectRatio, 1.0)
      * uCellScale
      * uAmount;
    st = st * rot(uAngle * 6.28318530718) * skew;
    vec2 cell = floor(st);
    vec2 cellUv = fract(st);

    float nearest = 15.0;
    float secondNearest = 15.0;
    vec2 nearestPoint = vec2(0.0);

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = random2(cell + neighbor);
        point = 0.5 + 0.5 * sin(
          5.0 + uTime * 0.012 + 6.2831 * point
        );
        float distanceToPoint = length(neighbor + point - cellUv);
        if (distanceToPoint < nearest) {
          secondNearest = nearest;
          nearest = distanceToPoint;
          nearestPoint = point;
        } else if (distanceToPoint < secondNearest) {
          secondNearest = distanceToPoint;
        }
      }
    }

    vec2 offset = nearestPoint * 0.4 * uSpread - uSpread * 0.2;
    float cornerSoft = smoothstep(
      0.0,
      max(0.0001, uRoundness) * 2.0,
      secondNearest - nearest
    );
    float edgeSoft = smoothstep(
      0.0,
      max(0.0001, uRoundness),
      nearest
    ) * cornerSoft;
    offset *= edgeSoft;

    vec2 mousePosition = uPos + mix(
      vec2(0.0),
      uMousePos - 0.5,
      uTrackMouse
    );
    float rawDistance = max(
      0.0,
      1.0 - distance(
        uv * vec2(aspectRatio, 1.0),
        mousePosition * vec2(aspectRatio, 1.0)
      ) * 4.0 * (1.0 - uMixRadius)
    );
    if (uMixRadiusInvert == 1) rawDistance = 1.0 - rawDistance;
    float mixDistance = ease(uEasing, rawDistance);

    gl_FragColor = texture2D(tInput, uv + offset * mixDistance);
  }
`

export const bokehFragmentShader = `
  precision mediump float;
  precision mediump int;

  varying vec2 vUv;
  uniform sampler2D tInput;
  uniform sampler2D tBlueNoise;
  uniform float uAmount;
  uniform float uTilt;
  uniform vec2 uPos;
  uniform vec2 uResolution;
  uniform vec2 uBlueNoiseResolution;
  uniform vec2 uMousePos;
  uniform float uTrackMouse;

  #define PI2 6.28318530718
  #define ITERATIONS 32.0
  #define GOLDEN_ANGLE 2.39996323

  vec2 sampleSpiral(float theta, inout float radius) {
    radius += 1.0 / radius;
    return (radius - 1.0) * vec2(cos(theta), sin(theta));
  }

  float getBlueNoiseOffset(vec2 point) {
    vec2 textureSize = uBlueNoiseResolution;
    vec2 uv = fract(
      point
      * (uResolution / textureSize)
      * vec2(textureSize.x / textureSize.y, 1.0)
    );
    return mod((texture2D(tBlueNoise, uv).r - 0.5) * PI2, PI2);
  }

  vec4 bokeh(sampler2D inputTexture, vec2 uv, float blurRadius) {
    vec3 accumulatedColor = vec3(0.0);
    vec3 accumulatedWeights = vec3(0.0);
    float accumulatedAlpha = 0.0;
    float aspectRatio = uResolution.x / uResolution.y;
    vec2 basePixelSize = vec2(1.0 / aspectRatio, 1.0) * 0.003;
    float radius = 1.0;
    float noiseOffset = (getBlueNoiseOffset(uv) - 0.5) * 0.01;
    float noiseAngle = noiseOffset * PI2;
    mat2 rotationMatrix = mat2(
      cos(noiseAngle), -sin(noiseAngle),
      sin(noiseAngle), cos(noiseAngle)
    );

    for (
      float angle = 0.0;
      angle < GOLDEN_ANGLE * ITERATIONS;
      angle += GOLDEN_ANGLE
    ) {
      vec2 offset = sampleSpiral(angle, radius)
        * basePixelSize
        * blurRadius;
      float jitter = 0.05 * (sin(angle * 0.1) * 0.5 + 0.5);
      offset *= 1.0 + jitter * sin(
        angle * 0.7 + noiseOffset
      );
      vec4 sampleColor = texture2D(
        inputTexture,
        uv + rotationMatrix * offset
      );
      vec3 weight = vec3(5.0)
        + pow(sampleColor.rgb, vec3(9.0)) * 150.0;
      accumulatedAlpha += sampleColor.a;
      accumulatedColor += sampleColor.rgb * weight;
      accumulatedWeights += weight;
    }

    return vec4(
      accumulatedColor / accumulatedWeights,
      accumulatedAlpha / ITERATIONS
    );
  }

  void main() {
    if (uAmount == 0.0) {
      gl_FragColor = vec4(0.0);
      return;
    }
    vec2 position = uPos + mix(
      vec2(0.0),
      uMousePos - 0.5,
      uTrackMouse
    );
    float distanceToPosition = distance(vUv, position) * 1000.0;
    float tilt = mix(
      1.0 - distanceToPosition * 0.001,
      distanceToPosition * 0.001,
      uTilt
    );
    gl_FragColor = bokeh(tInput, vUv, uAmount * tilt);
  }
`
