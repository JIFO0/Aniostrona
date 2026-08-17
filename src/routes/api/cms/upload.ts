import { createFileRoute } from "@tanstack/react-router";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { hasValidSession } from "@/lib/cms/auth.server";

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".avif"]);

export const Route = createFileRoute("/api/cms/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!hasValidSession(request)) {
          return Response.json({ ok: false }, { status: 401 });
        }
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File)) {
          return Response.json({ ok: false, error: "Brak pliku." }, { status: 400 });
        }
        const ext = extname(file.name).toLowerCase();
        if (!ALLOWED.has(ext)) {
          return Response.json({ ok: false, error: "Niedozwolony typ pliku." }, { status: 400 });
        }
        const safeBase = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
        const name = `${Date.now()}-${safeBase}`;
        const dir = join(process.env.CMS_ROOT || process.cwd(), "public", "uploads");
        await mkdir(dir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        if (buffer.byteLength > 8 * 1024 * 1024) {
          return Response.json({ ok: false, error: "Plik większy niż 8 MB." }, { status: 400 });
        }
        await writeFile(join(dir, name), buffer);
        return Response.json({ ok: true, url: `/uploads/${name}` });
      },
    },
  },
});
