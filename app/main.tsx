import { createRoot } from "react-dom/client";
import { ThemeProvider } from "manicjs/theme";
import { routes } from "./~routes.generated";
import App from "./App";
import "./global.css";

window.__MANIC_ROUTES__ = routes;

const root = createRoot(document.getElementById("root")!);
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
