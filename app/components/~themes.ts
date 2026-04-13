export const PALETTES = {
  purple: ["#5D3FD3", "#A389D4", "#C5B0E3", "#D9B3FF"],
  blurple: ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"],
  blue: ["#1D4ED8", "#3B82F6", "#60A5FA", "#93C5FD"],
  green: ["#16A34A", "#22C55E", "#4ADE80", "#86EFAC"],
  yellow: ["#CA8A04", "#EAB308", "#FACC15", "#FDE047"],
  orange: ["#EA580C", "#FB923C", "#FDBA74", "#FFEDD5"],
  red: ["#B91C1C", "#EF4444", "#F87171", "#FCA5A5"],
} as const;

export type ThemeColor = keyof typeof PALETTES;
