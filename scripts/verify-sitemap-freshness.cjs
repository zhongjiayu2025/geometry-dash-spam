const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

// Exercise the real sitemap generator with independent source/editorial dates.
// No network or production data is changed by these future-date fixtures.
const source = ts.transpileModule(fs.readFileSync("app/sitemap.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText;
function generate(contentDates, sourceDate) {
  const fixture = {
    "../data/blogContent": { BLOG_POSTS: [] },
    "../data/demons": { DEMON_VERIFIED_AT: sourceDate },
    "../data/vaultCodes": { VAULT_CODES_CHECKED_AT: sourceDate },
    "../data/pageUpdates.json": contentDates,
    "../data/relatedSearch.json": Object.fromEntries(
      ["spamChallengeList", "dashmetry", "breeze"].map((key) => [key, { checkedAt: sourceDate }])
    ),
  };
  const result = { exports: {} };
  new Function("require", "module", "exports", source)((name) => {
    assert.ok(name in fixture, `Unexpected sitemap dependency: ${name}`);
    return fixture[name];
  }, result, result.exports);
  return new Map(result.exports.default().map((entry) => [new URL(entry.url).pathname, entry.lastModified]));
}

const routes = ["/hardest-level", "/demon-list/wave-demons", "/geometry-dash-vault-of-secrets-codes", "/spam-challenge-list", "/dashmetry", "/geometry-dash-breeze"];
const dates = Object.fromEntries(routes.map((route) => [route, "2026-10-17"]));
for (const route of routes) {
  assert.equal(generate(dates, "2026-10-18").get(route), "2026-10-18", `${route}: a later source refresh must advance lastmod`);
  assert.equal(generate(dates, "2026-10-16").get(route), "2026-10-17", `${route}: a later editorial edit must advance lastmod`);
}
assert.equal(generate({ "/geometry-dash-clicker": "2026-10-17" }, "2026-10-18").get("/geometry-dash-clicker"), "2026-10-17");
console.log("Sitemap freshness verified: newer source, newer editorial edit and independent tool dates.");
