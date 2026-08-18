import type {
  CustomPage,
  ExtraBlock,
  ExtraBlockBody,
  PoradnikBlock,
  PoradnikInnerBlock,
} from "./types";

export function newId(prefix = "b"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function moveItem<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const next = [...list];
  const j = index + dir;
  if (j < 0 || j >= next.length) return list;
  const swap = next[index];
  next[index] = next[j];
  next[j] = swap;
  return next;
}

export function slugify(input: string): string {
  const map: Record<string, string> = {
    "\u0105": "a",
    "\u0107": "c",
    "\u0119": "e",
    "\u0142": "l",
    "\u0144": "n",
    "\u00f3": "o",
    "\u015b": "s",
    "\u017a": "z",
    "\u017c": "z",
  };
  return input
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

const RESERVED_SLUGS = new Set([
  "cv",
  "edycja",
  "poradnik-wizytowka",
  "poradnik-portfolio-aktorskie",
  "s",
  "api",
  "uploads",
  "mcp",
]);

export function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 1 && slug.length <= 40 && !RESERVED_SLUGS.has(slug);
}

export const HOME_SLOTS = [
  { id: "hero", label: "po Hero" },
  { id: "o-mnie", label: "po O mnie" },
  { id: "czym", label: "po Czym się zajmuję" },
  { id: "stats", label: "po Liczbach" },
  { id: "galeria", label: "po Galerii" },
  { id: "sciezka", label: "po Ścieżce" },
  { id: "interests", label: "po Zainteresowaniach" },
  { id: "achievements", label: "po Osiągnięciach i zespole" },
  { id: "kontakt", label: "po Kontakcie (przed stopką)" },
] as const;

export type ExtraTemplate = ExtraBlockBody["_template"];

export const EXTRA_BLOCK_LABELS: Record<ExtraTemplate, string> = {
  heading: "Nagłówek",
  text: "Tekst",
  image: "Zdjęcie",
  imageText: "Zdjęcie + tekst",
  gallery: "Galeria",
  cards: "Karty",
  quote: "Cytat",
  list: "Lista",
  ctaBox: "Przycisk / CTA",
};

export function emptyExtraBody(template: ExtraTemplate): ExtraBlockBody {
  switch (template) {
    case "heading":
      return { _template: "heading", kicker: "", title: "Nowa sekcja", lead: "", image: "", imageAlt: "" };
    case "text":
      return { _template: "text", body: "", image: "", imageAlt: "" };
    case "image":
      return { _template: "image", src: "", alt: "", caption: "" };
    case "imageText":
      return { _template: "imageText", src: "", alt: "", title: "", body: "", imageSide: "left" };
    case "gallery":
      return { _template: "gallery", title: "", images: [{ src: "", alt: "" }] };
    case "cards":
      return { _template: "cards", title: "", items: [{ title: "", text: "", image: "" }] };
    case "quote":
      return { _template: "quote", text: "", cite: "", image: "" };
    case "list":
      return { _template: "list", title: "", items: [""], image: "" };
    case "ctaBox":
      return {
        _template: "ctaBox",
        title: "",
        lead: "",
        buttonLabel: "Napisz",
        buttonHref: "/#kontakt",
        image: "",
      };
  }
}

export function emptyExtraBlock(template: ExtraTemplate, after = "achievements"): ExtraBlock {
  return { id: newId("sekcja"), after, ...emptyExtraBody(template) };
}

export const PORADNIK_BLOCK_LABELS: Record<PoradnikBlock["_template"], string> = {
  hero: "Hero poradnika",
  introCards: "Trzy karty",
  richSection: "Sekcja z treścią",
  checklist: "Checklista",
  cta: "CTA poradnika",
  ...EXTRA_BLOCK_LABELS,
};

export function emptyPoradnikBlock(template: PoradnikBlock["_template"]): PoradnikBlock {
  switch (template) {
    case "hero":
      return { _template: "hero", badge: "Poradnik", title: "", lead: "", image: "", imageAlt: "" };
    case "introCards":
      return {
        _template: "introCards",
        cards: [
          { id: "a", title: "", text: "", image: "" },
          { id: "b", title: "", text: "", image: "" },
          { id: "c", title: "", text: "", image: "" },
        ],
      };
    case "richSection":
      return {
        _template: "richSection",
        number: "",
        title: "Nowa sekcja",
        paragraphs: [""],
        image: "",
        imageAlt: "",
        inner: [],
      };
    case "checklist":
      return { _template: "checklist", title: "", items: [""], image: "" };
    case "cta":
      return { _template: "cta", title: "", lead: "", primary: "Napisz", secondary: "CV", image: "" };
    default:
      return emptyExtraBody(template);
  }
}

export function emptyPoradnikInner(template: PoradnikInnerBlock["_template"]): PoradnikInnerBlock {
  switch (template) {
    case "imagePair":
      return {
        _template: "imagePair",
        cycleAlt: "",
        cycleCaption: "",
        cycleImages: [""],
        stillImage: "",
        stillAlt: "",
        stillCaption: "",
      };
    case "callout":
      return { _template: "callout", icon: "frame", title: "", text: "", image: "" };
    case "twoCol":
      return {
        _template: "twoCol",
        leftTitle: "",
        leftText: "",
        rightTitle: "",
        rightText: "",
        leftImage: "",
        rightImage: "",
      };
    case "prose":
      return { _template: "prose", text: "" };
    case "image":
      return { _template: "image", src: "", alt: "", caption: "" };
    case "gallery":
      return { _template: "gallery", title: "", images: [{ src: "", alt: "" }] };
  }
}

export const PORADNIK_INNER_LABELS: Record<PoradnikInnerBlock["_template"], string> = {
  imagePair: "Para zdjęć (setup / kadr)",
  callout: "Ramka",
  twoCol: "Dwie kolumny",
  prose: "Akapit",
  image: "Zdjęcie",
  gallery: "Galeria",
};

export function emptyCustomPage(title: string, slug: string): CustomPage {
  return {
    slug,
    title,
    navLabel: title,
    seo: { title, description: "" },
    blocks: [emptyExtraBlock("heading")],
  };
}
