# Mortgage Camp clone setup

The full supplied website source is now included: `src/`, `public/`, and `export-plugins/`.

Use Node 22.22+, then run `npm ci` and `npm run dev`.

- `npm run type-check` checks TypeScript.
- `npm test` runs the standalone site suite.
- `npm run build` builds root-domain client and SSR outputs.
- `npm run build:pages` builds the GitHub Pages site under `/mortgagecamp/` with hash routing.

See `README.md`, `GITHUB_PAGES_SETUP.md`, and `IMPLEMENTATION.md`. The form offers email handoff, not backend delivery; licensing and legal links remain source placeholders requiring confirmation.
