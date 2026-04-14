export const checkYOverlap = (y: number, elements: NodeListOf<Element> | null): boolean => {
  if (!elements) return false;
  let found = false;
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (y >= rect.top && y <= rect.bottom) found = true;
  });
  return found;
};

export const getScrollProgress = (): number => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  return docHeight > 0 ? scrollTop / docHeight : 0;
};
