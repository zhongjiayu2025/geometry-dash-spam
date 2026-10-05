import { readFileSync, writeFileSync } from "node:fs";

const API_URL = "https://pointercrate.com/api/v2/demons/listed/?limit=50";
const PAGE_URL = "https://pointercrate.com/demonlist/?submitter=true";
const DATA_PATH = new URL("../data/demons.ts", import.meta.url);

const MAX_AGE_DAYS = 7;
const TIMEOUT_MS = 60000;

async function fetchWithTimeout(url, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, {
      headers: {
        "User-Agent": "geometrydashspam.cc demon-list refresh",
        ...headers,
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchFromApi() {
  const response = await fetchWithTimeout(API_URL, {
    Accept: "application/json",
  });

  if (!response.ok) {
    throw new Error(`Pointercrate API returned HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Pointercrate API response was not an array");
  }

  return data;
}

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function parseRankedDemonsFromHtml(html) {
  const text = decodeHtml(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[\u2068\u2069\u200e\u200f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const entries = [];
  const pattern =
    /#\s*(\d+)\s*[–-]\s*(.*?)\s+published by\s+(.*?)\s+(?=\d+(?:\.\d+)?\s*\(|#\s*\d+\s*[–-])/g;

  for (const match of text.matchAll(pattern)) {
    const position = Number(match[1]);
    if (position < 1 || position > 50) continue;

    entries.push({
      position,
      name: match[2].trim(),
      publisher: { name: match[3].trim() },
    });
  }

  const unique = new Map();
  for (const item of entries) {
    if (!unique.has(item.position)) unique.set(item.position, item);
  }

  return [...unique.values()].sort((a, b) => a.position - b.position);
}

async function fetchFromPage() {
  const response = await fetchWithTimeout(PAGE_URL, {
    Accept: "text/html,application/xhtml+xml",
  });

  if (!response.ok) {
    throw new Error(`Pointercrate page returned HTTP ${response.status}`);
  }

  const html = await response.text();
  const parsed = parseRankedDemonsFromHtml(html);

  if (parsed.length < 50) {
    throw new Error(`Could only parse ${parsed.length} top-50 entries from Pointercrate HTML`);
  }

  return parsed;
}

async function fetchRankedDemons() {
  try {
    const data = await fetchFromApi();
    console.log("Loaded Demon List from Pointercrate API.");
    return data;
  } catch (apiError) {
    console.warn(`Pointercrate API unavailable: ${apiError.message}`);
  }

  try {
    const data = await fetchFromPage();
    console.log("Loaded Demon List from Pointercrate HTML fallback.");
    return data;
  } catch (pageError) {
    console.warn(`Pointercrate page fallback unavailable: ${pageError.message}`);
    return null;
  }
}

function normalize(items) {
  const top50 = items
    .filter((item) => Number.isInteger(item.position) && item.position >= 1 && item.position <= 50)
    .sort((a, b) => a.position - b.position)
    .map((item) => ({
      rank: item.position,
      level: String(item.name || "").trim(),
      publisher: String(item.publisher?.name || "").trim(),
    }));

  if (top50.length !== 50) {
    throw new Error(`Expected 50 ranked demons, received ${top50.length}`);
  }

  const ranks = top50.map((item) => item.rank);
  const expectedRanks = Array.from({ length: 50 }, (_, index) => index + 1);

  if (ranks.some((rank, index) => rank !== expectedRanks[index])) {
    throw new Error("Pointercrate top 50 positions are not contiguous");
  }

  for (const item of top50) {
    if (!item.level || !item.publisher) {
      throw new Error(`Missing level or publisher at rank #${item.rank}`);
    }
  }

  return top50;
}

function escapeTs(value) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function readCurrentState(source) {
  const dateMatch = source.match(/DEMON_VERIFIED_AT = "([^"]+)"/);
  const entryMatches = [
    ...source.matchAll(
      /\{ rank: (\d+), level: "((?:\\.|[^"])*)", publisher: "((?:\\.|[^"])*)", difficulty: "Extreme Demon" \}/g
    ),
  ];

  return {
    verifiedAt: dateMatch?.[1] ?? null,
    entries: entryMatches.map((match) => ({
      rank: Number(match[1]),
      level: JSON.parse(`"${match[2]}"`),
      publisher: JSON.parse(`"${match[3]}"`),
    })),
  };
}

function daysBetween(dateA, dateB) {
  const start = new Date(`${dateA}T00:00:00Z`);
  const end = new Date(`${dateB}T00:00:00Z`);
  return Math.floor((end.getTime() - start.getTime()) / 86400000);
}

function sameEntries(a, b) {
  return (
    a.length === b.length &&
    a.every(
      (item, index) =>
        item.rank === b[index]?.rank &&
        item.level === b[index]?.level &&
        item.publisher === b[index]?.publisher
    )
  );
}

function render(entries, verifiedAt) {
  const rows = entries
    .map(
      (item) =>
        `  { rank: ${item.rank}, level: "${escapeTs(item.level)}", publisher: "${escapeTs(item.publisher)}", difficulty: "Extreme Demon" },`
    )
    .join("\n");

  return `export type DemonEntry = {
  rank: number;
  level: string;
  publisher: string;
  difficulty: "Extreme Demon";
};

export const DEMON_SOURCE_URL = "https://pointercrate.com/demonlist/";
export const DEMON_API_URL = "${API_URL}";
export const DEMON_VERIFIED_AT = "${verifiedAt}";

export const DEMONS: DemonEntry[] = [
${rows}
];
`;
}

const source = readFileSync(DATA_PATH, "utf8");
const current = readCurrentState(source);
const raw = await fetchRankedDemons();

if (!raw) {
  console.warn(
    `Pointercrate could not be reached. Keeping the last verified snapshot from ${current.verifiedAt ?? "an unknown date"}.`
  );
  process.exit(0);
}

const fetched = normalize(raw);
const today = new Date().toISOString().slice(0, 10);

const rankingChanged = !sameEntries(current.entries, fetched);
const verificationExpired =
  !current.verifiedAt || daysBetween(current.verifiedAt, today) >= MAX_AGE_DAYS;

if (!rankingChanged && !verificationExpired) {
  console.log(
    `Pointercrate snapshot unchanged; last verified ${current.verifiedAt}. No update required.`
  );
  process.exit(0);
}

writeFileSync(DATA_PATH, render(fetched, today), "utf8");

console.log(
  rankingChanged
    ? `Pointercrate ranking changed. Refreshed top 50 on ${today}.`
    : `Pointercrate ranking unchanged. Refreshed weekly verification date to ${today}.`
);
