import { existsSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");

const requiredRoutes = [
  "/",
  "/geometry-dash-wave",
  "/cps-test",
  "/demon-list",
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

const missing = requiredRoutes.filter(
  (route) => !candidates(route).some((path) => existsSync(path))
);

const unexpected = removedGhostRoutes.filter(
  (route) => candidates(route).some((path) => existsSync(path))
);

const metadataFiles = ["sitemap.xml", "robots.txt"].filter(
  (file) => !existsSync(join(outDir, file))
);

if (missing.length || unexpected.length || metadataFiles.length) {
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

  process.exit(1);
}

console.log(
  `Static export verified: ${requiredRoutes.length} core routes, sitemap.xml and robots.txt.`
);
