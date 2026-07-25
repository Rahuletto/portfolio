# Reference WebGL Cursor Restoration

## Goal

Restore the supplied `haoqi.design` interaction language in the existing Marban portfolio without copying source identity or copy. The hero must feel like the reference: one center-weighted WebGL composition, restrained editorial grid lines, and a smooth cursor-driven fluid displacement. Remove the added dot field and the oversized foreground cursor treatment.

## Evidence

- The current implementation renders `023-hello.gltf` and `024-cursor.glb` as separate full-viewport Three.js scenes. The cursor scene is scaled and positioned as a dominant foreground object.
- `.grid-overlay::after` adds a page-wide radial dot pattern at every grid intersection.
- The supplied WebGL capture includes an incompressible-fluid pass chain: curl, splat, vorticity, divergence, pressure solve, gradient subtraction, advection, and final displacement composite.
- The reference composite records `uPointerOpacity=0`. Pointer dots are disabled; pointer movement affects the scene through velocity displacement only.
- Reference screenshots keep the 3D cursor as a smaller peripheral object. It is not the page cursor and does not dominate the headline.

## Approaches Considered

### 1. Faithful fluid pipeline — selected

Implement the captured pass chain at a reduced simulation resolution and feed the final velocity texture into a full-resolution composite. This preserves the reference’s inertial, liquid response while remaining performant.

Trade-off: more WebGL code and render targets, but correct motion character and clean separation from React layout.

### 2. Single-pass pointer warp

Apply a radial distortion directly in the hero fragment shader. This is smaller, but movement looks rubbery and local. It lacks persistent curl and momentum.

### 3. DOM/CSS cursor follower

Animate a blurred element or SVG behind the pointer. This is cheapest, but it cannot reproduce the supplied shader behavior and would look like another decorative cursor.

## Architecture

### `HeroWebGLScene`

A single hero WebGL canvas replaces the two independent hero `ModelScene` canvases. It renders the `hello` and cursor GLTF assets into an offscreen scene texture, then composites that texture through the fluid velocity field:

- Uses WebGL2 where available and falls back to an undistorted hero scene if float render targets are unavailable.
- Runs a velocity-only fluid simulation at roughly 192–256 pixels on the long axis.
- Maintains ping-pong floating-point render targets.
- Receives normalized pointer position and frame-correct pointer delta.
- Executes:
  1. curl
  2. pointer splat with vorticity
  3. vorticity confinement
  4. divergence
  5. iterative pressure solve
  6. pressure-gradient subtraction
  7. velocity advection/dissipation
  8. scene composite with velocity displacement and restrained chromatic separation
- Never draws a dot, ring, cursor sprite, or trail marker.
- Pauses when document hidden and reduces work when motion reduction is requested.

### Hero composition

- Render the primary `hello` model as the central focal object.
- Keep the 3D cursor model only as a smaller peripheral scene element, matching reference scale and lower-right placement.
- Tune materials toward the narrow portfolio palette rather than the current oversized orange plastic cursor.
- Remove the standalone star glyph.
- Keep HTML text readable above the WebGL layer.

### Grid

- Retain thin structural horizontal and vertical rules.
- Remove `.grid-overlay::after` completely.
- Remove dotted focus borders; use clean solid focus outlines so “no dots” applies consistently.

## Interaction

- Pointer motion injects velocity. Motion persists briefly and dissipates smoothly.
- Stationary pointer produces no visible marker.
- Coarse-pointer devices render the static WebGL scene without continuous pointer simulation.
- `prefers-reduced-motion: reduce` disables fluid injection and renders a stable composition.
- Canvas remains `pointer-events: none`; normal links and navigation remain fully interactive.

## Performance

- Clamp device pixel ratio for the full-resolution composite.
- Keep simulation texture small and independent of viewport DPR.
- Avoid React state updates during pointer movement.
- Reuse framebuffer, texture, and uniform allocations.
- Resize only when dimensions change.
- Dispose shaders, buffers, textures, framebuffers, and listeners on unmount.

## Testing

- Unit-test extracted pointer normalization, delta clamping, simulation-size selection, and reduced-motion/coarse-pointer policy.
- Component-test that hero includes one fluid background canvas, removes the dot overlay contract, and preserves accessible page content.
- Build with TypeScript/Vite.
- Browser-verify:
  - desktop hero at 1440×900
  - mobile hero at 390×844
  - pointer movement changes canvas pixels without displaying pointer dots
  - no WebGL compile/link errors
  - no horizontal overflow
  - reduced-motion mode remains stable

## Scope

This pass restores the cursor/background interaction and professional hero composition. Project-card shaders and later manifesto animation remain unless visual verification shows a direct regression caused by shared rendering code.
