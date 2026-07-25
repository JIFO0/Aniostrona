import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, Counter } from "@/components/site/Reveal";
import { useEffect, useMemo, useState } from "react";
import { Trophy, Award, Languages, Sparkles, Mail, Phone, Instagram, Drama, Camera, Briefcase, Palette, FileText, User, ImageIcon } from "lucide-react";



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

const galleryMe = [
  { src: orchid.url, alt: "Portret z białą orchideą", tall: true },
  { src: guitar.url, alt: "Z gitarą w białej sukni" },
  { src: silver.url, alt: "Srebrny brokat, sesja portretowa", tall: true },
  { src: peaceful.url, alt: "Wieczorne czytanie przy oknie" },
];

const galleryWorks = [
  { src: movieSet.url, alt: "Kadr z planu filmowego" },
  { src: painting.url, alt: "Malarstwo, obraz w toku", tall: true },
  { src: rose.url, alt: "Sucha róża w złotej godzinie", tall: true },
];

function useAge() {
  return useMemo(() => {
    const now = new Date();
    const birthYear = 2004;
    const birthMonth = 11; // listopad
    let age = now.getFullYear() - birthYear;
    if (now.getMonth() + 1 < birthMonth) age -= 1;
    return age;
  }, []);
}

function Index() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [galleryTab, setGalleryTab] = useState<"me" | "works">("me");
  const age = useAge();
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);
  const gallery = galleryTab === "me" ? galleryMe : galleryWorks;

  return (
    <main className="grain min-h-screen text-foreground">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-cream/60 border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#top" className="font-serif italic text-lg tracking-wide">Ania Tomaszewska</a>
          <div className="hidden md:flex gap-8 text-sm text-muted-foreground items-center">
            <a href="#o-mnie" className="hover:text-foreground transition-colors">o mnie</a>
            <a href="#czym" className="hover:text-foreground transition-colors">czym się zajmuję</a>
            <a href="#galeria" className="hover:text-foreground transition-colors">galeria</a>
            <a href="#sciezka" className="hover:text-foreground transition-colors">ścieżka</a>
            <a href="#kontakt" className="hover:text-foreground transition-colors">kontakt</a>
            <Link to="/cv" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/10 border border-sage/30 text-sage hover:bg-sage/20 transition-colors">
              <FileText className="w-3.5 h-3.5" /> CV
            </Link>
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
              {age}-letnia aktorka, artystka, czasem niespełniona. Wszędzie z małym aparatem i kupuję stosy płótna, w głowie koncepty i ludzie, których jeszcze nie zagrałam.
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
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="o-mnie" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl p-8 md:p-14 bg-gradient-to-br from-[oklch(0.95_0.03_235)] via-[oklch(0.97_0.02_230)] to-[oklch(0.94_0.04_215)] border border-[oklch(0.85_0.05_230)]/40 shadow-[0_30px_70px_-40px_oklch(0.55_0.08_235/0.45)]">
            <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
              <Reveal>
                <div className="relative">
                  <div className="absolute -inset-4 bg-rose/40 rounded-3xl -rotate-2" />
                  <img src={orchid.url} alt="Ania z orchideą" className="relative rounded-2xl object-cover aspect-[3/4] w-full" />
                </div>
              </Reveal>
              <Reveal delay={150}>
                <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">o mnie</p>
                <h2 className="text-4xl md:text-5xl mb-8">Lubię swój święty spokój, ale wyzwania kocham jeszcze bardziej.</h2>
                <div className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                  <p>Jestem z Warszawy, z Bemowa. Często jednak znajduję mnie ktoś w Gdyni, bo tam też mam swoje miejsce. Jeżdżę po Polsce z małym aparatem w torbie i wracam z tym, co warto zapamiętać.</p>
                  <p>Radzę sobie z presją. Na scenie, na egzaminie, w ciężki dzień za barem. Nie ugina mnie tłum ani kamera, mówię publicznie tak samo spokojnie, jak piszę.</p>
                  <p>Jestem bardzo uważna co do detali. Zauważę wszystko to, o czym nawet nie pomyślisz: drobiazg w kadrze, ton w rozmowie, czyjaś niepewność, czy po prostu coś co nie do końca ma sens.</p>
                  <p>Najlepiej pracuje mi się przy czymś artystycznym i konkretnym jednocześnie. Plany filmowe, sesje, projekty, które mają rytm i sens.</p>
                </div>
                <div className="mt-8 rounded-2xl p-7 md:p-8 bg-gradient-to-br from-rose/60 via-cream to-sage/20 border border-sage/20 shadow-[0_20px_50px_-30px_oklch(0.4_0.02_40/0.3)]">
                  <p className="italic text-xl md:text-2xl leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 400 }}>
                    Jak mam jakiś projekt, wkładam w niego całą siebie i użyję wszystkich umiejętności, jakie mam, żeby się powiódł. Nawet jeżeli jest w zupełnie innej branży.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT I DO */}
      <section id="czym" className="py-24 md:py-32 bg-gradient-to-b from-transparent via-rose/10 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">czym się zajmuję</p>
            <h2 className="text-4xl md:text-5xl mb-16 max-w-2xl">
              Rzeczy, z którymi można mi <span className="italic text-sage bg-gradient-to-r from-sage/20 to-rose/40 px-3 rounded-md">zaufać</span>.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: "Aktorstwo", icon: Drama, d: <>Na planach już od 2022. Warsztat u <a href="https://varsztatovnia.pl/" target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-sage/50 underline-offset-2 hover:decoration-sage">Łukasza Zubrzyckiego</a>, weekendowy tryb w Warszawskim Studium Aktorskim. Egzaminy do szkół artystycznych już w drodze.</> },
              { t: "Modeling", icon: Camera, d: "Byłam twarzą wielu sesji zdjęciowych. Dobrze czuję się przed aparatem, kamerą i światłem. Zgłaszałam się do agencji, bywam po drugiej stronie obiektywu." },
              { t: "Zarządzanie", icon: Briefcase, d: "Green Caffe Nero, baristka od października 2024, kierowniczka zmiany od października 2025. Pięcie się po szczeblach wyszło naturalnie." },
              { t: "Sztuka", icon: Palette, d: <>Ponad sto skończonych prac plastycznych. Farba, płótno, nocne siedzenie do rana. <span className="text-foreground bg-rose/50 px-1.5 rounded">Dłubię przy detalach, poprawiam pojedyncze pociągnięcie pędzla, aż efekt jest perfekcyjny</span>.</> },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.t} delay={i * 100}>
                  <div className="soft-card rounded-2xl p-7 h-full hover:-translate-y-1 transition-transform duration-500">
                    <div className="w-11 h-11 rounded-2xl bg-sage/15 text-sage mb-6 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl mb-3">{c.t}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.d}</p>
                  </div>
                </Reveal>
              );
            })}

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          {[
            { n: 20, s: "+", label: "planów filmowych", note: "na których byłam, uczyłam się rytmu i ciszy między ujęciami" },
            { n: 100, s: "+", label: "prac plastycznych", note: "od szkiców po skończone płótna, każde z własnym nastrojem" },
            { n: 4, s: "+", label: "lata na scenie aktorskiej", note: "kursy, warsztaty, plany, reklamy, marketing, mikrofon w ręku" },
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
            <h2 className="text-4xl md:text-5xl mb-6 max-w-2xl">Ja i moje prace w kadrze.</h2>
            <p className="text-muted-foreground max-w-xl mb-10 leading-relaxed">Wożę ze sobą mały aparat i łapię to, co warte zapamiętania. Trochę planu, trochę farby, trochę siebie.</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-1 p-1 mb-10 rounded-full bg-cream/70 border border-sage/20 shadow-[0_10px_30px_-20px_oklch(0.4_0.02_40/0.3)]">
              {[
                { key: "me" as const, label: "Ja", Icon: User },
                { key: "works" as const, label: "Prace", Icon: ImageIcon },
              ].map(({ key, label, Icon }) => {
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
              { y: "obecnie", t: "Profesjonalny kurs jubilerstwa, tryb dzienny", d: "Uczę się już teraz przy marce lambadjara.pl. Praca w metalu, kamieniach, drobnym detalu. Ręce zajęte, głowa pracuje inaczej." },
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
              {["estetyka", "marketing", "psychologia", "malarstwo", "aktorstwo", "jubilerstwo", "ludzie", "muzyka", "literatura"].map((tag) => (
                <span key={tag} className="px-5 py-2 rounded-full bg-rose/40 text-sm tracking-wide hover:bg-rose/60 transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed italic font-serif">
              Zawsze jak oglądam jakiś film, myślę o tym, jak został nakręcony. Kadr, cięcie, światło, decyzja reżysera. Chętnie się tym dzielę, na głos albo w notatkach.
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

            {/* Champion highlight */}
            <div className="relative rounded-2xl p-6 mb-6 bg-gradient-to-br from-rose/70 via-cream to-sage/25 border border-sage/30 shadow-[0_25px_60px_-30px_oklch(0.4_0.04_155/0.4)] overflow-hidden">
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-sage/15 blur-2xl" />
              <div className="relative flex items-start gap-4">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-sage text-primary-foreground flex items-center justify-center shadow-lg">
                  <Trophy className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.25em] uppercase text-sage mb-2">najważniejsze</p>
                  <h4 className="font-serif text-2xl md:text-3xl mb-2 text-foreground">
                    Instant Challenge <span className="italic">Champion</span>
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <a href="https://www.kreatywnosc.pl/" target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-sage/50 underline-offset-2 hover:decoration-sage">Destination Imagination</a> Global Finals, Knoxville, USA. Moja specjalizacja: <span className="text-foreground">szybkie rozwiązywanie bardzo skomplikowanych problemów</span>, pod presją, w zespole, na czas.
                  </p>
                </div>
              </div>
            </div>

            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-4 items-start">
                <span className="shrink-0 w-9 h-9 rounded-full bg-rose/50 flex items-center justify-center text-sage"><Award className="w-4 h-4" /></span>
                <span><strong className="text-foreground font-normal">I miejsce w wyzwaniu społecznym</strong>, XI Ogólnopolska Olimpiada Kreatywności <a href="https://www.kreatywnosc.pl/" target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-sage/50 underline-offset-2 hover:decoration-sage">Destination Imagination</a>, Oczyma Wyobraźni.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="shrink-0 w-9 h-9 rounded-full bg-rose/50 flex items-center justify-center text-sage"><Languages className="w-4 h-4" /></span>
                <span>Cambridge English Level 1 Certificate in ESOL, poziom B2, dziś realnie bliżej C1.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="shrink-0 w-9 h-9 rounded-full bg-rose/50 flex items-center justify-center text-sage"><Sparkles className="w-4 h-4" /></span>
                <span>Warsztaty aktorskie u <strong className="text-foreground font-normal">Łukasza Zubrzyckiego</strong>, <a href="https://varsztatovnia.pl/" target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-sage/50 underline-offset-2 hover:decoration-sage">Varsztatownia</a>.</span>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-sm tracking-[0.25em] uppercase text-sage mb-4">języki i praca w zespole</p>
            <h3 className="text-3xl mb-8">Jak działam z ludźmi.</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p><span className="text-foreground">Polski</span> natywnie. <span className="text-foreground">Angielski</span> biegle, w mowie i piśmie.</p>
              <p>Szybko się uczę, jestem wielozadaniowa i świetnie mi idzie adaptacja do środowiska. Cierpliwa, kulturalna, konkretna. Umiem prowadzić zespół i umiem być jego częścią.</p>
              <p><span className="text-foreground">Doskonale rozładowuję konflikty</span>. Świetnie się na nich znam, wiem, skąd się biorą i jak je zamknąć, żeby zespół dalej działał. <span className="text-foreground">Umiem reprezentować tak siebie, jak i markę, także publicznie</span>, konkretnie, spokojnie, z klasą.</p>
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
              <a href="mailto:aniat1090@gmail.com" className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]">
                <Mail className="w-4 h-4" /> aniat1090@gmail.com
              </a>
              <a href="tel:+48518357491" className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors">
                <Phone className="w-4 h-4" /> 518 357 491
              </a>
              <a href="https://instagram.com/ann.veronique" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors">
                <Instagram className="w-4 h-4" /> @ann.veronique
              </a>
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
