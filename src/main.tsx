import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactLenis } from "@studio-freight/react-lenis";
import "./index.css";
import App from "./App.tsx";
import CustomCursor from "./components/Cursor.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactLenis
      root
      className="overflow-x-hidden w-screen"
      options={{
      syncTouch: false,
      smoothWheel: true,
      wheelMultiplier: 1,
      gestureOrientation: "vertical",
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      }}
    >
      <App />
      <CustomCursor />
    </ReactLenis>
  </StrictMode>,
);
