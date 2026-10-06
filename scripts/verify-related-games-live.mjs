import { readFileSync } from "node:fs";

const data = JSON.parse(
  readFileSync(new URL("../data/relatedSearch.json", import.meta.url), "utf8")
);

const config = data.breeze;
if (!config || typeof config !== "object") {
  throw new Error("Missing relatedSearch.breeze.");
}

const {
  latestVersion,
  levelCount,
  platforms,
  latestMainLevel,
  androidMin,
  androidMax,
} = config;

if (
  typeof latestVersion !== "string" ||
  !latestVersion ||
  !Number.isInteger(levelCount) ||
  levelCount <= 0 ||
  !Array.isArray(platforms) ||
  platforms.length < 1 ||
  platforms.some((item) => typeof item !== "string" || !item.trim()) ||
  typeof latestMainLevel !== "string" ||
  !latestMainLevel.trim() ||
  !Number.isInteger(androidMin) ||
  !Number.isInteger(androidMax) ||
  androidMin <= 0 ||
  androidMax < androidMin
) {
  throw new Error(
    "Geometry Dash Breeze live verification requires version, level count, platforms, latest main level and Android range."
  );
}

const headers = {
  "User-Agent": "geometry-dash-spam-freshness-check",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function fetchGithub(url, accept) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { ...headers, Accept: accept },
      });

      if (!response.ok) {
        throw new Error(`GitHub API returned HTTP ${response.status} for ${url}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
      }
    }
  }

  throw lastError;
}

const [releaseResponse, readmeResponse] = await Promise.all([
  fetchGithub(
    "https://api.github.com/repos/ItzZyann/Geometry-Dash-Breeze/releases/latest",
    "application/vnd.github+json"
  ),
  fetchGithub(
    "https://api.github.com/repos/ItzZyann/Geometry-Dash-Breeze/readme",
    "application/vnd.github+json"
  ),
]);

const release = await releaseResponse.json();
const readmePayload = await readmeResponse.json();
if (
  typeof readmePayload?.content !== "string" ||
  readmePayload.encoding !== "base64"
) {
  throw new Error("GitHub README response is missing base64 content.");
}
const readme = Buffer.from(
  readmePayload.content.replace(/\s+/g, ""),
  "base64"
).toString("utf8");
const liveVersion = release.tag_name;
const releaseBody = typeof release.body === "string" ? release.body : "";

if (typeof liveVersion !== "string" || !liveVersion) {
  throw new Error("GitHub latest release response is missing tag_name.");
}

if (liveVersion !== latestVersion) {
  throw new Error(
    `Geometry Dash Breeze release is stale: data has ${latestVersion}, GitHub latest is ${liveVersion}.`
  );
}

const levelMatch = readme.match(
  /currently consists of\s+\*{0,2}(\d+)\s+levels\*{0,2}/i
);
const liveLevelCount = levelMatch ? Number(levelMatch[1]) : null;
if (liveLevelCount !== levelCount) {
  throw new Error(
    `Geometry Dash Breeze level count is stale: data has ${levelCount}, README has ${liveLevelCount ?? "no detectable count"}.`
  );
}

const availableMatch = readme.match(
  /##\s+Available On\s*([\s\S]*?)##\s+Android Compatibility/i
);
if (!availableMatch) {
  throw new Error("Could not isolate Geometry Dash Breeze README Available On section.");
}

const livePlatforms = [
  ...availableMatch[1].matchAll(/^\s*[-*]\s+(.+)$/gm),
].map((match) =>
  match[1]
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*/g, "")
    .trim()
);

const normalize = (value) => value.toLowerCase().replace(/\s+/g, " ").trim();
const expectedPlatforms = platforms.map(normalize).sort();
const actualPlatforms = livePlatforms.map(normalize).sort();

if (
  expectedPlatforms.length !== actualPlatforms.length ||
  expectedPlatforms.some((platform, index) => platform !== actualPlatforms[index])
) {
  throw new Error(
    `Geometry Dash Breeze platform list is stale: data has [${platforms.join(", ")}], README has [${livePlatforms.join(", ")}].`
  );
}

const readmeLower = readme.toLowerCase();
const readmePlain = readmeLower.replace(/\*\*/g, "");
for (const phrase of [
  "fanmade spinoff",
  "not affiliated with robtop games",
  `android ${androidMin} through ${androidMax}`,
  "not all versions have been tested",
  'all levels may show "coming soon"',
  "reopen it",
]) {
  if (!readmePlain.includes(phrase.toLowerCase())) {
    throw new Error(
      `Geometry Dash Breeze README no longer contains expected live fact: ${phrase}.`
    );
  }
}

const releaseLower = releaseBody.toLowerCase();
for (const phrase of [
  "new achievement",
  latestMainLevel,
  "bug fixes",
  "tweaks",
]) {
  if (!releaseLower.includes(phrase.toLowerCase())) {
    throw new Error(
      `Geometry Dash Breeze ${latestVersion} release notes no longer contain expected fact: ${phrase}.`
    );
  }
}

console.log(
  `Geometry Dash Breeze live facts verified: ${latestVersion}, ${levelCount} levels, ${platforms.join(" / ")}, main level ${latestMainLevel}, Android ${androidMin}-${androidMax}.`
);
