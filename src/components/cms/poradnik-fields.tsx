import { Field, ImageField, ImageListField, TextArea, TextInput } from "@/components/cms/fields";
import { AddMenu, AddOne, EditorCard } from "@/components/cms/controls";
import { ExtraBodyFields } from "@/components/cms/extra-editor";
import { BoxStyleFields } from "@/components/cms/style-fields";
import {
  emptyPoradnikBlock,
  emptyPoradnikInner,
  EXTRA_BLOCK_LABELS,
  moveItem,
  PORADNIK_BLOCK_LABELS,
  PORADNIK_INNER_LABELS,
  type ExtraBlockBody,
  type ExtraTemplate,
  type PoradnikBlock,
  type PoradnikContent,
  type PoradnikInnerBlock,
} from "@/lib/content";

const EXTRA_TEMPLATES = Object.keys(EXTRA_BLOCK_LABELS) as ExtraTemplate[];

function isExtraBody(block: PoradnikBlock): block is ExtraBlockBody {
  return EXTRA_TEMPLATES.includes(block._template as ExtraTemplate);
}

export function PoradnikFields({
  poradnik,
  setPoradnik,
}: {
  poradnik: PoradnikContent;
  setPoradnik: (value: PoradnikContent) => void;
}) {
  const setBlocks = (blocks: PoradnikBlock[]) => setPoradnik({ ...poradnik, blocks });
  const options = (Object.keys(PORADNIK_BLOCK_LABELS) as PoradnikBlock["_template"][]).map((id) => ({
    id,
    label: PORADNIK_BLOCK_LABELS[id],
  }));

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="font-serif text-2xl">SEO i nawigacja</h2>
        <Field label="Tytuł w przeglądarce">
          <TextInput
            value={poradnik.seo.title}
            onChange={(title) => setPoradnik({ ...poradnik, seo: { ...poradnik.seo, title } })}
          />
        </Field>
        <Field label="Opis">
          <TextArea
            value={poradnik.seo.description}
            onChange={(description) => setPoradnik({ ...poradnik, seo: { ...poradnik.seo, description } })}
          />
        </Field>
        <Field label="OG tytuł">
          <TextInput
            value={poradnik.seo.ogTitle}
            onChange={(ogTitle) => setPoradnik({ ...poradnik, seo: { ...poradnik.seo, ogTitle } })}
          />
        </Field>
        <Field label="OG opis">
          <TextArea
            value={poradnik.seo.ogDescription}
            onChange={(ogDescription) => setPoradnik({ ...poradnik, seo: { ...poradnik.seo, ogDescription } })}
          />
        </Field>
        <Field label="JSON-LD nagłówek artykułu">
          <TextInput
            value={poradnik.jsonLdHeadline}
            onChange={(jsonLdHeadline) => setPoradnik({ ...poradnik, jsonLdHeadline })}
          />
        </Field>
        <Field label="JSON-LD opis artykułu">
          <TextArea
            value={poradnik.jsonLdDescription}
            onChange={(jsonLdDescription) => setPoradnik({ ...poradnik, jsonLdDescription })}
          />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Powrót w menu">
            <TextInput value={poradnik.navBack} onChange={(navBack) => setPoradnik({ ...poradnik, navBack })} />
          </Field>
          <Field label="Etykieta CV w menu">
            <TextInput
              value={poradnik.navCvLabel ?? "CV"}
              onChange={(navCvLabel) => setPoradnik({ ...poradnik, navCvLabel })}
            />
          </Field>
        </div>
      </section>

      <AddMenu
        label="Dodaj blok na koniec:"
        options={options}
        onPick={(id) => setBlocks([...poradnik.blocks, emptyPoradnikBlock(id as PoradnikBlock["_template"])])}
      />

      {poradnik.blocks.map((block, i) => (
        <EditorCard
          key={`${block._template}-${i}`}
          title={PORADNIK_BLOCK_LABELS[block._template] || block._template}
          onUp={() => setBlocks(moveItem(poradnik.blocks, i, -1))}
          onDown={() => setBlocks(moveItem(poradnik.blocks, i, 1))}
          onRemove={() => setBlocks(poradnik.blocks.filter((_, idx) => idx !== i))}
        >
          <PoradnikBlockFields
            block={block}
            onChange={(next) => {
              const blocks = [...poradnik.blocks];
              blocks[i] = { ...next, boxStyle: block.boxStyle };
              setBlocks(blocks);
            }}
          />
          <BoxStyleFields
            value={block.boxStyle}
            onChange={(boxStyle) => {
              const blocks = [...poradnik.blocks];
              blocks[i] = { ...block, boxStyle };
              setBlocks(blocks);
            }}
          />
        </EditorCard>
      ))}
    </div>
  );
}

function PoradnikBlockFields({
  block,
  onChange,
}: {
  block: PoradnikBlock;
  onChange: (block: PoradnikBlock) => void;
}) {
  if (block._template === "hero") {
    return (
      <>
        <Field label="Badge">
          <TextInput value={block.badge} onChange={(badge) => onChange({ ...block, badge })} />
        </Field>
        <Field label="Tytuł">
          <TextInput value={block.title} onChange={(title) => onChange({ ...block, title })} />
        </Field>
        <Field label="Lead">
          <TextArea value={block.lead} onChange={(lead) => onChange({ ...block, lead })} />
        </Field>
        <ImageField
          label="Zdjęcie hero"
          value={block.image ?? ""}
          onChange={(image) => onChange({ ...block, image })}
        />
        <Field label="Alt">
          <TextInput value={block.imageAlt ?? ""} onChange={(imageAlt) => onChange({ ...block, imageAlt })} />
        </Field>
      </>
    );
  }
  if (block._template === "introCards") {
    return (
      <>
        {block.cards.map((card, i) => (
          <div key={card.id} className="rounded-xl border border-sage/20 p-3 space-y-2">
            <Field label="Tytuł karty">
              <TextInput
                value={card.title}
                onChange={(title) => {
                  const cards = [...block.cards];
                  cards[i] = { ...card, title };
                  onChange({ ...block, cards });
                }}
              />
            </Field>
            <Field label="Tekst">
              <TextArea
                value={card.text}
                onChange={(text) => {
                  const cards = [...block.cards];
                  cards[i] = { ...card, text };
                  onChange({ ...block, cards });
                }}
              />
            </Field>
            <ImageField
              label="Zdjęcie karty"
              value={card.image ?? ""}
              onChange={(image) => {
                const cards = [...block.cards];
                cards[i] = { ...card, image };
                onChange({ ...block, cards });
              }}
            />
            <button
              type="button"
              className="text-xs text-destructive"
              onClick={() => onChange({ ...block, cards: block.cards.filter((_, idx) => idx !== i) })}
            >
              Usuń kartę
            </button>
          </div>
        ))}
        <AddOne
          label="Dodaj kartę"
          onClick={() =>
            onChange({
              ...block,
              cards: [...block.cards, { id: `card-${block.cards.length + 1}`, title: "", text: "" }],
            })
          }
        />
      </>
    );
  }
  if (block._template === "richSection") {
    return (
      <>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Etykieta przed numerem" hint="domyślnie: Część">
            <TextInput
              value={block.numberLabel ?? "Część"}
              onChange={(numberLabel) => onChange({ ...block, numberLabel })}
            />
          </Field>
          <Field label="Numer">
            <TextInput value={block.number} onChange={(number) => onChange({ ...block, number })} />
          </Field>
        </div>
        <Field label="Nagłówek">
          <TextInput value={block.title} onChange={(title) => onChange({ ...block, title })} />
        </Field>
        <ImageField
          label="Zdjęcie sekcji"
          value={block.image ?? ""}
          onChange={(image) => onChange({ ...block, image })}
        />
        {block.image ? (
          <Field label="Alt zdjęcia sekcji">
            <TextInput value={block.imageAlt ?? ""} onChange={(imageAlt) => onChange({ ...block, imageAlt })} />
          </Field>
        ) : null}
        {block.paragraphs.map((p, pi) => (
          <Field key={pi} label={`Akapit ${pi + 1}`}>
            <TextArea
              value={p}
              onChange={(value) => {
                const paragraphs = [...block.paragraphs];
                paragraphs[pi] = value;
                onChange({ ...block, paragraphs });
              }}
            />
            <button
              type="button"
              className="text-xs text-destructive mt-1"
              onClick={() =>
                onChange({ ...block, paragraphs: block.paragraphs.filter((_, idx) => idx !== pi) })
              }
            >
              Usuń akapit
            </button>
          </Field>
        ))}
        <AddOne
          label="Dodaj akapit"
          onClick={() => onChange({ ...block, paragraphs: [...block.paragraphs, ""] })}
        />
        <p className="text-xs uppercase tracking-widest text-sage pt-2">Wnętrze sekcji</p>
        <AddMenu
          label="Dodaj do środka:"
          options={(Object.keys(PORADNIK_INNER_LABELS) as PoradnikInnerBlock["_template"][]).map((id) => ({
            id,
            label: PORADNIK_INNER_LABELS[id],
          }))}
          onPick={(id) =>
            onChange({
              ...block,
              inner: [...(block.inner ?? []), emptyPoradnikInner(id as PoradnikInnerBlock["_template"])],
            })
          }
        />
        {(block.inner ?? []).map((inner, ii) => (
          <EditorCard
            key={`${inner._template}-${ii}`}
            title={PORADNIK_INNER_LABELS[inner._template]}
            onUp={() => onChange({ ...block, inner: moveItem(block.inner ?? [], ii, -1) })}
            onDown={() => onChange({ ...block, inner: moveItem(block.inner ?? [], ii, 1) })}
            onRemove={() =>
              onChange({ ...block, inner: (block.inner ?? []).filter((_, idx) => idx !== ii) })
            }
          >
            <InnerEditor
              inner={inner}
              onChange={(next) => {
                const innerList = [...(block.inner ?? [])];
                innerList[ii] = next;
                onChange({ ...block, inner: innerList });
              }}
            />
          </EditorCard>
        ))}
      </>
    );
  }
  if (block._template === "checklist") {
    return (
      <>
        <Field label="Nagłówek nad tytułem" hint="domyślnie: Podsumowanie">
          <TextInput
            value={block.kicker ?? "Podsumowanie"}
            onChange={(kicker) => onChange({ ...block, kicker })}
          />
        </Field>
        <Field label="Tytuł checklisty">
          <TextInput value={block.title} onChange={(title) => onChange({ ...block, title })} />
        </Field>
        <ImageField
          label="Zdjęcie"
          value={block.image ?? ""}
          onChange={(image) => onChange({ ...block, image })}
        />
        {block.image ? (
          <Field label="Alt zdjęcia">
            <TextInput value={block.imageAlt ?? ""} onChange={(imageAlt) => onChange({ ...block, imageAlt })} />
          </Field>
        ) : null}
        {block.items.map((item, ii) => (
          <Field key={ii} label={`Punkt ${ii + 1}`}>
            <div className="flex gap-2">
              <div className="flex-1">
                <TextInput
                  value={item}
                  onChange={(value) => {
                    const items = [...block.items];
                    items[ii] = value;
                    onChange({ ...block, items });
                  }}
                />
              </div>
              <button
                type="button"
                className="text-xs text-destructive"
                onClick={() => onChange({ ...block, items: block.items.filter((_, idx) => idx !== ii) })}
              >
                Usuń
              </button>
            </div>
          </Field>
        ))}
        <AddOne label="Dodaj punkt" onClick={() => onChange({ ...block, items: [...block.items, ""] })} />
      </>
    );
  }
  if (block._template === "cta") {
    return (
      <>
        <Field label="Nagłówek CTA">
          <TextInput value={block.title} onChange={(title) => onChange({ ...block, title })} />
        </Field>
        <Field label="Tekst">
          <TextArea value={block.lead} onChange={(lead) => onChange({ ...block, lead })} />
        </Field>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Przycisk główny">
            <TextInput value={block.primary} onChange={(primary) => onChange({ ...block, primary })} />
          </Field>
          <Field label="Link przycisku głównego">
            <TextInput
              value={block.primaryHref ?? "/#kontakt"}
              onChange={(primaryHref) => onChange({ ...block, primaryHref })}
            />
          </Field>
          <Field label="Przycisk dodatkowy">
            <TextInput value={block.secondary} onChange={(secondary) => onChange({ ...block, secondary })} />
          </Field>
          <Field label="Link przycisku dodatkowego">
            <TextInput
              value={block.secondaryHref ?? "/cv"}
              onChange={(secondaryHref) => onChange({ ...block, secondaryHref })}
            />
          </Field>
        </div>
        <ImageField
          label="Zdjęcie"
          value={block.image ?? ""}
          onChange={(image) => onChange({ ...block, image })}
        />
        {block.image ? (
          <Field label="Alt zdjęcia">
            <TextInput value={block.imageAlt ?? ""} onChange={(imageAlt) => onChange({ ...block, imageAlt })} />
          </Field>
        ) : null}
      </>
    );
  }
  if (isExtraBody(block)) {
    return <ExtraBodyFields block={block} onChange={onChange} />;
  }
  return null;
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
      <>
        <Field label="Tytuł ramki">
          <TextInput value={inner.title} onChange={(title) => onChange({ ...inner, title })} />
        </Field>
        <Field label="Tekst">
          <TextArea value={inner.text} onChange={(text) => onChange({ ...inner, text })} />
        </Field>
        <ImageField
          label="Zdjęcie w ramce"
          value={inner.image ?? ""}
          onChange={(image) => onChange({ ...inner, image })}
        />
      </>
    );
  }
  if (inner._template === "twoCol") {
    return (
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Lewa kolumna — tytuł">
          <TextInput value={inner.leftTitle} onChange={(leftTitle) => onChange({ ...inner, leftTitle })} />
        </Field>
        <Field label="Prawa kolumna — tytuł">
          <TextInput value={inner.rightTitle} onChange={(rightTitle) => onChange({ ...inner, rightTitle })} />
        </Field>
        <ImageField
          label="Lewe zdjęcie"
          value={inner.leftImage ?? ""}
          onChange={(leftImage) => onChange({ ...inner, leftImage })}
        />
        <ImageField
          label="Prawe zdjęcie"
          value={inner.rightImage ?? ""}
          onChange={(rightImage) => onChange({ ...inner, rightImage })}
        />
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
  if (inner._template === "image") {
    return (
      <>
        <ImageField label="Zdjęcie" value={inner.src} onChange={(src) => onChange({ ...inner, src })} />
        <Field label="Alt">
          <TextInput value={inner.alt} onChange={(alt) => onChange({ ...inner, alt })} />
        </Field>
        <Field label="Podpis">
          <TextArea value={inner.caption} onChange={(caption) => onChange({ ...inner, caption })} />
        </Field>
      </>
    );
  }
  if (inner._template === "gallery") {
    return (
      <>
        <Field label="Tytuł">
          <TextInput value={inner.title} onChange={(title) => onChange({ ...inner, title })} />
        </Field>
        <ImageListField
          label="Zdjęcia"
          images={inner.images}
          onChange={(images) => onChange({ ...inner, images })}
        />
      </>
    );
  }
  if (inner._template === "imagePair") {
    const cycleImages = inner.cycleImages ?? [];
    return (
      <>
        <p className="text-xs text-sage">Para zdjęć (setup / kadr)</p>
        {cycleImages.map((src, i) => (
          <ImageField
            key={i}
            label={`Klatka cyklu ${i + 1}`}
            value={src}
            onChange={(value) => {
              const next = [...cycleImages];
              next[i] = value;
              onChange({ ...inner, cycleImages: next });
            }}
          />
        ))}
        <div className="flex gap-2">
          <AddOne
            label="Dodaj klatkę"
            onClick={() => onChange({ ...inner, cycleImages: [...cycleImages, ""] })}
          />
          {cycleImages.length > 1 ? (
            <button
              type="button"
              className="text-xs text-destructive"
              onClick={() => onChange({ ...inner, cycleImages: cycleImages.slice(0, -1) })}
            >
              Usuń ostatnią klatkę
            </button>
          ) : null}
        </div>
        <Field label="Alt cyklu">
          <TextInput value={inner.cycleAlt} onChange={(cycleAlt) => onChange({ ...inner, cycleAlt })} />
        </Field>
        <Field label="Podpis cyklu">
          <TextArea
            value={inner.cycleCaption}
            onChange={(cycleCaption) => onChange({ ...inner, cycleCaption })}
          />
        </Field>
        <ImageField
          label="Zdjęcie w kadrze"
          value={inner.stillImage}
          onChange={(stillImage) => onChange({ ...inner, stillImage })}
        />
        <Field label="Alt kadru">
          <TextInput value={inner.stillAlt} onChange={(stillAlt) => onChange({ ...inner, stillAlt })} />
        </Field>
        <Field label="Podpis kadru">
          <TextArea
            value={inner.stillCaption}
            onChange={(stillCaption) => onChange({ ...inner, stillCaption })}
          />
        </Field>
      </>
    );
  }
  return null;
}
