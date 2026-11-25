import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "ania_cms";

function secret(): string {
  return process.env.CMS_SECRET || process.env.CMS_PASSWORD || process.env.CMS_ACCESS_KEY || "";
}

function expectedKeys(): string[] {
  return [process.env.CMS_PASSWORD, process.env.CMS_ACCESS_KEY]
    .map((value) => (value || "").trim())
    .filter(Boolean);
}

function hmac(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = createHash("sha256").update(a, "utf8").digest();
  const right = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(left, right);
}

export function cmsConfigured(): boolean {
  return expectedKeys().length > 0;
}

export function passwordOk(input: string): boolean {
  const keys = expectedKeys();
  if (!keys.length) return false;
  const candidate = input.trim();
  let matched = false;
  for (const key of keys) {
    if (safeEqual(candidate, key)) matched = true;
  }
  return matched;
}

export function makeSessionCookie(): string {
  const token = hmac("session-v1");
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secure}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function hasValidSession(request: Request): boolean {
  if (!cmsConfigured()) return false;
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  const token = match?.[1];
  if (!token) return false;
  return safeEqual(token, hmac("session-v1"));
}
