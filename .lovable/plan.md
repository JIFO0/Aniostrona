
# Strona-wizytówka Ani

Lekka, jednostronicowa strona po polsku. Ciepły, jasny motyw z nutą różu i przygaszonej zieleni, subtelne gradienty, delikatne animacje (fade-in, parallax, powolne unoszenie). Typografia artystyczna: nagłówki serifem (Cormorant / Instrument Serif), tekst ciepłym sansem (Karla / Work Sans). Bez agresywnych przejść, bez m-dashy w treści.

## Sekcje (kolejność)

1. **Hero** — pełny ekran, po lewej imię "Anna Weronika Tomaszewska" z podtytułem "aktorka, artystka, obserwatorka", krótkie zdanie wprowadzające, dwa CTA (Napisz do mnie, Zobacz galerię). Po prawej wycięte zdjęcie z białym topem (`me-nobg`) unoszące się delikatnie (float). Tło: miękki gradient kremowy → pudrowy róż z drobną teksturą ziarna.

2. **O mnie / Narracja** — dwie kolumny, po lewej portret (Orchid lub Silver glitter) w miękkiej ramce, po prawej tekst pisany osobiście, nie-korporacyjnie. Historia: 21 lat, Warszawa (Bemowo), często w Gdyni, mobilna, kocha spokój ale i wyzwania, dobrze radzi sobie z presją, ceni pracę przy czymś artystycznym.

3. **Czym się zajmuję** — 4 miękkie kafelki z ikonami: Aktorstwo, Modeling, Zarządzanie (Green Caffe Nero, naturalne pięcie się w górę), Sztuka i proces twórczy. Każdy kafelek z krótkim, szczerym opisem.

4. **Liczby / Ślady pracy** — trzy duże liczby animowane przy scrollu: 20+ planów filmowych, 100+ prac plastycznych, 2+ lata na scenie aktorskiej. Podpis pod każdą liczbą jednym zdaniem.

5. **Galeria** — masonry, ok. 8 zdjęć: Peaceful_evening, guitar, Silver_glitter, Orchid, Movie_set_life, Late-night_painting, Dried_rose, Ok_Zara_model. Delikatny hover (scale 1.02, cień), lightbox po kliknięciu. Podpis: "Kadry z drogi. Wożę ze sobą mały aparat, łapię to co warte zapamiętania."

6. **Ścieżka** — pionowa timeline: liceum Pawlikowskiej-Jasnorzewskiej, Warszawskie Studium Aktorskie, UW filologia polska, aktorka od 2023, Green Caffe Nero (baristka → kierowniczka zmiany), rekrutacja na kierunki artystyczne. Bez suchych dat na pierwszym planie, raczej opowieść.

7. **Zainteresowania** — chmura miękkich pigułek: estetyka, marketing, psychologia, malarstwo, aktorstwo, proces twórczy filmów, muzyka, literatura. Krótki akapit o książkach ("czyta rzeczy nietypowe, wraca z nich inna").

8. **Osiągnięcia i języki** — dwie kolumny. Osiągnięcia: I miejsce Destination Imagination (wyzwanie społeczne), Instant Challenge Champion — Knoxville, USA. Warsztaty z Łukaszem Zubrzyckim. Języki: polski (natywny), angielski C1 (Cambridge B2 formalnie, dziś biegły).

9. **Kontakt / Stopka** — duże, spokojne CTA. Email `aniat1090@gmail.com`, telefon `518 357 491`, Instagram `@ann.veronique`. Ikony social (Instagram, mail, telefon). Notka: "Warszawa · Gdynia · w drodze".

## Estetyka i animacje

- Paleta: kremowe tło `#fbf7f2`, pudrowy róż `#efd8d4`, głęboka zgaszona zieleń `#3d4f42` jako akcent tekstu/linii, ciepły grafitowy tekst `#2a2622`, złamana biel kart.
- Gradienty: hero i sekcyjne separatory jako miękkie mesh gradienty (róż → krem → mgła zieleni).
- Radiusy hojne (2xl), cienie miękkie i rozmyte, cienkie linie zamiast twardych ramek.
- Animacje: `fade-in` przy wejściu sekcji (IntersectionObserver), delikatny parallax na hero portrecie, powolny float (6s), hover scale 1.02, liczby licznikowe przy scrollu, story-link underline na linkach tekstowych. Bez pulsów, bez ostrych slide-in.
- Ziarno filmowe (subtelny noise overlay `opacity: 0.04`) na całej stronie dla ciepła.

## Zasoby

- Wszystkie 10 przesłanych zdjęć wchodzą przez Lovable Assets (`lovable-assets create` z `/mnt/user-uploads/`), importowane jako pointery w `src/assets/`.
- `me-nobg` w hero, `Ok_Zara_model_nobg` opcjonalnie w sekcji "Modeling" jako dekoracyjny wycinek.

## Techniczne

- Nadpisuję `src/routes/index.tsx` (usuwam placeholder), całość na `/`.
- Head route: tytuł "Ania Tomaszewska — aktorka, artystka", opis, og:title/og:description po polsku, og:image = zdjęcie hero (absolutny URL z Lovable Assets), twitter:card summary_large_image.
- Nowe komponenty w `src/components/site/`: `Hero`, `About`, `WhatIDo`, `Stats`, `Gallery`, `Timeline`, `Interests`, `Achievements`, `Contact`. Lekki `SectionReveal` wrapper z IntersectionObserver dla fade-in.
- Tokeny kolorów i gradientów w `src/styles.css` (@theme inline, oklch), fonty przez `<link>` w `__root.tsx` (Cormorant Garamond + Karla z Google Fonts).
- Bez backendu, bez formularza — kontakt to mailto/tel/Instagram.
- Reguła językowa: brak m-dashów w copy (używam przecinków, kropek, dwukropków), ton osobisty, nie AI-owy.
