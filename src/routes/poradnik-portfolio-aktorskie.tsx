import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Camera, Sparkles, UserCheck, Shirt, Lightbulb, FileText } from "lucide-react";
import meHero from "@/assets/photos/me-nobg.png.asset.json";

export const Route = createFileRoute("/poradnik-portfolio-aktorskie")({
  head: () => ({
    meta: [
      { title: "Jak przygotować się do sesji portfolio aktorskiego? Poradnik | Anna Tomaszewska" },
      { name: "description", content: "Kompleksowy poradnik dla aktorów i modeli: jak przygotować się do sesji zdjęciowej, wyselekcjonować ubrania, zadbać o headshoty castingowe i opanować emocje przed obiektywem." },
      { property: "og:title", content: "Jak przygotować się do sesji portfolio aktorskiego? Poradnik | Anna Tomaszewska" },
      { property: "og:description", content: "Praktyczny przewodnik po udanej sesji castingowej dla aktorów, epizodystów i modeli. Sprawdzone wskazówki z planów filmowych i fotograficznych." },
      { property: "og:url", content: "https://annatomaszewska.pl/poradnik-portfolio-aktorskie" },
      { property: "og:type", content: "article" },
      { property: "og:image", content: "https://id-preview--dd74ab12-74ce-4c06-9ec4-ee10e1078e70.lovable.app/__l5e/assets-v1/efb43aee-bbda-4210-aab5-6793d711dfc4/me-nobg.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://annatomaszewska.pl/poradnik-portfolio-aktorskie" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Jak przygotować się do sesji portfolio aktorskiego? Kompleksowy poradnik dla aktorów i modeli",
          "description": "Praktyczne wskazówki dotyczące przygotowania stylizacji, fryzury, ekspresji mimicznej i współpracy z fotografem podczas profesjonalnej sesji aktorskiej.",
          "author": {
            "@type": "Person",
            "name": "Anna Weronika Tomaszewska",
            "url": "https://annatomaszewska.pl/"
          },
          "publisher": {
            "@type": "Person",
            "name": "Anna Weronika Tomaszewska"
          },
          "mainEntityOfPage": "https://annatomaszewska.pl/poradnik-portfolio-aktorskie",
          "inLanguage": "pl-PL"
        }),
      },
    ],
  }),
  component: ActingPortfolioGuidePage,
});

function ActingPortfolioGuidePage() {
  return (
    <main className="grain min-h-screen mesh-bg flex flex-col text-foreground">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-cream/60 border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif italic text-lg tracking-wide">Ania Tomaszewska</Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Powrót do portfolio
          </Link>
        </div>
      </nav>

      {/* HEADER SECTION */}
      <header className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/10 border border-sage/30 text-sage text-xs tracking-wider uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Poradnik Aktorstwa & Fotografii
        </div>
        <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">
          Jak przygotować się do sesji portfolio aktorskiego?
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Dobre zdjęcia to pierwsze wrażenie u reżysera obsady. Poznaj najważniejsze zasady udanej sesji castingowej, doboru garderoby oraz pracy z obiektywem.
        </p>
      </header>

      {/* ARTICLE CONTENT */}
      <article className="pb-24 px-6 max-w-4xl mx-auto space-y-16">
        {/* INTRO SUMMARY CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="soft-card rounded-2xl p-6 bg-gradient-to-br from-cream via-rose/20 to-cream border border-sage/20">
            <div className="w-10 h-10 rounded-xl bg-sage/15 text-sage flex items-center justify-center mb-4">
              <Camera className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-lg font-medium mb-2">Headshot to podstawa</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Czysty portret pokazujący Twoje prawdziwe emocje bez zbędnego retuszu i przerysowanych stylizacji.
            </p>
          </div>

          <div className="soft-card rounded-2xl p-6 bg-gradient-to-br from-cream via-sage/15 to-cream border border-sage/20">
            <div className="w-10 h-10 rounded-xl bg-sage/15 text-sage flex items-center justify-center mb-4">
              <Shirt className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-lg font-medium mb-2">Stonowana garderoba</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Wybieraj gładkie kolory, które podkreślają oczy i karnację. Unikaj wielkich logo oraz pasków.
            </p>
          </div>

          <div className="soft-card rounded-2xl p-6 bg-gradient-to-br from-cream via-rose/20 to-cream border border-sage/20">
            <div className="w-10 h-10 rounded-xl bg-sage/15 text-sage flex items-center justify-center mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-lg font-medium mb-2">Naturalność w oczach</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reżyserzy obsady szukają prawdy i energii. Pokaż różne warianty swoich możliwości komediowych i dramatycznych.
            </p>
          </div>
        </div>

        {/* SECTION 1 */}
        <section className="soft-card rounded-3xl p-8 md:p-12 bg-cream/70 border border-sage/20 space-y-6">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sage text-primary-foreground text-sm font-sans font-semibold">1</span>
            Czym różni się portfolio aktorskie od sesji modowej?
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            W fotografii modowej to ubiór jest bohaterem kadru, a model/ka przyjmuje często pozę zastygłą i zdystansowaną. W portfolio aktorskim najistotniejszy jest człowiek — Twoja mimika, spojrzenie, charyzma oraz autentyczność.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Reżyserzy obsady i reżyserzy filmowi potrzebują widzieć Twój prawdziwy typ urody (tzw. <em>typecasting</em>). Fotografie nie mogą być przeliftingowane w programach graficznych — jeżeli na żywo wyglądasz inaczej niż na zdjęciach, casting zazwyczaj kończy się rozczarowaniem obu stron.
          </p>
        </section>

        {/* SECTION 2 */}
        <section className="soft-card rounded-3xl p-8 md:p-12 bg-cream/70 border border-sage/20 space-y-6">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sage text-primary-foreground text-sm font-sans font-semibold">2</span>
            Garderoba i makijaż — złote zasady
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Dobrze dobrany strój powinien dopełniać Twoją osobowość, ale nie odciągać uwagi od twarzy i oczu:
          </p>
          <ul className="space-y-4 text-muted-foreground text-base md:text-lg">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-sage shrink-0 mt-1" />
              <span><strong>Kolory neutralne i ziemiste:</strong> beże, czernie, głęboki granat, oliwka, zgaszona błękit czy grafit zazwyczaj prezentują się świetnie przed obiektywem.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-sage shrink-0 mt-1" />
              <span><strong>Kroje podkreślające sylwetkę:</strong> przynieś klika klasycznych T-shirtów, prosty golf, koszulę lub klasyczny żakiet/ramoneskę.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-sage shrink-0 mt-1" />
              <span><strong>Makijaż typu "no-makeup":</strong> ma jedynie wyrównać koloryt skóry i ukryć błyszczenie. Zapomnij o mocnym konturowaniu czy doklejanych rzęsach.</span>
            </li>
          </ul>
        </section>

        {/* SECTION 3 */}
        <section className="soft-card rounded-3xl p-8 md:p-12 bg-cream/70 border border-sage/20 space-y-6">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sage text-primary-foreground text-sm font-sans font-semibold">3</span>
            Praca z emocjami przed aparatem
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Nie pozuj nieruchomo. Traktuj każdy kadr jak mikroscenę filmową. Pomyśl o konkretnej sytuacji, dialogu lub relacji z kimś bliskim. Zmieniaj mikro-ekspresje:
          </p>
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <h3 className="font-serif font-medium text-foreground mb-1">Spojrzenie ciepłe / otwarte</h3>
              <p className="text-sm text-muted-foreground">Sugeruje przyjazną postać, bliskość, delikatność i otwartość na drugiego człowieka.</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <h3 className="font-serif font-medium text-foreground mb-1">Spojrzenie tajemnicze / surowe</h3>
              <p className="text-sm text-muted-foreground">Świetne do ról dramatycznych, poważnych, antagonistów lub postaci skomplikowanych wewnętrznie.</p>
            </div>
          </div>
        </section>

        {/* SECTION 4: CHECKLIST */}
        <section className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-rose/30 via-cream to-sage/25 border border-sage/30 space-y-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-sage" />
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground">
              Checklist: Dzień przed sesją zdjęciową
            </h2>
          </div>
          <div className="space-y-3 font-sans text-base">
            {[
              "Zadbaj o nawodnienie organizmu i wyśpij się minimum 7-8 godzin.",
              "Przymierz przygotowane ubrania i upewnij się, że są wyprasowane i czyste.",
              "Zabierz ze sobą 3-4 różne góry (T-shirt, golf, koszula, marynarka/kurtka).",
              "Spakuj szczotkę do włosów, puder matujący oraz krople nawilżające do oczu.",
              "Nastaw się pozytywnie — traktuj sesję jako okazję do twórczej zabawy."
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-cream/80 p-3.5 rounded-xl border border-sage/20">
                <CheckCircle2 className="w-5 h-5 text-sage shrink-0" />
                <span className="text-foreground/90 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA CARD */}
        <div className="rounded-3xl p-8 md:p-12 text-center bg-gradient-to-br from-sage/20 via-cream to-rose/20 border border-sage/30 space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl">Szukasz aktorki lub modelki do swojego projektu?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Chętnie wezmę udział w wartościowych produkcjach filmowych, reklamowych oraz autorskich sesjach fotograficznych.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/"
              className="px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]"
            >
              Zobacz moje portfolio
            </Link>
            <Link
              to="/cv"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors"
            >
              <FileText className="w-4 h-4" /> Zobacz CV
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
