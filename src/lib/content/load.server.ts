import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import homeFallback from "../../../content/home.json";
import siteFallback from "../../../content/site.json";
import cvFallback from "../../../content/cv.json";
import poradnikFallback from "../../../content/poradnik-wizytowka.json";
import type { CustomPage, CvContent, HomeContent, PoradnikContent, SiteContent } from "./types";
import { isSafeSlug } from "./blocks";

export function contentRoot(): string {
  const configured = process.env.CMS_ROOT;
  if (configured && existsSync(configured)) return configured;
  return process.cwd();
}

function readJson<T>(relativePath: string, fallback: T): T {
  try {
    const raw = readFileSync(resolve(contentRoot(), relativePath), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readSite(): SiteContent {
  return readJson("content/site.json", siteFallback as SiteContent);
}

export function readHome(): HomeContent {
  const home = readJson("content/home.json", homeFallback as HomeContent);
  return { ...home, extra: Array.isArray(home.extra) ? home.extra : [] };
}

export function readCv(): CvContent {
  return readJson("content/cv.json", cvFallback as CvContent);
}

export function readPoradnik(): PoradnikContent {
  return readJson("content/poradnik-wizytowka.json", poradnikFallback as PoradnikContent);
}

const ALLOWED_FILES = new Set([
  "content/site.json",
  "content/home.json",
  "content/cv.json",
  "content/poradnik-wizytowka.json",
]);

export function writeContentFile(relativePath: string, data: unknown): void {
  if (!ALLOWED_FILES.has(relativePath)) {
    throw new Error("Niedozwolony plik treści.");
  }
  const abs = resolve(contentRoot(), relativePath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function pagesDir(): string {
  return resolve(contentRoot(), "content", "pages");
}

export function pageFile(slug: string): string {
  return `content/pages/${slug}.json`;
}

export function readCustomPage(slug: string): CustomPage | null {
  if (!isSafeSlug(slug)) return null;
  try {
    const raw = readFileSync(resolve(contentRoot(), pageFile(slug)), "utf8");
    const data = JSON.parse(raw) as CustomPage;
    return { ...data, blocks: Array.isArray(data.blocks) ? data.blocks : [] };
  } catch {
    return null;
  }
}

export function readCustomPages(): CustomPage[] {
  const dir = pagesDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => readCustomPage(name.replace(/\.json$/i, "")))
    .filter((page): page is CustomPage => Boolean(page));
}

export function writeCustomPage(page: CustomPage): void {
  if (!isSafeSlug(page.slug)) {
    throw new Error("Niepoprawny adres strony.");
  }
  const abs = resolve(contentRoot(), pageFile(page.slug));
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, `${JSON.stringify(page, null, 2)}\n`, "utf8");
}

export function deleteCustomPage(slug: string): void {
  if (!isSafeSlug(slug)) {
    throw new Error("Niepoprawny adres strony.");
  }
  const abs = resolve(contentRoot(), pageFile(slug));
  if (existsSync(abs)) unlinkSync(abs);
}
