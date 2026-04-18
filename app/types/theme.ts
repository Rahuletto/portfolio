import { type PALETTES } from '@/config/themes';

export type ThemeColor = keyof typeof PALETTES;

export type Palette = [string, string, string, string];

export interface ThemeState {
  currentColors: Palette;
  seed: number;
}

export type ThemeAction =
  | { type: 'SET_THEME'; color: ThemeColor }
  | { type: 'INITIALIZE'; color: ThemeColor };

export interface MeshThemeContextType extends ThemeState {
  setTheme: (color: ThemeColor) => void;
  isPending: boolean;
}
