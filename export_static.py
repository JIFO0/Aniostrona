#!/usr/bin/env python3
"""
export_static.py
================
Converts the Lovable / TanStack Start project into a fully static HTML
website ready for deployment to any static host (GitHub Pages, Netlify,
Vercel, Apache, FTP, etc.).

Usage:
    py export_static.py                # build static site → dist-static/
    py export_static.py --preview      # build + serve locally on port 3000
    py export_static.py --preview-only # serve existing dist-static/ without rebuilding

Requirements:
    - Python 3.9+  (zero pip dependencies — standard library only)
    - npm / bun in PATH  (only for the Vite build step)

What this script does:
    1. Scans assets/gallery-me/ and assets/gallery-works/ for all images
       (upscaled versions preferred automatically).
    2. Writes src/gallery-manifest.json (consumed by React at Vite build time).
    3. Runs the Vite/npm build to produce a bundled SPA in dist-static/.
    4. Copies all upscaled hero images, gallery images and CV.pdf into dist-static/assets/.
    5. Rewrites Lovable /__l5e/ CDN URLs in the built HTML/JS/CSS to local /assets/ paths.
    6. Generates per-route HTML entry files so sub-routes work on any static host.
    7. Ensures all crawler / SEO files are present (robots.txt, sitemap.xml, llms.txt, favicon.ico).
    8. Generates SPA routing fallbacks (_redirects, 404.html, vercel.json, .htaccess).
"""

import argparse
import http.server
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.parse
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent
ASSETS_DIR = ROOT / "assets"
PUBLIC_DIR = ROOT / "public"
DIST_DIR = ROOT / "dist-static"
DIST_ASSETS = DIST_DIR / "assets"
MANIFEST_PATH = ROOT / "src" / "gallery-manifest.json"

GALLERY_ME_SRC = ASSETS_DIR / "gallery-me"
GALLERY_WORKS_SRC = ASSETS_DIR / "gallery-works"
PICTURES_SRC = ASSETS_DIR / "pictures"
PDF_SRC = ASSETS_DIR / "pdf"

def auto_fix_path():
    """Ensure Node.js / npm / bun bin directories are included in os.environ['PATH']."""
    candidates = [
        r"C:\Program Files\nodejs",
        r"C:\Program Files (x86)\nodejs",
        os.path.expanduser(r"~\AppData\Roaming\npm"),
        os.path.expanduser(r"~\.bun\bin"),
        os.path.expanduser(r"~\AppData\Local\Programs\bun"),
    ]
    appdata = os.path.expanduser(r"~\AppData\Local")
    if os.path.exists(appdata):
        for root, dirs, files in os.walk(appdata):
            if "npm.cmd" in files or "node.exe" in files:
                candidates.append(root)
            if root.count(os.sep) - appdata.count(os.sep) > 5:
                dirs.clear()

    existing = os.environ.get("PATH", "")
    new_dirs = [d for d in candidates if os.path.isdir(d) and d.lower() not in existing.lower()]
    if new_dirs:
        os.environ["PATH"] = os.pathsep.join(new_dirs) + os.pathsep + existing

auto_fix_path()

LOCAL_ASSET_BASE = "assets"

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"}

CRAWLER_FILES = ["robots.txt", "sitemap.xml", "llms.txt", "favicon.ico"]

ROUTES = [
    {
        "path": "cv",
        "title": "CV \u2014 Anna Weronika Tomaszewska",
        "noindex": True,
        "canonical": "https://annatomaszewska.pl/cv",
    },
    {
        "path": "poradnik-wizytowka",
        "title": "Filmik-wizyt\u00f3wka: jak nagra\u0107 zg\u0142oszenie na uczelni\u0119 i do agencji | Anna Tomaszewska",
        "noindex": False,
        "canonical": "https://annatomaszewska.pl/poradnik-wizytowka",
    },
]

# Force UTF-8 stdout/stderr encoding on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# ANSI colours (work fine in Windows Terminal / PowerShell 7)
CYAN   = "\x1b[36m"
GREEN  = "\x1b[32m"
YELLOW = "\x1b[33m"
RED    = "\x1b[31m"
BOLD   = "\x1b[1m"
RESET  = "\x1b[0m"

def log(msg: str):   print(f"{CYAN}[export]{RESET} {msg}")
def ok(msg: str):    print(f"{GREEN}[export]{RESET} [OK] {msg}")
def warn(msg: str):  print(f"{YELLOW}[export]{RESET} [WARN] {msg}")
def err(msg: str):   print(f"{RED}[export]{RESET} [ERR] {msg}", file=sys.stderr)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def is_upscaled(filename: str) -> bool:
    """Return True if the filename indicates an upscaled image."""
    lower = filename.lower()
    return "upscaled" in lower


def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)


def copy_dir(src: Path, dest: Path):
    """Copy every file directly inside src into dest (non-recursive)."""
    if not src.exists():
        warn(f"Source directory not found, skipping: {src}")
        return
    ensure_dir(dest)
    for f in src.iterdir():
        if f.is_file():
            shutil.copy2(f, dest / f.name)


def scan_gallery_dir(directory: Path) -> list[str]:
    """
    Scan directory for image files.
    Returns filenames, preferring upscaled versions over lower-res originals
    when both share the same base stem (ignoring the '-upscaled' / ' upscaled' suffix).
    """
    if not directory.exists():
        return []

    files = [f.name for f in directory.iterdir()
             if f.is_file() and f.suffix.lower() in IMAGE_EXTS]

    # Build map: normalised-stem -> best filename
    preferred: dict[str, str] = {}
    for f in files:
        stem = Path(f).stem
        norm = re.sub(r"[-_ ]*upscaled$", "", stem, flags=re.IGNORECASE).strip().lower()
        existing = preferred.get(norm)
        # Prefer web-optimized images for performance; use upscaled only if no web version exists
        if existing is None or (is_upscaled(existing) and not is_upscaled(f)):
            preferred[norm] = f

    return sorted(preferred.values())


def make_gallery_entry(filename: str, subdir: str) -> dict:
    """Build a gallery item dict for the manifest."""
    stem = Path(filename).stem
    alt = re.sub(r"[-_ ]*upscaled$", "", stem, flags=re.IGNORECASE).strip()
    alt = re.sub(r"[-_]", " ", alt).strip()
    encoded = urllib.parse.quote(filename)
    return {
        "src": f"{LOCAL_ASSET_BASE}/{subdir}/{encoded}",
        "alt": alt,
        "file": filename,
    }


# ---------------------------------------------------------------------------
# Step 1 — Build gallery manifest
# ---------------------------------------------------------------------------

def build_gallery_manifest() -> dict:
    log("Scanning gallery folders...")

    me_images    = scan_gallery_dir(GALLERY_ME_SRC)
    works_images = scan_gallery_dir(GALLERY_WORKS_SRC)

    manifest = {
        "generated": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        "galleryMe":    [make_gallery_entry(f, "gallery-me")    for f in me_images],
        "galleryWorks": [make_gallery_entry(f, "gallery-works") for f in works_images],
    }

    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

    ok(f"Gallery manifest written → {MANIFEST_PATH.relative_to(ROOT)}")
    ok(f"  gallery-me:    {len(me_images)} image(s): {', '.join(me_images)}")
    ok(f"  gallery-works: {len(works_images)} image(s): {', '.join(works_images)}")

    return manifest


# ---------------------------------------------------------------------------
# Step 2 — Run Vite build
# ---------------------------------------------------------------------------

def run_vite_build():
    log("Running Vite build (SPA mode)...")

    env = {
        **os.environ,
        "EXPORT_STATIC": "1",
        "VITE_BUILD_OUTDIR": str(DIST_DIR),
    }

    use_shell = sys.platform == "win32"

    # Try npm first, then bun as fallback
    for cmd in ["npm run build", "bun run build"]:
        try:
            cmd_arg = cmd if use_shell else cmd.split()
            subprocess.run(cmd_arg, cwd=ROOT, env=env, check=True, shell=use_shell)
            ok("Vite build complete.")
            return
        except FileNotFoundError:
            continue
        except subprocess.CalledProcessError as e:
            err(f"Build command failed with exit code {e.returncode}.")
            sys.exit(e.returncode)

    err("Neither 'npm' nor 'bun' was found in PATH. Please install Node.js.")
    sys.exit(1)



# ---------------------------------------------------------------------------
# Step 3 — Copy assets into dist-static/assets/
# ---------------------------------------------------------------------------

def copy_assets():
    log("Copying assets into dist-static/assets/...")

    # Copy output from Nitro build if present (.output/public -> dist-static)
    nitro_pub = ROOT / ".output" / "public"
    if nitro_pub.exists():
        for item in nitro_pub.glob("**/*"):
            if item.is_file():
                rel = item.relative_to(nitro_pub)
                dest = DIST_DIR / rel
                ensure_dir(dest.parent)
                shutil.copy2(item, dest)
        ok("Copied .output/public build output → dist-static/")

    # Gallery images — copy entire folder (all files, including non-upscaled)
    copy_dir(GALLERY_ME_SRC,    DIST_ASSETS / "gallery-me")
    ok("Copied gallery-me    → dist-static/assets/gallery-me/")

    copy_dir(GALLERY_WORKS_SRC, DIST_ASSETS / "gallery-works")
    ok("Copied gallery-works → dist-static/assets/gallery-works/")

    # Hero / section pictures — prefer upscaled
    if PICTURES_SRC.exists():
        dest_pics = DIST_ASSETS / "pictures"
        ensure_dir(dest_pics)

        # Build map: stem → best file
        best: dict[str, Path] = {}
        for f in PICTURES_SRC.iterdir():
            if not f.is_file() or f.suffix.lower() not in IMAGE_EXTS:
                continue
            norm = re.sub(r"[-_ ]*upscaled$", "", f.stem, flags=re.IGNORECASE).strip().lower()
            existing = best.get(norm)
            # Prefer web-optimized images for performance
            if existing is None or (is_upscaled(existing.name) and not is_upscaled(f.name)):
                best[norm] = f

        for src_file in best.values():
            shutil.copy2(src_file, dest_pics / src_file.name)

        # Nested folders (e.g. pictures/poradnik/) — copy as-is
        for sub in PICTURES_SRC.iterdir():
            if sub.is_dir():
                copy_dir(sub, dest_pics / sub.name)

        ok(f"Copied {len(best)} picture(s) → dist-static/assets/pictures/")
    else:
        warn("assets/pictures/ not found, skipping.")

    # CV PDF
    if PDF_SRC.exists():
        copy_dir(PDF_SRC, DIST_ASSETS / "pdf")
        ok("Copied CV PDF → dist-static/assets/pdf/")
    else:
        warn("assets/pdf/ not found, skipping.")



# ---------------------------------------------------------------------------
# Step 4 — Build Lovable URL → local path map
# ---------------------------------------------------------------------------

def build_asset_url_map() -> dict[str, str]:
    """
    Read all .asset.json files from src/assets/ and build a mapping of
    Lovable CDN URL → local /assets/... URL.
    """
    mapping: dict[str, str] = {}

    photos_dir = ROOT / "src" / "assets" / "photos"
    cv_asset   = ROOT / "src" / "assets" / "cv.pdf.asset.json"

    asset_json_files: list[Path] = []
    if photos_dir.exists():
        asset_json_files.extend(f for f in photos_dir.iterdir()
                                if f.suffix == ".json" and f.name.endswith(".asset.json"))
    if cv_asset.exists():
        asset_json_files.append(cv_asset)

    for json_file in asset_json_files:
        try:
            data = json.loads(json_file.read_text(encoding="utf-8"))
            lovable_url       = data.get("url", "")
            original_filename = data.get("original_filename", "")
            content_type      = data.get("content_type", "")

            if not lovable_url:
                continue

            if content_type == "application/pdf":
                # PDF — find any .pdf in assets/pdf/
                pdf_files = sorted(PDF_SRC.glob("*.pdf")) if PDF_SRC.exists() else []
                pdf_name  = pdf_files[0].name if pdf_files else original_filename
                mapping[lovable_url] = f"{LOCAL_ASSET_BASE}/pdf/{pdf_name}"
                continue

            # Image — find the best local upscaled match
            orig_stem = re.sub(
                r"[-_ ]*upscaled$", "",
                Path(original_filename).stem,
                flags=re.IGNORECASE
            ).strip().lower().replace("_", " ").replace("-", " ")

            found_subdir: str | None = None
            found_file:   str | None = None

            search_dirs = [
                ("gallery-me",    GALLERY_ME_SRC),
                ("gallery-works", GALLERY_WORKS_SRC),
                ("pictures",      PICTURES_SRC),
            ]

            for subdir, src_dir in search_dirs:
                if not src_dir.exists():
                    continue
                candidates = [f for f in src_dir.iterdir()
                              if f.is_file() and f.suffix.lower() in IMAGE_EXTS]

                # Prefer web-optimized match (not upscaled) for fast load times
                for f in candidates:
                    cand_stem = re.sub(
                        r"[-_ ]*upscaled$", "", f.stem, flags=re.IGNORECASE
                    ).strip().lower().replace("_", " ").replace("-", " ")
                    if (cand_stem == orig_stem or orig_stem in cand_stem or cand_stem in orig_stem) \
                            and not is_upscaled(f.name):
                        found_subdir, found_file = subdir, f.name
                        break

                if found_file:
                    break

                # Fall back to upscaled match if that is all we have
                for f in candidates:
                    cand_stem = re.sub(
                        r"[-_ ]*upscaled$", "", f.stem, flags=re.IGNORECASE
                    ).strip().lower().replace("_", " ").replace("-", " ")
                    if cand_stem == orig_stem or orig_stem in cand_stem or cand_stem in orig_stem:
                        found_subdir, found_file = subdir, f.name
                        break
                        # don't break — keep looking for upscaled in next dir

            if found_file and found_subdir:
                encoded = urllib.parse.quote(found_file)
                mapping[lovable_url] = f"{LOCAL_ASSET_BASE}/{found_subdir}/{encoded}"
            else:
                encoded = urllib.parse.quote(original_filename)
                mapping[lovable_url] = f"{LOCAL_ASSET_BASE}/pictures/{encoded}"
                warn(f"Could not find local file for: {lovable_url} ({original_filename})")

        except Exception as e:
            warn(f"Failed to parse asset JSON {json_file.name}: {e}")

    return mapping


# ---------------------------------------------------------------------------
# Step 5 — Rewrite Lovable CDN URLs in built output
# ---------------------------------------------------------------------------

def rewrite_asset_urls():
    log("Building Lovable → local asset URL map...")
    url_map = build_asset_url_map()

    log(f"Rewriting {len(url_map)} asset URL(s) in dist-static/...")

    rewritable_exts = {".html", ".js", ".css"}

    for filepath in DIST_DIR.rglob("*"):
        if not filepath.is_file() or filepath.suffix.lower() not in rewritable_exts:
            continue

        try:
            content = filepath.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue

        changed = False
        for lovable_url, local_url in url_map.items():
            if lovable_url in content:
                content = content.replace(lovable_url, local_url)
                changed = True

            # Also handle JS-escaped variants (e.g. \/__l5e\/)
            escaped_src  = lovable_url.replace("/", "\\/")
            escaped_dest = local_url.replace("/", "\\/")
            if escaped_src in content:
                content = content.replace(escaped_src, escaped_dest)
                changed = True

        if changed:
            filepath.write_text(content, encoding="utf-8")

def generate_route_html_files():
    log("Rendering static HTML pages from React / SSR bundle...")

    ssr_script = ROOT / ".render_routes_temp.mjs"
    routes_to_render = ["/"] + [f"/{r['path']}" for r in ROUTES]

    render_code = f"""
import fs from 'node:fs';
import path from 'node:path';
import {{ fileURLToPath }} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, 'dist-static');

try {{
  const ssrMod = await import('./.output/server/_ssr/ssr.mjs');
  const handler = ssrMod.default;
  const routes = {json.dumps(routes_to_render)};

  for (const route of routes) {{
    const url = `http://localhost${{route.startsWith('/') ? route : '/' + route}}`;
    const res = await handler.fetch(new Request(url));
    if (res.status >= 400) {{
      console.warn(`[render-warning] ${{route}} returned status ${{res.status}}`);
      continue;
    }}
    const html = await res.text();
    const cleanRoute = route.replace(/^\\/+/, '');
    const outPath = cleanRoute === ''
      ? path.join(distDir, 'index.html')
      : path.join(distDir, cleanRoute, 'index.html');

    fs.mkdirSync(path.dirname(outPath), {{ recursive: true }});
    fs.writeFileSync(outPath, html, 'utf-8');
    console.log(`[render-ok] ${{route}} -> ${{path.relative(__dirname, outPath)}} (${{html.length}} bytes)`);
  }}
}} catch (err) {{
  console.error('[render-error]', err);
  process.exit(1);
}}
"""
    try:
        ssr_script.write_text(render_code, encoding="utf-8")
        result = subprocess.run(["node", str(ssr_script)], cwd=ROOT, capture_output=True, text=True, check=True)
        for line in result.stdout.splitlines():
            if "[render-ok]" in line:
                ok(line.replace("[render-ok]", "").strip())
            elif "[render-warning]" in line:
                warn(line.replace("[render-warning]", "").strip())
    except Exception as e:
        err(f"Failed to render static routes via Node SSR: {e}")
        if 'result' in locals() and result.stderr:
            err(result.stderr)
        raise
    finally:
        if ssr_script.exists():
            try:
                ssr_script.unlink()
            except Exception:
                pass

    old_poradnik_dir = DIST_DIR / "poradnik-portfolio-aktorskie"
    ensure_dir(old_poradnik_dir)
    (old_poradnik_dir / "index.html").write_text(
        "<!DOCTYPE html><html lang=\"pl\"><head>"
        "<meta charset=\"utf-8\" />"
        "<meta http-equiv=\"refresh\" content=\"0; url=../poradnik-wizytowka/\" />"
        "<link rel=\"canonical\" href=\"https://annatomaszewska.pl/poradnik-wizytowka\" />"
        "<title>Przekierowanie…</title></head>"
        "<body><p><a href=\"../poradnik-wizytowka/\">Przejdź do poradnika</a></p></body></html>\n",
        encoding="utf-8",
    )
    ok("Generated redirect → dist-static/poradnik-portfolio-aktorskie/index.html")

    launcher_bat = DIST_DIR / "start_offline_site.bat"
    launcher_bat.write_text(
        "@echo off\n"
        "title Aniastrona - Local Offline Website\n"
        "echo ================================================\n"
        "echo   Aniastrona - Local Offline Website Launcher\n"
        "echo ================================================\n"
        "echo.\n"
        "echo Opening website in your default browser at http://localhost:3000 ...\n"
        "start http://localhost:3000\n"
        "echo Press Ctrl+C in this window to stop the server.\n"
        "echo.\n"
        'python -m http.server 3000 --directory "%~dp0" 2>nul || py -m http.server 3000 --directory "%~dp0"\n'
        "pause\n",
        encoding="utf-8",
    )
    ok("Generated double-clickable launcher → dist-static/start_offline_site.bat")


def copy_crawler_files():
    log("Verifying crawler / deployment files in dist-static/...")
    for filename in CRAWLER_FILES:
        dest = DIST_DIR / filename
        if not dest.exists():
            src = PUBLIC_DIR / filename
            if src.exists():
                shutil.copy2(src, dest)
                ok(f"Copied {filename} → dist-static/{filename}")
            else:
                warn(f"{filename} not found in public/ — add it before deploying!")
        else:
            ok(f"{filename} already present.")


# ---------------------------------------------------------------------------
# Step 8 — Generate SPA routing fallback files
# ---------------------------------------------------------------------------

def generate_spa_fallbacks():
    # Netlify _redirects
    redirects = DIST_DIR / "_redirects"
    if not redirects.exists():
        redirects.write_text("/*  /index.html  200\n", encoding="utf-8")
        ok("Generated _redirects (Netlify SPA fallback).")

    # GitHub Pages / Apache 404.html
    root_html = DIST_DIR / "index.html"
    not_found = DIST_DIR / "404.html"
    if root_html.exists() and not not_found.exists():
        shutil.copy2(root_html, not_found)
        ok("Generated 404.html (GitHub Pages SPA fallback).")

    # Vercel vercel.json
    vercel_json = DIST_DIR / "vercel.json"
    if not vercel_json.exists():
        vercel_json.write_text(
            json.dumps(
                {"rewrites": [{"source": "/(.*)", "destination": "/index.html"}], "trailingSlash": False},
                indent=2,
            ),
            encoding="utf-8",
        )
        ok("Generated vercel.json (Vercel SPA routing).")

    # Apache .htaccess
    htaccess = DIST_DIR / ".htaccess"
    if not htaccess.exists():
        htaccess.write_text(
            "Options -MultiViews\n"
            "RewriteEngine On\n"
            "RewriteCond %{REQUEST_FILENAME} !-f\n"
            "RewriteRule ^ /index.html [QSA,L]\n",
            encoding="utf-8",
        )
        ok("Generated .htaccess (Apache SPA routing).")


# ---------------------------------------------------------------------------
# Step 9 — Cleanup temporary manifest
# ---------------------------------------------------------------------------

def cleanup_manifest():
    default_manifest = {"generated": "never", "galleryMe": [], "galleryWorks": []}
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(default_manifest, indent=2), encoding="utf-8")



# ---------------------------------------------------------------------------
# Step 10 — Built-in preview server
# ---------------------------------------------------------------------------

def serve_preview(port: int = 3000):
    """Serve dist-static/ on localhost using the Python built-in HTTP server."""
    import threading

    os.chdir(DIST_DIR)

    class SilentHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, fmt, *args):
            pass  # suppress per-request noise

        def end_headers(self):
            # Basic headers for local preview
            self.send_header("Cache-Control", "no-cache")
            super().end_headers()

    server = http.server.HTTPServer(("", port), SilentHandler)
    url = f"http://localhost:{port}"
    print()
    print(f"{BOLD}{GREEN}  Preview server running at {url}{RESET}")
    print(f"  Opening browser automatically... Press Ctrl+C to stop.\n")

    import webbrowser
    threading.Timer(0.6, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print(f"\n{CYAN}[export]{RESET} Preview server stopped.")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Convert the Lovable project to a static HTML website.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--preview",
        action="store_true",
        help="Build then serve the result locally on port 3000.",
    )
    parser.add_argument(
        "--preview-only",
        action="store_true",
        help="Skip build; just serve the existing dist-static/ on port 3000.",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=3000,
        help="Port for the preview server (default: 3000).",
    )
    args = parser.parse_args()

    print()
    print(f"{BOLD}{CYAN}{'=' * 47}{RESET}")
    print(f"{BOLD}{CYAN}  Aniastrona  ->  Static HTML Export (Python){RESET}")
    print(f"{BOLD}{CYAN}{'=' * 47}{RESET}")
    print()

    if args.preview_only:
        if not DIST_DIR.exists():
            err("dist-static/ does not exist. Run without --preview-only first.")
            sys.exit(1)
        serve_preview(args.port)
        return

    try:
        build_gallery_manifest()
        run_vite_build()
        copy_assets()
        generate_route_html_files()
        rewrite_asset_urls()
        copy_crawler_files()
        generate_spa_fallbacks()

        print()
        print(f"{BOLD}{GREEN}{'=' * 47}{RESET}")
        print(f"{BOLD}{GREEN}  [OK] Export complete!  ->  dist-static/{RESET}")
        print(f"{BOLD}{GREEN}{'=' * 47}{RESET}")
        print()
        print("  Preview:   py export_static.py --preview")
        print("             or: py -m http.server 3000 --directory dist-static")
        print("  Deploy:    upload dist-static/ to any static host")
        print()


    except Exception as e:
        err(f"Fatal error: {e}")
        raise
    finally:
        cleanup_manifest()

    if args.preview:
        serve_preview(args.port)


if __name__ == "__main__":
    main()
