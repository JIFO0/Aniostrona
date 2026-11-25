export type SiteStyleConfig = {
  themeId?: string;
  fontId?: string;
  fontSizeScale?: "sm" | "md" | "lg" | "xl";
  headingScale?: "compact" | "normal" | "large" | "editorial";
  radius?: "sharp" | "subtle" | "rounded" | "smooth";
  cardStyle?: "soft" | "glass" | "bordered" | "solid";
  photoFilter?: "normal" | "warm-cinema" | "noir" | "vintage" | "vivid" | "soft-glow";
  showGrain?: boolean;
  heroImageHeight?: "compact" | "normal" | "tall" | "monumental";
  sectionSpacing?: "compact" | "normal" | "airy";
  galleryColumns?: 2 | 3 | 4;
  primaryColor?: string;
  backgroundColor?: string;
  cardColor?: string;
  textColor?: string;
  accentColor?: string;
  customCss?: string;
};

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
  style?: SiteStyleConfig;
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
  hiddenSections?: string[];
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

export type BoxStyle = {
  bg?: "none" | "cream" | "card" | "tint" | "dark" | "gradient";
  customBg?: string;
  customText?: string;
  border?: "none" | "subtle" | "accent";
  radius?: "default" | "none" | "md" | "2xl" | "full";
  shadow?: "none" | "soft" | "strong";
  padding?: "sm" | "md" | "lg" | "xl";
  width?: "narrow" | "normal" | "wide" | "full";
  align?: "left" | "center" | "right";
  textSize?: "sm" | "base" | "lg" | "xl";
  imageSize?: "sm" | "md" | "lg" | "full";
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
    }
  | {
      _template: "twoCol";
      leftTitle: string;
      leftText: string;
      leftImage?: string;
      rightTitle: string;
      rightText: string;
      rightImage?: string;
    }
  | {
      _template: "stats";
      title: string;
      items: { value: string; label: string; note: string }[];
    }
  | {
      _template: "callout";
      kicker: string;
      title: string;
      text: string;
      image?: string;
    }
  | {
      _template: "buttons";
      title: string;
      items: { label: string; href: string; variant: "primary" | "outline" }[];
    }
  | {
      _template: "spacer";
      height: "sm" | "md" | "lg";
      showLine: boolean;
    }
  | {
      _template: "video";
      title: string;
      url: string;
      caption: string;
    };

export type ExtraBlock = ExtraBlockBody & {
  id: string;
  after?: string;
  boxStyle?: BoxStyle;
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

export type PoradnikBlock = (
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
  | ExtraBlockBody
) & { boxStyle?: BoxStyle };

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
