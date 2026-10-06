import { readFileSync, writeFileSync } from "node:fs";

const DATA_PATH = new URL("../data/vaultCodes.ts", import.meta.url);
const SOURCE_URL = "https://geometrydash.wiki.gg/wiki/Secret_Room";
const RAW_URL = `${SOURCE_URL}?action=raw`;
const API_URL =
  "https://geometrydash.wiki.gg/api.php?action=parse&page=Secret_Room&prop=wikitext&format=json";
const REFRESH_DAYS = 7;
const TIMEOUT_MS = 30000;

function daysBetween(dateA, dateB) {
  const start = new Date(`${dateA}T00:00:00Z`);
  const end = new Date(`${dateB}T00:00:00Z`);
  return Math.floor((end.getTime() - start.getTime()) / 86400000);
}

function normalizeCode(value) {
  return value.toLowerCase().replace(/\s+/g, "").trim();
}

function fingerprintKnownRewards(section) {
  const rows = [];

  for (const block of section.split("----")) {
    const code = block.match(/'''Code:'''\s*'([^']+)'/)?.[1]?.trim();
    if (!code) continue;

    const rewards = [];
    const rewardPattern = /\[\[File:([^\]|]+)[^\]]*\]\](?:\s*x(\d+))?/g;
    let match;
    while ((match = rewardPattern.exec(block))) {
      rewards.push(`${match[1].toLowerCase()}:${match[2] || "1"}`);
    }

    rows.push(`${normalizeCode(code)}|${rewards.join("+")}`);
  }

  rows.sort();
  let hash = 2166136261;
  for (const char of rows.join("\n")) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  return hash.toString(16).padStart(8, "0");
}

function readLocalCodes(source) {
  const block = source.match(
    /export const WRAITH_CODES:[\s\S]*?= \[([\s\S]*?)\n\];/
  )?.[1];

  if (!block) throw new Error("Could not locate WRAITH_CODES in vaultCodes.ts.");

  return [
    ...block.matchAll(/\{ code: "([^"]+)", reward: "([^"]+)"/g),
  ].map((match) => match[1].trim());
}

async function fetchText(url, accept) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: accept,
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/151 Safari/537.36 geometry-dash-spam-freshness-check",
        },
        redirect: "follow",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`${url} returned HTTP ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
}

async function fetchWikitext() {
  try {
    const raw = await fetchText(RAW_URL, "text/plain,text/html;q=0.9,*/*;q=0.8");
    if (raw.includes("|header = Known rewards")) return raw;
    throw new Error("Raw Secret Room response did not contain Known rewards.");
  } catch (rawError) {
    console.warn(`Secret Room raw endpoint unavailable: ${rawError.message}`);
  }

  const apiText = await fetchText(API_URL, "application/json");
  const payload = JSON.parse(apiText);
  const wikitext = payload?.parse?.wikitext?.["*"];

  if (typeof wikitext !== "string" || !wikitext.includes("|header = Known rewards")) {
    throw new Error("Secret Room API response did not contain parse.wikitext Known rewards.");
  }

  return wikitext;
}

function extractSection(source, header, nextHeader) {
  const start = source.indexOf(`|header = ${header}`);
  const end = source.indexOf(`|header = ${nextHeader}`, start + 1);

  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`Could not isolate Secret Room section "${header}".`);
  }

  return source.slice(start, end);
}

function extractCodes(section) {
  const codes = [
    ...section.matchAll(/'''Code:'''\s*'([^']+)'/g),
  ].map((match) => match[1].trim());

  if (codes.length < 30) {
    throw new Error(`Secret Room Known rewards yielded only ${codes.length} codes.`);
  }

  const normalized = codes.map(normalizeCode);
  const duplicates = normalized.filter(
    (code, index) => normalized.indexOf(code) !== index
  );

  if (duplicates.length) {
    throw new Error(
      `Secret Room Known rewards contains duplicate codes: ${[
        ...new Set(duplicates),
      ].join(", ")}`
    );
  }

  return codes;
}

const source = readFileSync(DATA_PATH, "utf8");
const checkedAt = source.match(/VAULT_CODES_CHECKED_AT = "([^"]+)"/)?.[1];
const expectedFingerprint = source.match(
  /WRAITH_KNOWN_REWARDS_FINGERPRINT = "([0-9a-f]{8})"/
)?.[1];
const sourceUrl = source.match(/wraith:\s*"([^"]+)"/)?.[1];

if (sourceUrl !== SOURCE_URL) {
  throw new Error(
    `Configured Wraith source changed: expected ${SOURCE_URL}, found ${sourceUrl ?? "missing"}.`
  );
}

if (!checkedAt || !/^\d{4}-\d{2}-\d{2}$/.test(checkedAt)) {
  throw new Error("VAULT_CODES_CHECKED_AT must be a YYYY-MM-DD date.");
}

if (!expectedFingerprint) {
  throw new Error(
    "WRAITH_KNOWN_REWARDS_FINGERPRINT must be an 8-character lowercase hex value."
  );
}

const wikitext = await fetchWikitext();
const knownSection = extractSection(wikitext, "Known rewards", "Limited-time rewards");
const limitedSection = extractSection(
  wikitext,
  "Limited-time rewards",
  "Unavailable codes"
);
const liveCodes = extractCodes(knownSection);
const liveFingerprint = fingerprintKnownRewards(knownSection);
const limitedCodes = [
  ...limitedSection.matchAll(/'''Code:'''\s*'([^']+)'/g),
].map((match) => match[1].trim());
const localCodes = readLocalCodes(source);

const liveMap = new Map(liveCodes.map((code) => [normalizeCode(code), code]));
const localMap = new Map(localCodes.map((code) => [normalizeCode(code), code]));
const added = [...liveMap.keys()]
  .filter((code) => !localMap.has(code))
  .map((code) => liveMap.get(code));
const removed = [...localMap.keys()]
  .filter((code) => !liveMap.has(code))
  .map((code) => localMap.get(code));
const limitedOverlap = limitedCodes
  .filter((code) => localMap.has(normalizeCode(code)));

if (
  added.length ||
  removed.length ||
  limitedOverlap.length ||
  liveFingerprint !== expectedFingerprint
) {
  const parts = [];
  if (added.length) parts.push(`new live codes: ${added.join(", ")}`);
  if (removed.length) parts.push(`no longer in Known rewards: ${removed.join(", ")}`);
  if (limitedOverlap.length) {
    parts.push(`limited-time codes incorrectly stored as permanent: ${limitedOverlap.join(", ")}`);
  }
  if (liveFingerprint !== expectedFingerprint) {
    parts.push(
      `Known rewards fingerprint changed: expected ${expectedFingerprint}, live ${liveFingerprint}`
    );
  }

  throw new Error(
    `Wraith live data differs from vaultCodes.ts (${parts.join("; ")}). Review rewards before updating the permanent snapshot.`
  );
}

const today = new Date().toISOString().slice(0, 10);
if (daysBetween(checkedAt, today) < REFRESH_DAYS) {
  console.log(
    `Wraith live codes verified: ${liveCodes.length} permanent codes, reward fingerprint ${liveFingerprint}; checkedAt ${checkedAt} is still fresh.`
  );
  process.exit(0);
}

const next = source.replace(
  /VAULT_CODES_CHECKED_AT = "[^"]+"/,
  `VAULT_CODES_CHECKED_AT = "${today}"`
);
writeFileSync(DATA_PATH, next, "utf8");
console.log(
  `Wraith live codes verified: ${liveCodes.length} permanent codes, reward fingerprint ${liveFingerprint}. Refreshed checkedAt to ${today}.`
);
