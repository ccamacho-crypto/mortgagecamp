import type { ComponentProps, ReactElement } from 'react';
import { RouterProvider } from 'react-router/dom';

// Both browser and hash routers are valid standalone data routers.
type AiroRouterProviderProps = ComponentProps<typeof RouterProvider>;

/** Standalone provider without AAB preview instrumentation. */
export function AiroRouterProvider({
  router,
  ...providerProps
}: AiroRouterProviderProps): ReactElement {
  return <RouterProvider router={router} {...providerProps} />;
}
