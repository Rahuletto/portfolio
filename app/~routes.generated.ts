export const routes = {
  '/': () => import('./routes/index.tsx'),
};

export const notFoundPage = import('./routes/~404.tsx');
export const errorPage = undefined;
