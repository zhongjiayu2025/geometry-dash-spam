import { readFileSync } from "node:fs";

const data = JSON.parse(
  readFileSync(new URL("../data/relatedSearch.json", import.meta.url), "utf8")
);

const config = data.spamChallengeList;
if (!config || typeof config !== "object" || !Array.isArray(config.sources)) {
  throw new Error("Missing relatedSearch.spamChallengeList sources.");
}

if (config.sources.length < 3) {
  throw new Error("Spam Challenge List live verification requires three source URLs.");
}

const [currentSource, legacySource, hubSource] = config.sources;
const expectedVersion = config.currentVersion;
const TIMEOUT_MS = 30000;

if (
  typeof expectedVersion !== "string" ||
  !/^v\d+\.\d+\.\d+$/.test(expectedVersion)
) {
  throw new Error("Spam Challenge List currentVersion must be a semantic vX.Y.Z string.");
}

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

const [currentHtml, legacyHtml, hubHtml] = await Promise.all([
  fetchText(currentSource),
  fetchText(legacySource),
  fetchText(hubSource),
]);

const currentText = textContent(currentHtml).toLowerCase();
const legacyText = textContent(legacyHtml).toLowerCase();
const hubText = textContent(hubHtml).toLowerCase();
const currentHost = new URL(currentSource).hostname.toLowerCase();
const liveVersion = currentText.match(/\bv\d+\.\d+\.\d+\b/)?.[0];

if (liveVersion !== expectedVersion) {
  throw new Error(
    `Spam Challenge List version is stale: data has ${expectedVersion}, live app has ${liveVersion ?? "no detectable version"}.`
  );
}

if (
  !currentText.includes("scl") ||
  !currentText.includes("list") ||
  !currentText.includes("submit record")
) {
  throw new Error(
    "Configured current Spam Challenge List no longer exposes the expected SCL/list/submit surface."
  );
}

if (!legacyText.includes("old list") || !legacyText.includes("up to date")) {
  throw new Error(
    "Legacy Spam Challenges List page no longer exposes the migration wording used to identify the newer list."
  );
}

if (
  !hubText.includes("spam challenge list") ||
  !hubHtml.toLowerCase().includes(currentHost)
) {
  throw new Error(
    `GeometryDashLists hub no longer points to the configured current SCL host ${currentHost}.`
  );
}

console.log(
  `Spam Challenge List live sources verified: ${expectedVersion}, current host ${currentHost}, legacy migration note and list hub agree.`
);
