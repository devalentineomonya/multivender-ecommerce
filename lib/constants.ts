export const EXCLUDED_PATHS = ['/auth', '/user', '/vendor', '/admin'] as const;

export const PROTECTED_ROUTES = [
  ...EXCLUDED_PATHS.filter((path) => path !== '/auth'),
  '/cart/checkout',
] as const;

export const ADMIN_ROUTES = ['/admin'] as const;
