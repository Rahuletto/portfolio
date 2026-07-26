# Premium Rendering and Scroll Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase WebGL sharpness with adaptive quality and add restrained scroll choreography across the portfolio.

**Architecture:** A pure render-quality controller selects and adapts DPR/post-processing tiers without recreating GPU resources. A shared React hook batches viewport progress into CSS custom properties, while section CSS performs transform/opacity/clip motion.

**Tech Stack:** React 19, TypeScript 6, Three.js r185, WebGL, CSS custom properties, Lenis, Node test runner.

## Global Constraints

- No new runtime dependency.
- Preserve existing shaders, GLTF materials, fluid parameters, content, and layout.
- Use transform/opacity/clip-path for DOM motion; do not animate layout properties.
- Respect `prefers-reduced-motion: reduce`.
- Preserve coarse-pointer static project media.
- Do not overwrite unrelated uncommitted changes.

---

### Task 1: Adaptive Render Quality

**Files:**
- Create: `src/hero/renderQuality.test.ts`
- Create: `src/hero/renderQuality.ts`
- Modify: `src/hero/GlobalWebGLScene.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces: `selectInitialQuality(viewportPixels, devicePixelRatio): RenderQualityTier`
- Produces: `createQualityController(initialTier): QualityController`
- Consumes: active-frame duration samples from `GlobalWebGLScene`.

- [ ] **Step 1: Add failing tests for initial tiers and sustained-frame adaptation**

Test high-DPR desktop selection, large-viewport balanced selection, slow-frame downgrade, cooldown, and fast-frame recovery with the Node test runner.

- [ ] **Step 2: Run `npm run test` and confirm failure from missing module**

- [ ] **Step 3: Implement pure tier selection and controller**

Use named tiers `conservative`, `balanced`, and `high`. Require a sustained slow window before downgrade and a longer fast window plus cooldown before recovery.

- [ ] **Step 4: Run `npm run test` and confirm all quality tests pass**

- [ ] **Step 5: Wire the controller into existing target resizing**

Set display DPR from the tier, post long edge from the tier, and apply tier changes only through the existing `updateLayout` path.

### Task 2: Premium Project Media Resolution

**Files:**
- Modify: `src/components/ProjectMedia.tsx`

**Interfaces:**
- Consumes: browser DPR and existing intersection state.
- Produces: a project canvas capped at DPR `2`.

- [ ] **Step 1: Raise the fine-pointer canvas DPR cap from `1.5` to `2`**

- [ ] **Step 2: Preserve source-size uniforms and intersection culling**

- [ ] **Step 3: Run `npm run build`**

### Task 3: Shared Scroll Reveal Engine

**Files:**
- Create: `src/hooks/scrollProgress.test.ts`
- Create: `src/hooks/scrollProgress.ts`
- Create: `src/hooks/useScrollReveal.ts`
- Modify: `src/sections/AboutSection.tsx`
- Modify: `src/sections/ProjectsSection.tsx`
- Modify: `src/sections/Manifesto.tsx`
- Modify: `src/sections/SkillsPlaceholderSection.tsx`

**Interfaces:**
- Produces: `getElementScrollProgress(rectTop, rectHeight, viewportHeight): number`
- Produces: `useScrollReveal<T extends HTMLElement>(): RefObject<T | null>`
- Consumes: native scroll, `portfolio:scroll`, resize, and intersection events.

- [ ] **Step 1: Add failing boundary tests for normalized scroll progress**

- [ ] **Step 2: Run `npm run test` and confirm failure from missing module**

- [ ] **Step 3: Implement clamped normalized progress**

- [ ] **Step 4: Run `npm run test` and confirm progress tests pass**

- [ ] **Step 5: Implement one-RAF scroll hook with IntersectionObserver**

Write `--reveal-progress` and `data-reveal-visible` only while the element is near viewport.

- [ ] **Step 6: Register sections and stable project indices**

Use one section ref for Projects and `--project-index`/`--project-direction` per article.

### Task 4: Editorial Motion Styling

**Files:**
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `--reveal-progress`, `--project-index`, and `--project-direction`.
- Produces: final section and project choreography.

- [ ] **Step 1: Add base hidden-to-visible project media, metadata, and section transforms**

- [ ] **Step 2: Add continuous project parallax driven by normalized progress**

- [ ] **Step 3: Add reduced-motion final-state overrides**

- [ ] **Step 4: Run `npm run test`, `npm run build`, and `npm run lint`**

### Task 5: Visual Verification

**Files:**
- Modify only if inspection reveals a scoped regression.

**Interfaces:**
- Consumes: local Vite page.
- Produces: evidence of desktop/mobile rendering and console health.

- [ ] **Step 1: Inspect hero crispness and scroll motion at desktop width**

- [ ] **Step 2: Inspect responsive behavior at mobile width**

- [ ] **Step 3: Verify reduced-motion final states**

- [ ] **Step 4: Review final diff for unrelated changes**
