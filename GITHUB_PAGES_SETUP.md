# Mortgage Camp Pro: GitHub Pages deployment

This repository uses Vite and React. In GitHub Settings > Pages choose **GitHub Actions** as Source. Upload all extracted files to the repository root, including the hidden `.github` folder. Commit to `main`. The workflow builds with `npm run build:pages` and publishes **dist/client** (the actual Vite output directory), not `dist`. The Vite base URL is `/mortgagecamp/`.

Check the Actions tab for a successful deploy. Visit https://ccamacho-crypto.github.io/mortgagecamp/ and force refresh. If still blank, inspect browser DevTools Console and Network for JavaScript errors.
