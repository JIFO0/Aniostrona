import { createFileRoute } from "@tanstack/react-router";
import { cmsConfigured, hasValidSession, makeSessionCookie, passwordOk } from "@/lib/cms/auth.server";

export const Route = createFileRoute("/api/cms/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!cmsConfigured()) {
          return Response.json(
            { ok: false, error: "CMS_PASSWORD ani CMS_ACCESS_KEY nie są ustawione na serwerze." },
            { status: 500 },
          );
        }
        let body: { password?: unknown };
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false }, { status: 400 });
        }
        const password = typeof body.password === "string" ? body.password : "";
        if (!passwordOk(password)) {
          return Response.json({ ok: false }, { status: 401 });
        }
        return Response.json(
          { ok: true },
          { headers: { "set-cookie": makeSessionCookie() } },
        );
      },
      GET: async ({ request }) => {
        return Response.json({ ok: hasValidSession(request), configured: cmsConfigured() });
      },
    },
  },
});
