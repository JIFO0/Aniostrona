import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clapperboard,
  FileText,
  Frame,
  Lightbulb,
  MapPin,
  Mic2,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SetupCycle } from "@/components/site/SetupCycle";
import { ExtraBlockView, BlockImage } from "@/components/site/ExtraBlocks";
import { readPoradnik, readSite } from "@/lib/content/load.server";
import {
  poradnikOgImage,
  resolveMedia,
  RichText,
  type PoradnikBlock,
  type PoradnikInnerBlock,
} from "@/lib/content";

const INTRO_ICONS: Record<string, LucideIcon> = {
  place: MapPin,
  who: Users,
  what: Clapperboard,
};

const CALLOUT_ICONS: Record<string, LucideIcon> = {
  frame: Frame,
  mic: Mic2,
};

export const Route = createFileRoute("/poradnik-wizytowka")({
  loader: () => ({ poradnik: readPoradnik(), site: readSite() }),
  head: ({ loaderData }) => {
    const { poradnik, site } = loaderData;
    const still = poradnik.blocks
      .flatMap((b) => (b._template === "richSection" ? b.inner ?? [] : []))
      .find((b) => b._template === "imagePair");
    const ogImage =
      (still && still._template === "imagePair" ? resolveMedia(still.stillImage) : "") ||
      poradnikOgImage;
    return {
      meta: [
        { title: poradnik.seo.title },
        { name: "description", content: poradnik.seo.description },
        { property: "og:title", content: poradnik.seo.ogTitle },
        { property: "og:description", content: poradnik.seo.ogDescription },
        { property: "og:url", content: `${site.siteUrl}/poradnik-wizytowka` },
        { property: "og:type", content: "article" },
        { property: "og:image", content: ogImage },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `${site.siteUrl}/poradnik-wizytowka` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: poradnik.jsonLdHeadline,
            description: poradnik.jsonLdDescription,
            author: {
              "@type": "Person",
              name: site.name,
              url: `${site.siteUrl}/`,
            },
            publisher: { "@type": "Person", name: site.name },
            mainEntityOfPage: `${site.siteUrl}/poradnik-wizytowka`,
            inLanguage: "pl-PL",
          }),
        },
      ],
    };
  },
  component: PoradnikWizytowkaPage,
});

function PoradnikWizytowkaPage() {
  const { poradnik, site } = Route.useLoaderData();

  return (
    <main className="grain min-h-screen mesh-bg flex flex-col text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-cream/60 border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif italic text-lg tracking-wide">
            {site.shortName}
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/cv"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> CV
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> {poradnik.navBack}
            </Link>
          </div>
        </div>
      </nav>

      {poradnik.blocks[0] ? <PoradnikBlockView block={poradnik.blocks[0]} /> : null}

      <article className="pb-24 px-6 max-w-4xl mx-auto space-y-16">
        {poradnik.blocks.slice(1).map((block, index) => (
          <PoradnikBlockView key={`${block._template}-${index}`} block={block} />
        ))}
      </article>
    </main>
  );
}

function PoradnikBlockView({ block }: { block: PoradnikBlock }) {
  switch (block._template) {
    case "hero":
      return (
        <header className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/10 border border-sage/30 text-sage text-xs tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" /> {block.badge}
          </div>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">{block.title}</h1>
          <RichText
            text={block.lead}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          />
          <BlockImage
            src={block.image}
            alt={block.imageAlt}
            className="mt-10 w-full max-h-[28rem] object-cover rounded-3xl"
          />
        </header>
      );
    case "introCards":
      return (
          <div className="grid md:grid-cols-3 gap-6">
            {block.cards.map((card, i) => {
              const Icon = INTRO_ICONS[card.id] ?? Sparkles;
              const tint =
                i === 1
                  ? "from-cream via-sage/15 to-cream"
                  : "from-cream via-rose/20 to-cream";
              return (
                <div
                  key={card.id}
                  className={`soft-card rounded-2xl p-6 bg-gradient-to-br ${tint} border border-sage/20`}
                >
                  {card.image ? (
                    <BlockImage src={card.image} className="w-full h-36 object-cover rounded-xl mb-4" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-sage/15 text-sage flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                  )}
                  <h3 className="font-serif text-lg font-medium mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
                </div>
              );
            })}
          </div>
      );
    case "richSection":
      return (
        <section className="soft-card rounded-3xl p-8 md:p-12 bg-cream/70 border border-sage/20 space-y-6">
            {(block.number || block.title) && (
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
                {block.number ? (
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sage text-primary-foreground text-sm font-sans font-semibold">
                    {block.number}
                  </span>
                ) : null}
                {block.title}
              </h2>
            )}
            <BlockImage src={block.image} alt={block.imageAlt} className="w-full rounded-2xl object-cover max-h-96" />
            {block.paragraphs.map((p) => (
              <RichText
                key={p}
                text={p}
                className="text-muted-foreground leading-relaxed text-base md:text-lg"
              />
            ))}
            {(block.inner ?? []).map((inner, i) => (
              <InnerBlockView key={`${inner._template}-${i}`} block={inner} />
            ))}
        </section>
      );
    case "checklist":
      return (
        <section className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-rose/30 via-cream to-sage/25 border border-sage/30 space-y-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-sage" />
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground">
                {block.title}
              </h2>
            </div>
            <BlockImage src={block.image} className="w-full rounded-2xl object-cover max-h-80" />
            <div className="space-y-3 font-sans text-base">
              {block.items.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-cream/80 p-3.5 rounded-xl border border-sage/20"
                >
                  <CheckCircle2 className="w-5 h-5 text-sage shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </div>
              ))}
            </div>
        </section>
      );
    case "cta":
      return (
        <div className="rounded-3xl p-8 md:p-12 text-center bg-gradient-to-br from-sage/20 via-cream to-rose/20 border border-sage/30 space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl">{block.title}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">{block.lead}</p>
            <BlockImage src={block.image} className="w-full max-h-72 object-cover rounded-2xl" />
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a
                href="/#kontakt"
                className="px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]"
              >
                {block.primary}
              </a>
              <Link
                to="/cv"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors"
              >
                <FileText className="w-4 h-4" /> {block.secondary}
              </Link>
            </div>
        </div>
      );
    default:
      return <ExtraBlockView block={block} bare />;
  }
}

function InnerBlockView({ block }: { block: PoradnikInnerBlock }) {
  switch (block._template) {
    case "imagePair":
      return (
        <div className="grid md:grid-cols-2 gap-6 items-start pt-2">
          <div className="space-y-3">
            <SetupCycle
              images={block.cycleImages.map(resolveMedia)}
              alt={block.cycleAlt}
              className="aspect-[3/4] shadow-sm border border-sage/15"
            />
            <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">
              {block.cycleCaption}
            </p>
          </div>
          <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl bg-cream/40 border border-sage/15 shadow-sm aspect-[3/4]">
              <img
                src={resolveMedia(block.stillImage)}
                alt={block.stillAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <RichText
              text={block.stillCaption}
              className="text-xs text-muted-foreground text-center leading-relaxed px-2"
            />
          </div>
        </div>
      );
    case "callout": {
      const Icon = CALLOUT_ICONS[block.icon] ?? Frame;
      const isMic = block.icon === "mic";
      return (
        <div
          className={`flex gap-4 p-5 rounded-2xl border ${isMic ? "bg-background/40 border-border/40" : "bg-sage/10 border-sage/25"}`}
        >
          <Icon className="w-6 h-6 text-sage shrink-0 mt-0.5" />
          <div className="space-y-2">
            {block.title ? (
              <h3 className="font-serif text-lg font-medium text-foreground">{block.title}</h3>
            ) : null}
            <RichText
              text={block.text}
              className="text-sm text-muted-foreground leading-relaxed"
            />
            <BlockImage src={block.image} className="w-full rounded-xl object-cover max-h-56" />
          </div>
        </div>
      );
    }
    case "twoCol":
      return (
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-background/50 border border-border/50 space-y-3">
            <BlockImage src={block.leftImage} className="w-full rounded-lg object-cover max-h-48" />
            <h4 className="font-serif font-medium text-foreground mb-1">{block.leftTitle}</h4>
            <p className="text-sm text-muted-foreground">{block.leftText}</p>
          </div>
          <div className="p-4 rounded-xl bg-background/50 border border-border/50 space-y-3">
            <BlockImage src={block.rightImage} className="w-full rounded-lg object-cover max-h-48" />
            <h4 className="font-serif font-medium text-foreground mb-1">{block.rightTitle}</h4>
            <p className="text-sm text-muted-foreground">{block.rightText}</p>
          </div>
        </div>
      );
    case "prose":
      return (
        <RichText
          text={block.text}
          className="text-muted-foreground leading-relaxed text-base md:text-lg"
        />
      );
    case "image":
    case "gallery":
      return <ExtraBlockView block={block} bare />;
    default:
      return null;
  }
}
