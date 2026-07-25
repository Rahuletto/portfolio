# Dump-Driven Global WebGL Design

## Objective

Run the supplied Haoqi vignette and cursor-fluid system across the full portfolio while preserving the dump shader logic. Keep the hero glass models in the same renderer, make only the cursor model lighter, and remove avoidable GPU overhead.

## Source of Truth

`/Users/marban/Downloads/webgl-dump-haoqi.design.json` is the shader and simulation source of truth.

- Program 3: pointer-following vignette.
- Programs 17–22: velocity, curl, divergence, pressure, projection, and advection passes.
- Program 23: fluid displacement/display pass.
- Program 14: additive `tBase + tFlare` compositor.
- Program 12: glass refraction, tint, specular, and Fresnel material.

No replacement shader math or new visual effect is introduced. The orange theme changes captured color uniforms only.

## Architecture

Replace the hero-scoped canvas with one fixed full-viewport WebGL2 canvas mounted at application root.

The renderer owns:

1. Vignette background pass.
2. One fluid simulation.
3. Hero decorations and glass models.
4. Fluid display and flare composition.
5. Final composite.

Inside the hero viewport, the renderer draws the supplied background, decorations, `hello`, and cursor models. After the hero leaves view, models and decorations stop rendering while the vignette and cursor-fluid passes remain active for the rest of the document.

The canvas remains below DOM content. Text and project media remain sharp and are not rasterized. Section backgrounds become transparent where they currently hide the global vignette. The manifesto retains its burst content with a transparent clear pass so the global background remains visible.

## Interaction

The vignette uses dump program 3 and its captured controls:

- `uRadius = 0.354`
- `uFalloff = 1`
- `uSkew = 0.54`
- `uAngle = 0`
- `uEdgeIntensity = -0.82`
- `uDisplace = 0`

The authored Program 3 vertex and fragment bodies are used verbatim. The generated `#version 300 es`, Three.js built-in uniforms, transfer functions, and output wrapper remain renderer-generated instead of being copied into application shader source.

`uPos` is the only movement input. No time uniform, scroll formula, noise, sine sweep, or custom parallax is added. The pointer-following vignette supplies the requested parallax-like depth using the original logic. `uMix` remains declared but unused, matching the dump. The material remains transparent and preserves `falloff` as fragment alpha.

The global fluid uses the dump simulation:

- Simulation size based on captured `209 × 160`.
- Splat radius `0.003`.
- Splat force `3000`.
- Curl strength `0`.
- Dissipation `3`.
- Program 23 displacement strength `1`.
- Program 23 chromatic boost `0.5`.

Pointer data uses viewport coordinates throughout the document. Fluid remains visible while navigating every section.

## Glass Models

Program 12 remains the model material for both objects.

`hello` retains its current validated uniforms. The cursor becomes lighter only by raising program 12's existing `uBrightness` uniform for cursor material. IOR, refraction, tint algorithm, specular, Fresnel, and chromatic sampling remain shared with `hello`.

## Performance

Performance changes affect orchestration only:

- One WebGL renderer and one fluid simulation.
- Reuse all render targets and materials; no frame-time allocations.
- Fixed low-resolution fluid targets matching dump proportions.
- Cap display pixel ratio at `1.25`; use `1.0` when the viewport exceeds two million CSS pixels.
- Coalesce pointer movement into one update per animation frame.
- Run at display refresh rate while pointer velocity or hero animation is active.
- Stop requesting frames after 120 settling frames without new pointer or scroll input; restart immediately on input.
- Stop GPU work while the document is hidden.
- Skip hero model draw calls once the hero is outside its active scroll range.
- Keep texture loading, shader compilation, and model setup one-time.
- Preserve reduced-motion and coarse-pointer fallbacks.

If WebGL2 initialization fails, the app retains its CSS background and static media instead of leaving a blank page.

## Scope Boundaries

- No per-section renderer.
- No DOM rasterization or SVG displacement.
- No invented parallax shader.
- No project-media color treatment changes in this pass.
- No test files.

## Verification

- Run `npm run build`.
- Run `npm run lint`.
- Browser-check pointer vignette at top, projects, manifesto, and footer.
- Confirm global fluid remains active after leaving hero.
- Confirm `hello` appearance remains unchanged.
- Confirm cursor model is lighter.
- Confirm browser console has no WebGL warnings or shader errors.
- Inspect animation smoothness during continuous pointer movement and Lenis scrolling.
