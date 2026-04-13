import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PALETTES, type ThemeColor } from "@/config/themes";

type Palette = [string, string, string, string];

interface MeshThemeContextType {
  currentColors: Palette;
  seed: number;
  setTheme: (color: ThemeColor) => void;
}

const MeshThemeContext = createContext<MeshThemeContextType | undefined>(undefined);

export function MeshThemeProvider({ children }: { children: ReactNode }) {
  const [currentColors, setCurrentColors] = useState<Palette>(
    PALETTES.purple as unknown as Palette
  );
  const [seed, setSeed] = useState(5);

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme") as ThemeColor;
    if (savedTheme && PALETTES[savedTheme]) {
      setCurrentColors(PALETTES[savedTheme] as unknown as Palette);
    }
  }, []);

  const setTheme = (color: ThemeColor) => {
    setCurrentColors(PALETTES[color] as unknown as Palette);
    setSeed((s) => s + 1);
    localStorage.setItem("portfolio-theme", color);
  };

  return (
    <MeshThemeContext.Provider value={{ currentColors, seed, setTheme }}>
      {children}
    </MeshThemeContext.Provider>
  );
}

export function useMeshTheme() {
  const context = useContext(MeshThemeContext);
  if (context === undefined) {
    throw new Error("useMeshTheme must be used within a MeshThemeProvider");
  }
  return context;
}
