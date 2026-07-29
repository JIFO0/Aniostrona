import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Download, ArrowLeft, FileText } from "lucide-react";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "CV — Anna Weronika Tomaszewska" },
      { name: "description", content: "Prywatne CV i dorobek artystyczny Anny Weroniki Tomaszewskiej. Zobacz lub pobierz pełne CV w formacie PDF." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "CV — Anna Weronika Tomaszewska" },
      { property: "og:description", content: "Prywatne CV i dorobek artystyczny Anny Weroniki Tomaszewskiej. Zobacz lub pobierz pełne CV w formacie PDF." },
      { property: "og:url", content: "https://annatomaszewska.pl/cv" },
    ],
    links: [
      { rel: "canonical", href: "https://annatomaszewska.pl/cv" },
    ],
  }),
  component: CVPage,
});

function CVPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  async function fetchPdf(password: string): Promise<Blob | null> {
    const res = await fetch("/api/public/cv", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.status === 401) return null;
    if (!res.ok) throw new Error("Nie udało się pobrać CV.");
    return await res.blob();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const blob = await fetchPdf(value);
      if (!blob) {
        setError(true);
        return;
      }
      setBlobUrl(URL.createObjectURL(blob));
      setUnlocked(true);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!blobUrl) return;
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "Anna-Tomaszewska-CV.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <main className="grain min-h-screen mesh-bg flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-cream/60 border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif italic text-lg tracking-wide">Ania Tomaszewska</Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> wróć
          </Link>
        </div>
      </nav>

      <section className="flex-1 flex items-center justify-center px-6 pt-32 pb-16">
        <div className="max-w-md w-full">
          {!unlocked ? (
            <div className="soft-card rounded-3xl p-10 text-center bg-gradient-to-br from-rose/40 via-cream to-sage/20 border border-sage/25">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-sage text-primary-foreground flex items-center justify-center mb-6 shadow-lg">
                <Lock className="w-6 h-6" />
              </div>
              <p className="text-xs tracking-[0.3em] uppercase text-sage mb-3">prywatne</p>
              <h1 className="font-serif text-3xl md:text-4xl mb-3">CV pod hasłem</h1>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                Wpisz hasło, żeby zobaczyć i pobrać CV.
              </p>
              <form onSubmit={onSubmit} className="space-y-4">
                <label htmlFor="cv-password" className="sr-only">Hasło dostępu do CV</label>
                <input
                  id="cv-password"
                  type="password"
                  aria-label="Hasło dostępu do CV"
                  autoFocus
                  value={value}
                  onChange={(e) => { setValue(e.target.value); setError(false); }}
                  placeholder="hasło"
                  className="w-full px-5 py-3 rounded-full border border-sage/30 bg-cream/70 text-center tracking-wide focus:outline-none focus:border-sage transition-colors"
                />
                {error && <p className="text-xs text-destructive">Niepoprawne hasło.</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02] disabled:opacity-60"
                >
                  {loading ? "Sprawdzam..." : "Odblokuj"}
                </button>
              </form>
            </div>
          ) : (
            <div className="soft-card rounded-3xl p-10 text-center bg-gradient-to-br from-rose/40 via-cream to-sage/20 border border-sage/25 animate-drift-in">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-sage text-primary-foreground flex items-center justify-center mb-6 shadow-lg">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-xs tracking-[0.3em] uppercase text-sage mb-3">gotowe</p>
              <h1 className="font-serif text-3xl md:text-4xl mb-3">Anna Weronika Tomaszewska</h1>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                Pełne CV, do pobrania w PDF.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={download}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-sage text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4" /> Pobierz CV (PDF)
                </button>
                {blobUrl && (
                  <a
                    href={blobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-sage/40 text-sm tracking-wide hover:bg-sage/5 transition-colors"
                  >
                    Otwórz w nowej karcie
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
