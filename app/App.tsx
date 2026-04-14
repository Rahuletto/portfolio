import { Router } from "manicjs";
import { ReactLenis } from "lenis/react";

export default function App() {
  return (
    <ReactLenis root>
      <Router />
    </ReactLenis>
  );
}
