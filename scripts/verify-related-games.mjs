import { readFileSync } from "node:fs";

const dataPath = new URL("../data/relatedSearch.json", import.meta.url);
const relatedSearchData = JSON.parse(readFileSync(dataPath, "utf8"));

const pages = [
  {
    key: "spamChallengeList",
    label: "Spam Challenge List",
    file: new URL("../app/spam-challenge-list/page.tsx", import.meta.url),
  },
  {
    key: "dashmetry",
    label: "Dashmetry / Challenge Rush",
    file: new URL("../app/dashmetry/page.tsx", import.meta.url),
  },
  {
    key: "breeze",
    label: "Geometry Dash Breeze",
    file: new URL("../app/geometry-dash-breeze/page.tsx", import.meta.url),
  },
];

const MAX_AGE_DAYS = 30;
const errors = [];
const now = new Date();

for (const page of pages) {
  const config = relatedSearchData[page.key];
  const source = readFileSync(page.file, "utf8");

  if (!config || typeof config !== "object") {
    errors.push(`${page.label}: missing data/relatedSearch.json entry "${page.key}".`);
    continue;
  }

  const checkedAt = config.checkedAt;
  if (typeof checkedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(checkedAt)) {
    errors.push(`${page.label}: checkedAt must be a YYYY-MM-DD date.`);
    continue;
  }

  const checkedDate = new Date(`${checkedAt}T00:00:00Z`);
  if (Number.isNaN(checkedDate.getTime())) {
    errors.push(`${page.label}: checkedAt is not a valid calendar date.`);
    continue;
  }

  const ageDays = Math.floor((now.getTime() - checkedDate.getTime()) / 86400000);
  if (ageDays < -1) {
    errors.push(`${page.label}: checkedAt is in the future: ${checkedAt}.`);
  } else if (ageDays > MAX_AGE_DAYS) {
    errors.push(
      `${page.label}: source check is ${ageDays} days old. Re-check the current source before publishing.`
    );
  }

  if (!Array.isArray(config.sources) || config.sources.length < 1) {
    errors.push(`${page.label}: at least one source URL is required.`);
  } else {
    for (const url of config.sources) {
      if (typeof url !== "string" || !url.startsWith("https://")) {
        errors.push(`${page.label}: invalid source URL: ${String(url)}`);
      }
    }
  }

  if (!source.includes(`relatedSearchData.${page.key}`)) {
    errors.push(
      `${page.label}: page is not wired to the centralized related-search data entry.`
    );
  }
}

if (errors.length) {
  console.error("Related search source verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Related search sources verified: ${pages.length} pages checked within ${MAX_AGE_DAYS} days.`
);
