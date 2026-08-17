import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { readCv, readHome, readPoradnik, readSite } from "@/lib/content/load.server";
import type { CvContent, HomeContent, PoradnikContent, PoradnikInnerBlock, SiteContent } from "@/lib/content";
import { Field, ImageField, NumberInput, TextArea, TextInput } from "@/components/cms/fields";

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
  }),
  component: EdycjaPage,
});

type Tab = "home" | "gallery" | "path" | "poradnik" | "site" | "cv";

function EdycjaPage() {
  const data = Route.useLoaderData();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("home");
  const [site, setSite] = useState(data.site);
  const [home, setHome] = useState(data.home);
  const [cv, setCv] = useState(data.cv);
  const [poradnik, setPoradnik] = useState(data.poradnik);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const tabs = useMemo(
    () =>
      [
        { id: "home" as const, label: "Strona główna" },
        { id: "gallery" as const, label: "Galeria" },
        { id: "path" as const, label: "Ścieżka" },
        { id: "poradnik" as const, label: "Poradnik" },
        { id: "site" as const, label: "Kontakt" },
        { id: "cv" as const, label: "CV" },
      ] satisfies { id: Tab; label: string }[],
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
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Niepoprawne hasło.");
      return;
    }
    setAuthed(true);
  }

  async function save() {
    setSaving(true);
    setStatus("");
    try {
      const files = [
        { file: "home", data: home },
        { file: "poradnik", data: poradnik },
        { file: "site", data: site },
        { file: "cv", data: cv },
      ] as const;
      let git: string | null = null;
      for (const current of files) {
        const res = await fetch("/api/cms/save", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(current),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string; git?: string | null };
        if (!res.ok || !json.ok) throw new Error(json.error || "Zapis nie powiódł się.");
        git = json.git ?? git;
      }
      setStatus(git ? `Zapisane. Git: ${git}` : "Zapisane. Odśwież stronę, żeby zobaczyć zmiany.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Błąd zapisu.");
    } finally {
      setSaving(false);
    }
  }

  if (authed === null) {
    return (
      <main className="grain min-h-screen mesh-bg flex items-center justify-center text-sm text-muted-foreground">
        Ładuję panel…
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="grain min-h-screen mesh-bg flex items-center justify-center px-6">
        <form
          onSubmit={login}
          className="soft-card w-full max-w-md rounded-3xl p-10 bg-gradient-to-br from-rose/40 via-cream to-sage/20 border border-sage/25 space-y-5"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-sage">edycja</p>
          <h1 className="font-serif text-3xl">Panel treści</h1>
          <p className="text-sm text-muted-foreground">Zaloguj się, żeby zmieniać teksty, zdjęcia i poradnik.</p>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="hasło"
            className="w-full px-5 py-3 rounded-full border border-sage/30 bg-cream/70 text-center"
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <button className="w-full px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm">
            Wejdź
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="grain min-h-screen bg-cream text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-cream/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <p className="font-serif italic mr-auto">Edycja strony</p>
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
            zobacz stronę
          </a>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded-full bg-sage text-primary-foreground text-sm disabled:opacity-60"
          >
            {saving ? "Zapisuję…" : "Zapisz wszystko"}
          </button>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${tab === item.id ? "bg-sage text-primary-foreground" : "bg-sage/10 text-sage"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {status ? <p className="text-sm text-sage">{status}</p> : null}
        <p className="text-xs text-muted-foreground">
          W opisach możesz użyć **pogrubienia**, *kursywy*, ==podświetlenia== i linków [tekst](https://…).
        </p>
        {tab === "home" ? <HomeFields home={home} setHome={setHome} /> : null}
        {tab === "gallery" ? <GalleryFields home={home} setHome={setHome} /> : null}
        {tab === "path" ? <PathFields home={home} setHome={setHome} /> : null}
        {tab === "poradnik" ? <PoradnikFields poradnik={poradnik} setPoradnik={setPoradnik} /> : null}
        {tab === "site" ? <SiteFields site={site} setSite={setSite} /> : null}
        {tab === "cv" ? <CvFields cv={cv} setCv={setCv} /> : null}
      </div>
    </main>
  );
}

function HomeFields({
  home,
  setHome,
}: {
  home: HomeContent;
  setHome: (home: HomeContent) => void;
}) {
  const patch = (partial: Partial<HomeContent>) => setHome({ ...home, ...partial });
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Hero</h2>
        <Field label="Nad tytułem">
          <TextInput value={home.hero.kicker} onChange={(kicker) => patch({ hero: { ...home.hero, kicker } })} />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Imię">
            <TextInput value={home.hero.firstName} onChange={(firstName) => patch({ hero: { ...home.hero, firstName } })} />
          </Field>
          <Field label="Nazwisko">
            <TextInput value={home.hero.lastName} onChange={(lastName) => patch({ hero: { ...home.hero, lastName } })} />
          </Field>
        </div>
        <Field label="Role pod imieniem">
          <TextInput value={home.hero.roles} onChange={(roles) => patch({ hero: { ...home.hero, roles } })} />
        </Field>
        <Field label="Lead po wieku" hint="Strona dopisze wiek sama, np. „21-letnia …”">
          <TextArea value={home.hero.leadAfterAge} onChange={(leadAfterAge) => patch({ hero: { ...home.hero, leadAfterAge } })} />
        </Field>
        <ImageField
          label="Zdjęcie hero"
          value={home.hero.image}
          onChange={(image) => patch({ hero: { ...home.hero, image } })}
          hint="Najlepiej PNG z wyciętym tłem."
        />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">O mnie</h2>
        <Field label="Nagłówek">
          <TextInput value={home.about.title} onChange={(title) => patch({ about: { ...home.about, title } })} />
        </Field>
        {home.about.paragraphs.map((p, i) => (
          <Field key={i} label={`Akapit ${i + 1}`}>
            <TextArea
              value={p}
              onChange={(value) => {
                const paragraphs = [...home.about.paragraphs];
                paragraphs[i] = value;
                patch({ about: { ...home.about, paragraphs } });
              }}
            />
          </Field>
        ))}
        <Field label="Cytat">
          <TextArea value={home.about.quote} onChange={(quote) => patch({ about: { ...home.about, quote } })} />
        </Field>
        <ImageField label="Zdjęcie w sekcji o mnie" value={home.about.image} onChange={(image) => patch({ about: { ...home.about, image } })} />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Czym się zajmuję</h2>
        {home.whatIDo.items.map((item, i) => (
          <div key={item.id} className="soft-card rounded-2xl p-5 space-y-3">
            <Field label="Tytuł">
              <TextInput
                value={item.title}
                onChange={(title) => {
                  const items = [...home.whatIDo.items];
                  items[i] = { ...item, title };
                  patch({ whatIDo: { ...home.whatIDo, items } });
                }}
              />
            </Field>
            <Field label="Opis">
              <TextArea
                value={item.description}
                onChange={(description) => {
                  const items = [...home.whatIDo.items];
                  items[i] = { ...item, description };
                  patch({ whatIDo: { ...home.whatIDo, items } });
                }}
              />
            </Field>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Liczby</h2>
        {home.stats.map((stat, i) => (
          <div key={stat.label} className="grid md:grid-cols-4 gap-3 items-end">
            <Field label="Wartość">
              <NumberInput
                value={stat.value}
                onChange={(value) => {
                  const stats = [...home.stats];
                  stats[i] = { ...stat, value };
                  patch({ stats });
                }}
              />
            </Field>
            <Field label="Suffix">
              <TextInput
                value={stat.suffix}
                onChange={(suffix) => {
                  const stats = [...home.stats];
                  stats[i] = { ...stat, suffix };
                  patch({ stats });
                }}
              />
            </Field>
            <Field label="Etykieta">
              <TextInput
                value={stat.label}
                onChange={(label) => {
                  const stats = [...home.stats];
                  stats[i] = { ...stat, label };
                  patch({ stats });
                }}
              />
            </Field>
            <Field label="Dopisek">
              <TextInput
                value={stat.note}
                onChange={(note) => {
                  const stats = [...home.stats];
                  stats[i] = { ...stat, note };
                  patch({ stats });
                }}
              />
            </Field>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Zainteresowania</h2>
        <Field label="Tagi (po przecinku)">
          <TextInput
            value={home.interests.tags.join(", ")}
            onChange={(value) =>
              patch({
                interests: {
                  ...home.interests,
                  tags: value.split(",").map((t) => t.trim()).filter(Boolean),
                },
              })
            }
          />
        </Field>
        <Field label="Akapit">
          <TextArea
            value={home.interests.note}
            onChange={(note) => patch({ interests: { ...home.interests, note } })}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Osiągnięcia</h2>
        <Field label="Wyróżniony tytuł">
          <TextInput
            value={home.achievements.featuredTitle}
            onChange={(featuredTitle) => patch({ achievements: { ...home.achievements, featuredTitle } })}
          />
        </Field>
        <Field label="Wyróżniony opis">
          <TextArea
            value={home.achievements.featuredDescription}
            onChange={(featuredDescription) =>
              patch({ achievements: { ...home.achievements, featuredDescription } })
            }
          />
        </Field>
        {home.achievements.items.map((item, i) => (
          <Field key={item.text} label={`Punkt ${i + 1}`}>
            <TextArea
              value={item.text}
              onChange={(text) => {
                const items = [...home.achievements.items];
                items[i] = { ...item, text };
                patch({ achievements: { ...home.achievements, items } });
              }}
            />
          </Field>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Teksty kontaktu na stronie</h2>
        <Field label="Nagłówek">
          <TextInput
            value={home.contact.titleItalic}
            onChange={(titleItalic) => patch({ contact: { ...home.contact, titleItalic } })}
          />
        </Field>
        <Field label="Lead">
          <TextArea value={home.contact.lead} onChange={(lead) => patch({ contact: { ...home.contact, lead } })} />
        </Field>
      </section>
    </div>
  );
}

function GalleryFields({
  home,
  setHome,
}: {
  home: HomeContent;
  setHome: (home: HomeContent) => void;
}) {
  function editList(key: "me" | "works", index: number, patchItem: Partial<HomeContent["gallery"]["me"][number]>) {
    const list = [...home.gallery[key]];
    list[index] = { ...list[index], ...patchItem };
    setHome({ ...home, gallery: { ...home.gallery, [key]: list } });
  }

  function add(key: "me" | "works") {
    setHome({
      ...home,
      gallery: {
        ...home.gallery,
        [key]: [...home.gallery[key], { src: "", alt: "", tall: false }],
      },
    });
  }

  function remove(key: "me" | "works", index: number) {
    setHome({
      ...home,
      gallery: { ...home.gallery, [key]: home.gallery[key].filter((_, i) => i !== index) },
    });
  }

  return (
    <div className="space-y-10">
      <Field label="Tytuł galerii">
        <TextInput value={home.gallery.title} onChange={(title) => setHome({ ...home, gallery: { ...home.gallery, title } })} />
      </Field>
      <Field label="Opis">
        <TextArea value={home.gallery.lead} onChange={(lead) => setHome({ ...home, gallery: { ...home.gallery, lead } })} />
      </Field>
      {(["me", "works"] as const).map((key) => (
        <section key={key} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">{key === "me" ? "Ja" : "Prace"}</h2>
            <button type="button" onClick={() => add(key)} className="text-sm px-3 py-1.5 rounded-full border border-sage/40">
              Dodaj zdjęcie
            </button>
          </div>
          {home.gallery[key].map((item, i) => (
            <div key={`${item.src}-${i}`} className="soft-card rounded-2xl p-5 space-y-3">
              <ImageField label="Zdjęcie" value={item.src} onChange={(src) => editList(key, i, { src })} />
              <Field label="Alt (opis dla niewidomych i SEO)">
                <TextInput value={item.alt} onChange={(alt) => editList(key, i, { alt })} />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.tall}
                  onChange={(e) => editList(key, i, { tall: e.target.checked })}
                />
                Wysokie zdjęcie
              </label>
              <button type="button" onClick={() => remove(key, i)} className="text-xs text-destructive">
                Usuń
              </button>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function PathFields({
  home,
  setHome,
}: {
  home: HomeContent;
  setHome: (home: HomeContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl">Oś czasu</h2>
        <button
          type="button"
          className="text-sm px-3 py-1.5 rounded-full border border-sage/40"
          onClick={() =>
            setHome({
              ...home,
              path: {
                ...home.path,
                items: [...home.path.items, { period: "obecnie", title: "", description: "" }],
              },
            })
          }
        >
          Dodaj wpis
        </button>
      </div>
      {home.path.items.map((item, i) => (
        <div key={`${item.title}-${i}`} className="soft-card rounded-2xl p-5 space-y-3">
          <Field label="Okres">
            <TextInput
              value={item.period}
              onChange={(period) => {
                const items = [...home.path.items];
                items[i] = { ...item, period };
                setHome({ ...home, path: { ...home.path, items } });
              }}
            />
          </Field>
          <Field label="Tytuł">
            <TextInput
              value={item.title}
              onChange={(title) => {
                const items = [...home.path.items];
                items[i] = { ...item, title };
                setHome({ ...home, path: { ...home.path, items } });
              }}
            />
          </Field>
          <Field label="Opis">
            <TextArea
              value={item.description}
              onChange={(description) => {
                const items = [...home.path.items];
                items[i] = { ...item, description };
                setHome({ ...home, path: { ...home.path, items } });
              }}
            />
          </Field>
          <button
            type="button"
            className="text-xs text-destructive"
            onClick={() =>
              setHome({
                ...home,
                path: { ...home.path, items: home.path.items.filter((_, idx) => idx !== i) },
              })
            }
          >
            Usuń wpis
          </button>
        </div>
      ))}
    </div>
  );
}

function PoradnikFields({
  poradnik,
  setPoradnik,
}: {
  poradnik: PoradnikContent;
  setPoradnik: (value: PoradnikContent) => void;
}) {
  return (
    <div className="space-y-6">
      <Field label="Tytuł w przeglądarce">
        <TextInput value={poradnik.seo.title} onChange={(title) => setPoradnik({ ...poradnik, seo: { ...poradnik.seo, title } })} />
      </Field>
      {poradnik.blocks.map((block, i) => (
        <div key={`${block._template}-${i}`} className="soft-card rounded-2xl p-5 space-y-3">
          <p className="text-xs uppercase tracking-widest text-sage">{block._template}</p>
          {block._template === "hero" ? (
            <>
              <Field label="Badge">
                <TextInput
                  value={block.badge}
                  onChange={(badge) => {
                    const blocks = [...poradnik.blocks];
                    blocks[i] = { ...block, badge };
                    setPoradnik({ ...poradnik, blocks });
                  }}
                />
              </Field>
              <Field label="Tytuł">
                <TextInput
                  value={block.title}
                  onChange={(title) => {
                    const blocks = [...poradnik.blocks];
                    blocks[i] = { ...block, title };
                    setPoradnik({ ...poradnik, blocks });
                  }}
                />
              </Field>
              <Field label="Lead">
                <TextArea
                  value={block.lead}
                  onChange={(lead) => {
                    const blocks = [...poradnik.blocks];
                    blocks[i] = { ...block, lead };
                    setPoradnik({ ...poradnik, blocks });
                  }}
                />
              </Field>
            </>
          ) : null}
          {block._template === "richSection" ? (
            <>
              <Field label="Numer">
                <TextInput
                  value={block.number}
                  onChange={(number) => {
                    const blocks = [...poradnik.blocks];
                    blocks[i] = { ...block, number };
                    setPoradnik({ ...poradnik, blocks });
                  }}
                />
              </Field>
              <Field label="Nagłówek">
                <TextInput
                  value={block.title}
                  onChange={(title) => {
                    const blocks = [...poradnik.blocks];
                    blocks[i] = { ...block, title };
                    setPoradnik({ ...poradnik, blocks });
                  }}
                />
              </Field>
              {block.paragraphs.map((p, pi) => (
                <Field key={pi} label={`Akapit ${pi + 1}`}>
                  <TextArea
                    value={p}
                    onChange={(value) => {
                      const paragraphs = [...block.paragraphs];
                      paragraphs[pi] = value;
                      const blocks = [...poradnik.blocks];
                      blocks[i] = { ...block, paragraphs };
                      setPoradnik({ ...poradnik, blocks });
                    }}
                  />
                </Field>
              ))}
              <button
                type="button"
                className="text-sm text-sage"
                onClick={() => {
                  const blocks = [...poradnik.blocks];
                  blocks[i] = { ...block, paragraphs: [...block.paragraphs, ""] };
                  setPoradnik({ ...poradnik, blocks });
                }}
              >
                Dodaj akapit
              </button>
              {(block.inner ?? []).map((inner, ii) => (
                <InnerEditor
                  key={`${inner._template}-${ii}`}
                  inner={inner}
                  onChange={(next) => {
                    const innerList = [...(block.inner ?? [])];
                    innerList[ii] = next;
                    const blocks = [...poradnik.blocks];
                    blocks[i] = { ...block, inner: innerList };
                    setPoradnik({ ...poradnik, blocks });
                  }}
                />
              ))}
            </>
          ) : null}
          {block._template === "checklist" ? (
            <>
              <Field label="Tytuł checklisty">
                <TextInput
                  value={block.title}
                  onChange={(title) => {
                    const blocks = [...poradnik.blocks];
                    blocks[i] = { ...block, title };
                    setPoradnik({ ...poradnik, blocks });
                  }}
                />
              </Field>
              {block.items.map((item, ii) => (
                <Field key={ii} label={`Punkt ${ii + 1}`}>
                  <TextInput
                    value={item}
                    onChange={(value) => {
                      const items = [...block.items];
                      items[ii] = value;
                      const blocks = [...poradnik.blocks];
                      blocks[i] = { ...block, items };
                      setPoradnik({ ...poradnik, blocks });
                    }}
                  />
                </Field>
              ))}
            </>
          ) : null}
          {block._template === "cta" ? (
            <>
              <Field label="Nagłówek CTA">
                <TextInput
                  value={block.title}
                  onChange={(title) => {
                    const blocks = [...poradnik.blocks];
                    blocks[i] = { ...block, title };
                    setPoradnik({ ...poradnik, blocks });
                  }}
                />
              </Field>
              <Field label="Tekst">
                <TextArea
                  value={block.lead}
                  onChange={(lead) => {
                    const blocks = [...poradnik.blocks];
                    blocks[i] = { ...block, lead };
                    setPoradnik({ ...poradnik, blocks });
                  }}
                />
              </Field>
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function InnerEditor({
  inner,
  onChange,
}: {
  inner: PoradnikInnerBlock;
  onChange: (inner: PoradnikInnerBlock) => void;
}) {
  if (inner._template === "callout") {
    return (
      <div className="rounded-xl border border-sage/20 p-4 space-y-2">
        <p className="text-xs text-sage">Ramka</p>
        <Field label="Tytuł ramki">
          <TextInput value={inner.title} onChange={(title) => onChange({ ...inner, title })} />
        </Field>
        <Field label="Tekst">
          <TextArea value={inner.text} onChange={(text) => onChange({ ...inner, text })} />
        </Field>
      </div>
    );
  }
  if (inner._template === "twoCol") {
    return (
      <div className="rounded-xl border border-sage/20 p-4 grid md:grid-cols-2 gap-3">
        <Field label="Lewa kolumna — tytuł">
          <TextInput value={inner.leftTitle} onChange={(leftTitle) => onChange({ ...inner, leftTitle })} />
        </Field>
        <Field label="Prawa kolumna — tytuł">
          <TextInput value={inner.rightTitle} onChange={(rightTitle) => onChange({ ...inner, rightTitle })} />
        </Field>
        <Field label="Lewa — tekst">
          <TextArea value={inner.leftText} onChange={(leftText) => onChange({ ...inner, leftText })} />
        </Field>
        <Field label="Prawa — tekst">
          <TextArea value={inner.rightText} onChange={(rightText) => onChange({ ...inner, rightText })} />
        </Field>
      </div>
    );
  }
  if (inner._template === "prose") {
    return (
      <Field label="Akapit">
        <TextArea value={inner.text} onChange={(text) => onChange({ ...inner, text })} />
      </Field>
    );
  }
  if (inner._template === "imagePair") {
    return (
      <div className="rounded-xl border border-sage/20 p-4 space-y-3">
        <p className="text-xs text-sage">Para zdjęć (setup / kadr)</p>
        <ImageField label="Zdjęcie w kadrze" value={inner.stillImage} onChange={(stillImage) => onChange({ ...inner, stillImage })} />
        <Field label="Podpis kadru">
          <TextArea value={inner.stillCaption} onChange={(stillCaption) => onChange({ ...inner, stillCaption })} />
        </Field>
        <Field label="Podpis cyklu">
          <TextArea value={inner.cycleCaption} onChange={(cycleCaption) => onChange({ ...inner, cycleCaption })} />
        </Field>
      </div>
    );
  }
  return null;
}

function SiteFields({
  site,
  setSite,
}: {
  site: SiteContent;
  setSite: (site: SiteContent) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Email">
        <TextInput value={site.contact.email} onChange={(email) => setSite({ ...site, contact: { ...site.contact, email } })} />
      </Field>
      <Field label="Telefon (wyświetlany)">
        <TextInput value={site.contact.phone} onChange={(phone) => setSite({ ...site, contact: { ...site.contact, phone } })} />
      </Field>
      <Field label="Telefon w linku tel:">
        <TextInput value={site.contact.phoneHref} onChange={(phoneHref) => setSite({ ...site, contact: { ...site.contact, phoneHref } })} />
      </Field>
      <Field label="Instagram (nick bez @)">
        <TextInput value={site.contact.instagram} onChange={(instagram) => setSite({ ...site, contact: { ...site.contact, instagram } })} />
      </Field>
      <Field label="URL Instagram">
        <TextInput value={site.contact.instagramUrl} onChange={(instagramUrl) => setSite({ ...site, contact: { ...site.contact, instagramUrl } })} />
      </Field>
      <Field label="URL Facebook">
        <TextInput value={site.contact.facebookUrl} onChange={(facebookUrl) => setSite({ ...site, contact: { ...site.contact, facebookUrl } })} />
      </Field>
    </div>
  );
}

function CvFields({ cv, setCv }: { cv: CvContent; setCv: (cv: CvContent) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Tytuł zamkniętej karty">
        <TextInput value={cv.locked.title} onChange={(title) => setCv({ ...cv, locked: { ...cv.locked, title } })} />
      </Field>
      <Field label="Opis zamkniętej karty">
        <TextArea value={cv.locked.lead} onChange={(lead) => setCv({ ...cv, locked: { ...cv.locked, lead } })} />
      </Field>
      <ImageField
        label="Plik PDF"
        value={cv.pdf}
        onChange={(pdf) => setCv({ ...cv, pdf })}
        hint="Wgraj nowy PDF. Hasła tu nie zmieniamy."
      />
    </div>
  );
}
