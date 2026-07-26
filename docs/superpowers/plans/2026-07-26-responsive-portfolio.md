# Responsive Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio intentionally responsive across phones, tablets, landscape devices, and desktop while preserving current design.

**Architecture:** Keep existing React structure and desktop utilities. Add semantic section hooks and a scoped CSS responsive layer with tablet, mobile, compact-width, and short-height rules. Validate through browser screenshots and bounded DOM geometry checks.

**Tech Stack:** React 19, TypeScript 6, Tailwind CSS 4, Vite 8, WebGL, browser viewport automation

## Global Constraints

- Preserve desktop art direction above 1024px.
- Do not remove WebGL, grid, transitions, or editorial project variation.
- Do not introduce dependencies.
- Prevent horizontal overflow at every target viewport.
- Keep body text readable and interactive targets usable on touch devices.

---

### Task 1: Add stable responsive hooks

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/sections/HeroSection.tsx`
- Modify: `src/sections/AboutSection.tsx`
- Modify: `src/sections/ProjectsSection.tsx`
- Modify: `src/sections/ManifestoSection.tsx`

**Interfaces:**
- Consumes: Existing JSX and Tailwind utility classes.
- Produces: Stable `site-*` and section element class hooks for scoped CSS.

- [ ] **Step 1: Capture current browser geometry**

Run viewport checks at 390×844, 768×1024, and 1440×900. Record document scroll width and hero element bounds.

- [ ] **Step 2: Add semantic hook classes**

Add hook classes without changing content, data flow, or component interfaces.

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: TypeScript and Vite complete successfully.

### Task 2: Implement responsive layout system

**Files:**
- Modify: `src/App.css`

**Interfaces:**
- Consumes: Hook classes from Task 1.
- Produces: Tablet, mobile, compact-width, landscape, and short-height layout behavior.

- [ ] **Step 1: Add tablet rules**

At 761px–1024px, rebalance hero metadata, hero headline, about columns, projects to six columns, fixed UI, and grid overlay selection.

- [ ] **Step 2: Add mobile rules**

At up to 760px, normalize side padding, fluid type, stacked about layout, project spans, media ratios, safe-area fixed metadata, and section heights.

- [ ] **Step 3: Add compact and landscape rules**

At up to 480px and short/landscape viewports, reduce collision-prone offsets and bound large text with `clamp()`.

- [ ] **Step 4: Add containment safeguards**

Use `min-width: 0`, safe wrapping, `overflow-wrap`, and bounded media sizing only where needed.

- [ ] **Step 5: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Both commands exit successfully.

### Task 3: Browser matrix and iterative polish

**Files:**
- Modify: `src/App.css` if browser evidence exposes defects.
- Modify: section components only when a CSS hook or structure correction is required.

**Interfaces:**
- Consumes: Responsive CSS from Task 2.
- Produces: Verified geometry and screenshots across target viewports.

- [ ] **Step 1: Test portrait phones**

Test 320×568 and 390×844. Inspect hero, about, projects, manifesto boundary, and final section. Confirm document scroll width equals viewport width.

- [ ] **Step 2: Test landscape phone**

Test 568×320. Confirm hero metadata, artwork, headline, and fixed metadata do not collide.

- [ ] **Step 3: Test tablets**

Test 768×1024, 820×1180, and 1024×768. Confirm intentional grid changes, readable text measures, and balanced section rhythm.

- [ ] **Step 4: Regression-test desktop**

Test 1440×900. Confirm desktop layout remains consistent with baseline.

- [ ] **Step 5: Re-run verification**

Run: `npm run build && npm run lint`
Expected: Both commands exit successfully, with browser console free of new errors.

