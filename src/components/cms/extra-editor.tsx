import { Field, ImageField, ImageListField, TextArea, TextInput } from "@/components/cms/fields";
import { AddMenu, AddOne, EditorCard } from "@/components/cms/controls";
import { BoxStyleFields } from "@/components/cms/style-fields";
import {
  emptyExtraBlock,
  EXTRA_BLOCK_LABELS,
  HOME_SLOTS,
  moveItem,
  type ExtraBlock,
  type ExtraBlockBody,
  type ExtraTemplate,
} from "@/lib/content";

function OptionalImage({
  src,
  alt,
  onSrc,
  onAlt,
}: {
  src?: string;
  alt?: string;
  onSrc: (src: string) => void;
  onAlt?: (alt: string) => void;
}) {
  return (
    <>
      <ImageField label="Zdjęcie (opcjonalnie)" value={src ?? ""} onChange={onSrc} />
      {onAlt && (src ?? "") ? (
        <Field label="Alt zdjęcia">
          <TextInput value={alt ?? ""} onChange={onAlt} />
        </Field>
      ) : null}
    </>
  );
}

function patchBlock<T extends ExtraBlockBody>(block: T, partial: Partial<T>): T {
  return { ...block, ...partial };
}

export function ExtraBodyFields({
  block,
  onChange,
}: {
  block: ExtraBlockBody;
  onChange: (block: ExtraBlockBody) => void;
}) {
  if (block._template === "heading") {
    return (
      <>
        <Field label="Nad tytułem">
          <TextInput value={block.kicker} onChange={(kicker) => onChange(patchBlock(block, { kicker }))} />
        </Field>
        <Field label="Tytuł">
          <TextInput value={block.title} onChange={(title) => onChange(patchBlock(block, { title }))} />
        </Field>
        <Field label="Lead">
          <TextArea value={block.lead} onChange={(lead) => onChange(patchBlock(block, { lead }))} />
        </Field>
        <OptionalImage
          src={block.image}
          alt={block.imageAlt}
          onSrc={(image) => onChange(patchBlock(block, { image }))}
          onAlt={(imageAlt) => onChange(patchBlock(block, { imageAlt }))}
        />
      </>
    );
  }
  if (block._template === "text") {
    return (
      <>
        <Field label="Tekst">
          <TextArea rows={8} value={block.body} onChange={(body) => onChange(patchBlock(block, { body }))} />
        </Field>
        <OptionalImage
          src={block.image}
          alt={block.imageAlt}
          onSrc={(image) => onChange(patchBlock(block, { image }))}
          onAlt={(imageAlt) => onChange(patchBlock(block, { imageAlt }))}
        />
      </>
    );
  }
  if (block._template === "image") {
    return (
      <>
        <ImageField label="Zdjęcie" value={block.src} onChange={(src) => onChange(patchBlock(block, { src }))} />
        <Field label="Alt">
          <TextInput value={block.alt} onChange={(alt) => onChange(patchBlock(block, { alt }))} />
        </Field>
        <Field label="Podpis">
          <TextArea value={block.caption} onChange={(caption) => onChange(patchBlock(block, { caption }))} />
        </Field>
      </>
    );
  }
  if (block._template === "imageText") {
    return (
      <>
        <ImageField label="Zdjęcie" value={block.src} onChange={(src) => onChange(patchBlock(block, { src }))} />
        <Field label="Alt">
          <TextInput value={block.alt} onChange={(alt) => onChange(patchBlock(block, { alt }))} />
        </Field>
        <Field label="Tytuł">
          <TextInput value={block.title} onChange={(title) => onChange(patchBlock(block, { title }))} />
        </Field>
        <Field label="Tekst">
          <TextArea value={block.body} onChange={(body) => onChange(patchBlock(block, { body }))} />
        </Field>
        <Field label="Zdjęcie po">
            <select
            className="cms-input"
            value={block.imageSide}
            onChange={(e) =>
              onChange(patchBlock(block, { imageSide: e.target.value === "right" ? "right" : "left" }))
            }
          >
            <option value="left">lewej</option>
            <option value="right">prawej</option>
          </select>
        </Field>
      </>
    );
  }
  if (block._template === "gallery") {
    return (
      <>
        <Field label="Tytuł galerii">
          <TextInput value={block.title} onChange={(title) => onChange(patchBlock(block, { title }))} />
        </Field>
        <ImageListField
          label="Zdjęcia"
          hint="Można wrzucić kilka plików naraz."
          images={block.images}
          onChange={(images) => onChange(patchBlock(block, { images }))}
        />
      </>
    );
  }
  if (block._template === "cards") {
    return (
      <>
        <Field label="Tytuł rzędu kart">
          <TextInput value={block.title} onChange={(title) => onChange(patchBlock(block, { title }))} />
        </Field>
        {block.items.map((item, i) => (
          <div key={i} className="rounded-xl border border-sage/20 p-3 space-y-2">
            <ImageField
              label="Zdjęcie (opcjonalnie)"
              value={item.image}
              onChange={(image) => {
                const items = [...block.items];
                items[i] = { ...item, image };
                onChange(patchBlock(block, { items }));
              }}
            />
            <Field label="Tytuł karty">
              <TextInput
                value={item.title}
                onChange={(title) => {
                  const items = [...block.items];
                  items[i] = { ...item, title };
                  onChange(patchBlock(block, { items }));
                }}
              />
            </Field>
            <Field label="Tekst">
              <TextArea
                value={item.text}
                onChange={(text) => {
                  const items = [...block.items];
                  items[i] = { ...item, text };
                  onChange(patchBlock(block, { items }));
                }}
              />
            </Field>
            <button
              type="button"
              className="text-xs text-destructive"
              onClick={() => onChange(patchBlock(block, { items: block.items.filter((_, idx) => idx !== i) }))}
            >
              Usuń kartę
            </button>
          </div>
        ))}
        <AddOne
          label="Dodaj kartę"
          onClick={() =>
            onChange(patchBlock(block, { items: [...block.items, { title: "", text: "", image: "" }] }))
          }
        />
      </>
    );
  }
  if (block._template === "quote") {
    return (
      <>
        <Field label="Cytat">
          <TextArea value={block.text} onChange={(text) => onChange(patchBlock(block, { text }))} />
        </Field>
        <Field label="Podpis">
          <TextInput value={block.cite} onChange={(cite) => onChange(patchBlock(block, { cite }))} />
        </Field>
        <OptionalImage src={block.image} onSrc={(image) => onChange(patchBlock(block, { image }))} />
      </>
    );
  }
  if (block._template === "list") {
    return (
      <>
        <Field label="Tytuł listy">
          <TextInput value={block.title} onChange={(title) => onChange(patchBlock(block, { title }))} />
        </Field>
        <OptionalImage src={block.image} onSrc={(image) => onChange(patchBlock(block, { image }))} />
        {block.items.map((item, i) => (
          <Field key={i} label={`Punkt ${i + 1}`}>
            <div className="flex gap-2">
              <div className="flex-1">
                <TextInput
                  value={item}
                  onChange={(value) => {
                    const items = [...block.items];
                    items[i] = value;
                    onChange(patchBlock(block, { items }));
                  }}
                />
              </div>
              <button
                type="button"
                className="text-xs text-destructive"
                onClick={() => onChange(patchBlock(block, { items: block.items.filter((_, idx) => idx !== i) }))}
              >
                Usuń
              </button>
            </div>
          </Field>
        ))}
        <AddOne label="Dodaj punkt" onClick={() => onChange(patchBlock(block, { items: [...block.items, ""] }))} />
      </>
    );
  }
  if (block._template === "ctaBox") {
    return (
      <>
        <Field label="Nagłówek">
          <TextInput value={block.title} onChange={(title) => onChange(patchBlock(block, { title }))} />
        </Field>
        <Field label="Tekst">
          <TextArea value={block.lead} onChange={(lead) => onChange(patchBlock(block, { lead }))} />
        </Field>
        <Field label="Przycisk">
          <TextInput
            value={block.buttonLabel}
            onChange={(buttonLabel) => onChange(patchBlock(block, { buttonLabel }))}
          />
        </Field>
        <Field label="Link przycisku" hint="np. /#kontakt albo https://…">
          <TextInput
            value={block.buttonHref}
            onChange={(buttonHref) => onChange(patchBlock(block, { buttonHref }))}
          />
        </Field>
        <OptionalImage src={block.image} onSrc={(image) => onChange(patchBlock(block, { image }))} />
      </>
    );
  }
  if (block._template === "twoCol") {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Field label="Lewa kolumna — tytuł">
            <TextInput
              value={block.leftTitle}
              onChange={(leftTitle) => onChange(patchBlock(block, { leftTitle }))}
            />
          </Field>
          <Field label="Lewa kolumna — tekst">
            <TextArea
              value={block.leftText}
              onChange={(leftText) => onChange(patchBlock(block, { leftText }))}
            />
          </Field>
          <ImageField
            label="Lewe zdjęcie (opcjonalnie)"
            value={block.leftImage ?? ""}
            onChange={(leftImage) => onChange(patchBlock(block, { leftImage }))}
          />
        </div>
        <div className="space-y-3">
          <Field label="Prawa kolumna — tytuł">
            <TextInput
              value={block.rightTitle}
              onChange={(rightTitle) => onChange(patchBlock(block, { rightTitle }))}
            />
          </Field>
          <Field label="Prawa kolumna — tekst">
            <TextArea
              value={block.rightText}
              onChange={(rightText) => onChange(patchBlock(block, { rightText }))}
            />
          </Field>
          <ImageField
            label="Prawe zdjęcie (opcjonalnie)"
            value={block.rightImage ?? ""}
            onChange={(rightImage) => onChange(patchBlock(block, { rightImage }))}
          />
        </div>
      </div>
    );
  }
  if (block._template === "stats") {
    return (
      <>
        <Field label="Tytuł sekcji (opcjonalnie)">
          <TextInput value={block.title} onChange={(title) => onChange(patchBlock(block, { title }))} />
        </Field>
        {block.items.map((item, i) => (
          <div key={i} className="rounded-xl border border-sage/20 p-3 grid md:grid-cols-3 gap-2">
            <Field label="Wartość (np. 15+)">
              <TextInput
                value={item.value}
                onChange={(value) => {
                  const items = [...block.items];
                  items[i] = { ...item, value };
                  onChange(patchBlock(block, { items }));
                }}
              />
            </Field>
            <Field label="Etykieta">
              <TextInput
                value={item.label}
                onChange={(label) => {
                  const items = [...block.items];
                  items[i] = { ...item, label };
                  onChange(patchBlock(block, { items }));
                }}
              />
            </Field>
            <Field label="Dopisek">
              <TextInput
                value={item.note}
                onChange={(note) => {
                  const items = [...block.items];
                  items[i] = { ...item, note };
                  onChange(patchBlock(block, { items }));
                }}
              />
            </Field>
            <button
              type="button"
              className="text-xs text-destructive text-left"
              onClick={() => onChange(patchBlock(block, { items: block.items.filter((_, idx) => idx !== i) }))}
            >
              Usuń kafelek
            </button>
          </div>
        ))}
        <AddOne
          label="Dodaj liczbę"
          onClick={() =>
            onChange(patchBlock(block, { items: [...block.items, { value: "", label: "", note: "" }] }))
          }
        />
      </>
    );
  }
  if (block._template === "callout") {
    return (
      <>
        <Field label="Kicker (opcjonalnie)">
          <TextInput value={block.kicker} onChange={(kicker) => onChange(patchBlock(block, { kicker }))} />
        </Field>
        <Field label="Tytuł">
          <TextInput value={block.title} onChange={(title) => onChange(patchBlock(block, { title }))} />
        </Field>
        <Field label="Tekst">
          <TextArea value={block.text} onChange={(text) => onChange(patchBlock(block, { text }))} />
        </Field>
        <OptionalImage src={block.image} onSrc={(image) => onChange(patchBlock(block, { image }))} />
      </>
    );
  }
  if (block._template === "buttons") {
    return (
      <>
        <Field label="Nagłówek (opcjonalnie)">
          <TextInput value={block.title} onChange={(title) => onChange(patchBlock(block, { title }))} />
        </Field>
        {block.items.map((btn, i) => (
          <div key={i} className="rounded-xl border border-sage/20 p-3 grid md:grid-cols-3 gap-2">
            <Field label="Tekst przycisku">
              <TextInput
                value={btn.label}
                onChange={(label) => {
                  const items = [...block.items];
                  items[i] = { ...btn, label };
                  onChange(patchBlock(block, { items }));
                }}
              />
            </Field>
            <Field label="Link (href)">
              <TextInput
                value={btn.href}
                onChange={(href) => {
                  const items = [...block.items];
                  items[i] = { ...btn, href };
                  onChange(patchBlock(block, { items }));
                }}
              />
            </Field>
            <Field label="Styl">
              <select
                className="cms-input"
                value={btn.variant}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...btn, variant: e.target.value === "outline" ? "outline" : "primary" };
                  onChange(patchBlock(block, { items }));
                }}
              >
                <option value="primary">Wypełniony</option>
                <option value="outline">Kontur</option>
              </select>
            </Field>
            <button
              type="button"
              className="text-xs text-destructive text-left"
              onClick={() => onChange(patchBlock(block, { items: block.items.filter((_, idx) => idx !== i) }))}
            >
              Usuń przycisk
            </button>
          </div>
        ))}
        <AddOne
          label="Dodaj przycisk"
          onClick={() =>
            onChange(patchBlock(block, { items: [...block.items, { label: "Przycisk", href: "#", variant: "primary" }] }))
          }
        />
      </>
    );
  }
  if (block._template === "video") {
    return (
      <>
        <Field label="Tytuł (opcjonalnie)">
          <TextInput value={block.title} onChange={(title) => onChange(patchBlock(block, { title }))} />
        </Field>
        <Field label="URL wideo (YouTube, Vimeo albo .mp4)">
          <TextInput value={block.url} onChange={(url) => onChange(patchBlock(block, { url }))} />
        </Field>
        <Field label="Podpis (opcjonalnie)">
          <TextArea value={block.caption} onChange={(caption) => onChange(patchBlock(block, { caption }))} />
        </Field>
      </>
    );
  }
  if (block._template === "spacer") {
    return (
      <div className="grid md:grid-cols-2 gap-3 items-center">
        <Field label="Wysokość odstępu">
          <select
            className="cms-input"
            value={block.height}
            onChange={(e) =>
              onChange(patchBlock(block, { height: e.target.value as "sm" | "md" | "lg" }))
            }
          >
            <option value="sm">Mały</option>
            <option value="md">Średni</option>
            <option value="lg">Duży</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm pt-5">
          <input
            type="checkbox"
            checked={block.showLine}
            onChange={(e) => onChange(patchBlock(block, { showLine: e.target.checked }))}
          />
          Pokaż cienką linię podziału
        </label>
      </div>
    );
  }
  return null;
}

export function ExtraBlocksEditor({
  blocks,
  onChange,
  showAfter = true,
}: {
  blocks: ExtraBlock[];
  onChange: (blocks: ExtraBlock[]) => void;
  showAfter?: boolean;
}) {
  const options = (Object.keys(EXTRA_BLOCK_LABELS) as ExtraTemplate[]).map((id) => ({
    id,
    label: EXTRA_BLOCK_LABELS[id],
  }));

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Tu dokładsz nowe kawałki strony: zdjęcia, teksty, karty, listy. Na razie wyglądają prosto — później
        można je wystylować. Kotwica sekcji to jej id, możesz ją wpisać w nawigacji jako{" "}
        <code>#id-sekcji</code>.
      </p>
      <AddMenu
        label="Dodaj blok:"
        options={options}
        onPick={(id) => onChange([...blocks, emptyExtraBlock(id as ExtraTemplate)])}
      />
      {blocks.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nie ma jeszcze dodatkowych sekcji.</p>
      ) : null}
      {blocks.map((block, i) => (
        <EditorCard
          key={block.id}
          title={EXTRA_BLOCK_LABELS[block._template]}
          hint={block.id}
          onUp={() => onChange(moveItem(blocks, i, -1))}
          onDown={() => onChange(moveItem(blocks, i, 1))}
          onRemove={() => onChange(blocks.filter((_, idx) => idx !== i))}
        >
          <Field label="Id / kotwica" hint="Użyj w menu, np. #rola-aktorska">
            <TextInput
              value={block.id}
              onChange={(id) => {
                const next = [...blocks];
                next[i] = { ...block, id };
                onChange(next);
              }}
            />
          </Field>
          {showAfter ? (
            <Field label="Pokaż po">
              <select
                className="cms-input"
                value={block.after || "achievements"}
                onChange={(e) => {
                  const next = [...blocks];
                  next[i] = { ...block, after: e.target.value };
                  onChange(next);
                }}
              >
                {HOME_SLOTS.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
          <ExtraBodyFields
            block={block}
            onChange={(body) => {
              const next = [...blocks];
              next[i] = { ...body, id: block.id, after: block.after, boxStyle: block.boxStyle };
              onChange(next);
            }}
          />
          <BoxStyleFields
            value={block.boxStyle}
            onChange={(boxStyle) => {
              const next = [...blocks];
              next[i] = { ...block, boxStyle };
              onChange(next);
            }}
          />
        </EditorCard>
      ))}
    </div>
  );
}
