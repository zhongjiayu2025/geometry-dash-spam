import { readFileSync } from "node:fs";

const DATA_PATH = new URL("../data/vaultCodes.ts", import.meta.url);
const source = readFileSync(DATA_PATH, "utf8");

const dateMatch = source.match(/VAULT_CODES_CHECKED_AT = "([^"]+)"/);
const checkedAt = dateMatch?.[1] ?? null;

const blockMatch = source.match(/export const WRAITH_CODES:[\s\S]*?= \[([\s\S]*?)\n\];/);
const block = blockMatch?.[1] ?? "";

const entries = [
  ...block.matchAll(/\{ code: "([^"]+)", reward: "([^"]+)"(?:, note: "([^"]+)")? \}/g),
].map((match) => ({
  code: match[1].trim(),
  reward: match[2].trim(),
  note: match[3]?.trim() ?? "",
}));

const errors = [];

if (!checkedAt || !/^\d{4}-\d{2}-\d{2}$/.test(checkedAt)) {
  errors.push("VAULT_CODES_CHECKED_AT must be a YYYY-MM-DD date.");
}

if (!blockMatch) {
  errors.push("Could not locate WRAITH_CODES.");
}

if (entries.length < 30) {
  errors.push(`WRAITH_CODES looks unexpectedly short: found ${entries.length} entries.`);
}

const normalizedCodes = entries.map((item) => item.code.toLowerCase().replace(/\s+/g, ""));
const duplicateCodes = normalizedCodes.filter(
  (code, index) => normalizedCodes.indexOf(code) !== index
);

if (duplicateCodes.length) {
  errors.push(`Duplicate Wraith codes: ${[...new Set(duplicateCodes)].join(", ")}.`);
}

for (const item of entries) {
  if (!item.code) errors.push("Wraith code with an empty code value.");
  if (!item.reward) errors.push(`Wraith code "${item.code}" has an empty reward.`);
  if (/\bkey reward\b/i.test(item.reward)) {
    errors.push(
      `Wraith code "${item.code}" uses ambiguous "key reward" wording; specify Demon Key or Gold Key.`
    );
  }
}

if (checkedAt && /^\d{4}-\d{2}-\d{2}$/.test(checkedAt)) {
  const checkedDate = new Date(`${checkedAt}T00:00:00Z`);
  const now = new Date();

  if (Number.isNaN(checkedDate.getTime())) {
    errors.push("VAULT_CODES_CHECKED_AT is not a valid calendar date.");
  } else {
    const ageDays = Math.floor((now.getTime() - checkedDate.getTime()) / 86400000);

    if (ageDays < -1) {
      errors.push(`VAULT_CODES_CHECKED_AT is in the future: ${checkedAt}.`);
    } else if (ageDays > 14) {
      errors.push(
        `Wraith code data is ${ageDays} days old. Re-check the live Secret Room source before publishing.`
      );
    }
  }
}

if (errors.length) {
  console.error("Vault/Wraith data verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Vault/Wraith data verified: ${entries.length} unique current entries, checked ${checkedAt}.`
);
