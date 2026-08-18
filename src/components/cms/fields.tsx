import { useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {hint ? <span className="block text-xs text-ink/55">{hint}</span> : null}
      {children}
    </label>
  );
}

export const inputClass = "cms-input";

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className={inputClass}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      autoComplete="off"
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      className={`${inputClass} min-h-[6.5rem] leading-relaxed`}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      className={inputClass}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

export async function uploadFile(file: File): Promise<string> {
  const body = new FormData();
  body.set("file", file);
  const res = await fetch("/api/cms/upload", { method: "POST", body });
  const json = (await res.json()) as { ok?: boolean; url?: string; error?: string };
  if (!res.ok || !json.ok || !json.url) {
    throw new Error(json.error || "Nie udało się wgrać pliku.");
  }
  return json.url;
}

async function uploadMany(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    urls.push(await uploadFile(file));
  }
  return urls;
}

function isImageUrl(value: string) {
  return Boolean(value) && !value.toLowerCase().includes(".pdf") && (value.startsWith("/") || value.startsWith("http"));
}

export function ImageField({
  label,
  value,
  onChange,
  hint,
  accept = "image/*",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  accept?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(list: FileList | File[] | null) {
    const file = list ? Array.from(list)[0] : null;
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadFile(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd wgrywania.");
    } finally {
      setBusy(false);
    }
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    void handleFiles(e.target.files);
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDrag(false);
    void handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-ink">{label}</p>
      {hint ? <p className="text-xs text-ink/55">{hint}</p> : null}
      <label
        className={`cms-drop block ${drag ? "cms-drop-on" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        <input type="file" accept={accept} className="hidden" onChange={onFile} />
        {busy ? "Wgrywam…" : "Upuść zdjęcie albo kliknij, żeby wgrać"}
      </label>
      <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} placeholder="albo wklej URL" />
      {value ? (
        <div className="flex items-end gap-3">
          {isImageUrl(value) ? (
            <img src={value} alt="" className="max-h-40 max-w-full rounded-xl object-contain bg-white border border-ink/10" />
          ) : (
            <p className="text-xs text-ink/55 break-all">{value}</p>
          )}
          <button type="button" className="text-xs text-clay" onClick={() => onChange("")}>
            Usuń zdjęcie
          </button>
        </div>
      ) : null}
      {error ? <p className="text-xs text-clay">{error}</p> : null}
    </div>
  );
}

export function ImageListField({
  label,
  images,
  onChange,
  hint,
}: {
  label: string;
  images: { src: string; alt: string }[];
  onChange: (images: { src: string; alt: string }[]) => void;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  async function addFiles(list: FileList | File[] | null) {
    const files = list ? Array.from(list) : [];
    if (!files.length) return;
    setBusy(true);
    try {
      const urls = await uploadMany(files);
      onChange([...images, ...urls.map((src) => ({ src, alt: "" }))]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-ink">{label}</p>
        {hint ? <p className="text-xs text-ink/55">{hint}</p> : null}
      </div>
      <label
        className={`cms-drop block ${drag ? "cms-drop-on" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void addFiles(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {busy ? "Wgrywam zdjęcia…" : "Upuść kilka zdjęć albo kliknij — można dodać wiele naraz"}
      </label>
      {images.map((img, i) => (
        <div key={`${img.src}-${i}`} className="rounded-2xl border border-ink/10 bg-white p-3 space-y-2">
          <ImageField
            label={`Zdjęcie ${i + 1}`}
            value={img.src}
            onChange={(src) => {
              const next = [...images];
              next[i] = { ...img, src };
              onChange(next);
            }}
          />
          <Field label="Opis (alt)">
            <TextInput
              value={img.alt}
              onChange={(alt) => {
                const next = [...images];
                next[i] = { ...img, alt };
                onChange(next);
              }}
            />
          </Field>
          <button
            type="button"
            className="text-xs text-clay"
            onClick={() => onChange(images.filter((_, idx) => idx !== i))}
          >
            Usuń
          </button>
        </div>
      ))}
    </div>
  );
}
