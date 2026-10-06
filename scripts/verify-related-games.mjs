import { readFileSync } from "node:fs";

const dataPath = new URL("../data/relatedSearch.json", import.meta.url);
const workflowPath = new URL("../.github/workflows/demon-list-refresh.yml", import.meta.url);
const refreshDatesPath = new URL("./refresh-related-search-checks.mjs", import.meta.url);
const workflowSource = readFileSync(workflowPath, "utf8");
const refreshDatesSource = readFileSync(refreshDatesPath, "utf8");
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

  if (page.key === "spamChallengeList") {
    if (
      typeof config.currentVersion !== "string" ||
      !/^v\d+\.\d+\.\d+$/.test(config.currentVersion)
    ) {
      errors.push("Spam Challenge List: currentVersion must be a semantic vX.Y.Z string.");
    }

    if (
      !source.includes("relatedPageData.currentVersion") ||
      !source.includes("CURRENT_VERSION") ||
      /const CURRENT_VERSION = "v\d+\.\d+\.\d+"/.test(source)
    ) {
      errors.push(
        "Spam Challenge List: current version must be centralized in relatedSearch.json."
      );
    }

    if (
      config.sources.length < 3 ||
      config.sources[0] !== "https://thespamchallengelist.pages.dev/" ||
      config.sources[1] !== "https://sites.google.com/view/gdspamchallengeslist/main-list" ||
      config.sources[2] !== "https://linktr.ee/GeometryDashLists"
    ) {
      errors.push(
        "Spam Challenge List: sources must preserve the current SCL app, legacy migration page, and GeometryDashLists hub."
      );
    }

    for (const token of [
      "CURRENT_LIST_SOURCE",
      "LEGACY_LIST_SOURCE",
      "LIST_HUB_SOURCE",
    ]) {
      if (!source.includes(token)) {
        errors.push(`Spam Challenge List: page must consume centralized ${token}.`);
      }
    }

    if (source.includes("href={LIST_SOURCE}")) {
      errors.push("Spam Challenge List: the primary CTA must not point at the legacy list source.");
    }
  }

  if (page.key === "dashmetry") {
    if (
      typeof config.legacyName !== "string" ||
      !config.legacyName.trim() ||
      typeof config.currentName !== "string" ||
      !config.currentName.trim()
    ) {
      errors.push("Dashmetry: legacyName and currentName must be non-empty strings.");
    }

    if (
      config.sources.length < 3 ||
      config.sources[0] !== "https://dashmetry.io/" ||
      config.sources[1] !== "https://challengerush.com/" ||
      config.sources[2] !== "https://1games.io/challenge-rush"
    ) {
      errors.push(
        "Dashmetry: sources must preserve the rebrand page, official Challenge Rush home, and separate update-note source."
      );
    }

    for (const token of [
      "relatedPageData.legacyName",
      "relatedPageData.currentName",
      "LEGACY_NAME",
      "CURRENT_NAME",
      "REBRAND_SOURCE",
      "OFFICIAL_GAME_SOURCE",
      "UPDATE_SOURCE",
    ]) {
      if (!source.includes(token)) {
        errors.push(`Dashmetry: page must consume centralized ${token}.`);
      }
    }

    for (const phrase of [
      "Normal, Practice and Endless play",
      "browser level editor",
      "leaderboards",
      "achievements",
      "cross-device progress",
      "Race Mode",
      "rollout-dependent",
    ]) {
      if (!source.includes(phrase)) {
        errors.push(`Dashmetry: guide must retain source-checked current-feature wording: ${phrase}.`);
      }
    }

    if (
      source.includes('const LEGACY_NAME = "Dashmetry"') ||
      source.includes('const CURRENT_NAME = "Challenge Rush"') ||
      source.includes("href={CURRENT_GAME_SOURCE}")
    ) {
      errors.push("Dashmetry: entity names and official destination must stay centralized.");
    }
  }

  if (page.key === "breeze") {
    if (
      typeof config.latestVersion !== "string" ||
      !/^v\d+\.\d+\.\d+$/.test(config.latestVersion)
    ) {
      errors.push("Geometry Dash Breeze: latestVersion must be a semantic vX.Y.Z string.");
    }

    if (!Number.isInteger(config.levelCount) || config.levelCount <= 0) {
      errors.push("Geometry Dash Breeze: levelCount must be a positive integer.");
    }

    if (typeof config.latestMainLevel !== "string" || !config.latestMainLevel.trim()) {
      errors.push("Geometry Dash Breeze: latestMainLevel must be a non-empty string.");
    }

    if (
      !Number.isInteger(config.androidMin) ||
      !Number.isInteger(config.androidMax) ||
      config.androidMin <= 0 ||
      config.androidMax < config.androidMin
    ) {
      errors.push("Geometry Dash Breeze: Android support range must be valid positive integers.");
    }

    if (
      !Array.isArray(config.platforms) ||
      config.platforms.length < 1 ||
      config.platforms.some((item) => typeof item !== "string" || !item.trim())
    ) {
      errors.push("Geometry Dash Breeze: platforms must contain one or more non-empty labels.");
    }

    for (const token of [
      "relatedPageData.latestVersion",
      "relatedPageData.levelCount",
      "relatedPageData.platforms",
      "relatedPageData.latestMainLevel",
      "relatedPageData.androidMin",
      "relatedPageData.androidMax",
    ]) {
      if (!source.includes(token)) {
        errors.push(`Geometry Dash Breeze: page must consume centralized ${token}.`);
      }
    }

    if (
      /const LATEST_VERSION = "v\d+\.\d+\.\d+"/.test(source) ||
      /const LEVEL_COUNT = \d+/.test(source) ||
      source.includes("marks v1.3.1 as the latest release") ||
      source.includes("called Ghost Retention") ||
      source.includes("target Android 5 and later")
    ) {
      errors.push("Geometry Dash Breeze: mutable release facts must not be hard-coded in the page.");
    }
  }
}

if (
  !workflowSource.includes('"scripts/verify-related-games-live.mjs"') ||
  !workflowSource.includes("Validate Breeze latest release") ||
  !workflowSource.includes("GITHUB_TOKEN: ${{ github.token }}")
) {
  errors.push(
    "Related-game refresh workflow must run the live Breeze release verifier with the GitHub token."
  );
}

if (
  !readFileSync(new URL("./verify-related-games-live.mjs", import.meta.url), "utf8").includes(
    "readmePayload.encoding !== \"base64\""
  ) ||
  !readFileSync(new URL("./verify-related-games-live.mjs", import.meta.url), "utf8").includes(
    'Buffer.from('
  ) ||
  !readFileSync(new URL("./verify-related-games-live.mjs", import.meta.url), "utf8").includes(
    "currently consists of\\s+\\*{0,2}(\\d+)\\s+levels\\*{0,2}"
  ) ||
  !readFileSync(new URL("./verify-related-games-live.mjs", import.meta.url), "utf8").includes(
    ".replace(/\\*\\*/g"
  ) ||
  !readFileSync(new URL("./verify-related-games-live.mjs", import.meta.url), "utf8").includes(
    "latestMainLevel"
  ) ||
  !readFileSync(new URL("./verify-related-games-live.mjs", import.meta.url), "utf8").includes(
    "androidMin"
  )
) {
  errors.push(
    "Breeze live verifier must validate README level/platform/support facts in addition to the latest release tag."
  );
}

if (
  !workflowSource.includes('"scripts/verify-dashmetry-live.mjs"') ||
  !workflowSource.includes("Validate Dashmetry rebrand and official home")
) {
  errors.push(
    "Related-game refresh workflow must live-check the Dashmetry rebrand and official Challenge Rush home."
  );
}

const dashmetryLiveSource = readFileSync(
  new URL("./verify-dashmetry-live.mjs", import.meta.url),
  "utf8"
);
for (const token of [
  '"normal mode"',
  '"practice mode"',
  '"endless mode"',
  '"level editor"',
  '"leaderboards"',
  '"achievements"',
  '"cross-device progress"',
  '"race mode coming soon"',
  '"race mode is here"',
]) {
  if (!dashmetryLiveSource.includes(token)) {
    errors.push(`Dashmetry live verifier must protect current feature/race wording: ${token}.`);
  }
}

if (
  !workflowSource.includes('"scripts/verify-spam-challenge-live.mjs"') ||
  !workflowSource.includes("Validate current Spam Challenge List entry")
) {
  errors.push(
    "Related-game refresh workflow must live-check the current Spam Challenge List and migration sources."
  );
}

const spamChallengeLiveSource = readFileSync(
  new URL("./verify-spam-challenge-live.mjs", import.meta.url),
  "utf8"
);
if (
  !spamChallengeLiveSource.includes("expectedVersion") ||
  !spamChallengeLiveSource.includes("liveVersion") ||
  !spamChallengeLiveSource.includes("version is stale")
) {
  errors.push(
    "Spam Challenge List live verifier must protect the centralized current app version."
  );
}

if (
  !workflowSource.includes('"scripts/refresh-related-search-checks.mjs"') ||
  !workflowSource.includes("Refresh related search verification dates") ||
  !workflowSource.includes("git diff --quiet -- data/demons.ts data/relatedSearch.json") ||
  !workflowSource.includes("git add data/demons.ts data/relatedSearch.json")
) {
  errors.push(
    "Related-game refresh workflow must periodically persist successful live verification dates together with other search data."
  );
}

const refreshDateStepIndex = workflowSource.indexOf("Refresh related search verification dates");
const validateRelatedStepIndex = workflowSource.indexOf("Validate related game source freshness");
if (
  refreshDateStepIndex < 0 ||
  validateRelatedStepIndex < 0 ||
  validateRelatedStepIndex < refreshDateStepIndex
) {
  errors.push(
    "Related-game workflow must refresh successful live-check dates before enforcing static freshness age."
  );
}

if (
  !refreshDatesSource.includes('const REFRESH_KEYS = ["spamChallengeList", "dashmetry", "breeze"]') ||
  !refreshDatesSource.includes("const MIN_REFRESH_DAYS = 7") ||
  !refreshDatesSource.includes("entry.checkedAt = today") ||
  !refreshDatesSource.includes("writeFileSync(DATA_PATH")
) {
  errors.push(
    "Related search verification-date refresher must update all live-checked entries on a weekly cadence."
  );
}

if (errors.length) {
  console.error("Related search source verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Related search sources verified: ${pages.length} pages checked within ${MAX_AGE_DAYS} days.`
);
