import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ExtraBlockView } from "@/components/site/ExtraBlocks";
import { SiteStyleApplier } from "@/components/site/SiteStyleApplier";
import { readCustomPage, readSite } from "@/lib/content/load.server";

export const Route = createFileRoute("/s/$slug")({
  loader: ({ params }) => {
    const page = readCustomPage(params.slug);
    if (!page) throw notFound();
    return { page, site: readSite() };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { page, site } = loaderData;
    return {
      meta: [
        { title: page.seo.title || page.title },
        { name: "description", content: page.seo.description },
        { property: "og:title", content: page.seo.title || page.title },
        { property: "og:description", content: page.seo.description },
        { property: "og:url", content: `${site.siteUrl}/s/${page.slug}` },
      ],
    };
  },
  component: CustomPageView,
});

function CustomPageView() {
  const { page, site } = Route.useLoaderData();
  return (
    <main className="grain min-h-screen mesh-bg text-foreground">
      <SiteStyleApplier style={site.style} />
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-cream/60 border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif italic text-lg tracking-wide">
            {site.shortName}
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> {page.navBack ?? "strona główna"}
          </Link>
        </div>
      </nav>
      <article className="pt-24 pb-16">
        {page.blocks.map((block) => (
          <ExtraBlockView key={block.id} block={block} />
        ))}
      </article>
    </main>
  );
}
