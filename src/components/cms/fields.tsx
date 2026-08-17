import type { ChangeEvent, ReactNode } from "react";

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
      <span className="text-sm font-medium text-foreground">{label}</span>
      {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
      {children}
    </label>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-sage/30 bg-cream/80 text-sm focus:outline-none focus:border-sage";

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
      className={`${inputClass} min-h-[6rem] leading-relaxed`}
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

export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    onChange(url);
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
        <label className="shrink-0 inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-sage/40 text-sm cursor-pointer hover:bg-sage/5">
          Wgraj
          <input type="file" accept="image/*,.pdf" className="hidden" onChange={onFile} />
        </label>
      </div>
      {value && !value.toLowerCase().includes(".pdf") && (value.startsWith("/") || value.startsWith("http")) ? (
        <img src={value} alt="" className="mt-2 max-h-32 rounded-lg object-contain bg-cream/50" />
      ) : null}
    </Field>
  );
}
