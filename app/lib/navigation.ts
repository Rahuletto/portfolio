export const scrollToId = (
  id: string,
  options: ScrollIntoViewOptions = { behavior: 'smooth' }
) => {
  const el = document.getElementById(id);
  el?.scrollIntoView(options);
};

export const openLink = (url: string) => {
  window.open(url, '_blank');
};
