# Reference WebGL Cursor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the hero as one reference-faithful WebGL composition with fluid pointer refraction, no dot overlay, and a smaller peripheral 3D cursor.

**Architecture:** A focused `HeroWebGLScene` React component owns one Three.js renderer, two GLTF models, an offscreen scene target, and a reduced-resolution velocity simulation. Pure pointer/simulation policy lives in a tested utility module. Captured shader passes live in a shader-only module; `App.tsx` only composes the component.

**Tech Stack:** React 19, TypeScript 6, Three.js r185, WebGL2, Vite 8, Node 24 built-in test runner.

## Global Constraints

- Use the supplied `/Users/marban/Documents/Coding/Agentic/designsniper/output/haoqi.design/` resource and `https://haoqi.design/` as behavior/composition references.
- Do not use Puppeteer. Browser verification uses the in-app agent browser.
- Preserve Marban identity, copy, project content, dark-brown canvas, white ink, and orange accent.
- No visible pointer dot, dot trail, radial dot grid, or dotted focus outline.
- Preserve thin editorial grid lines and strong keyboard focus.
- Disable fluid injection for `prefers-reduced-motion` and coarse pointers.
- Keep the existing finale model and project-card shaders outside this change.

---

### Task 1: Testable Pointer and Simulation Policy

**Files:**
- Create: `src/hero/fluidPolicy.ts`
- Create: `src/hero/fluidPolicy.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `normalizePointer(clientX, clientY, width, height): Point`
- Produces: `clampPointerDelta(current, previous, maxMagnitude): Point`
- Produces: `getSimulationSize(width, height, longAxis): Size`
- Produces: `shouldInjectPointer({ reducedMotion, coarsePointer, visible }): boolean`

- [ ] **Step 1: Add Node test command and write failing tests**

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import {
  clampPointerDelta,
  getSimulationSize,
  normalizePointer,
  shouldInjectPointer,
} from './fluidPolicy.ts'

test('normalizes viewport pointer into bottom-left WebGL coordinates', () => {
  assert.deepEqual(normalizePointer(320, 180, 1280, 720), { x: 0.25, y: 0.75 })
})

test('clamps pointer delta without changing its direction', () => {
  assert.deepEqual(clampPointerDelta({ x: 1, y: 0 }, { x: 0, y: 0 }, 0.125), { x: 0.125, y: 0 })
})

test('keeps simulation long axis fixed while preserving aspect ratio', () => {
  assert.deepEqual(getSimulationSize(1440, 900, 224), { width: 224, height: 140 })
  assert.deepEqual(getSimulationSize(390, 844, 224), { width: 103, height: 224 })
})

test('injects only for visible fine-pointer motion without reduced motion', () => {
  assert.equal(shouldInjectPointer({ reducedMotion: false, coarsePointer: false, visible: true }), true)
  assert.equal(shouldInjectPointer({ reducedMotion: true, coarsePointer: false, visible: true }), false)
  assert.equal(shouldInjectPointer({ reducedMotion: false, coarsePointer: true, visible: true }), false)
  assert.equal(shouldInjectPointer({ reducedMotion: false, coarsePointer: false, visible: false }), false)
})
```

- [ ] **Step 2: Run tests and confirm missing-module failure**

Run: `npm test`

Expected: FAIL with module-not-found for `src/hero/fluidPolicy.ts`.

- [ ] **Step 3: Implement minimal policy**

```ts
export type Point = { x: number; y: number }
export type Size = { width: number; height: number }

export function normalizePointer(clientX: number, clientY: number, width: number, height: number): Point {
  return {
    x: Math.min(1, Math.max(0, clientX / Math.max(width, 1))),
    y: Math.min(1, Math.max(0, 1 - clientY / Math.max(height, 1))),
  }
}

export function clampPointerDelta(current: Point, previous: Point, maxMagnitude: number): Point {
  const dx = current.x - previous.x
  const dy = current.y - previous.y
  const magnitude = Math.hypot(dx, dy)
  const scale = magnitude > maxMagnitude ? maxMagnitude / magnitude : 1
  return { x: dx * scale, y: dy * scale }
}

export function getSimulationSize(width: number, height: number, longAxis: number): Size {
  const scale = longAxis / Math.max(width, height, 1)
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

export function shouldInjectPointer(input: {
  reducedMotion: boolean
  coarsePointer: boolean
  visible: boolean
}): boolean {
  return !input.reducedMotion && !input.coarsePointer && input.visible
}
```

- [ ] **Step 4: Run policy tests**

Run: `npm test`

Expected: 4 passing tests, zero failures.

---

### Task 2: Fluid Shader Pipeline

**Files:**
- Create: `src/hero/fluidShaders.ts`
- Create: `src/hero/fluidSimulation.ts`
- Modify: `src/hero/fluidPolicy.test.ts`

**Interfaces:**
- Consumes: `Size` from `fluidPolicy.ts`
- Produces: `FluidSimulation` with `resize(size)`, `step(input)`, `velocityTexture`, and `dispose()`
- Produces: exact GLSL passes for curl, splat/vorticity, divergence, pressure, projection, advection, and composite

- [ ] **Step 1: Add failing lifecycle test for the renderer-independent target policy**

Add a test proving a resize is required only when simulation dimensions change:

```ts
import { simulationSizeChanged } from './fluidSimulation.ts'

test('reallocates simulation targets only when dimensions change', () => {
  assert.equal(simulationSizeChanged({ width: 224, height: 140 }, { width: 224, height: 140 }), false)
  assert.equal(simulationSizeChanged({ width: 224, height: 140 }, { width: 225, height: 140 }), true)
})
```

- [ ] **Step 2: Run tests and confirm missing-export failure**

Run: `npm test`

Expected: FAIL with missing `simulationSizeChanged` export.

- [ ] **Step 3: Implement the captured pass chain**

Use `THREE.WebGLRenderTarget` ping-pong pairs with half-float textures, nearest filtering, no depth/stencil. Compile full-screen-triangle materials with captured constants:

```ts
const SPLAT_RADIUS = 0.003
const SPLAT_FORCE = 3000
const VELOCITY_DISSIPATION = 3
const PRESSURE_ITERATIONS = 12
```

`step()` order:

```ts
curl -> splat -> vorticity -> divergence ->
clear pressure -> 12 pressure iterations ->
gradient subtract -> advection
```

Pointer overlay uniforms from the capture must not exist in the composite shader. The composite samples only `tDiffuse`, `uVelocity`, `uSimSize`, `uDisplacementStrength`, and `uChromaticBoost`.

- [ ] **Step 4: Run tests and TypeScript build**

Run: `npm test && npm run build`

Expected: all tests pass and build exits 0.

---

### Task 3: Unified Reference-Faithful Hero Scene

**Files:**
- Create: `src/hero/HeroWebGLScene.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `/assets/023-hello.gltf`, `/assets/024-cursor.glb`
- Consumes: `FluidSimulation`
- Produces: `<HeroWebGLScene />` with one `.hero-webgl` canvas

- [ ] **Step 1: Add failing policy assertion for reference composition values**

Export and test `getHeroLayout(aspect): HeroLayout` from `fluidPolicy.ts`:

```ts
test('keeps cursor peripheral on a 16:9 hero', () => {
  assert.deepEqual(getHeroLayout(16 / 9), {
    helloScale: 5.0,
    helloPosition: { x: 0.25, y: 0.1, z: 0 },
    cursorScale: 0.7,
    cursorPosition: { x: 3.65, y: -1.9, z: 0.5 },
  })
})
```

- [ ] **Step 2: Run tests and confirm missing-export failure**

Run: `npm test`

Expected: FAIL with missing `getHeroLayout` export.

- [ ] **Step 3: Build one offscreen Three.js scene**

`HeroWebGLScene` must:

- create one renderer and one perspective camera
- load both GLTF assets into one scene
- center each asset from its bounding box before scale/position
- use dark orange physical material for `hello`
- use deeper red/orange glass material for the cursor
- render scene into a full-resolution target
- run `FluidSimulation.step()` before the final composite
- update coordinate metadata through a callback no more than once per animation frame
- pause requestAnimationFrame work while `document.hidden`
- dispose cloned geometries/materials, targets, simulation resources, and listeners

- [ ] **Step 4: Replace hero canvases and remove visual noise**

In `App.tsx`:

```tsx
<HeroWebGLScene />
```

Replace the two hero `ModelScene` nodes. Keep `ModelScene` only for finale. Remove `.orb--star`.

In `App.css`:

- remove `.grid-overlay::after`
- replace dotted focus border with a 1px solid outline
- place `.hero-webgl` behind text
- tune hero text and model z-index to match reference overlap
- reduce cursor scale/position for mobile

- [ ] **Step 5: Build and lint**

Run: `npm test && npm run lint && npm run build`

Expected: all commands exit 0.

---

### Task 4: Agent-Browser Visual and Interaction Verification

**Files:**
- Modify if required by evidence: `src/hero/HeroWebGLScene.tsx`
- Modify if required by evidence: `src/App.css`

**Interfaces:**
- Consumes: local Vite app at `http://127.0.0.1:5173/`
- Produces: verified desktop/mobile hero and console-clean runtime

- [ ] **Step 1: Capture desktop baseline**

Use the in-app agent browser at 1440×900. Verify:

- hello object fills roughly center 55–65% width
- cursor is peripheral in lower-right and less than 15% viewport width
- headline overlaps hero scene without becoming unreadable
- thin grid lines remain
- no grid dots or visible pointer marker

- [ ] **Step 2: Verify fluid response**

Move pointer rapidly from upper-left to lower-right. Capture immediately after movement and after dissipation. Verify local scene refraction/chromatic wake appears near the pointer path, then fades.

- [ ] **Step 3: Verify mobile**

Use 390×844 viewport. Verify same scene/story, no horizontal overflow, readable 16px body text, functional navigation, and no continuous pointer simulation.

- [ ] **Step 4: Inspect runtime**

Read browser console for shader compile/link errors, WebGL warnings introduced by this change, React errors, and asset failures.

- [ ] **Step 5: Run final verification**

Run: `npm test && npm run lint && npm run build`

Expected: tests, lint, and build all exit 0 with no failures.
