import type { CSSProperties, ReactNode } from "react";
import { RichText, resolveMedia, type BoxStyle, type ExtraBlock, type ExtraBlockBody } from "@/lib/content";

const wrap = "py-12 md:py-20";

function widthClass(width?: BoxStyle["width"]) {
  switch (width) {
    case "narrow":
      return "max-w-2xl mx-auto px-6";
    case "wide":
      return "max-w-6xl mx-auto px-6";
    case "full":
      return "max-w-full mx-auto px-6";
    case "normal":
    default:
      return "max-w-4xl mx-auto px-6";
  }
}

export function boxStyleClasses(s?: BoxStyle): { className: string; style?: CSSProperties; imgClass: string } {
  if (!s) return { className: "", imgClass: "max-h-[28rem]" };

  const bgMap: Record<NonNullable<BoxStyle["bg"]>, string> = {
    none: "",
    card: "soft-card",
    cream: "bg-cream/85",
    tint: "bg-primary/10",
    dark: "bg-ink text-cream",
    gradient: "bg-gradient-to-br from-sage/20 via-cream to-rose/20",
  };
  const borderMap: Record<NonNullable<BoxStyle["border"]>, string> = {
    none: "",
    subtle: "border border-border/70",
    accent: "border-2 border-primary/40",
  };
  const radiusMap: Record<NonNullable<BoxStyle["radius"]>, string> = {
    default: "rounded-3xl",
    none: "rounded-none",
    md: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-[2.25rem]",
  };
  const shadowMap: Record<NonNullable<BoxStyle["shadow"]>, string> = {
    none: "",
    soft: "shadow-lg",
    strong: "shadow-2xl",
  };
  const padMap: Record<NonNullable<BoxStyle["padding"]>, string> = {
    sm: "p-4 md:p-6",
    md: "p-6 md:p-10",
    lg: "p-8 md:p-14",
    xl: "p-10 md:p-16",
  };
  const alignMap: Record<NonNullable<BoxStyle["align"]>, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  const textMap: Record<NonNullable<BoxStyle["textSize"]>, string> = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };
  const imgMap: Record<NonNullable<BoxStyle["imageSize"]>, string> = {
    sm: "max-h-48",
    md: "max-h-[28rem]",
    lg: "max-h-[40rem]",
    full: "max-h-none",
  };

  const hasBox = Boolean((s.bg && s.bg !== "none") || (s.border && s.border !== "none") || s.customBg);
  const className = [
    s.bg ? bgMap[s.bg] : "",
    s.border ? borderMap[s.border] : "",
    s.radius ? radiusMap[s.radius] : hasBox ? "rounded-3xl" : "",
    s.shadow ? shadowMap[s.shadow] : "",
    s.padding ? padMap[s.padding] : hasBox ? "p-6 md:p-10" : "",
    s.align ? alignMap[s.align] : "",
    s.textSize ? textMap[s.textSize] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const style: CSSProperties = {};
  if (s.customBg) style.backgroundColor = s.customBg;
  if (s.customText) style.color = s.customText;

  return {
    className,
    style: Object.keys(style).length ? style : undefined,
    imgClass: s.imageSize ? imgMap[s.imageSize] : "max-h-[28rem]",
  };
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

export function BlockImage({
  src,
  alt,
  className = "w-full rounded-2xl object-cover",
  loading = "lazy",
  width,
  height,
}: {
  src?: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
  width?: number | string;
  height?: number | string;
}) {
  if (!src) return null;
  return (
    <img
      src={resolveMedia(src)}
      alt={alt || ""}
      className={className}
      loading={loading}
      decoding="async"
      width={width}
      height={height}
    />
  );
}

export function ExtraBlocks({
  blocks,
  after,
}: {
  blocks: ExtraBlock[] | undefined;
  after?: string;
}) {
  const items = (blocks ?? []).filter((block) => (block.after || "") === (after || ""));
  if (!items.length) return null;
  return (
    <>
      {items.map((block) => (
        <ExtraBlockView key={block.id} block={block} />
      ))}
    </>
  );
}

export function ExtraBlockView({
  block,
  bare = false,
}: {
  block: ExtraBlockBody & { id?: string; boxStyle?: BoxStyle };
  bare?: boolean;
}) {
  const id = "id" in block && typeof block.id === "string" ? block.id : undefined;
  const bs = boxStyleClasses(block.boxStyle);
  const innerClass = widthClass(block.boxStyle?.width);

  const shell = (children: ReactNode, className = wrap) =>
    bare ? (
      <div id={id} className={`space-y-4 ${bs.className}`} style={bs.style}>
        {children}
      </div>
    ) : (
      <section id={id} className={className}>
        <div className={innerClass}>
          <div className={bs.className} style={bs.style}>
            {children}
          </div>
        </div>
      </section>
    );

  switch (block._template) {
    case "heading":
      return shell(
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <BlockImage src={block.image} alt={block.imageAlt} className={`w-full rounded-3xl object-cover ${bs.imgClass} mb-6`} />
          {block.kicker ? (
            <p className="text-sm tracking-[0.25em] uppercase text-sage">{block.kicker}</p>
          ) : null}
          {block.title ? <h2 className="font-serif text-4xl md:text-5xl">{block.title}</h2> : null}
          {block.lead ? (
            <RichText text={block.lead} className="text-muted-foreground leading-relaxed" />
          ) : null}
        </div>,
      );
    case "text":
      return shell(
        <div className="space-y-6">
          <BlockImage src={block.image} alt={block.imageAlt} className={`w-full rounded-2xl object-cover ${bs.imgClass}`} />
          <RichText
            text={block.body}
            className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
          />
        </div>,
      );
    case "image":
      return shell(
        <figure className="space-y-3">
          <BlockImage src={block.src} alt={block.alt} className={`w-full rounded-2xl object-cover ${bs.imgClass}`} />
          {block.caption ? (
            <figcaption>
              <RichText text={block.caption} className="text-sm text-muted-foreground text-center" />
            </figcaption>
          ) : null}
        </figure>,
      );
    case "imageText": {
      const image = <BlockImage src={block.src} alt={block.alt} className={`w-full rounded-2xl object-cover aspect-[4/5] ${bs.imgClass}`} />;
      const copy = (
        <div className="space-y-4">
          {block.title ? <h2 className="font-serif text-3xl md:text-4xl">{block.title}</h2> : null}
          <RichText text={block.body} className="text-muted-foreground leading-relaxed" />
        </div>
      );
      return shell(
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {block.imageSide === "right" ? (
            <>
              {copy}
              {image}
            </>
          ) : (
            <>
              {image}
              {copy}
            </>
          )}
        </div>,
      );
    }
    case "twoCol":
      return shell(
        <div className="grid md:grid-cols-2 gap-6">
          <div className="soft-card rounded-2xl p-6 space-y-3">
            <BlockImage src={block.leftImage} className="w-full rounded-xl object-cover max-h-56" />
            {block.leftTitle ? <h3 className="font-serif text-2xl">{block.leftTitle}</h3> : null}
            <RichText text={block.leftText} className="text-muted-foreground leading-relaxed" />
          </div>
          <div className="soft-card rounded-2xl p-6 space-y-3">
            <BlockImage src={block.rightImage} className="w-full rounded-xl object-cover max-h-56" />
            {block.rightTitle ? <h3 className="font-serif text-2xl">{block.rightTitle}</h3> : null}
            <RichText text={block.rightText} className="text-muted-foreground leading-relaxed" />
          </div>
        </div>,
      );
    case "gallery":
      return shell(
        <div className="space-y-8">
          {block.title ? <h2 className="font-serif text-3xl md:text-4xl">{block.title}</h2> : null}
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {block.images
              .filter((img) => img.src)
              .map((img, i) => (
                <img
                  key={`${img.src}-${i}`}
                  src={resolveMedia(img.src)}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-xl break-inside-avoid"
                />
              ))}
          </div>
        </div>,
      );
    case "cards":
      return shell(
        <div className="space-y-8">
          {block.title ? <h2 className="font-serif text-3xl md:text-4xl">{block.title}</h2> : null}
          <div className="grid md:grid-cols-3 gap-6">
            {block.items.map((item, i) => (
              <div key={`${item.title}-${i}`} className="soft-card rounded-2xl p-6 space-y-3">
                <BlockImage src={item.image} className="w-full h-40 object-cover rounded-xl" />
                {item.title ? <h3 className="font-serif text-xl">{item.title}</h3> : null}
                <RichText text={item.text} className="text-sm text-muted-foreground leading-relaxed" />
              </div>
            ))}
          </div>
        </div>,
      );
    case "stats":
      return shell(
        <div className="space-y-8 text-center">
          {block.title ? <h2 className="font-serif text-3xl md:text-4xl">{block.title}</h2> : null}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {block.items.map((item, i) => (
              <div key={`${item.label}-${i}`} className="space-y-1.5">
                <div className="font-serif text-5xl md:text-6xl text-primary">{item.value}</div>
                <div className="text-lg font-serif font-medium">{item.label}</div>
                {item.note ? <p className="text-sm text-muted-foreground font-light">{item.note}</p> : null}
              </div>
            ))}
          </div>
        </div>,
      );
    case "callout":
      return shell(
        <aside className="border-l-2 border-primary/60 bg-primary/5 pl-6 py-5 pr-6 rounded-r-2xl space-y-2.5">
          {block.kicker ? (
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">{block.kicker}</p>
          ) : null}
          {block.title ? <h3 className="font-serif text-2xl">{block.title}</h3> : null}
          <RichText text={block.text} className="text-muted-foreground leading-relaxed" />
          <BlockImage src={block.image} className={`w-full rounded-xl object-cover ${bs.imgClass} mt-2`} />
        </aside>,
      );
    case "quote":
      return shell(
        <blockquote className="soft-card rounded-3xl p-8 md:p-12 text-center space-y-4">
          <BlockImage src={block.image} className={`w-full ${bs.imgClass} object-cover rounded-2xl mb-4`} />
          <RichText text={block.text} className="font-serif italic text-xl md:text-2xl leading-relaxed" />
          {block.cite ? <p className="text-sm text-sage">{block.cite}</p> : null}
        </blockquote>,
      );
    case "list":
      return shell(
        <div className="space-y-6">
          <BlockImage src={block.image} className={`w-full rounded-2xl object-cover ${bs.imgClass}`} />
          {block.title ? <h2 className="font-serif text-3xl">{block.title}</h2> : null}
          <ul className="space-y-3">
            {block.items.filter(Boolean).map((item, i) => (
              <li key={`${item}-${i}`} className="flex gap-3 items-start">
                <span className="mt-2 w-2 h-2 rounded-full bg-sage shrink-0" />
                <RichText as="span" text={item} className="text-muted-foreground leading-relaxed" />
              </li>
            ))}
          </ul>
        </div>,
      );
    case "ctaBox":
      return shell(
        <div className="rounded-3xl p-8 md:p-12 text-center bg-gradient-to-br from-sage/20 via-cream to-rose/20 border border-sage/30 space-y-5">
          <BlockImage src={block.image} className={`w-full ${bs.imgClass} object-cover rounded-2xl`} />
          {block.title ? <h2 className="font-serif text-3xl md:text-4xl">{block.title}</h2> : null}
          {block.lead ? (
            <RichText text={block.lead} className="text-muted-foreground max-w-xl mx-auto" />
          ) : null}
          {block.buttonLabel && block.buttonHref ? (
            <a
              href={block.buttonHref}
              className="inline-flex px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm"
            >
              {block.buttonLabel}
            </a>
          ) : null}
        </div>,
      );
    case "buttons":
      return shell(
        <div className="space-y-4">
          {block.title ? <h2 className="font-serif text-3xl">{block.title}</h2> : null}
          <div className="flex flex-wrap gap-3 justify-center">
            {block.items.map((btn, i) => (
              <a
                key={`${btn.label}-${i}`}
                href={btn.href || "#"}
                className={
                  btn.variant === "outline"
                    ? "inline-flex items-center px-6 py-3 rounded-full border border-border/80 bg-card/70 text-sm font-medium hover:bg-card transition-all"
                    : "inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
                }
              >
                {btn.label}
              </a>
            ))}
          </div>
        </div>,
      );
    case "video": {
      const embed = block.url ? toEmbedUrl(block.url) : null;
      return shell(
        <div className="space-y-4">
          {block.title ? <h2 className="font-serif text-3xl">{block.title}</h2> : null}
          {embed ? (
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border/50 shadow-md">
              <iframe
                src={embed}
                title={block.title || "Wideo"}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : block.url ? (
            <video src={block.url} controls className="w-full rounded-2xl border border-border/50 shadow-md" />
          ) : null}
          {block.caption ? (
            <RichText text={block.caption} className="text-sm text-muted-foreground text-center" />
          ) : null}
        </div>,
      );
    }
    case "spacer": {
      const h = block.height === "sm" ? "py-4" : block.height === "lg" ? "py-14" : "py-8";
      return (
        <div id={id} className={`${innerClass} ${h}`}>
          {block.showLine ? <div className="h-px w-full bg-border/60" /> : null}
        </div>
      );
    }
    default:
      return null;
  }
}
