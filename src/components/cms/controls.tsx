import type { ReactNode } from "react";

export function EditorCard({
  title,
  hint,
  onRemove,
  onUp,
  onDown,
  children,
}: {
  title: string;
  hint?: string;
  onRemove?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl p-5 space-y-3 bg-white border border-ink/10 shadow-[0_12px_30px_-24px_oklch(0.2_0.04_40/0.7)]">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-clay mr-auto font-medium">{title}</p>
        {hint ? <span className="text-[11px] text-ink/45">{hint}</span> : null}
        {onUp ? (
          <button type="button" onClick={onUp} className="cms-chip">
            ↑
          </button>
        ) : null}
        {onDown ? (
          <button type="button" onClick={onDown} className="cms-chip">
            ↓
          </button>
        ) : null}
        {onRemove ? (
          <button type="button" onClick={onRemove} className="text-xs text-clay font-medium">
            Usuń
          </button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function AddMenu({
  label,
  options,
  onPick,
}: {
  label: string;
  options: { id: string; label: string }[];
  onPick: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-ink/60">{label}</span>
      {options.map((option) => (
        <button key={option.id} type="button" onClick={() => onPick(option.id)} className="cms-chip">
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function AddOne({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="cms-chip">
      {label}
    </button>
  );
}
