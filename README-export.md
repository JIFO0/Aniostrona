# Static HTML Export — Workflow Guide

Converts the Lovable project into a fully static HTML website deployable
to any static host (GitHub Pages, Netlify, Vercel, Apache, FTP, etc.).

**Requirements**: Python 3.9+ (zero `pip` dependencies — standard library only).

---

## Quick Start

```powershell
# From the project root:
py export_static.py
```

The output appears in **`dist-static/`**, ready to deploy.

---

## All Commands

| Command | Description |
|---------|-------------|
| `py export_static.py` | Build static site → `dist-static/` |
| `py export_static.py --preview` | Build + serve locally on port 3000 |
| `py export_static.py --preview-only` | Serve existing `dist-static/` without rebuilding |
| `py export_static.py --port 8080` | Use a custom port |
| `npm run export` | Same as `py export_static.py` |
| `npm run export:preview` | Same as `py export_static.py --preview` |

---

## What the Script Does

| Step | Action |
|------|--------|
| 1 | Scans `assets/gallery-me/` and `assets/gallery-works/` for all images (auto-prefers upscaled versions) |
| 2 | Writes `src/gallery-manifest.json` (temporary, auto-deleted after build) |
| 3 | Runs `npm run build` / `bun run build` to produce a bundled SPA |
| 4 | Copies upscaled hero images, gallery images, and `assets/pdf/CV.pdf` into `dist-static/assets/` |
| 5 | Rewrites all Lovable `/__l5e/` CDN URLs in HTML/JS/CSS to local `/assets/` paths |
| 6 | Creates per-route HTML entry files (`cv/index.html`, `poradnik-wizytowka/index.html`) |
| 7 | Verifies crawler files: `robots.txt`, `sitemap.xml`, `llms.txt`, `favicon.ico` |
| 8 | Generates SPA routing fallbacks: `_redirects` (Netlify), `404.html` (GitHub Pages), `vercel.json`, `.htaccess` (Apache) |

---

## Gallery — Adding New Images

1. Add image to:
   - `assets/gallery-me/` → appears in the **"Ja"** gallery tab
   - `assets/gallery-works/` → appears in the **"Prace"** gallery tab

2. Re-run `py export_static.py`.

**No code changes needed.** The script auto-detects all files in those folders.

> **Upscale preference**: If both a regular and an upscaled version exist
> (`filename-upscaled.png`), the script automatically picks the upscaled one.

---

## Asset Folders Reference

| Folder | Purpose |
|--------|---------|
| `assets/gallery-me/` | Gallery "Ja" — portrait photos |
| `assets/gallery-works/` | Gallery "Prace" — work/art photos |
| `assets/pictures/` | Hero section & other in-page images |
| `assets/pdf/` | Downloadable CV (`CV.pdf`) |
| `public/` | Crawler files: `robots.txt`, `sitemap.xml`, `llms.txt`, `favicon.ico` |

---

## Deploying

Upload the contents of `dist-static/` to any static host:

- **GitHub Pages**: push `dist-static/` contents to the `gh-pages` branch
- **Netlify**: set publish directory to `dist-static/`
- **Vercel**: set output directory to `dist-static/`
- **Apache**: copy files to `public_html/` or `www/`
- **FTP**: upload all files from `dist-static/`

---

## Lovable Dev Workflow

During normal Lovable editing, the export script is never needed:
- The app uses Lovable CDN URLs from `.asset.json` files.
- The gallery shows the hardcoded fallback images from `index.tsx`.

Only run `py export_static.py` when you want to publish the current
state as a static website.
