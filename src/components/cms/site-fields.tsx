import { Field, ImageField, NumberInput, TextArea, TextInput } from "@/components/cms/fields";
import { AddOne, EditorCard } from "@/components/cms/controls";
import type { CvContent, SiteContent } from "@/lib/content";

export function SiteFields({
  site,
  setSite,
}: {
  site: SiteContent;
  setSite: (site: SiteContent) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">Tożsamość</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Pełne imię">
          <TextInput value={site.name} onChange={(name) => setSite({ ...site, name })} />
        </Field>
        <Field label="Krótka nazwa">
          <TextInput value={site.shortName} onChange={(shortName) => setSite({ ...site, shortName })} />
        </Field>
        <Field label="Stopka — brand">
          <TextInput value={site.footerBrand} onChange={(footerBrand) => setSite({ ...site, footerBrand })} />
        </Field>
        <Field label="Zdrobnienie">
          <TextInput value={site.nickname} onChange={(nickname) => setSite({ ...site, nickname })} />
        </Field>
      </div>
      <Field label="Role (po przecinku)">
        <TextInput
          value={site.roles.join(", ")}
          onChange={(value) =>
            setSite({
              ...site,
              roles: value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
        />
      </Field>
      <Field label="Tagline">
        <TextInput value={site.tagline} onChange={(tagline) => setSite({ ...site, tagline })} />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Rok urodzenia">
          <NumberInput value={site.birthYear} onChange={(birthYear) => setSite({ ...site, birthYear })} />
        </Field>
        <Field label="Miesiąc urodzenia">
          <NumberInput value={site.birthMonth} onChange={(birthMonth) => setSite({ ...site, birthMonth })} />
        </Field>
      </div>
      <Field label="Lokalizacje (po przecinku)">
        <TextInput
          value={site.locations.join(", ")}
          onChange={(value) =>
            setSite({
              ...site,
              locations: value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
        />
      </Field>
      <Field label="Dopisek lokalizacji">
        <TextInput value={site.locationNote} onChange={(locationNote) => setSite({ ...site, locationNote })} />
      </Field>
      <Field label="URL strony">
        <TextInput value={site.siteUrl} onChange={(siteUrl) => setSite({ ...site, siteUrl })} />
      </Field>

      <h2 className="font-serif text-2xl">Kontakt</h2>
      <Field label="Email">
        <TextInput
          value={site.contact.email}
          onChange={(email) => setSite({ ...site, contact: { ...site.contact, email } })}
        />
      </Field>
      <Field label="Telefon (wyświetlany)">
        <TextInput
          value={site.contact.phone}
          onChange={(phone) => setSite({ ...site, contact: { ...site.contact, phone } })}
        />
      </Field>
      <Field label="Telefon w linku tel:">
        <TextInput
          value={site.contact.phoneHref}
          onChange={(phoneHref) => setSite({ ...site, contact: { ...site.contact, phoneHref } })}
        />
      </Field>
      <Field label="Instagram (nick bez @)">
        <TextInput
          value={site.contact.instagram}
          onChange={(instagram) => setSite({ ...site, contact: { ...site.contact, instagram } })}
        />
      </Field>
      <Field label="URL Instagram">
        <TextInput
          value={site.contact.instagramUrl}
          onChange={(instagramUrl) => setSite({ ...site, contact: { ...site.contact, instagramUrl } })}
        />
      </Field>
      <Field label="URL Facebook">
        <TextInput
          value={site.contact.facebookUrl}
          onChange={(facebookUrl) => setSite({ ...site, contact: { ...site.contact, facebookUrl } })}
        />
      </Field>

      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl">Języki</h2>
        <AddOne
          label="Dodaj język"
          onClick={() => setSite({ ...site, languages: [...site.languages, { name: "", level: "" }] })}
        />
      </div>
      {site.languages.map((lang, i) => (
        <EditorCard
          key={`${lang.name}-${i}`}
          title={`Język ${i + 1}`}
          onRemove={() => setSite({ ...site, languages: site.languages.filter((_, idx) => idx !== i) })}
        >
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Nazwa">
              <TextInput
                value={lang.name}
                onChange={(name) => {
                  const languages = [...site.languages];
                  languages[i] = { ...lang, name };
                  setSite({ ...site, languages });
                }}
              />
            </Field>
            <Field label="Poziom">
              <TextInput
                value={lang.level}
                onChange={(level) => {
                  const languages = [...site.languages];
                  languages[i] = { ...lang, level };
                  setSite({ ...site, languages });
                }}
              />
            </Field>
          </div>
        </EditorCard>
      ))}

      <h2 className="font-serif text-2xl">Stopka</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Link do poradnika w stopce" hint="Zostaw puste, żeby ukryć">
          <TextInput
            value={site.footer.guideLabel ?? "poradnik wizytówka"}
            onChange={(guideLabel) => setSite({ ...site, footer: { ...site.footer, guideLabel } })}
          />
        </Field>
        <Field label="Adres poradnika w stopce">
          <TextInput
            value={site.footer.guideHref ?? "/poradnik-wizytowka"}
            onChange={(guideHref) => setSite({ ...site, footer: { ...site.footer, guideHref } })}
          />
        </Field>
      </div>
      <Field label="Etykieta creditu">
        <TextInput
          value={site.footer.creditLabel}
          onChange={(creditLabel) => setSite({ ...site, footer: { ...site.footer, creditLabel } })}
        />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Nazwa autora w stopce">
          <TextInput
            value={site.footer.creditName ?? "jifo.dev"}
            onChange={(creditName) => setSite({ ...site, footer: { ...site.footer, creditName } })}
          />
        </Field>
        <Field label="URL creditu">
          <TextInput
            value={site.footer.creditUrl}
            onChange={(creditUrl) => setSite({ ...site, footer: { ...site.footer, creditUrl } })}
          />
        </Field>
      </div>
    </div>
  );
}

export function CvFields({ cv, setCv }: { cv: CvContent; setCv: (cv: CvContent) => void }) {
  return (
    <div className="space-y-4">
      <Field label="SEO — tytuł">
        <TextInput value={cv.seo.title} onChange={(title) => setCv({ ...cv, seo: { ...cv.seo, title } })} />
      </Field>
      <Field label="SEO — opis">
        <TextArea
          value={cv.seo.description}
          onChange={(description) => setCv({ ...cv, seo: { ...cv.seo, description } })}
        />
      </Field>
      <Field label="Powrót w menu">
        <TextInput value={cv.navBack ?? "wróć"} onChange={(navBack) => setCv({ ...cv, navBack })} />
      </Field>
      <h2 className="font-serif text-2xl pt-4">Zamknięta karta</h2>
      <Field label="Kicker">
        <TextInput
          value={cv.locked.kicker}
          onChange={(kicker) => setCv({ ...cv, locked: { ...cv.locked, kicker } })}
        />
      </Field>
      <Field label="Tytuł">
        <TextInput
          value={cv.locked.title}
          onChange={(title) => setCv({ ...cv, locked: { ...cv.locked, title } })}
        />
      </Field>
      <Field label="Opis">
        <TextArea value={cv.locked.lead} onChange={(lead) => setCv({ ...cv, locked: { ...cv.locked, lead } })} />
      </Field>
      <Field label="Placeholder hasła">
        <TextInput
          value={cv.locked.placeholder}
          onChange={(placeholder) => setCv({ ...cv, locked: { ...cv.locked, placeholder } })}
        />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Przycisk">
          <TextInput
            value={cv.locked.submit}
            onChange={(submit) => setCv({ ...cv, locked: { ...cv.locked, submit } })}
          />
        </Field>
        <Field label="Tekst ładowania">
          <TextInput
            value={cv.locked.loading}
            onChange={(loading) => setCv({ ...cv, locked: { ...cv.locked, loading } })}
          />
        </Field>
      </div>
      <Field label="Komunikat błędnego hasła">
        <TextInput
          value={cv.locked.error}
          onChange={(error) => setCv({ ...cv, locked: { ...cv.locked, error } })}
        />
      </Field>
      <h2 className="font-serif text-2xl pt-4">Otwarta karta</h2>
      <Field label="Kicker">
        <TextInput
          value={cv.unlocked.kicker}
          onChange={(kicker) => setCv({ ...cv, unlocked: { ...cv.unlocked, kicker } })}
        />
      </Field>
      <Field label="Tytuł">
        <TextInput
          value={cv.unlocked.title}
          onChange={(title) => setCv({ ...cv, unlocked: { ...cv.unlocked, title } })}
        />
      </Field>
      <Field label="Opis">
        <TextArea
          value={cv.unlocked.lead}
          onChange={(lead) => setCv({ ...cv, unlocked: { ...cv.unlocked, lead } })}
        />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Przycisk pobierania">
          <TextInput
            value={cv.unlocked.download}
            onChange={(download) => setCv({ ...cv, unlocked: { ...cv.unlocked, download } })}
          />
        </Field>
        <Field label="Przycisk otwarcia w karcie">
          <TextInput
            value={cv.unlocked.open}
            onChange={(open) => setCv({ ...cv, unlocked: { ...cv.unlocked, open } })}
          />
        </Field>
      </div>
      <Field label="Nazwa pliku PDF">
        <TextInput
          value={cv.unlocked.filename}
          onChange={(filename) => setCv({ ...cv, unlocked: { ...cv.unlocked, filename } })}
        />
      </Field>
      <ImageField
        label="Plik PDF"
        value={cv.pdf}
        onChange={(pdf) => setCv({ ...cv, pdf })}
        hint="Wgraj nowy PDF. Hasła tu nie zmieniamy."
        accept="image/*,.pdf"
      />
    </div>
  );
}
