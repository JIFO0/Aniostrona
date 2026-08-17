import { defineTool } from "@lovable.dev/mcp-js";
import { ageFromBirth } from "@/lib/content";
import { readHome, readSite } from "@/lib/content/load.server";

export default defineTool({
  name: "get_profile",
  title: "Pobierz profil Ani",
  description:
    "Zwraca podstawowe informacje o Ani Tomaszewskiej: krótkie bio, lokalizacje, kontakt (email, telefon, Instagram) oraz języki.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const site = readSite();
    const home = readHome();
    const age = ageFromBirth(site.birthYear, site.birthMonth);
    const profile = {
      name: site.name,
      nickname: site.nickname,
      tagline: site.tagline,
      bio: [`${age}-${home.hero.leadAfterAge}`, ...home.about.paragraphs, home.about.quote],
      locations: [site.locationNote, ...site.locations.filter((l) => l !== "Warszawa")],
      contact: {
        email: site.contact.email,
        phone: site.contact.phone,
        instagram: site.contact.instagramUrl,
      },
      languages: site.languages,
    };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(profile, null, 2) }],
      structuredContent: profile,
    };
  },
});
