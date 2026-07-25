import { defineTool } from "@lovable.dev/mcp-js";

const profile = {
  name: "Anna Weronika Tomaszewska",
  nickname: "Ania",
  tagline: "aktorka, artystka, czasem niespełniona",
  bio: [
    "21-letnia aktorka i artystka. Wszędzie z małym aparatem, kupuję stosy płótna, w głowie koncepty i ludzie, których jeszcze nie zagrałam.",
    "Jestem z Warszawy, z Bemowa. Często jednak można mnie znaleźć w Gdyni. W torbie zawsze mały aparat, wracam z tym co warto zapamiętać.",
    "Radzę sobie z presją. Na scenie, na egzaminie, w ciężki dzień za barem. Nie ugina mnie tłum ani kamera, mówię publicznie tak samo spokojnie, jak piszę.",
    "Jestem bardzo uważna co do detali. Zauważę wszystko to, o czym nawet nie pomyślisz: drobiazg w kadrze, ton w rozmowie, czyjaś niepewność, czy po prostu coś, co nie do końca ma sens.",
    "Jak mam jakiś projekt, wkładam w niego całą siebie i użyję wszystkich umiejętności, jakie mam, żeby się powiódł, nawet jeżeli jest w zupełnie innej branży.",
  ],
  locations: ["Warszawa (Bemowo)", "Gdynia", "w drodze"],
  contact: {
    email: "aniat1090@gmail.com",
    phone: "518 357 491",
    instagram: "https://instagram.com/ann.veronique",
  },
  languages: [
    { name: "polski", level: "natywny" },
    { name: "angielski", level: "C1 (Cambridge B2, dziś biegły)" },
  ],
};

export default defineTool({
  name: "get_profile",
  title: "Pobierz profil Ani",
  description:
    "Zwraca podstawowe informacje o Ani Tomaszewskiej: krótkie bio, lokalizacje, kontakt (email, telefon, Instagram) oraz języki.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
    structuredContent: profile,
  }),
});
