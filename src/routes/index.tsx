import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, Counter } from "@/components/site/Reveal";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import {
  Trophy,
  Award,
  Languages,
  Sparkles,
  Mail,
  Phone,
  Instagram,
  Drama,
  Camera,
  Briefcase,
  Palette,
  FileText,
  User,
  ImageIcon,
  Facebook,
  Heart,
  Quote,
  Sparkle,
} from "lucide-react";
import galleryManifest from "../gallery-manifest.json";
import { ageFromBirth, RichText } from "@/lib/content";
import { ExtraBlocks } from "@/components/site/ExtraBlocks";
import { readHome, readSite } from "@/lib/content/load.server";

function GlitterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // 120 shimmering fine glitter specks (drobinki brokatu)
    const count = 130;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * (width || 1200),
      y: Math.random() * (height || 800),
      size: Math.random() * 2.2 + 0.8, // drobinki od 0.8px do 3.0px
      baseAlpha: Math.random() * 0.35 + 0.15,
      sparkleSpeed: Math.random() * 0.045 + 0.018,
      phase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.25,
      driftY: -Math.random() * 0.22 - 0.06,
      color: [
        "255, 235, 205", // champagne gold
        "255, 255, 255", // diamond white
        "232, 200, 245", // pastel lilac
        "255, 218, 228", // rose gold
        "240, 230, 255", // opal crystal
      ][Math.floor(Math.random() * 5)],
      isStar: Math.random() > 0.62, // diamond 4-pointed stars
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.phase += p.sparkleSpeed;
        p.x += p.driftX;
        p.y += p.driftY;

        // Wrap around smoothly
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Exponential shimmering pulse curve for sharp sparkling flare
        const sinVal = (Math.sin(p.phase) + 1) / 2; // 0 to 1
        const sparkleIntensity = Math.pow(sinVal, 3.2); // peak shimmer
        const alpha = Math.min(1, p.baseAlpha * 0.4 + sparkleIntensity * 0.85);

        if (alpha <= 0.03) continue;

        ctx.save();
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.shadowColor = `rgba(${p.color}, ${alpha * 0.9})`;
        ctx.shadowBlur = (p.size * 2 + 3) * (0.4 + sparkleIntensity * 0.8);

        if (p.isStar && sparkleIntensity > 0.25) {
          // 4-point diamond sparkle star
          const arm = p.size * (1.2 + sparkleIntensity * 2.2);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - arm);
          ctx.quadraticCurveTo(p.x, p.y, p.x + arm, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + arm);
          ctx.quadraticCurveTo(p.x, p.y, p.x - arm, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - arm);
          ctx.fill();

          // Intense core dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha + 0.3)})`;
          ctx.fill();
        } else {
          // Circular glistening speck
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (0.8 + sparkleIntensity * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      style={{ opacity: 0.95 }}
    />
  );
}

const WHAT_I_DO_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  acting: Drama,
  modeling: Camera,
  management: Briefcase,
  art: Palette,
};

const ACHIEVEMENT_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  award: Award,
  languages: Languages,
  sparkles: Sparkles,
};

export const Route = createFileRoute("/")({
  loader: () => ({ home: readHome(), site: readSite() }),
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { home, site } = loaderData;
    return {
      meta: [
        { title: home.seo.title },
        { name: "description", content: home.seo.description },
        { property: "og:title", content: home.seo.ogTitle },
        { property: "og:description", content: home.seo.ogDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${site.siteUrl}/` },
        { property: "og:image", content: home.hero.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: home.hero.image },
      ],
      links: [{ rel: "canonical", href: `${site.siteUrl}/` }],
    };
  },
  component: Index,
});

function Index() {
  const { home, site } = Route.useLoaderData();
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [galleryTab, setGalleryTab] = useState<"me" | "works">("me");

  const age = useMemo(
    () => ageFromBirth(site.birthYear, site.birthMonth),
    [site.birthYear, site.birthMonth],
  );

  const isStaticExport =
    galleryManifest.generated !== "never" && galleryManifest.galleryMe.length > 0;
  const galleryMe = isStaticExport ? galleryManifest.galleryMe : home.gallery.me;
  const galleryWorks = isStaticExport ? galleryManifest.galleryWorks : home.gallery.works;
  const gallery = galleryTab === "me" ? galleryMe : galleryWorks;

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <main className="grain min-h-screen text-foreground relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-card/75 border-b border-border/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#top" className="font-serif italic text-2xl tracking-wide text-foreground flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
            {site.shortName}
          </a>
          <div className="hidden md:flex gap-8 text-sm text-muted-foreground items-center">
            {home.nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/cv"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-medium text-xs tracking-wider uppercase"
            >
              <FileText className="w-3.5 h-3.5" /> {home.nav.cvLabel}
            </Link>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 1. HERO — OKŁADKA MAGAZYNU 3D VOGUE Z MONUMENTALNYM ZDJĘCIEM */}
      {/* ========================================================================= */}
      <section id="top" className="mesh-bg relative overflow-hidden pt-20 pb-12 md:pt-24 md:pb-16 min-h-[92vh] flex flex-col justify-center items-center">
        {/* Real Shimmering Glitter Specks (Drobinki Brokatu) */}
        <GlitterCanvas />

        {/* Ambient Backlight Aura behind hero */}
        <div className="absolute w-[450px] h-[450px] md:w-[680px] md:h-[680px] rounded-full bg-primary/20 blur-3xl -z-10 pointer-events-none" />

        {/* Content shifted slightly up while preserving exact layout */}
        <div className="max-w-7xl mx-auto px-6 w-full relative flex-1 flex flex-col justify-center items-center -translate-y-3 sm:-translate-y-5 md:-translate-y-7">
          {/* Giant 3D Background Typography */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -z-0">
            <span className="font-serif text-6xl sm:text-8xl md:text-[11rem] lg:text-[14rem] font-bold uppercase tracking-tight text-foreground/10 leading-none text-center">
              TOMASZEWSKA
            </span>
          </div>

          {/* Atmospheric Backlight Aura */}
          <div className="absolute w-[450px] h-[450px] md:w-[680px] md:h-[680px] rounded-full bg-primary/20 blur-3xl -z-10" />

          {/* Foreground 3D Magazine Grid */}
          <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-8 my-auto">
            {/* Left Column: Intro & Primary CTA */}
            <div className="w-full lg:w-1/4 text-center lg:text-left space-y-6 md:space-y-8 animate-drift-in">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-[0.25em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {home.hero.kicker}
                </span>
              </div>

              <div>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.12]">
                  {home.hero.firstName}
                  <br />
                  <span className="italic text-primary">{home.hero.lastName}</span>
                </h1>
              </div>

              <div>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light">
                  <span className="font-semibold text-foreground">{age}</span>-{home.hero.leadAfterAge}
                </p>
              </div>

              <div className="pt-2 md:pt-4">
                <a
                  href="#kontakt"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
                >
                  {home.hero.ctaPrimary}
                </a>
              </div>
            </div>

            {/* Center: Monumental Cutout Portrait (130% Dominant Focus) */}
            <div className="relative flex justify-center animate-float-slow">
              <img
                src={home.hero.image}
                alt={home.hero.imageAlt}
                className="h-[540px] sm:h-[650px] md:h-[760px] lg:h-[840px] xl:h-[900px] w-auto object-contain drop-shadow-[0_35px_55px_rgba(0,0,0,0.25)] select-none pointer-events-none"
                style={{
                  WebkitMaskImage: "linear-gradient(to bottom, black 84%, transparent 100%)",
                  maskImage: "linear-gradient(to bottom, black 84%, transparent 100%)",
                }}
              />
            </div>

            {/* Right Column: Roles & Secondary CTA */}
            <div className="w-full lg:w-1/4 text-center lg:text-right space-y-6 md:space-y-8 animate-drift-in">
              <div className="p-6 rounded-3xl bg-card/80 backdrop-blur-md border border-border/60 shadow-lg text-left inline-block lg:block space-y-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-primary block">
                  Profil Twórczy
                </span>
                <p className="text-lg font-serif text-foreground font-medium">{home.hero.roles}</p>
                <p className="text-xs text-muted-foreground">Plany filmowe · Scena teatralna · Sztuka</p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <a
                  href="#galeria"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border/80 bg-card/60 backdrop-blur-sm text-xs font-semibold tracking-widest uppercase hover:bg-card transition-all shadow-sm"
                >
                  {home.hero.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ExtraBlocks blocks={home.extra} after="hero" />

      {/* ========================================================================= */}
      {/* 2. O MNIE — MAGAZYN STORY & 2 KOLUMNY */}
      {/* ========================================================================= */}
      <section id="o-mnie" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">{home.about.kicker}</p>
              <h2 className="text-4xl md:text-6xl font-serif leading-tight">{home.about.title}</h2>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left: Portrait */}
            <div className="lg:col-span-5 relative space-y-6">
              <Reveal>
                <div className="relative">
                  <div className="absolute -inset-3 bg-primary/20 rounded-3xl -rotate-1 blur-xs" />
                  <img
                    src={home.about.image}
                    alt={home.about.imageAlt}
                    className="relative rounded-3xl object-cover aspect-[3/4] w-full shadow-2xl border-2 border-border/60"
                  />
                </div>
              </Reveal>
            </div>

            {/* Right: Editorial Story & Quote Box underneath */}
            <div className="lg:col-span-7 space-y-8 text-lg text-muted-foreground leading-relaxed font-light">
              <Reveal delay={100}>
                <div className="space-y-6">
                  {home.about.paragraphs.map((p, idx) => (
                    <p
                      key={p}
                      className={
                        idx === 0
                          ? "text-xl text-foreground font-normal leading-relaxed first-letter:text-6xl first-letter:font-serif first-letter:text-primary first-letter:mr-3 first-letter:float-left"
                          : "text-base md:text-lg"
                      }
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={150}>
                <div className="p-7 md:p-8 rounded-3xl bg-card border border-border/60 shadow-xl flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shadow-sm">
                    <Quote className="w-5 h-5" />
                  </div>
                  <p className="italic text-base md:text-lg leading-relaxed text-foreground/90 font-serif">
                    „{home.about.quote}”
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ExtraBlocks blocks={home.extra} after="o-mnie" />

      {/* ========================================================================= */}
      {/* 3. CZYM SIĘ ZAJMUJĘ — SIATKA 4 KOLUMN */}
      {/* ========================================================================= */}
      <section id="czym" className="py-24 md:py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">{home.whatIDo.kicker}</p>
            <h2 className="text-4xl md:text-5xl mb-16 max-w-2xl leading-tight font-serif">
              {home.whatIDo.titleBefore}
              {home.whatIDo.titleHighlight ? (
                <span className="italic text-primary bg-primary/15 px-3 py-0.5 rounded-md ml-2 inline-block">
                  {home.whatIDo.titleHighlight}
                </span>
              ) : null}
              {home.whatIDo.titleAfter}
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {home.whatIDo.items.map((c, i) => {
              const Icon = WHAT_I_DO_ICONS[c.id] ?? Sparkles;
              return (
                <Reveal key={c.id} delay={i * 100}>
                  <div className="soft-card rounded-3xl p-7 h-full hover:-translate-y-2 transition-all duration-300">
                    {c.image ? (
                      <img src={c.image} alt="" className="w-full h-40 object-cover rounded-2xl mb-5 shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary mb-6 flex items-center justify-center shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                    )}
                    <h3 className="text-2xl mb-3 text-foreground font-serif">{c.title}</h3>
                    <RichText
                      text={c.description}
                      className="text-sm text-muted-foreground leading-relaxed font-light"
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <ExtraBlocks blocks={home.extra} after="czym" />

      {/* STATS */}
      {home.stats && home.stats.length > 0 && (
        <>
          <section className="py-24 md:py-32">
            <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
              {home.stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 120}>
                  <div>
                    <div className="font-serif text-6xl md:text-7xl text-primary mb-3">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-lg mb-2 font-medium font-serif">{s.label}</div>
                    <p className="text-sm text-muted-foreground max-w-[220px] mx-auto leading-relaxed font-light">
                      {s.note}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
          <ExtraBlocks blocks={home.extra} after="stats" />
        </>
      )}

      {/* ========================================================================= */}
      {/* 4. GALERIA — DYNAMICZNE MASONRY Z PŁYNNYM ZOOMEM */}
      {/* ========================================================================= */}
      <section id="galeria" className="py-24 md:py-32 mesh-bg">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">{home.gallery.kicker}</p>
            <h2 className="text-4xl md:text-5xl mb-6 max-w-2xl leading-tight font-serif">{home.gallery.title}</h2>
            <p className="text-muted-foreground max-w-xl mb-10 leading-relaxed font-light">{home.gallery.lead}</p>
          </Reveal>

          {/* Tab Selector */}
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-1.5 p-1.5 mb-10 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg">
              {(
                [
                  { key: "me" as const, label: home.gallery.tabMe, Icon: User },
                  { key: "works" as const, label: home.gallery.tabWorks, Icon: ImageIcon },
                ] as const
              ).map(({ key, label, Icon }) => {
                const active = galleryTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setGalleryTab(key)}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Dynamic Masonry Columns */}
          <div key={galleryTab} className="columns-2 md:columns-3 gap-6 space-y-6 animate-drift-in">
            {gallery.map((g, i) => (
              <Reveal key={g.src} delay={i * 60}>
                <button
                  onClick={() => setLightbox(g.src)}
                  className="gallery-card relative block w-full break-inside-avoid overflow-hidden rounded-3xl group shadow-md hover:shadow-2xl transition-all duration-500 border border-border/40"
                >
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="gallery-card-img w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ExtraBlocks blocks={home.extra} after="galeria" />

      {/* ========================================================================= */}
      {/* 5. MOJA DROGA — PIONOWA OŚ CZASU */}
      {/* ========================================================================= */}
      <section id="sciezka" className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">{home.path.kicker}</p>
            <h2 className="text-4xl md:text-5xl mb-16 leading-tight font-serif">{home.path.title}</h2>
          </Reveal>

          <div className="relative pl-8 md:pl-12 border-l-2 border-primary/30 space-y-12">
            {home.path.items.map((e, i) => (
              <Reveal key={`${e.period}-${e.title}`} delay={i * 80}>
                <div className="relative">
                  <span className="absolute -left-[41px] md:-left-[57px] top-2 w-4 h-4 rounded-full bg-primary ring-4 ring-background shadow-md" />
                  <p className="text-xs tracking-[0.2em] uppercase font-semibold text-primary mb-2 font-mono">{e.period}</p>
                  <h3 className="text-2xl mb-2 font-serif text-foreground">{e.title}</h3>
                  {e.image ? (
                    <img src={e.image} alt="" className="w-full max-w-md rounded-2xl object-cover mb-3 shadow-md border border-border/40" />
                  ) : null}
                  <p className="text-muted-foreground leading-relaxed font-light">{e.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ExtraBlocks blocks={home.extra} after="sciezka" />

      {/* ========================================================================= */}
      {/* 6. ZAINTERESOWANIA — PŁYWAJĄCE PIGUŁKI HASHTAGÓW */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <img
          src={home.interests.backgroundImage}
          alt=""
          aria-hidden
          className="absolute bottom-0 h-[520px] w-auto opacity-20 pointer-events-none hidden lg:block right-[4rem] xl:right-[6rem] 2xl:right-[8rem]"
        />
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">{home.interests.kicker}</p>
            <h2 className="text-4xl md:text-5xl mb-6 leading-tight font-serif">{home.interests.title}</h2>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-wrap gap-3">
              {home.interests.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-6 py-2.5 rounded-full bg-card border border-border/80 text-foreground text-sm font-medium tracking-wide hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 cursor-default shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="p-7 rounded-3xl bg-card/75 backdrop-blur-md border border-border/60 shadow-lg max-w-2xl">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic font-serif">
                „{home.interests.note}”
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <ExtraBlocks blocks={home.extra} after="interests" />

      {/* ========================================================================= */}
      {/* 7. OSIĄGNIĘCIA I ZESPÓŁ — ZŁOTA LISTA ODZNAK */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary">{home.achievements.kicker}</p>
              <h3 className="text-4xl md:text-5xl font-serif">{home.achievements.title}</h3>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-12 gap-10 items-start">
            {/* Left: Prestigious Badge List */}
            <div className="md:col-span-7 space-y-5">
              {/* Featured DI Winner */}
              <Reveal>
                <div className="p-8 rounded-3xl bg-card border-2 border-primary/40 shadow-xl flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md">
                    <Trophy className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-primary font-bold block mb-1">
                      {home.achievements.featuredKicker}
                    </span>
                    <RichText as="h4" text={home.achievements.featuredTitle} className="text-2xl md:text-3xl font-serif mb-2 text-foreground" />
                    <RichText text={home.achievements.featuredDescription} className="text-sm text-muted-foreground font-light leading-relaxed" />
                  </div>
                </div>
              </Reveal>

              {/* Badges List */}
              {home.achievements.items.map((item, idx) => {
                const Icon = ACHIEVEMENT_ICONS[item.icon] ?? Sparkles;
                return (
                  <Reveal key={item.text} delay={idx * 80}>
                    <div className="p-6 rounded-3xl bg-card/80 border border-border/60 shadow-md flex gap-5 items-start hover:border-primary/50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <RichText as="div" text={item.text} className="text-sm md:text-base text-foreground font-light leading-relaxed pt-1" />
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Right: Teamwork & Communication */}
            <div className="md:col-span-5 p-8 md:p-10 rounded-3xl bg-card/90 border border-border/60 shadow-xl space-y-6">
              <Reveal delay={150}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wider">
                  <Languages className="w-3.5 h-3.5" />
                  {home.teamwork.kicker}
                </div>
                <h4 className="text-3xl font-serif mt-2">{home.teamwork.title}</h4>
                <div className="space-y-4 text-muted-foreground leading-relaxed font-light text-base">
                  {home.teamwork.paragraphs.map((p) => (
                    <RichText key={p} text={p} />
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ExtraBlocks blocks={home.extra} after="achievements" />

      {/* ========================================================================= */}
      {/* 8. KONTAKT — WYCENTROWANY MINIMALIZM */}
      {/* ========================================================================= */}
      <section id="kontakt" className="mesh-bg py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-6">{home.contact.kicker}</p>
            <h2 className="font-serif text-5xl md:text-6xl mb-6 leading-tight">
              {home.contact.titleBefore}
              <span className="italic text-primary ml-2">{home.contact.titleItalic}</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed font-light text-lg">
              {home.contact.lead}
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <a
                href={`mailto:${site.contact.email}`}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-wide hover:opacity-95 transition-all hover:scale-105 shadow-xl"
              >
                <Mail className="w-4 h-4" /> {site.contact.email}
              </a>
              <a
                href={`tel:${site.contact.phoneHref}`}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-border/80 bg-card/70 backdrop-blur-md text-sm font-medium tracking-wide hover:bg-card transition-all hover:scale-105 shadow-sm"
              >
                <Phone className="w-4 h-4" /> {site.contact.phone}
              </a>
              <a
                href={site.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-border/80 bg-card/70 backdrop-blur-md text-sm font-medium tracking-wide hover:bg-card transition-all hover:scale-105 shadow-sm"
              >
                <Instagram className="w-4 h-4" /> @{site.contact.instagram}
              </a>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-mono">
              {home.contact.footerLocations}
            </p>
          </Reveal>
        </div>
      </section>

      <ExtraBlocks blocks={home.extra} after="kontakt" />

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="py-12 border-t border-border/40 bg-card/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="font-serif italic text-lg tracking-wide text-foreground">{site.footerBrand}</span>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <a
                href={site.contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5 text-primary" />
                <span>Facebook</span>
              </a>
              <a
                href={site.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-primary" />
                <span>Instagram</span>
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>Email</span>
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-muted-foreground">
            <Link
              to="/poradnik-wizytowka"
              className="hover:text-foreground transition-colors underline decoration-primary/40 underline-offset-2"
            >
              poradnik wizytówka
            </Link>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <p className="font-serif italic">
              © {new Date().getFullYear()} {site.name}
            </p>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <a
              href={site.footer.creditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors group"
            >
              <span>{site.footer.creditLabel}</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline group-hover:scale-110 transition-transform" />
              <span className="underline decoration-primary/40 underline-offset-2">jifo.dev</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Lightbox for Gallery */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-drift-in"
        >
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-full rounded-3xl shadow-2xl border border-white/20" />
        </div>
      )}
    </main>
  );
}
