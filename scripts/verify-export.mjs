import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");
const demonSource = readFileSync(join(process.cwd(), "data", "demons.ts"), "utf8");
const vaultSource = readFileSync(join(process.cwd(), "data", "vaultCodes.ts"), "utf8");
const demonDate = demonSource.match(/DEMON_VERIFIED_AT = "([^"]+)"/)?.[1];
const currentDemon = demonSource.match(/\{ rank: 1, level: "((?:\\.|[^"])*)"/)?.[1];

const wraithBlock = vaultSource.match(
  /export const WRAITH_CODES:[\s\S]*?= \[([\s\S]*?)\n\];/
)?.[1];

if (!wraithBlock) {
  throw new Error("Could not read WRAITH_CODES for export verification.");
}

const wraithEntries = [
  ...wraithBlock.matchAll(/\{ code: "([^"]+)", reward: "([^"]+)"/g),
].map((match) => ({ code: match[1], reward: match[2] }));

const goldKeyWraithCodes = wraithEntries
  .filter((item) => item.reward.includes("Gold Key"))
  .map((item) => item.code);

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
  "/geometry-dash-breeze",
  "/dashmetry",
  "/blog",
];

const removedGhostRoutes = [
  "/1-second-cps-test",
  "/2-second-cps-test",
  "/10-second-cps-test",
  "/reaction-time",
  "/stats",
];

const noindexUtilityRoutes = [
  "/reaction-test",
  "/sound-reaction",
  "/aim-trainer",
  "/typing-test",
  "/visual-memory",
  "/chimp-test",
  "/refresh-rate",
  "/system-info",
  "/scroll-test",
  "/mouse-acceleration",
  "/bpm-tapper",
];

const metadataExpectations = {
  "/": {
    title: "Geometry Dash Spam Test",
    description: "Geometry Dash spam test",
    canonical: "https://geometrydashspam.cc",
  },
  "/geometry-dash-wave": {
    title: "Geometry Dash Wave",
    description: "Play a Geometry Dash wave trainer online",
    canonical: "https://geometrydashspam.cc/geometry-dash-wave",
  },
  "/cps-test": {
    title: "Geometry Dash CPS Test",
    description: "Take a Geometry Dash CPS test",
    canonical: "https://geometrydashspam.cc/cps-test",
  },
  "/demon-list": {
    title: "Geometry Dash Demon List",
    description: "Current Geometry Dash Demon List / Demonlist top 50",
    canonical: "https://geometrydashspam.cc/demon-list",
  },
  "/demon-list/spam-demons": {
    title: "Geometry Dash Spam Demon List",
    description: "Geometry Dash spam demonlist",
    canonical: "https://geometrydashspam.cc/demon-list/spam-demons",
  },
  "/demon-list/wave-demons": {
    title: "Geometry Dash Wave Demons",
    description: "Explore wave-focused Geometry Dash demon practice references",
    canonical: "https://geometrydashspam.cc/demon-list/wave-demons",
  },
  "/hardest-level": {
    title: `Geometry Dash Hardest Level: ${currentDemonName}`,
    description: `As checked ${demonDate}, Pointercrate ranks ${currentDemonName}`,
    canonical: "https://geometrydashspam.cc/hardest-level",
  },
  "/geometry-dash-clicker": {
    title: "Geometry Dash Clicker",
    description: "Play a free Geometry Dash Clicker",
    canonical: "https://geometrydashspam.cc/geometry-dash-clicker",
  },
  "/geometry-dash-codes": {
    title: "Geometry Dash Codes",
    description: "Geometry Dash codes for The Vault",
    canonical: "https://geometrydashspam.cc/geometry-dash-codes",
  },
  "/geometry-dash-vault-of-secrets-codes": {
    title: "Geometry Dash Vault of Secrets Codes",
    description: "Geometry Dash Vault of Secrets codes",
    canonical: "https://geometrydashspam.cc/geometry-dash-vault-of-secrets-codes",
  },
  "/how-to-get-gold-keys-geometry-dash": {
    title: "How to Get Gold Keys in Geometry Dash",
    description: "How to get Gold Keys in Geometry Dash",
    canonical: "https://geometrydashspam.cc/how-to-get-gold-keys-geometry-dash",
  },
  "/geometry-dash-difficulty-faces": {
    title: "Geometry Dash Difficulty Faces",
    description: "Geometry Dash difficulty faces explained",
    canonical: "https://geometrydashspam.cc/geometry-dash-difficulty-faces",
  },
  "/geometry-dash-stuttering-high-end-pc": {
    title: "Geometry Dash Stuttering on High-End PC",
    description: "Troubleshoot Geometry Dash stuttering on a high-end PC",
    canonical: "https://geometrydashspam.cc/geometry-dash-stuttering-high-end-pc",
  },
  "/how-to-get-diamonds-geometry-dash": {
    title: "How to Get Diamonds in Geometry Dash",
    description: "How to get diamonds in Geometry Dash",
    canonical: "https://geometrydashspam.cc/how-to-get-diamonds-geometry-dash",
  },
  "/easiest-demons": {
    title: "Easiest Demons in Geometry Dash",
    description: "easiest demons in Geometry Dash",
    canonical: "https://geometrydashspam.cc/easiest-demons",
  },
  "/geometry-dash-breeze": {
    title: "Geometry Dash Breeze",
    description: "Geometry Dash Breeze is a fan-made spinoff",
    canonical: "https://geometrydashspam.cc/geometry-dash-breeze",
  },
  "/dashmetry": {
    title: "Dashmetry Is Now Challenge Rush",
    description: "Dashmetry is now Challenge Rush",
    canonical: "https://geometrydashspam.cc/dashmetry",
  },
  "/about": {
    title: "About Geometry Dash Spam",
    description: "Learn what GeometryDashSpam.cc is",
    canonical: "https://geometrydashspam.cc/about",
  },
  "/contact": {
    title: "Contact Geometry Dash Spam",
    description: "Contact GeometryDashSpam.cc",
    canonical: "https://geometrydashspam.cc/contact",
  },
  "/privacy": {
    title: "Privacy Policy",
    description: "Read how GeometryDashSpam.cc uses local browser storage",
    canonical: "https://geometrydashspam.cc/privacy",
  },
  "/terms": {
    title: "Terms of Use",
    description: "Terms for using GeometryDashSpam.cc",
    canonical: "https://geometrydashspam.cc/terms",
  },
  "/sitemap": {
    title: "Sitemap",
    description: "Browse Geometry Dash spam, wave, CPS, codes",
    canonical: "https://geometrydashspam.cc/sitemap",
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

function documentHead(html) {
  return html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
}

function metaContent(html, attribute, value) {
  const head = documentHead(html);

  for (const match of head.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if (!tag.includes(`${attribute}="${value}"`)) continue;
    return tag.match(/\bcontent="([^"]*)"/i)?.[1] ?? null;
  }

  return null;
}

function canonicalHref(html) {
  const head = documentHead(html);

  for (const match of head.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    if (!/\brel="canonical"/i.test(tag)) continue;
    return tag.match(/\bhref="([^"]*)"/i)?.[1] ?? null;
  }

  return null;
}

function documentTitle(html) {
  return documentHead(html).match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? null;
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

  const title = documentTitle(html);
  const description = metaContent(html, "name", "description");
  const canonical = canonicalHref(html);

  if (!title?.startsWith(expected.title)) {
    metadataErrors.push(
      `${route}: title is "${title ?? "missing"}", expected prefix "${expected.title}"`
    );
  }

  if (!description?.includes(expected.description)) {
    metadataErrors.push(
      `${route}: description is "${description ?? "missing"}", expected to include "${expected.description}"`
    );
  }

  if (canonical !== expected.canonical) {
    metadataErrors.push(
      `${route}: canonical is "${canonical ?? "missing"}", expected "${expected.canonical}"`
    );
  }

  if (route !== "/") {
    const ogUrl = metaContent(html, "property", "og:url");
    const ogTitle = metaContent(html, "property", "og:title");
    const ogDescription = metaContent(html, "property", "og:description");

    if (ogUrl !== expected.canonical) {
      metadataErrors.push(
        `${route}: og:url is "${ogUrl ?? "missing"}", expected "${expected.canonical}"`
      );
    }

    if (!ogTitle?.startsWith(expected.title)) {
      metadataErrors.push(
        `${route}: og:title is "${ogTitle ?? "missing"}", expected prefix "${expected.title}"`
      );
    }

    if (!ogDescription) {
      metadataErrors.push(`${route}: missing page-specific og:description`);
    }
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
const sitemapMetadataErrors = [];

if (existsSync(sitemapPath)) {
  const sitemapXml = readFileSync(sitemapPath, "utf8");
  const sitemapRoutes = [
    ...sitemapXml.matchAll(/<loc>https:\/\/geometrydashspam\.cc([^<]*)<\/loc>/g),
  ].map((match) => match[1] || "/");

  for (const route of sitemapRoutes) {
    if (!internalTargetExists(route)) {
      sitemapRouteErrors.push(route);
      continue;
    }

    const path = exportedPath(route);
    if (!path) continue;

    const html = readFileSync(path, "utf8");
    const expectedCanonical =
      route === "/" ? "https://geometrydashspam.cc" : `https://geometrydashspam.cc${route}`;
    const title = documentTitle(html);
    const description = metaContent(html, "name", "description");
    const canonical = canonicalHref(html);
    const robots = metaContent(html, "name", "robots");
    const ogUrl = metaContent(html, "property", "og:url");
    const ogTitle = metaContent(html, "property", "og:title");
    const ogDescription = metaContent(html, "property", "og:description");

    if (!title) {
      sitemapMetadataErrors.push(`${route}: missing <title>`);
    }

    if (!description) {
      sitemapMetadataErrors.push(`${route}: missing meta description`);
    }

    if (canonical !== expectedCanonical) {
      sitemapMetadataErrors.push(
        `${route}: canonical is "${canonical ?? "missing"}", expected "${expectedCanonical}"`
      );
    }

    if (robots?.toLowerCase().includes("noindex")) {
      sitemapMetadataErrors.push(
        `${route}: sitemap URL is marked noindex`
      );
    }

    if (ogUrl !== expectedCanonical) {
      sitemapMetadataErrors.push(
        `${route}: og:url is "${ogUrl ?? "missing"}", expected "${expectedCanonical}"`
      );
    }

    if (!ogTitle) {
      sitemapMetadataErrors.push(`${route}: missing og:title`);
    }

    if (!ogDescription) {
      sitemapMetadataErrors.push(`${route}: missing og:description`);
    }
  }

  for (const noindexRoute of ["/dashboard", "/leaderboard", ...noindexUtilityRoutes]) {
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

const noindexErrors = [];

for (const route of noindexUtilityRoutes) {
  const path = exportedPath(route);
  if (!path) {
    noindexErrors.push(`${route}: expected utility route was not exported`);
    continue;
  }

  const html = readFileSync(path, "utf8");
  const robots = metaContent(html, "name", "robots");

  if (!robots?.toLowerCase().includes("noindex")) {
    noindexErrors.push(
      `${route}: expected noindex robots directive, found "${robots ?? "missing"}"`
    );
  }
}

const coreAuthorityRoutes = [
  "/",
  "/geometry-dash-wave",
  "/cps-test",
  "/demon-list",
  "/geometry-dash-codes",
  "/hardest-level",
];

const authorityLeakErrors = [];

for (const route of coreAuthorityRoutes) {
  const path = exportedPath(route);
  if (!path) continue;

  const html = readFileSync(path, "utf8");
  for (const noindexRoute of noindexUtilityRoutes) {
    const escaped = noindexRoute.replace(/[.*+?^${}()|[\]\\]/g, "\\const contentErrors = [];");
    const linkPattern = new RegExp(`href=["']${escaped}(?:[#?"'][^>]*)?`, "i");

    if (linkPattern.test(html)) {
      authorityLeakErrors.push(
        `${route}: core page links to noindex utility ${noindexRoute}`
      );
    }
  }
}

const contentErrors = [];

const codesExportPath = exportedPath("/geometry-dash-codes");
if (codesExportPath) {
  const codesHtml = readFileSync(codesExportPath, "utf8");
  for (const item of wraithEntries) {
    if (!codesHtml.includes(item.code)) {
      contentErrors.push(
        `/geometry-dash-codes: missing Wraith code from source data: ${item.code}`
      );
    }
  }
}

const goldKeysExportPath = exportedPath("/how-to-get-gold-keys-geometry-dash");
if (goldKeysExportPath) {
  const goldKeysHtml = readFileSync(goldKeysExportPath, "utf8");
  for (const code of goldKeyWraithCodes) {
    if (!goldKeysHtml.includes(code)) {
      contentErrors.push(
        `/how-to-get-gold-keys-geometry-dash: missing current Gold Key Wraith code: ${code}`
      );
    }
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
  sitemapPolicyErrors.length ||
  sitemapMetadataErrors.length ||
  noindexErrors.length ||
  authorityLeakErrors.length ||
  contentErrors.length
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

  if (noindexErrors.length) {
    console.error("Noindex utility errors:");
    for (const error of noindexErrors) console.error(`- ${error}`);
  }

  if (authorityLeakErrors.length) {
    console.error("Core-page authority leakage:");
    for (const error of authorityLeakErrors) console.error(`- ${error}`);
  }

  if (contentErrors.length) {
    console.error("Data-to-page content errors:");
    for (const error of contentErrors) console.error(`- ${error}`);
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

  if (sitemapMetadataErrors.length) {
    console.error("Sitemap metadata errors:");
    for (const error of sitemapMetadataErrors) console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log(
  `Static export verified: ${requiredRoutes.length} core routes, metadata checks, noindex utility policy, core-page authority leakage checks, Wraith data-to-page checks, ${htmlFiles.length} HTML files with internal-link checks, sitemap URL/canonical/title/description/OpenGraph/indexability integrity, sitemap.xml and robots.txt.`
);
