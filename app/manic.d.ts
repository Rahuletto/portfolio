declare global {
  interface Window {
    __MANIC_ROUTES__?: Record<
      string,
      () => Promise<{ default: React.ComponentType }>
    >;
    __MANIC_ERROR_PAGES__?: {
      notFound?: () => Promise<{ default: React.ComponentType }>;
      error?: () => Promise<{ default: React.ComponentType }>;
    };
  }
}

export {};
