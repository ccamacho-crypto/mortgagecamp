# Standalone homebuyer calculator publication

Requested URL: https://mortgagecamp.pro/homebuyer-calculator/

## Scope
Added isolated static calculator files under `public/homebuyer-calculator/`, calculation regression script `scripts/test-homebuyer.mjs`, and its CI step. No edits to React homepage, header, footer, router, SEO/sitemap or existing calculators. Original local calculator remains untouched.

The standalone document uses Mortgage Camp black/gold styling and existing `/assets/mortgagecamp-logo.png`. `noindex, nofollow` requests no search indexing. This is an unlisted public URL, not authentication or a private workspace.

## Runtime
- All financial arithmetic runs in-browser: no financial POSTs or query values, browser storage, analytics or third-party widgets.
- ZIP only is sent to Zippopotam.us and CensusReporter. Browser connection metadata is disclosed. Fixed HTTPS hosts and CSP, text-only rendering, and abort/version checks are retained.
- Tax: live retrieval of historical ACS medians with a 1.25 heuristic buffer, or explicitly labeled fallback.
- Insurance: Treasury FIO 2022 ZIP history with explicit heuristic buffer/price scaling; missing observations use max($3,000/year, 0.75% price). Not a quote or guaranteed sufficient cost. Treasury disclaimer bundled.
- Rate: 7.24%, Freddie Mac PMMS observation 2026-10-29, source verified 2026-11-05. `snapshot` label; refresh reloads the saved file, not live mortgage rates. Editable rate always available. https://www.freddiemac.com/pmms
- Default example: $525,000 price, 3.5% down, 7.24%, 30 years, $4,800 tax, $3,000 hazard, 0.50% annual base-loan MI, $1,100 monthly liabilities => $4,313.73 housing/month and $115,033 required gross annual income (rounded up).

## Prepublication verification (2026-11-05)
- `npm run type-check`: pass.
- `npm test`: 155 pass, 16 files.
- `npm run build:pages`: pass (existing chunk-size warning).
- `PARITY_FIXTURES=... node scripts/test-homebuyer.mjs`: pass; 207 deterministic Python/JavaScript parity scenarios, 20 invalid inputs, four DTI boundary scenarios, cash/zero-rate/near-zero/MI/upfront/co-borrower cases.
- Playwright `homebuyer-calculator/check_publication.py`: 12 check groups pass, including real Miami and Boston lookup, explicit failure/fallback behavior, borrower removal/cap, no financial network payloads or storage, print, hard reload, and 375/768/1440px layouts.
- Local browser log: Miami tax live retrieval / historical ACS 2024 5-year; Miami hazard explicit fallback (no ZIP observation).

Live deployment verification is recorded in the lead's final publication report after deployment; the above does not claim that the public page was verified before publication.
