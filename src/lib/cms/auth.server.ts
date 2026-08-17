import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "ania_cms";

function secret(): string {
  return process.env.CMS_SECRET || process.env.CMS_PASSWORD || "";
}

function expectedPassword(): string {
  return process.env.CMS_PASSWORD || "";
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
  return Boolean(expectedPassword());
}

export function passwordOk(input: string): boolean {
  const expected = expectedPassword();
  if (!expected) return false;
  return safeEqual(input.trim(), expected.trim());
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
  if (!expectedPassword()) return false;
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  const token = match?.[1];
  if (!token) return false;
  return safeEqual(token, hmac("session-v1"));
}
