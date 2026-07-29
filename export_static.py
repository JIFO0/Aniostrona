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
        if existing is None or is_upscaled(f):
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
            if existing is None or is_upscaled(f.name):
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

                # Prefer upscaled match
                for f in candidates:
                    cand_stem = re.sub(
                        r"[-_ ]*upscaled$", "", f.stem, flags=re.IGNORECASE
                    ).strip().lower().replace("_", " ").replace("-", " ")
                    if (cand_stem == orig_stem or orig_stem in cand_stem or cand_stem in orig_stem) \
                            and is_upscaled(f.name):
                        found_subdir, found_file = subdir, f.name
                        break

                if found_file:
                    break

                # Fall back to any match
                for f in candidates:
                    cand_stem = re.sub(
                        r"[-_ ]*upscaled$", "", f.stem, flags=re.IGNORECASE
                    ).strip().lower().replace("_", " ").replace("-", " ")
                    if cand_stem == orig_stem or orig_stem in cand_stem or cand_stem in orig_stem:
                        found_subdir, found_file = subdir, f.name
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
    log("Generating pre-rendered static HTML files...")

    css_files = [f.name for f in DIST_ASSETS.glob("styles-*.css")] if DIST_ASSETS.exists() else []
    js_files  = [f.name for f in DIST_ASSETS.glob("index-*.js")] if DIST_ASSETS.exists() else []

    css_name = css_files[0] if css_files else ""
    js_name  = js_files[0]  if js_files  else ""

    me_images    = scan_gallery_dir(GALLERY_ME_SRC)
    works_images = scan_gallery_dir(GALLERY_WORKS_SRC)

    me_cards = []
    for i, f in enumerate(me_images):
        stem = Path(f).stem
        alt = re.sub(r"[-_ ]*upscaled$", "", stem, flags=re.IGNORECASE).strip()
        alt = re.sub(r"[-_]", " ", alt).strip()
        encoded = urllib.parse.quote(f)
        me_cards.append(f"""
              <div class="reveal" data-delay="{i * 60}">
                <button onclick="openLightbox('assets/gallery-me/{encoded}')" class="block w-full break-inside-avoid overflow-hidden rounded-xl group text-left cursor-pointer">
                  <img src="assets/gallery-me/{encoded}" alt="{alt}" loading="lazy" class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </button>
              </div>""")

    works_cards = []
    for i, f in enumerate(works_images):
        stem = Path(f).stem
        alt = re.sub(r"[-_ ]*upscaled$", "", stem, flags=re.IGNORECASE).strip()
        alt = re.sub(r"[-_]", " ", alt).strip()
        encoded = urllib.parse.quote(f)
        works_cards.append(f"""
              <div class="reveal" data-delay="{i * 60}">
                <button onclick="openLightbox('assets/gallery-works/{encoded}')" class="block w-full break-inside-avoid overflow-hidden rounded-xl group text-left cursor-pointer">
                  <img src="assets/gallery-works/{encoded}" alt="{alt}" loading="lazy" class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </button>
              </div>""")

    me_gallery_html = "\n".join(me_cards)
    works_gallery_html = "\n".join(works_cards)

    common_static_script = """
    <script>
      function switchGallery(tab) {
        const btnMe = document.getElementById('tab-btn-me');
        const btnWorks = document.getElementById('tab-btn-works');
        const gridMe = document.getElementById('gallery-me-grid');
        const gridWorks = document.getElementById('gallery-works-grid');
        if (!btnMe || !btnWorks || !gridMe || !gridWorks) return;
        if (tab === 'me') {
          btnMe.className = 'inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm tracking-wide transition-all bg-sage text-primary-foreground shadow cursor-pointer';
          btnWorks.className = 'inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm tracking-wide transition-all text-muted-foreground hover:text-foreground cursor-pointer';
          gridMe.classList.remove('hidden');
          gridWorks.classList.add('hidden');
        } else {
          btnWorks.className = 'inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm tracking-wide transition-all bg-sage text-primary-foreground shadow cursor-pointer';
          btnMe.className = 'inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm tracking-wide transition-all text-muted-foreground hover:text-foreground cursor-pointer';
          gridWorks.classList.remove('hidden');
          gridMe.classList.add('hidden');
        }
      }

      function openLightbox(src) {
        const lb = document.getElementById('lightbox');
        const img = document.getElementById('lightbox-img');
        if (!lb || !img) return;
        img.src = src;
        lb.classList.remove('hidden');
      }

      function closeLightbox(e) {
        const lb = document.getElementById('lightbox');
        if (!lb) return;
        if (!e || e.target.id === 'lightbox' || e.key === 'Escape') {
          lb.classList.add('hidden');
        }
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox(e);
      });

      document.addEventListener('DOMContentLoaded', () => {
        const reveals = document.querySelectorAll('.reveal');
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
              setTimeout(() => entry.target.classList.add('in'), delay);
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach((el) => io.observe(el));

        const counters = document.querySelectorAll('.counter');
        const cio = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const to = parseInt(el.getAttribute('data-to') || '0', 10);
              const suffix = el.getAttribute('data-suffix') || '';
              const dur = 1600;
              const start = performance.now();
              const tick = (now) => {
                const p = Math.min(1, (now - start) / dur);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(to * eased) + suffix;
                if (p < 1) requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
              cio.unobserve(el);
            }
          });
        }, { threshold: 0.5 });
        counters.forEach((el) => cio.observe(el));
      });
    </script>
    """

    # 1. Main Index HTML
    root_html_path = DIST_DIR / "index.html"
    
    main_body_markup = f"""
      <main class="grain min-h-screen text-foreground">
        <!-- NAV -->
        <nav class="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-cream/60 border-b border-border/40">
          <div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <a href="#top" class="font-serif italic text-lg tracking-wide">Ania Tomaszewska</a>
            <div class="hidden md:flex gap-8 text-sm text-muted-foreground items-center">
              <a href="#o-mnie" class="hover:text-foreground transition-colors">o mnie</a>
              <a href="#czym" class="hover:text-foreground transition-colors">czym się zajmuję</a>
              <a href="#galeria" class="hover:text-foreground transition-colors">galeria</a>
              <a href="#sciezka" class="hover:text-foreground transition-colors">ścieżka</a>
              <a href="poradnik-wizytowka/index.html" class="hover:text-foreground transition-colors">poradnik</a>
              <a href="#kontakt" class="hover:text-foreground transition-colors">kontakt</a>
              <a href="cv/index.html" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/10 border border-sage/30 text-sage hover:bg-sage/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text w-3.5 h-3.5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> CV
              </a>
            </div>
          </div>
        </nav>

        <!-- HERO -->
        <section id="top" class="mesh-bg relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
          <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative">
            <div class="animate-drift-in">
              <p class="text-sm tracking-[0.3em] uppercase text-sage mb-6">Warszawa · Gdynia · w drodze</p>
              <h1 class="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">
                Anna Weronika<br/>
                <span class="italic text-sage">Tomaszewska</span>
                <span class="block text-base md:text-lg font-normal font-sans text-muted-foreground mt-3 tracking-normal">
                  Aktorka · Modelka · Artystka
                </span>
              </h1>
              <p class="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed mb-8">
                21-letnia aktorka, artystka, czasem niespełniona. Wszędzie z małym aparatem i kupuję stosy płótna, w głowie koncepty i ludzie, których jeszcze nie zagrałam.
              </p>
              <div class="flex flex-wrap gap-4">
                <a href="#kontakt" class="px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]">Napisz do mnie</a>
                <a href="#galeria" class="px-6 py-3 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors">Zobacz galerię</a>
              </div>
            </div>
            <div class="relative flex justify-center md:justify-end">
              <div class="absolute inset-0 mesh-bg blur-3xl opacity-60 -z-10"></div>
              <img src="assets/pictures/me-nobg-upscaled.png" alt="Anna Weronika Tomaszewska — portret aktorski i artystyczny" class="max-h-[560px] w-auto object-contain animate-float-slow drop-shadow-[0_30px_40px_rgba(0,0,0,0.15)]" style="-webkit-mask-image: linear-gradient(to bottom, black 78%, transparent 100%); mask-image: linear-gradient(to bottom, black 78%, transparent 100%);" />
            </div>
          </div>
        </section>

        <!-- ABOUT -->
        <section id="o-mnie" class="py-24 md:py-32">
          <div class="max-w-7xl mx-auto px-6">
            <div class="rounded-3xl p-8 md:p-16 bg-gradient-to-br from-[oklch(0.975_0.012_235)] via-[oklch(0.98_0.008_230)] to-[oklch(0.97_0.015_215)] border border-[oklch(0.9_0.02_230)]/50 shadow-[0_30px_70px_-45px_oklch(0.55_0.05_235/0.25)]">
              <div class="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div class="reveal">
                  <div class="relative">
                    <div class="absolute -inset-4 bg-rose/40 rounded-3xl -rotate-2"></div>
                    <img src="assets/gallery-me/Orchid-me-upscaled.png" alt="Ania z orchideą" class="relative rounded-2xl object-cover aspect-[4/5] w-full" />
                  </div>
                </div>
                <div class="reveal" data-delay="150">
                  <p class="text-sm tracking-[0.25em] uppercase text-sage mb-4">o mnie</p>
                  <h2 class="text-4xl md:text-5xl mb-8">Lubię swój święty spokój, ale wyzwania kocham jeszcze bardziej.</h2>
                  <div class="space-y-5 text-[1.0625rem] md:text-lg text-muted-foreground leading-relaxed">
                    <p>Jestem z Warszawy, z Bemowa. Często jednak można mnie znaleźć w Gdyni, bo tam też mam swoje miejsce. W torbie zawsze mały aparat, wracam z tym co warto zapamiętać.</p>
                    <p>Radzę sobie z presją. Na scenie, na egzaminie, w ciężki dzień za barem. Nie ugina mnie tłum ani kamera, mówię publicznie tak samo spokojnie, jak piszę.</p>
                    <p>Jestem bardzo uważna co do detali. Zauważę wszystko to, o czym nawet nie pomyślisz: drobiazg w kadrze, ton w rozmowie, czyjaś niepewność, czy po prostu coś co nie do końca ma sens.</p>
                    <p>Najlepiej pracuje mi się przy czymś artystycznym i konkretnym jednocześnie. Plany filmowe, sesje, projekty, które mają rytm i sens.</p>
                  </div>
                </div>
              </div>
              <div class="reveal" data-delay="200">
                <div class="mt-12 md:mt-16 rounded-2xl p-7 md:p-10 bg-gradient-to-br from-[oklch(0.97_0.015_230)] via-cream/60 to-[oklch(0.96_0.02_25)]/60 border border-sage/15">
                  <div class="flex items-start gap-5">
                    <div class="shrink-0 w-11 h-11 rounded-full bg-sage/15 text-sage flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-5 h-5"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                    </div>
                    <p class="italic text-base md:text-lg leading-relaxed text-foreground/85" style="font-family: 'Montserrat', sans-serif; font-weight: 300;">
                      Jak mam jakiś projekt, wkładam w niego całą siebie i użyję wszystkich umiejętności, jakie mam, żeby się powiódł. Nawet jeżeli jest w zupełnie innej branży.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- WHAT I DO -->
        <section id="czym" class="py-24 md:py-32 bg-gradient-to-b from-transparent via-rose/10 to-transparent">
          <div class="max-w-6xl mx-auto px-6">
            <div class="reveal">
              <p class="text-sm tracking-[0.25em] uppercase text-sage mb-4">czym się zajmuję</p>
              <h2 class="text-4xl md:text-5xl mb-16 max-w-2xl">
                Rzeczy, z którymi można mi <span class="italic text-sage bg-gradient-to-r from-sage/20 to-rose/40 px-3 rounded-md">zaufać</span>.
              </h2>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="reveal" data-delay="0">
                <div class="soft-card rounded-2xl p-7 h-full hover:-translate-y-1 transition-transform duration-500">
                  <div class="w-11 h-11 rounded-2xl bg-sage/15 text-sage mb-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-drama w-5 h-5"><path d="M10 11h.01"/><path d="M14 11h.01"/><path d="M10 15c.5 1 1.5 1.5 2 1.5s1.5-.5 2-1.5"/><path d="M12 2a10 10 0 0 0-10 10c0 4.5 3 8 7 9.5"/><path d="M12 2a10 10 0 0 1 10 10c0 4.5-3 8-7 9.5"/></svg>
                  </div>
                  <h3 class="text-2xl mb-3">Aktorstwo</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed">Na planach już od 2022. Warsztat u <a href="https://varsztatovnia.pl/" target="_blank" rel="noopener noreferrer" class="text-foreground underline decoration-sage/50 underline-offset-2 hover:decoration-sage">Łukasza Zubrzyckiego</a>, weekendowy tryb w Warszawskim Studium Aktorskim. Egzaminy do szkół artystycznych już w drodze. <a href="poradnik-wizytowka/index.html" class="text-foreground underline decoration-sage/50 underline-offset-2 hover:decoration-sage">Jak nagrać filmik-wizytówkę</a>.</p>
                </div>
              </div>
              <div class="reveal" data-delay="100">
                <div class="soft-card rounded-2xl p-7 h-full hover:-translate-y-1 transition-transform duration-500">
                  <div class="w-11 h-11 rounded-2xl bg-sage/15 text-sage mb-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera w-5 h-5"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                  </div>
                  <h3 class="text-2xl mb-3">Modeling</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed">Byłam twarzą wielu sesji zdjęciowych. Dobrze czuję się przed aparatem, kamerą i światłem. Zgłaszałam się do agencji, bywam po drugiej stronie obiektywu.</p>
                </div>
              </div>
              <div class="reveal" data-delay="200">
                <div class="soft-card rounded-2xl p-7 h-full hover:-translate-y-1 transition-transform duration-500">
                  <div class="w-11 h-11 rounded-2xl bg-sage/15 text-sage mb-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase w-5 h-5"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                  </div>
                  <h3 class="text-2xl mb-3">Zarządzanie</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed">Green Caffe Nero, baristka od października 2024, kierowniczka zmiany od października 2025. Pięcie się po szczeblach wyszło naturalnie.</p>
                </div>
              </div>
              <div class="reveal" data-delay="300">
                <div class="soft-card rounded-2xl p-7 h-full hover:-translate-y-1 transition-transform duration-500">
                  <div class="w-11 h-11 rounded-2xl bg-sage/15 text-sage mb-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette w-5 h-5"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.75 1.7-1.67 0-.42-.16-.8-.43-1.09-.27-.29-.44-.68-.44-1.12 0-.92.75-1.67 1.67-1.67H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z"/></svg>
                  </div>
                  <h3 class="text-2xl mb-3">Sztuka</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed">Ponad sto skończonych prac plastycznych. Farba, płótno, nocne siedzenie do rana. <span class="text-foreground bg-rose/50 px-1.5 rounded">Dłubię przy detalach, poprawiam pojedyncze pociągnięcie pędzla, aż efekt jest perfekcyjny</span>.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- STATS -->
        <section class="py-24 md:py-32">
          <div class="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
            <div class="reveal" data-delay="0">
              <div class="font-serif text-6xl md:text-7xl text-sage mb-3">
                <span class="counter" data-to="20" data-suffix="+">0+</span>
              </div>
              <div class="text-lg mb-2">planów filmowych</div>
              <p class="text-sm text-muted-foreground max-w-[220px] mx-auto leading-relaxed">na których byłam, uczyłam się rytmu i ciszy między ujęciami</p>
            </div>
            <div class="reveal" data-delay="120">
              <div class="font-serif text-6xl md:text-7xl text-sage mb-3">
                <span class="counter" data-to="100" data-suffix="+">0+</span>
              </div>
              <div class="text-lg mb-2">prac plastycznych</div>
              <p class="text-sm text-muted-foreground max-w-[220px] mx-auto leading-relaxed">od szkiców po skończone płótna, każde z własnym nastrojem</p>
            </div>
            <div class="reveal" data-delay="240">
              <div class="font-serif text-6xl md:text-7xl text-sage mb-3">
                <span class="counter" data-to="4" data-suffix="+">0+</span>
              </div>
              <div class="text-lg mb-2">lata na scenie aktorskiej</div>
              <p class="text-sm text-muted-foreground max-w-[220px] mx-auto leading-relaxed">kursy, warsztaty, plany, reklamy, marketing, mikrofon w ręku</p>
            </div>
          </div>
        </section>

        <!-- GALLERY -->
        <section id="galeria" class="py-24 md:py-32 mesh-bg">
          <div class="max-w-6xl mx-auto px-6">
            <div class="reveal">
              <p class="text-sm tracking-[0.25em] uppercase text-sage mb-4">galeria</p>
              <h2 class="text-4xl md:text-5xl mb-6 max-w-2xl">Ja i moje prace w kadrze.</h2>
              <p class="text-muted-foreground max-w-xl mb-10 leading-relaxed">Wożę ze sobą mały aparat i łapię to, co warte zapamiętania. Trochę planu, trochę farby, trochę siebie.</p>
            </div>
            
            <div class="reveal" data-delay="100">
              <div class="inline-flex items-center gap-1 p-1 mb-10 rounded-full bg-cream/70 border border-sage/20 shadow-[0_10px_30px_-20px_oklch(0.4_0.02_40/0.3)]">
                <button id="tab-btn-me" onclick="switchGallery('me')" class="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm tracking-wide transition-all bg-sage text-primary-foreground shadow cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user w-3.5 h-3.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Ja
                </button>
                <button id="tab-btn-works" onclick="switchGallery('works')" class="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm tracking-wide transition-all text-muted-foreground hover:text-foreground cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image w-3.5 h-3.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> Prace
                </button>
              </div>
            </div>

            <!-- GALLERY ME GRID -->
            <div id="gallery-me-grid" class="columns-2 md:columns-3 gap-4 space-y-4 animate-drift-in">
{me_gallery_html}
            </div>

            <!-- GALLERY WORKS GRID -->
            <div id="gallery-works-grid" class="columns-2 md:columns-3 gap-4 space-y-4 animate-drift-in hidden">
{works_gallery_html}
            </div>
          </div>
        </section>

        <!-- PATH / TIMELINE -->
        <section id="sciezka" class="py-24 md:py-32">
          <div class="max-w-4xl mx-auto px-6">
            <div class="reveal">
              <p class="text-sm tracking-[0.25em] uppercase text-sage mb-4">ścieżka</p>
              <h2 class="text-4xl md:text-5xl mb-16">Krótka historia, w kolejności.</h2>
            </div>
            <div class="relative pl-8 md:pl-12 border-l border-sage/30 space-y-12">
              <div class="reveal" data-delay="0">
                <div class="relative">
                  <span class="absolute -left-[41px] md:-left-[57px] top-2 w-3 h-3 rounded-full bg-sage ring-4 ring-cream"></span>
                  <p class="text-xs tracking-[0.2em] uppercase text-sage mb-2">2020 - 2024</p>
                  <h3 class="text-2xl mb-2">Liceum Marii Pawlikowskiej-Jasnorzewskiej</h3>
                  <p class="text-muted-foreground leading-relaxed">LXVII LO w Warszawie. Napisana matura rozszerzona z polskiego oraz z angielskiego.</p>
                </div>
              </div>
              <div class="reveal" data-delay="80">
                <div class="relative">
                  <span class="absolute -left-[41px] md:-left-[57px] top-2 w-3 h-3 rounded-full bg-sage ring-4 ring-cream"></span>
                  <p class="text-xs tracking-[0.2em] uppercase text-sage mb-2">od 2023</p>
                  <h3 class="text-2xl mb-2">Aktorka</h3>
                  <p class="text-muted-foreground leading-relaxed">Pierwsze kroki filmowe, statystka w wielu produkcjach, gdzie tylko się dało.</p>
                </div>
              </div>
              <div class="reveal" data-delay="160">
                <div class="relative">
                  <span class="absolute -left-[41px] md:-left-[57px] top-2 w-3 h-3 rounded-full bg-sage ring-4 ring-cream"></span>
                  <p class="text-xs tracking-[0.2em] uppercase text-sage mb-2">2023</p>
                  <h3 class="text-2xl mb-2">Warsztaty z Łukaszem Zubrzyckim</h3>
                  <p class="text-muted-foreground leading-relaxed">Varsztatownia, cały kurs ukończony z myślą o karierze aktorskiej.</p>
                </div>
              </div>
              <div class="reveal" data-delay="240">
                <div class="relative">
                  <span class="absolute -left-[41px] md:-left-[57px] top-2 w-3 h-3 rounded-full bg-sage ring-4 ring-cream"></span>
                  <p class="text-xs tracking-[0.2em] uppercase text-sage mb-2">od 10.2024</p>
                  <h3 class="text-2xl mb-2">Green Caffe Nero, baristka</h3>
                  <p class="text-muted-foreground leading-relaxed">Baristka i od samego początku bardzo przykładałam się do pracy.</p>
                </div>
              </div>
              <div class="reveal" data-delay="320">
                <div class="relative">
                  <span class="absolute -left-[41px] md:-left-[57px] top-2 w-3 h-3 rounded-full bg-sage ring-4 ring-cream"></span>
                  <p class="text-xs tracking-[0.2em] uppercase text-sage mb-2">10.2025 - 03.2026</p>
                  <h3 class="text-2xl mb-2">Uniwersytet Warszawski, filologia polska</h3>
                  <p class="text-muted-foreground leading-relaxed">Specjalność literaturoznawczo-językoznawcza, żeby lepiej zapoznać się z tekstami od strony technicznej.</p>
                </div>
              </div>
              <div class="reveal" data-delay="400">
                <div class="relative">
                  <span class="absolute -left-[41px] md:-left-[57px] top-2 w-3 h-3 rounded-full bg-sage ring-4 ring-cream"></span>
                  <p class="text-xs tracking-[0.2em] uppercase text-sage mb-2">od 10.2025</p>
                  <h3 class="text-2xl mb-2">Kierowniczka zmiany, Green Caffe Nero</h3>
                  <p class="text-muted-foreground leading-relaxed">Awans wyszedł naturalnie, bardzo dobrze sobie w tym radziłam.</p>
                </div>
              </div>
              <div class="reveal" data-delay="480">
                <div class="relative">
                  <span class="absolute -left-[41px] md:-left-[57px] top-2 w-3 h-3 rounded-full bg-sage ring-4 ring-cream"></span>
                  <p class="text-xs tracking-[0.2em] uppercase text-sage mb-2">od 06.2026</p>
                  <h3 class="text-2xl mb-2">Kreatorka mediów, Lambadjara</h3>
                  <p class="text-muted-foreground leading-relaxed">Tworzenie contentu wokół marki i narracji o niej, a także samo robienie handmade koralików.</p>
                </div>
              </div>
              <div class="reveal" data-delay="560">
                <div class="relative">
                  <span class="absolute -left-[41px] md:-left-[57px] top-2 w-3 h-3 rounded-full bg-sage ring-4 ring-cream"></span>
                  <p class="text-xs tracking-[0.2em] uppercase text-sage mb-2">obecnie</p>
                  <h3 class="text-2xl mb-2">Profesjonalny kurs jubilerstwa, tryb dzienny</h3>
                  <p class="text-muted-foreground leading-relaxed">Marketing już umiem, teraz uczę się pracować z metalem, żeby kiedyś otworzyć własną markę.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- INTERESTS -->
        <section class="py-24 md:py-32 relative overflow-hidden">
          <img src="assets/pictures/Ok_Zara_model-upscaled.png" alt="" aria-hidden="true" class="absolute bottom-0 h-[500px] w-auto opacity-30 pointer-events-none hidden lg:block right-[4rem] xl:right-[6rem] 2xl:right-[8rem]" />
          <div class="max-w-4xl mx-auto px-6 relative">
            <div class="reveal">
              <p class="text-sm tracking-[0.25em] uppercase text-sage mb-4">zainteresowania</p>
              <h2 class="text-4xl md:text-5xl mb-10">Rzeczy, które zajmują mi głowę.</h2>
            </div>
            <div class="reveal" data-delay="100">
              <div class="flex flex-wrap gap-3 mb-12">
                <span class="px-5 py-2 rounded-full bg-rose/40 text-sm tracking-wide hover:bg-rose/60 transition-colors cursor-default">estetyka</span>
                <span class="px-5 py-2 rounded-full bg-rose/40 text-sm tracking-wide hover:bg-rose/60 transition-colors cursor-default">marketing</span>
                <span class="px-5 py-2 rounded-full bg-rose/40 text-sm tracking-wide hover:bg-rose/60 transition-colors cursor-default">psychologia</span>
                <span class="px-5 py-2 rounded-full bg-rose/40 text-sm tracking-wide hover:bg-rose/60 transition-colors cursor-default">malarstwo</span>
                <span class="px-5 py-2 rounded-full bg-rose/40 text-sm tracking-wide hover:bg-rose/60 transition-colors cursor-default">aktorstwo</span>
                <span class="px-5 py-2 rounded-full bg-rose/40 text-sm tracking-wide hover:bg-rose/60 transition-colors cursor-default">jubilerstwo</span>
                <span class="px-5 py-2 rounded-full bg-rose/40 text-sm tracking-wide hover:bg-rose/60 transition-colors cursor-default">ludzie</span>
                <span class="px-5 py-2 rounded-full bg-rose/40 text-sm tracking-wide hover:bg-rose/60 transition-colors cursor-default">muzyka</span>
                <span class="px-5 py-2 rounded-full bg-rose/40 text-sm tracking-wide hover:bg-rose/60 transition-colors cursor-default">literatura</span>
              </div>
            </div>
            <div class="reveal" data-delay="200">
              <p class="text-lg text-muted-foreground max-w-2xl leading-relaxed italic font-serif">
                Zawsze jak oglądam jakiś film, myślę o tym, jak został nakręcony. Kadr, cięcie, światło, decyzja reżysera. Chętnie się tym dzielę, na głos albo w notatkach.
              </p>
            </div>
          </div>
        </section>

        <!-- ACHIEVEMENTS -->
        <section class="py-24 md:py-32 bg-gradient-to-b from-transparent via-sage/5 to-transparent">
          <div class="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            <div class="reveal">
              <p class="text-sm tracking-[0.25em] uppercase text-sage mb-4">osiągnięcia</p>
              <h3 class="text-3xl mb-8">Rzeczy, o których warto wspomnieć.</h3>
              
              <div class="relative rounded-2xl p-6 mb-6 bg-gradient-to-br from-rose/70 via-cream to-sage/25 border border-sage/30 shadow-[0_25px_60px_-30px_oklch(0.4_0.04_155/0.4)] overflow-hidden">
                <div class="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-sage/15 blur-2xl"></div>
                <div class="relative flex items-start gap-4">
                  <div class="shrink-0 w-14 h-14 rounded-2xl bg-sage text-primary-foreground flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy w-7 h-7"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
                  </div>
                  <div>
                    <p class="text-xs tracking-[0.25em] uppercase text-sage mb-2">najważniejsze</p>
                    <h4 class="font-serif text-2xl md:text-3xl mb-2 text-foreground">
                      Instant Challenge <span class="italic">Champion</span>
                    </h4>
                    <p class="text-sm text-muted-foreground leading-relaxed">
                      <a href="https://www.kreatywnosc.pl/" target="_blank" rel="noopener noreferrer" class="text-foreground underline decoration-sage/50 underline-offset-2 hover:decoration-sage">Destination Imagination</a> Global Finals, Knoxville, USA. Moja specjalizacja: <span class="text-foreground">szybkie rozwiązywanie bardzo skomplikowanych problemów</span>, pod presją, w zespole, na czas.
                    </p>
                  </div>
                </div>
              </div>

              <ul class="space-y-4 text-muted-foreground">
                <li class="flex gap-4 items-start">
                  <span class="shrink-0 w-9 h-9 rounded-full bg-rose/50 flex items-center justify-center text-sage">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award w-4 h-4"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                  </span>
                  <span><strong class="text-foreground font-normal">I miejsce w wyzwaniu społecznym</strong>, XI Ogólnopolska Olimpiada Kreatywności <a href="https://www.kreatywnosc.pl/" target="_blank" rel="noopener noreferrer" class="text-foreground underline decoration-sage/50 underline-offset-2 hover:decoration-sage">Destination Imagination</a>, Oczyma Wyobraźni.</span>
                </li>
                <li class="flex gap-4 items-start">
                  <span class="shrink-0 w-9 h-9 rounded-full bg-rose/50 flex items-center justify-center text-sage">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-languages w-4 h-4"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
                  </span>
                  <span>Cambridge English Level 1 Certificate in ESOL, poziom B2, dziś realnie bliżej C1.</span>
                </li>
                <li class="flex gap-4 items-start">
                  <span class="shrink-0 w-9 h-9 rounded-full bg-rose/50 flex items-center justify-center text-sage">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-4 h-4"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                  </span>
                  <span>Warsztaty aktorskie u <strong class="text-foreground font-normal">Łukasza Zubrzyckiego</strong>, <a href="https://varsztatovnia.pl/" target="_blank" rel="noopener noreferrer" class="text-foreground underline decoration-sage/50 underline-offset-2 hover:decoration-sage">Varsztatownia</a>.</span>
                </li>
              </ul>
            </div>

            <div class="reveal" data-delay="150">
              <p class="text-sm tracking-[0.25em] uppercase text-sage mb-4">języki i praca w zespole</p>
              <h3 class="text-3xl mb-8">Jak działam z ludźmi.</h3>
              <div class="space-y-4 text-muted-foreground leading-relaxed">
                <p><span class="text-foreground">Polski</span> natywnie. <span class="text-foreground">Angielski</span> biegle, w mowie i piśmie.</p>
                <p>Szybko się uczę, jestem wielozadaniowa i świetnie mi idzie adaptacja do środowiska. Cierpliwa, kulturalna, konkretna. Umiem prowadzić zespół i umiem być jego częścią.</p>
                <p><span class="text-foreground">Doskonale rozładowuję konflikty</span>. Świetnie się na nich znam, wiem, skąd się biorą i jak je zamknąć, żeby zespół dalej działał. <span class="text-foreground">Umiem reprezentować tak siebie, jak i markę, także publicznie</span>.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- CONTACT -->
        <section id="kontakt" class="mesh-bg py-24 md:py-32">
          <div class="max-w-3xl mx-auto px-6 text-center">
            <div class="reveal">
              <p class="text-sm tracking-[0.25em] uppercase text-sage mb-6">kontakt</p>
              <h2 class="font-serif text-5xl md:text-6xl mb-6">Napisz, <span class="italic">jeśli masz coś ciekawego.</span></h2>
              <p class="text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
                Plan, sesja, rola, projekt, a może szukasz kogoś kto zgrabnie rozpromuje Twoją markę? Szybko odpiszę, nawet między zajęciami i zmianami.
              </p>
            </div>
            <div class="reveal" data-delay="150">
              <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                <a href="mailto:aniat1090@gmail.com" class="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail w-4 h-4"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> aniat1090@gmail.com
                </a>
                <a href="tel:+48518357491" class="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> 518 357 491
                </a>
                <a href="https://instagram.com/ann.veronique" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> @ann.veronique
                </a>
              </div>
            </div>
            <div class="reveal" data-delay="300">
              <p class="text-xs tracking-[0.3em] uppercase text-muted-foreground">Warszawa · Gdynia · mobilna po całej Polsce</p>
            </div>
          </div>
        </section>

        <!-- FOOTER -->
        <footer class="py-12 border-t border-border/40 bg-cream/40">
          <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <span class="font-serif italic text-base tracking-wide text-foreground">
                Anna Tomaszewska
              </span>
              <span class="hidden sm:inline text-muted-foreground/30">•</span>
              <div class="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <a href="https://www.facebook.com/anna.tomaszewska.180072" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:text-foreground transition-colors" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook w-3.5 h-3.5 text-sage"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  <span>Facebook</span>
                </a>
                <a href="https://instagram.com/ann.veronique" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:text-foreground transition-colors" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram w-3.5 h-3.5 text-sage"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  <span>Instagram</span>
                </a>
                <a href="mailto:aniat1090@gmail.com" class="inline-flex items-center gap-1.5 hover:text-foreground transition-colors" aria-label="Email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail w-3.5 h-3.5 text-sage"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <span>Email</span>
                </a>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3 text-xs text-muted-foreground">
              <a href="poradnik-wizytowka/index.html" class="hover:text-foreground transition-colors underline decoration-sage/40 underline-offset-2">poradnik wizytówka</a>
              <span class="hidden sm:inline text-muted-foreground/30">•</span>
              <p class="font-serif italic">© 2026 Anna Weronika Tomaszewska</p>
              <span class="hidden sm:inline text-muted-foreground/30">•</span>
              <a href="https://jifo.dev" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:text-foreground transition-colors group">
                <span>Made by boyfriend</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-rose-500 fill-rose-500 inline group-hover:scale-110 transition-transform"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                <span class="underline decoration-sage/40 underline-offset-2">jifo.dev</span>
              </a>
            </div>
          </div>
        </footer>

        <!-- LIGHTBOX -->
        <div id="lightbox" onclick="closeLightbox(event)" class="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-6 animate-drift-in hidden">
          <img id="lightbox-img" src="" alt="" class="max-h-[90vh] max-w-full rounded-lg shadow-2xl" />
        </div>
      </main>
    """

    index_html = f"""<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ania Tomaszewska — aktorka, artystka, obserwatorka</title>
    <meta name="description" content="Strona Anny Weroniki Tomaszewskiej. Aktorka, modelka, kierowniczka zmiany, autorka ponad stu prac plastycznych. Warszawa, Gdynia, plany filmowe." />
    <meta property="og:title" content="Ania Tomaszewska — aktorka, artystka, obserwatorka" />
    <meta property="og:description" content="Miejsce, w którym mieszczą się plany filmowe, płótna, sceny i cichy proces twórczy." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://annatomaszewska.pl/" />
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
    <link rel="canonical" href="https://annatomaszewska.pl/" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Karla:wght@300;400;500;600&family=Montserrat:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap" />
    {f'<link rel="stylesheet" href="assets/{css_name}" />' if css_name else ''}
  </head>
  <body>
    <div id="root">{main_body_markup}</div>
    {common_static_script}
    {f'<script type="module" src="assets/{js_name}"></script>' if js_name else ''}
  </body>
</html>"""

    root_html_path.write_text(index_html, encoding="utf-8")
    ok("Generated standalone dist-static/index.html (with relative asset links)")

    # 2. Sub-routes HTML
    poradnik_body_markup = """
      <main class="grain min-h-screen mesh-bg flex flex-col text-foreground">
        <nav class="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-cream/60 border-b border-border/40">
          <div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <a href="../index.html" class="font-serif italic text-lg tracking-wide">Ania Tomaszewska</a>
            <div class="flex items-center gap-4">
              <a href="../cv/index.html" class="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">CV</a>
              <a href="../index.html" class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left w-4 h-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> Powrót do portfolio
              </a>
            </div>
          </div>
        </nav>

        <header class="pt-32 pb-16 md:pt-40 md:pb-24 px-6 max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/10 border border-sage/30 text-sage text-xs tracking-wider uppercase mb-6">
            Poradnik · filmik-wizytówka
          </div>
          <h1 class="font-serif text-4xl md:text-6xl leading-tight mb-6">
            Jak nagrać filmik, który ktoś w ogóle zapamięta
          </h1>
          <p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            O samonagrywaniu wizytówek: do uczelni aktorskich, do agencji, albo po prostu wtedy, kiedy ktoś prosi o „krótki filmik o sobie”. Tu nie chodzi o sprzęt za kilka tysięcy — chodzi o kadr, miejsce i to, <em>co</em> w tym kadrze robisz.
          </p>
        </header>

        <article class="pb-24 px-6 max-w-4xl mx-auto space-y-16">
          <div class="grid md:grid-cols-3 gap-6">
            <div class="soft-card rounded-2xl p-6 bg-gradient-to-br from-cream via-rose/20 to-cream border border-sage/20">
              <h3 class="font-serif text-lg font-medium mb-2">Miejsce i światło</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">Domowy kąt wystarczy. Ważne, żeby tło nie walczyło z Tobą o uwagę, a światło nie robiło z Ciebie cienia pod okiem.</p>
            </div>
            <div class="soft-card rounded-2xl p-6 bg-gradient-to-br from-cream via-sage/15 to-cream border border-sage/20">
              <h3 class="font-serif text-lg font-medium mb-2">Kto trzyma telefon</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">Weź kogoś ze zmysłem estetycznym. Nie osobę, która „umie nagrać”, tylko kogoś, kto widzi, gdzie kończy się kadr.</p>
            </div>
            <div class="soft-card rounded-2xl p-6 bg-gradient-to-br from-cream via-rose/20 to-cream border border-sage/20">
              <h3 class="font-serif text-lg font-medium mb-2">Co mówisz / grasz</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">Jeśli nie powiedzą dokładnie co — zrób coś, co da się zapamiętać. Bezpieczny tekst, który grają wszyscy, ginie w stosie.</p>
            </div>
          </div>

          <section class="soft-card rounded-3xl p-8 md:p-12 bg-cream/70 border border-sage/20 space-y-6">
            <h2 class="font-serif text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
              <span class="flex items-center justify-center w-8 h-8 rounded-full bg-sage text-primary-foreground text-sm font-sans font-semibold">1</span>
              Po co w ogóle ten filmik
            </h2>
            <p class="text-muted-foreground leading-relaxed text-base md:text-lg">
              Wizytówka osobista to nie showreel z planów. Nie musisz mieć montażu z pięciu produkcji. Często wystarczy jeden, dwa, trzy minuty: Ty, spokojne tło, słyszalny głos i decyzja, <em>kim</em> w tym momencie jesteś.
            </p>
            <p class="text-muted-foreground leading-relaxed text-base md:text-lg">
              Agencja modelingowa i uczelnia aktorska chcą trochę innych rzeczy. Agencja: czytelna prezencja, proporcje, ruch, spokój przed kamerą. Uczelnia: czy masz coś w sobie, czy umiesz zagrać tekst, czy nie boisz się ryzyka. Ale baza techniczna jest ta sama: czysty kadr, słyszalny dźwięk, zero chaosu w tle.
            </p>
            <p class="text-muted-foreground leading-relaxed text-base md:text-lg">
              Ludzie przeglądają te nagrania szybko. Jeśli przez pierwsze dwadzieścia sekund nie wiadomo, na co patrzeć — odpadasz, zanim zdążysz dojść do „ważnej” części.
            </p>
          </section>

          <section class="soft-card rounded-3xl p-8 md:p-12 bg-cream/70 border border-sage/20 space-y-8">
            <h2 class="font-serif text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
              <span class="flex items-center justify-center w-8 h-8 rounded-full bg-sage text-primary-foreground text-sm font-sans font-semibold">2</span>
              Miejsce, światło i ramy kadru
            </h2>
            <p class="text-muted-foreground leading-relaxed text-base md:text-lg">
              Nie potrzebujesz studia. Telefon na statywie, dzień z miękkim światłem, tło które nie krzyczy. Biały ekran, ściana, spokojna zasłona — cokolwiek, byle nie widać w kadrze pół mieszkania i kabli pod nogami.
            </p>
            <p class="text-muted-foreground leading-relaxed text-base md:text-lg">
              <strong>Weź kogoś do pomocy.</strong> Kogoś ze zmysłem estetycznym. Nie wystarczy osoba, która umie nacisnąć czerwony przycisk. Potrzebujesz kogoś, kto spojrzy na podgląd i powie: „tu ucina Ci rękę”, „tło wchodzi za bardzo”, „cofnij się o pół kroku”.
            </p>
            <div class="grid md:grid-cols-2 gap-6 items-start">
              <div class="space-y-3">
                <div id="setup-cycle" class="relative overflow-hidden rounded-2xl bg-cream/40 aspect-[3/4] shadow-sm border border-sage/15">
                  <img data-setup src="../assets/pictures/poradnik/setup-01.png" alt="Domowy setup do nagrania filmiku-wizytówki" class="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-300" />
                  <img data-setup src="../assets/pictures/poradnik/setup-02.png" alt="" aria-hidden="true" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300" />
                  <img data-setup src="../assets/pictures/poradnik/setup-03.png" alt="" aria-hidden="true" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300" />
                  <img data-setup src="../assets/pictures/poradnik/setup-04.png" alt="" aria-hidden="true" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300" />
                  <img data-setup src="../assets/pictures/poradnik/setup-05.png" alt="" aria-hidden="true" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300" />
                </div>
                <p class="text-xs text-muted-foreground text-center leading-relaxed px-2">
                  Setup od kuchni: telefon, tło, mikrofon, laptop do podglądu. Pokój żyje swoim życiem — w filmiku ma zostać tylko to, co celowo zostawisz.
                </p>
              </div>
              <div class="space-y-3">
                <div class="overflow-hidden rounded-2xl bg-cream/40 border border-sage/15 shadow-sm aspect-[3/4]">
                  <img src="../assets/pictures/poradnik/wkadrze.png" alt="Jak wygląda ten sam setup w kadrze kamery" class="w-full h-full object-cover" />
                </div>
                <p class="text-xs text-muted-foreground text-center leading-relaxed px-2">
                  A tak wygląda ten sam setup <em class="not-italic text-foreground">w kadrze</em>. Ogród, kabel, krzesło — wszystko poza ramą. W telefonie widać tylko wycinek.
                </p>
              </div>
            </div>
            <div class="p-5 rounded-2xl bg-sage/10 border border-sage/25 space-y-2">
              <h3 class="font-serif text-lg font-medium text-foreground">Wiedzieć, gdzie kończy się kadr</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                Zanim naciśniesz rec, stań w miejscu i poproś, żeby ktoś pokazał Ci dokładnie granice. Gdzie jest górna krawędź. Gdzie lewa. Czy w ruchu ręką nie wychodzisz poza tło. To brzmi banalnie, a właśnie tu pada większość domowych nagrań.
              </p>
            </div>
          </section>

          <section class="soft-card rounded-3xl p-8 md:p-12 bg-cream/70 border border-sage/20 space-y-6">
            <h2 class="font-serif text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
              <span class="flex items-center justify-center w-8 h-8 rounded-full bg-sage text-primary-foreground text-sm font-sans font-semibold">3</span>
              Co mówić, co grać
            </h2>
            <p class="text-muted-foreground leading-relaxed text-base md:text-lg">
              Jeśli w briefie jest konkret — rób konkret. Gorzej, kiedy nie mówią dokładnie, co masz zrobić. Wtedy jedyne sensowne kryterium: <em>czy to nagranie da się zapamiętać</em>.
            </p>
            <p class="text-muted-foreground leading-relaxed text-base md:text-lg">
              Teksty, które z natury są trochę dziwne, dają więcej przestrzeni. Paradoks: lepiej wrecytować <em>Lokomotywę</em> tak, że zostaje w głowie, niż kolejny raz ten sam fragment, który wszyscy biorą „bo Tokarczuk” albo „bo tak się robi na egzaminach”.
            </p>
            <div class="grid md:grid-cols-2 gap-4 pt-2">
              <div class="p-4 rounded-xl bg-background/50 border border-border/50">
                <h4 class="font-serif font-medium text-foreground mb-1">Uczelnia</h4>
                <p class="text-sm text-muted-foreground">Ryzyko, charakter, decyzja aktorska. Wolisz być zapamiętana za coś ostrego niż za poprawny, szary przeciętniak.</p>
              </div>
              <div class="p-4 rounded-xl bg-background/50 border border-border/50">
                <h4 class="font-serif font-medium text-foreground mb-1">Agencja</h4>
                <p class="text-sm text-muted-foreground">Krócej, spokojniej, mniej teatru. Nadal: czyste tło, dobry kadr, słyszalny głos.</p>
              </div>
            </div>
          </section>

          <section class="soft-card rounded-3xl p-8 md:p-12 bg-cream/70 border border-sage/20 space-y-6">
            <h2 class="font-serif text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
              <span class="flex items-center justify-center w-8 h-8 rounded-full bg-sage text-primary-foreground text-sm font-sans font-semibold">4</span>
              Jak to nagrać, żeby nie zwariować
            </h2>
            <p class="text-muted-foreground leading-relaxed text-base md:text-lg">
              Najpierw ustawienie, potem take'y. Oglądaj na większym ekranie. Lepiej trochę brzydszy kadr ze słyszalnym tekstem niż piękny obraz i mamrotanie. Na koniec wybierz <strong>jeden</strong> plik.
            </p>
          </section>

          <section class="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-rose/30 via-cream to-sage/25 border border-sage/30 space-y-6">
            <h2 class="font-serif text-2xl md:text-3xl font-medium text-foreground">Checklist przed wysłaniem</h2>
            <div class="space-y-3 font-sans text-base">
              <div class="flex items-center gap-3 bg-cream/80 p-3.5 rounded-xl border border-sage/20"><span class="text-foreground/90 font-medium">Sprawdź orientację i przycięcie — nic ważnego nie ginie na krawędzi.</span></div>
              <div class="flex items-center gap-3 bg-cream/80 p-3.5 rounded-xl border border-sage/20"><span class="text-foreground/90 font-medium">Obejrzyj na dużym ekranie i ze słuchawkami.</span></div>
              <div class="flex items-center gap-3 bg-cream/80 p-3.5 rounded-xl border border-sage/20"><span class="text-foreground/90 font-medium">Nazwa pliku z imieniem i nazwiskiem, nie IMG_4832.</span></div>
              <div class="flex items-center gap-3 bg-cream/80 p-3.5 rounded-xl border border-sage/20"><span class="text-foreground/90 font-medium">Link działa i nie wymaga logowania na siłę.</span></div>
              <div class="flex items-center gap-3 bg-cream/80 p-3.5 rounded-xl border border-sage/20"><span class="text-foreground/90 font-medium">Jedna wersja. Jedna decyzja.</span></div>
            </div>
          </section>

          <div class="rounded-3xl p-8 md:p-12 text-center bg-gradient-to-br from-sage/20 via-cream to-rose/20 border border-sage/30 space-y-6">
            <h2 class="font-serif text-3xl md:text-4xl">Masz pytanie albo chcesz feedback?</h2>
            <p class="text-muted-foreground text-lg max-w-xl mx-auto">Napisz. Czasem wystarczy świeże oko na kadr albo na to, czy tekst w ogóle „siedzi”.</p>
            <div class="flex flex-wrap justify-center gap-4 pt-2">
              <a href="../index.html#kontakt" class="px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]">Napisz do mnie</a>
              <a href="../cv/index.html" class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors">Zobacz CV</a>
            </div>
          </div>
        </article>
      </main>
    """

    for route in ROUTES:
        route_dir = DIST_DIR / route["path"]
        ensure_dir(route_dir)
        route_html_path = route_dir / "index.html"

        css_rel = f'<link rel="stylesheet" href="../assets/{css_name}" />' if css_name else ''
        js_rel  = f'<script type="module" src="../assets/{js_name}"></script>' if js_name else ''
        noindex_meta = '<meta name="robots" content="noindex" />' if route["noindex"] else ''

        if route["path"] == "cv":
            route_body_markup = """
              <main class="grain min-h-screen mesh-bg flex flex-col">
                <nav class="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-cream/60 border-b border-border/40">
                  <div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                    <a href="../index.html" class="font-serif italic text-lg tracking-wide">Ania Tomaszewska</a>
                    <a href="../index.html" class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left w-4 h-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> wróć
                    </a>
                  </div>
                </nav>

                <section class="flex-1 flex items-center justify-center px-6 pt-32 pb-16">
                  <div class="max-w-md w-full">
                    <div id="locked-card" class="soft-card rounded-3xl p-10 text-center bg-gradient-to-br from-rose/40 via-cream to-sage/20 border border-sage/25">
                      <div class="mx-auto w-14 h-14 rounded-2xl bg-sage text-primary-foreground flex items-center justify-center mb-6 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock w-6 h-6"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </div>
                      <p class="text-xs tracking-[0.3em] uppercase text-sage mb-3">prywatne</p>
                      <h1 class="font-serif text-3xl md:text-4xl mb-3">CV pod hasłem</h1>
                      <p class="text-sm text-muted-foreground mb-8 leading-relaxed">
                        Wpisz hasło, żeby zobaczyć i pobrać CV.
                      </p>
                      <form id="cv-form" class="space-y-4">
                        <label for="cv-password" class="sr-only">Hasło dostępu do CV</label>
                        <input
                          id="cv-password"
                          type="password"
                          aria-label="Hasło dostępu do CV"
                          autofocus
                          placeholder="hasło"
                          class="w-full px-5 py-3 rounded-full border border-sage/30 bg-cream/70 text-center tracking-wide focus:outline-none focus:border-sage transition-colors"
                        />
                        <p id="error-msg" class="text-xs text-destructive hidden">Niepoprawne hasło.</p>
                        <button
                          type="submit"
                          class="w-full px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]"
                        >
                          Odblokuj
                        </button>
                      </form>
                    </div>

                    <div id="unlocked-card" class="soft-card rounded-3xl p-10 text-center bg-gradient-to-br from-rose/40 via-cream to-sage/20 border border-sage/25 hidden">
                      <div class="mx-auto w-14 h-14 rounded-2xl bg-sage text-primary-foreground flex items-center justify-center mb-6 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text w-6 h-6"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                      </div>
                      <p class="text-xs tracking-[0.3em] uppercase text-sage mb-3">gotowe</p>
                      <h1 class="font-serif text-3xl md:text-4xl mb-3">Anna Weronika Tomaszewska</h1>
                      <p class="text-sm text-muted-foreground mb-8 leading-relaxed">
                        Pełne CV, do pobrania w PDF.
                      </p>
                      <div class="flex flex-col gap-3">
                        <a
                          href="../assets/pdf/CV.pdf"
                          download="Anna-Tomaszewska-CV.pdf"
                          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> Pobierz CV (PDF)
                        </a>
                        <a
                          href="../assets/pdf/CV.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors"
                        >
                          Otwórz w nowej karcie
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              </main>
            """
            extra_script = """
              <script>
                const PASSWORD = "ilyilyily";
                document.getElementById('cv-form').addEventListener('submit', function(e) {
                  e.preventDefault();
                  const input = document.getElementById('cv-password').value;
                  if (input.trim().toLowerCase() === PASSWORD) {
                    document.getElementById('locked-card').classList.add('hidden');
                    document.getElementById('unlocked-card').classList.remove('hidden');
                  } else {
                    document.getElementById('error-msg').classList.remove('hidden');
                  }
                });
              </script>
            """
        elif route["path"] == "poradnik-wizytowka":
            route_body_markup = poradnik_body_markup
            extra_script = """
              <script>
                (function () {
                  var frames = document.querySelectorAll('#setup-cycle [data-setup]');
                  if (!frames.length) return;
                  var i = 0;
                  setInterval(function () {
                    frames[i].classList.remove('opacity-100');
                    frames[i].classList.add('opacity-0');
                    frames[i].setAttribute('aria-hidden', 'true');
                    i = (i + 1) % frames.length;
                    frames[i].classList.remove('opacity-0');
                    frames[i].classList.add('opacity-100');
                    frames[i].removeAttribute('aria-hidden');
                  }, 800);
                })();
              </script>
            """
        else:
            route_body_markup = main_body_markup
            extra_script = common_static_script

        sub_html = f"""<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{route['title']}</title>
    <meta name="description" content="Anna Weronika Tomaszewska — Official Portfolio" />
    {noindex_meta}
    <link rel="icon" href="../favicon.ico" type="image/x-icon" />
    <link rel="canonical" href="{route['canonical']}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Karla:wght@300;400;500;600&family=Montserrat:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap" />
    {css_rel}
  </head>
  <body>
    <div id="root">{route_body_markup}</div>
    {extra_script}
    {js_rel}
  </body>
</html>"""

        route_html_path.write_text(sub_html, encoding="utf-8")
        ok(f"Generated route HTML → dist-static/{route['path']}/index.html")

    # Redirect from old poradnik URL
    old_poradnik_dir = DIST_DIR / "poradnik-portfolio-aktorskie"
    ensure_dir(old_poradnik_dir)
    (old_poradnik_dir / "index.html").write_text(
        '<!DOCTYPE html><html lang="pl"><head>'
        '<meta charset="utf-8" />'
        '<meta http-equiv="refresh" content="0; url=../poradnik-wizytowka/" />'
        '<link rel="canonical" href="https://annatomaszewska.pl/poradnik-wizytowka" />'
        '<title>Przekierowanie…</title></head>'
        '<body><p><a href="../poradnik-wizytowka/">Przejdź do poradnika</a></p></body></html>\n',
        encoding="utf-8",
    )
    ok("Generated redirect → dist-static/poradnik-portfolio-aktorskie/index.html")

    # 3. Create double-clickable offline Windows launcher in dist-static/
    launcher_bat = DIST_DIR / "start_offline_site.bat"
    launcher_bat.write_text(
        '@echo off\n'
        'title Aniastrona - Local Offline Website\n'
        'echo ================================================\n'
        'echo   Aniastrona - Local Offline Website Launcher\n'
        'echo ================================================\n'
        'echo.\n'
        'echo Opening website in your default browser at http://localhost:3000 ...\n'
        'start http://localhost:3000\n'
        'echo Press Ctrl+C in this window to stop the server.\n'
        'echo.\n'
        'python -m http.server 3000 --directory "%~dp0" 2>nul || py -m http.server 3000 --directory "%~dp0"\n'
        'pause\n',
        encoding="utf-8",
    )
    ok("Generated double-clickable launcher → dist-static/start_offline_site.bat")



# ---------------------------------------------------------------------------
# Step 7 — Copy crawler / SEO files from public/
# ---------------------------------------------------------------------------

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
    print()
    print(f"{BOLD}{GREEN}  Preview server running at http://localhost:{port}{RESET}")
    print(f"  Press Ctrl+C to stop.\n")

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
        rewrite_asset_urls()
        generate_route_html_files()
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
