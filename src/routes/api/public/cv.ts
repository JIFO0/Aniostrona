import { createFileRoute } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "node:crypto";
import cvAsset from "@/assets/cv.pdf.asset.json";

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function resolveCvUrl(request: Request): Promise<string> {
  // In dev/prod, cvAsset.url is a relative Lovable CDN path served from same origin.
  const url = new URL(cvAsset.url, request.url);
  return url.toString();
}

export const Route = createFileRoute("/api/public/cv")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.CV_PASSWORD;
        if (!expected) {
          return new Response("CV_PASSWORD not configured", { status: 500 });
        }

        let body: { password?: unknown };
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid body", { status: 400 });
        }

        const provided = typeof body.password === "string" ? body.password.trim().toLowerCase() : "";
        if (!provided || !passwordMatches(provided, expected)) {
          return new Response(JSON.stringify({ ok: false }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        const upstream = await fetch(await resolveCvUrl(request));
        if (!upstream.ok || !upstream.body) {
          return new Response("Upstream CV fetch failed", { status: 502 });
        }

        return new Response(upstream.body, {
          status: 200,
          headers: {
            "content-type": "application/pdf",
            "content-disposition": 'attachment; filename="Anna-Tomaszewska-CV.pdf"',
            "cache-control": "private, no-store",
          },
        });
      },
    },
  },
});
