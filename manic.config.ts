import { defineConfig } from "manicjs/config";

export default defineConfig({
  app: {
    name: "portfolio",
  },

  server: {
    port: 6070,
  },

  router: {
    viewTransitions: true,
  },

  swagger: false,
});
