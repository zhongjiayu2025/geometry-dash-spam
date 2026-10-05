export type VaultCode = {
  code: string;
  reward: string;
  note?: string;
};

export const VAULT_CODES_CHECKED_AT = "2026-10-05";

export const VAULT_SOURCES = {
  vault: "https://geometrydash.wiki.gg/wiki/Vault",
  secrets: "https://geometrydash.wiki.gg/wiki/Vault_of_Secrets",
  chamber: "https://geometrydash.wiki.gg/wiki/Chamber_of_Time",
  wraith: "https://geometrydash.wiki.gg/wiki/Secret_Room",
};

export const THE_VAULT_CODES: VaultCode[] = [
  { code: "spooky", reward: "Icon Kit reward" },
  { code: "lenny", reward: "Icon Kit reward" },
  { code: "your in-game username", reward: "Icon Kit reward", note: "Enter the username used by your save." },
  { code: "mule", reward: "Icon Kit reward" },
  { code: "blockbite", reward: "Icon Kit reward" },
  { code: "neverending", reward: "Icon Kit reward" },
  { code: "ahead", reward: "Icon Kit reward" },
  { code: "8 → 16 → 30 → 32 → 46 → 84", reward: "Secret reward", note: "Enter the numbers one at a time in this order." },
  { code: "robotop", reward: "Icon Kit reward" },
  { code: "gandalfpotter", reward: "Icon Kit reward" },
  { code: "sparky", reward: "Secret coin / progression interaction" },
  { code: "finalboss", reward: "Icon Kit reward" },
];

export const VAULT_OF_SECRETS_CODES: VaultCode[] = [
  { code: "your star count", reward: "Star-count icon", note: "Enter the number of stars currently shown on your account." },
  { code: "cod3breaker", reward: "Codebreaker puzzle", note: "Generates a number sequence that must be solved." },
  { code: "brainpower", reward: "Brain-themed icon" },
  { code: "octocube", reward: "Cube icon" },
  { code: "seven", reward: "Cube 108" },
  { code: "thechickenisonfire", reward: "Secondary color" },
  { code: "gimmiethecolor", reward: "Primary color" },
  { code: "glubfub", reward: "Secret coin", note: "Requires the Sparky/Glubfub dialogue sequence first." },
  { code: "d4shg30me7ry", reward: "Cube 466" },
  { code: "thechickenisready", reward: "Ship 163" },
  { code: "the challenge", reward: "Unlocks The Challenge", note: "The Challenge then requires 200 diamonds to access." },
];

export const CHAMBER_CODES: VaultCode[] = [
  { code: "silence", reward: "Cube 89" },
  { code: "hunger", reward: "Cube 90" },
  { code: "darkness", reward: "Cube 91" },
  { code: "volcano", reward: "Wave 23" },
  { code: "river", reward: "Secondary color" },
  { code: "backontrack", reward: "Spider 26" },
  { code: "givemehelper", reward: "Robot 46" },
];

export const WRAITH_CODES: VaultCode[] = [
  { code: "robtopisnice", reward: "10 Mana Orbs" },
  { code: "skibidi", reward: "1 Mana Orb" },
  { code: "checksteam", reward: "Demon Key" },
  { code: "fireinthehole", reward: "Shard reward" },
  { code: "wateronthehill", reward: "Shard reward" },
  { code: "wellmet", reward: "5 Diamonds" },
  { code: "bussin", reward: "69 Mana Orbs" },
  { code: "thickofit", reward: "1 Mana Orb" },
  { code: "touchgrass", reward: "Shard reward" },
  { code: "backondash", reward: "Icon reward" },
  { code: "key", reward: "Demon Key" },
  { code: "geometry", reward: "Icon reward" },
  { code: "citadel", reward: "Icon reward" },
  { code: "spacegauntlet", reward: "Resource reward" },
  { code: "retrospective", reward: "Icon reward" },
  { code: "iaminpain", reward: "100 Mana Orbs + 10 Diamonds" },
  { code: "ruins", reward: "Icon reward" },
  { code: "cheatcodes", reward: "Icon reward" },
  { code: "backstreetboy", reward: "Icon reward" },
  { code: "noelelectra", reward: "Icon reward" },
  { code: "gd2025", reward: "25 Mana Orbs + 25 Diamonds + key reward" },
  { code: "duckstep", reward: "Icon reward" },
  { code: "skylinept2", reward: "Icon reward" },
  { code: "boogie", reward: "Icon reward" },
  { code: "buttonmasher", reward: "Icon reward" },
  { code: "ncsalbum", reward: "Icon reward" },
  { code: "gullible", reward: "1 Mana Orb" },
  { code: "putyahandsup", reward: "Icon reward" },
  { code: "randomgauntlet", reward: "Icon reward" },
  { code: "ravenousbeasts", reward: "Icon reward" },
  { code: "brainpowah47", reward: "Icon reward" },
  { code: "kingsamgd", reward: "1 Mana Orb" },
  { code: "67", reward: "67 Mana Orbs" },
  { code: "v0rtrox", reward: "1 Mana Orb" },
  { code: "geometrydash.com", reward: "500 Mana Orbs + 20 Diamonds + key reward" },
  { code: "dualitygauntlet", reward: "Icon reward" },
  { code: "gds2mil", reward: "Icon reward" },
  { code: "timethief", reward: "Reward listed by the live Secret Room source" },
];
