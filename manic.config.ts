import { defineConfig } from "manicjs/config";
// import { cloudflare, vercel } from "@manicjs/providers";
import { apiDocs } from "@manicjs/api-docs";

export default defineConfig({
  app: {
    name: "Portfolio",
  },
  mode: "frontend",

  server: {
    port: 6070,
  },

  plugins: [apiDocs()],

  // providers: [vercel(), cloudflare()],
});
