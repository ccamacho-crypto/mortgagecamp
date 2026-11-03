# Mortgage Camp

React 19 / TypeScript website restored from the Commander's complete Airo export, retaining the original black-and-gold design, seven pages, and mortgage calculators.

## Development
Requires Node.js 22.22 or later.

```sh
npm ci
npm run dev
```

## Verify
```sh
npm run type-check
npm test
npm run build
npm run build:pages
```

The verified test suite has 139 tests. Three preserved editor-only suites cannot run because the source export omits their Airo-editor implementations; see the explicit exclusions in `vitest.config.ts` and `tsconfig.json`.

## GitHub Pages
`npm run build:pages` generates `dist/client` with `/mortgagecamp/` paths and hash routing. `.github/workflows/static.yml` verifies pull requests and builds/deploys pushes to `main`. Configure GitHub Pages to use GitHub Actions.

```sh
npm run build:pages
npm run preview -- --mode pages
```
Open the printed URL under `/mortgagecamp/`. Navigation paths look like `/mortgagecamp/#/calculators`, which support refreshes without rewrite rules.

For a custom-domain/server deployment, use `npm run build` instead; the root-path and SSR configurations are retained.

## Important before launch
The consultation form **does not send leads to a backend**. It validates the fields and prepares an explicit email draft to the contact address supplied in the source. The visitor must send it from their email client.

Licensing ID, legal-policy links, sample rates, review claims, and third-party rate widgets need business/compliance confirmation before public marketing. Builder analytics are disabled by default. No live deployment is implied by a review-branch commit.

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for changes, evidence, and limitations. Screenshots and browser-check results are in `verification/`.
