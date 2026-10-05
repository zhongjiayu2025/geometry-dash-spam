import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");
const demonSource = readFileSync(join(process.cwd(), "data", "demons.ts"), "utf8");
const demonDate = demonSource.match(/DEMON_VERIFIED_AT = "([^"]+)"/)?.[1];
const currentDemon = demonSource.match(/\{ rank: 1, level: "((?:\\.|[^"])*)"/)?.[1];

if (!demonDate || !currentDemon) {
  throw new Error("Could not read the current #1 Demon List entry for export verification.");
}

const currentDemonName = JSON.parse(`"${currentDemon}"`);

const requiredRoutes = [
  "/",
  "/geometry-dash-wave",
  "/cps-test",
  "/demon-list",
  "/demon-list/spam-demons",
  "/demon-list/wave-demons",
  "/hardest-level",
  "/easiest-demons",
  "/geometry-dash-clicker",
  "/geometry-dash-codes",
  "/geometry-dash-vault-of-secrets-codes",
  "/how-to-get-diamonds-geometry-dash",
  "/how-to-get-gold-keys-geometry-dash",
  "/geometry-dash-difficulty-faces",
  "/geometry-dash-stuttering-high-end-pc",
  "/blog",
];

const removedGhostRoutes = [
  "/1-second-cps-test",
  "/2-second-cps-test",
  "/10-second-cps-test",
  "/reaction-time",
  "/stats",
];

const metadataExpectations = {
  "/": {
    title: "Geometry Dash Spam Test",
    description: "free Geometry Dash spam test online",
    canonical: "https://geometrydashspam.cc",
  },
  "/geometry-dash-wave": {
    title: "Geometry Dash Wave",
    description: "Practice Geometry Dash wave and wave spam online",
    canonical: "https://geometrydashspam.cc/geometry-dash-wave",
  },
  "/cps-test": {
    title: "Geometry Dash CPS Test",
    description: "Take a Geometry Dash CPS test",
    canonical: "https://geometrydashspam.cc/cps-test",
  },
  "/demon-list": {
    title: "Geometry Dash Demon List",
    description: "Browse a sourced Geometry Dash Demon List snapshot",
    canonical: "https://geometrydashspam.cc/demon-list",
  },
  "/demon-list/spam-demons": {
    title: "Geometry Dash Spam Demon List",
    description: "A Geometry Dash spam-focused practice list",
    canonical: "https://geometrydashspam.cc/demon-list/spam-demons",
  },
  "/demon-list/wave-demons": {
    title: "Geometry Dash Wave Demons",
    description: "Explore wave-focused Geometry Dash demon practice references",
    canonical: "https://geometrydashspam.cc/demon-list/wave-demons",
  },
  "/hardest-level": {
    title: `Hardest Geometry Dash Level: ${currentDemonName}`,
    description: `As checked ${demonDate}, Pointercrate ranks ${currentDemonName}`,
    canonical: "https://geometrydashspam.cc/hardest-level",
  },
  "/geometry-dash-clicker": {
    title: "Geometry Dash Clicker",
    description: "Play a lightweight Geometry Dash Clicker",
    canonical: "https://geometrydashspam.cc/geometry-dash-clicker",
  },
  "/geometry-dash-codes": {
    title: "Geometry Dash Codes",
    description: "Geometry Dash codes for The Vault",
    canonical: "https://geometrydashspam.cc/geometry-dash-codes",
  },
};

function candidates(route) {
  if (route === "/") {
    return [join(outDir, "index.html")];
  }

  const clean = route.replace(/^\//, "");
  return [
    join(outDir, `${clean}.html`),
    join(outDir, clean, "index.html"),
  ];
}

function exportedPath(route) {
  return candidates(route).find((path) => existsSync(path));
}

const missing = requiredRoutes.filter((route) => !exportedPath(route));

const unexpected = removedGhostRoutes.filter((route) =>
  candidates(route).some((path) => existsSync(path))
);

const metadataFiles = ["sitemap.xml", "robots.txt"].filter(
  (file) => !existsSync(join(outDir, file))
);

const metadataErrors = [];

for (const [route, expected] of Object.entries(metadataExpectations)) {
  const path = exportedPath(route);
  if (!path) continue;

  const html = readFileSync(path, "utf8");

  if (!html.includes(`<title>${expected.title}`) && !html.includes(expected.title)) {
    metadataErrors.push(`${route}: title does not include "${expected.title}"`);
  }

  if (!html.includes(expected.description)) {
    metadataErrors.push(`${route}: description does not include "${expected.description}"`);
  }

  if (!html.includes(`rel="canonical" href="${expected.canonical}"`)) {
    metadataErrors.push(`${route}: canonical is not "${expected.canonical}"`);
  }

  if (
    route !== "/" &&
    !html.includes(`property="og:url" content="${expected.canonical}"`)
  ) {
    metadataErrors.push(`${route}: og:url is not page-specific`);
  }

  if (
    route !== "/" &&
    !html.includes(`property="og:title" content="${expected.title}`)
  ) {
    metadataErrors.push(`${route}: og:title does not start with the page title`);
  }

  if (
    route !== "/" &&
    !html.includes('property="og:description"') 
  ) {
    metadataErrors.push(`${route}: missing page-specific og:description`);
  }
}

const htmlFiles = [];

function collectHtmlFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(path);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(path);
    }
  }
}

function internalTargetExists(href) {
  const pathOnly = href.split("?")[0].split("#")[0];
  if (!pathOnly || pathOnly === "/") return existsSync(join(outDir, "index.html"));
  if (pathOnly.startsWith("/_next/")) return true;

  const normalized = pathOnly.length > 1 ? pathOnly.replace(/\/$/, "") : pathOnly;

  if (/\.[a-z0-9]+$/i.test(normalized)) {
    return existsSync(join(outDir, normalized.replace(/^\//, "")));
  }

  return candidates(normalized).some((path) => existsSync(path));
}

collectHtmlFiles(outDir);

const sitemapPath = join(outDir, "sitemap.xml");
const sitemapRouteErrors = [];
const sitemapPolicyErrors = [];

if (existsSync(sitemapPath)) {
  const sitemapXml = readFileSync(sitemapPath, "utf8");
  const sitemapRoutes = [
    ...sitemapXml.matchAll(/<loc>https:\/\/geometrydashspam\.cc([^<]*)<\/loc>/g),
  ].map((match) => match[1] || "/");

  for (const route of sitemapRoutes) {
    if (!internalTargetExists(route)) {
      sitemapRouteErrors.push(route);
    }
  }

  for (const noindexRoute of ["/dashboard", "/leaderboard"]) {
    if (sitemapRoutes.includes(noindexRoute)) {
      sitemapPolicyErrors.push(`${noindexRoute} should not be present in sitemap.xml`);
    }
  }

  const duplicates = sitemapRoutes.filter(
    (route, index) => sitemapRoutes.indexOf(route) !== index
  );
  for (const route of [...new Set(duplicates)]) {
    sitemapPolicyErrors.push(`duplicate sitemap URL: ${route}`);
  }
}

const internalLinkErrors = [];
const seenBrokenLinks = new Set();

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const matches = html.matchAll(/href="(\/[^"#]*)"/g);

  for (const match of matches) {
    const href = match[1];
    if (!internalTargetExists(href)) {
      const key = `${file.replace(outDir, "")} -> ${href}`;
      if (!seenBrokenLinks.has(key)) {
        seenBrokenLinks.add(key);
        internalLinkErrors.push(key);
      }
    }
  }
}

if (
  missing.length ||
  unexpected.length ||
  metadataFiles.length ||
  metadataErrors.length ||
  internalLinkErrors.length ||
  sitemapRouteErrors.length ||
  sitemapPolicyErrors.length
) {
  console.error("Static export verification failed.");

  if (missing.length) {
    console.error("Missing required routes:", missing.join(", "));
  }

  if (unexpected.length) {
    console.error("Unexpected legacy routes:", unexpected.join(", "));
  }

  if (metadataFiles.length) {
    console.error("Missing metadata files:", metadataFiles.join(", "));
  }

  if (metadataErrors.length) {
    console.error("Metadata errors:");
    for (const error of metadataErrors) console.error(`- ${error}`);
  }

  if (internalLinkErrors.length) {
    console.error("Broken internal links:");
    for (const error of internalLinkErrors.slice(0, 40)) console.error(`- ${error}`);
    if (internalLinkErrors.length > 40) {
      console.error(`...and ${internalLinkErrors.length - 40} more`);
    }
  }

  if (sitemapRouteErrors.length) {
    console.error("Sitemap URLs without an exported target:");
    for (const route of sitemapRouteErrors) console.error(`- ${route}`);
  }

  if (sitemapPolicyErrors.length) {
    console.error("Sitemap policy errors:");
    for (const error of sitemapPolicyErrors) console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log(
  `Static export verified: ${requiredRoutes.length} core routes, metadata checks, ${htmlFiles.length} HTML files with internal-link checks, sitemap URL integrity, sitemap.xml and robots.txt.`
);
