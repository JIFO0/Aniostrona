import { Field, ImageField, NumberInput, TextArea, TextInput } from "@/components/cms/fields";
import { AddOne, EditorCard } from "@/components/cms/controls";
import { moveItem, newId, type HomeContent } from "@/lib/content";

export function HomeFields({
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
        <h2 className="font-serif text-2xl">SEO</h2>
        <Field label="Tytuł w przeglądarce">
          <TextInput value={home.seo.title} onChange={(title) => patch({ seo: { ...home.seo, title } })} />
        </Field>
        <Field label="Opis">
          <TextArea
            value={home.seo.description}
            onChange={(description) => patch({ seo: { ...home.seo, description } })}
          />
        </Field>
        <Field label="OG tytuł">
          <TextInput value={home.seo.ogTitle} onChange={(ogTitle) => patch({ seo: { ...home.seo, ogTitle } })} />
        </Field>
        <Field label="OG opis">
          <TextArea
            value={home.seo.ogDescription}
            onChange={(ogDescription) => patch({ seo: { ...home.seo, ogDescription } })}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl">Menu</h2>
          <AddOne
            label="Dodaj link"
            onClick={() =>
              patch({
                nav: {
                  ...home.nav,
                  links: [...home.nav.links, { href: "#", label: "nowa sekcja" }],
                },
              })
            }
          />
        </div>
        <Field label="Etykieta CV">
          <TextInput value={home.nav.cvLabel} onChange={(cvLabel) => patch({ nav: { ...home.nav, cvLabel } })} />
        </Field>
        {home.nav.links.map((link, i) => (
          <EditorCard
            key={`${link.href}-${i}`}
            title={`Link ${i + 1}`}
            onUp={() => patch({ nav: { ...home.nav, links: moveItem(home.nav.links, i, -1) } })}
            onDown={() => patch({ nav: { ...home.nav, links: moveItem(home.nav.links, i, 1) } })}
            onRemove={() =>
              patch({ nav: { ...home.nav, links: home.nav.links.filter((_, idx) => idx !== i) } })
            }
          >
            <Field label="Etykieta">
              <TextInput
                value={link.label}
                onChange={(label) => {
                  const links = [...home.nav.links];
                  links[i] = { ...link, label };
                  patch({ nav: { ...home.nav, links } });
                }}
              />
            </Field>
            <Field label="Href" hint="np. #galeria, /poradnik-wizytowka albo #id-nowej-sekcji">
              <TextInput
                value={link.href}
                onChange={(href) => {
                  const links = [...home.nav.links];
                  links[i] = { ...link, href };
                  patch({ nav: { ...home.nav, links } });
                }}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(link.route)}
                onChange={(e) => {
                  const links = [...home.nav.links];
                  links[i] = { ...link, route: e.target.checked };
                  patch({ nav: { ...home.nav, links } });
                }}
              />
              To jest podstrona (route), nie kotwica
            </label>
          </EditorCard>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Hero</h2>
        <Field label="Nad tytułem">
          <TextInput value={home.hero.kicker} onChange={(kicker) => patch({ hero: { ...home.hero, kicker } })} />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Imię">
            <TextInput
              value={home.hero.firstName}
              onChange={(firstName) => patch({ hero: { ...home.hero, firstName } })}
            />
          </Field>
          <Field label="Nazwisko">
            <TextInput
              value={home.hero.lastName}
              onChange={(lastName) => patch({ hero: { ...home.hero, lastName } })}
            />
          </Field>
        </div>
        <Field label="Role pod imieniem">
          <TextInput value={home.hero.roles} onChange={(roles) => patch({ hero: { ...home.hero, roles } })} />
        </Field>
        <Field label="Lead po wieku" hint="Strona dopisze wiek sama, np. „21-letnia …”">
          <TextArea
            value={home.hero.leadAfterAge}
            onChange={(leadAfterAge) => patch({ hero: { ...home.hero, leadAfterAge } })}
          />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Przycisk 1">
            <TextInput
              value={home.hero.ctaPrimary}
              onChange={(ctaPrimary) => patch({ hero: { ...home.hero, ctaPrimary } })}
            />
          </Field>
          <Field label="Przycisk 2">
            <TextInput
              value={home.hero.ctaSecondary}
              onChange={(ctaSecondary) => patch({ hero: { ...home.hero, ctaSecondary } })}
            />
          </Field>
        </div>
        <ImageField
          label="Zdjęcie hero"
          value={home.hero.image}
          onChange={(image) => patch({ hero: { ...home.hero, image } })}
          hint="Najlepiej PNG z wyciętym tłem."
        />
        <Field label="Alt zdjęcia hero">
          <TextInput
            value={home.hero.imageAlt}
            onChange={(imageAlt) => patch({ hero: { ...home.hero, imageAlt } })}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl">O mnie</h2>
          <AddOne
            label="Dodaj akapit"
            onClick={() =>
              patch({ about: { ...home.about, paragraphs: [...home.about.paragraphs, ""] } })
            }
          />
        </div>
        <Field label="Nad tytułem">
          <TextInput value={home.about.kicker} onChange={(kicker) => patch({ about: { ...home.about, kicker } })} />
        </Field>
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
            <button
              type="button"
              className="text-xs text-destructive mt-1"
              onClick={() =>
                patch({
                  about: { ...home.about, paragraphs: home.about.paragraphs.filter((_, idx) => idx !== i) },
                })
              }
            >
              Usuń akapit
            </button>
          </Field>
        ))}
        <Field label="Cytat">
          <TextArea value={home.about.quote} onChange={(quote) => patch({ about: { ...home.about, quote } })} />
        </Field>
        <ImageField
          label="Zdjęcie w sekcji o mnie"
          value={home.about.image}
          onChange={(image) => patch({ about: { ...home.about, image } })}
        />
        <Field label="Alt">
          <TextInput
            value={home.about.imageAlt}
            onChange={(imageAlt) => patch({ about: { ...home.about, imageAlt } })}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl">Czym się zajmuję</h2>
          <AddOne
            label="Dodaj kartę"
            onClick={() =>
              patch({
                whatIDo: {
                  ...home.whatIDo,
                  items: [...home.whatIDo.items, { id: newId("zaj"), title: "", description: "" }],
                },
              })
            }
          />
        </div>
        <Field label="Nad tytułem">
          <TextInput
            value={home.whatIDo.kicker}
            onChange={(kicker) => patch({ whatIDo: { ...home.whatIDo, kicker } })}
          />
        </Field>
        <div className="grid md:grid-cols-3 gap-3">
          <Field label="Tytuł — przed">
            <TextInput
              value={home.whatIDo.titleBefore}
              onChange={(titleBefore) => patch({ whatIDo: { ...home.whatIDo, titleBefore } })}
            />
          </Field>
          <Field label="wyróżnienie">
            <TextInput
              value={home.whatIDo.titleHighlight}
              onChange={(titleHighlight) => patch({ whatIDo: { ...home.whatIDo, titleHighlight } })}
            />
          </Field>
          <Field label="po">
            <TextInput
              value={home.whatIDo.titleAfter}
              onChange={(titleAfter) => patch({ whatIDo: { ...home.whatIDo, titleAfter } })}
            />
          </Field>
        </div>
        {home.whatIDo.items.map((item, i) => (
          <EditorCard
            key={item.id}
            title={`Karta ${i + 1}`}
            onUp={() => patch({ whatIDo: { ...home.whatIDo, items: moveItem(home.whatIDo.items, i, -1) } })}
            onDown={() => patch({ whatIDo: { ...home.whatIDo, items: moveItem(home.whatIDo.items, i, 1) } })}
            onRemove={() =>
              patch({
                whatIDo: { ...home.whatIDo, items: home.whatIDo.items.filter((_, idx) => idx !== i) },
              })
            }
          >
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
            <ImageField
              label="Zdjęcie karty"
              value={item.image ?? ""}
              onChange={(image) => {
                const items = [...home.whatIDo.items];
                items[i] = { ...item, image };
                patch({ whatIDo: { ...home.whatIDo, items } });
              }}
            />
          </EditorCard>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl">Liczby</h2>
          <AddOne
            label="Dodaj liczbę"
            onClick={() => patch({ stats: [...home.stats, { value: 0, suffix: "", label: "", note: "" }] })}
          />
        </div>
        {home.stats.map((stat, i) => (
          <EditorCard
            key={`${stat.label}-${i}`}
            title={`Statystyka ${i + 1}`}
            onRemove={() => patch({ stats: home.stats.filter((_, idx) => idx !== i) })}
          >
            <div className="grid md:grid-cols-4 gap-3">
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
          </EditorCard>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Zainteresowania</h2>
        <Field label="Nad tytułem">
          <TextInput
            value={home.interests.kicker}
            onChange={(kicker) => patch({ interests: { ...home.interests, kicker } })}
          />
        </Field>
        <Field label="Tytuł">
          <TextInput
            value={home.interests.title}
            onChange={(title) => patch({ interests: { ...home.interests, title } })}
          />
        </Field>
        <Field label="Tagi (po przecinku)">
          <TextInput
            value={home.interests.tags.join(", ")}
            onChange={(value) =>
              patch({
                interests: {
                  ...home.interests,
                  tags: value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
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
        <ImageField
          label="Zdjęcie w tle"
          value={home.interests.backgroundImage}
          onChange={(backgroundImage) => patch({ interests: { ...home.interests, backgroundImage } })}
        />
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl">Osiągnięcia</h2>
          <AddOne
            label="Dodaj punkt"
            onClick={() =>
              patch({
                achievements: {
                  ...home.achievements,
                  items: [...home.achievements.items, { icon: "sparkles", text: "" }],
                },
              })
            }
          />
        </div>
        <Field label="Nad tytułem">
          <TextInput
            value={home.achievements.kicker}
            onChange={(kicker) => patch({ achievements: { ...home.achievements, kicker } })}
          />
        </Field>
        <Field label="Tytuł">
          <TextInput
            value={home.achievements.title}
            onChange={(title) => patch({ achievements: { ...home.achievements, title } })}
          />
        </Field>
        <Field label="Wyróżniony kicker">
          <TextInput
            value={home.achievements.featuredKicker}
            onChange={(featuredKicker) => patch({ achievements: { ...home.achievements, featuredKicker } })}
          />
        </Field>
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
          <EditorCard
            key={`${item.text}-${i}`}
            title={`Punkt ${i + 1}`}
            onRemove={() =>
              patch({
                achievements: {
                  ...home.achievements,
                  items: home.achievements.items.filter((_, idx) => idx !== i),
                },
              })
            }
          >
            <Field label="Tekst">
              <TextArea
                value={item.text}
                onChange={(text) => {
                  const items = [...home.achievements.items];
                  items[i] = { ...item, text };
                  patch({ achievements: { ...home.achievements, items } });
                }}
              />
            </Field>
            <ImageField
              label="Zdjęcie"
              value={item.image ?? ""}
              onChange={(image) => {
                const items = [...home.achievements.items];
                items[i] = { ...item, image };
                patch({ achievements: { ...home.achievements, items } });
              }}
            />
          </EditorCard>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl">Języki i zespół</h2>
          <AddOne
            label="Dodaj akapit"
            onClick={() =>
              patch({ teamwork: { ...home.teamwork, paragraphs: [...home.teamwork.paragraphs, ""] } })
            }
          />
        </div>
        <Field label="Nad tytułem">
          <TextInput
            value={home.teamwork.kicker}
            onChange={(kicker) => patch({ teamwork: { ...home.teamwork, kicker } })}
          />
        </Field>
        <Field label="Tytuł">
          <TextInput
            value={home.teamwork.title}
            onChange={(title) => patch({ teamwork: { ...home.teamwork, title } })}
          />
        </Field>
        {home.teamwork.paragraphs.map((p, i) => (
          <Field key={i} label={`Akapit ${i + 1}`}>
            <TextArea
              value={p}
              onChange={(value) => {
                const paragraphs = [...home.teamwork.paragraphs];
                paragraphs[i] = value;
                patch({ teamwork: { ...home.teamwork, paragraphs } });
              }}
            />
            <button
              type="button"
              className="text-xs text-destructive mt-1"
              onClick={() =>
                patch({
                  teamwork: {
                    ...home.teamwork,
                    paragraphs: home.teamwork.paragraphs.filter((_, idx) => idx !== i),
                  },
                })
              }
            >
              Usuń akapit
            </button>
          </Field>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Teksty kontaktu na stronie</h2>
        <Field label="Nad tytułem">
          <TextInput
            value={home.contact.kicker}
            onChange={(kicker) => patch({ contact: { ...home.contact, kicker } })}
          />
        </Field>
        <Field label="Tytuł — przed kursywą">
          <TextInput
            value={home.contact.titleBefore}
            onChange={(titleBefore) => patch({ contact: { ...home.contact, titleBefore } })}
          />
        </Field>
        <Field label="Tytuł — kursywa">
          <TextInput
            value={home.contact.titleItalic}
            onChange={(titleItalic) => patch({ contact: { ...home.contact, titleItalic } })}
          />
        </Field>
        <Field label="Lead">
          <TextArea value={home.contact.lead} onChange={(lead) => patch({ contact: { ...home.contact, lead } })} />
        </Field>
        <Field label="Lokalizacje w stopce sekcji">
          <TextInput
            value={home.contact.footerLocations}
            onChange={(footerLocations) => patch({ contact: { ...home.contact, footerLocations } })}
          />
        </Field>
      </section>
    </div>
  );
}

export function GalleryFields({
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
      <Field label="Nad tytułem">
        <TextInput
          value={home.gallery.kicker}
          onChange={(kicker) => setHome({ ...home, gallery: { ...home.gallery, kicker } })}
        />
      </Field>
      <Field label="Tytuł galerii">
        <TextInput
          value={home.gallery.title}
          onChange={(title) => setHome({ ...home, gallery: { ...home.gallery, title } })}
        />
      </Field>
      <Field label="Opis">
        <TextArea
          value={home.gallery.lead}
          onChange={(lead) => setHome({ ...home, gallery: { ...home.gallery, lead } })}
        />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Zakładka Ja">
          <TextInput
            value={home.gallery.tabMe}
            onChange={(tabMe) => setHome({ ...home, gallery: { ...home.gallery, tabMe } })}
          />
        </Field>
        <Field label="Zakładka Prace">
          <TextInput
            value={home.gallery.tabWorks}
            onChange={(tabWorks) => setHome({ ...home, gallery: { ...home.gallery, tabWorks } })}
          />
        </Field>
      </div>
      {(["me", "works"] as const).map((key) => (
        <section key={key} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">{key === "me" ? "Ja" : "Prace"}</h2>
            <AddOne label="Dodaj zdjęcie" onClick={() => add(key)} />
          </div>
          {home.gallery[key].map((item, i) => (
            <EditorCard
              key={`${item.src}-${i}`}
              title={`Zdjęcie ${i + 1}`}
              onUp={() =>
                setHome({
                  ...home,
                  gallery: { ...home.gallery, [key]: moveItem(home.gallery[key], i, -1) },
                })
              }
              onDown={() =>
                setHome({
                  ...home,
                  gallery: { ...home.gallery, [key]: moveItem(home.gallery[key], i, 1) },
                })
              }
              onRemove={() => remove(key, i)}
            >
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
            </EditorCard>
          ))}
        </section>
      ))}
    </div>
  );
}

export function PathFields({
  home,
  setHome,
}: {
  home: HomeContent;
  setHome: (home: HomeContent) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Nad tytułem">
        <TextInput
          value={home.path.kicker}
          onChange={(kicker) => setHome({ ...home, path: { ...home.path, kicker } })}
        />
      </Field>
      <Field label="Tytuł">
        <TextInput
          value={home.path.title}
          onChange={(title) => setHome({ ...home, path: { ...home.path, title } })}
        />
      </Field>
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl">Oś czasu</h2>
        <AddOne
          label="Dodaj wpis"
          onClick={() =>
            setHome({
              ...home,
              path: {
                ...home.path,
                items: [...home.path.items, { period: "obecnie", title: "", description: "" }],
              },
            })
          }
        />
      </div>
      {home.path.items.map((item, i) => (
        <EditorCard
          key={`${item.title}-${i}`}
          title={item.period || `Wpis ${i + 1}`}
          onUp={() =>
            setHome({ ...home, path: { ...home.path, items: moveItem(home.path.items, i, -1) } })
          }
          onDown={() =>
            setHome({ ...home, path: { ...home.path, items: moveItem(home.path.items, i, 1) } })
          }
          onRemove={() =>
            setHome({
              ...home,
              path: { ...home.path, items: home.path.items.filter((_, idx) => idx !== i) },
            })
          }
        >
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
          <ImageField
            label="Zdjęcie przy wpisie"
            value={item.image ?? ""}
            onChange={(image) => {
              const items = [...home.path.items];
              items[i] = { ...item, image };
              setHome({ ...home, path: { ...home.path, items } });
            }}
          />
        </EditorCard>
      ))}
    </div>
  );
}
