# Mamakaram Saree House — Static Site

This repository contains a simple static website (HTML/CSS/JS) for a sample saree store. It's framework-free and ready for local preview or GitHub Pages deployment.

[![Pages Status](https://img.shields.io/badge/Pages-live-brightgreen)](https://chinnihari1997.github.io/mamakaramsareehouse/)

Quick local preview
- Change to the project folder:
```
cd "d:\\mamakaram-saree-house\\mamakaram new project sample"
```
- Start a local static server (Python 3):
```
python -m http.server 8000
```
- Open in your browser:
```
http://localhost:8000/sarees.html
```

WhatsApp Order links
- Each saree card and its modal include an `Order` button that opens WhatsApp with a prefilled message (number used: `+91 6281720436`). Links look like:
```
https://wa.me/6281720436?text=<URL-encoded message>
```

GitHub Pages (two options)
- Option A — Use the repository `main` branch (simple):
  1. Go to the repository **Settings → Pages**.
  2. Under **Source**, select **Branch: main** and **Folder: / (root)** and Save.
  3. Wait a minute; the site will be available at `https://<your-username>.github.io/<repo>`.

- Option B — Use GitHub Actions (automated):
  - This repo already includes a GitHub Actions workflow (check `.github/workflows`) that can deploy to GitHub Pages. If you prefer automated deploys on push, enable Actions and check the workflow file.

If you want, I can add a dedicated `gh-pages` deploy workflow or set up a workflow that builds and deploys automatically — tell me which you prefer and I'll add it.

Notes
- The data file is `sarees.json` at the repo root and the site loads it client-side.
- Images are currently referenced via the `image` field in `sarees.json`. To use local images, add them to `assets/images/` and update `sarees.json` paths.

Enjoy — tell me if you want me to (a) add an automated Pages workflow, (b) push a `gh-pages` branch, or (c) change image paths to local files.
# mamakaramsareehouse