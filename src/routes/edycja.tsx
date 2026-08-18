import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { readCustomPages, readCv, readHome, readPoradnik, readSite } from "@/lib/content/load.server";
import {
  emptyCustomPage,
  isSafeSlug,
  slugify,
  type CustomPage,
} from "@/lib/content";
import { ExtraBlocksEditor } from "@/components/cms/extra-editor";
import { GalleryFields, HomeFields, PathFields } from "@/components/cms/home-fields";
import { PoradnikFields } from "@/components/cms/poradnik-fields";
import { CvFields, SiteFields } from "@/components/cms/site-fields";
import { Field, TextArea, TextInput } from "@/components/cms/fields";

export const Route = createFileRoute("/edycja")({
  head: () => ({
    meta: [
      { title: "Edycja strony" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: () => ({
    site: readSite(),
    home: readHome(),
    cv: readCv(),
    poradnik: readPoradnik(),
    pages: readCustomPages(),
  }),
  component: EdycjaPage,
});

type PageId = "home" | "poradnik" | "cv" | `custom:${string}` | "new";
type HomeTab = "home" | "gallery" | "path" | "extra" | "site";

function EdycjaPage() {
  const data = Route.useLoaderData();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState<PageId | null>(null);
  const [homeTab, setHomeTab] = useState<HomeTab>("home");
  const [site, setSite] = useState(data.site);
  const [home, setHome] = useState(data.home);
  const [cv, setCv] = useState(data.cv);
  const [poradnik, setPoradnik] = useState(data.poradnik);
  const [pages, setPages] = useState<CustomPage[]>(data.pages);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [addToNav, setAddToNav] = useState(true);

  const customSlug = page?.startsWith("custom:") ? page.slice(7) : null;
  const currentCustom = pages.find((item) => item.slug === customSlug) ?? null;

  const homeTabs = useMemo(
    () =>
      [
        { id: "home" as const, label: "Treść" },
        { id: "gallery" as const, label: "Galeria" },
        { id: "path" as const, label: "Ścieżka" },
        { id: "extra" as const, label: "Nowe sekcje" },
        { id: "site" as const, label: "Kontakt i dane" },
      ] satisfies { id: HomeTab; label: string }[],
    [],
  );

  useEffect(() => {
    fetch("/api/cms/login")
      .then((res) => res.json())
      .then((json: { ok?: boolean }) => setAuthed(Boolean(json.ok)))
      .catch(() => setAuthed(false));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/cms/login", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Niepoprawne hasło.");
      return;
    }
    setAuthed(true);
  }

  async function postFile(file: string, payload: unknown) {
    const res = await fetch("/api/cms/save", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ file, data: payload }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string; git?: string | null };
    if (!res.ok || !json.ok) throw new Error(json.error || "Zapis nie powiódł się.");
    return json.git ?? null;
  }

  async function save() {
    setSaving(true);
    setStatus("");
    try {
      let git: string | null = null;
      git = (await postFile("home", { ...home, extra: home.extra ?? [] })) ?? git;
      git = (await postFile("poradnik", poradnik)) ?? git;
      git = (await postFile("site", site)) ?? git;
      git = (await postFile("cv", cv)) ?? git;
      for (const item of pages) {
        git = (await postFile("page", item)) ?? git;
      }
      setStatus(git ? `Zapisane. Git: ${git}` : "Zapisane. Odśwież stronę, żeby zobaczyć zmiany.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Błąd zapisu.");
    } finally {
      setSaving(false);
    }
  }

  function patchCustom(next: CustomPage) {
    setPages(pages.map((item) => (item.slug === next.slug ? next : item)));
  }

  function createPage() {
    const slug = slugify(newSlug || newTitle);
    if (!isSafeSlug(slug)) {
      setStatus("Podaj prosty adres, np. o-aktorstwie. Bez polskich znaków, bez spacji.");
      return;
    }
    if (pages.some((item) => item.slug === slug)) {
      setStatus("Taka strona już istnieje.");
      return;
    }
    const created = emptyCustomPage(newTitle.trim() || "Nowa strona", slug);
    setPages([...pages, created]);
    if (addToNav) {
      setHome({
        ...home,
        nav: {
          ...home.nav,
          links: [...home.nav.links, { href: `/s/${slug}`, label: created.navLabel, route: true }],
        },
      });
    }
    setNewTitle("");
    setNewSlug("");
    setPage(`custom:${slug}`);
    setStatus("Szkielet strony dodany. Zapisz wszystko, żeby pojawiła się publicznie.");
  }

  async function removeCustom(slug: string) {
    const nextPages = pages.filter((item) => item.slug !== slug);
    const nextHome = {
      ...home,
      nav: {
        ...home.nav,
        links: home.nav.links.filter((link) => link.href !== `/s/${slug}`),
      },
    };
    setPages(nextPages);
    setHome(nextHome);
    setPage(null);
    try {
      await postFile("page-delete", { slug });
      await postFile("home", { ...nextHome, extra: nextHome.extra ?? [] });
    } catch {
      setStatus("Strona usunięta lokalnie. Kliknij Zapisz, żeby potwierdzić.");
    }
  }

  if (authed === null) {
    return (
      <main className="cms flex items-center justify-center text-sm">
        Ładuję panel…
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="cms flex items-center justify-center px-6">
        <form
          onSubmit={login}
          acceptCharset="UTF-8"
          className="cms-shell w-full max-w-md rounded-[2rem] p-10 space-y-5"
        >
          <p className="text-xs tracking-[0.28em] uppercase text-clay">edycja</p>
          <h1 className="text-4xl">Panel treści</h1>
          <p className="text-sm text-ink/70 leading-relaxed">
            Zaloguj się, żeby budować strony: teksty, zdjęcia, nowe sekcje i całkiem nowe podstrony.
          </p>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="hasło"
            className="cms-input text-center"
          />
          {error ? <p className="text-xs text-clay">{error}</p> : null}
          <button className="cms-btn cms-btn-clay w-full">Wejdź</button>
        </form>
      </main>
    );
  }

  return (
    <main className="cms">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[oklch(0.16_0.03_40_/_0.92)] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <p className="font-cms italic text-lg mr-auto text-cream">Edycja</p>
          {page ? (
            <button type="button" className="text-sm text-cream/70 hover:text-cream" onClick={() => setPage(null)}>
              wszystkie strony
            </button>
          ) : null}
          <a href={previewHref(page, customSlug)} className="text-sm text-cream/70 hover:text-cream">
            zobacz
          </a>
          <button onClick={save} disabled={saving} className="cms-btn cms-btn-clay disabled:opacity-60">
            {saving ? "Zapisuję…" : "Zapisz wszystko"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {status ? (
          <p className="mb-6 text-sm bg-clay/25 border border-clay/40 text-cream rounded-2xl px-4 py-3">
            {status}
          </p>
        ) : null}

        {!page ? (
          <div className="space-y-8">
            <div>
              <p className="text-cream/55 text-xs tracking-[0.25em] uppercase mb-3">wybierz stronę</p>
              <h1 className="text-cream text-5xl md:text-6xl">Co chcesz edytować?</h1>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button type="button" className="cms-page-card" onClick={() => setPage("home")}>
                <p className="text-clay text-xs tracking-[0.2em] uppercase mb-4">01</p>
                <h2 className="text-3xl mb-2">Główna</h2>
                <p className="text-sm text-ink/60 mt-auto">Hero, o mnie, galeria, ścieżka, nowe sekcje.</p>
              </button>
              <button type="button" className="cms-page-card" onClick={() => setPage("poradnik")}>
                <p className="text-clay text-xs tracking-[0.2em] uppercase mb-4">02</p>
                <h2 className="text-3xl mb-2">Poradnik</h2>
                <p className="text-sm text-ink/60 mt-auto">Filmik-wizytówka: bloki, zdjęcia, checklisty.</p>
              </button>
              <button type="button" className="cms-page-card" onClick={() => setPage("cv")}>
                <p className="text-clay text-xs tracking-[0.2em] uppercase mb-4">03</p>
                <h2 className="text-3xl mb-2">CV</h2>
                <p className="text-sm text-ink/60 mt-auto">Teksty karty i plik PDF.</p>
              </button>
              <button type="button" className="cms-page-card cms-page-card-new" onClick={() => setPage("new")}>
                <p className="text-cream/70 text-xs tracking-[0.2em] uppercase mb-4">nowa</p>
                <h2 className="text-3xl mb-2 text-white">+ Nowa strona</h2>
                <p className="text-sm text-white/75 mt-auto">Pusta podstrona, którą potem wystylujesz.</p>
              </button>
            </div>
            {pages.length ? (
              <div className="space-y-3">
                <p className="text-cream/55 text-xs tracking-[0.25em] uppercase">Twoje strony</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pages.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      className="cms-page-card"
                      onClick={() => setPage(`custom:${item.slug}`)}
                    >
                      <p className="text-clay text-xs tracking-[0.2em] uppercase mb-4">/{item.slug}</p>
                      <h2 className="text-2xl">{item.title || item.slug}</h2>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {page ? (
          <div className="cms-shell rounded-[2rem] p-5 md:p-8 space-y-8">
            {page === "home" ? (
              <>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {homeTabs.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setHomeTab(item.id)}
                      className={homeTab === item.id ? "cms-chip cms-chip-on" : "cms-chip"}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-ink/55">
                  W opisach działa **pogrubienie**, *kursywa*, ==podświetlenie== i [link](https://…).
                </p>
                {homeTab === "home" ? <HomeFields home={home} setHome={setHome} /> : null}
                {homeTab === "gallery" ? <GalleryFields home={home} setHome={setHome} /> : null}
                {homeTab === "path" ? <PathFields home={home} setHome={setHome} /> : null}
                {homeTab === "extra" ? (
                  <ExtraBlocksEditor
                    blocks={home.extra ?? []}
                    onChange={(extra) => setHome({ ...home, extra })}
                  />
                ) : null}
                {homeTab === "site" ? <SiteFields site={site} setSite={setSite} /> : null}
              </>
            ) : null}

            {page === "poradnik" ? <PoradnikFields poradnik={poradnik} setPoradnik={setPoradnik} /> : null}
            {page === "cv" ? <CvFields cv={cv} setCv={setCv} /> : null}

            {page === "new" ? (
              <div className="space-y-5 max-w-xl">
                <h2 className="text-3xl">Nowa strona</h2>
                <p className="text-sm text-ink/65 leading-relaxed">
                  Powstanie pod adresem /s/twoj-adres. Na razie prosty szkielet: nagłówki, teksty, zdjęcia.
                </p>
                <Field label="Tytuł">
                  <TextInput
                    value={newTitle}
                    onChange={(value) => {
                      setNewTitle(value);
                      if (!newSlug) setNewSlug(slugify(value));
                    }}
                  />
                </Field>
                <Field label="Adres" hint="tylko małe litery, cyfry i myślniki">
                  <TextInput value={newSlug} onChange={(value) => setNewSlug(slugify(value))} />
                </Field>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={addToNav} onChange={(e) => setAddToNav(e.target.checked)} />
                  Dodaj do menu na stronie głównej
                </label>
                <button type="button" className="cms-btn cms-btn-clay" onClick={createPage}>
                  Utwórz szkielet
                </button>
              </div>
            ) : null}

            {currentCustom ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl mr-auto">{currentCustom.title || currentCustom.slug}</h2>
                  <a href={`/s/${currentCustom.slug}`} className="text-sm text-clay">
                    /s/{currentCustom.slug}
                  </a>
                  <button type="button" className="text-xs text-clay" onClick={() => void removeCustom(currentCustom.slug)}>
                    Usuń stronę
                  </button>
                </div>
                <Field label="Tytuł">
                  <TextInput
                    value={currentCustom.title}
                    onChange={(title) => patchCustom({ ...currentCustom, title })}
                  />
                </Field>
                <Field label="Etykieta w menu">
                  <TextInput
                    value={currentCustom.navLabel}
                    onChange={(navLabel) => patchCustom({ ...currentCustom, navLabel })}
                  />
                </Field>
                <Field label="SEO — opis">
                  <TextArea
                    value={currentCustom.seo.description}
                    onChange={(description) =>
                      patchCustom({ ...currentCustom, seo: { ...currentCustom.seo, description } })
                    }
                  />
                </Field>
                <ExtraBlocksEditor
                  showAfter={false}
                  blocks={currentCustom.blocks}
                  onChange={(blocks) => patchCustom({ ...currentCustom, blocks })}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}

function previewHref(page: PageId | null, slug: string | null) {
  if (page === "poradnik") return "/poradnik-wizytowka";
  if (page === "cv") return "/cv";
  if (page?.startsWith("custom:") && slug) return `/s/${slug}`;
  return "/";
}
