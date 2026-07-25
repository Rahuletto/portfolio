export const glassVertexShader = `
  varying vec3 worldNormal;
  varying vec3 eyeVector;
  varying float modelLocalY;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vec4 mvPosition = viewMatrix * worldPos;

    gl_Position = projectionMatrix * mvPosition;
    worldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
    eyeVector = normalize(worldPos.xyz - cameraPosition);
    modelLocalY = position.y;
  }
`

export const glassFragmentShader = `
  precision highp float;

  uniform float uIorR;
  uniform float uIorY;
  uniform float uIorG;
  uniform float uIorC;
  uniform float uIorB;
  uniform float uIorP;
  uniform float uSaturation;
  uniform float uChromaticAberration;
  uniform float uRefractPower;
  uniform float uFresnelPower;
  uniform float uShininess;
  uniform float uDiffuseness;
  uniform vec3 uLight;
  uniform float uBrightness;
  uniform float uContrast;
  uniform float uGamma;
  uniform float uSpecularStrength;
  uniform float uFresnelStrength;
  uniform vec3 uFresnelSideDir;
  uniform vec4 uTintColorA;
  uniform vec4 uTintColorB;
  uniform vec2 uTintLocalYRange;
  uniform float uTintEnabled;
  uniform float uTintMix;
  uniform float uTintThicknessMinAlpha;
  uniform float uTintThicknessMaxAlpha;
  uniform vec2 uScreenResolutionPx;
  uniform sampler2D uTexture;
  uniform float uSceneRefractionEnabled;
  uniform float uRgbRefraction;
  uniform float uDark;
  uniform int uLoop;

  varying vec3 worldNormal;
  varying vec3 eyeVector;
  varying float modelLocalY;

  float random(vec2 point) {
    return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec3 sat(vec3 color, float adjustment) {
    const vec3 weights = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(color, weights));
    return mix(intensity, color, adjustment);
  }

  float fresnel(vec3 eyeDirection, vec3 normal, float power) {
    float factor = abs(dot(eyeDirection, normal));
    return pow(1.0 - factor, power);
  }

  float specular(
    vec3 light,
    vec3 normal,
    vec3 eyeDirection,
    float shininess,
    float diffuseness
  ) {
    vec3 lightVector = normalize(-light);
    vec3 halfVector = normalize(eyeDirection + lightVector);
    float diffuse = max(0.0, dot(normal, lightVector));
    float highlight = pow(abs(dot(normal, halfVector)), shininess);
    return highlight + diffuse * diffuseness;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / max(uScreenResolutionPx, vec2(1.0));
    vec3 normal = normalize(worldNormal);
    vec3 eyeDirection = normalize(eyeVector);
    vec3 color;

    if (uSceneRefractionEnabled > 0.5) {
      color = vec3(0.0);
      float noise = random(uv) * 0.025;

      if (uRgbRefraction > 0.5) {
        vec3 refractR = refract(eyeDirection, normal, 1.0 / uIorR);
        vec3 refractG = refract(eyeDirection, normal, 1.0 / uIorG);
        vec3 refractB = refract(eyeDirection, normal, 1.0 / uIorB);

        for (int index = 0; index < 3; index++) {
          float slide = float(index) / float(uLoop) * 0.1 + noise;
          float offset = (uRefractPower + slide) * uChromaticAberration;
          color.r += texture2D(uTexture, uv + refractR.xy * offset).r;
          color.g += texture2D(uTexture, uv + refractG.xy * offset).g;
          color.b += texture2D(uTexture, uv + refractB.xy * offset).b;
        }
      } else {
        vec3 refractR = refract(eyeDirection, normal, 1.0 / uIorR);
        vec3 refractY = refract(eyeDirection, normal, 1.0 / uIorY);
        vec3 refractG = refract(eyeDirection, normal, 1.0 / uIorG);
        vec3 refractC = refract(eyeDirection, normal, 1.0 / uIorC);
        vec3 refractB = refract(eyeDirection, normal, 1.0 / uIorB);
        vec3 refractP = refract(eyeDirection, normal, 1.0 / uIorP);

        for (int index = 0; index < 3; index++) {
          float slide = float(index) / float(uLoop) * 0.1 + noise;
          float offsetR = (uRefractPower + slide) * uChromaticAberration;
          float offsetY = (uRefractPower + slide) * uChromaticAberration;
          float offsetG = (uRefractPower + slide * 2.0) * uChromaticAberration;
          float offsetC = (uRefractPower + slide * 2.5) * uChromaticAberration;
          float offsetB = (uRefractPower + slide * 3.0) * uChromaticAberration;
          float offsetP = (uRefractPower + slide) * uChromaticAberration;
          float r = texture2D(uTexture, uv + refractR.xy * offsetR).x * 0.5;
          vec3 ySample = texture2D(uTexture, uv + refractY.xy * offsetY).xyz;
          float y = (ySample.x * 2.0 + ySample.y * 2.0 - ySample.z) / 6.0;
          float g = texture2D(uTexture, uv + refractG.xy * offsetG).y * 0.5;
          vec3 cSample = texture2D(uTexture, uv + refractC.xy * offsetC).xyz;
          float c = (cSample.y * 2.0 + cSample.z * 2.0 - cSample.x) / 6.0;
          float b = texture2D(uTexture, uv + refractB.xy * offsetB).z * 0.5;
          vec3 pSample = texture2D(uTexture, uv + refractP.xy * offsetP).xyz;
          float p = (pSample.z * 2.0 + pSample.x * 2.0 - pSample.y) / 6.0;
          color.r += r + (2.0 * p + 2.0 * y - c) / 3.0;
          color.g += g + (2.0 * y + 2.0 * c - p) / 3.0;
          color.b += b + (2.0 * c + 2.0 * p - y) / 3.0;
        }
      }

      color /= float(uLoop);
    } else {
      color = texture2D(uTexture, uv).rgb;
    }

    color = sat(color, uSaturation);
    color *= uBrightness;
    color = (color - 0.5) * uContrast + 0.5;
    float inverseGamma = 1.0 / max(uGamma, 0.0001);
    color = pow(max(color, 0.0), vec3(inverseGamma));

    float localRange = max(
      uTintLocalYRange.y - uTintLocalYRange.x,
      0.00001
    );
    float tintGradient = clamp(
      (modelLocalY - uTintLocalYRange.x) / localRange,
      0.0,
      1.0
    );
    vec4 tint = mix(uTintColorB, uTintColorA, tintGradient);
    float thicknessMask = clamp(
      1.0 - abs(dot(normal, eyeDirection)),
      0.0,
      1.0
    );
    float tintAlpha = clamp(tint.a, 0.0, 1.0);
    tintAlpha *= mix(
      clamp(uTintThicknessMaxAlpha, 0.0, 1.0),
      clamp(uTintThicknessMinAlpha, 0.0, 1.0),
      thicknessMask
    );

    float tintEnabled = clamp(uTintEnabled, 0.0, 1.0);
    vec3 tintColor = clamp(tint.rgb, 0.001, 1.0);
    float thickness = clamp(uTintMix, 0.01, 3.0);
    vec3 transmittance = pow(tintColor, vec3(thickness));
    vec3 beerColor = mix(
      color,
      color * transmittance,
      tintEnabled * tintAlpha
    );

    float hardMix = tintEnabled
      * clamp(uTintMix, 0.0, 1.0)
      * tintAlpha;
    vec3 base = clamp(color, 0.0, 1.0);
    vec3 blend = clamp(tint.rgb, 0.0, 1.0);
    vec3 hard = mix(
      2.0 * base * blend,
      1.0 - 2.0 * (1.0 - blend) * (1.0 - base),
      step(vec3(0.5), blend)
    );
    vec3 hardColor = mix(color, hard, hardMix);
    color = mix(beerColor, hardColor, clamp(uDark, 0.0, 1.0));

    color += specular(
      uLight,
      normal,
      eyeDirection,
      uShininess,
      uDiffuseness
    ) * uSpecularStrength;

    float sideMask = smoothstep(
      -0.5,
      0.5,
      dot(normal, normalize(uFresnelSideDir))
    );
    color += fresnel(eyeDirection, normal, uFresnelPower)
      * sideMask
      * uFresnelStrength;

    gl_FragColor = vec4(color, 1.0);
  }
`
