# Hero Load Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an asset-backed loading screen and center-out dotted hero reveal on every refresh.

**Architecture:** A focused React controller owns loader and reveal phases. `GlobalWebGLScene` reports readiness and consumes normalized intro progress through callbacks/props, while CSS handles the loader, dot mask, and text choreography without another renderer.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Three.js/WebGL2, CSS masks and transforms.

## Global Constraints

- Preserve the approved final hero composition, colors, glass material, cursor behavior, and model sizes.
- Use an 8px dot pitch and exact `50% 50%` circular reveal origin.
- Run build and lint only. Create no test files.
- Support `prefers-reduced-motion`.
- Preserve all unrelated uncommitted work.

---

### Task 1: Intro state controller and loading surface

**Files:**
- Create: `src/intro/useHeroIntro.ts`
- Create: `src/intro/HeroIntroOverlay.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `HeroIntroState` with `phase`, `loadProgress`, `revealProgress`, `interactionReady`, `reportAssetsReady`
- Consumes: asset-ready notification from `GlobalWebGLScene`

- [ ] **Step 1: Add phase controller**

Implement `loading → loader-exit → revealing → complete` with one `requestAnimationFrame` timeline. Keep displayed progress below `0.94` until assets report ready, then complete and advance.

- [ ] **Step 2: Add accessible overlay**

Render a fixed loader with `role="status"` and `role="progressbar"`, then a separate fixed dotted reveal layer. Set CSS variables:

```tsx
style={{
  '--intro-load-progress': loadProgress,
  '--intro-reveal-progress': revealProgress,
} as React.CSSProperties}
```

- [ ] **Step 3: Wire App**

Mount the overlay above hero content, pass readiness callback and reveal progress to WebGL, and publish intro state to `HeroSection`.

- [ ] **Step 4: Verify**

Run:

```bash
npm run build
npm run lint
```

Expected: both commands exit `0`.

### Task 2: Asset readiness and WebGL intro transform

**Files:**
- Modify: `src/hero/GlobalWebGLScene.tsx`

**Interfaces:**
- Consumes: `introProgress: number`, `interactionReady: boolean`, `onAssetsReady: () => void`
- Produces: one readiness callback after models and stickers settle

- [ ] **Step 1: Track required asset promises**

Store model and decoration promises, report readiness once both resolve, and report renderer fallback readiness so loader cannot deadlock.

- [ ] **Step 2: Apply intro scale/depth**

Before scroll transforms, interpolate model and decoration intro factors:

```ts
const introEase = 1 - Math.pow(1 - introProgress, 3)
const helloIntroScale = THREE.MathUtils.lerp(0.68, 1, introEase)
const introDepth = THREE.MathUtils.lerp(-1.15, 0, introEase)
```

Multiply only the initial model/decorative scale and add the intro depth offset. At progress `1`, existing values must be bit-for-bit equivalent.

- [ ] **Step 3: Gate interaction**

Ignore pointer injection and freeze pointer-driven glass offsets until `interactionReady`. Keep the rendered background alive during reveal.

- [ ] **Step 4: Verify**

Run build and lint. Refresh at desktop and mobile widths; confirm final scale matches pre-intro layout.

### Task 3: Dot mask and hero typography choreography

**Files:**
- Modify: `src/App.css`
- Modify: `src/sections/HeroSection.tsx`

**Interfaces:**
- Consumes: intro phase classes/data attributes from `App`
- Produces: center-out reveal and text/sticker timing

- [ ] **Step 1: Style loader**

Use transform-scaled progress fill and opacity transitions. Do not animate width or height.

- [ ] **Step 2: Style center-out dots**

Build a full dot field with 8px pitch, then remove it using a CSS radial mask centered at `50% 50%`. Compute the reveal radius far enough to clear viewport corners.

- [ ] **Step 3: Add text masks**

Wrap top label, paragraph lines, statement lines, and `creative` in clipped spans. Drive transform/opacity with phase classes and restrained stagger delays.

- [ ] **Step 4: Add reduced-motion behavior**

Collapse loader exit and reveal to short opacity transitions, skip scale/depth travel, then enable interaction.

- [ ] **Step 5: Verify**

Run:

```bash
npm run build
npm run lint
```

Inspect refresh behavior in browser. Confirm no layout jump, exact reveal center, no premature pointer effects, and no changes to later dotted transition.

### Task 4: Final browser pass and commit

**Files:**
- Review all files listed above.

- [ ] **Step 1: Check dirty-worktree scope**

Use `git diff` to distinguish prior edits from intro edits. Do not stage unrelated changes.

- [ ] **Step 2: Browser verification**

Verify desktop, mobile, reduced motion, reload behavior, loader accessibility, and hero final state.

- [ ] **Step 3: Commit**

Stage only intro implementation files plus deliberate shared-file hunks and commit:

```bash
git commit -m "feat: add hero load reveal"
```

