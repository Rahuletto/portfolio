# Tailwind Migration and Dot Transition

## Goal

Migrate the portfolio’s ordinary interface styling to Tailwind utilities without changing its visual layout, then add a scroll-driven dot field that resolves the WebGL background into solid `#141314` before projects enter.

## Tailwind boundary

Use Tailwind utilities directly in section and component markup for:

- layout, positioning, display, and stacking
- spacing, sizing, typography, color, and borders
- responsive variants
- common transitions and interaction states

Retain a small global stylesheet only for:

- font-face and root document defaults
- WebGL canvas contracts
- keyframes and scroll-timeline animation
- pseudo-elements or calculated effects that have no clear utility equivalent
- the dot-field mask and its scroll-progress variables

Remove migrated selectors from `App.css`. Preserve existing breakpoints, measurements, and visual behavior.

## Dot transition

Add a fixed, pointer-transparent dot layer between the global WebGL background and page content.

The transition begins when the viewport passes the midpoint of the about/profile section. Scroll progress maps from that point to the projects entrance:

1. `#141314` dots appear at small radius over the existing background.
2. Dot radius grows continuously while spacing remains stable.
3. Dots touch and merge.
4. The layer becomes visually solid `#141314` before project cards enter.

Scrolling upward reverses the same progression. The layer must not intercept input, alter document flow, or stop the WebGL renderer. Reduced-motion mode uses a short opacity transition to solid color instead of animated dot growth.

## Architecture

- `BackgroundDotTransition.tsx` owns section observation, normalized progress, and CSS-variable updates.
- `App.tsx` mounts the transition once beside the global WebGL canvas and grid.
- Existing section files remain independent.
- The transition uses one DOM layer and a CSS radial-gradient mask; no extra canvas, textures, or animation loop.
- `requestAnimationFrame` coalesces scroll and resize updates.

## Layer order

1. Global WebGL background
2. Dot-to-solid transition
3. Grid overlay
4. Page sections and interactive content
5. Fixed metadata and progress indicator

Grid lines remain behind all page content.

## Validation

- TypeScript production build passes.
- Lint passes.
- No test files added.
- Confirm the transition reaches solid `#141314` before the first project card crosses into view.
- Confirm reverse scrolling restores the WebGL background.
- Confirm mobile and reduced-motion behavior.
