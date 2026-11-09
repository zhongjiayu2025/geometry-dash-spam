import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, extname } from "node:path";

const root = process.cwd();
const exported = join(root, "out");
const publisher = "ca-pub-1528586776567779";
const sellerLine = "google.com, pub-1528586776567779, DIRECT, f08c47fec0942fa0";
const adSenseSrc = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + publisher;
const socialBarSrc = "https://bauval.org/14/a5024f416ca331965f268098798e5cd1";

// Only this exact site-specific Adsterra Social Bar source is approved.
// Legacy Adsterra and other provider loaders remain blocked.
const blockedProviders = [
  { name: "legacy ad-network loader", pattern: /highperformanceformat[.]com|profitableratecpm[.]com|onclicka[.]com|\batOptions\s*=/i },
  { name: "Monetag", pattern: /monetag|propellerads[.]com|onclickperformance[.]com/i },
];

const adPages = JSON.parse(readFileSync(join(root, "data", "adPages.json"), "utf8"));
const errors = [];
const sourceExt = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".html", ".json"]);
const exportExt = new Set([".html", ".js"]);
let checkedFiles = 0;
let exportedPages = 0;

function visit(dir, allowed, inspect) {
  if (!existsSync(dir)) return;
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) visit(path, allowed, inspect);
    else if (item.isFile() && allowed.has(extname(item.name))) {
      checkedFiles += 1;
      const content = readFileSync(path, "utf8");
      inspect(content, relative(root, path));
    }
  }
}

function checkBlockedProviders(content, filename) {
  for (const provider of blockedProviders) {
    if (provider.pattern.test(content)) {
      errors.push(filename + ": unexpected " + provider.name);
    }
  }
}

for (const dir of ["app", "components", "data", "lib", "public"]) {
  visit(join(root, dir), sourceExt, checkBlockedProviders);
}

visit(exported, exportExt, (htmlOrJs, filename) => {
  checkBlockedProviders(htmlOrJs, filename);
  if (!filename.endsWith(".html")) return;
  exportedPages += 1;
  const tags = [...htmlOrJs.matchAll(/<script\b[^>]*>/gi)].map(match => match[0]);
  const head = htmlOrJs.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || "";
  const headTags = [...head.matchAll(/<script\b[^>]*>/gi)].map(match => match[0]);
  const adsenseTags = tags.filter(tag => tag.includes(adSenseSrc));
  const adsenseHeadTags = headTags.filter(tag => tag.includes(adSenseSrc));
  const socialTags = tags.filter(tag => tag.includes(socialBarSrc));
  const socialHeadTags = headTags.filter(tag => tag.includes(socialBarSrc));
  const route = filename.replace(/^out/, "").replace(/\/index[.]html$/, "/").replace(/[.]html$/, "").replace(/\/$/, "") || "/";
  const eligibleForAdSense = adPages.includes(route);

  if (!eligibleForAdSense && adsenseTags.length) errors.push(filename + ": excluded page must not load AdSense");
  if (eligibleForAdSense && (
    adsenseTags.length !== 1 || adsenseHeadTags.length !== 1 ||
    !/\basync(?:\s|=|>)/i.test(adsenseHeadTags[0] || "")
  )) {
    errors.push(filename + ": AdSense allowlisted page must load one async publisher script inside <head>");
  }
  if (
    socialTags.length !== 1 || socialHeadTags.length ||
    !/data-cfasync\s*=\s*["']false["']/i.test(socialTags[0] || "")
  ) {
    errors.push(filename + ": sitewide Adsterra Social Bar must appear exactly once in <body> with data-cfasync=false");
  }

  const bodyEnd = htmlOrJs.toLowerCase().lastIndexOf("</body>");
  const socialTagIndex = htmlOrJs.indexOf(socialBarSrc);
  if (socialTagIndex < 0 || bodyEnd < 0 || socialTagIndex >= bodyEnd) {
    errors.push(filename + ": Social Bar must be placed before closing </body>");
  }

  for (const tag of tags) {
    const src = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (src && /^https?:\/\//i.test(src) && src !== adSenseSrc && src !== socialBarSrc) {
      errors.push(filename + ": unexpected external script (" + src + ")");
    }
  }
});

const adsFile = join(exported, "ads.txt");
if (!existsSync(adsFile)) {
  errors.push("out/ads.txt is missing");
} else {
  const entries = readFileSync(adsFile, "utf8")
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"));
  if (entries.length !== 1 || entries[0] !== sellerLine) {
    errors.push("out/ads.txt must preserve the authorized Google AdSense publisher. Do not invent Adsterra seller IDs.");
  }
}
if (!exportedPages) errors.push("no exported HTML pages found; run npm run build first");
if (errors.length) {
  console.error("Ad-provider integration verification failed:");
  for (const error of errors.slice(0, 45)) console.error(" - " + error);
  process.exit(1);
}
console.log("Ad-provider integration verified: " + checkedFiles + " files, " + exportedPages +
  " HTML pages, original AdSense allowlist plus one exact sitewide Adsterra Social Bar script.");
