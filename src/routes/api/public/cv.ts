import { createFileRoute } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "node:crypto";

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
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

        const { readCv } = await import("@/lib/content/load.server");
        const pdfPath = readCv().pdf;
        const filename = "Anna-Tomaszewska-CV.pdf";
        const headers = {
          "content-type": "application/pdf",
          "content-disposition": `attachment; filename="${filename}"`,
          "cache-control": "private, no-store",
        };

        if (pdfPath.startsWith("/uploads/")) {
          const { readFile } = await import("node:fs/promises");
          const { resolve } = await import("node:path");
          const root = process.env.CMS_ROOT || process.cwd();
          const abs = resolve(root, "public", pdfPath.replace(/^\/+/, ""));
          const data = await readFile(abs);
          return new Response(data, { status: 200, headers });
        }

        const { getCvAssetUrl } = await import("@/lib/cv-source.server");
        const source = pdfPath.startsWith("http")
          ? pdfPath
          : pdfPath.startsWith("/")
            ? new URL(pdfPath, request.url).toString()
            : getCvAssetUrl(request.url);
        const upstream = await fetch(source);
        if (!upstream.ok || !upstream.body) {
          return new Response("Upstream CV fetch failed", { status: 502 });
        }

        return new Response(upstream.body, { status: 200, headers });
      },
    },
  },
});
