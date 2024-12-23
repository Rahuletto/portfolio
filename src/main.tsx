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
      touchMultiplier: 2,
      touchInertiaMultiplier: 2,
      wheelMultiplier: 1,
      gestureOrientation: "vertical",
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      }}
    >
      <App />
    </ReactLenis>
  </StrictMode>,
);
