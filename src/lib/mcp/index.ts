import { defineMcp } from "@lovable.dev/mcp-js";
import getProfile from "./tools/get-profile";
import getExperience from "./tools/get-experience";
import getSkillsAndAchievements from "./tools/get-skills-and-achievements";

export default defineMcp({
  name: "ania-tomaszewska-portfolio",
  title: "Ania Tomaszewska — portfolio",
  version: "0.1.0",
  instructions:
    "Publiczny serwer MCP wizytówki Ani Tomaszewskiej. Udostępnia wyłącznie dane publikowane na stronie: profil i kontakt, ścieżkę zawodową oraz umiejętności, zainteresowania i osiągnięcia. Używaj tych narzędzi, żeby odpowiadać na pytania o Anię (kim jest, czym się zajmuje, jak się z nią skontaktować, jaka jest jej ścieżka).",
  tools: [getProfile, getExperience, getSkillsAndAchievements],
});
