# AGENTS.md — Animation & Performance Directives

> **CRITICAL ARCHITECTURAL DIRECTIVE FOR ALL AI AGENTS & DEVELOPERS:**
>
> All JavaScript, WebGL, CSS-variable, and scroll-driven frame updates across this codebase **MUST strictly use the central `animEngine`** (`src/engine/animEngine.ts`).
> Creating standalone `requestAnimationFrame` loops, uncoordinated `setInterval`/`setTimeout` frame loops, or independent ticker hooks outside `animEngine` is **STRICTLY FORBIDDEN**.
>
> The primary goal of this codebase is **Silky Smooth 60–120 FPS Performance** under all conditions (including low-power mode and mobile browsers).

---

## ⚡ Why `animEngine` is Mandatory

The central `animEngine` coordinates all frame callbacks under a single shared `requestAnimationFrame` ticker. It guarantees maximum performance, zero main-thread contention, and proper resource cleanups:

1. **Single Shared rAF Ticker**: Prevents multiple independent rAF loops from competing for frame budget.
2. **Automatic Sleep Mode**: The rAF ticker automatically pauses when 0 tasks are running, eliminating idle CPU/GPU frame spinning.
3. **Automated Tab Visibility Freeze**: Listens to `visibilitychange` (`document.hidden`) and window `blur`/`focus` events to freeze 100% of WebGL renders and JS animations when the user switches tabs or minimizes the window.
4. **Automatic Garbage Collection & Cleanups**: Task callbacks that return `false` automatically deregister themselves after a single frame update. Returning `true` keeps the task running continuously until explicit cleanup.

---

## 💎 Strict Performance & Silky Smoothness Directives

### 1. Zero Layout Thrashing (Forced Reflows)
- **STRICT PROHIBITION**: NEVER call layout-query properties (`getBoundingClientRect()`, `offsetHeight`, `offsetTop`, `clientWidth`, `scrollHeight`) inside scroll event handlers, mousemove listeners, or frame animation loops.
- **CORRECT PATTERN**: Measure element layout dimensions **ONCE** on mount, resize, or IntersectionObserver entry. During scroll, compute position dynamically using `window.scrollY` + cached offsets in $O(1)$ time.

### 2. GPU Compositor Thread Isolation
- **Opacity & Transform Only**: Animate elements using CSS `transform` (`translate3d`, `scale`) and `opacity`. Avoid animating layout-triggering properties (`top`, `left`, `width`, `height`, `margin`, `padding`).
- **Zero Dynamic Gradient Repaints**: Do NOT mutate dynamic CSS `radial-gradient(...)` string functions inside high-frequency scroll loops. Use static composite layers and adjust opacity or GPU transform matrix instead.
- **Hardware Layer Promotion**: Use `will-change: transform, opacity` or `transform: translateZ(0)` on animated elements to isolate them into GPU compositor layers.

### 3. Strict WebGL Lifetime & VRAM Management
- **Viewport Auto GC**: Below-fold canvas components (`ProjectMedia.tsx`) MUST dispose WebGL resources (textures, buffers, shaders, program) and explicitly lose context (`gl.getExtension('WEBGL_lose_context')?.loseContext()`) when elements scroll >800px out of view. Re-instantiate lazily on hover.
- **Retina DPR Caps**: WebGL pixel ratios MUST be capped (`Math.min(window.devicePixelRatio, 1.5)`) to prevent GPU thermal throttling and VSync 30Hz dropouts on Retina screens.
- **Hero Render Offloading**: Pause Three.js scene rendering completely when scrolled past the hero section (`scrollProgress >= 0.99`).

### 4. Image Asset Payload & WebP Pipeline
- **STRICT ASSET RULE**: All image assets in `public/assets/` MUST be converted to optimized **WebP format** using `bun run webp`. Raw PNG/JPG files > 500KB are strictly forbidden.
- **Alpha Transparency**: The `bun run webp` pipeline preserves 8-bit RGBA alpha transparency while reducing file weight by ~98%.

---

## 🛠️ `animEngine` Usage Guidelines

### 1. Continuous Tasks (WebGL Scenes, Scroll Engine)
For animations that run continuously while active (e.g. Three.js scenes, Lenis smooth scroll ticker):

```ts
import { animEngine } from '../engine/animEngine.ts'

useEffect(() => {
  const removeTask = animEngine.addTask('mySceneTask', (dt, now) => {
    // Perform WebGL draw or frame update
    renderScene(dt, now)

    // Return true to keep running, or false to stop
    return isSceneVisible
  })

  return () => removeTask() // Cleanup on component unmount
}, [isSceneVisible])
```

---

### 2. One-Shot & Event-Driven Tasks (Scroll Reveals, Progress Locks)
For frame updates triggered by events (e.g. `scroll`, `resize`) that only need to run for 1 frame:

```ts
import { animEngine } from '../engine/animEngine.ts'

let removeTask: (() => void) | null = null

const onScroll = () => {
  if (!removeTask) {
    removeTask = animEngine.addTask('scrollUpdateTask', () => {
      // Calculate progress and update inline CSS variables
      updateScrollProgress()
      removeTask = null
      return false // Automatically deregisters after 1 frame
    })
  }
}

window.addEventListener('scroll', onScroll, { passive: true })
```

---

### 3. Smooth Lerp Animations (Hover Effects, Progress Smoothing)
For smooth numerical interpolations (e.g. card hover shader dissolve, camera movement):

```ts
import { animEngine } from '../engine/animEngine.ts'

let lerpControl: ReturnType<typeof animEngine.addLerp> | null = null

const onPointerEnter = () => {
  if (!lerpControl) {
    lerpControl = animEngine.addLerp({
      current: currentValue,
      target: 1.0,
      speed: 0.14,
      onUpdate: (val) => {
        currentValue = val
        drawShader(val)
      },
      onComplete: () => {
        lerpControl = null
      },
    })
  } else {
    lerpControl.setTarget(1.0)
  }
}
```
