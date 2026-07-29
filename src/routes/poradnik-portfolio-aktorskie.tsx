import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/poradnik-portfolio-aktorskie")({
  beforeLoad: () => {
    throw redirect({ to: "/poradnik-wizytowka" });
  },
  component: () => null,
});
