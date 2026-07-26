export function getElementScrollProgress(
  rectTop: number,
  rectHeight: number,
  viewportHeight: number,
): number {
  const travel = Math.max(1, viewportHeight + rectHeight)
  return Math.min(1, Math.max(0, (viewportHeight - rectTop) / travel))
}
