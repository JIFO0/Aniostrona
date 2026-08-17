import { createFileRoute } from "@tanstack/react-router";
import { clearSessionCookie } from "@/lib/cms/auth.server";

export const Route = createFileRoute("/api/cms/logout")({
  server: {
    handlers: {
      POST: async () =>
        Response.json({ ok: true }, { headers: { "set-cookie": clearSessionCookie() } }),
    },
  },
});
