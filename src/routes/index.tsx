import { createFileRoute } from "@tanstack/react-router";
import { Reveal, Counter } from "@/components/site/Reveal";
import { useEffect, useState } from "react";
import { Trophy, Award, Languages, Palette, Camera, Film, Gem, Users, Music, BookOpen, Sparkles, Brain, Megaphone } from "lucide-react";


import meHero from "@/assets/photos/me-nobg.png.asset.json";
import zaraModel from "@/assets/photos/Ok_Zara_model_nobg.png.asset.json";
import peaceful from "@/assets/photos/Peaceful_evening-me.jpg.asset.json";
import guitar from "@/assets/photos/guitar-me.jpg.asset.json";
import silver from "@/assets/photos/Silver_glitter-me.jpg.asset.json";
import orchid from "@/assets/photos/Orchid-me.jpg.asset.json";
import movieSet from "@/assets/photos/Movie_set_life.jpg.asset.json";
import painting from "@/assets/photos/Late-night_painting.jpg.asset.json";
import rose from "@/assets/photos/Dried_rose_in_the_golden_hour.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

const gallery = [
  { src: orchid.url, alt: "Portret z białą orchideą", tall: true },
  { src: movieSet.url, alt: "Kadr z planu filmowego" },
  { src: painting.url, alt: "Malarstwo, obraz w toku", tall: true },
  { src: guitar.url, alt: "Z gitarą w białej sukni" },
  { src: silver.url, alt: "Srebrny brokat, sesja portretowa", tall: true },
  { src: peaceful.url, alt: "Wieczorne czytanie przy oknie" },
  { src: rose.url, alt: "Sucha róża w złotej godzinie", tall: true },
];

function Index() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <main className="grain min-h-screen text-foreground">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-cream/60 border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#top" className="font-serif italic text-lg tracking-wide">Ania Tomaszewska</a>
          <div className="hidden md:flex gap-8 text-sm text-muted-foreground">
            <a href="#o-mnie" className="hover:text-foreground transition-colors">o mnie</a>
            <a href="#czym" className="hover:text-foreground transition-colors">czym się zajmuję</a>
            <a href="#galeria" className="hover:text-foreground transition-colors">galeria</a>
            <a href="#sciezka" className="hover:text-foreground transition-colors">ścieżka</a>
            <a href="#kontakt" className="hover:text-foreground transition-colors">kontakt</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" className="mesh-bg relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative">
          <div className="animate-drift-in">
            <p className="text-sm tracking-[0.3em] uppercase text-sage mb-6">Warszawa · Gdynia · w drodze</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">
              Anna Weronika<br/>
              <span className="italic text-sage">Tomaszewska</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed mb-8">
              Aktorka, artystka, obserwatorka. 21 lat, głowa pełna kadrów, płócien i ludzi, których jeszcze nie zagrałam.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#kontakt" className="px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]">Napisz do mnie</a>
              <a href="#galeria" className="px-6 py-3 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors">Zobacz galerię</a>
            </div>
          </div>
          <div className="relative flex justify-center md:justify-end">
            <div className="absolute inset-0 mesh-bg blur-3xl opacity-60 -z-10" />
            <img
              src={meHero.url}
              alt="Ania"
              className="max-h-[560px] w-auto object-contain animate-float-slow drop-shadow-[0_30px_40px_rgba(0,0,0,0.15)]"
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="o-mnie" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-5 gap-12 items-center">
          <Reveal className="md:col-span-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-rose/40 rounded-3xl -rotate-2" />
              <img src={orchid.url} alt="Ania z orchideą" className="relative rounded-2xl object-cover aspect-[3/4] w-full" />
            </div>
          </Reveal>
          <Reveal className="md:col-span-3" delay={150}>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">o mnie</p>
            <h2 className="text-4xl md:text-5xl mb-8">Lubię swój święty spokój, ale wyzwania kocham jeszcze bardziej.</h2>
            <div className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p>Jestem z Warszawy, z Bemowa. Często jednak znajduję mnie ktoś w Gdyni, bo tam też mam swoje miejsce. Jeżdżę po Polsce z małym aparatem w torbie i wracam z tym, co warto zapamiętać.</p>
              <p>Radzę sobie z presją. Na scenie, na egzaminie, w ciężki dzień za barem. Nie ugina mnie tłum ani kamera, mówię publicznie tak samo spokojnie, jak piszę.</p>
              <p>Najlepiej pracuje mi się przy czymś artystycznym i konkretnym jednocześnie. Plany filmowe, sesje, projekty, które mają rytm i sens. Reszta czasu należy do książek, farby i cichej obserwacji.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT I DO */}
      <section id="czym" className="py-24 md:py-32 bg-gradient-to-b from-transparent via-rose/10 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">czym się zajmuję</p>
            <h2 className="text-4xl md:text-5xl mb-16 max-w-2xl">Cztery rzeczy, które robię serio.</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: "Aktorstwo", d: "Od 2023 przed kamerą. Warsztat u Łukasza Zubrzyckiego, weekendowy tryb w Warszawskim Studium Aktorskim. Egzaminy do szkół artystycznych już w drodze." },
              { t: "Modeling", d: "Byłam twarzą wielu sesji zdjęciowych. Dobrze czuję się przed aparatem, kamerą i światłem. Zgłaszałam się do agencji, bywam po drugiej stronie obiektywu." },
              { t: "Zarządzanie", d: "Green Caffe Nero, baristka od października 2024, kierowniczka zmiany od października 2025. Pięcie się po szczeblach wyszło naturalnie." },
              { t: "Sztuka", d: "Ponad sto skończonych prac plastycznych. Farba, płótno, nocne siedzenie do rana, kiedy obraz w końcu zaczyna oddychać." },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 100}>
                <div className="soft-card rounded-2xl p-7 h-full hover:-translate-y-1 transition-transform duration-500">
                  <div className="w-10 h-10 rounded-full bg-rose/50 mb-6 animate-shimmer" />
                  <h3 className="text-2xl mb-3">{c.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          {[
            { n: 20, s: "+", label: "planów filmowych", note: "na których byłam, uczyłam się rytmu i ciszy między ujęciami" },
            { n: 100, s: "+", label: "prac plastycznych", note: "od szkiców po skończone płótna, każde z własnym nastrojem" },
            { n: 2, s: "+", label: "lata na scenie aktorskiej", note: "kursy, warsztaty, plany, mikrofon w ręku" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 120}>
              <div>
                <div className="font-serif text-6xl md:text-7xl text-sage mb-3">
                  <Counter to={s.n} suffix={s.s} />
                </div>
                <div className="text-lg mb-2">{s.label}</div>
                <p className="text-sm text-muted-foreground max-w-[220px] mx-auto leading-relaxed">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="galeria" className="py-24 md:py-32 mesh-bg">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">galeria</p>
            <h2 className="text-4xl md:text-5xl mb-6 max-w-2xl">Kadry z drogi.</h2>
            <p className="text-muted-foreground max-w-xl mb-14 leading-relaxed">Wożę ze sobą mały aparat i łapię to, co warte zapamiętania. Trochę planu, trochę farby, trochę siebie.</p>
          </Reveal>
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
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

      {/* PATH / TIMELINE */}
      <section id="sciezka" className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">ścieżka</p>
            <h2 className="text-4xl md:text-5xl mb-16">Krótka historia, w kolejności.</h2>
          </Reveal>
          <div className="relative pl-8 md:pl-12 border-l border-sage/30 space-y-12">
            {[
              { y: "2020 - 2024", t: "Liceum Marii Pawlikowskiej-Jasnorzewskiej", d: "LXXVIII LO w Warszawie. Cztery lata, w których uzbierało się pierwsze sto pomysłów." },
              { y: "od 2023", t: "Aktorka", d: "Pierwsze plany filmowe, pierwsze noce w bazie, pierwsze wczesne pobudki na charakteryzację." },
              { y: "2023", t: "Warsztaty z Łukaszem Zubrzyckim", d: "Varsztatownia. Konkretna praca nad warsztatem, bez owijania w bawełnę." },
              { y: "od 10.2024", t: "Green Caffe Nero, baristka", d: "Barem szybko rządziło się samo. Ludzie, ekspres, tempo, wszystko zapamiętane." },
              { y: "10.2025 - 03.2026", t: "Uniwersytet Warszawski, filologia polska", d: "Specjalność literaturoznawczo-językoznawcza. Słowo pod lupą." },
              { y: "od 10.2025", t: "Kierowniczka zmiany, Green Caffe Nero", d: "Awans, który wyszedł naturalnie. Zespół, grafik, decyzje pod presją." },
              { y: "obecnie", t: "Warszawskie Studium Aktorskie im. Lucyny Kobierzyckiej", d: "Weekendowy tryb, przygotowanie do egzaminów na uczelnie aktorskie. Rekrutacje w toku." },
            ].map((e, i) => (
              <Reveal key={e.t} delay={i * 80}>
                <div className="relative">
                  <span className="absolute -left-[41px] md:-left-[57px] top-2 w-3 h-3 rounded-full bg-sage ring-4 ring-cream" />
                  <p className="text-xs tracking-[0.2em] uppercase text-sage mb-2">{e.y}</p>
                  <h3 className="text-2xl mb-2">{e.t}</h3>
                  <p className="text-muted-foreground leading-relaxed">{e.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INTERESTS */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <img
          src={zaraModel.url}
          alt=""
          aria-hidden
          className="absolute right-0 bottom-0 h-[500px] w-auto opacity-30 pointer-events-none hidden lg:block"
        />
        <div className="max-w-4xl mx-auto px-6 relative">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">zainteresowania</p>
            <h2 className="text-4xl md:text-5xl mb-10">Rzeczy, które zajmują mi głowę.</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-3 mb-12">
              {["estetyka", "marketing", "psychologia", "malarstwo", "aktorstwo", "proces twórczy filmów", "muzyka", "literatura"].map((tag) => (
                <span key={tag} className="px-5 py-2 rounded-full bg-rose/40 text-sm tracking-wide hover:bg-rose/60 transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed italic font-serif">
              Czytam rzeczy nietypowe, często wraca się z nich innym człowiekiem. Lubię, kiedy książka wymaga ode mnie uwagi, a film pokazuje, jak sam się robił.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-transparent via-sage/5 to-transparent">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">osiągnięcia</p>
            <h3 className="text-3xl mb-8">Rzeczy, o których warto wspomnieć.</h3>
            <ul className="space-y-6 text-muted-foreground">
              <li className="flex gap-4"><span className="text-sage font-serif text-2xl leading-none">·</span><span><strong className="text-foreground font-normal">I miejsce w wyzwaniu społecznym</strong>, XI Ogólnopolska Olimpiada Kreatywności Destination Imagination, Oczyma Wyobraźni.</span></li>
              <li className="flex gap-4"><span className="text-sage font-serif text-2xl leading-none">·</span><span><strong className="text-foreground font-normal">Instant Challenge Champion</strong>, Destination Imagination Global Finals, Knoxville, USA.</span></li>
              <li className="flex gap-4"><span className="text-sage font-serif text-2xl leading-none">·</span><span>Cambridge English Level 1 Certificate in ESOL, poziom B2, dziś realnie bliżej C1.</span></li>
            </ul>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">języki i praca w zespole</p>
            <h3 className="text-3xl mb-8">Jak działam z ludźmi.</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p><span className="text-foreground">Polski</span> natywnie. <span className="text-foreground">Angielski</span> biegle, w mowie i piśmie.</p>
              <p>Szybko się uczę, ogarniam wiele wątków naraz, adaptuję się do zmiany planu w pół dnia. Cierpliwa, kulturalna, konkretna. Umiem prowadzić zespół i umiem być jego częścią.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="kontakt" className="mesh-bg py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-6">kontakt</p>
            <h2 className="font-serif text-5xl md:text-6xl mb-6">
              Napisz, <span className="italic">jeśli masz coś ciekawego.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
              Plan, sesja, rola, projekt. Odpisuję szybko, nawet między zmianami.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <a href="mailto:aniat1090@gmail.com" className="px-7 py-4 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]">aniat1090@gmail.com</a>
              <a href="tel:+48518357491" className="px-7 py-4 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors">518 357 491</a>
              <a href="https://instagram.com/ann.veronique" target="_blank" rel="noopener noreferrer" className="px-7 py-4 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors">@ann.veronique</a>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Warszawa · Gdynia · mobilna po całej Polsce</p>
          </Reveal>
        </div>
      </section>

      <footer className="py-10 text-center text-xs text-muted-foreground border-t border-border/40">
        <p className="font-serif italic">© {new Date().getFullYear()} Anna Weronika Tomaszewska</p>
      </footer>

      {/* LIGHTBOX */}
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
