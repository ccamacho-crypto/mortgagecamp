# Mortgage Camp Pro: GitHub Pages deployment

This repository uses Vite and React. In GitHub Settings > Pages choose **GitHub Actions** as Source and keep the custom domain **mortgagecamp.pro**. The workflow builds with `npm run build:pages` and publishes **dist/client** (the actual Vite output directory), not `dist`. The Vite base URL is `/` because the custom domain serves the site at its root. Hash routing remains enabled for static-host deep links.

Check the Actions tab for a successful deploy. Visit https://mortgagecamp.pro/ and force refresh. The original https://ccamacho-crypto.github.io/mortgagecamp/ address redirects to the custom domain. Do not use `/mortgagecamp/assets/` paths on the custom domain: scripts, images and styles live under `/assets/`.

If intentionally removing the custom domain and reverting to a repository-subpath site, set `VITE_BASE_PATH=/mortgagecamp/` for the Pages build. Do not switch to the SSR build for GitHub Pages.
