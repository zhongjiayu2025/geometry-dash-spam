import { readFileSync } from "node:fs";

const data = JSON.parse(
  readFileSync(new URL("../data/relatedSearch.json", import.meta.url), "utf8")
);

const expected = data.breeze?.latestVersion;
if (typeof expected !== "string" || !expected) {
  throw new Error("Missing relatedSearch.breeze.latestVersion.");
}

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "geometry-dash-spam-freshness-check",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

let lastError;
for (let attempt = 1; attempt <= 3; attempt += 1) {
  try {
    const response = await fetch(
      "https://api.github.com/repos/ItzZyann/Geometry-Dash-Breeze/releases/latest",
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned HTTP ${response.status}`);
    }

    const release = await response.json();
    const live = release.tag_name;

    if (typeof live !== "string" || !live) {
      throw new Error("GitHub latest release response is missing tag_name.");
    }

    if (live !== expected) {
      console.error(
        `Geometry Dash Breeze release is stale: data has ${expected}, GitHub latest is ${live}.`
      );
      process.exit(1);
    }

    console.log(`Geometry Dash Breeze latest release verified: ${live}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
}

throw lastError;
