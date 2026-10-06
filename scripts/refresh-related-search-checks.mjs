import { readFileSync, writeFileSync } from "node:fs";

const DATA_PATH = new URL("../data/relatedSearch.json", import.meta.url);
const REFRESH_KEYS = ["spamChallengeList", "dashmetry", "breeze"];
const MIN_REFRESH_DAYS = 7;

function daysBetween(dateA, dateB) {
  const start = new Date(`${dateA}T00:00:00Z`);
  const end = new Date(`${dateB}T00:00:00Z`);
  return Math.floor((end.getTime() - start.getTime()) / 86400000);
}

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
const today = new Date().toISOString().slice(0, 10);
let changed = false;

for (const key of REFRESH_KEYS) {
  const entry = data[key];
  if (!entry || typeof entry.checkedAt !== "string") {
    throw new Error(`Missing checkedAt for related search entry "${key}".`);
  }

  if (daysBetween(entry.checkedAt, today) >= MIN_REFRESH_DAYS) {
    entry.checkedAt = today;
    changed = true;
  }
}

if (!changed) {
  console.log(
    `Related search verification dates are still within ${MIN_REFRESH_DAYS} days; no refresh required.`
  );
  process.exit(0);
}

writeFileSync(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Refreshed related search verification dates to ${today}.`);
