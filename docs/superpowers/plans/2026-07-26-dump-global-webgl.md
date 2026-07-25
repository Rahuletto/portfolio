# Dump-Driven Global WebGL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Move the supplied Haoqi vignette and fluid system from the hero into one fixed full-page WebGL surface while retaining the approved dump shader mapping and making the renderer sleep when settled.

**Architecture:** `GlobalWebGLScene` owns one fixed viewport canvas, one Three.js renderer, the Program 3 vignette, Programs 17–23 fluid pipeline, Program 14 compositor, and Program 12 hero models. DOM sections remain above the canvas and transparent; hero assets are conditionally drawn only while the hero intersects the viewport.

**Tech Stack:** React 19, TypeScript 6, Three.js r185, WebGL2/GLSL, Vite 8, Lenis.

## Global Constraints

- `/Users/marban/Downloads/webgl-dump-haoqi.design.json` remains the shader and captured-uniform source of truth.
- Program 3 uses `uRadius = 0.354`, `uFalloff = 1`, `uSkew = 0.54`, `uAngle = 0`, `uEdgeIntensity = -0.82`, and `uDisplace = 0`.
- Fluid uses captured `209 × 160` proportions, radius `0.003`, force `3000`, curl `0`, dissipation `3`, displacement `1`, and chromatic boost `0.5`.
- No replacement shader math, DOM rasterization, SVG displacement, per-section fluid renderer, or project-media treatment change.
- No test files. Verification uses `npm run build`, `npm run lint`, and the in-app browser.
- Preserve reduced-motion and coarse-pointer fallbacks.
- No commits: this directory is not a Git repository.

---

### Task 1: Promote the Hero Renderer to a Global Renderer

**Files:**
- Move: `src/hero/HeroWebGLScene.tsx` → `src/hero/GlobalWebGLScene.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Interfaces:**
- Produces: `GlobalWebGLScene(): JSX.Element`
- Consumes: existing `FluidSimulation`, dump shader modules, hero GLTF and sprite assets.

- [x] **Step 1: Rename the component and mount it at application root**

Update the export and import:

```tsx
import { GlobalWebGLScene } from './hero/GlobalWebGLScene.tsx'

<main className={siteClass}>
  <GlobalWebGLScene />
  {/* fixed UI and document sections */}
</main>
```

Remove the canvas from inside `<section className="hero">`.

- [x] **Step 2: Make the canvas fixed and place it behind sharp DOM content**

Use an isolated root stacking context and a negative in-context layer:

```css
.site {
  isolation: isolate;
  background: transparent;
}

.global-webgl {
  position: fixed;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
```

Keep `body`/`:root` fallback colors for WebGL initialization failure.

- [x] **Step 3: Make document sections reveal the global canvas**

Remove opaque backgrounds from `.hero`, `.manifesto`, and `.finale`. Keep content, layout, and text styling unchanged.

- [x] **Step 4: Verify the structural change**

Run:

```bash
npm run build
npm run lint
```

Expected: both commands exit `0`; no test files are created.

---

### Task 2: Keep Global Vignette and Fluid Alive Across the Document

**Files:**
- Modify: `src/hero/GlobalWebGLScene.tsx`
- Modify: `src/hero/backgroundShaders.ts`
- Modify: `src/hero/fluidSimulation.ts`
- Modify: `src/hero/fluidShaders.ts`

**Interfaces:**
- Consumes: viewport pointer coordinates from `normalizePointer()`.
- Produces: one full-viewport background/fluid composite regardless of scroll position.

- [x] **Step 1: Initialize WebGL2 defensively**

Wrap renderer construction:

```ts
let renderer: THREE.WebGLRenderer
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: false,
    powerPreference: 'high-performance',
  })
} catch {
  canvas.dataset.webglUnavailable = 'true'
  return
}
```

- [x] **Step 2: Size from the viewport with approved DPR limits**

Set:

```ts
const pixelRatioCap = width * height > 2_000_000 ? 1 : 1.25
renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap))
```

Keep the fluid size derived from captured long axis `209`.

- [x] **Step 3: Preserve exact Program 3 interaction**

Update only:

```ts
backgroundMaterial.uniforms.uPos.value.set(pointer.x, pointer.y)
```

Do not add time, scroll, noise, or custom parallax uniforms.

- [x] **Step 4: Keep one global simulation and captured pass values**

Reuse existing targets/materials. Confirm the uniforms remain:

```ts
uSplatRadius: 0.003
uSplatForce: 3000
uCurlStrength: 0
uDissipation: 3
uDisplacementStrength: 1
uChromaticBoost: 0.5
```

- [x] **Step 5: Verify at several scroll positions**

Use the in-app browser to move the pointer at the hero, projects, manifesto, and footer. Confirm the vignette center and fluid response use full viewport coordinates at every location.

---

### Task 3: Cull Hero Assets Without Stopping the Global Effects

**Files:**
- Modify: `src/hero/GlobalWebGLScene.tsx`

**Interfaces:**
- Consumes: `#top` hero bounds and document scroll.
- Produces: `heroActive` draw-state controlling hello, cursor, and decorations only.

- [x] **Step 1: Observe the hero rather than the fixed canvas**

Resolve `document.getElementById('top')`, observe it with `rootMargin: '120px'`, and update `heroActive`.

- [x] **Step 2: Hide hero-only scene objects outside their range**

Before scene and refraction passes:

```ts
hello.root.visible = heroActive
cursor.root.visible = heroActive
decorations.forEach((sprite) => {
  sprite.visible = heroActive && responsiveVisibility(sprite)
})
```

Continue drawing the vignette and fluid composite globally.

- [x] **Step 3: Keep Program 12 material behavior**

Leave IOR, chromatic refraction, tint algorithm, specular, and Fresnel equations shared. Keep cursor brightness higher through the existing `uBrightness` uniform only.

- [x] **Step 4: Verify hero culling**

In the browser, confirm hello/cursor disappear after the hero leaves view, reappear when returning, and the global vignette/fluid remain visible throughout.

---

### Task 4: Add Event-Driven Rendering and Transparent Manifesto Composition

**Files:**
- Modify: `src/hero/GlobalWebGLScene.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Interfaces:**
- Produces: `wake()` scheduling at most one animation frame and a renderer that stops after 120 settling frames.
- Consumes: pointer, scroll, resize, visibility, model-load, and hero-intersection events.

- [x] **Step 1: Replace the permanent RAF loop with a wake scheduler**

Use:

```ts
let frame = 0
const wake = () => {
  if (!visible || frame !== 0) return
  frame = requestAnimationFrame(render)
}
```

Set `frame = 0` at render start and call `wake()` again only while pointer velocity, fluid settling, light interpolation, or scroll interpolation remains active.

- [x] **Step 2: Wake from all state-changing events**

Call `wake()` from pointermove, scroll, resize, visibility restoration, hero intersection, and async model/texture completion. Coalesce pointer deltas until the next frame.

- [x] **Step 3: Stop after the captured settling window**

Set `fluidFramesRemaining = 120` on pointer input, decrement once per rendered frame, clear velocity at zero, and stop scheduling when no other interpolation remains.

- [x] **Step 4: Make manifesto burst composite transparently**

Request the raw WebGL context with `alpha: true`, clear to transparent, and output alpha from the burst luminance:

```glsl
float alpha = clamp(max(max(color.r, color.g), color.b), 0.0, 1.0);
gl_FragColor = vec4(color, alpha);
```

Keep `.manifesto` and `.manifesto-sticky` backgrounds transparent.

- [x] **Step 5: Run final verification**

Run:

```bash
npm run build
npm run lint
```

Then browser-check:

1. Pointer vignette and fluid at top, projects, manifesto, and footer.
2. Hello remains visually unchanged and cursor remains lighter.
3. Lenis scrolling stays fluid during continuous pointer movement.
4. Console contains no shader compilation, WebGL, or resource errors.
5. The renderer visually settles when idle and wakes immediately on input.

