import { readFileSync } from "node:fs";

const DATA_PATH = new URL("../data/demons.ts", import.meta.url);
const UPDATE_PATH = new URL("./update-demon-list.mjs", import.meta.url);
const source = readFileSync(DATA_PATH, "utf8");
const updaterSource = readFileSync(UPDATE_PATH, "utf8");

const dateMatch = source.match(/DEMON_VERIFIED_AT = "([^"]+)"/);
const verifiedAt = dateMatch?.[1] ?? null;

const entries = [
  ...source.matchAll(
    /\{ rank: (\d+), level: "((?:\\.|[^"])*)", publisher: "((?:\\.|[^"])*)", difficulty: "Extreme Demon" \}/g
  ),
].map((match) => ({
  rank: Number(match[1]),
  level: JSON.parse(`"${match[2]}"`),
  publisher: JSON.parse(`"${match[3]}"`),
}));

const errors = [];

if (
  !updaterSource.includes("async function fetchFromPage()") ||
  !updaterSource.includes("Pointercrate page fallback yielded") ||
  !updaterSource.includes("Loaded Demon List from Pointercrate page fallback.") ||
  !updaterSource.includes("[\\u2066-\\u2069]") ||
  !updaterSource.includes("items.length !== 50")
) {
  errors.push(
    "Demon List updater must retain the validated Pointercrate page fallback when the API is unavailable."
  );
}

if (!verifiedAt || !/^\d{4}-\d{2}-\d{2}$/.test(verifiedAt)) {
  errors.push("DEMON_VERIFIED_AT must be a YYYY-MM-DD date.");
}

if (entries.length !== 50) {
  errors.push(`Expected exactly 50 Demon List entries, found ${entries.length}.`);
}

const ranks = entries.map((item) => item.rank);
const expectedRanks = Array.from({ length: 50 }, (_, index) => index + 1);

if (
  ranks.length === 50 &&
  ranks.some((rank, index) => rank !== expectedRanks[index])
) {
  errors.push("Demon List ranks must be contiguous from 1 through 50.");
}

const duplicateRanks = ranks.filter((rank, index) => ranks.indexOf(rank) !== index);
if (duplicateRanks.length) {
  errors.push(`Duplicate ranks: ${[...new Set(duplicateRanks)].join(", ")}.`);
}

const normalizedLevels = entries.map((item) => item.level.trim().toLowerCase());
const duplicateLevels = normalizedLevels.filter(
  (level, index) => normalizedLevels.indexOf(level) !== index
);
if (duplicateLevels.length) {
  errors.push(`Duplicate level names: ${[...new Set(duplicateLevels)].join(", ")}.`);
}

for (const item of entries) {
  if (!item.level.trim()) errors.push(`Rank #${item.rank} has an empty level name.`);
  if (!item.publisher.trim()) errors.push(`Rank #${item.rank} has an empty publisher.`);
  if (item.level.length > 120) {
    errors.push(`Rank #${item.rank} has an implausibly long level name (${item.level.length} characters).`);
  }
  if (item.publisher.length > 120) {
    errors.push(`Rank #${item.rank} has an implausibly long publisher name (${item.publisher.length} characters).`);
  }
  if (/\s#\d+\s[-–]/.test(item.level) || /published by/i.test(item.level)) {
    errors.push(`Rank #${item.rank} appears to contain scraped list markup instead of one level name.`);
  }
}

if (verifiedAt && /^\d{4}-\d{2}-\d{2}$/.test(verifiedAt)) {
  const verifiedDate = new Date(`${verifiedAt}T00:00:00Z`);
  const now = new Date();

  if (Number.isNaN(verifiedDate.getTime())) {
    errors.push("DEMON_VERIFIED_AT is not a valid calendar date.");
  } else {
    const ageDays = Math.floor((now.getTime() - verifiedDate.getTime()) / 86400000);

    if (ageDays < -1) {
      errors.push(`DEMON_VERIFIED_AT is in the future: ${verifiedAt}.`);
    } else if (ageDays > 14) {
      errors.push(
        `Demon List snapshot is ${ageDays} days old. Re-check Pointercrate before publishing.`
      );
    }
  }
}

if (errors.length) {
  console.error("Demon List data verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Demon List data verified: 50 contiguous unique entries, #1 ${entries[0].level}, checked ${verifiedAt}.`
);
