import type { ReactNode } from "react";
import { RichText, resolveMedia, type ExtraBlock, type ExtraBlockBody } from "@/lib/content";

const wrap = "py-16 md:py-24";
const inner = "max-w-4xl mx-auto px-6";

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
  block: ExtraBlockBody & { id?: string };
  bare?: boolean;
}) {
  const id = "id" in block && typeof block.id === "string" ? block.id : undefined;
  const shell = (children: ReactNode, className = wrap) =>
    bare ? (
      <div id={id} className="space-y-4">
        {children}
      </div>
    ) : (
      <section id={id} className={className}>
        <div className={inner}>{children}</div>
      </section>
    );

  switch (block._template) {
    case "heading":
      return shell(
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <BlockImage src={block.image} alt={block.imageAlt} className="w-full rounded-3xl object-cover max-h-[28rem] mb-6" />
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
          <BlockImage src={block.image} alt={block.imageAlt} className="w-full rounded-2xl object-cover max-h-[32rem]" />
          <RichText
            text={block.body}
            className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-wrap"
          />
        </div>,
      );
    case "image":
      return shell(
        <figure className="space-y-3">
          <BlockImage src={block.src} alt={block.alt} className="w-full rounded-2xl object-cover max-h-[70vh]" />
          {block.caption ? (
            <figcaption>
              <RichText text={block.caption} className="text-sm text-muted-foreground text-center" />
            </figcaption>
          ) : null}
        </figure>,
      );
    case "imageText": {
      const image = <BlockImage src={block.src} alt={block.alt} className="w-full rounded-2xl object-cover aspect-[4/5]" />;
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
    case "quote":
      return shell(
        <blockquote className="soft-card rounded-3xl p-8 md:p-12 text-center space-y-4">
          <BlockImage src={block.image} className="w-full max-h-64 object-cover rounded-2xl mb-4" />
          <RichText text={block.text} className="font-serif italic text-xl md:text-2xl leading-relaxed" />
          {block.cite ? <p className="text-sm text-sage">{block.cite}</p> : null}
        </blockquote>,
      );
    case "list":
      return shell(
        <div className="space-y-6">
          <BlockImage src={block.image} className="w-full rounded-2xl object-cover max-h-80" />
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
          <BlockImage src={block.image} className="w-full max-h-72 object-cover rounded-2xl" />
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
    default:
      return null;
  }
}
