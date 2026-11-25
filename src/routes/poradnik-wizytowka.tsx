import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { SetupCycle } from "@/components/site/SetupCycle";
import { ExtraBlockView, BlockImage, boxStyleClasses } from "@/components/site/ExtraBlocks";
import { SiteStyleApplier } from "@/components/site/SiteStyleApplier";
import { readPoradnik, readSite } from "@/lib/content/load.server";
import {
  poradnikOgImage,
  resolveMedia,
  RichText,
  type PoradnikBlock,
  type PoradnikInnerBlock,
} from "@/lib/content";

export const Route = createFileRoute("/poradnik-wizytowka")({
  loader: () => ({ poradnik: readPoradnik(), site: readSite() }),
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
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
      <SiteStyleApplier style={site.style} />
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-cream/70 border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif italic text-lg tracking-wide">
            {site.shortName}
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/cv"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> {poradnik.navCvLabel ?? "CV"}
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

      <article className="pb-24 px-6 max-w-4xl mx-auto space-y-12 md:space-y-16">
        {poradnik.blocks.slice(1).map((block, index) => (
          <PoradnikBlockView key={`${block._template}-${index}`} block={block} />
        ))}
      </article>
    </main>
  );
}

function PoradnikBlockView({ block }: { block: PoradnikBlock }) {
  const bs = boxStyleClasses(block.boxStyle);
  const content = (() => {
    switch (block._template) {
    case "hero":
      return (
        <header className="pt-32 pb-12 md:pt-40 md:pb-16 px-6 max-w-3xl mx-auto text-center">
          {block.badge ? (
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-sans font-medium mb-4">
              {block.badge}
            </p>
          ) : null}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.18] text-foreground mb-6 font-normal tracking-tight">
            {block.title}
          </h1>
          <div className="w-12 h-px bg-sage/40 mx-auto mb-6" />
          <RichText
            text={block.lead}
            className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light"
          />
          {block.image && (
            <BlockImage
              src={block.image}
              alt={block.imageAlt}
              className="mt-10 w-full max-h-[28rem] object-cover rounded-2xl border border-sage/15 shadow-sm"
            />
          )}
        </header>
      );
    case "introCards":
      return (
        <div className="grid md:grid-cols-3 gap-5">
          {block.cards.map((card, i) => {
            const romanNumerals = ["I", "II", "III", "IV", "V", "VI"];
            const indexLabel = romanNumerals[i] ?? `0${i + 1}`;
            return (
              <div
                key={card.id}
                className="rounded-2xl p-6 bg-cream/75 border border-sage/20 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-3 text-sage/70 font-serif italic text-sm">
                    {indexLabel}
                  </div>
                  {card.image ? (
                    <BlockImage src={card.image} className="w-full h-36 object-cover rounded-xl mb-4" />
                  ) : null}
                  <h3 className="font-serif text-lg font-medium text-foreground mb-2">{card.title}</h3>
                  <RichText text={card.text} className="text-sm text-foreground/75 leading-relaxed font-light" />
                </div>
              </div>
            );
          })}
        </div>
      );
    case "richSection":
      return (
        <section className="rounded-3xl p-7 sm:p-10 md:p-12 bg-cream/70 border border-sage/20 space-y-6">
          {(block.number || block.title) && (
            <div className="border-b border-sage/15 pb-4">
              {block.number && (
                <span className="text-xs uppercase tracking-[0.25em] text-sage font-medium block mb-1">
                  {block.numberLabel === "" ? block.number : `${block.numberLabel ?? "Część"} ${block.number}`}
                </span>
              )}
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground leading-snug">
                {block.title}
              </h2>
            </div>
          )}
          {block.image && (
            <BlockImage src={block.image} alt={block.imageAlt} className="w-full rounded-2xl object-cover max-h-96" />
          )}
          <div className="space-y-4">
            {block.paragraphs.map((p, idx) => (
              <RichText
                key={idx}
                text={p}
                className="text-foreground/80 leading-relaxed text-base sm:text-lg font-light"
              />
            ))}
          </div>
          {(block.inner ?? []).map((inner, i) => (
            <InnerBlockView key={`${inner._template}-${i}`} block={inner} />
          ))}
        </section>
      );
    case "checklist":
      return (
        <section className="rounded-3xl p-7 sm:p-10 md:p-12 bg-cream/70 border border-sage/25 space-y-6">
          <div className="border-b border-sage/15 pb-4">
            {(block.kicker ?? "Podsumowanie") ? (
              <span className="text-xs uppercase tracking-[0.25em] text-sage font-medium block mb-1">
                {block.kicker ?? "Podsumowanie"}
              </span>
            ) : null}
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground leading-snug">
              {block.title}
            </h2>
          </div>
          {block.image && (
            <BlockImage src={block.image} alt={block.imageAlt} className="w-full rounded-2xl object-cover max-h-80" />
          )}
          <ol className="space-y-3 font-sans text-base">
            {block.items.map((item, index) => (
              <li
                key={item}
                className="flex items-start gap-3.5 bg-background/50 p-4 rounded-xl border border-sage/15"
              >
                <span className="font-serif text-xs font-medium text-sage/80 mt-0.5 w-6 shrink-0 tracking-wider">
                  0{index + 1}.
                </span>
                <span className="text-foreground/85 font-light leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        </section>
      );
    case "cta":
      return (
        <section className="rounded-3xl p-8 md:p-12 text-center bg-cream/70 border border-sage/20 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-foreground">
            {block.title}
          </h2>
          <RichText
            text={block.lead}
            className="text-foreground/80 text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed"
          />
          {block.image && (
            <BlockImage src={block.image} alt={block.imageAlt} className="w-full max-h-72 object-cover rounded-2xl" />
          )}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <a
              href={block.primaryHref || "/#kontakt"}
              className="px-7 py-3 rounded-full bg-sage text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
            >
              {block.primary}
            </a>
            <a
              href={block.secondaryHref || "/cv"}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-sage/30 text-sm font-medium tracking-wide text-foreground/85 hover:bg-sage/10 transition-colors"
            >
              <FileText className="w-4 h-4" /> {block.secondary}
            </a>
          </div>
        </section>
      );
    default:
      return <ExtraBlockView block={block} bare />;
    }
  })();

  if (!block.boxStyle) return content;
  return (
    <div className={bs.className} style={bs.style}>
      {content}
    </div>
  );
}

function InnerBlockView({ block }: { block: PoradnikInnerBlock }) {
  switch (block._template) {
    case "imagePair":
      return (
        <div className="grid md:grid-cols-2 gap-6 items-start pt-3">
          <figure className="space-y-2.5">
            <SetupCycle
              images={(block.cycleImages ?? []).map(resolveMedia)}
              alt={block.cycleAlt}
              className="aspect-[3/4] rounded-2xl shadow-sm border border-sage/15"
            />
            <figcaption className="text-xs text-foreground/70 text-center leading-relaxed px-2 font-light">
              {block.cycleCaption}
            </figcaption>
          </figure>
          <figure className="space-y-2.5">
            <div className="overflow-hidden rounded-2xl bg-cream/40 border border-sage/15 shadow-sm aspect-[3/4]">
              <img
                src={resolveMedia(block.stillImage)}
                alt={block.stillAlt}
                loading="lazy"
                decoding="async"
                width={600}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="text-xs text-foreground/70 text-center leading-relaxed px-2 font-light">
              <RichText text={block.stillCaption} />
            </figcaption>
          </figure>
        </div>
      );
    case "callout": {
      return (
        <aside className="border-l-2 border-sage/60 bg-sage/5 pl-5 sm:pl-6 py-4 pr-5 rounded-r-2xl my-4 space-y-2">
          {block.title ? (
            <h3 className="font-serif text-base sm:text-lg font-medium text-foreground">
              {block.title}
            </h3>
          ) : null}
          <RichText
            text={block.text}
            className="text-sm sm:text-base text-foreground/80 leading-relaxed font-light"
          />
          {block.image && (
            <BlockImage src={block.image} className="w-full rounded-xl object-cover max-h-56 mt-2" />
          )}
        </aside>
      );
    }
    case "twoCol":
      return (
        <div className="grid md:grid-cols-2 gap-5 pt-2">
          <div className="p-5 sm:p-6 rounded-2xl bg-cream/80 border border-sage/20 space-y-2.5">
            {block.leftImage && (
              <BlockImage src={block.leftImage} className="w-full rounded-xl object-cover max-h-48 mb-3" />
            )}
            <h4 className="font-serif text-lg font-medium text-foreground">{block.leftTitle}</h4>
            <RichText text={block.leftText} className="text-sm text-foreground/75 leading-relaxed font-light" />
          </div>
          <div className="p-5 sm:p-6 rounded-2xl bg-cream/80 border border-sage/20 space-y-2.5">
            {block.rightImage && (
              <BlockImage src={block.rightImage} className="w-full rounded-xl object-cover max-h-48 mb-3" />
            )}
            <h4 className="font-serif text-lg font-medium text-foreground">{block.rightTitle}</h4>
            <RichText text={block.rightText} className="text-sm text-foreground/75 leading-relaxed font-light" />
          </div>
        </div>
      );
    case "prose":
      return (
        <RichText
          text={block.text}
          className="text-foreground/80 leading-relaxed text-base sm:text-lg font-light pt-2"
        />
      );
    case "image":
    case "gallery":
      return <ExtraBlockView block={block} bare />;
    default:
      return null;
  }
}
