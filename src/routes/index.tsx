import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, Counter } from "@/components/site/Reveal";
import { useEffect, useMemo, useState, type ComponentType } from "react";
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
} from "lucide-react";
import galleryManifest from "../gallery-manifest.json";
import { ageFromBirth, RichText } from "@/lib/content";
import { readHome, readSite } from "@/lib/content/load.server";

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
    <main className="grain min-h-screen text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-cream/60 border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#top" className="font-serif italic text-lg tracking-wide">
            {site.shortName}
          </a>
          <div className="hidden md:flex gap-8 text-sm text-muted-foreground items-center">
            {home.nav.links.map((link) =>
              link.route ? (
                <Link
                  key={link.href}
                  to={link.href as "/poradnik-wizytowka"}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ),
            )}
            <Link
              to="/cv"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/10 border border-sage/30 text-sage hover:bg-sage/20 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> {home.nav.cvLabel}
            </Link>
          </div>
        </div>
      </nav>

      <section id="top" className="mesh-bg relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative">
          <div className="animate-drift-in">
            <p className="text-sm tracking-[0.3em] uppercase text-sage mb-6">{home.hero.kicker}</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">
              {home.hero.firstName}
              <br />
              <span className="italic text-sage">{home.hero.lastName}</span>
              <span className="block text-base md:text-lg font-normal font-sans text-muted-foreground mt-3 tracking-normal">
                {home.hero.roles}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed mb-8">
              {age}-{home.hero.leadAfterAge}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#kontakt"
                className="px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]"
              >
                {home.hero.ctaPrimary}
              </a>
              <a
                href="#galeria"
                className="px-6 py-3 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors"
              >
                {home.hero.ctaSecondary}
              </a>
            </div>
          </div>
          <div className="relative flex justify-center md:justify-end">
            <div className="absolute inset-0 mesh-bg blur-3xl opacity-60 -z-10" />
            <img
              src={home.hero.image}
              alt={home.hero.imageAlt}
              className="max-h-[560px] w-auto object-contain animate-float-slow drop-shadow-[0_30px_40px_rgba(0,0,0,0.15)]"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </section>

      <section id="o-mnie" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl p-8 md:p-16 bg-gradient-to-br from-[oklch(0.975_0.012_235)] via-[oklch(0.98_0.008_230)] to-[oklch(0.97_0.015_215)] border border-[oklch(0.9_0.02_230)]/50 shadow-[0_30px_70px_-45px_oklch(0.55_0.05_235/0.25)]">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <Reveal>
                <div className="relative">
                  <div className="absolute -inset-4 bg-rose/40 rounded-3xl -rotate-2" />
                  <img
                    src={home.about.image}
                    alt={home.about.imageAlt}
                    className="relative rounded-2xl object-cover aspect-[4/5] w-full"
                  />
                </div>
              </Reveal>
              <Reveal delay={150}>
                <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">{home.about.kicker}</p>
                <h2 className="text-4xl md:text-5xl mb-8">{home.about.title}</h2>
                <div className="space-y-5 text-[1.0625rem] md:text-lg text-muted-foreground leading-relaxed">
                  {home.about.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <div className="mt-12 md:mt-16 rounded-2xl p-7 md:p-10 bg-gradient-to-br from-[oklch(0.97_0.015_230)] via-cream/60 to-[oklch(0.96_0.02_25)]/60 border border-sage/15">
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-11 h-11 rounded-full bg-sage/15 text-sage flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p
                    className="italic text-base md:text-lg leading-relaxed text-foreground/85"
                    style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 300 }}
                  >
                    {home.about.quote}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="czym" className="py-24 md:py-32 bg-gradient-to-b from-transparent via-rose/10 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">{home.whatIDo.kicker}</p>
            <h2 className="text-4xl md:text-5xl mb-16 max-w-2xl">
              {home.whatIDo.titleBefore}
              <span className="italic text-sage bg-gradient-to-r from-sage/20 to-rose/40 px-3 rounded-md">
                {home.whatIDo.titleHighlight}
              </span>
              {home.whatIDo.titleAfter}
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {home.whatIDo.items.map((c, i) => {
              const Icon = WHAT_I_DO_ICONS[c.id] ?? Sparkles;
              return (
                <Reveal key={c.id} delay={i * 100}>
                  <div className="soft-card rounded-2xl p-7 h-full hover:-translate-y-1 transition-transform duration-500">
                    <div className="w-11 h-11 rounded-2xl bg-sage/15 text-sage mb-6 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl mb-3">{c.title}</h3>
                    <RichText
                      text={c.description}
                      className="text-sm text-muted-foreground leading-relaxed"
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          {home.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 120}>
              <div>
                <div className="font-serif text-6xl md:text-7xl text-sage mb-3">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-lg mb-2">{s.label}</div>
                <p className="text-sm text-muted-foreground max-w-[220px] mx-auto leading-relaxed">
                  {s.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="galeria" className="py-24 md:py-32 mesh-bg">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">{home.gallery.kicker}</p>
            <h2 className="text-4xl md:text-5xl mb-6 max-w-2xl">{home.gallery.title}</h2>
            <p className="text-muted-foreground max-w-xl mb-10 leading-relaxed">{home.gallery.lead}</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-1 p-1 mb-10 rounded-full bg-cream/70 border border-sage/20 shadow-[0_10px_30px_-20px_oklch(0.4_0.02_40/0.3)]">
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
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm tracking-wide transition-all ${active ? "bg-sage text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                );
              })}
            </div>
          </Reveal>
          <div key={galleryTab} className="columns-2 md:columns-3 gap-4 space-y-4 animate-drift-in">
            {gallery.map((g, i) => (
              <Reveal key={g.src} delay={i * 60}>
                <button
                  onClick={() => setLightbox(g.src)}
                  className="block w-full break-inside-avoid overflow-hidden rounded-xl group"
                >
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="sciezka" className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">{home.path.kicker}</p>
            <h2 className="text-4xl md:text-5xl mb-16">{home.path.title}</h2>
          </Reveal>
          <div className="relative pl-8 md:pl-12 border-l border-sage/30 space-y-12">
            {home.path.items.map((e, i) => (
              <Reveal key={`${e.period}-${e.title}`} delay={i * 80}>
                <div className="relative">
                  <span className="absolute -left-[41px] md:-left-[57px] top-2 w-3 h-3 rounded-full bg-sage ring-4 ring-cream" />
                  <p className="text-xs tracking-[0.2em] uppercase text-sage mb-2">{e.period}</p>
                  <h3 className="text-2xl mb-2">{e.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{e.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 relative overflow-hidden">
        <img
          src={home.interests.backgroundImage}
          alt=""
          aria-hidden
          className="absolute bottom-0 h-[500px] w-auto opacity-30 pointer-events-none hidden lg:block right-[4rem] xl:right-[6rem] 2xl:right-[8rem]"
        />
        <div className="max-w-4xl mx-auto px-6 relative">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">{home.interests.kicker}</p>
            <h2 className="text-4xl md:text-5xl mb-10">{home.interests.title}</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-3 mb-12">
              {home.interests.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-5 py-2 rounded-full bg-rose/40 text-sm tracking-wide hover:bg-rose/60 transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed italic font-serif">
              {home.interests.note}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-gradient-to-b from-transparent via-sage/5 to-transparent">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">{home.achievements.kicker}</p>
            <h3 className="text-3xl mb-8">{home.achievements.title}</h3>
            <div className="relative rounded-2xl p-6 mb-6 bg-gradient-to-br from-rose/70 via-cream to-sage/25 border border-sage/30 shadow-[0_25px_60px_-30px_oklch(0.4_0.04_155/0.4)] overflow-hidden">
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-sage/15 blur-2xl" />
              <div className="relative flex items-start gap-4">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-sage text-primary-foreground flex items-center justify-center shadow-lg">
                  <Trophy className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.25em] uppercase text-sage mb-2">
                    {home.achievements.featuredKicker}
                  </p>
                  <RichText
                    as="h4"
                    text={home.achievements.featuredTitle}
                    className="font-serif text-2xl md:text-3xl mb-2 text-foreground"
                  />
                  <RichText
                    text={home.achievements.featuredDescription}
                    className="text-sm text-muted-foreground leading-relaxed"
                  />
                </div>
              </div>
            </div>
            <ul className="space-y-4 text-muted-foreground">
              {home.achievements.items.map((item) => {
                const Icon = ACHIEVEMENT_ICONS[item.icon] ?? Sparkles;
                return (
                  <li key={item.text} className="flex gap-4 items-start">
                    <span className="shrink-0 w-9 h-9 rounded-full bg-rose/50 flex items-center justify-center text-sage">
                      <Icon className="w-4 h-4" />
                    </span>
                    <RichText as="span" text={item.text} />
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">{home.teamwork.kicker}</p>
            <h3 className="text-3xl mb-8">{home.teamwork.title}</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {home.teamwork.paragraphs.map((p) => (
                <RichText key={p} text={p} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="kontakt" className="mesh-bg py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-6">{home.contact.kicker}</p>
            <h2 className="font-serif text-5xl md:text-6xl mb-6">
              {home.contact.titleBefore}
              <span className="italic">{home.contact.titleItalic}</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
              {home.contact.lead}
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <a
                href={`mailto:${site.contact.email}`}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]"
              >
                <Mail className="w-4 h-4" /> {site.contact.email}
              </a>
              <a
                href={`tel:${site.contact.phoneHref}`}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors"
              >
                <Phone className="w-4 h-4" /> {site.contact.phone}
              </a>
              <a
                href={site.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors"
              >
                <Instagram className="w-4 h-4" /> @{site.contact.instagram}
              </a>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              {home.contact.footerLocations}
            </p>
          </Reveal>
        </div>
      </section>

      <footer className="py-12 border-t border-border/40 bg-cream/40">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="font-serif italic text-base tracking-wide text-foreground">{site.footerBrand}</span>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <a
                href={site.contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5 text-sage" />
                <span>Facebook</span>
              </a>
              <a
                href={site.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-sage" />
                <span>Instagram</span>
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-3.5 h-3.5 text-sage" />
                <span>Email</span>
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-muted-foreground">
            <Link
              to="/poradnik-wizytowka"
              className="hover:text-foreground transition-colors underline decoration-sage/40 underline-offset-2"
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
              <span className="underline decoration-sage/40 underline-offset-2">jifo.dev</span>
            </a>
          </div>
        </div>
      </footer>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-6 animate-drift-in"
        >
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-full rounded-lg shadow-2xl" />
        </div>
      )}
    </main>
  );
}
