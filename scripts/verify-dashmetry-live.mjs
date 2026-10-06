import { readFileSync } from "node:fs";

const data = JSON.parse(
  readFileSync(new URL("../data/relatedSearch.json", import.meta.url), "utf8")
);

const config = data.dashmetry;
if (!config || typeof config !== "object") {
  throw new Error("Missing relatedSearch.dashmetry.");
}

const { legacyName, currentName, sources } = config;
if (
  typeof legacyName !== "string" ||
  typeof currentName !== "string" ||
  !Array.isArray(sources) ||
  sources.length < 3
) {
  throw new Error("Dashmetry live verification requires names and three source URLs.");
}

const [rebrandSource, officialSource, updateSource] = sources;
const TIMEOUT_MS = 30000;

async function fetchText(url) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "text/html",
          "User-Agent": "geometry-dash-spam-freshness-check",
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

function textContent(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const [rebrandHtml, officialHtml, updateHtml] = await Promise.all([
  fetchText(rebrandSource),
  fetchText(officialSource),
  fetchText(updateSource),
]);

const rebrandText = textContent(rebrandHtml).toLowerCase();
const officialText = textContent(officialHtml).toLowerCase();
const updateText = textContent(updateHtml).toLowerCase();
const rebrandSentence = `${legacyName} is now ${currentName}`.toLowerCase();
const officialHost = new URL(officialSource).hostname.toLowerCase();

if (!rebrandText.includes(rebrandSentence)) {
  throw new Error(
    `Dashmetry rebrand page no longer contains "${legacyName} is now ${currentName}".`
  );
}

if (!rebrandHtml.toLowerCase().includes(officialHost)) {
  throw new Error(
    `Dashmetry rebrand page no longer links to the configured official host ${officialHost}.`
  );
}

if (!officialText.includes(currentName.toLowerCase())) {
  throw new Error(
    `Configured official Challenge Rush page no longer identifies itself as ${currentName}.`
  );
}

if (!updateText.includes(currentName.toLowerCase())) {
  throw new Error(
    `Configured Challenge Rush update source no longer contains ${currentName}.`
  );
}

console.log(
  `Dashmetry live sources verified: ${legacyName} → ${currentName}, official host ${officialHost}.`
);
