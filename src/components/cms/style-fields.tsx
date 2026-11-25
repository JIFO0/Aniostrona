import { useState } from "react";
import { Field, TextArea, TextInput } from "@/components/cms/fields";
import { HOME_SECTIONS, type BoxStyle, type HomeContent, type SiteStyleConfig } from "@/lib/content";
import {
  CARD_STYLES,
  FONT_PAIRINGS,
  PHOTO_FILTERS,
  RADIUS_OPTIONS,
  THEME_PRESETS,
} from "@/lib/theme-studio";

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 rounded-lg border border-ink/15 bg-white cursor-pointer p-0.5 shrink-0"
        />
        <TextInput value={value ?? ""} onChange={onChange} placeholder="domyślny (np. #f7f3ee)" />
        {value ? (
          <button type="button" className="text-xs text-clay shrink-0" onClick={() => onChange("")}>
            Reset
          </button>
        ) : null}
      </div>
    </Field>
  );
}

export function SiteStyleFields({
  style,
  onChange,
}: {
  style: SiteStyleConfig;
  onChange: (next: SiteStyleConfig) => void;
}) {
  const patch = (partial: Partial<SiteStyleConfig>) => onChange({ ...style, ...partial });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-2xl">Motyw i kolorystyka</h2>
          <button
            type="button"
            className="cms-chip"
            onClick={() => onChange({})}
          >
            Przywróć domyślny styl
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => patch({ themeId: "default" })}
            className={`text-left rounded-2xl p-4 border transition-all ${
              !style.themeId || style.themeId === "default"
                ? "border-clay bg-clay/10"
                : "border-ink/10 bg-white hover:border-ink/25"
            }`}
          >
            <p className="font-medium text-sm">Domyślny styl strony</p>
            <p className="text-xs text-ink/55 mt-1">Oryginalna paleta z CSS</p>
          </button>
          {THEME_PRESETS.map((preset) => {
            const active = style.themeId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => patch({ themeId: preset.id })}
                className={`text-left rounded-2xl p-4 border transition-all ${
                  active
                    ? "border-clay bg-clay/10"
                    : "border-ink/10 bg-white hover:border-ink/25"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-medium text-sm">{preset.name}</span>
                  <div className="flex gap-1 shrink-0">
                    {preset.swatches.map((hex) => (
                      <span
                        key={hex}
                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-ink/55 line-clamp-2">{preset.tagline}</p>
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <ColorInput
            label="Kolor główny (primary)"
            value={style.primaryColor}
            onChange={(primaryColor) => patch({ primaryColor })}
          />
          <ColorInput
            label="Kolor tła strony"
            value={style.backgroundColor}
            onChange={(backgroundColor) => patch({ backgroundColor })}
          />
          <ColorInput
            label="Kolor kart / boxów"
            value={style.cardColor}
            onChange={(cardColor) => patch({ cardColor })}
          />
          <ColorInput
            label="Kolor tekstu"
            value={style.textColor}
            onChange={(textColor) => patch({ textColor })}
          />
          <ColorInput
            label="Kolor akcentu"
            value={style.accentColor}
            onChange={(accentColor) => patch({ accentColor })}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Typografia i wielkości</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Zestaw fontów">
            <select
              className="cms-input"
              value={style.fontId || "default"}
              onChange={(e) => patch({ fontId: e.target.value })}
            >
              <option value="default">Domyślny (Spectral + Montserrat)</option>
              {FONT_PAIRINGS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.subtitle})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Wielkość tekstu (skala)">
            <select
              className="cms-input"
              value={style.fontSizeScale || "md"}
              onChange={(e) =>
                patch({ fontSizeScale: e.target.value as SiteStyleConfig["fontSizeScale"] })
              }
            >
              <option value="sm">Mniejszy (92%)</option>
              <option value="md">Standardowy (100%)</option>
              <option value="lg">Większy (108%)</option>
              <option value="xl">Duży (116%)</option>
            </select>
          </Field>
          <Field label="Wielkość nagłówków">
            <select
              className="cms-input"
              value={style.headingScale || "normal"}
              onChange={(e) =>
                patch({ headingScale: e.target.value as SiteStyleConfig["headingScale"] })
              }
            >
              <option value="compact">Kompaktowe (88%)</option>
              <option value="normal">Standardowe (100%)</option>
              <option value="large">Powiększone (112%)</option>
              <option value="editorial">Magazynowe (124%)</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Kształty, zdjęcia i układ</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Zaokrąglenie rogów">
            <select
              className="cms-input"
              value={style.radius || "rounded"}
              onChange={(e) => patch({ radius: e.target.value as SiteStyleConfig["radius"] })}
            >
              {RADIUS_OPTIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Styl kart i boxów">
            <select
              className="cms-input"
              value={style.cardStyle || "soft"}
              onChange={(e) => patch({ cardStyle: e.target.value as SiteStyleConfig["cardStyle"] })}
            >
              {CARD_STYLES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Filtr zdjęć">
            <select
              className="cms-input"
              value={style.photoFilter || "normal"}
              onChange={(e) =>
                patch({ photoFilter: e.target.value as SiteStyleConfig["photoFilter"] })
              }
            >
              {PHOTO_FILTERS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Wysokość zdjęcia Hero">
            <select
              className="cms-input"
              value={style.heroImageHeight || "monumental"}
              onChange={(e) =>
                patch({ heroImageHeight: e.target.value as SiteStyleConfig["heroImageHeight"] })
              }
            >
              <option value="compact">Kompaktowe</option>
              <option value="normal">Średnie</option>
              <option value="monumental">Monumentalne (domyślne)</option>
              <option value="tall">Bardzo wysokie</option>
            </select>
          </Field>
          <Field label="Odstępy między sekcjami">
            <select
              className="cms-input"
              value={style.sectionSpacing || "normal"}
              onChange={(e) =>
                patch({ sectionSpacing: e.target.value as SiteStyleConfig["sectionSpacing"] })
              }
            >
              <option value="compact">Gęste (kompaktowe)</option>
              <option value="normal">Standardowe</option>
              <option value="airy">Przestronne</option>
            </select>
          </Field>
          <Field label="Kolumny galerii">
            <select
              className="cms-input"
              value={String(style.galleryColumns || 3)}
              onChange={(e) => patch({ galleryColumns: Number(e.target.value) as 2 | 3 | 4 })}
            >
              <option value="2">2 kolumny</option>
              <option value="3">3 kolumny (domyślnie)</option>
              <option value="4">4 kolumny</option>
            </select>
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm pt-1">
          <input
            type="checkbox"
            checked={style.showGrain !== false}
            onChange={(e) => patch({ showGrain: e.target.checked })}
          />
          Subtelne ziarno (tekstura papieru na tle)
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Własny CSS (opcjonalnie)</h2>
        <Field label="Dodatkowe reguły CSS" hint="Dla zaawansowanych zmian dowolnego elementu na stronie">
          <TextArea
            rows={5}
            value={style.customCss ?? ""}
            onChange={(customCss) => patch({ customCss })}
          />
        </Field>
      </section>
    </div>
  );
}

export function HomeSectionsFields({
  home,
  setHome,
}: {
  home: HomeContent;
  setHome: (home: HomeContent) => void;
}) {
  const hidden = new Set(home.hiddenSections ?? []);

  function toggle(id: string) {
    const next = new Set(hidden);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setHome({ ...home, hiddenSections: Array.from(next) });
  }

  return (
    <section className="space-y-3 pt-4 border-t border-ink/10">
      <h2 className="font-serif text-2xl">Widoczność sekcji na stronie głównej</h2>
      <p className="text-xs text-ink/55">
        Możesz wyłączyć wybrane wbudowane sekcje i zastąpić je własnymi boxami w zakładce „Nowe sekcje”.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {HOME_SECTIONS.map((sec) => (
          <label
            key={sec.id}
            className="flex items-center gap-2.5 rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={!hidden.has(sec.id)}
              onChange={() => toggle(sec.id)}
            />
            <span>{sec.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

export function BoxStyleFields({
  value,
  onChange,
}: {
  value?: BoxStyle;
  onChange: (next: BoxStyle) => void;
}) {
  const [open, setOpen] = useState(false);
  const s = value ?? {};
  const patch = (partial: Partial<BoxStyle>) => onChange({ ...s, ...partial });

  return (
    <div className="rounded-xl border border-ink/10 bg-ink/[0.02] p-3 space-y-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-xs uppercase tracking-[0.16em] text-clay font-medium"
      >
        <span>Wygląd, tło i wielkość boxa</span>
        <span>{open ? "Zwiń ▲" : "Rozwiń ▼"}</span>
      </button>

      {open ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          <Field label="Tło boxa">
            <select
              className="cms-input"
              value={s.bg || "none"}
              onChange={(e) => patch({ bg: e.target.value as BoxStyle["bg"] })}
            >
              <option value="none">Przezroczyste</option>
              <option value="card">Karta (soft-card)</option>
              <option value="cream">Kremowe</option>
              <option value="tint">Delikatny akcent</option>
              <option value="gradient">Gradient</option>
              <option value="dark">Ciemne</option>
            </select>
          </Field>
          <Field label="Obramowanie">
            <select
              className="cms-input"
              value={s.border || "none"}
              onChange={(e) => patch({ border: e.target.value as BoxStyle["border"] })}
            >
              <option value="none">Brak</option>
              <option value="subtle">Subtelne</option>
              <option value="accent">Akcentowe</option>
            </select>
          </Field>
          <Field label="Zaokrąglenie">
            <select
              className="cms-input"
              value={s.radius || "default"}
              onChange={(e) => patch({ radius: e.target.value as BoxStyle["radius"] })}
            >
              <option value="default">Domyślne</option>
              <option value="none">Ostre (0px)</option>
              <option value="md">Średnie</option>
              <option value="2xl">Duże</option>
              <option value="full">Mocne (3xl)</option>
            </select>
          </Field>
          <Field label="Cień">
            <select
              className="cms-input"
              value={s.shadow || "none"}
              onChange={(e) => patch({ shadow: e.target.value as BoxStyle["shadow"] })}
            >
              <option value="none">Brak</option>
              <option value="soft">Miękki</option>
              <option value="strong">Mocny</option>
            </select>
          </Field>
          <Field label="Odstęp wewnętrzny">
            <select
              className="cms-input"
              value={s.padding || "md"}
              onChange={(e) => patch({ padding: e.target.value as BoxStyle["padding"] })}
            >
              <option value="sm">Mały</option>
              <option value="md">Średni</option>
              <option value="lg">Duży</option>
              <option value="xl">Bardzo duży</option>
            </select>
          </Field>
          <Field label="Szerokość boxa">
            <select
              className="cms-input"
              value={s.width || "normal"}
              onChange={(e) => patch({ width: e.target.value as BoxStyle["width"] })}
            >
              <option value="narrow">Wąska</option>
              <option value="normal">Standardowa</option>
              <option value="wide">Szeroka</option>
              <option value="full">Pełna szerokość</option>
            </select>
          </Field>
          <Field label="Wyrównanie tekstu">
            <select
              className="cms-input"
              value={s.align || "left"}
              onChange={(e) => patch({ align: e.target.value as BoxStyle["align"] })}
            >
              <option value="left">Do lewej</option>
              <option value="center">Wyśrodkowane</option>
              <option value="right">Do prawej</option>
            </select>
          </Field>
          <Field label="Rozmiar tekstu">
            <select
              className="cms-input"
              value={s.textSize || "base"}
              onChange={(e) => patch({ textSize: e.target.value as BoxStyle["textSize"] })}
            >
              <option value="sm">Mały</option>
              <option value="base">Normalny</option>
              <option value="lg">Większy</option>
              <option value="xl">Duży</option>
            </select>
          </Field>
          <Field label="Wielkość zdjęć w boxie">
            <select
              className="cms-input"
              value={s.imageSize || "md"}
              onChange={(e) => patch({ imageSize: e.target.value as BoxStyle["imageSize"] })}
            >
              <option value="sm">Małe</option>
              <option value="md">Średnie</option>
              <option value="lg">Duże</option>
              <option value="full">Pełna wysokość</option>
            </select>
          </Field>
          <ColorInput
            label="Własny kolor tła"
            value={s.customBg}
            onChange={(customBg) => patch({ customBg })}
          />
          <ColorInput
            label="Własny kolor tekstu"
            value={s.customText}
            onChange={(customText) => patch({ customText })}
          />
        </div>
      ) : null}
    </div>
  );
}
