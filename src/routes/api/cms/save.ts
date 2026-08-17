import { createFileRoute } from "@tanstack/react-router";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { hasValidSession } from "@/lib/cms/auth.server";
import { writeContentFile } from "@/lib/content/load.server";

const execFileAsync = promisify(execFile);

const FILES = {
  site: "content/site.json",
  home: "content/home.json",
  cv: "content/cv.json",
  poradnik: "content/poradnik-wizytowka.json",
} as const;

export const Route = createFileRoute("/api/cms/save")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!hasValidSession(request)) {
          return Response.json({ ok: false }, { status: 401 });
        }
        let body: { file?: unknown; data?: unknown };
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Niepoprawne JSON." }, { status: 400 });
        }
        const key = body.file;
        if (key !== "site" && key !== "home" && key !== "cv" && key !== "poradnik") {
          return Response.json({ ok: false, error: "Nieznany plik." }, { status: 400 });
        }
        if (body.data === null || typeof body.data !== "object") {
          return Response.json({ ok: false, error: "Brak danych." }, { status: 400 });
        }
        writeContentFile(FILES[key], body.data);

        let git: string | null = null;
        const cwd = process.env.CMS_ROOT || process.cwd();
        if (process.env.CMS_GIT_PUSH === "1") {
          try {
            await execFileAsync("git", ["add", "content", "public/uploads"], { cwd });
            await execFileAsync(
              "git",
              ["commit", "-m", "cms: aktualizacja treści"],
              { cwd },
            ).catch(() => undefined);
            await execFileAsync("git", ["push", "origin", "HEAD"], { cwd });
            git = "wypchnięte na main";
          } catch (error) {
            git = error instanceof Error ? error.message : "git nie powiódł się";
          }
        }

        return Response.json({ ok: true, git });
      },
    },
  },
});
