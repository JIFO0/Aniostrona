import type { ReactNode } from "react";

const TOKEN =
  /==([^=]+)==|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;

function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(TOKEN.source, "g");

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }

    const [full, highlight, bold, italic, linkLabel, href] = match;
    const key = `${keyPrefix}-${match.index}`;

    if (highlight) {
      nodes.push(
        <span key={key} className="text-foreground bg-rose/50 px-1.5 rounded">
          {highlight}
        </span>,
      );
    } else if (bold) {
      nodes.push(
        <strong key={key} className="text-foreground font-medium">
          {bold}
        </strong>,
      );
    } else if (italic) {
      nodes.push(
        <em key={key} className="italic">
          {italic}
        </em>,
      );
    } else if (linkLabel && href) {
      const className =
        "text-foreground underline decoration-sage/50 underline-offset-2 hover:decoration-sage";
      nodes.push(
        <a
          key={key}
          href={href}
          {...(isInternalHref(href)
            ? {}
            : { target: "_blank", rel: "noopener noreferrer" })}
          className={className}
        >
          {linkLabel}
        </a>,
      );
    } else {
      nodes.push(full);
    }

    last = match.index + full.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function RichText({
  text,
  className,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "span" | "li" | "h4";
}) {
  return <Tag className={className}>{renderInline(text, Tag)}</Tag>;
}

export function stripRichText(text: string): string {
  return text
    .replace(/==([^=]+)==/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
}
