import { Router } from "manicjs";
import { ReactLenis } from "lenis/react";

export default function App() {
  return (
    <ReactLenis root options={{
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    }}>
      <Router />
    </ReactLenis>
  );
}
