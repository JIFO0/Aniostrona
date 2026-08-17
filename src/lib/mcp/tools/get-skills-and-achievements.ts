import { defineTool } from "@lovable.dev/mcp-js";
import { stripRichText } from "@/lib/content";
import { readHome, readSite } from "@/lib/content/load.server";

export default defineTool({
  name: "get_skills_and_achievements",
  title: "Pobierz umiejętności i osiągnięcia",
  description:
    "Zwraca dziedziny, w których Ania pracuje (aktorstwo, modeling, zarządzanie, sztuka), zainteresowania, liczby (plany filmowe, prace plastyczne, lata na scenie), mocne strony i osiągnięcia.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const home = readHome();
    const site = readSite();
    const skills = {
      disciplines: home.whatIDo.items.map((item) => ({
        name: item.title,
        description: stripRichText(item.description),
      })),
      interests: home.interests.tags,
      numbers: Object.fromEntries(
        home.stats.map((s) => [s.label, `${s.value}${s.suffix} ${s.label}`]),
      ),
      strengths: home.teamwork.paragraphs.map(stripRichText),
      achievements: [
        stripRichText(home.achievements.featuredTitle) +
          " — " +
          stripRichText(home.achievements.featuredDescription),
        ...home.achievements.items.map((item) => stripRichText(item.text)),
      ],
      languages: site.languages,
    };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(skills, null, 2) }],
      structuredContent: skills,
    };
  },
});
