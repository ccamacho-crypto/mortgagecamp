import { RouteObject } from 'react-router';

import HomePage from './pages/index';
import RatesPage from './pages/rates';
import LoansPage from './pages/loans';
import WhyPage from './pages/why';
import CalculatorsPage from './pages/calculators';
import ProcessPage from './pages/process';
import ReviewsPage from './pages/reviews';
// Eager import so renderToString doesn't hit a Suspense boundary on 404 routes
// and abort to client rendering. The prod 404 page is tiny; the dev-tools
// variant stays lazy because it pulls in dev-only code we don't want in
// production bundles.
import ProdNotFoundPage from './pages/_404';

const NotFoundPage = ProdNotFoundPage;

export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/rates', element: <RatesPage /> },
  { path: '/loans', element: <LoansPage /> },
  { path: '/why', element: <WhyPage /> },
  { path: '/calculators', element: <CalculatorsPage /> },
  { path: '/process', element: <ProcessPage /> },
  { path: '/reviews', element: <ReviewsPage /> },
  {
    id: 'airo-not-found',
    path: '*',
    element: <NotFoundPage />,
  },
];

// Types for type-safe navigation
export type Path = '/' | '/rates' | '/loans' | '/why' | '/calculators' | '/process' | '/reviews';

export type Params = Record<string, string | undefined>;
