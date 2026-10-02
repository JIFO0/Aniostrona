import { useEffect, useState } from "react";
import {
  Sparkles,
  Palette,
  SlidersHorizontal,
  X,
  RotateCcw,
  Dice5,
  Copy,
  Check,
  Layout,
  Type,
  Layers,
  Image as ImageIcon,
  Sun,
  Moon,
  User,
  Briefcase,
  Sparkle,
  Trophy,
  Mail,
  Compass,
  HeartHandshake,
} from "lucide-react";
import {
  THEME_PRESETS,
  FONT_PAIRINGS,
  HERO_LAYOUTS,
  ABOUT_LAYOUTS,
  WHAT_I_DO_LAYOUTS,
  GALLERY_LAYOUTS,
  GALLERY_HOVER_EFFECTS,
  INTERESTS_LAYOUTS,
  PATH_LAYOUTS,
  ACHIEVEMENTS_LAYOUTS,
  CONTACT_LAYOUTS,
  PHOTO_FILTERS,
  CARD_STYLES,
  RADIUS_OPTIONS,
  DEFAULT_STUDIO_CONFIG,
  loadStudioConfig,
  saveStudioConfig,
  applyStudioConfig,
  getRandomStudioConfig,
  generateCssExport,
  type StudioConfig,
} from "@/lib/theme-studio";

export function ThemeStudio({
  config,
  onChange,
}: {
  config: StudioConfig;
  onChange: (newConfig: StudioConfig) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"theme" | "fonts" | "hero" | "sections1" | "sections2">("theme");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    applyStudioConfig(config);
  }, [config]);

  const update = (partial: Partial<StudioConfig>) => {
    const next = { ...config, ...partial };
    onChange(next);
    saveStudioConfig(next);
    applyStudioConfig(next);
  };

  const handleRandomize = () => {
    const random = getRandomStudioConfig(config);
    onChange(random);
    saveStudioConfig(random);
    applyStudioConfig(random);
  };

  const handleReset = () => {
    onChange(DEFAULT_STUDIO_CONFIG);
    saveStudioConfig(DEFAULT_STUDIO_CONFIG);
    applyStudioConfig(DEFAULT_STUDIO_CONFIG);
  };

  const handleCopyCss = async () => {
    try {
      const css = generateCssExport(config);
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const currentTheme = THEME_PRESETS.find((t) => t.id === config.themeId) ?? THEME_PRESETS[0];

  return (
    <>
      {/* Floating Trigger Button (Top Right) */}
      <div className="fixed top-4 right-4 z-50 md:top-6 md:right-6 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Otwórz Studio Stylu"
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: currentTheme.colors.isDark
              ? "rgba(20, 20, 26, 0.88)"
              : "rgba(255, 255, 255, 0.9)",
            color: currentTheme.colors.isDark ? "#ffffff" : "#1e1e1e",
            boxShadow: "0 10px 35px -5px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.15)",
          }}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span
              className="relative inline-flex rounded-full h-3 w-3"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
          </span>

          <Sparkles className="w-4 h-4 text-primary animate-spin-slow" />
          <span className="text-xs md:text-sm font-medium tracking-wide">
            Studio Stylu
          </span>

          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold uppercase tracking-wider">
            {currentTheme.name.split(" ")[0]}
          </span>
        </button>
      </div>

      {/* Slide-out Customizer Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-drift-in pointer-events-auto">
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="relative w-full max-w-lg md:max-w-xl xl:max-w-2xl h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l"
            style={{
              background: currentTheme.colors.isDark
                ? "rgba(18, 18, 24, 0.97)"
                : "rgba(252, 250, 246, 0.98)",
              color: currentTheme.colors.isDark ? "#f3f3f3" : "#222222",
              borderColor: currentTheme.colors.isDark
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header */}
            <div className="p-5 md:p-6 border-b flex items-center justify-between gap-3 border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-medium tracking-tight flex items-center gap-2">
                    Studio Personalizacji
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-sans font-semibold">
                      Wszystkie Sekcje
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Zmieniaj wygląd Hero, O mnie, Czym się zajmuję, Galerii, Osiągnięć i Kontaktu
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Zamknij"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="px-5 py-3 border-b border-border/40 flex flex-wrap items-center justify-between gap-2 bg-muted/20 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRandomize}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 active:scale-95 transition-all shadow-sm"
                  title="Wylosuj niesamowitą kombinację na całej stronie"
                >
                  <Dice5 className="w-3.5 h-3.5" /> Wylosuj wszystko
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
                  title="Resetuj do domyślnych"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>

              <button
                onClick={handleCopyCss}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-card hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
                title="Kopiuj konfigurację CSS zmiennych"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" /> Skopiowano!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Kopiuj CSS
                  </>
                )}
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-border/40 px-5 pt-3 gap-1 overflow-x-auto no-scrollbar">
              {(
                [
                  { id: "theme" as const, label: "Palety barw", icon: Palette },
                  { id: "fonts" as const, label: "Kroje & Karty", icon: Type },
                  { id: "hero" as const, label: "Sekcja Hero", icon: Layout },
                  { id: "sections1" as const, label: "O mnie & Działalność", icon: User },
                  { id: "sections2" as const, label: "Galeria, Sukcesy & Kontakt", icon: ImageIcon },
                ] as const
              ).map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-1.5 pb-3 px-3 border-b-2 text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                      active
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
              {/* TAB 1: PALETY BARW */}
              {activeTab === "theme" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Klimat kolorystyczny ({THEME_PRESETS.length} motywów)
                    </span>
                    <span className="text-xs text-primary font-medium">
                      {currentTheme.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {THEME_PRESETS.map((t) => {
                      const isActive = config.themeId === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => update({ themeId: t.id })}
                          className={`group relative text-left p-3.5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between gap-3 ${
                            isActive
                              ? "border-primary ring-2 ring-primary/40 shadow-lg"
                              : "border-border/60 hover:border-border"
                          }`}
                          style={{
                            background: t.colors.isDark
                              ? "rgba(25, 25, 33, 0.9)"
                              : "rgba(255, 255, 255, 0.8)",
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-serif font-medium text-sm text-foreground">
                                {t.name}
                              </span>
                              {t.colors.isDark ? (
                                <Moon className="w-3.5 h-3.5 text-muted-foreground" />
                              ) : (
                                <Sun className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                              {t.tagline}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-border/30">
                            <div className="flex items-center gap-1.5">
                              {t.swatches.map((color, i) => (
                                <span
                                  key={i}
                                  className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>

                            {isActive && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                                <Check className="w-3.5 h-3.5" /> Wybrany
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: CZCIONKI & KARTY */}
              {activeTab === "fonts" && (
                <div className="space-y-6">
                  {/* Google Fonts Pairings */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Zestawy Typograficzne Google Fonts ({FONT_PAIRINGS.length})
                    </span>
                    <div className="space-y-2.5">
                      {FONT_PAIRINGS.map((f) => {
                        const isActive = config.fontId === f.id;
                        return (
                          <button
                            key={f.id}
                            onClick={() => update({ fontId: f.id })}
                            className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 hover:scale-[1.01] ${
                              isActive
                                ? "border-primary ring-2 ring-primary/40 shadow-md bg-primary/5"
                                : "border-border/60 bg-card hover:border-border"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm text-foreground">
                                {f.name}
                              </span>
                              {isActive && <Check className="w-4 h-4 text-primary" />}
                            </div>
                            <p className="text-[11px] text-muted-foreground mb-2">{f.subtitle}</p>

                            <div className="p-2.5 rounded-xl bg-background/50 border border-border/40">
                              <p className="text-base text-foreground font-serif" style={{ fontFamily: f.serif }}>
                                Anna Weronika Tomaszewska
                              </p>
                              <p className="text-[11px] text-muted-foreground" style={{ fontFamily: f.sans }}>
                                Aktorka · Modelka · Artystka
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Style */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                      Styl Kart na Całej Stronie
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CARD_STYLES.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => update({ cardStyle: c.id })}
                          className={`p-3 text-left rounded-xl border transition-all ${
                            config.cardStyle === c.id
                              ? "bg-primary text-primary-foreground border-primary shadow"
                              : "bg-card border-border hover:bg-muted/40"
                          }`}
                        >
                          <span className="block text-xs font-semibold">{c.name}</span>
                          <span className={`block text-[10px] mt-0.5 ${config.cardStyle === c.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            {c.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Radius & Grain */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Zaokrąglenie Rogów
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {RADIUS_OPTIONS.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => update({ radius: r.id })}
                            className={`py-2 px-2 text-xs rounded-xl border text-center font-medium transition-colors ${
                              config.radius === r.id
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border hover:bg-muted/40"
                            }`}
                          >
                            {r.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-card border border-border/50">
                      <div>
                        <span className="text-xs font-semibold block">Ziarno Fotograficzne</span>
                        <span className="text-[11px] text-muted-foreground block">Tekstura analogowej kliszy 35mm</span>
                      </div>
                      <button
                        onClick={() => update({ showGrain: !config.showGrain })}
                        className={`mt-2 py-1.5 px-3 rounded-xl text-xs font-medium border transition-colors ${
                          config.showGrain
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {config.showGrain ? "Włączone (Aktywne)" : "Wyłączone"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SEKCJA HERO */}
              {activeTab === "hero" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Wariant Układu Hero ({HERO_LAYOUTS.length})
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {HERO_LAYOUTS.map((h) => {
                        const isActive = config.heroLayout === h.id;
                        return (
                          <button
                            key={h.id}
                            onClick={() => update({ heroLayout: h.id })}
                            className={`text-left p-3.5 rounded-2xl border transition-all duration-200 ${
                              isActive
                                ? "border-primary ring-2 ring-primary/40 bg-primary/5 shadow"
                                : "border-border/60 bg-card hover:border-border"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-serif font-medium text-sm text-foreground">
                                {h.name}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-sans">
                                {h.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug">
                              {h.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Photo Scale */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Skala Zdjęcia Aktorki (Główny Motyw)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { id: "default" as const, label: "Duże (100%)" },
                          { id: "large" as const, label: "Bardzo duże (115%)" },
                          { id: "monumental" as const, label: "Monumentalne (130%)" },
                        ] as const
                      ).map(({ id, label }) => (
                        <button
                          key={id}
                          onClick={() => update({ heroScale: id })}
                          className={`py-2 px-3 text-xs rounded-xl border text-center font-medium transition-colors ${
                            config.heroScale === id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card border-border hover:bg-muted/40"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Photo Filter */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Filtr Artystyczny Portretu
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PHOTO_FILTERS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => update({ photoFilter: f.id })}
                          className={`p-2.5 text-left rounded-xl border transition-colors ${
                            config.photoFilter === f.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card border-border hover:bg-muted/40"
                          }`}
                        >
                          <span className="block text-xs font-medium">{f.name}</span>
                          <span className={`block text-[10px] ${config.photoFilter === f.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            {f.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Backlight Glow */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border/50">
                    <div>
                      <span className="text-sm font-medium block">
                        Kinowy Reflektor & Podświetlenie Hero
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        Klimatyczna świetlna aura za sylwetką aktorki
                      </span>
                    </div>
                    <button
                      onClick={() => update({ heroBacklight: !config.heroBacklight })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        config.heroBacklight ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          config.heroBacklight ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: SEKCJE 1 — O MNIE, CZYM SIĘ ZAJMUJĘ, ZAINTERESOWANIA, ŚCIEŻKA */}
              {activeTab === "sections1" && (
                <div className="space-y-6">
                  {/* Sekcja: O mnie */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                      <User className="w-4 h-4" />
                      <span>Sekcja „O mnie”</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ABOUT_LAYOUTS.map((item) => {
                        const isActive = config.aboutLayout === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => update({ aboutLayout: item.id })}
                            className={`text-left p-3.5 rounded-2xl border transition-all ${
                              isActive
                                ? "border-primary ring-2 ring-primary/40 bg-primary/5 shadow"
                                : "border-border/60 bg-card hover:border-border"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-xs text-foreground font-serif">{item.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-sans">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-snug">{item.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sekcja: Czym się zajmuję */}
                  <div className="space-y-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                      <Briefcase className="w-4 h-4" />
                      <span>Sekcja „Czym się zajmuję”</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {WHAT_I_DO_LAYOUTS.map((item) => {
                        const isActive = config.whatIDoLayout === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => update({ whatIDoLayout: item.id })}
                            className={`text-left p-3.5 rounded-2xl border transition-all ${
                              isActive
                                ? "border-primary ring-2 ring-primary/40 bg-primary/5 shadow"
                                : "border-border/60 bg-card hover:border-border"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-xs text-foreground font-serif">{item.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-sans">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-snug">{item.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sekcja: Zainteresowania */}
                  <div className="space-y-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                      <Sparkle className="w-4 h-4" />
                      <span>Sekcja „Zainteresowania”</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {INTERESTS_LAYOUTS.map((item) => {
                        const isActive = config.interestsLayout === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => update({ interestsLayout: item.id })}
                            className={`text-left p-3 rounded-xl border transition-all ${
                              isActive
                                ? "bg-primary text-primary-foreground border-primary shadow"
                                : "bg-card border-border hover:bg-muted/40"
                            }`}
                          >
                            <span className="block text-xs font-semibold">{item.name}</span>
                            <span className={`block text-[10px] mt-0.5 ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                              {item.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sekcja: Moja droga (Ścieżka) */}
                  <div className="space-y-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                      <Compass className="w-4 h-4" />
                      <span>Sekcja „Moja droga” (Timeline)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {PATH_LAYOUTS.map((item) => {
                        const isActive = config.pathLayout === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => update({ pathLayout: item.id })}
                            className={`text-left p-3 rounded-xl border transition-all ${
                              isActive
                                ? "bg-primary text-primary-foreground border-primary shadow"
                                : "bg-card border-border hover:bg-muted/40"
                            }`}
                          >
                            <span className="block text-xs font-semibold">{item.name}</span>
                            <span className={`block text-[10px] mt-0.5 ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                              {item.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SEKCJE 2 — GALERIA, OSIĄGNIĘCIA, KONTAKT */}
              {activeTab === "sections2" && (
                <div className="space-y-6">
                  {/* Sekcja: Galeria */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                      <ImageIcon className="w-4 h-4" />
                      <span>Sekcja „Galeria”</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {GALLERY_LAYOUTS.map((item) => {
                        const isActive = config.galleryLayout === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => update({ galleryLayout: item.id })}
                            className={`text-left p-3.5 rounded-2xl border transition-all ${
                              isActive
                                ? "border-primary ring-2 ring-primary/40 bg-primary/5 shadow"
                                : "border-border/60 bg-card hover:border-border"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-xs text-foreground font-serif">{item.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-sans">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-snug">{item.desc}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Gallery Hover Effect */}
                    <div className="pt-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Efekt najechania na zdjęcie
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {GALLERY_HOVER_EFFECTS.map((hov) => (
                          <button
                            key={hov.id}
                            onClick={() => update({ galleryHover: hov.id })}
                            className={`p-2 text-center rounded-xl border text-xs font-medium transition-colors ${
                              config.galleryHover === hov.id
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-card border-border hover:bg-muted/40"
                            }`}
                          >
                            {hov.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sekcja: Osiągnięcia i Współpraca */}
                  <div className="space-y-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                      <Trophy className="w-4 h-4" />
                      <span>Sekcja „Osiągnięcia i Zespół”</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {ACHIEVEMENTS_LAYOUTS.map((item) => {
                        const isActive = config.achievementsLayout === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => update({ achievementsLayout: item.id })}
                            className={`text-left p-3 rounded-xl border transition-all ${
                              isActive
                                ? "bg-primary text-primary-foreground border-primary shadow"
                                : "bg-card border-border hover:bg-muted/40"
                            }`}
                          >
                            <span className="block text-xs font-semibold">{item.name}</span>
                            <span className={`block text-[10px] mt-0.5 ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                              {item.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sekcja: Kontakt */}
                  <div className="space-y-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                      <Mail className="w-4 h-4" />
                      <span>Sekcja „Kontakt”</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {CONTACT_LAYOUTS.map((item) => {
                        const isActive = config.contactLayout === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => update({ contactLayout: item.id })}
                            className={`text-left p-3 rounded-xl border transition-all ${
                              isActive
                                ? "bg-primary text-primary-foreground border-primary shadow"
                                : "bg-card border-border hover:bg-muted/40"
                            }`}
                          >
                            <span className="block text-xs font-semibold">{item.name}</span>
                            <span className={`block text-[10px] mt-0.5 ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                              {item.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom summary footer */}
            <div className="p-4 border-t border-border/50 bg-background/50 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-serif italic">
                {currentTheme.name} · {config.heroLayout}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity shadow-md"
              >
                Zastosuj & Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
