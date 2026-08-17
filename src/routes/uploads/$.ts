import { createFileRoute } from "@tanstack/react-router";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

export const Route = createFileRoute("/uploads/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const relative = String(params._splat || "").replace(/^\/+/, "");
        const root = resolve(process.env.CMS_ROOT || process.cwd(), "public", "uploads");
        const abs = resolve(root, relative);
        if (!abs.startsWith(root) || relative.includes("..")) {
          return new Response("Forbidden", { status: 403 });
        }
        try {
          const data = await readFile(abs);
          const type = MIME[extname(abs).toLowerCase()] ?? "application/octet-stream";
          return new Response(data, {
            headers: {
              "content-type": type,
              "cache-control": "public, max-age=86400",
            },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
