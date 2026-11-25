import { useEffect } from "react";
import type { SiteStyleConfig } from "@/lib/content";
import { FONT_PAIRINGS, RADIUS_OPTIONS, THEME_PRESETS } from "@/lib/theme-studio";

const FONT_SCALE_MAP: Record<NonNullable<SiteStyleConfig["fontSizeScale"]>, string> = {
  sm: "92%",
  md: "100%",
  lg: "108%",
  xl: "116%",
};

const HEADING_SCALE_MAP: Record<NonNullable<SiteStyleConfig["headingScale"]>, string> = {
  compact: "0.88",
  normal: "1",
  large: "1.12",
  editorial: "1.24",
};

const SECTION_SPACE_MAP: Record<NonNullable<SiteStyleConfig["sectionSpacing"]>, string> = {
  compact: "3.5rem",
  normal: "6rem",
  airy: "8.5rem",
};

export function heroImageHeightClass(height?: SiteStyleConfig["heroImageHeight"]): string {
  switch (height) {
    case "compact":
      return "h-[400px] sm:h-[480px] md:h-[540px] lg:h-[600px]";
    case "normal":
      return "h-[480px] sm:h-[560px] md:h-[650px] lg:h-[720px]";
    case "tall":
      return "h-[580px] sm:h-[700px] md:h-[820px] lg:h-[920px]";
    case "monumental":
    default:
      return "h-[540px] sm:h-[650px] md:h-[760px] lg:h-[840px] xl:h-[900px]";
  }
}

export function galleryColumnsClass(cols?: SiteStyleConfig["galleryColumns"]): string {
  if (cols === 2) return "columns-1 sm:columns-2 gap-6 space-y-6";
  if (cols === 4) return "columns-2 md:columns-4 gap-5 space-y-5";
  return "columns-2 md:columns-3 gap-6 space-y-6";
}

function buildCss(style?: SiteStyleConfig): string {
  if (!style) return "";
  const vars: string[] = [];

  if (style.themeId && style.themeId !== "default") {
    const preset = THEME_PRESETS.find((t) => t.id === style.themeId);
    if (preset) {
      const c = preset.colors;
      vars.push(
        `--background: ${c.background};`,
        `--foreground: ${c.foreground};`,
        `--card: ${c.card};`,
        `--card-foreground: ${c.cardForeground};`,
        `--primary: ${c.primary};`,
        `--primary-foreground: ${c.primaryForeground};`,
        `--secondary: ${c.secondary};`,
        `--secondary-foreground: ${c.secondaryForeground};`,
        `--muted: ${c.muted};`,
        `--muted-foreground: ${c.mutedForeground};`,
        `--accent: ${c.accent};`,
        `--accent-foreground: ${c.accentForeground};`,
        `--border: ${c.border};`,
        `--ring: ${c.ring};`,
        `--rose: ${c.rose};`,
        `--sage: ${c.sage};`,
        `--cream: ${c.cream};`,
        `--clay: ${c.clay};`,
        `--ink: ${c.ink};`,
        `--body-color: ${c.bodyColor};`,
        `--theme-mesh: ${c.meshBg};`,
      );
    }
  }

  if (style.primaryColor) {
    vars.push(`--primary: ${style.primaryColor};`, `--sage: ${style.primaryColor};`);
  }
  if (style.backgroundColor) {
    vars.push(`--background: ${style.backgroundColor};`, `--cream: ${style.backgroundColor};`);
  }
  if (style.cardColor) {
    vars.push(`--card: ${style.cardColor};`);
  }
  if (style.textColor) {
    vars.push(`--foreground: ${style.textColor};`, `--body-color: ${style.textColor};`);
  }
  if (style.accentColor) {
    vars.push(`--accent: ${style.accentColor};`, `--rose: ${style.accentColor};`);
  }

  if (style.fontId && style.fontId !== "default") {
    const font = FONT_PAIRINGS.find((f) => f.id === style.fontId);
    if (font) {
      vars.push(
        `--font-serif: ${font.serif};`,
        `--font-sans: ${font.sans};`,
        `--font-display: ${font.display};`,
      );
      if (font.headingTracking) {
        vars.push(`--heading-tracking: ${font.headingTracking};`);
      }
    }
  }

  if (style.radius) {
    const radiusObj = RADIUS_OPTIONS.find((r) => r.id === style.radius);
    if (radiusObj) vars.push(`--radius: ${radiusObj.px};`);
  }

  const rootRules: string[] = [];
  if (vars.length) rootRules.push(`:root { ${vars.join(" ")} }`);
  if (style.fontSizeScale && FONT_SCALE_MAP[style.fontSizeScale]) {
    rootRules.push(`html { font-size: ${FONT_SCALE_MAP[style.fontSizeScale]}; }`);
  }
  if (style.headingScale && style.headingScale !== "normal") {
    const scale = HEADING_SCALE_MAP[style.headingScale];
    rootRules.push(`h1, h2, h3 { zoom: ${scale}; }`);
  }
  if (style.sectionSpacing && style.sectionSpacing !== "normal") {
    const pad = SECTION_SPACE_MAP[style.sectionSpacing];
    rootRules.push(`main > section { padding-top: ${pad}; padding-bottom: ${pad}; }`);
  }
  if (style.customCss) {
    rootRules.push(style.customCss);
  }

  return rootRules.join("\n");
}

export function SiteStyleApplier({ style }: { style?: SiteStyleConfig }) {
  const css = buildCss(style);

  useEffect(() => {
    if (!style || typeof document === "undefined") return;
    const root = document.documentElement;
    const body = document.body;

    if (style.themeId && style.themeId !== "default") {
      const preset = THEME_PRESETS.find((t) => t.id === style.themeId);
      if (preset?.colors.isDark) root.classList.add("dark");
      else root.classList.remove("dark");
    }

    if (style.cardStyle) body.dataset.cardStyle = style.cardStyle;
    else delete body.dataset.cardStyle;

    if (style.photoFilter && style.photoFilter !== "normal") body.dataset.photoFilter = style.photoFilter;
    else delete body.dataset.photoFilter;

    if (style.showGrain === false) root.classList.remove("with-grain");
    else if (style.showGrain === true) root.classList.add("with-grain");
  }, [style]);

  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
