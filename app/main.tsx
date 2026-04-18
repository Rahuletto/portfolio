import { createRoot } from "react-dom/client";
import { ThemeProvider } from "manicjs/theme";
import { routes, notFoundPage, errorPage } from "./~routes.generated";
import App from "./App";
import "./global.css";

window.__MANIC_ROUTES__ = routes;
window.__MANIC_ERROR_PAGES__ = {};
if (notFoundPage) window.__MANIC_ERROR_PAGES__.notFound = () => notFoundPage;
if (errorPage) window.__MANIC_ERROR_PAGES__.error = errorPage;

window.__MANIC_ROUTES__ = routes;

const root = createRoot(document.getElementById("root")!);
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
