import { createFileRoute } from "@tanstack/react-router";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { hasValidSession } from "@/lib/cms/auth.server";
import {
  contentRoot,
  deleteCustomPage,
  writeContentFile,
  writeCustomPage,
} from "@/lib/content/load.server";
import { isSafeSlug, type CustomPage } from "@/lib/content";

const execFileAsync = promisify(execFile);

const FILES = {
  site: "content/site.json",
  home: "content/home.json",
  cv: "content/cv.json",
  poradnik: "content/poradnik-wizytowka.json",
} as const;

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/cms/save")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!hasValidSession(request)) {
          return json({ ok: false }, 401);
        }
        let body: { file?: unknown; data?: unknown };
        try {
          body = await request.json();
        } catch {
          return json({ ok: false, error: "Niepoprawne JSON." }, 400);
        }
        const key = body.file;
        if (body.data === null || typeof body.data !== "object") {
          return json({ ok: false, error: "Brak danych." }, 400);
        }

        if (key === "page") {
          const page = body.data as CustomPage;
          if (!isSafeSlug(String(page.slug || ""))) {
            return json({ ok: false, error: "Niepoprawny adres nowej strony." }, 400);
          }
          writeCustomPage(page);
        } else if (key === "page-delete") {
          const slug = String((body.data as { slug?: unknown }).slug || "");
          if (!isSafeSlug(slug)) {
            return json({ ok: false, error: "Niepoprawny adres strony." }, 400);
          }
          deleteCustomPage(slug);
        } else if (key === "site" || key === "home" || key === "cv" || key === "poradnik") {
          writeContentFile(FILES[key], body.data);
        } else {
          return json({ ok: false, error: "Nieznany plik." }, 400);
        }

        let git: string | null = null;
        const cwd = contentRoot();
        if (process.env.CMS_GIT_PUSH === "1") {
          try {
            await execFileAsync("git", ["add", "content", "public/uploads"], { cwd });
            await execFileAsync("git", ["commit", "-m", "cms: aktualizacja treści"], { cwd }).catch(
              () => undefined,
            );
            await execFileAsync("git", ["push", "origin", "HEAD"], { cwd });
            git = "wypchnięte na main";
          } catch (error) {
            git = error instanceof Error ? error.message : "git nie powiódł się";
          }
        }

        return json({ ok: true, git });
      },
    },
  },
});
