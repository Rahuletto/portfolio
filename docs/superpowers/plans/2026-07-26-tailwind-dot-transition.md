# Tailwind Migration and Dot Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate ordinary portfolio styling to Tailwind utilities and add a reversible scroll-driven dot field that becomes solid `#141314` before projects enter.

**Architecture:** Section components own their Tailwind layout classes. A single `BackgroundDotTransition` component observes the about-to-project interval and writes normalized progress to CSS custom properties on one fixed radial-gradient layer. Minimal global CSS remains for font setup, WebGL contracts, keyframes, scroll timelines, pseudo-elements, and the dot mask.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, CSS custom properties, `requestAnimationFrame`, Vite.

## Global Constraints

- Preserve existing visual layout, breakpoints, shader values, and WebGL behavior.
- Use `#141314` as the final solid transition color.
- Grid remains behind page content.
- Add no test files and run no test suite.
- Validate with `npm run build` and `npm run lint`.

---

### Task 1: Tailwind section migration

**Files:**
- Modify: `src/sections/HeroSection.tsx`
- Modify: `src/sections/AboutSection.tsx`
- Modify: `src/sections/ProjectsSection.tsx`
- Modify: `src/sections/ManifestoSection.tsx`
- Modify: `src/sections/FinaleSection.tsx`
- Modify: `src/components/GridOverlay.tsx`
- Modify: `src/components/ModelScene.tsx`
- Modify: `src/components/ProjectMedia.tsx`
- Modify: `src/components/Starburst.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: Existing section component props and class-driven visual behavior.
- Produces: Section markup styled primarily with Tailwind utilities and a reduced `App.css`.

- [ ] **Step 1: Map each ordinary selector to Tailwind utilities**

Move positioning, grid/flex layout, sizing, spacing, typography, colors, borders, responsive variants, and z-index into component `className` values. Preserve exact values with arbitrary utilities such as `px-[4vw]`, `text-[clamp(42px,3.8vw,70px)]`, and `z-[1]`.

- [ ] **Step 2: Retain only CSS-only contracts**

Keep selectors needed for `@keyframes`, `animation-timeline`, pseudo-elements, generated orbit child indexing, WebGL canvas lifecycle states, CSS-variable-driven manifesto stages, dot masks, and document/font defaults.

- [ ] **Step 3: Verify migration**

Run:

```bash
npm run build
npm run lint
```

Expected: both commands exit `0`; no section component loses its responsive layout.

### Task 2: Scroll-driven dot-to-solid background

**Files:**
- Create: `src/components/BackgroundDotTransition.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Modify: `src/sections/AboutSection.tsx`
- Modify: `src/sections/ProjectsSection.tsx`

**Interfaces:**
- Consumes: DOM anchors `[data-dot-transition-start]` and `[data-dot-transition-end]`.
- Produces: `BackgroundDotTransition(): JSX.Element`, setting `--dot-progress` and `--dot-radius` on its fixed layer.

- [ ] **Step 1: Add semantic scroll anchors**

Attach `data-dot-transition-start` to the about section and `data-dot-transition-end` to the projects section. These attributes provide stable geometry without coupling the transition to React refs.

- [ ] **Step 2: Implement progress controller**

On scroll and resize, coalesce updates through `requestAnimationFrame`. Compute start at the about section midpoint and completion before the projects section reaches the lower viewport threshold. Clamp progress to `[0, 1]`; write it to the transition layer.

- [ ] **Step 3: Render expanding dots**

Use a fixed `pointer-events-none` layer with a `radial-gradient(circle, #141314 var(--dot-radius), transparent calc(var(--dot-radius) + 1px))` tiled at stable spacing. Interpolate radius until neighboring circles merge, then use layer background `#141314` at full progress. Keep grid at z-index `0`, transition below it, and content at z-index `1`.

- [ ] **Step 4: Add reduced-motion fallback**

When `prefers-reduced-motion: reduce` matches, keep dot radius static and map progress to a short opacity transition toward solid `#141314`.

- [ ] **Step 5: Verify final state**

Run:

```bash
npm run build
npm run lint
git diff --check
```

Expected: all commands exit `0`; working implementation reaches solid `#141314` before project cards enter and reverses on upward scroll.

- [ ] **Step 6: Commit**

```bash
git add src docs/superpowers/plans/2026-07-26-tailwind-dot-transition.md
git commit -m "feat: add dotted page transition"
```
