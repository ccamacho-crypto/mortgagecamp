# Mortgage Camp Pro — Website Clone

This package contains the supplied React/TypeScript website source, preserving its existing pages and styling.

## Run locally
1. Install Node.js 20 or later.
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.

## Production build
Run `npm run build`. The client-side assets are generated in `dist/` (the build also generates a server bundle).

## Deploy
For Vercel or Netlify, import this folder as a Vite project and configure a build command compatible with the hosting environment. If deploying as a client-side SPA, configure a fallback rewrite to `/index.html` for routes such as `/rates` and `/loans`. GitHub Pages subpath deployment may require setting Vite's `base` and adjusting router behavior.

## Included pages
Home, Rates, Loans, Why, Calculators, Process, and Reviews.

## Notes
The supplied archive includes source code but not installed node_modules. External images, forms, analytics, or integrations may depend on third-party services and should be tested after deployment. This package has not been run through a full production deployment test.
