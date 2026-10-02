export type ThemeId =
  | "sage-default"
  | "cinematic-noir"
  | "velvet-theatre"
  | "vogue-editorial"
  | "royal-emerald"
  | "midnight-ocean"
  | "golden-hour"
  | "modern-arthouse"
  | "ethereal-alabaster"
  | "film-35mm";

export type FontId =
  | "lora-karla"
  | "playfair-inter"
  | "cormorant-jakarta"
  | "cinzel-outfit"
  | "syne-space"
  | "bodoni-dmsans"
  | "newsreader-worksans"
  | "italiana-montserrat";

export type HeroLayoutMode = "monumental" | "vogue" | "center" | "split";
export type PhotoFilter = "normal" | "warm-cinema" | "noir" | "vintage" | "vivid" | "soft-glow";
export type CardStyle = "soft" | "glass" | "bordered" | "solid";
export type RadiusOption = "sharp" | "subtle" | "rounded" | "smooth";
export type HeroScale = "default" | "large" | "monumental";

// Section-specific layout types
export type AboutLayoutMode = "editorial-split" | "magazine-story" | "quote-spotlight" | "floating-card";
export type WhatIDoLayoutMode = "grid-4" | "interactive-tabs" | "accordion-list" | "bento-editorial";
export type GalleryLayoutMode = "masonry" | "grid-clean" | "film-strip" | "editorial-showcase";
export type GalleryHoverEffect = "zoom" | "overlay" | "bw-to-color";
export type InterestsLayoutMode = "floating-bubbles" | "editorial-marquee" | "visual-grid";
export type PathLayoutMode = "timeline-vertical" | "cards-alternating" | "clean-list";
export type AchievementsLayoutMode = "split-featured" | "cards-row" | "editorial-badge-list";
export type ContactLayoutMode = "centered-minimal" | "split-card" | "direct-action";

export interface ColorTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  ring: string;
  rose: string;
  sage: string;
  cream: string;
  clay: string;
  ink: string;
  meshBg: string;
  bodyColor: string;
  isDark: boolean;
}

export interface ThemePreset {
  id: ThemeId;
  name: string;
  tagline: string;
  category: "Klasyka" | "Kino & Scena" | "Magazyn & Sztuka";
  swatches: [string, string, string, string]; // 4 key visual colors for preview
  colors: ColorTokens;
}

export interface FontPairing {
  id: FontId;
  name: string;
  subtitle: string;
  serif: string;
  sans: string;
  display: string;
  headingTracking?: string;
}

export interface StudioConfig {
  themeId: ThemeId;
  fontId: FontId;
  heroLayout: HeroLayoutMode;
  photoFilter: PhotoFilter;
  cardStyle: CardStyle;
  radius: RadiusOption;
  heroScale: HeroScale;
  showGrain: boolean;
  showGlow: boolean;
  heroBacklight: boolean;

  // Section Layouts
  aboutLayout: AboutLayoutMode;
  whatIDoLayout: WhatIDoLayoutMode;
  galleryLayout: GalleryLayoutMode;
  galleryHover: GalleryHoverEffect;
  interestsLayout: InterestsLayoutMode;
  pathLayout: PathLayoutMode;
  achievementsLayout: AchievementsLayoutMode;
  contactLayout: ContactLayoutMode;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "sage-default",
    name: "Ciepła Szałwia & Piasek",
    tagline: "Oryginalna estetyka, ciepłe barwy ziemi i naturalna elegancja",
    category: "Klasyka",
    swatches: ["#4a675a", "#efe9df", "#e6cfc2", "#34302e"],
    colors: {
      background: "oklch(0.975 0.008 70)",
      foreground: "oklch(0.34 0.008 40)",
      card: "oklch(0.99 0.006 70)",
      cardForeground: "oklch(0.24 0.02 40)",
      primary: "oklch(0.42 0.04 155)",
      primaryForeground: "oklch(0.98 0.006 70)",
      secondary: "oklch(0.92 0.03 20)",
      secondaryForeground: "oklch(0.28 0.03 40)",
      muted: "oklch(0.94 0.012 60)",
      mutedForeground: "oklch(0.48 0.02 40)",
      accent: "oklch(0.88 0.05 15)",
      accentForeground: "oklch(0.28 0.03 40)",
      border: "oklch(0.88 0.02 40)",
      ring: "oklch(0.7 0.04 20)",
      rose: "oklch(0.88 0.05 15)",
      sage: "oklch(0.42 0.04 155)",
      cream: "oklch(0.975 0.008 70)",
      clay: "oklch(0.55 0.16 42)",
      ink: "oklch(0.2 0.03 40)",
      meshBg: `radial-gradient(at 12% 18%, oklch(0.92 0.06 15 / 0.55) 0px, transparent 45%),
               radial-gradient(at 88% 12%, oklch(0.95 0.03 70 / 0.7) 0px, transparent 50%),
               radial-gradient(at 70% 90%, oklch(0.85 0.04 155 / 0.28) 0px, transparent 55%),
               radial-gradient(at 20% 85%, oklch(0.9 0.05 25 / 0.4) 0px, transparent 50%),
               oklch(0.975 0.008 70)`,
      bodyColor: "rgb(65 60 59)",
      isDark: false,
    },
  },
  {
    id: "cinematic-noir",
    name: "Kino Noir & Szampańskie Złoto",
    tagline: "Głęboka czerń sceny, ciepły reflektor i złoty blask festiwalu filmowego",
    category: "Kino & Scena",
    swatches: ["#d8b15d", "#121215", "#24242c", "#f3eee3"],
    colors: {
      background: "oklch(0.13 0.015 260)",
      foreground: "oklch(0.92 0.02 85)",
      card: "oklch(0.18 0.02 260)",
      cardForeground: "oklch(0.96 0.01 85)",
      primary: "oklch(0.78 0.12 80)",
      primaryForeground: "oklch(0.12 0.02 260)",
      secondary: "oklch(0.24 0.025 260)",
      secondaryForeground: "oklch(0.92 0.02 85)",
      muted: "oklch(0.22 0.015 260)",
      mutedForeground: "oklch(0.68 0.02 85)",
      accent: "oklch(0.78 0.12 80)",
      accentForeground: "oklch(0.12 0.02 260)",
      border: "oklch(0.28 0.02 260)",
      ring: "oklch(0.78 0.12 80)",
      rose: "oklch(0.32 0.04 40)",
      sage: "oklch(0.78 0.12 80)",
      cream: "oklch(0.15 0.015 260)",
      clay: "oklch(0.68 0.14 65)",
      ink: "oklch(0.96 0.01 85)",
      meshBg: `radial-gradient(at 15% 15%, oklch(0.32 0.08 75 / 0.45) 0px, transparent 50%),
               radial-gradient(at 85% 20%, oklch(0.25 0.05 280 / 0.5) 0px, transparent 55%),
               radial-gradient(at 65% 85%, oklch(0.3 0.08 60 / 0.3) 0px, transparent 50%),
               oklch(0.13 0.015 260)`,
      bodyColor: "oklch(0.9 0.015 85)",
      isDark: true,
    },
  },
  {
    id: "velvet-theatre",
    name: "Aksamitny Teatr & Burgund",
    tagline: "Głęboki bordeaux, rubinowy welur i nastrojowy dramatyzm teatralny",
    category: "Kino & Scena",
    swatches: ["#9b2c48", "#1c0b12", "#3a1420", "#f8edf1"],
    colors: {
      background: "oklch(0.15 0.035 15)",
      foreground: "oklch(0.93 0.02 25)",
      card: "oklch(0.22 0.045 15)",
      cardForeground: "oklch(0.97 0.01 25)",
      primary: "oklch(0.62 0.19 18)",
      primaryForeground: "oklch(0.98 0.01 25)",
      secondary: "oklch(0.28 0.05 15)",
      secondaryForeground: "oklch(0.94 0.02 25)",
      muted: "oklch(0.25 0.03 15)",
      mutedForeground: "oklch(0.72 0.03 25)",
      accent: "oklch(0.75 0.15 25)",
      accentForeground: "oklch(0.14 0.03 15)",
      border: "oklch(0.32 0.05 15)",
      ring: "oklch(0.65 0.18 20)",
      rose: "oklch(0.32 0.06 18)",
      sage: "oklch(0.72 0.14 25)",
      cream: "oklch(0.17 0.035 15)",
      clay: "oklch(0.58 0.18 25)",
      ink: "oklch(0.97 0.01 25)",
      meshBg: `radial-gradient(at 10% 20%, oklch(0.35 0.12 18 / 0.6) 0px, transparent 50%),
               radial-gradient(at 90% 15%, oklch(0.28 0.08 340 / 0.5) 0px, transparent 55%),
               radial-gradient(at 50% 90%, oklch(0.38 0.14 25 / 0.4) 0px, transparent 60%),
               oklch(0.15 0.035 15)`,
      bodyColor: "oklch(0.91 0.02 25)",
      isDark: true,
    },
  },
  {
    id: "vogue-editorial",
    name: "Editorial Vogue & Węgiel",
    tagline: "Minimalistyczny beż papieru modowego, mocna typografia i surowy styl",
    category: "Magazyn & Sztuka",
    swatches: ["#1e1e1e", "#f5f3ec", "#e3ded2", "#998f82"],
    colors: {
      background: "oklch(0.965 0.008 85)",
      foreground: "oklch(0.18 0.005 50)",
      card: "oklch(0.99 0.004 85)",
      cardForeground: "oklch(0.15 0.005 50)",
      primary: "oklch(0.2 0.005 50)",
      primaryForeground: "oklch(0.98 0.004 85)",
      secondary: "oklch(0.9 0.012 85)",
      secondaryForeground: "oklch(0.2 0.005 50)",
      muted: "oklch(0.92 0.008 85)",
      mutedForeground: "oklch(0.44 0.01 50)",
      accent: "oklch(0.48 0.03 60)",
      accentForeground: "oklch(0.98 0.004 85)",
      border: "oklch(0.85 0.012 85)",
      ring: "oklch(0.3 0.01 50)",
      rose: "oklch(0.9 0.012 85)",
      sage: "oklch(0.28 0.015 60)",
      cream: "oklch(0.965 0.008 85)",
      clay: "oklch(0.42 0.03 50)",
      ink: "oklch(0.15 0.005 50)",
      meshBg: `radial-gradient(at 15% 15%, oklch(0.92 0.015 85 / 0.8) 0px, transparent 50%),
               radial-gradient(at 85% 85%, oklch(0.9 0.02 75 / 0.6) 0px, transparent 60%),
               oklch(0.965 0.008 85)`,
      bodyColor: "oklch(0.25 0.008 50)",
      isDark: false,
    },
  },
  {
    id: "royal-emerald",
    name: "Królewski Szmaragd & Złoto",
    tagline: "Głęboka butelkowa zieleń, patynowane złoto i szlachetna perła",
    category: "Klasyka",
    swatches: ["#12362b", "#d1a85b", "#1e4d3f", "#f4f1e8"],
    colors: {
      background: "oklch(0.16 0.04 165)",
      foreground: "oklch(0.94 0.02 85)",
      card: "oklch(0.22 0.05 165)",
      cardForeground: "oklch(0.97 0.01 85)",
      primary: "oklch(0.76 0.13 85)",
      primaryForeground: "oklch(0.14 0.04 165)",
      secondary: "oklch(0.26 0.05 165)",
      secondaryForeground: "oklch(0.94 0.02 85)",
      muted: "oklch(0.24 0.035 165)",
      mutedForeground: "oklch(0.72 0.025 150)",
      accent: "oklch(0.76 0.13 85)",
      accentForeground: "oklch(0.14 0.04 165)",
      border: "oklch(0.3 0.045 165)",
      ring: "oklch(0.76 0.13 85)",
      rose: "oklch(0.3 0.04 165)",
      sage: "oklch(0.76 0.13 85)",
      cream: "oklch(0.18 0.04 165)",
      clay: "oklch(0.65 0.12 75)",
      ink: "oklch(0.97 0.01 85)",
      meshBg: `radial-gradient(at 10% 20%, oklch(0.35 0.09 160 / 0.6) 0px, transparent 50%),
               radial-gradient(at 85% 15%, oklch(0.3 0.08 90 / 0.45) 0px, transparent 55%),
               radial-gradient(at 60% 85%, oklch(0.25 0.06 175 / 0.5) 0px, transparent 55%),
               oklch(0.16 0.04 165)`,
      bodyColor: "oklch(0.9 0.02 85)",
      isDark: true,
    },
  },
  {
    id: "midnight-ocean",
    name: "Noc Filmowa & Srebro",
    tagline: "Granat nocy studyjnej, błękit pruski i chłodne platynowe światło",
    category: "Kino & Scena",
    swatches: ["#14213d", "#5b85aa", "#e0e6ed", "#0b132b"],
    colors: {
      background: "oklch(0.14 0.03 250)",
      foreground: "oklch(0.92 0.015 240)",
      card: "oklch(0.2 0.04 250)",
      cardForeground: "oklch(0.96 0.01 240)",
      primary: "oklch(0.68 0.11 230)",
      primaryForeground: "oklch(0.12 0.03 250)",
      secondary: "oklch(0.25 0.04 250)",
      secondaryForeground: "oklch(0.92 0.015 240)",
      muted: "oklch(0.22 0.025 250)",
      mutedForeground: "oklch(0.66 0.02 240)",
      accent: "oklch(0.72 0.09 215)",
      accentForeground: "oklch(0.12 0.03 250)",
      border: "oklch(0.28 0.03 250)",
      ring: "oklch(0.68 0.11 230)",
      rose: "oklch(0.26 0.04 250)",
      sage: "oklch(0.68 0.11 230)",
      cream: "oklch(0.16 0.03 250)",
      clay: "oklch(0.6 0.12 220)",
      ink: "oklch(0.96 0.01 240)",
      meshBg: `radial-gradient(at 15% 15%, oklch(0.3 0.09 230 / 0.55) 0px, transparent 50%),
               radial-gradient(at 85% 20%, oklch(0.28 0.08 265 / 0.45) 0px, transparent 55%),
               radial-gradient(at 50% 85%, oklch(0.26 0.07 210 / 0.4) 0px, transparent 50%),
               oklch(0.14 0.03 250)`,
      bodyColor: "oklch(0.88 0.015 240)",
      isDark: true,
    },
  },
  {
    id: "golden-hour",
    name: "Złota Godzina & Terakota",
    tagline: "Ciepły bursztyn, blask zachodzącego słońca, miód i śródziemnomorski klimat",
    category: "Klasyka",
    swatches: ["#c86432", "#f8ede3", "#dfa25c", "#3a2215"],
    colors: {
      background: "oklch(0.97 0.015 65)",
      foreground: "oklch(0.32 0.04 45)",
      card: "oklch(0.99 0.01 65)",
      cardForeground: "oklch(0.22 0.04 45)",
      primary: "oklch(0.55 0.17 48)",
      primaryForeground: "oklch(0.98 0.01 65)",
      secondary: "oklch(0.92 0.04 65)",
      secondaryForeground: "oklch(0.28 0.04 45)",
      muted: "oklch(0.93 0.02 65)",
      mutedForeground: "oklch(0.48 0.03 50)",
      accent: "oklch(0.72 0.14 65)",
      accentForeground: "oklch(0.2 0.04 45)",
      border: "oklch(0.88 0.03 65)",
      ring: "oklch(0.6 0.16 50)",
      rose: "oklch(0.9 0.05 55)",
      sage: "oklch(0.55 0.17 48)",
      cream: "oklch(0.97 0.015 65)",
      clay: "oklch(0.55 0.17 48)",
      ink: "oklch(0.22 0.04 45)",
      meshBg: `radial-gradient(at 15% 15%, oklch(0.92 0.08 55 / 0.6) 0px, transparent 50%),
               radial-gradient(at 85% 15%, oklch(0.94 0.06 75 / 0.7) 0px, transparent 50%),
               radial-gradient(at 50% 85%, oklch(0.9 0.07 45 / 0.4) 0px, transparent 55%),
               oklch(0.97 0.015 65)`,
      bodyColor: "rgb(75 55 45)",
      isDark: false,
    },
  },
  {
    id: "modern-arthouse",
    name: "Awangarda Studio & Koral",
    tagline: "Nowoczesne art house studio, głęboki ametyst i neonowy akcent",
    category: "Magazyn & Sztuka",
    swatches: ["#ff4a70", "#181226", "#2c1c44", "#f7f2ff"],
    colors: {
      background: "oklch(0.14 0.04 300)",
      foreground: "oklch(0.94 0.015 300)",
      card: "oklch(0.2 0.05 300)",
      cardForeground: "oklch(0.97 0.01 300)",
      primary: "oklch(0.68 0.22 15)",
      primaryForeground: "oklch(0.98 0.01 300)",
      secondary: "oklch(0.26 0.06 300)",
      secondaryForeground: "oklch(0.94 0.015 300)",
      muted: "oklch(0.22 0.03 300)",
      mutedForeground: "oklch(0.7 0.025 300)",
      accent: "oklch(0.68 0.22 15)",
      accentForeground: "oklch(0.98 0.01 300)",
      border: "oklch(0.28 0.045 300)",
      ring: "oklch(0.68 0.22 15)",
      rose: "oklch(0.28 0.06 300)",
      sage: "oklch(0.68 0.22 15)",
      cream: "oklch(0.16 0.04 300)",
      clay: "oklch(0.65 0.2 15)",
      ink: "oklch(0.97 0.01 300)",
      meshBg: `radial-gradient(at 15% 15%, oklch(0.35 0.14 15 / 0.5) 0px, transparent 50%),
               radial-gradient(at 85% 20%, oklch(0.3 0.1 320 / 0.55) 0px, transparent 55%),
               radial-gradient(at 60% 85%, oklch(0.32 0.12 280 / 0.4) 0px, transparent 50%),
               oklch(0.14 0.04 300)`,
      bodyColor: "oklch(0.9 0.015 300)",
      isDark: true,
    },
  },
  {
    id: "ethereal-alabaster",
    name: "Porcelanowa Mgła & Liliowy",
    tagline: "Jasny, zwiewny, subtelny chłodny róż i miękki alabaster",
    category: "Magazyn & Sztuka",
    swatches: ["#7a6878", "#faf8fb", "#ebdfe9", "#2d242c"],
    colors: {
      background: "oklch(0.98 0.006 320)",
      foreground: "oklch(0.32 0.015 320)",
      card: "oklch(0.995 0.003 320)",
      cardForeground: "oklch(0.22 0.02 320)",
      primary: "oklch(0.48 0.05 325)",
      primaryForeground: "oklch(0.99 0.003 320)",
      secondary: "oklch(0.93 0.02 320)",
      secondaryForeground: "oklch(0.26 0.02 320)",
      muted: "oklch(0.94 0.01 320)",
      mutedForeground: "oklch(0.5 0.015 320)",
      accent: "oklch(0.85 0.04 330)",
      accentForeground: "oklch(0.24 0.02 320)",
      border: "oklch(0.89 0.012 320)",
      ring: "oklch(0.55 0.06 325)",
      rose: "oklch(0.92 0.03 330)",
      sage: "oklch(0.48 0.05 325)",
      cream: "oklch(0.98 0.006 320)",
      clay: "oklch(0.52 0.08 340)",
      ink: "oklch(0.2 0.02 320)",
      meshBg: `radial-gradient(at 15% 15%, oklch(0.94 0.03 330 / 0.6) 0px, transparent 50%),
               radial-gradient(at 85% 15%, oklch(0.96 0.02 290 / 0.7) 0px, transparent 50%),
               radial-gradient(at 50% 85%, oklch(0.93 0.03 340 / 0.4) 0px, transparent 55%),
               oklch(0.98 0.006 320)`,
      bodyColor: "rgb(65 55 64)",
      isDark: false,
    },
  },
  {
    id: "film-35mm",
    name: "Monochrom 35mm Ilford",
    tagline: "Klasyczna fotografia analogowa czarno-biała, kontrast i ziarno",
    category: "Kino & Scena",
    swatches: ["#ffffff", "#0e0e0e", "#3a3a3a", "#8c8c8c"],
    colors: {
      background: "oklch(0.12 0 0)",
      foreground: "oklch(0.92 0 0)",
      card: "oklch(0.17 0 0)",
      cardForeground: "oklch(0.98 0 0)",
      primary: "oklch(0.95 0 0)",
      primaryForeground: "oklch(0.1 0 0)",
      secondary: "oklch(0.24 0 0)",
      secondaryForeground: "oklch(0.92 0 0)",
      muted: "oklch(0.2 0 0)",
      mutedForeground: "oklch(0.65 0 0)",
      accent: "oklch(0.85 0 0)",
      accentForeground: "oklch(0.1 0 0)",
      border: "oklch(0.26 0 0)",
      ring: "oklch(0.9 0 0)",
      rose: "oklch(0.25 0 0)",
      sage: "oklch(0.9 0 0)",
      cream: "oklch(0.14 0 0)",
      clay: "oklch(0.7 0 0)",
      ink: "oklch(0.98 0 0)",
      meshBg: `radial-gradient(at 20% 20%, oklch(0.25 0 0 / 0.5) 0px, transparent 50%),
               radial-gradient(at 80% 80%, oklch(0.22 0 0 / 0.4) 0px, transparent 55%),
               oklch(0.12 0 0)`,
      bodyColor: "oklch(0.88 0 0)",
      isDark: true,
    },
  },
];

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: "lora-karla",
    name: "Lora & Karla",
    subtitle: "Klasyczna elegancja i wysoka czytelność",
    serif: '"Lora", Georgia, serif',
    sans: '"Karla", system-ui, sans-serif',
    display: '"Montserrat", sans-serif',
  },
  {
    id: "playfair-inter",
    name: "Playfair & Inter",
    subtitle: "Dramat kinowy i nowoczesny minimalizm",
    serif: '"Playfair Display", Georgia, serif',
    sans: '"Inter", system-ui, sans-serif',
    display: '"Playfair Display", serif',
    headingTracking: "-0.02em",
  },
  {
    id: "cormorant-jakarta",
    name: "Cormorant & Plus Jakarta",
    subtitle: "Wysoka moda, haute couture i francuski szyk",
    serif: '"Cormorant Garamond", Garamond, serif',
    sans: '"Plus Jakarta Sans", system-ui, sans-serif',
    display: '"Cormorant Garamond", serif',
    headingTracking: "-0.01em",
  },
  {
    id: "cinzel-outfit",
    name: "Cinzel & Outfit",
    subtitle: "Teatralny majestat, klasyka i nowoczesny kunszt",
    serif: '"Cinzel", "Times New Roman", serif',
    sans: '"Outfit", system-ui, sans-serif',
    display: '"Cinzel", serif',
    headingTracking: "0.02em",
  },
  {
    id: "syne-space",
    name: "Syne & Space Grotesk",
    subtitle: "Artystyczna awangarda, wyraziste cięcia i styl",
    serif: '"Syne", sans-serif',
    sans: '"Space Grotesk", monospace, sans-serif',
    display: '"Syne", sans-serif',
    headingTracking: "-0.03em",
  },
  {
    id: "bodoni-dmsans",
    name: "Bodoni Moda & DM Sans",
    subtitle: "Luksusowy magazyn, okładka Vogue i wyrafinowanie",
    serif: '"Bodoni Moda", Didot, serif',
    sans: '"DM Sans", system-ui, sans-serif',
    display: '"Bodoni Moda", serif',
    headingTracking: "-0.02em",
  },
  {
    id: "newsreader-worksans",
    name: "Newsreader & Work Sans",
    subtitle: "Literacki scenariusz, poetyckość i intymność",
    serif: '"Newsreader", Georgia, serif',
    sans: '"Work Sans", system-ui, sans-serif',
    display: '"Newsreader", serif',
  },
  {
    id: "spectral-montserrat",
    name: "Spectral & Montserrat",
    subtitle: "Włoskie kino, subtelność literacka i styl edytorski",
    serif: '"Spectral", "Playfair Display", Georgia, serif',
    sans: '"Montserrat", system-ui, sans-serif',
    display: '"Spectral", serif',
    headingTracking: "0.01em",
  },
];

export const HERO_LAYOUTS: {
  id: HeroLayoutMode;
  name: string;
  desc: string;
  badge: string;
}[] = [
  {
    id: "monumental",
    name: "Monumentalny Portret Kinowy",
    desc: "Zdjęcie dominuje kadr o potężnej skali z kinową aurą i filmowymi detalami",
    badge: "Rekomendowany",
  },
  {
    id: "vogue",
    name: "Okładka Magazynu 3D (Vogue)",
    desc: "Wielki napis z imieniem w tle za postacią, tworząc efekt głębi magazynu mody",
    badge: "Editorial",
  },
  {
    id: "center",
    name: "Reflektor Teatralny (Center Stage)",
    desc: "Centralna postać w snopie światła z otaczającymi rolami i cytatami",
    badge: "Teatr",
  },
  {
    id: "split",
    name: "Szeroki Kadr Filmowy 60/40",
    desc: "Kinowy kadr studyjny po prawej z estetyką taśmy filmowej i metadanymi",
    badge: "Film Set",
  },
];

export const ABOUT_LAYOUTS: {
  id: AboutLayoutMode;
  name: string;
  desc: string;
  badge: string;
}[] = [
  {
    id: "editorial-split",
    name: "Klasyczny Split 50/50",
    desc: "Obrócony akcent w tle, elegancki portret po lewej i narracja po prawej",
    badge: "Klasyka",
  },
  {
    id: "magazine-story",
    name: "Magazyn Story & 2 Kolumny",
    desc: "Szeroki nagłówek na górze, wyeksponowany portret i dwukolumnowy układ tekstu",
    badge: "Editorial",
  },
  {
    id: "quote-spotlight",
    name: "Artystyczny Cytat & Portret",
    desc: "Wielki wyeksponowany cytat z wiszącym portretem aktorskim w centrum",
    badge: "Wyróżniony",
  },
  {
    id: "floating-card",
    name: "Pływająca Karta Szklana",
    desc: "Nowoczesna, przeszklona karta z portretem w kadrze i akcentami",
    badge: "Modern",
  },
];

export const WHAT_I_DO_LAYOUTS: {
  id: WhatIDoLayoutMode;
  name: string;
  desc: string;
  badge: string;
}[] = [
  {
    id: "grid-4",
    name: "Siatka 4 Kolumn (Domyślna)",
    desc: "Cztery równe, nowoczesne kafelki dla aktorstwa, modelingu, gastro i sztuki",
    badge: "Zrównoważony",
  },
  {
    id: "bento-editorial",
    name: "Asymetryczne Bento Grid",
    desc: "Aktorstwo jako potężny wyróżniony kafelek, pozostałe dziedziny dookoła",
    badge: "Dynamiczny",
  },
  {
    id: "interactive-tabs",
    name: "Interaktywne Karty Tab",
    desc: "Przełącznik dziedzin z dużym wyeksponowanym panelem i detalami",
    badge: "Interaktywny",
  },
  {
    id: "accordion-list",
    name: "Luksusowa Lista 01-04",
    desc: "Edytorska lista z numeracją, dużym tytułem i płynnym rozwinięciem",
    badge: "Minimal",
  },
];

export const GALLERY_LAYOUTS: {
  id: GalleryLayoutMode;
  name: string;
  desc: string;
  badge: string;
}[] = [
  {
    id: "masonry",
    name: "Dynamiczne Masonry",
    desc: "Kolumny o zmiennych wysokościach kadrów i organicznym rytmie",
    badge: "Organiczny",
  },
  {
    id: "grid-clean",
    name: "Czysta Siatka Kafelkowa",
    desc: "Równe, wykadrowane proporcje zdjęć w układzie portretowym",
    badge: "Uporządkowany",
  },
  {
    id: "film-strip",
    name: "Klatki Taśmy Filmowej",
    desc: "Filmowy horyzontalny pas kadrów studyjnych z przewijaniem",
    badge: "Kino 35mm",
  },
  {
    id: "editorial-showcase",
    name: "Wyróżniony Kadr Główny",
    desc: "Jedno duże zdjęcie w centrum otoczone mniejszymi kadrami po bokach",
    badge: "Wystawa",
  },
];

export const GALLERY_HOVER_EFFECTS: {
  id: GalleryHoverEffect;
  name: string;
  desc: string;
}[] = [
  { id: "zoom", name: "Płynny Zoom", desc: "Delikatne powiększenie kadru po najechaniu" },
  { id: "overlay", name: "Podpis & Poświata", desc: "Pojawiająca się nazwa kadru z ciemną nakładką" },
  { id: "bw-to-color", name: "B&W do Koloru", desc: "Zdjęcie czarno-białe ożywa w pełnym kolorze" },
];

export const INTERESTS_LAYOUTS: {
  id: InterestsLayoutMode;
  name: string;
  desc: string;
  badge: string;
}[] = [
  {
    id: "floating-bubbles",
    name: "Pływające Pigułki Hasztagów",
    desc: "Organiczne tagi z miękkim tłem, poświatą i subtelnym tłem graficznym",
    badge: "Lekki",
  },
  {
    id: "editorial-marquee",
    name: "Wstęga Magazynowa (Marquee)",
    desc: "Kinowy pas z wielkimi napisami pasji i artystycznym cytatem",
    badge: "Vogue",
  },
  {
    id: "visual-grid",
    name: "Siatka Pasji z Ikonami",
    desc: "Stylowe mini-karty dla każdego zainteresowania z mikro-akcentami",
    badge: "Karty",
  },
];

export const PATH_LAYOUTS: {
  id: PathLayoutMode;
  name: string;
  desc: string;
  badge: string;
}[] = [
  {
    id: "timeline-vertical",
    name: "Pionowa Oś Czasu",
    desc: "Klasyczna linia ze świecącymi punktami węzłowymi i okresami",
    badge: "Klasyka",
  },
  {
    id: "cards-alternating",
    name: "Naprzemienne Karty Kroków",
    desc: "Dynamiczny układ zygzakowaty z kartami po lewej i prawej stronie osi",
    badge: "Dynamiczny",
  },
  {
    id: "clean-list",
    name: "Minimalistyczna Lista",
    desc: "Dyskretna, edytorska lista etapów z dużymi rocznikami",
    badge: "Czysty",
  },
];

export const ACHIEVEMENTS_LAYOUTS: {
  id: AchievementsLayoutMode;
  name: string;
  desc: string;
  badge: string;
}[] = [
  {
    id: "split-featured",
    name: "Wyróżniony Puchar & Zespół",
    desc: "Wielka karta Destination Imagination po lewej, praca zespołowa po prawej",
    badge: "Podział",
  },
  {
    id: "cards-row",
    name: "Siatka 3 Kart Sukcesów",
    desc: "Wydzielone luksusowe karty: Puchar USA, Olimpiada DI, Certyfikaty i Zespół",
    badge: "Karty",
  },
  {
    id: "editorial-badge-list",
    name: "Złota Lista Odznak",
    desc: "Prestiżowa lista sukcesów z numeracją 01-03 i złotymi emblematami",
    badge: "Prestiż",
  },
];

export const CONTACT_LAYOUTS: {
  id: ContactLayoutMode;
  name: string;
  desc: string;
  badge: string;
}[] = [
  {
    id: "centered-minimal",
    name: "Wycentrowany Minimalizm",
    desc: "Mocny nagłówek, wycentrowany tekst i eleganckie pigułki kontaktowe",
    badge: "Minimal",
  },
  {
    id: "split-card",
    name: "Podzielona Karta Kontaktowa",
    desc: "Lewa strona: Miasta i dostępność, Prawa strona: Bezpośrednie kanały kontaktu",
    badge: "Biznes",
  },
  {
    id: "direct-action",
    name: "Duże Kafelki Szybkiej Akcji",
    desc: "Trzy duże, klikalne panele dla Emaila, Telefonu i Instagrama",
    badge: "Wygodny",
  },
];

export const PHOTO_FILTERS: { id: PhotoFilter; name: string; desc: string }[] = [
  { id: "normal", name: "Naturalny", desc: "Oryginalne kolory fotografii" },
  { id: "warm-cinema", name: "Ciepły Kinowy", desc: "Złote, analogowe oświetlenie sceniczne" },
  { id: "noir", name: "Artystyczny B&W Noir", desc: "Mocny, kontrastowy portret czarno-biały" },
  { id: "vintage", name: "Vintage Sepia 70s", desc: "Klimatyczna sepia i miękki odcień" },
  { id: "vivid", name: "Żywy Kontrast", desc: "Podbicie głębi i nasycenia detali" },
  { id: "soft-glow", name: "Miękkie Światło (Glamour)", desc: "Aksamitny filtr zmiękczający" },
];

export const CARD_STYLES: { id: CardStyle; name: string; desc: string }[] = [
  { id: "soft", name: "Aksamitny Cień", desc: "Subtelne rozmycie tła z głębokim cieniem" },
  { id: "glass", name: "Glassmorphic Szkło", desc: "Mocny efekt szklanej powierzchni z poświatą" },
  { id: "bordered", name: "Edytorski Kontur", desc: "Czysta ramka w stylu albumu sztuki" },
  { id: "solid", name: "Głęboki Kontrast", desc: "Solidne, wyraziste tło o wysokiej czytelności" },
];

export const RADIUS_OPTIONS: { id: RadiusOption; name: string; px: string }[] = [
  { id: "sharp", name: "Ostre (0px)", px: "0px" },
  { id: "subtle", name: "Subtelne (8px)", px: "0.5rem" },
  { id: "rounded", name: "Zaokrąglone (16px)", px: "1rem" },
  { id: "smooth", name: "Miękkie (24px)", px: "1.5rem" },
];

export const DEFAULT_STUDIO_CONFIG: StudioConfig = {
  themeId: "sage-default",
  fontId: "lora-karla",
  heroLayout: "monumental",
  photoFilter: "normal",
  cardStyle: "soft",
  radius: "rounded",
  heroScale: "monumental",
  showGrain: true,
  showGlow: true,
  heroBacklight: true,

  // Section Layout Defaults
  aboutLayout: "editorial-split",
  whatIDoLayout: "grid-4",
  galleryLayout: "masonry",
  galleryHover: "zoom",
  interestsLayout: "floating-bubbles",
  pathLayout: "timeline-vertical",
  achievementsLayout: "split-featured",
  contactLayout: "centered-minimal",
};

const STORAGE_KEY = "aniastrona_studio_config_v2";

export function loadStudioConfig(): StudioConfig {
  if (typeof window === "undefined") return DEFAULT_STUDIO_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STUDIO_CONFIG;
    const parsed = JSON.parse(raw) as Partial<StudioConfig>;
    return { ...DEFAULT_STUDIO_CONFIG, ...parsed };
  } catch {
    return DEFAULT_STUDIO_CONFIG;
  }
}

export function saveStudioConfig(config: StudioConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn("Failed to save studio config:", err);
  }
}

export function applyStudioConfig(config: StudioConfig): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const body = document.body;

  // 1. Apply Theme Colors
  const preset = THEME_PRESETS.find((t) => t.id === config.themeId) ?? THEME_PRESETS[0];
  const { colors } = preset;

  root.style.setProperty("--background", colors.background);
  root.style.setProperty("--foreground", colors.foreground);
  root.style.setProperty("--card", colors.card);
  root.style.setProperty("--card-foreground", colors.cardForeground);
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--primary-foreground", colors.primaryForeground);
  root.style.setProperty("--secondary", colors.secondary);
  root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
  root.style.setProperty("--muted", colors.muted);
  root.style.setProperty("--muted-foreground", colors.mutedForeground);
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--accent-foreground", colors.accentForeground);
  root.style.setProperty("--border", colors.border);
  root.style.setProperty("--ring", colors.ring);
  root.style.setProperty("--rose", colors.rose);
  root.style.setProperty("--sage", colors.sage);
  root.style.setProperty("--cream", colors.cream);
  root.style.setProperty("--clay", colors.clay);
  root.style.setProperty("--ink", colors.ink);
  root.style.setProperty("--body-color", colors.bodyColor);
  root.style.setProperty("--theme-mesh", colors.meshBg);

  if (colors.isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // 2. Apply Font Pairings
  const fontPairing = FONT_PAIRINGS.find((f) => f.id === config.fontId) ?? FONT_PAIRINGS[0];
  root.style.setProperty("--font-serif", fontPairing.serif);
  root.style.setProperty("--font-sans", fontPairing.sans);
  root.style.setProperty("--font-display", fontPairing.display);
  if (fontPairing.headingTracking) {
    root.style.setProperty("--heading-tracking", fontPairing.headingTracking);
  } else {
    root.style.removeProperty("--heading-tracking");
  }

  // 3. Apply Radius
  const radiusObj = RADIUS_OPTIONS.find((r) => r.id === config.radius) ?? RADIUS_OPTIONS[2];
  root.style.setProperty("--radius", radiusObj.px);

  // 4. Classes on body
  body.dataset.cardStyle = config.cardStyle;
  body.dataset.photoFilter = config.photoFilter;
  body.dataset.heroLayout = config.heroLayout;
  body.dataset.heroScale = config.heroScale;
  body.dataset.theme = config.themeId;
  body.dataset.galleryHover = config.galleryHover;

  if (config.showGrain) {
    root.classList.add("with-grain");
  } else {
    root.classList.remove("with-grain");
  }
}

export function getRandomStudioConfig(current: StudioConfig): StudioConfig {
  const themes = THEME_PRESETS.filter((t) => t.id !== current.themeId);
  const fonts = FONT_PAIRINGS.filter((f) => f.id !== current.fontId);
  const layouts: HeroLayoutMode[] = ["monumental", "vogue", "center", "split"];
  const filters: PhotoFilter[] = ["normal", "warm-cinema", "noir", "vintage", "vivid", "soft-glow"];
  const cardStyles: CardStyle[] = ["soft", "glass", "bordered", "solid"];
  const radii: RadiusOption[] = ["sharp", "subtle", "rounded", "smooth"];
  const scales: HeroScale[] = ["large", "monumental"];

  const aboutLayouts: AboutLayoutMode[] = ["editorial-split", "magazine-story", "quote-spotlight", "floating-card"];
  const whatIDoLayouts: WhatIDoLayoutMode[] = ["grid-4", "interactive-tabs", "accordion-list", "bento-editorial"];
  const galleryLayouts: GalleryLayoutMode[] = ["masonry", "grid-clean", "film-strip", "editorial-showcase"];
  const galleryHovers: GalleryHoverEffect[] = ["zoom", "overlay", "bw-to-color"];
  const interestsLayouts: InterestsLayoutMode[] = ["floating-bubbles", "editorial-marquee", "visual-grid"];
  const pathLayouts: PathLayoutMode[] = ["timeline-vertical", "cards-alternating", "clean-list"];
  const achievementsLayouts: AchievementsLayoutMode[] = ["split-featured", "cards-row", "editorial-badge-list"];
  const contactLayouts: ContactLayoutMode[] = ["centered-minimal", "split-card", "direct-action"];

  const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  return {
    themeId: randomItem(themes).id,
    fontId: randomItem(fonts).id,
    heroLayout: randomItem(layouts),
    photoFilter: randomItem(filters),
    cardStyle: randomItem(cardStyles),
    radius: randomItem(radii),
    heroScale: randomItem(scales),
    showGrain: Math.random() > 0.3,
    showGlow: true,
    heroBacklight: true,

    aboutLayout: randomItem(aboutLayouts),
    whatIDoLayout: randomItem(whatIDoLayouts),
    galleryLayout: randomItem(galleryLayouts),
    galleryHover: randomItem(galleryHovers),
    interestsLayout: randomItem(interestsLayouts),
    pathLayout: randomItem(pathLayouts),
    achievementsLayout: randomItem(achievementsLayouts),
    contactLayout: randomItem(contactLayouts),
  };
}

export function generateCssExport(config: StudioConfig): string {
  const theme = THEME_PRESETS.find((t) => t.id === config.themeId) ?? THEME_PRESETS[0];
  const font = FONT_PAIRINGS.find((f) => f.id === config.fontId) ?? FONT_PAIRINGS[0];
  const radius = RADIUS_OPTIONS.find((r) => r.id === config.radius)?.px ?? "1rem";

  return `/* === Anna Tomaszewska — Custom Theme Preset: ${theme.name} === */
:root {
  --radius: ${radius};
  --background: ${theme.colors.background};
  --foreground: ${theme.colors.foreground};
  --card: ${theme.colors.card};
  --card-foreground: ${theme.colors.cardForeground};
  --primary: ${theme.colors.primary};
  --primary-foreground: ${theme.colors.primaryForeground};
  --secondary: ${theme.colors.secondary};
  --secondary-foreground: ${theme.colors.secondaryForeground};
  --muted: ${theme.colors.muted};
  --muted-foreground: ${theme.colors.mutedForeground};
  --accent: ${theme.colors.accent};
  --accent-foreground: ${theme.colors.accentForeground};
  --border: ${theme.colors.border};
  --ring: ${theme.colors.ring};
  --rose: ${theme.colors.rose};
  --sage: ${theme.colors.sage};
  --cream: ${theme.colors.cream};
  --clay: ${theme.colors.clay};
  --ink: ${theme.colors.ink};
  --font-serif: ${font.serif};
  --font-sans: ${font.sans};
  --font-display: ${font.display};
}

/* 
  Sections Configuration:
  - Hero: ${config.heroLayout} (${config.heroScale}, filter: ${config.photoFilter})
  - O mnie: ${config.aboutLayout}
  - Czym się zajmuję: ${config.whatIDoLayout}
  - Galeria: ${config.galleryLayout} (hover: ${config.galleryHover})
  - Moja droga: ${config.pathLayout}
  - Zainteresowania: ${config.interestsLayout}
  - Osiągnięcia: ${config.achievementsLayout}
  - Kontakt: ${config.contactLayout}
  - Styl kart: ${config.cardStyle}
*/`;
}
