import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, extname } from "node:path";

const root = process.cwd();
const exported = join(root, "out");
const publisher = "ca-pub-1528586776567779";
const sellerLine = "google.com, pub-1528586776567779, DIRECT, f08c47fec0942fa0";
const adSenseSrc =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + publisher;

// Only first-party app code, shipped assets and the generated site are checked.
// Documentation may mention an old provider in explanations and is not an ad loader.
const blockedProviders = [
  { name: "Adsterra", pattern: /adsterra|highperformanceformat[.]com|profitableratecpm[.]com|onclicka[.]com|\batOptions\s*=/i },
  { name: "Monetag", pattern: /monetag|propellerads[.]com|onclickperformance[.]com/i },
];

const errors = [];
const sourceExt = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".html", ".json"]);
const exportExt = new Set([".html", ".js"]);
let checkedFiles = 0;
let exportedPages = 0;

function visit(dir, allowed, inspect) {
  if (!existsSync(dir)) return;
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) {
      visit(path, allowed, inspect);
    } else if (item.isFile() && allowed.has(extname(item.name))) {
      checkedFiles += 1;
      const content = readFileSync(path, "utf8");
      inspect(content, relative(root, path));
    }
  }
}

function checkBlockedProviders(content, filename) {
  for (const provider of blockedProviders) {
    if (provider.pattern.test(content)) {
      errors.push(filename + ": disallowed " + provider.name + " ad-network signature");
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
  const all = [...htmlOrJs.matchAll(/<script\b[^>]*>/gi)].map((match) => match[0]);
  const head = htmlOrJs.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || "";
  const headScripts = [...head.matchAll(/<script\b[^>]*>/gi)].map((match) => match[0]);
  const matching = all.filter((tag) => tag.includes(adSenseSrc));
  const matchingHead = headScripts.filter((tag) => tag.includes(adSenseSrc));

  if (
    matching.length !== 1 ||
    matchingHead.length !== 1 ||
    !/\basync(?:\s|=|>)/i.test(matchingHead[0])
  ) {
    errors.push(filename + ": require exactly one async authorized AdSense script in <head>");
  }

  // A new cross-origin script must be explicitly audited; do not silently
  // reintroduce third-party advertising scripts through unrelated components.
  for (const tag of all) {
    const src = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!src || !/^https?:\/\//i.test(src)) continue;
    if (src !== adSenseSrc) {
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
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  if (entries.length !== 1 || entries[0] !== sellerLine) {
    errors.push("out/ads.txt must authorize only the current Google AdSense publisher");
  }
}

if (!exportedPages) {
  errors.push("no exported HTML pages were found; run npm run build first");
}

if (errors.length) {
  console.error("Ad-provider exclusivity check failed:");
  for (const error of errors.slice(0, 40)) console.error(" - " + error);
  process.exit(1);
}

console.log(
  "Ad-provider check passed: " + checkedFiles + " source/export assets, " +
    exportedPages + " HTML pages, single Google AdSense publisher and no known legacy ad loaders."
);
