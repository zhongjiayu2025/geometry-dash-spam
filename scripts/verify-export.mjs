import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");
const demonSource = readFileSync(join(process.cwd(), "data", "demons.ts"), "utf8");
const vaultSource = readFileSync(join(process.cwd(), "data", "vaultCodes.ts"), "utf8");
const relatedSearchData = JSON.parse(
  readFileSync(join(process.cwd(), "data", "relatedSearch.json"), "utf8")
);
const demonDate = demonSource.match(/DEMON_VERIFIED_AT = "([^"]+)"/)?.[1];
const vaultDate = vaultSource.match(/VAULT_CODES_CHECKED_AT = "([^"]+)"/)?.[1];
const currentDemon = demonSource.match(/\{ rank: 1, level: "((?:\\.|[^"])*)"/)?.[1];

const demonEntries = [
  ...demonSource.matchAll(/\{ rank: (\d+), level: "((?:\\.|[^"])*)"/g),
].map((match) => ({
  rank: Number(match[1]),
  level: JSON.parse(`"${match[2]}"`),
}));

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

if (!demonDate || !currentDemon || !vaultDate) {
  throw new Error("Could not read dated Demon List or Vault data for export verification.");
}

const currentDemonName = JSON.parse(`"${currentDemon}"`);

const requiredRoutes = [
  "/",
  "/geometry-dash-wave",
  "/cps-test",
  "/demon-list",
  "/demon-list/spam-demons",
  "/spam-challenge-list",
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
  "/blog/top-spam-levels-2026",
  "/blog/interview-top-players",
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

const noindexRoutes = ["/dashboard", "/leaderboard", ...noindexUtilityRoutes];

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
  "/spam-challenge-list": {
    title: "Geometry Dash Spam Challenge List",
    description: "current Geometry Dash Spam Challenge List",
    canonical: "https://geometrydashspam.cc/spam-challenge-list",
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

const metadataFiles = ["sitemap.xml", "robots.txt", "manifest.webmanifest", "ads.txt", "llms.txt", "_redirects"].filter(
  (file) => !existsSync(join(outDir, file))
);

const redirectErrors = [];
const redirectsPath = join(outDir, "_redirects");
const expectedRedirects = new Map([
  ["/1-second-cps-test", "/cps-test"],
  ["/2-second-cps-test", "/cps-test"],
  ["/10-second-cps-test", "/cps-test"],
  ["/reaction-time", "/reaction-test"],
  ["/stats", "/dashboard"],
  ["/blog/top-spam-levels-2026", "/blog/notable-wave-spam-levels"],
  ["/blog/interview-top-players", "/blog/evaluate-geometry-dash-spam-advice"],
]);

if (existsSync(redirectsPath)) {
  const redirectLines = readFileSync(redirectsPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  const parsedRedirects = new Map();
  for (const line of redirectLines) {
    const [source, destination, status] = line.split(/\s+/);
    if (!source || !destination) {
      redirectErrors.push(`Malformed redirect line: ${line}`);
      continue;
    }
    if (status !== "301") {
      redirectErrors.push(`${source}: expected permanent 301 redirect, found ${status ?? "default"}`);
    }
    parsedRedirects.set(source, destination);
  }

  for (const [source, destination] of expectedRedirects) {
    const actual = parsedRedirects.get(source);
    if (actual !== destination) {
      redirectErrors.push(
        `${source}: redirect target is "${actual ?? "missing"}", expected "${destination}"`
      );
      continue;
    }

    if (!internalTargetExists(destination)) {
      redirectErrors.push(
        `${source}: redirect destination does not exist in static export: ${destination}`
      );
    }
  }
}

const infrastructureErrors = [];
const publisherId = "pub-1528586776567779";

const adsPath = join(outDir, "ads.txt");
if (existsSync(adsPath)) {
  const adsTxt = readFileSync(adsPath, "utf8");
  const expectedAdsLine = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;
  if (!adsTxt.includes(expectedAdsLine)) {
    infrastructureErrors.push(
      `ads.txt missing authorized Google publisher line: ${expectedAdsLine}`
    );
  }
}

const headersPath = join(outDir, "_headers");
if (existsSync(headersPath)) {
  const headersTxt = readFileSync(headersPath, "utf8");

  if (!headersTxt.includes("Content-Security-Policy: frame-ancestors 'self'")) {
    infrastructureErrors.push("_headers missing frame-ancestors protection");
  }

  if (
    !headersTxt.includes("/_next/static/*") ||
    !headersTxt.includes("Cache-Control: public, max-age=31536000, immutable")
  ) {
    infrastructureErrors.push("_headers must immutable-cache hashed Next static assets");
  }
}

const robotsPath = join(outDir, "robots.txt");
if (existsSync(robotsPath)) {
  const robotsTxt = readFileSync(robotsPath, "utf8");
  if (!robotsTxt.includes("User-Agent: *") && !robotsTxt.includes("User-agent: *")) {
    infrastructureErrors.push("robots.txt missing wildcard user-agent rule");
  }
  if (!robotsTxt.includes("https://geometrydashspam.cc/sitemap.xml")) {
    infrastructureErrors.push("robots.txt missing canonical sitemap URL");
  }
}

const manifestPath = join(outDir, "manifest.webmanifest");
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (manifest.name !== "Geometry Dash Spam") {
    infrastructureErrors.push(
      `manifest name is "${manifest.name ?? "missing"}", expected "Geometry Dash Spam"`
    );
  }
  if (manifest.start_url !== "/") {
    infrastructureErrors.push(
      `manifest start_url is "${manifest.start_url ?? "missing"}", expected "/"`
    );
  }

  if (manifest.id !== "/" || manifest.scope !== "/") {
    infrastructureErrors.push("manifest id and scope must stay rooted at /");
  }

  if (!manifest.categories?.includes("games") || !manifest.categories?.includes("utilities")) {
    infrastructureErrors.push("manifest must describe both games and utilities categories");
  }

  const manifestIcons = manifest.icons ?? [];
  const hasAnyLogo = manifestIcons.some(
    (icon) => icon.src === "/logo.svg" && icon.purpose === "any"
  );
  const hasMaskableLogo = manifestIcons.some(
    (icon) => icon.src === "/logo.svg" && icon.purpose === "maskable"
  );
  if (!hasAnyLogo || !hasMaskableLogo) {
    infrastructureErrors.push("manifest must expose the Geometry Dash Spam logo for both any and maskable purposes");
  }

  const shortcutUrls = new Set((manifest.shortcuts ?? []).map((item) => item.url));
  for (const route of ["/geometry-dash-wave", "/cps-test", "/demon-list"]) {
    if (!shortcutUrls.has(route)) {
      infrastructureErrors.push(`manifest missing core shortcut: ${route}`);
    }
  }
}

const llmsPath = join(outDir, "llms.txt");
if (existsSync(llmsPath)) {
  const llmsTxt = readFileSync(llmsPath, "utf8");
  const requiredLlmsLinks = [
    "https://geometrydashspam.cc/",
    "https://geometrydashspam.cc/geometry-dash-wave",
    "https://geometrydashspam.cc/cps-test",
    "https://geometrydashspam.cc/demon-list",
    "https://geometrydashspam.cc/spam-challenge-list",
    "https://geometrydashspam.cc/geometry-dash-codes",
    "https://geometrydashspam.cc/about",
    "https://geometrydashspam.cc/contact",
  ];

  if (!llmsTxt.startsWith("# Geometry Dash Spam")) {
    infrastructureErrors.push("llms.txt must start with the site H1");
  }

  for (const url of requiredLlmsLinks) {
    if (!llmsTxt.includes(url)) {
      infrastructureErrors.push(`llms.txt missing core URL: ${url}`);
    }
  }

  for (const route of noindexRoutes) {
    if (llmsTxt.includes(`https://geometrydashspam.cc${route}`)) {
      infrastructureErrors.push(`llms.txt should not promote noindex route: ${route}`);
    }
  }
}

const layoutSource = readFileSync(join(process.cwd(), "app", "layout.tsx"), "utf8");
const loadingSource = readFileSync(join(process.cwd(), "app", "loading.tsx"), "utf8");
const globalsSource = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");
const headerSource = readFileSync(join(process.cwd(), "components", "Header.tsx"), "utf8");
const headerRouteStateSource = readFileSync(join(process.cwd(), "components", "HeaderRouteState.tsx"), "utf8");
const cpsClientSource = readFileSync(join(process.cwd(), "components", "CpsTest.tsx"), "utf8");
const cpsRunHistorySource = readFileSync(join(process.cwd(), "components", "CpsRunHistory.tsx"), "utf8");
const cpsFinishedActionsSource = readFileSync(join(process.cwd(), "components", "CpsFinishedActions.tsx"), "utf8");
const waveClientSource = readFileSync(join(process.cwd(), "components", "WaveSimulator.tsx"), "utf8");
const wavePracticeDrillSource = readFileSync(join(process.cwd(), "components", "WavePracticeDrill.tsx"), "utf8");
const difficultySelectorSource = readFileSync(join(process.cwd(), "components", "DifficultySelector.tsx"), "utf8");
const gameCanvasSource = readFileSync(join(process.cwd(), "components", "GameCanvas.tsx"), "utf8");
const waveAudioSource = readFileSync(join(process.cwd(), "lib", "waveAudio.ts"), "utf8");
const waveRendererSource = readFileSync(join(process.cwd(), "lib", "waveRenderer.ts"), "utf8");
const waveRuntimeSource = readFileSync(join(process.cwd(), "lib", "waveRuntime.ts"), "utf8");
const waveStorageSource = readFileSync(join(process.cwd(), "lib", "waveStorage.ts"), "utf8");
const waveRunOverlaysSource = readFileSync(join(process.cwd(), "components", "WaveRunOverlays.tsx"), "utf8");
const clickSoundSource = readFileSync(join(process.cwd(), "lib", "clickSound.ts"), "utf8");
const cpsRecordsSource = readFileSync(join(process.cwd(), "lib", "cpsRecords.ts"), "utf8");
const persistentBestSource = readFileSync(join(process.cwd(), "lib", "usePersistentBestNumber.ts"), "utf8");
const managedTimeoutSource = readFileSync(join(process.cwd(), "lib", "useManagedTimeout.ts"), "utf8");
const lazyClickSoundSource = readFileSync(join(process.cwd(), "lib", "useLazyClickSound.ts"), "utf8");
const secondaryClickFinishedSource = readFileSync(join(process.cwd(), "components", "SecondaryClickFinishedActions.tsx"), "utf8");
const dragClickResultSource = readFileSync(join(process.cwd(), "components", "DragClickResult.tsx"), "utf8");
const spacebarFinishedSource = readFileSync(join(process.cwd(), "components", "SpacebarFinishedActions.tsx"), "utf8");
const mouseAccelerationResultSource = readFileSync(join(process.cwd(), "components", "MouseAccelerationResult.tsx"), "utf8");
const soundReactionResultSource = readFileSync(join(process.cwd(), "components", "SoundReactionResult.tsx"), "utf8");
const demonListSource = readFileSync(join(process.cwd(), "components", "DemonListTable.tsx"), "utf8");
const demonFilterSource = readFileSync(join(process.cwd(), "components", "DemonListFilterControls.tsx"), "utf8");
const clickTestHeroSource = readFileSync(join(process.cwd(), "components", "ClickTestHero.tsx"), "utf8");
const clickerSource = readFileSync(join(process.cwd(), "components", "GeometryDashClicker.tsx"), "utf8");
const homeSource = readFileSync(join(process.cwd(), "app", "page.tsx"), "utf8");
const personalStatsSource = readFileSync(join(process.cwd(), "components", "PersonalStats.tsx"), "utf8");
const personalStatsContentSource = readFileSync(join(process.cwd(), "components", "PersonalStatsContent.tsx"), "utf8");
const dashboardWaveHistorySource = readFileSync(join(process.cwd(), "components", "DashboardWaveHistory.tsx"), "utf8");
const dashboardPageSource = readFileSync(join(process.cwd(), "app", "dashboard", "page.tsx"), "utf8");
const supportClientPaths = [
  "SpacebarCounter.tsx",
  "KeyboardLatencyTest.tsx",
  "PollingRateTest.tsx",
  "KeyboardGhostingTest.tsx",
  "DoubleClickTest.tsx",
  "DragClickTest.tsx",
  "KeyRolloverTest.tsx",
  "JitterClickTest.tsx",
  "ButterflyClickTest.tsx",
  "RightClickTest.tsx",
  "BpmTapper.tsx",
  "AimTrainer.tsx",
  "ChimpTest.tsx",
  "ReactionTest.tsx",
  "SoundReactionTest.tsx",
  "VisualMemoryTest.tsx",
  "TypingTest.tsx",
  "MouseAccelerationTest.tsx",
  "RefreshRateTest.tsx",
  "ScrollTest.tsx",
  "SystemInfo.tsx",
  "SecondaryClickTest.tsx",
];
const supportClientSources = supportClientPaths.map((file) => [
  file,
  readFileSync(join(process.cwd(), "components", file), "utf8"),
]);
const blogReaderSource = readFileSync(join(process.cwd(), "components", "BlogPostReader.tsx"), "utf8");
const copyLinkSource = readFileSync(join(process.cwd(), "components", "CopyLinkButton.tsx"), "utf8");
if (!layoutSource.includes(`client=ca-${publisherId}`)) {
  infrastructureErrors.push(
    `AdSense script client does not match ads.txt publisher ID ${publisherId}`
  );
}

if (
  !layoutSource.includes('href="#main-content"') ||
  !layoutSource.includes('id="main-content"')
) {
  infrastructureErrors.push("Root layout must include a keyboard skip link targeting #main-content");
}

if (!layoutSource.includes('"max-image-preview": "large"')) {
  infrastructureErrors.push("Root metadata must allow large Google image previews");
}

if (
  loadingSource.includes(">Loading...</") ||
  !loadingSource.includes('aria-label="Loading Geometry Dash tools"')
) {
  infrastructureErrors.push(
    "Global route fallback must keep an accessible label without generic visible Loading... text"
  );
}

for (const utilityRoute of ["/jitter-click", "/butterfly-click", "/drag-click"]) {
  if (headerSource.includes(utilityRoute)) {
    infrastructureErrors.push(
      `Global Header should not promote lower-priority utility route ${utilityRoute}`
    );
  }
}

if (headerSource.includes('"use client"')) {
  infrastructureErrors.push("Global Header must stay server-rendered; isolate navigation state in HeaderRouteState");
}

if (!headerSource.includes("<details") || !headerSource.includes("HeaderRouteState")) {
  infrastructureErrors.push("Global Header must use native details menus plus the tiny route-state helper");
}

if (
  !headerRouteStateSource.includes("usePathname") ||
  !headerRouteStateSource.includes("data-nav-href")
) {
  infrastructureErrors.push("HeaderRouteState must own active-route state without hydrating the full Header");
}

for (const [file, source] of supportClientSources) {
  if (source.includes("RelatedTools")) {
    infrastructureErrors.push(
      `${file}: static RelatedTools must render from the page Server Component`
    );
  }
}

const jitterClientSource = supportClientSources.find(([file]) => file === "JitterClickTest.tsx")?.[1] ?? "";
const secondaryClickClientSource = supportClientSources.find(([file]) => file === "SecondaryClickTest.tsx")?.[1] ?? "";
if (
  jitterClientSource.includes("Breadcrumbs") ||
  jitterClientSource.includes("import('./Breadcrumbs')") ||
  jitterClientSource.includes('import("./Breadcrumbs")')
) {
  infrastructureErrors.push("Jitter breadcrumbs must stay server-rendered outside the client test component");
}

const secondaryWrappers = [
  ["JitterClickTest.tsx", 'variant="jitter"'],
  ["ButterflyClickTest.tsx", 'variant="butterfly"'],
  ["RightClickTest.tsx", 'variant="rightClick"'],
];

for (const [file, variantMarker] of secondaryWrappers) {
  const source = supportClientSources.find(([name]) => name === file)?.[1] ?? "";
  if (
    !source.includes('import SecondaryClickTest from "./SecondaryClickTest"') ||
    !source.includes(variantMarker) ||
    source.length > 400
  ) {
    infrastructureErrors.push(
      `${file}: secondary click route wrapper must stay tiny and delegate to SecondaryClickTest`
    );
  }
}

if (
  !secondaryClickClientSource.includes("useState(false)") ||
  !secondaryClickClientSource.includes("10000 - elapsedMs") ||
  !secondaryClickClientSource.includes("window.setInterval(updateTimer, 100)") ||
  !secondaryClickClientSource.includes("performance.now() - startTimeRef.current >= 10000") ||
  secondaryClickClientSource.includes("}, 33)") ||
  secondaryClickClientSource.includes("setClicks(clicksRef.current)") ||
  !secondaryClickClientSource.includes("const renderedClicks = active ? clicksRef.current : clicks;")
) {
  infrastructureErrors.push(
    "Shared SecondaryClickTest must keep exact 10-second timing and a ref-based click hot path"
  );
}

if (
  !secondaryClickClientSource.includes('import("./SecondaryClickFinishedActions")') ||
  secondaryClickClientSource.includes("navigator.share") ||
  secondaryClickClientSource.includes("navigator.clipboard") ||
  secondaryClickClientSource.includes("<RotateCcw") ||
  secondaryClickClientSource.includes("<Share2") ||
  secondaryClickClientSource.includes("<Check")
) {
  infrastructureErrors.push(
    "Shared SecondaryClickTest must keep finished actions and sharing in the lazy result chunk"
  );
}

if (
  !secondaryClickFinishedSource.includes("navigator.share") ||
  !secondaryClickFinishedSource.includes("navigator.clipboard") ||
  !secondaryClickFinishedSource.includes("TRY AGAIN")
) {
  infrastructureErrors.push(
    "SecondaryClickFinishedActions must own sharing and retry controls for secondary click tests"
  );
}

if (
  !secondaryClickClientSource.includes('useLazyClickSound') ||
  secondaryClickClientSource.includes('import("../lib/clickSound")') ||
  secondaryClickClientSource.includes("AudioContext") ||
  secondaryClickClientSource.includes("createOscillator") ||
  secondaryClickClientSource.includes("createGain")
) {
  infrastructureErrors.push(
    "Shared SecondaryClickTest audio must use the shared lazy click-sound hook"
  );
}

if (!clickSoundSource.includes("createClickSoundEngine")) {
  infrastructureErrors.push("Shared clickSound engine is missing its lazy factory");
}

if (
  !lazyClickSoundSource.includes('import("./clickSound")') ||
  !lazyClickSoundSource.includes("createClickSoundEngine") ||
  !lazyClickSoundSource.includes("engine.destroy()") ||
  !lazyClickSoundSource.includes("engineRef.current.suspend()")
) {
  infrastructureErrors.push(
    "useLazyClickSound must own the shared dynamic clickSound lifecycle"
  );
}

if (
  !secondaryClickClientSource.includes("pendingTouchRef") ||
  !secondaryClickClientSource.includes('"touch-none" : "touch-pan-y"') ||
  !secondaryClickClientSource.includes("onPointerUp={isRightClick ? undefined : handlePointerUp}") ||
  !secondaryClickClientSource.includes("onPointerCancel={isRightClick ? undefined : handlePointerCancel}") ||
  !secondaryClickClientSource.includes("onContextMenu={isRightClick ? handleContextMenu : undefined}")
) {
  infrastructureErrors.push(
    "Shared SecondaryClickTest must preserve mobile scrolling before start and right-click context-menu input"
  );
}

const spacebarClientSource = supportClientSources.find(([file]) => file === "SpacebarCounter.tsx")?.[1] ?? "";
if (
  !spacebarClientSource.includes("useState(false)") ||
  !spacebarClientSource.includes('useLazyClickSound') ||
  spacebarClientSource.includes('import("../lib/clickSound")') ||
  !spacebarClientSource.includes("endTimerRef") ||
  !spacebarClientSource.includes("window.setInterval(updateTimer, 100)") ||
  !spacebarClientSource.includes("now - startTimeRef.current >= TEST_MS") ||
  spacebarClientSource.includes("AudioContext") ||
  spacebarClientSource.includes("createOscillator") ||
  spacebarClientSource.includes("}, 33)") ||
  spacebarClientSource.includes("Spacebar spam as a separate input skill")
) {
  infrastructureErrors.push(
    "SpacebarCounter must keep opt-in lazy audio, exact cutoff timing and server-rendered static guidance"
  );
}

if (
  spacebarClientSource.includes("isPressed") ||
  spacebarClientSource.includes("setIsPressed") ||
  spacebarClientSource.includes("countRef.current += 1;\n    setCount(countRef.current);") ||
  !spacebarClientSource.includes("visualKeyRef") ||
  !spacebarClientSource.includes("const renderedCount = active ? countRef.current : count;")
) {
  infrastructureErrors.push(
    "SpacebarCounter hot paths must stay ref-based for both count and key visual feedback"
  );
}

if (
  !spacebarClientSource.includes('dynamic(() => import("./SpacebarFinishedActions")') ||
  spacebarClientSource.includes("navigator.share") ||
  spacebarClientSource.includes("<Share2") ||
  spacebarClientSource.includes("<RotateCcw") ||
  !spacebarFinishedSource.includes("navigator.share")
) {
  infrastructureErrors.push(
    "SpacebarCounter finished sharing and reset controls must stay in the lazy result chunk"
  );
}

if (
  !spacebarClientSource.includes("isInteractiveKeyboardTarget(event.target)") ||
  spacebarClientSource.includes("isInteractiveKeyboardTarget(e.target)")
) {
  infrastructureErrors.push(
    "SpacebarCounter must use the current KeyboardEvent when skipping interactive controls"
  );
}

const dragClientSource = supportClientSources.find(([file]) => file === "DragClickTest.tsx")?.[1] ?? "";
if (
  !dragClientSource.includes("endTimerRef") ||
  !dragClientSource.includes("touch-pan-y") ||
  !dragClientSource.includes("onPointerUp={handlePointerUp}") ||
  !dragClientSource.includes("window.setInterval(updateTimer, 100)") ||
  dragClientSource.includes("}, 33)")
) {
  infrastructureErrors.push(
    "DragClickTest must keep exact cutoff timing and allow mobile scrolling before a run starts"
  );
}

if (
  dragClientSource.includes("dragActive") ||
  dragClientSource.includes("setDragActive") ||
  dragClientSource.includes("clickTimesRef.current.push(now);\n    setClicks(clicksRef.current);") ||
  !dragClientSource.includes("const renderedClicks = isActive ? clicksRef.current : clicks;")
) {
  infrastructureErrors.push(
    "DragClickTest hot path must stay ref-based with CSS active feedback instead of per-input React state"
  );
}

if (
  !dragClientSource.includes('dynamic(() => import("./DragClickResult")') ||
  dragClientSource.includes("navigator.share") ||
  dragClientSource.includes("<Share2") ||
  dragClientSource.includes("<RotateCcw") ||
  !dragClickResultSource.includes("navigator.share")
) {
  infrastructureErrors.push(
    "DragClickTest finished result and sharing must stay in the lazy result chunk"
  );
}

if (dragClientSource.includes("This page measures browser-registered inputs")) {
  infrastructureErrors.push(
    "DragClickTest measurement limits must stay in the server-rendered InputToolGuide"
  );
}

const ghostingClientSource = supportClientSources.find(([file]) => file === "KeyboardGhostingTest.tsx")?.[1] ?? "";
if (
  ghostingClientSource.includes("<h1") ||
  ghostingClientSource.includes("How to test:") ||
  ghostingClientSource.includes("KeyboardIcon")
) {
  infrastructureErrors.push(
    "KeyboardGhostingTest static hero and instructions must stay server-rendered"
  );
}

if (
  ghostingClientSource.includes("setPressedKeys") ||
  ghostingClientSource.includes("setMaxKeys") ||
  !ghostingClientSource.includes("useState<GhostingState>")
) {
  infrastructureErrors.push(
    "KeyboardGhostingTest must keep pressed keys and max count in one measurement state"
  );
}

if (
  !ghostingClientSource.includes("visibilitychange") ||
  !ghostingClientSource.includes("if (document.hidden) clearPressed()")
) {
  infrastructureErrors.push(
    "KeyboardGhostingTest must clear pressed keys when the page becomes hidden"
  );
}

if (!ghostingClientSource.includes("if (event.repeat) return;")) {
  infrastructureErrors.push(
    "KeyboardGhostingTest must ignore repeated keydown events that do not change the pressed-key set"
  );
}

if (
  !ghostingClientSource.includes("isInteractiveKeyboardTarget(event.target)") ||
  ghostingClientSource.includes("isInteractiveKeyboardTarget(e.target)") ||
  !ghostingClientSource.includes('["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown"]') ||
  ghostingClientSource.includes('!["F5", "F11", "F12"].includes')
) {
  infrastructureErrors.push(
    "KeyboardGhostingTest must preserve interactive controls and Tab navigation while only suppressing scrolling keys"
  );
}

const rolloverClientSource = supportClientSources.find(([file]) => file === "KeyRolloverTest.tsx")?.[1] ?? "";
if (
  rolloverClientSource.includes("setActiveKeys") ||
  rolloverClientSource.includes("setMaxKeys") ||
  !rolloverClientSource.includes("useState<RolloverState>")
) {
  infrastructureErrors.push(
    "KeyRolloverTest must keep active keys and max count in one measurement state"
  );
}

if (
  !rolloverClientSource.includes("visibilitychange") ||
  !rolloverClientSource.includes("if (document.hidden) clearPressed()")
) {
  infrastructureErrors.push(
    "KeyRolloverTest must clear active keys only when the page becomes hidden"
  );
}

if (!rolloverClientSource.includes("if (event.repeat) return;")) {
  infrastructureErrors.push(
    "KeyRolloverTest must ignore repeated keydown events that do not change the active-key set"
  );
}

if (
  !rolloverClientSource.includes("isInteractiveKeyboardTarget(event.target)") ||
  rolloverClientSource.includes("isInteractiveKeyboardTarget(e.target)")
) {
  infrastructureErrors.push(
    "KeyRolloverTest must use the current KeyboardEvent when skipping interactive controls"
  );
}

if (
  rolloverClientSource.includes("What this result means") ||
  rolloverClientSource.includes("AlertCircle")
) {
  infrastructureErrors.push(
    "KeyRolloverTest explanatory limits must stay in the server-rendered InputToolGuide"
  );
}

const doubleClickClientSource = supportClientSources.find(([file]) => file === "DoubleClickTest.tsx")?.[1] ?? "";
if (
  !doubleClickClientSource.includes("pendingTouchRef") ||
  !doubleClickClientSource.includes("touch-pan-y") ||
  !doubleClickClientSource.includes("onPointerUp={handlePointerUp}") ||
  doubleClickClientSource.includes('className="touch-none')
) {
  infrastructureErrors.push(
    "DoubleClickTest must allow vertical mobile scrolling and count only intentional taps"
  );
}

if (
  !doubleClickClientSource.includes("type MeasurementState") ||
  !doubleClickClientSource.includes("setMeasurement((current) => ({") ||
  doubleClickClientSource.includes("setClicks(") ||
  doubleClickClientSource.includes("setRapidIntervals(") ||
  doubleClickClientSource.includes("setLastDelta(") ||
  doubleClickClientSource.includes("setHistory(")
) {
  infrastructureErrors.push(
    "DoubleClickTest must merge per-input measurement updates into one React state transition"
  );
}

const rightClickClientSource = supportClientSources.find(([file]) => file === "RightClickTest.tsx")?.[1] ?? "";
const aimClientSource = supportClientSources.find(([file]) => file === "AimTrainer.tsx")?.[1] ?? "";
const reactionClientSource = supportClientSources.find(([file]) => file === "ReactionTest.tsx")?.[1] ?? "";
const visualMemoryClientSource = supportClientSources.find(([file]) => file === "VisualMemoryTest.tsx")?.[1] ?? "";
const chimpClientSource = supportClientSources.find(([file]) => file === "ChimpTest.tsx")?.[1] ?? "";
const typingClientSource = supportClientSources.find(([file]) => file === "TypingTest.tsx")?.[1] ?? "";
const scrollClientSource = supportClientSources.find(([file]) => file === "ScrollTest.tsx")?.[1] ?? "";
const soundReactionClientSource = supportClientSources.find(([file]) => file === "SoundReactionTest.tsx")?.[1] ?? "";
const refreshRateClientSource = supportClientSources.find(([file]) => file === "RefreshRateTest.tsx")?.[1] ?? "";
const mouseAccelerationClientSource = supportClientSources.find(([file]) => file === "MouseAccelerationTest.tsx")?.[1] ?? "";
const reactionPageSource = readFileSync(join(process.cwd(), "app", "reaction-test", "page.tsx"), "utf8");
const refreshRatePageSource = readFileSync(join(process.cwd(), "app", "refresh-rate", "page.tsx"), "utf8");
const mouseAccelerationPageSource = readFileSync(join(process.cwd(), "app", "mouse-acceleration", "page.tsx"), "utf8");
if (
  rightClickClientSource.includes("Why Test Right Click CPS?") ||
  rightClickClientSource.includes("Minecraft Bridging") ||
  rightClickClientSource.includes("MOBA Games")
) {
  infrastructureErrors.push(
    "RightClickTest must not carry off-topic static gaming copy in the client bundle"
  );
}

if (doubleClickClientSource.includes("Very short intervals can come from intentional fast clicking")) {
  infrastructureErrors.push(
    "DoubleClickTest measurement limits must stay in the server-rendered InputToolGuide"
  );
}

const keyboardTimingClientSource = supportClientSources.find(([file]) => file === "KeyboardLatencyTest.tsx")?.[1] ?? "";
if (
  !keyboardTimingClientSource.includes("clearInterruptedPress") ||
  !keyboardTimingClientSource.includes("visibilitychange") ||
  !keyboardTimingClientSource.includes("'blur'")
) {
  infrastructureErrors.push(
    "KeyboardLatencyTest must discard interrupted key holds on blur or backgrounding"
  );
}

if (
  !keyboardTimingClientSource.includes("type TimingState") ||
  !keyboardTimingClientSource.includes("setTiming((current) => ({") ||
  !keyboardTimingClientSource.includes("startTime === undefined") ||
  keyboardTimingClientSource.includes("setShortestPress(") ||
  keyboardTimingClientSource.includes("setAveragePress(") ||
  keyboardTimingClientSource.includes("setRecentPresses(") ||
  keyboardTimingClientSource.includes("setActiveKey(")
) {
  infrastructureErrors.push(
    "KeyboardLatencyTest must keep hold-duration results in one measurement state with an explicit missing-start guard"
  );
}

const pollingClientSource = supportClientSources.find(([file]) => file === "PollingRateTest.tsx")?.[1] ?? "";
if (
  !pollingClientSource.includes("(maxHz > 0 || isTracking)") ||
  !pollingClientSource.includes("Stop tracking")
) {
  infrastructureErrors.push(
    "PollingRateTest must remain stoppable even before the first pointer event is recorded"
  );
}

if (
  !pollingClientSource.includes("sampleElapsedSeconds") ||
  !pollingClientSource.includes("totalElapsedSeconds") ||
  !pollingClientSource.includes("eventCountRef.current / sampleElapsedSeconds") ||
  !pollingClientSource.includes("totalEventsRef.current / totalElapsedSeconds")
) {
  infrastructureErrors.push(
    "PollingRateTest must normalize current and average browser event rates by actual elapsed time"
  );
}

if (
  !secondaryClickClientSource.includes('isRightClick ? "touch-pan-y"') ||
  secondaryClickClientSource.includes('isRightClick ? "touch-none"')
) {
  infrastructureErrors.push(
    "Shared Right Click variant must keep vertical touch scrolling enabled"
  );
}

if (
  !pollingClientSource.includes('addEventListener("pointermove"') ||
  !pollingClientSource.includes("performance.now()") ||
  !pollingClientSource.includes("sampleElapsedSeconds") ||
  pollingClientSource.includes("onMouseMove=") ||
  pollingClientSource.includes("trackingSecondsRef")
) {
  infrastructureErrors.push(
    "PollingRateTest must use native pointer events and real elapsed time instead of React mouse events or interval-count timing"
  );
}

if (
  !aimClientSource.includes('dynamic(() => import("./AimTrainerResult")') ||
  !aimClientSource.includes('useLazyClickSound') ||
  aimClientSource.includes('import("../lib/clickSound")') ||
  !aimClientSource.includes("window.setInterval(updateTimer, 100)") ||
  !aimClientSource.includes("window.setTimeout(endGame, 30000)") ||
  aimClientSource.includes("AudioContext") ||
  aimClientSource.includes("createOscillator") ||
  aimClientSource.includes("navigator.share") ||
  aimClientSource.includes("}, 33)")
) {
  infrastructureErrors.push(
    "AimTrainer must lazy-load audio/results and keep its live timer on the 100ms UI boundary with an exact end timer"
  );
}

if (
  !clickSoundSource.includes('"aimHit"') ||
  !clickSoundSource.includes('"aimMiss"')
) {
  infrastructureErrors.push(
    "Shared clickSound engine must retain Aim Trainer hit and miss tones"
  );
}

if (
  !reactionClientSource.includes("dynamic(() => import('./ReactionResult')") ||
  reactionClientSource.includes("navigator.share") ||
  reactionClientSource.includes("How to use this reaction test") ||
  !reactionPageSource.includes("How to use this reaction test")
) {
  infrastructureErrors.push(
    "ReactionTest must keep result sharing lazy and static guidance server-rendered"
  );
}

if (
  !visualMemoryClientSource.includes("dynamic(() => import('./VisualMemoryGameOver')") ||
  visualMemoryClientSource.includes("navigator.share") ||
  visualMemoryClientSource.includes("<Share2") ||
  visualMemoryClientSource.includes("<RotateCcw")
) {
  infrastructureErrors.push(
    "VisualMemoryTest must keep game-over sharing and retry controls in the lazy result chunk"
  );
}

if (
  !chimpClientSource.includes("dynamic(() => import('./ChimpGameOver')") ||
  chimpClientSource.includes("navigator.share") ||
  chimpClientSource.includes("<Share2") ||
  chimpClientSource.includes("<RotateCcw")
) {
  infrastructureErrors.push(
    "ChimpTest must keep game-over sharing and replay controls in the lazy result chunk"
  );
}

if (
  !typingClientSource.includes('dynamic(() => import("./TypingResult")') ||
  !typingClientSource.includes("window.setInterval(updateTimer, 100)") ||
  !typingClientSource.includes("endTimerRef") ||
  typingClientSource.includes("navigator.share") ||
  typingClientSource.includes("<Share2") ||
  typingClientSource.includes("<RotateCcw") ||
  typingClientSource.includes("}, 50)")
) {
  infrastructureErrors.push(
    "TypingTest must lazy-load finished controls and keep its live timer on the 100ms UI boundary with an exact end timer"
  );
}

for (const [file, source, storageKey] of [
  ["ChimpTest.tsx", chimpClientSource, "chimpBestScore"],
  ["VisualMemoryTest.tsx", visualMemoryClientSource, "visualMemoryBest"],
  ["TypingTest.tsx", typingClientSource, "typingTestBestWpm"],
]) {
  if (
    !source.includes("usePersistentBestNumber") ||
    source.includes(`localStorage.getItem('${storageKey}'`) ||
    source.includes(`localStorage.setItem('${storageKey}'`) ||
    source.includes(`localStorage.getItem("${storageKey}"`) ||
    source.includes(`localStorage.setItem("${storageKey}"`)
  ) {
    infrastructureErrors.push(
      `${file}: local best score persistence must use the shared usePersistentBestNumber hook`
    );
  }
}

if (
  !persistentBestSource.includes("export function usePersistentBestNumber") ||
  !persistentBestSource.includes("localStorage.getItem(storageKey)") ||
  !persistentBestSource.includes("localStorage.setItem(storageKey")
) {
  infrastructureErrors.push(
    "Shared persistent best-score hook must own localStorage read/write behavior"
  );
}

for (const [file, source] of [
  ["ChimpTest.tsx", chimpClientSource],
  ["VisualMemoryTest.tsx", visualMemoryClientSource],
]) {
  if (
    !source.includes("useManagedTimeout") ||
    source.includes("setTimeout(")
  ) {
    infrastructureErrors.push(
      `${file}: delayed level transitions must use the shared managed-timeout hook`
    );
  }
}

if (
  !managedTimeoutSource.includes("window.clearTimeout(timeoutRef.current)") ||
  !managedTimeoutSource.includes("useEffect(() => clear, [clear])") ||
  !managedTimeoutSource.includes("timeoutRef.current = null")
) {
  infrastructureErrors.push(
    "Shared managed-timeout hook must clear stale timers on reschedule and unmount"
  );
}

if (
  !scrollClientSource.includes('dynamic(() => import("./ScrollResult")') ||
  !scrollClientSource.includes("window.setInterval(updateUi, 100)") ||
  !scrollClientSource.includes("window.setTimeout(finishTest, TEST_MS)") ||
  !scrollClientSource.includes("patternRef.current.style.backgroundPositionY") ||
  scrollClientSource.includes("setScrollY") ||
  scrollClientSource.includes("setDistance(distanceRef.current);\n      setEvents(eventsRef.current);\n      setScrollY")
) {
  infrastructureErrors.push(
    "ScrollTest wheel hot path must stay ref-based with 100ms UI sampling and exact cutoff timing"
  );
}

if (
  !soundReactionClientSource.includes("useLazyClickSound") ||
  soundReactionClientSource.includes("import('../lib/clickSound')") ||
  !soundReactionClientSource.includes("'soundReaction'") ||
  soundReactionClientSource.includes("AudioContext") ||
  soundReactionClientSource.includes("createOscillator") ||
  soundReactionClientSource.includes("createGain")
) {
  infrastructureErrors.push(
    "SoundReactionTest must keep Web Audio synthesis in the shared lazy clickSound chunk"
  );
}

if (
  !soundReactionClientSource.includes("dynamic(() => import('./SoundReactionResult')") ||
  soundReactionClientSource.includes("earlyClick") ||
  soundReactionClientSource.includes("Too Early!") ||
  !soundReactionResultSource.includes("Too Early!")
) {
  infrastructureErrors.push(
    "SoundReactionTest result UI must stay in the lazy result chunk with early state derived from reactionTime"
  );
}

if (!clickSoundSource.includes('"soundReaction"')) {
  infrastructureErrors.push(
    "Shared clickSound engine must retain the Sound Reaction cue tone"
  );
}

if (
  refreshRateClientSource.includes("<h1") ||
  refreshRateClientSource.includes("If the number is lower than expected") ||
  !refreshRatePageSource.includes("Browser Refresh Rate Test") ||
  !refreshRatePageSource.includes("If the number is lower than expected")
) {
  infrastructureErrors.push(
    "RefreshRateTest static heading and troubleshooting guidance must stay server-rendered"
  );
}

if (
  !mouseAccelerationClientSource.includes("dynamic(() => import('./MouseAccelerationResult')") ||
  mouseAccelerationClientSource.includes("Cursor difference:") ||
  mouseAccelerationClientSource.includes("<AlertTriangle") ||
  mouseAccelerationClientSource.includes("<RotateCcw") ||
  !mouseAccelerationPageSource.includes("Place your mouse against the left edge") ||
  !mouseAccelerationResultSource.includes("Cursor difference:")
) {
  infrastructureErrors.push(
    "MouseAccelerationTest instructions must stay server-rendered and result analysis must stay in the lazy result chunk"
  );
}

const clientSourceBudgets = [
  ["WaveSimulator.tsx", waveClientSource, 11000],
  ["CpsTest.tsx", cpsClientSource, 14200],
  ["AimTrainer.tsx", aimClientSource, 10500],
  ["ReactionTest.tsx", reactionClientSource, 6500],
  ["VisualMemoryTest.tsx", visualMemoryClientSource, 10700],
  ["ChimpTest.tsx", chimpClientSource, 10800],
  ["TypingTest.tsx", typingClientSource, 9300],
  ["ScrollTest.tsx", scrollClientSource, 7500],
  ["RefreshRateTest.tsx", refreshRateClientSource, 4500],
  ["MouseAccelerationTest.tsx", mouseAccelerationClientSource, 5000],
  ["SoundReactionTest.tsx", soundReactionClientSource, 8000],
  ["SecondaryClickTest.tsx", secondaryClickClientSource, 14500],
  ["DragClickTest.tsx", dragClientSource, 10000],
  ["SpacebarCounter.tsx", spacebarClientSource, 10500],
  ["PersonalStats.tsx", personalStatsSource, 5000],
  ["GameCanvas.tsx", gameCanvasSource, 32200],
];

for (const [file, source, maxBytes] of clientSourceBudgets) {
  if (source.length > maxBytes) {
    infrastructureErrors.push(
      `${file}: client source budget exceeded (${source.length} > ${maxBytes} bytes)`
    );
  }
}

if (cpsClientSource.includes("RelatedTools") || cpsClientSource.includes("How is CPS Calculated?")) {
  infrastructureErrors.push("CPS static guide content must stay outside the client test component");
}

if (waveClientSource.includes("Core next steps") || waveClientSource.includes("HowTo")) {
  infrastructureErrors.push("Wave static links and HowTo schema must stay outside the client simulator component");
}

if (homeSource.includes('next/dynamic') && homeSource.includes("HomeGuide")) {
  infrastructureErrors.push("HomeGuide should be server-rendered directly, not wrapped in next/dynamic");
}

if (
  blogReaderSource.includes('"use client"') ||
  blogReaderSource.includes("useState") ||
  blogReaderSource.includes("window.")
) {
  infrastructureErrors.push("Blog article body and TOC must remain server-rendered");
}

if (
  !blogReaderSource.includes("<CopyLinkButton") ||
  !copyLinkSource.includes('"use client"')
) {
  infrastructureErrors.push("Blog client JS should stay isolated to the small CopyLinkButton");
}

if (
  !gameCanvasSource.includes("import('../lib/waveRuntime')") ||
  !gameCanvasSource.includes("runtime.advanceWaveFrame") ||
  gameCanvasSource.includes("difficulty.speed * frameFactor") ||
  gameCanvasSource.includes("playerY += gameState.current.velocityY * frameFactor") ||
  !waveRuntimeSource.includes("frameDeltaMs") ||
  !waveRuntimeSource.includes("difficultySpeed * frameFactor") ||
  !waveRuntimeSource.includes("state.playerY += state.velocityY * frameFactor") ||
  waveRuntimeSource.includes("runTime = now - state.startTime")
) {
  infrastructureErrors.push(
    "Wave delta-time physics must stay in the first-run lazy waveRuntime chunk"
  );
}

if (
  !gameCanvasSource.includes("const preloadGameplay = useCallback") ||
  !gameCanvasSource.includes("Promise.all([ensureRuntime(), ensureRenderer()])") ||
  !gameCanvasSource.includes("onPointerEnter={preloadGameplay}") ||
  !gameCanvasSource.includes("onPointerDown={preloadGameplay}") ||
  !gameCanvasSource.includes("onFocus={preloadGameplay}")
) {
  infrastructureErrors.push(
    "Wave first-run chunks must preload only after START RUN interaction intent"
  );
}

if (
  gameCanvasSource.includes("const spawnObstacle") ||
  gameCanvasSource.includes("const createExplosion") ||
  gameCanvasSource.includes("const calculateConsistency") ||
  gameCanvasSource.includes("const getRunStats") ||
  gameCanvasSource.includes("particles = gameState.current.particles.filter") ||
  !waveRuntimeSource.includes("function spawnWaveObstacle") ||
  !waveRuntimeSource.includes("export function createWaveExplosion") ||
  !waveRuntimeSource.includes("export function calculateWaveConsistency") ||
  !waveRuntimeSource.includes("export function getWaveRunStats") ||
  !waveRuntimeSource.includes("state.particles = state.particles.filter")
) {
  infrastructureErrors.push(
    "Wave obstacle generation, effects, and run statistics must stay outside the initial GameCanvas chunk"
  );
}

if (
  gameCanvasSource.includes("const mulberry32") ||
  gameCanvasSource.includes("const stringToSeed") ||
  gameCanvasSource.includes("const initStars") ||
  gameCanvasSource.includes("beatScale = 1.0 +") ||
  !gameCanvasSource.includes("runtime.prepareWaveSeedAndStars") ||
  !waveRuntimeSource.includes("export function prepareWaveSeedAndStars") ||
  !waveRuntimeSource.includes("function mulberry32") ||
  !waveRuntimeSource.includes("state.beatScale = 1 +")
) {
  infrastructureErrors.push(
    "Wave seeded RNG, star setup, and beat decay must stay inside the lazy waveRuntime chunk"
  );
}

if (
  !gameCanvasSource.includes("import('../lib/waveStorage')") ||
  gameCanvasSource.includes("gd_spam_best_") ||
  gameCanvasSource.includes("gd_spam_runs_") ||
  gameCanvasSource.includes("JSON.parse(savedRuns)") ||
  !waveStorageSource.includes("export function loadWaveRecords") ||
  !waveStorageSource.includes("export function persistWaveHighScore") ||
  !waveStorageSource.includes("export function persistWaveRuns")
) {
  infrastructureErrors.push(
    "Wave high-score and run-history persistence must stay in the deferred waveStorage module"
  );
}

if (
  !gameCanvasSource.includes("import('../lib/waveRenderer')") ||
  !gameCanvasSource.includes("renderer(ctx, canvas") ||
  gameCanvasSource.includes("ctx.createLinearGradient") ||
  gameCanvasSource.includes("ctx.shadowBlur = 50") ||
  !waveRendererSource.includes("export function renderWaveFrame") ||
  !waveRendererSource.includes("ctx.createLinearGradient")
) {
  infrastructureErrors.push(
    "Wave canvas drawing must stay in the first-run lazy waveRenderer chunk"
  );
}

if (
  gameCanvasSource.includes("displayTime") ||
  gameCanvasSource.includes("setDisplayTime") ||
  !gameCanvasSource.includes("timeDisplayRef.current.textContent") ||
  !gameCanvasSource.includes("progressRef.current.style.width")
) {
  infrastructureErrors.push(
    "Wave HUD timing and progress must update through refs instead of React state on the game loop"
  );
}

const gameLoopRafRefs = (gameCanvasSource.match(/requestAnimationFrame\(gameLoop\)/g) || []).length;
if (
  gameLoopRafRefs !== 3 ||
  gameCanvasSource.includes("const frame = requestAnimationFrame(gameLoop);\n      return () => cancelAnimationFrame(frame);\n  }, [resetGame, gameLoop]);")
) {
  infrastructureErrors.push(
    `Wave animation loop must have one owner plus self-scheduling/static redraw references; found ${gameLoopRafRefs} rAF calls`
  );
}


if (
  !waveClientSource.includes("useEffect(() => {") ||
  !waveClientSource.includes("gd_spam_last_difficulty") ||
  waveClientSource.includes("useState<Difficulty>(() =>") ||
  waveClientSource.includes("useState<boolean>(() =>")
) {
  infrastructureErrors.push(
    "WaveSimulator saved preferences must hydrate after mount instead of changing initial server/client state"
  );
}

if (
  !waveClientSource.includes("Loading Geometry Dash wave trainer") ||
  !waveClientSource.includes("h-[330px]") ||
  !waveClientSource.includes("md:h-[500px]")
) {
  infrastructureErrors.push(
    "WaveSimulator dynamic GameCanvas must reserve its responsive height while the chunk loads"
  );
}

if (
  !waveClientSource.includes("dynamic(() => import('./WavePracticeDrill')") ||
  waveClientSource.includes("15-Second Mini Wave Drill") ||
  !wavePracticeDrillSource.includes("15-Second Mini Wave Drill")
) {
  infrastructureErrors.push(
    "Homepage-only Wave practice drill must stay outside the WaveSimulator initial client chunk"
  );
}

if (
  !waveClientSource.includes("useCallback((newDiff: Difficulty)") ||
  !difficultySelectorSource.includes("memo(function DifficultySelector")
) {
  infrastructureErrors.push(
    "DifficultySelector must stay memoized behind a stable selection callback"
  );
}

if (
  !gameCanvasSource.includes("useState<boolean>(true)") ||
  !gameCanvasSource.includes("savedMuted === null ? true") ||
  !gameCanvasSource.includes("import('../lib/waveAudio')") ||
  !gameCanvasSource.includes("mutedRef.current") ||
  !waveAudioSource.includes("createWaveAudioEngine")
) {
  infrastructureErrors.push("Wave audio must remain opt-in and dynamically loaded after user intent");
}

if (
  gameCanvasSource.includes("new AudioContext") ||
  gameCanvasSource.includes("createOscillator()") ||
  gameCanvasSource.includes("createBiquadFilter()") ||
  gameCanvasSource.includes("const scheduleMusic")
) {
  infrastructureErrors.push("Web Audio synthesis must stay outside the initial GameCanvas client bundle");
}

if (
  !gameCanvasSource.includes("dynamic(() => import('./WaveRunOverlays')") ||
  gameCanvasSource.includes("CRASHED") ||
  gameCanvasSource.includes("COMPLETE!") ||
  gameCanvasSource.includes("Share Result") ||
  !waveRunOverlaysSource.includes("CRASHED") ||
  !waveRunOverlaysSource.includes("Share Result")
) {
  infrastructureErrors.push(
    "Wave result and share overlays must stay outside the initial GameCanvas chunk"
  );
}

if (
  gameCanvasSource.includes("showShareModal") ||
  gameCanvasSource.includes("copyToClipboard") ||
  gameCanvasSource.includes("handleShareClick") ||
  !gameCanvasSource.includes("shareOpenRef") ||
  !waveRunOverlaysSource.includes("const [showShareModal") ||
  !waveRunOverlaysSource.includes("navigator.clipboard.writeText")
) {
  infrastructureErrors.push(
    "Wave share modal state and clipboard work must stay inside the lazy WaveRunOverlays chunk"
  );
}

if (
  personalStatsSource.includes("RelatedTools") ||
  !dashboardPageSource.includes('<RelatedTools currentTool="dashboard" />')
) {
  infrastructureErrors.push(
    "Dashboard RelatedTools must stay server-rendered outside PersonalStats"
  );
}

if (
  !personalStatsSource.includes('dynamic(() => import("./PersonalStatsContent")') ||
  personalStatsSource.includes("My Local Records") ||
  personalStatsSource.includes("Standard CPS Records") ||
  !personalStatsContentSource.includes("My Local Records") ||
  !personalStatsContentSource.includes("dynamic(() => import(\"./DashboardWaveHistory\")") ||
  !dashboardWaveHistorySource.includes("Saved Runs")
) {
  infrastructureErrors.push(
    "Dashboard loader must only read local stats before lazy-loading record cards and wave history"
  );
}

if (
  cpsClientSource.includes("const getTimingStats") ||
  cpsClientSource.includes("navigator.share") ||
  !cpsFinishedActionsSource.includes("function getTimingStats") ||
  !cpsFinishedActionsSource.includes("navigator.share")
) {
  infrastructureErrors.push(
    "CPS timing statistics and sharing must stay inside the lazy finished-actions chunk"
  );
}

if (
  !cpsClientSource.includes("useLazyClickSound") ||
  cpsClientSource.includes("import('../lib/clickSound')") ||
  cpsClientSource.includes("AudioContext") ||
  cpsClientSource.includes("createOscillator") ||
  cpsClientSource.includes("createGain")
) {
  infrastructureErrors.push(
    "CPS click audio must stay in the shared lazy-loaded clickSound chunk"
  );
}

if (
  !cpsClientSource.includes("dynamic(() => import('./CpsRunHistory')") ||
  cpsClientSource.includes("recentRuns.map") ||
  !cpsRunHistorySource.includes("recentRuns.map")
) {
  infrastructureErrors.push(
    "CPS recent-run cards must stay in the lazy-loaded history chunk"
  );
}

if (
  !cpsClientSource.includes("import('../lib/cpsRecords')") ||
  cpsClientSource.includes("localStorage.setItem('cpsRunHistory'") ||
  cpsClientSource.includes("localStorage.setItem('cpsBestScores'") ||
  !cpsRecordsSource.includes("export function loadCpsRecords") ||
  !cpsRecordsSource.includes("export function persistCpsRun")
) {
  infrastructureErrors.push(
    "CPS history and best-score persistence must stay in the deferred cpsRecords module"
  );
}

if (
  !cpsClientSource.includes("dynamic(() => import('./CpsFinishedActions')") ||
  cpsClientSource.includes("Train Wave Control") ||
  cpsClientSource.includes("<Share2") ||
  !cpsFinishedActionsSource.includes("Train Wave Control") ||
  !cpsFinishedActionsSource.includes("<Share2")
) {
  infrastructureErrors.push(
    "CPS finished metrics and action controls must stay in the lazy-loaded finished-actions chunk"
  );
}

if (
  cpsClientSource.includes("clickTimesRef.current.push(now);\n    setClicks(clicksRef.current);") ||
  !cpsClientSource.includes("const renderedClicks = active ? clicksRef.current : clicks;")
) {
  infrastructureErrors.push(
    "CPS click hot path must accumulate in refs instead of triggering React state on every input"
  );
}

if (
  !cpsClientSource.includes("window.setInterval(updateTimer, 100)") ||
  !cpsClientSource.includes("Math.max(0, selectedDuration * 1000 - elapsedMs)") ||
  !cpsClientSource.includes("setClicks(finalClicks)") ||
  cpsClientSource.includes("}, 33)")
) {
  infrastructureErrors.push(
    "CPS live UI must refresh on the 100ms boundary while final results synchronously publish the exact ref count"
  );
}

if (
  !globalsSource.includes(".defer-render") ||
  !globalsSource.includes("content-visibility: auto")
) {
  infrastructureErrors.push("Below-the-fold rendering containment must remain enabled");
}

if (
  !cpsClientSource.includes("pendingTouchRef") ||
  !cpsClientSource.includes("touch-pan-y") ||
  !cpsClientSource.includes("touch-none")
) {
  infrastructureErrors.push("CPS mobile input must allow scrolling before a test and lock touch only while active");
}

if (
  demonListSource.includes('"use client"') ||
  demonListSource.includes("useState") ||
  demonListSource.includes("useMemo") ||
  !demonListSource.includes("DEMONS.map((item)") ||
  !demonListSource.includes("<DemonListFilterControls")
) {
  infrastructureErrors.push(
    "Demon List rows must stay server-rendered with only the filter controls hydrated"
  );
}

if (
  !demonFilterSource.includes('"use client"') ||
  !demonFilterSource.includes('querySelectorAll<HTMLElement>("[data-demon-row]")') ||
  !demonFilterSource.includes("aria-rowcount")
) {
  infrastructureErrors.push(
    "DemonListFilterControls must remain the small client-only progressive filter"
  );
}

for (const file of ["JitterClickTest.tsx", "ButterflyClickTest.tsx", "RightClickTest.tsx"]) {
  const source = supportClientSources.find(([name]) => name === file)?.[1] ?? "";
  if (source.includes("<h1")) {
    infrastructureErrors.push(`${file}: static H1 hero must stay outside the client test component`);
  }
}

for (const heading of ["Jitter Click Test", "Butterfly Click Test", "Right Click CPS Test"]) {
  if (!clickTestHeroSource.includes(heading)) {
    infrastructureErrors.push(`ClickTestHero is missing server-rendered heading: ${heading}`);
  }
}

if (
  clickerSource.includes("saveTimerRef") ||
  clickerSource.includes("setTimeout(() => {\n      localStorage.setItem(STORAGE_KEY") ||
  !clickerSource.includes("setInterval(flushSave, 5000)") ||
  !clickerSource.includes('addEventListener("pagehide", flushSave)') ||
  !clickerSource.includes("stateRef.current = next") ||
  !clickerSource.includes("elapsedSeconds") ||
  !clickerSource.includes("prev.autoPower * elapsedSeconds")
) {
  infrastructureErrors.push(
    "Geometry Dash Clicker must use low-frequency persistence and elapsed-time normalized auto gain"
  );
}

if (
  !clickerSource.includes("pendingTouchRef") ||
  !clickerSource.includes("touch-pan-y") ||
  !clickerSource.includes("onPointerUp={handleCubePointerUp}") ||
  clickerSource.includes("touch-none mx-auto")
) {
  infrastructureErrors.push(
    "Geometry Dash Clicker must allow vertical mobile scrolling and count only intentional taps"
  );
}

if (
  clickerSource.includes("localStorage.setItem(STORAGE_KEY, JSON.stringify(state));")
) {
  infrastructureErrors.push(
    "Geometry Dash Clicker must not synchronously persist on every state update"
  );
}

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
const snippetQualityErrors = [];
const semanticErrors = [];
const sitemapTitleOwners = new Map();
const sitemapDescriptionOwners = new Map();
if (existsSync(sitemapPath)) {
  const sitemapXml = readFileSync(sitemapPath, "utf8");
  const sitemapRecords = [
    ...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g),
  ].map((match) => {
    const block = match[1];
    const loc = block.match(/<loc>https:\/\/geometrydashspam\.cc([^<]*)<\/loc>/)?.[1] || "/";
    const lastModified = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? null;
    return { route: loc, lastModified };
  });

  const sitemapRoutes = sitemapRecords.map((record) => record.route);

  const expectedFreshness = new Map([
    ["/demon-list", demonDate],
    ["/demon-list/wave-demons", demonDate],
    ["/demon-list/spam-demons", demonDate],
    ["/hardest-level", demonDate],
    ["/geometry-dash-codes", vaultDate],
    ["/geometry-dash-vault-of-secrets-codes", vaultDate],
    ["/how-to-get-gold-keys-geometry-dash", vaultDate],
    ["/spam-challenge-list", relatedSearchData.spamChallengeList.checkedAt],
    ["/dashmetry", relatedSearchData.dashmetry.checkedAt],
    ["/geometry-dash-breeze", relatedSearchData.breeze.checkedAt],
  ]);

  for (const [route, expectedDate] of expectedFreshness) {
    const record = sitemapRecords.find((item) => item.route === route);
    if (!record) {
      sitemapPolicyErrors.push(`${route}: freshness-tracked route missing from sitemap.xml`);
      continue;
    }

    if (!record.lastModified?.startsWith(expectedDate)) {
      sitemapPolicyErrors.push(
        `${route}: sitemap lastmod is "${record.lastModified ?? "missing"}", expected date ${expectedDate}`
      );
    }
  }

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
    const ogSiteName = metaContent(html, "property", "og:site_name");
    const ogLocale = metaContent(html, "property", "og:locale");
    const ogImage = metaContent(html, "property", "og:image");
    const twitterImage = metaContent(html, "name", "twitter:image");
    const twitterCard = metaContent(html, "name", "twitter:card");
    const h1Count = (html.match(/<h1\b/gi) || []).length;

    if (h1Count !== 1) {
      semanticErrors.push(
        `${route}: expected exactly one <h1>, found ${h1Count}`
      );
    }

    if (title) {
      const owner = sitemapTitleOwners.get(title);
      if (owner && owner !== route) {
        semanticErrors.push(
          `${route}: duplicate title also used by ${owner}: "${title}"`
        );
      } else {
        sitemapTitleOwners.set(title, route);
      }
    }

    if (description) {
      const owner = sitemapDescriptionOwners.get(description);
      if (owner && owner !== route) {
        semanticErrors.push(
          `${route}: duplicate meta description also used by ${owner}`
        );
      } else {
        sitemapDescriptionOwners.set(description, route);
      }
    }

    if (!title) {
      sitemapMetadataErrors.push(`${route}: missing <title>`);
    }

    if (!description) {
      sitemapMetadataErrors.push(`${route}: missing meta description`);
    }

    if (title && (title.length < 15 || title.length > 80)) {
      snippetQualityErrors.push(
        `${route}: title length ${title.length} is outside the 15–80 character quality range`
      );
    }

    if (description && (description.length < 50 || description.length > 190)) {
      snippetQualityErrors.push(
        `${route}: description length ${description.length} is outside the 50–190 character quality range`
      );
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

    if (ogSiteName !== "Geometry Dash Spam") {
      sitemapMetadataErrors.push(
        `${route}: og:site_name is "${ogSiteName ?? "missing"}", expected "Geometry Dash Spam"`
      );
    }

    if (ogLocale !== "en_US") {
      sitemapMetadataErrors.push(
        `${route}: og:locale is "${ogLocale ?? "missing"}", expected "en_US"`
      );
    }

    if (!ogImage?.startsWith("https://")) {
      sitemapMetadataErrors.push(
        `${route}: og:image is "${ogImage ?? "missing"}", expected an absolute HTTPS social preview image`
      );
    }

    if (!twitterImage?.startsWith("https://")) {
      sitemapMetadataErrors.push(
        `${route}: twitter:image is "${twitterImage ?? "missing"}", expected an absolute HTTPS social preview image`
      );
    }

    if (twitterCard !== "summary_large_image") {
      sitemapMetadataErrors.push(
        `${route}: twitter:card is "${twitterCard ?? "missing"}", expected "summary_large_image"`
      );
    }

    if (!route.startsWith("/blog/")) {
      const expectedOgPrefix = "https://geometrydashspam.cc/opengraph-image";
      const expectedTwitterPrefix = "https://geometrydashspam.cc/twitter-image";

      if (ogImage && !ogImage.startsWith(expectedOgPrefix)) {
        sitemapMetadataErrors.push(
          `${route}: og:image is "${ogImage}", expected shared Geometry Dash Spam preview image`
        );
      }

      if (twitterImage && !twitterImage.startsWith(expectedTwitterPrefix)) {
        sitemapMetadataErrors.push(
          `${route}: twitter:image is "${twitterImage}", expected shared Geometry Dash Spam preview image`
        );
      }
    }
  }

  for (const route of requiredRoutes) {
    if (!sitemapRoutes.includes(route)) {
      sitemapPolicyErrors.push(`required indexable route missing from sitemap.xml: ${route}`);
    }
  }

  for (const noindexRoute of noindexRoutes) {
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

for (const route of noindexRoutes) {
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

const coreInterlinkRoutes = [
  "/",
  "/geometry-dash-wave",
  "/cps-test",
  "/demon-list",
];

const coreInterlinkErrors = [];

for (const route of coreInterlinkRoutes) {
  const path = exportedPath(route);
  if (!path) continue;

  const html = readFileSync(path, "utf8");
  for (const target of coreInterlinkRoutes) {
    if (target === route) continue;

    const href = target === "/" ? 'href="/"' : `href="${target}"`;
    if (!html.includes(href)) {
      coreInterlinkErrors.push(
        `${route}: core page is missing internal link to ${target}`
      );
    }
  }
}

for (const route of coreAuthorityRoutes) {
  const path = exportedPath(route);
  if (!path) continue;

  const html = readFileSync(path, "utf8");
  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map(
    (match) => match[1]
  );

  for (const noindexRoute of noindexRoutes) {
    const leaks = hrefs.some(
      (href) =>
        href === noindexRoute ||
        href.startsWith(`${noindexRoute}#`) ||
        href.startsWith(`${noindexRoute}?`)
    );

    if (leaks) {
      authorityLeakErrors.push(
        `${route}: core page links to noindex utility ${noindexRoute}`
      );
    }
  }
}

const homeAuthorityPath = exportedPath("/");
if (homeAuthorityPath) {
  const homeHtml = readFileSync(homeAuthorityPath, "utf8");
  for (const deferredRoute of ["/dashmetry", "/geometry-dash-breeze"]) {
    if (
      homeHtml.includes(`href="${deferredRoute}"`) ||
      homeHtml.includes(`href='${deferredRoute}'`)
    ) {
      authorityLeakErrors.push(
        `/: homepage should not directly promote deferred related-game route ${deferredRoute}`
      );
    }
  }
}

const htmlSitemapErrors = [];
const htmlSitemapPath = exportedPath("/sitemap");
const htmlSitemapPriorityRoutes = [
  "/geometry-dash-wave",
  "/cps-test",
  "/demon-list",
  "/spam-challenge-list",
  "/geometry-dash-codes",
  "/hardest-level",
  "/geometry-dash-breeze",
  "/dashmetry",
  "/drag-click",
  "/right-click",
  "/double-click",
  "/spacebar-counter",
  "/polling-rate",
  "/keyboard-latency",
  "/keyboard-ghosting",
  "/key-rollover",
];

if (htmlSitemapPath) {
  const htmlSitemap = readFileSync(htmlSitemapPath, "utf8");
  for (const route of htmlSitemapPriorityRoutes) {
    if (!htmlSitemap.includes(`href="${route}"`)) {
      htmlSitemapErrors.push(`/sitemap: missing priority link ${route}`);
    }
  }
} else {
  htmlSitemapErrors.push("/sitemap: HTML sitemap page was not exported");
}

const supportGuideRoutes = [
  "/drag-click",
  "/right-click",
  "/double-click",
  "/spacebar-counter",
  "/polling-rate",
  "/keyboard-latency",
  "/keyboard-ghosting",
  "/key-rollover",
];

const supportGuideErrors = [];
for (const route of supportGuideRoutes) {
  const path = exportedPath(route);
  if (!path) {
    supportGuideErrors.push(`${route}: expected indexable support page was not exported`);
    continue;
  }

  const html = readFileSync(path, "utf8");
  if (!html.includes("data-support-guide=")) {
    supportGuideErrors.push(
      `${route}: indexable support page is missing the explanatory result guide`
    );
  }

  if (!html.includes("BreadcrumbList")) {
    supportGuideErrors.push(
      `${route}: indexable support page is missing BreadcrumbList structured data`
    );
  }

  for (const coreRoute of ["/geometry-dash-wave", "/cps-test"]) {
    if (!html.includes(`href="${coreRoute}"`)) {
      supportGuideErrors.push(
        `${route}: explanatory guide must link back to core route ${coreRoute}`
      );
    }
  }
}

for (const route of supportGuideRoutes) {
  const path = exportedPath(route);
  if (!path) continue;

  const html = readFileSync(path, "utf8");
  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]);

  for (const noindexRoute of noindexRoutes) {
    if (
      hrefs.some(
        (href) =>
          href === noindexRoute ||
          href.startsWith(`${noindexRoute}#`) ||
          href.startsWith(`${noindexRoute}?`)
      )
    ) {
      supportGuideErrors.push(
        `${route}: indexable support page must not link to noindex utility ${noindexRoute}`
      );
    }
  }
}

const intentClusterErrors = [];
const intentClusterLinks = new Map([
  ["/demon-list", ["/spam-challenge-list", "/demon-list/spam-demons"]],
  ["/spam-challenge-list", ["/demon-list", "/demon-list/spam-demons"]],
  ["/demon-list/spam-demons", ["/demon-list", "/spam-challenge-list"]],
]);

for (const [route, expectedLinks] of intentClusterLinks) {
  const path = exportedPath(route);
  if (!path) continue;
  const html = readFileSync(path, "utf8");

  for (const expectedLink of expectedLinks) {
    if (!html.includes(`href="${expectedLink}"`)) {
      intentClusterErrors.push(
        `${route}: missing intent-separation link to ${expectedLink}`
      );
    }
  }
}

const contentErrors = [];

const webApplicationRoutes = [
  "/",
  "/geometry-dash-wave",
  "/cps-test",
  "/jitter-click",
  "/butterfly-click",
  "/right-click",
  "/spacebar-counter",
  "/keyboard-latency",
  "/polling-rate",
  "/keyboard-ghosting",
  "/double-click",
  "/drag-click",
  "/key-rollover",
  "/geometry-dash-clicker",
];

for (const route of webApplicationRoutes) {
  const path = exportedPath(route);
  if (!path) continue;

  const html = readFileSync(path, "utf8");
  if (!html.includes("WebApplication")) {
    contentErrors.push(`${route}: interactive tool export is missing WebApplication structured data`);
  }
}

const serverRenderedGuideExpectations = new Map([
  [
    "/spacebar-counter",
    [
      "Spacebar spam as a separate input skill",
      "Compare the same duration",
      "Separate speed from hardware specs",
    ],
  ],
  [
    "/keyboard-ghosting",
    [
      "Keyboard Ghosting &amp; Key Rollover Test",
      "How to test:",
    ],
  ],
  [
    "/jitter-click",
    [
      "How to Practice Jitter Clicking",
      "Losing control while clicking faster?",
      'href="/cps-test"',
      'href="/butterfly-click"',
    ],
  ],
  [
    "/butterfly-click",
    [
      "What is Butterfly Clicking?",
      "Why use Butterfly Clicking in Geometry Dash?",
      'href="/cps-test"',
      'href="/jitter-click"',
    ],
  ],
]);

for (const [route, expectedSnippets] of serverRenderedGuideExpectations) {
  const path = exportedPath(route);
  if (!path) continue;

  const html = readFileSync(path, "utf8");
  for (const snippet of expectedSnippets) {
    if (!html.includes(snippet)) {
      contentErrors.push(`${route}: server-rendered HTML is missing "${snippet}"`);
    }
  }
}

const demonExportPath = exportedPath("/demon-list");
if (demonExportPath) {
  const demonHtml = readFileSync(demonExportPath, "utf8");
  if (demonEntries.length !== 50) {
    contentErrors.push(
      `/demon-list: expected 50 source Demon entries, found ${demonEntries.length}`
    );
  }

  for (const demon of demonEntries) {
    if (!demonHtml.includes(demon.level)) {
      contentErrors.push(
        `/demon-list: server-exported HTML is missing #${demon.rank} ${demon.level}`
      );
    }
  }
}

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
  infrastructureErrors.length ||
  redirectErrors.length ||
  internalLinkErrors.length ||
  sitemapRouteErrors.length ||
  sitemapPolicyErrors.length ||
  sitemapMetadataErrors.length ||
  snippetQualityErrors.length ||
  semanticErrors.length ||
  noindexErrors.length ||
  authorityLeakErrors.length ||
  coreInterlinkErrors.length ||
  htmlSitemapErrors.length ||
  supportGuideErrors.length ||
  intentClusterErrors.length ||
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

  if (semanticErrors.length) {
    console.error("Indexable-page semantic errors:");
    for (const error of semanticErrors) console.error(`- ${error}`);
  }

  if (snippetQualityErrors.length) {
    console.error("Search snippet quality errors:");
    for (const error of snippetQualityErrors) console.error(`- ${error}`);
  }

  if (noindexErrors.length) {
    console.error("Noindex utility errors:");
    for (const error of noindexErrors) console.error(`- ${error}`);
  }

  if (authorityLeakErrors.length) {
    console.error("Core-page authority leakage:");
    for (const error of authorityLeakErrors) console.error(`- ${error}`);
  }

  if (coreInterlinkErrors.length) {
    console.error("Core-page interlink errors:");
    for (const error of coreInterlinkErrors) console.error(`- ${error}`);
  }

  if (htmlSitemapErrors.length) {
    console.error("HTML sitemap errors:");
    for (const error of htmlSitemapErrors) console.error(`- ${error}`);
  }

  if (supportGuideErrors.length) {
    console.error("Indexable support-page guide errors:");
    for (const error of supportGuideErrors) console.error(`- ${error}`);
  }

  if (intentClusterErrors.length) {
    console.error("Search-intent cluster errors:");
    for (const error of intentClusterErrors) console.error(`- ${error}`);
  }

  if (contentErrors.length) {
    console.error("Data-to-page content errors:");
    for (const error of contentErrors) console.error(`- ${error}`);
  }

  if (infrastructureErrors.length) {
    console.error("Site infrastructure errors:");
    for (const error of infrastructureErrors) console.error(`- ${error}`);
  }

  if (redirectErrors.length) {
    console.error("Legacy redirect errors:");
    for (const error of redirectErrors) console.error(`- ${error}`);
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
  `Static export verified: ${requiredRoutes.length} core routes, metadata checks, ads/robots/manifest checks, permanent legacy redirects, search-snippet length checks, H1/title/description uniqueness checks, sitemap freshness checks, noindex utility policy, core-page authority leakage checks, HTML sitemap priority-link checks, indexable support-page guide checks, search-intent cluster checks, Demon data-to-page checks, Wraith data-to-page checks, ${htmlFiles.length} HTML files with internal-link checks, sitemap URL/canonical/title/description/OpenGraph/indexability integrity, sitemap.xml and robots.txt.`
);
