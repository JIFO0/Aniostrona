import setup01 from "@/assets/photos/poradnik/setup-01.png";
import setup02 from "@/assets/photos/poradnik/setup-02.png";
import setup03 from "@/assets/photos/poradnik/setup-03.png";
import setup04 from "@/assets/photos/poradnik/setup-04.png";
import setup05 from "@/assets/photos/poradnik/setup-05.png";
import wkadrze from "@/assets/photos/poradnik/wkadrze.png";

const bundled: Record<string, string> = {
  "poradnik/setup-01.png": setup01,
  "poradnik/setup-02.png": setup02,
  "poradnik/setup-03.png": setup03,
  "poradnik/setup-04.png": setup04,
  "poradnik/setup-05.png": setup05,
  "poradnik/wkadrze.png": wkadrze,
};

export function resolveMedia(src: string): string {
  if (!src) return src;
  if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return bundled[src] ?? src;
}

export const poradnikOgImage = wkadrze;
