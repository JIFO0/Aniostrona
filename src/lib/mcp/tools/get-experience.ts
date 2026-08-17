import { defineTool } from "@lovable.dev/mcp-js";
import { readHome } from "@/lib/content/load.server";

export default defineTool({
  name: "get_experience",
  title: "Pobierz ścieżkę zawodową",
  description:
    "Zwraca oś czasu edukacji i doświadczeń Ani: szkoła, warsztaty aktorskie, praca w Green Caffe Nero, filologia polska UW, Lambadjara i kurs jubilerstwa.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const timeline = readHome().path.items.map((item) => ({
      period: item.period,
      title: item.title,
      description: item.description,
    }));
    return {
      content: [{ type: "text" as const, text: JSON.stringify(timeline, null, 2) }],
      structuredContent: { timeline },
    };
  },
});
