export type SiteContent = {
  name: string;
  shortName: string;
  footerBrand: string;
  nickname: string;
  roles: string[];
  tagline: string;
  birthYear: number;
  birthMonth: number;
  locations: string[];
  locationNote: string;
  contact: {
    email: string;
    phone: string;
    phoneHref: string;
    instagram: string;
    instagramUrl: string;
    facebookUrl: string;
  };
  languages: { name: string; level: string }[];
  siteUrl: string;
  footer: {
    creditLabel: string;
    creditUrl: string;
    creditName?: string;
    guideLabel?: string;
    guideHref?: string;
  };
};

export type GalleryItem = { src: string; alt: string; tall: boolean };

export type HomeContent = {
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  nav: {
    links: { href: string; label: string; route?: boolean }[];
    cvLabel: string;
  };
  hero: {
    kicker: string;
    firstName: string;
    lastName: string;
    bgText?: string;
    roles: string;
    cardKicker?: string;
    cardNote?: string;
    leadAfterAge: string;
    ctaPrimary: string;
    ctaSecondary: string;
    image: string;
    imageAlt: string;
  };
  about: {
    kicker: string;
    title: string;
    image: string;
    imageAlt: string;
    paragraphs: string[];
    quote: string;
  };
  whatIDo: {
    kicker: string;
    titleBefore: string;
    titleHighlight: string;
    titleAfter: string;
    items: { id: string; title: string; description: string; image?: string }[];
  };
  stats: { value: number; suffix: string; label: string; note: string }[];
  gallery: {
    kicker: string;
    title: string;
    lead: string;
    tabMe: string;
    tabWorks: string;
    me: GalleryItem[];
    works: GalleryItem[];
  };
  path: {
    kicker: string;
    title: string;
    items: { period: string; title: string; description: string; image?: string }[];
  };
  interests: {
    kicker: string;
    title: string;
    tags: string[];
    note: string;
    backgroundImage: string;
  };
  achievements: {
    kicker: string;
    title: string;
    featuredKicker: string;
    featuredTitle: string;
    featuredDescription: string;
    items: { icon: string; text: string; image?: string }[];
  };
  teamwork: {
    kicker: string;
    title: string;
    paragraphs: string[];
  };
  contact: {
    kicker: string;
    titleBefore: string;
    titleItalic: string;
    lead: string;
    footerLocations: string;
  };
  extra: ExtraBlock[];
};

export type CvContent = {
  seo: { title: string; description: string };
  navBack?: string;
  locked: {
    kicker: string;
    title: string;
    lead: string;
    placeholder: string;
    submit: string;
    loading: string;
    error: string;
  };
  unlocked: {
    kicker: string;
    title: string;
    lead: string;
    download: string;
    open: string;
    filename: string;
  };
  pdf: string;
};

export type ExtraBlockBody =
  | {
      _template: "heading";
      kicker: string;
      title: string;
      lead: string;
      image?: string;
      imageAlt?: string;
    }
  | { _template: "text"; body: string; image?: string; imageAlt?: string }
  | { _template: "image"; src: string; alt: string; caption: string }
  | {
      _template: "imageText";
      src: string;
      alt: string;
      title: string;
      body: string;
      imageSide: "left" | "right";
    }
  | { _template: "gallery"; title: string; images: { src: string; alt: string }[] }
  | { _template: "cards"; title: string; items: { title: string; text: string; image: string }[] }
  | { _template: "quote"; text: string; cite: string; image?: string }
  | { _template: "list"; title: string; items: string[]; image?: string }
  | {
      _template: "ctaBox";
      title: string;
      lead: string;
      buttonLabel: string;
      buttonHref: string;
      image?: string;
    };

export type ExtraBlock = ExtraBlockBody & {
  id: string;
  after?: string;
};

export type PoradnikInnerBlock =
  | {
      _template: "imagePair";
      cycleAlt: string;
      cycleCaption: string;
      cycleImages: string[];
      stillImage: string;
      stillAlt: string;
      stillCaption: string;
    }
  | {
      _template: "callout";
      icon: string;
      title: string;
      text: string;
      image?: string;
    }
  | {
      _template: "twoCol";
      leftTitle: string;
      leftText: string;
      rightTitle: string;
      rightText: string;
      leftImage?: string;
      rightImage?: string;
    }
  | { _template: "prose"; text: string }
  | { _template: "image"; src: string; alt: string; caption: string }
  | { _template: "gallery"; title: string; images: { src: string; alt: string }[] };

export type PoradnikBlock =
  | {
      _template: "hero";
      badge: string;
      title: string;
      lead: string;
      image?: string;
      imageAlt?: string;
    }
  | {
      _template: "introCards";
      cards: { id: string; title: string; text: string; image?: string }[];
    }
  | {
      _template: "richSection";
      numberLabel?: string;
      number: string;
      title: string;
      paragraphs: string[];
      image?: string;
      imageAlt?: string;
      inner?: PoradnikInnerBlock[];
    }
  | { _template: "checklist"; kicker?: string; title: string; items: string[]; image?: string; imageAlt?: string }
  | {
      _template: "cta";
      title: string;
      lead: string;
      primary: string;
      primaryHref?: string;
      secondary: string;
      secondaryHref?: string;
      image?: string;
      imageAlt?: string;
    }
  | ExtraBlockBody;

export type PoradnikContent = {
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  jsonLdHeadline: string;
  jsonLdDescription: string;
  navBack: string;
  navCvLabel?: string;
  blocks: PoradnikBlock[];
};

export type CustomPage = {
  slug: string;
  title: string;
  navLabel: string;
  navBack?: string;
  seo: { title: string; description: string };
  blocks: ExtraBlock[];
};
