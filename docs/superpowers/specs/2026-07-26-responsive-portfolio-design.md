# Responsive Portfolio Design

## Goal

Make the existing portfolio feel intentionally composed from 320px phones through tablets and desktop without changing its visual identity or desktop art direction.

## Responsive Architecture

Use a small, CSS-led breakpoint system around the existing components:

- Base: desktop composition above 1024px.
- Tablet: 761px to 1024px, preserving asymmetry while widening text columns and reducing fixed offsets.
- Mobile: up to 760px, using stacked reading order and two-column project rhythm.
- Compact mobile: up to 480px, tightening type and spacing without shrinking body copy below readable sizes.
- Short/landscape viewports: height-based adjustments for hero content and fixed metadata.

Responsive rules live in `src/App.css`. Existing Tailwind utilities remain the default desktop source of truth. Components receive stable semantic hook classes only where a scoped rule cannot reliably target existing markup.

## Layout Rules

### Global

- No horizontal document overflow at any tested viewport.
- Images and canvases stay inside their containers.
- Fixed metadata respects safe-area insets and does not collide with hero copy.
- Desktop layout above 1024px remains visually unchanged.

### Hero

- Keep WebGL artwork and grid full-viewport.
- Tablet retains two metadata columns with a larger right-hand measure and balanced gutter.
- Mobile keeps the compact right-side introduction and oversized lower headline.
- Short screens reduce vertical offsets and headline scale so all primary copy remains visible.
- Landscape phones use a compact two-column header and a bounded headline.

### About

- Desktop stays two-column.
- Tablet uses a narrower artwork column and fluid text sizing.
- Mobile stacks artwork and copy with controlled gaps and readable paragraph sizing.

### Projects

- Desktop keeps the twelve-column editorial layout.
- Tablet uses a six-column editorial grid with preserved variety and no overly narrow cards.
- Mobile uses two columns; compact projects may occupy one column, while wide and portrait work spans both when needed.
- Project metadata wraps safely and never forces overflow.

### Manifesto and Fixed UI

- Scroll-driven canvases fill their sticky containers at every aspect ratio.
- The side progress indicator hides below desktop.
- Grid variants align with their intended desktop, tablet, and mobile ranges.
- Reduced-motion behavior remains intact.

## Validation

Browser checks cover:

- 320×568
- 390×844
- 568×320
- 768×1024
- 820×1180
- 1024×768
- 1440×900

At each size, inspect hero, about, project grid, manifesto boundary, and page end. Validate scroll width equals viewport width, major content boxes stay in bounds, text does not overlap, and console has no layout-related errors.

