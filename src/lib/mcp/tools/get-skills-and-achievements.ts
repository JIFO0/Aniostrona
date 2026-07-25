import { defineTool } from "@lovable.dev/mcp-js";

const skills = {
  disciplines: [
    {
      name: "Aktorstwo",
      description:
        "Na planach już od 2022. Warsztat u Łukasza Zubrzyckiego (Varsztatownia), weekendowy tryb w Warszawskim Studium Aktorskim. Egzaminy do szkół artystycznych w drodze.",
    },
    {
      name: "Modeling",
      description:
        "Twarz wielu sesji zdjęciowych. Dobrze czuje się przed aparatem, kamerą i światłem.",
    },
    {
      name: "Zarządzanie",
      description:
        "Green Caffe Nero: baristka od 10.2024, kierowniczka zmiany od 10.2025. Pięcie się po szczeblach wyszło naturalnie.",
    },
    {
      name: "Sztuka",
      description:
        "Ponad sto skończonych prac plastycznych. Dłubie przy detalach, poprawia pojedyncze pociągnięcie pędzla, aż efekt jest perfekcyjny.",
    },
  ],
  interests: [
    "estetyka",
    "marketing",
    "psychologia",
    "malarstwo",
    "aktorstwo",
    "jubilerstwo",
    "ludzie",
    "muzyka",
    "literatura",
  ],
  numbers: {
    film_sets: "20+ planów filmowych",
    artworks: "100+ prac plastycznych",
    stage_years: "4+ lata na scenie aktorskiej, reklamach i marketingu",
  },
  strengths: [
    "Świetnie radzi sobie z presją i wystąpieniami publicznymi.",
    "Wielozadaniowa, szybka adaptacja do nowego środowiska.",
    "Doskonale rozładowuje konflikty, umie reprezentować siebie i markę publicznie.",
    "Specjalizacja: szybkie rozwiązywanie skomplikowanych problemów.",
  ],
  achievements: [
    "I miejsce w wyzwaniu społecznym Destination Imagination (kreatywnosc.pl).",
    "Instant Challenge Champion, Knoxville, USA.",
    "Warsztaty aktorskie z Łukaszem Zubrzyckim (varsztatovnia.pl).",
  ],
};

export default defineTool({
  name: "get_skills_and_achievements",
  title: "Pobierz umiejętności i osiągnięcia",
  description:
    "Zwraca dziedziny, w których Ania pracuje (aktorstwo, modeling, zarządzanie, sztuka), zainteresowania, liczby (plany filmowe, prace plastyczne, lata na scenie), mocne strony i osiągnięcia.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(skills, null, 2) }],
    structuredContent: skills,
  }),
});
