export const routes = {
  "/": () => import("./routes/index.tsx"),
  "/404": () => import("./routes/404.tsx"),
};
