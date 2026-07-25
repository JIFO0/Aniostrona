import { defineTool } from "@lovable.dev/mcp-js";

const timeline = [
  {
    period: "2020 - 2024",
    title: "Liceum Marii Pawlikowskiej-Jasnorzewskiej",
    description:
      "LXVII LO w Warszawie. Napisana matura rozszerzona z polskiego oraz z angielskiego.",
  },
  {
    period: "od 2023",
    title: "Aktorka",
    description:
      "Pierwsze kroki filmowe, statystka w wielu produkcjach, gdzie tylko się dało.",
  },
  {
    period: "2023",
    title: "Warsztaty z Łukaszem Zubrzyckim",
    description:
      "Varsztatownia, cały kurs ukończony z myślą o karierze aktorskiej.",
  },
  {
    period: "od 10.2024",
    title: "Green Caffe Nero, baristka",
    description:
      "Baristka i od samego początku bardzo przykładałam się do pracy.",
  },
  {
    period: "10.2025 - 03.2026",
    title: "Uniwersytet Warszawski, filologia polska",
    description:
      "Specjalność literaturoznawczo-językoznawcza, żeby lepiej zapoznać się z tekstami od strony technicznej.",
  },
  {
    period: "od 10.2025",
    title: "Kierowniczka zmiany, Green Caffe Nero",
    description:
      "Awans wyszedł naturalnie, bardzo dobrze sobie w tym radziłam.",
  },
  {
    period: "od 06.2026",
    title: "Kreatorka mediów, Lambadjara",
    description:
      "Tworzenie contentu wokół marki i narracji o niej, a także samo robienie handmade koralików.",
  },
  {
    period: "obecnie",
    title: "Profesjonalny kurs jubilerstwa, tryb dzienny",
    description:
      "Marketing już umiem, teraz uczę się pracować z metalem, żeby kiedyś otworzyć własną markę.",
  },
];

export default defineTool({
  name: "get_experience",
  title: "Pobierz ścieżkę zawodową",
  description:
    "Zwraca oś czasu edukacji i doświadczeń Ani: szkoła, warsztaty aktorskie, praca w Green Caffe Nero, filologia polska UW, Lambadjara i kurs jubilerstwa.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(timeline, null, 2) }],
    structuredContent: { timeline },
  }),
});
