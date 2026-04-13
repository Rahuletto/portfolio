declare global {
  interface Window {
    __MANIC_ROUTES__?: Record<string, { default: React.ComponentType }>;
  }
}

export {};
