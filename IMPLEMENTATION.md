# Mortgage Camp — source restoration and verified clone

## What was delivered
Restored the Commander's attached 154-file website export into `ccamacho-crypto/mortgagecamp`. The prior repository had configuration but no `src/`, `public/`, or export plugins. The supplied export is the authoritative implementation; its black-and-gold design, content, seven pages, and calculators were preserved rather than redesigned.

Reference: https://airo.ai/share/cXVobzlpaGEzOTpjMzk6enZSLTRBZFpqNmQy

## Repairs
- Included actual local hero photograph and Mortgage Camp logo from the reference in `public/assets/`; production no longer depends on Airo image middleware.
- GitHub Pages build selects `/mortgagecamp/` base and hash routing together through `npm run build:pages`.
- Repaired router provider typing, footer resource navigation, cross-page consultation CTAs, section-anchor navigation, and Rate Factors target.
- Replaced the no-op consultation form with required fields and an explicit email-draft handoff. It never claims to have sent a request; no CRM/backend or booking service was invented.
- Disabled builder-account analytics unless explicitly configured; removed unused builder scripts from the HTML entry.
- Repaired the lockfile for reproducible `npm ci`; updated Zod and fast-uri to address reported vulnerabilities.
- Replaced raw-source Pages publication with one build/test/deploy workflow. Pull requests run build verification; only main deploys.
- Added accessible calculator field labels and mobile input sizing.

## Verification
- `npm ci --ignore-scripts`: passed on the local Node 22.23.2 runtime.
- `npm run type-check`: passed.
- `npm test`: **139 tests passed in 15 suites**.
- `npm run build`: passed, producing client and SSR bundles.
- `npm run build:pages`: passed, producing `dist/client`.
- `scripts/browser-check.mjs`: passed in headless Chrome against the production Pages bundle: all seven pages, local assets, calculator update, form email handoff, cross-page CTA, mobile menu, and no horizontal overflow at 390/768/1024/1440px. No uncaught JS errors or failed local asset requests.
- Screenshots and machine-readable results: `verification/desktop.png`, `verification/mobile.png`, `verification/browser-results.json`.

The archive contains three Airo-editor-only test suites referencing implementations not shipped in the ZIP. Those files are preserved but explicitly excluded in Vitest and TypeScript, not silently counted as passing. A stale metadata test was updated to the exported Mortgage Camp metadata.

## Launch limitations — do not mistake these for verified services
- The footer still has `[Your NMLS ID]`, and Privacy Policy / Terms / Licensing links are placeholders from the source. Confirm legal disclosures and provide actual policy documents before marketing the site.
- The home page retains the reference's **June 2026 sample rates**, HELOC claims, review copy/counts, and experience claims. These were cloned, not independently validated. They are not current quotes or verified compliance statements.
- Third-party Optimal Blue market data is not guaranteed; a contact fallback is shown. External calculators, fonts, and widgets retain their source integrations and may require internet access/provider setup.
- The consultation form prepares an email to `info@mortgagecamp.pro`. The visitor must open their email client and send it. Mailbox delivery and appointments are not verified.
- No public deployment or custom-domain changes are implied by a review-branch commit. The workflow publishes only after merge to main and requires GitHub Pages configured for GitHub Actions.

## Main changed areas
`src/` (restored application and tests), `export-plugins/` (restored export support), `public/` (restored static files and local brand media), `scripts/browser-check.mjs`, `.github/workflows/static.yml`, `package.json`, `package-lock.json`, `index.html`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`.

## Run and build
Use Node 22.22+:
```
npm ci
npm run dev
npm run type-check
npm test
npm run build:pages
npm run preview -- --mode pages
```
The Pages preview is served under `/mortgagecamp/`. Root-domain client/SSR builds use `npm run build` instead. Use exactly one Pages workflow, the included `static.yml`.
