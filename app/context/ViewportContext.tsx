import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";

const MOBILE_QUERY = window.matchMedia("(max-width: 1023px)");

interface ViewportContextType {
  isMobile: () => boolean;
}

const ViewportContext = createContext<ViewportContextType | undefined>(undefined);

export function ViewportProvider({ children }: { children: ReactNode }) {
  const isMobileRef = useRef(MOBILE_QUERY.matches);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      isMobileRef.current = e.matches;
    };
    MOBILE_QUERY.addEventListener("change", handler);
    return () => MOBILE_QUERY.removeEventListener("change", handler);
  }, []);

  const value: ViewportContextType = {
    isMobile: () => isMobileRef.current,
  };

  return (
    <ViewportContext.Provider value={value}>
      {children}
    </ViewportContext.Provider>
  );
}

export function useViewport() {
  const ctx = useContext(ViewportContext);
  if (!ctx) throw new Error("useViewport must be used within a ViewportProvider");
  return ctx;
}
