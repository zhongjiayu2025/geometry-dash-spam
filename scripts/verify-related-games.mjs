import { readFileSync } from "node:fs";

const pages = [
  {
    label: "Dashmetry / Challenge Rush",
    file: new URL("../app/dashmetry/page.tsx", import.meta.url),
    requiredSources: [
      "https://dashmetry.io/",
      "https://1games.io/challenge-rush",
    ],
  },
  {
    label: "Geometry Dash Breeze",
    file: new URL("../app/geometry-dash-breeze/page.tsx", import.meta.url),
    requiredSources: [
      "https://github.com/ItzZyann/Geometry-Dash-Breeze",
      "https://github.com/ItzZyann/Geometry-Dash-Breeze/releases",
    ],
  },
];

const MAX_AGE_DAYS = 30;
const errors = [];
const now = new Date();

for (const page of pages) {
  const source = readFileSync(page.file, "utf8");
  const dateMatch = source.match(/const CHECKED_AT = "([^"]+)"/);
  const checkedAt = dateMatch?.[1] ?? null;

  if (!checkedAt || !/^\d{4}-\d{2}-\d{2}$/.test(checkedAt)) {
    errors.push(`${page.label}: CHECKED_AT must be a YYYY-MM-DD date.`);
    continue;
  }

  const checkedDate = new Date(`${checkedAt}T00:00:00Z`);
  if (Number.isNaN(checkedDate.getTime())) {
    errors.push(`${page.label}: CHECKED_AT is not a valid calendar date.`);
    continue;
  }

  const ageDays = Math.floor((now.getTime() - checkedDate.getTime()) / 86400000);

  if (ageDays < -1) {
    errors.push(`${page.label}: CHECKED_AT is in the future: ${checkedAt}.`);
  } else if (ageDays > MAX_AGE_DAYS) {
    errors.push(
      `${page.label}: source check is ${ageDays} days old. Re-check the current source before publishing.`
    );
  }

  for (const url of page.requiredSources) {
    if (!source.includes(url)) {
      errors.push(`${page.label}: required source URL is missing: ${url}`);
    }
  }
}

if (errors.length) {
  console.error("Related game source verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Related game sources verified: ${pages.length} pages checked within ${MAX_AGE_DAYS} days.`
);
