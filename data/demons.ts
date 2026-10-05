export type DemonEntry = {
  rank: number;
  level: string;
  publisher: string;
  difficulty: "Extreme Demon";
};

export const DEMON_SOURCE_URL = "https://pointercrate.com/demonlist/";
export const DEMON_VERIFIED_AT = "2026-10-05";

export const DEMONS: DemonEntry[] = [
  { rank: 1, level: "Society", publisher: "Neomarbilan", difficulty: "Extreme Demon" },
  { rank: 2, level: "Thinking Space II", publisher: "CairoX", difficulty: "Extreme Demon" },
  { rank: 3, level: "Amethyst", publisher: "iMist", difficulty: "Extreme Demon" },
  { rank: 4, level: "Flamewall", publisher: "Narwall", difficulty: "Extreme Demon" },
  { rank: 5, level: "Tidal Wave", publisher: "OniLink", difficulty: "Extreme Demon" },
  { rank: 6, level: "Green Bullet", publisher: "cherryteam", difficulty: "Extreme Demon" },
  { rank: 7, level: "ORBIT", publisher: "MindCap", difficulty: "Extreme Demon" },
  { rank: 8, level: "Antarctic Lights", publisher: "declanlc", difficulty: "Extreme Demon" },
  { rank: 9, level: "Nullscapes", publisher: "Kiba", difficulty: "Extreme Demon" },
  { rank: 10, level: "Quanteuse processing", publisher: "Renn241", difficulty: "Extreme Demon" },
];
