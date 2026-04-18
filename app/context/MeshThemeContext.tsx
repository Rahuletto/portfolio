import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useTransition,
} from 'react';
import { PALETTES } from '@/config/themes';
import {
  type Palette,
  type ThemeState,
  type ThemeAction,
  type MeshThemeContextType,
  type ThemeColor,
} from '@/types/theme';

const MeshThemeContext = createContext<MeshThemeContextType | undefined>(
  undefined
);

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_THEME':
      return {
        currentColors: PALETTES[action.color] as unknown as Palette,
        seed: state.seed + 1,
      };
    case 'INITIALIZE':
      return {
        currentColors: PALETTES[action.color] as unknown as Palette,
        seed: state.seed,
      };
    default:
      return state;
  }
}

const initialState: ThemeState = {
  currentColors: PALETTES.purple as unknown as Palette,
  seed: 5,
};

export function MeshThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') as ThemeColor;
    if (savedTheme && PALETTES[savedTheme]) {
      dispatch({ type: 'INITIALIZE', color: savedTheme });
    }
  }, []);

  const setTheme = (color: ThemeColor) => {
    startTransition(() => {
      dispatch({ type: 'SET_THEME', color });
    });
    localStorage.setItem('portfolio-theme', color);
  };

  return (
    <MeshThemeContext.Provider value={{ ...state, setTheme, isPending }}>
      {children}
    </MeshThemeContext.Provider>
  );
}

export function useMeshTheme() {
  const context = useContext(MeshThemeContext);
  if (context === undefined) {
    throw new Error('useMeshTheme must be used within a MeshThemeProvider');
  }
  return context;
}
