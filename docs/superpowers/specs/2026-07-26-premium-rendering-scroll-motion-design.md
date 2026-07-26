# Premium Rendering and Scroll Motion Design

## Objective

Make the portfolio feel materially sharper and more premium without replacing its existing WebGL visual language. Increase useful render resolution, preserve frame stability through adaptive quality, and add editorial scroll choreography across Projects, About, Manifesto, and Skills.

## Rendering Quality

The global Three.js surface uses a quality tier derived from device pixel ratio and viewport cost:

- High: display DPR up to `2`, post-processing long edge up to `1440`.
- Balanced: display DPR up to `1.5`, post-processing long edge up to `1080`.
- Conservative: display DPR up to `1`, post-processing long edge up to `720`.

The renderer starts at the highest safe tier for the viewport. A small frame-time monitor samples active animation frames. Sustained slow frames step the renderer down one tier; sustained fast frames may restore one tier after a cooldown. Quality changes resize existing render targets only. They do not rebuild the renderer, materials, scene, or simulation.

The fluid simulation remains low resolution by design. Raising fluid resolution would add cost without improving edge sharpness. The scene, refraction, flare, and final composite targets follow display DPR. Background distortion passes follow the active post-processing long edge.

Project-media WebGL canvases use DPR up to `2` on fine pointers and remain intersection-culled. Source images keep their native dimensions; the shader does not upscale beyond the canvas display requirement.

## Scroll Motion

A shared `useScrollReveal` hook applies normalized viewport progress to registered sections through CSS custom properties. It listens to the existing `portfolio:scroll` Lenis event and native scroll fallback, batches reads and writes into one animation frame, and observes only mounted elements.

Projects use:

- Staggered entrance from `24px` below with opacity and clip reveal.
- Media scale from `1.045` to `1`.
- Alternating horizontal drift capped at `18px`.
- Metadata reveal following the media by a short stagger.
- Continuous progress only while near the viewport.

About uses independent art and copy entrances with shallow opposing drift. Manifesto keeps its existing timeline and adds only a section-level lift/fade. Skills receives a minimal reveal treatment despite being a placeholder.

All DOM animation uses `transform`, `opacity`, and `clip-path`. No layout properties animate. Motion remains restrained so project imagery stays readable.

## Accessibility and Performance

- `prefers-reduced-motion: reduce` resolves all content to its final visible state and disables continuous scroll transforms.
- Coarse pointers retain static project images and do not initialize project shader canvases.
- Intersection observation suspends continuous scroll work for distant sections.
- Existing semantic structure and reading order remain unchanged.
- No new runtime dependency.

## File Boundaries

- `src/hero/renderQuality.ts`: pure tier selection and frame-budget controller.
- `src/hooks/useScrollReveal.ts`: shared scroll progress orchestration.
- `src/hero/GlobalWebGLScene.tsx`: consume render-quality decisions and resize existing targets.
- `src/components/ProjectMedia.tsx`: use premium DPR cap without changing shader behavior.
- Section components: add reveal registration and stable motion indices.
- `src/App.css`: owns project and section motion presentation.

## Verification

- Pure quality-controller tests cover tier selection, downgrade, cooldown, and recovery.
- `npm run test`
- `npm run build`
- `npm run lint`
- Browser inspection at desktop and mobile widths.
- Confirm no WebGL warnings, visible canvas softness, content popping, or reduced-motion regressions.
