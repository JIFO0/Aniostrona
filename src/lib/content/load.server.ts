import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import homeFallback from "../../../content/home.json";
import siteFallback from "../../../content/site.json";
import cvFallback from "../../../content/cv.json";
import poradnikFallback from "../../../content/poradnik-wizytowka.json";
import type { CvContent, HomeContent, PoradnikContent, SiteContent } from "./types";

function contentRoot(): string {
  return process.env.CMS_ROOT || process.cwd();
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
  return readJson("content/home.json", homeFallback as HomeContent);
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
