import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clapperboard,
  FileText,
  Frame,
  Lightbulb,
  MapPin,
  Mic2,
  Sparkles,
  Users,
} from "lucide-react";
import { SetupCycle } from "@/components/site/SetupCycle";

import setup01 from "@/assets/photos/poradnik/setup-01.png";
import setup02 from "@/assets/photos/poradnik/setup-02.png";
import setup03 from "@/assets/photos/poradnik/setup-03.png";
import setup04 from "@/assets/photos/poradnik/setup-04.png";
import setup05 from "@/assets/photos/poradnik/setup-05.png";
import wkadrze from "@/assets/photos/poradnik/wkadrze.png";

const setupFrames = [setup01, setup02, setup03, setup04, setup05];

export const Route = createFileRoute("/poradnik-wizytowka")({
  head: () => ({
    meta: [
      {
        title:
          "Filmik-wizytówka: jak nagrać zgłoszenie na uczelnię i do agencji | Anna Tomaszewska",
      },
      {
        name: "description",
        content:
          "Poradnik o filmikach-wizytówkach: samonagrywanie, ramy kadru, wybór miejsca i tekstu do zgłoszeń na uczelnie aktorskie oraz wizytówki do agencji modelingowych.",
      },
      {
        property: "og:title",
        content:
          "Filmik-wizytówka: jak nagrać zgłoszenie na uczelnię i do agencji | Anna Tomaszewska",
      },
      {
        property: "og:description",
        content:
          "Praktycznie o nagrywaniu wizytówki: kto ma trzymać telefon, gdzie kończy się kadr i czemu lepiej zapamiętać Lokomotywę niż kolejny „bezpieczny” tekst.",
      },
      {
        property: "og:url",
        content: "https://annatomaszewska.pl/poradnik-wizytowka",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: wkadrze },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://annatomaszewska.pl/poradnik-wizytowka",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline:
            "Filmik-wizytówka: jak nagrać zgłoszenie na uczelnię aktorską i do agencji",
          description:
            "Poradnik o samonagrywaniu filmików do zgłoszeń na uczelnie aktorskie i wizytówek osobistych do agencji modelingowych — miejsce, kadr, tekst, dźwięk.",
          author: {
            "@type": "Person",
            name: "Anna Weronika Tomaszewska",
            url: "https://annatomaszewska.pl/",
          },
          publisher: {
            "@type": "Person",
            name: "Anna Weronika Tomaszewska",
          },
          mainEntityOfPage: "https://annatomaszewska.pl/poradnik-wizytowka",
          inLanguage: "pl-PL",
        }),
      },
    ],
  }),
  component: PoradnikWizytowkaPage,
});

function PoradnikWizytowkaPage() {
  return (
    <main className="grain min-h-screen mesh-bg flex flex-col text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-cream/60 border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif italic text-lg tracking-wide">
            Ania Tomaszewska
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/cv"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> CV
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Powrót do portfolio
            </Link>
          </div>
        </div>
      </nav>

      <header className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/10 border border-sage/30 text-sage text-xs tracking-wider uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Poradnik · filmik-wizytówka
        </div>
        <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">
          Jak nagrać filmik, który ktoś w ogóle zapamięta
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          O samonagrywaniu wizytówek: do uczelni aktorskich, do agencji, albo
          po prostu wtedy, kiedy ktoś prosi o „krótki filmik o sobie”. Tu nie
          chodzi o sprzęt za kilka tysięcy — chodzi o kadr, miejsce i to,{" "}
          <em>co</em> w tym kadrze robisz.
        </p>
      </header>

      <article className="pb-24 px-6 max-w-4xl mx-auto space-y-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="soft-card rounded-2xl p-6 bg-gradient-to-br from-cream via-rose/20 to-cream border border-sage/20">
            <div className="w-10 h-10 rounded-xl bg-sage/15 text-sage flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-medium mb-2">
              Miejsce i światło
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Domowy kąt wystarczy. Ważne, żeby tło nie walczyło z Tobą o
              uwagę, a światło nie robiło z Ciebie cienia pod okiem.
            </p>
          </div>

          <div className="soft-card rounded-2xl p-6 bg-gradient-to-br from-cream via-sage/15 to-cream border border-sage/20">
            <div className="w-10 h-10 rounded-xl bg-sage/15 text-sage flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-medium mb-2">
              Kto trzyma telefon
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Weź kogoś ze zmysłem estetycznym. Nie osobę, która „umie
              nagrać”, tylko kogoś, kto widzi, gdzie kończy się kadr.
            </p>
          </div>

          <div className="soft-card rounded-2xl p-6 bg-gradient-to-br from-cream via-rose/20 to-cream border border-sage/20">
            <div className="w-10 h-10 rounded-xl bg-sage/15 text-sage flex items-center justify-center mb-4">
              <Clapperboard className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-medium mb-2">
              Co mówisz / grasz
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Jeśli nie powiedzą dokładnie co — zrób coś, co da się
              zapamiętać. Bezpieczny tekst, który grają wszyscy, ginie w
              stosie.
            </p>
          </div>
        </div>

        {/* §1 */}
        <section className="soft-card rounded-3xl p-8 md:p-12 bg-cream/70 border border-sage/20 space-y-6">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sage text-primary-foreground text-sm font-sans font-semibold">
              1
            </span>
            Po co w ogóle ten filmik
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Wizytówka osobista to nie showreel z planów. Nie musisz mieć
            montażu z pięciu produkcji. Często wystarczy jeden, dwa, trzy
            minuty: Ty, spokojne tło, słyszalny głos i decyzja,{" "}
            <em>kim</em> w tym momencie jesteś.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Agencja modelingowa i uczelnia aktorska chcą trochę innych rzeczy.
            Agencja: czytelna prezencja, proporcje, ruch, spokój przed kamerą —
            bez „sceny egzaminacyjnej”. Uczelnia: czy masz coś w sobie, czy
            umiesz zagrać tekst, czy nie boisz się ryzyka. Ale baza techniczna
            jest ta sama: czysty kadr, słyszalny dźwięk, zero chaosu w tle.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Ludzie przeglądają te nagrania szybko. Jeśli przez pierwsze
            dwadzieścia sekund nie wiadomo, na co patrzeć — odpadasz, zanim
            zdążysz dojść do „ważnej” części.
          </p>
        </section>

        {/* §2 — visual core */}
        <section className="soft-card rounded-3xl p-8 md:p-12 bg-cream/70 border border-sage/20 space-y-8">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sage text-primary-foreground text-sm font-sans font-semibold">
              2
            </span>
            Miejsce, światło i ramy kadru
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Nie potrzebujesz studia. Telefon na statywie (albo na czymś
            stabilnym, nawet na pniu stołu, byle na wysokości oczu), dzień z
            miękkim światłem, tło które nie krzyczy. Biały ekran, ściana,
            spokojna zasłona — cokolwiek, byle nie widać w kadrze pół
            mieszkania i kabli pod nogami.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            <strong className="text-foreground font-medium">
              Weź kogoś do pomocy.
            </strong>{" "}
            Kogoś ze zmysłem estetycznym. Nie wystarczy osoba, która umie
            nacisnąć czerwony przycisk. Potrzebujesz kogoś, kto spojrzy na
            podgląd i powie: „tu ucina Ci rękę”, „tło wchodzi za bardzo”, „cofnij
            się o pół kroku”. Samemu tego nie zobaczysz, bo stoisz po drugiej
            stronie.
          </p>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              <SetupCycle
                images={setupFrames}
                className="aspect-[3/4] shadow-sm border border-sage/15"
              />
              <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">
                Setup od kuchni: telefon, tło, mikrofon, laptop do podglądu.
                Pokój żyje swoim życiem — w filmiku ma zostać tylko to, co
                celowo zostawisz.
              </p>
            </div>
            <div className="space-y-3">
              <div className="overflow-hidden rounded-2xl bg-cream/40 border border-sage/15 shadow-sm aspect-[3/4]">
                <img
                  src={wkadrze}
                  alt="Jak wygląda ten sam setup w kadrze kamery"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">
                A tak wygląda ten sam setup{" "}
                <em className="not-italic text-foreground">w kadrze</em>. Ogród,
                kabel, krzesło, jajko z wikliny — wszystko poza ramą. W telefonie
                widać tylko wycinek.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl bg-sage/10 border border-sage/25">
            <Frame className="w-6 h-6 text-sage shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-medium text-foreground">
                Wiedzieć, gdzie kończy się kadr
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Zanim naciśniesz rec, stań w miejscu i poproś, żeby ktoś
                pokazał Ci dokładnie granice. Gdzie jest górna krawędź. Gdzie
                lewa. Czy w ruchu ręką nie wychodzisz poza tło. To brzmi
                banalnie, a właśnie tu pada większość domowych nagrań: ładna
                osoba, i nagle w rogu wisi suszarka albo ucięta głowa.
              </p>
            </div>
          </div>
        </section>

        {/* §3 */}
        <section className="soft-card rounded-3xl p-8 md:p-12 bg-cream/70 border border-sage/20 space-y-6">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sage text-primary-foreground text-sm font-sans font-semibold">
              3
            </span>
            Co mówić, co grać
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Jeśli w briefie jest konkret — rób konkret. Monolog z listy,
            autoprezentacja w limicie minut, trzy ujęcia w określonym formacie.
            Nie kombinuj na siłę „oryginalniej”, kiedy ktoś prosi o coś
            prostego.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Gorzej, kiedy{" "}
            <strong className="text-foreground font-medium">
              nie mówią dokładnie, co masz zrobić
            </strong>
            . Uczelnie lubią zostawiać luz. Wtedy jedyne sensowne kryterium
            brzmi:{" "}
            <em className="text-foreground not-italic font-medium">
              czy to nagranie da się zapamiętać
            </em>
            . Nie „czy jest poprawne”. Czy ktoś po obejrzeniu dwudziestu
            innych nadal wie, która to byłaś Ty.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Teksty, które z natury są trochę dziwne, dają więcej przestrzeni.
            Masz gdzie się odbić, gdzie zaryzykować rytm, gdzie nie grać „ładnie
            i bezpiecznie”. Paradoks: lepiej wrecytować{" "}
            <em>Lokomotywę</em> tak, że zostaje w głowie, niż kolejny raz ten
            sam fragment, który wszyscy biorą „bo Tokarczuk” albo „bo tak się
            robi na egzaminach”. Komisja słyszała to już dziś rano.
          </p>
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <h4 className="font-serif font-medium text-foreground mb-1">
                Uczelnia
              </h4>
              <p className="text-sm text-muted-foreground">
                Ryzyko, charakter, decyzja aktorska. Wolisz być zapamiętana za
                coś ostrego niż za poprawny, szary przeciętniak.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <h4 className="font-serif font-medium text-foreground mb-1">
                Agencja
              </h4>
              <p className="text-sm text-muted-foreground">
                Krócej, spokojniej, mniej teatru. Nadal: czyste tło, dobry kadr,
                słyszalny głos. Nie musisz grać monologu — musisz być czytelna.
              </p>
            </div>
          </div>
        </section>

        {/* §4 */}
        <section className="soft-card rounded-3xl p-8 md:p-12 bg-cream/70 border border-sage/20 space-y-6">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sage text-primary-foreground text-sm font-sans font-semibold">
              4
            </span>
            Jak to nagrać, żeby nie zwariować
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Najpierw ustawienie: odległość, wysokość kamery, tło, dźwięk.
            Dopiero potem take’y. Zrób kilka — nie jeden „idealny”, bo pierwszy
            prawie zawsze jest sztywny. Potem oglądaj na większym ekranie, nie
            tylko na telefonie. Na laptopie widać rzeczy, które na małym
            wyświetlaczu giną.
          </p>
          <div className="flex gap-4 p-5 rounded-2xl bg-background/40 border border-border/40">
            <Mic2 className="w-6 h-6 text-sage shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-medium">Dźwięk.</strong>{" "}
              Lepiej trochę brzydszy kadr ze słyszalnym tekstem niż piękny obraz
              i mamrotanie. Zamknij okno, wyłącz lodówkę jeśli buczy, podejdź
              bliżej mikrofonu albo telefonu. Agencja i uczelnia wybaczą
              domowe tło. Nie wybaczą, że nie słychać, co mówisz.
            </p>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Na koniec wybierz{" "}
            <strong className="text-foreground font-medium">jeden</strong>{" "}
            plik. Nie pięć „prawie dobrych” z prośbą „wybierzcie sami”. To
            Twoja decyzja — część pracy.
          </p>
        </section>

        {/* §5 checklist */}
        <section className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-rose/30 via-cream to-sage/25 border border-sage/30 space-y-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-sage" />
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground">
              Checklist przed wysłaniem
            </h2>
          </div>
          <div className="space-y-3 font-sans text-base">
            {[
              "Sprawdź orientację i przycięcie — nic ważnego nie ginie na krawędzi.",
              "Obejrzyj na dużym ekranie i ze słuchawkami; złap szumy i cięcia.",
              "Nazwa pliku z imieniem i nazwiskiem, nie IMG_4832.",
              "Link działa (Drive / WeTransfer / Vimeo) i nie wymaga logowania na siłę.",
              "Plik nie waży kosmosu — 4K-gigant nikogo nie imponuje, tylko wisi.",
              "Jedna wersja. Jedna decyzja. Bez „a tu jeszcze wariant B”.",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-cream/80 p-3.5 rounded-xl border border-sage/20"
              >
                <CheckCircle2 className="w-5 h-5 text-sage shrink-0" />
                <span className="text-foreground/90 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-3xl p-8 md:p-12 text-center bg-gradient-to-br from-sage/20 via-cream to-rose/20 border border-sage/30 space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl">
            Masz pytanie albo chcesz feedback?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Napisz. Czasem wystarczy świeże oko na kadr albo na to, czy tekst
            w ogóle „siedzi” — zanim wyślesz to w świat.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="/#kontakt"
              className="px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]"
            >
              Napisz do mnie
            </a>
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
