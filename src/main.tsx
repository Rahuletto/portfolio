import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactLenis } from "@studio-freight/react-lenis";
import "./index.css";
import App from "./App.tsx";
import ScrollLine from "./components/ScrollLine.tsx";
import CustomCursor from "./components/Cursor.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScrollLine />
    <CustomCursor />
    <ReactLenis
      root
      className="overflow-x-hidden w-screen"
      options={{
        syncTouch: true,
        smoothWheel: true,
        touchMultiplier: 0.5,
        easing: (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      }}
    >
      <App />
    </ReactLenis>
  </StrictMode>,
);
