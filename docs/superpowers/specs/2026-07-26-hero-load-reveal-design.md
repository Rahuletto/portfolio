# Hero Load Reveal Design

## Goal

Give every page refresh a deliberate opening sequence without changing the approved hero composition, colors, glass material, cursor behavior, or final model scale.

## Sequence

1. A full-viewport loading layer appears immediately on every refresh.
2. The loader shows a minimal `MARBAN` label and horizontal progress bar.
3. Progress reflects the actual hero model and texture loading state. It may ease visually, but it must not complete before required assets are ready.
4. Once loading completes, the loader exits in approximately 0.8–1.0 seconds.
5. The hero begins fully covered by an 8px dot field.
6. A circular mask expands from the exact viewport center, removing dots from the center toward every edge over approximately 1.2 seconds.
7. During the dot reveal, the `hello` model scales from 68% to its existing approved size, moves slightly forward in depth, and settles with a restrained ease. The existing final size remains unchanged.
8. Hero copy reveals in a controlled stagger:
   - `Designer and Developer` fades upward first.
   - The introduction paragraph reveals line by line through clipped masks.
   - The bottom statement reveals in two upward-moving lines.
   - The orange `creative` word arrives slightly after its surrounding text.
9. Stickers enter after the `hello` model with small scale/depth offsets and a subtle stagger. They must not bounce.
10. Pointer fluid, glass-light tracking, and cursor interaction activate only after the opening reveal completes.

## Architecture

- Add a focused React loading/reveal controller mounted by `App`.
- Keep loader DOM, dot mask, and text choreography outside the WebGL render pipeline.
- Publish normalized load and reveal values through CSS custom properties and a small browser event/state interface.
- Extend `GlobalWebGLScene` with asset-readiness reporting and an intro-progress input.
- Apply intro progress only to initial model scale/depth and interaction gating. Existing scroll transforms remain unchanged after progress reaches `1`.
- Keep the existing About-to-Projects dotted transition independent. Intro dots use a separate component and variables.

## Visual Rules

- Background, glass hue, orange accent `#E05035`, Degular Demo typography, grid, and final hero layout remain unchanged.
- Dot pitch is 8px.
- Reveal origin is mathematically centered at `50% 50%`.
- Animation uses transforms, opacity, clip-path/masks, and shader uniforms only. No layout-driven animation.
- No generic glow, blur wash, bounce, or elastic motion.

## Performance

- Loader prevents interaction while required hero assets initialize.
- WebGL remains mounted once; the intro does not create another renderer.
- CSS radial masking performs the dot reveal.
- Pointer simulation remains idle until reveal completion.
- Animation state updates use `requestAnimationFrame` and stop once progress reaches its terminal value.

## Accessibility

- Loader exposes a polite loading status and progress value.
- Page content remains non-interactive while loading.
- `prefers-reduced-motion` replaces the sequence with a short opacity reveal and immediately enables interaction after assets are ready.

## Verification

- Run the existing production build and linter only. No test files.
- Verify refresh behavior, exact center origin, final model scale, copy timing, pointer activation, reduced motion, and mobile layout in the browser.

