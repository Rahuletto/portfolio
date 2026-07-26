export type Point = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}

export type HeroLayout = {
  helloSize: number
  helloPosition: Point & { z: number }
  cursorSize: number
  cursorPosition: Point & { z: number }
}

export function normalizePointer(
  clientX: number,
  clientY: number,
  width: number,
  height: number,
): Point {
  return {
    x: Math.min(1, Math.max(0, clientX / Math.max(width, 1))),
    y: Math.min(1, Math.max(0, 1 - clientY / Math.max(height, 1))),
  }
}

export function clampPointerDelta(
  current: Point,
  previous: Point,
  maxMagnitude: number,
): Point {
  const dx = current.x - previous.x
  const dy = current.y - previous.y
  const magnitude = Math.hypot(dx, dy)
  const scale = magnitude > maxMagnitude ? maxMagnitude / magnitude : 1

  return {
    x: dx * scale,
    y: dy * scale,
  }
}

export function getSimulationSize(width: number, height: number, longAxis: number): Size {
  const scale = longAxis / Math.max(width, height, 1)

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

export function shouldInjectPointer(input: {
  reducedMotion: boolean
  coarsePointer: boolean
  visible: boolean
}): boolean {
  return !input.reducedMotion && !input.coarsePointer && input.visible
}

export function getHeroLayout(aspect: number): HeroLayout {
  if (aspect < 0.8) {
    return {
      helloSize: 2.08,
      helloPosition: { x: 0, y: 0.28, z: 0 },
      cursorSize: 0.38,
      cursorPosition: { x: 0.78, y: -1.22, z: 0.45 },
    }
  }

  if (aspect < 1.5) {
    return {
      helloSize: 4.1,
      helloPosition: { x: 0.08, y: 0.22, z: 0 },
      cursorSize: 0.52,
      cursorPosition: { x: 2.05, y: -1.1, z: 0.45 },
    }
  }

  return {
    helloSize: 4.6,
    helloPosition: { x: 0.2, y: 0.24, z: 0 },
    cursorSize: 0.58,
    cursorPosition: { x: 2.45, y: -1.15, z: 0.45 },
  }
}
