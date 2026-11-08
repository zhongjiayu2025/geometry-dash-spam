import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
const root = process.cwd();
const errors = [];
const ads = JSON.parse(readFileSync(join(root, "data/adPages.json"), "utf8"));
if (new Set(ads).size !== ads.length || ads.length > 10) errors.push("Ad whitelist duplicated or expanded above ten audited pages");
for (const route of ["/","/geometry-dash-wave","/cps-test"]) {
  if (!ads.includes(route)) errors.push("Core interactive page missing from AdSense allowlist: " + route);
}
for (const route of ["/demon-list","/hardest-level","/dashmetry","/geometry-dash-breeze","/geometry-dash-codes"]) {
  if (ads.includes(route)) errors.push("Unreviewed reference content contains an AdSense loader: " + route);
}
const exported = route => {
  const name = route === "/" ? "index.html" : route.slice(1);
  const possibilities = [join(root,"out",name), join(root,"out",name+".html"),join(root,"out",name,"index.html")];
  const file = possibilities.find(p => existsSync(p) && statSync(p).isFile());
  if (!file) { errors.push("No exported page " + route); return ""; }
  return readFileSync(file,"utf8");
};
const home = exported("/"), wave = exported("/geometry-dash-wave");
if (!home.includes("15-Second Spam Challenge")) errors.push("Homepage lost distinct challenge content");
if (!wave.includes("Wave Rhythm Lab")) errors.push("Wave page lost original training model");
if (!home.includes("Enable JavaScript to play")) errors.push("Home no-script instructions missing");
if (!wave.includes("Enable JavaScript to change hold")) errors.push("Wave no-script instructions missing");
if (!readFileSync(join(root,"components","WaveSimulator.tsx"),"utf8").includes("loading: () => <WaveTrainerLoading />")) errors.push("Meaningful game loading instructions missing");
if (!readFileSync(join(root,"components","GameCanvas.tsx"),"utf8").includes("<WaveSessionReview runs={recentRuns}")) errors.push("Local training review not connected");

const codesHtml = exported("/geometry-dash-codes");
const secretsHtml = exported("/geometry-dash-vault-of-secrets-codes");
const demonHtml = exported("/demon-list");
const hardestHtml = exported("/hardest-level");

for (const [route, html] of [["/geometry-dash-codes", codesHtml], ["/geometry-dash-vault-of-secrets-codes", secretsHtml]]) {
  if (!html.includes("Your code checklist")) errors.push(route + ": tried-code checklist missing");
  if (!html.includes("This does not redeem them")) errors.push(route + ": tried-not-redeemed disclaimer missing");
  if (!html.includes("Not tried")) errors.push(route + ": untried filter missing");
}
const roomTable = readFileSync(join(root,"components","VaultCodeTable.tsx"),"utf8");
if (!roomTable.includes("gd_vault_progress_v1_") || !roomTable.includes('window.addEventListener("storage", onStorage)')) {
  errors.push("Checklist must persist locally and reload across tabs");
}
const codesPage = readFileSync(join(root,"app","geometry-dash-codes","page.tsx"),"utf8");
const detailPage = readFileSync(join(root,"app","geometry-dash-vault-of-secrets-codes","page.tsx"),"utf8");
if (!codesPage.includes('room="vault-of-secrets"') || !detailPage.includes('room="vault-of-secrets"')) {
  errors.push("Overview and Vault of Secrets guide must share one room ID");
}
if (demonHtml.includes("moving Society to #2") || hardestHtml.includes("replacing Society")) {
  errors.push("Demon list commentary still asserts an outdated static rank");
}
if (!demonHtml.includes("Latest checked snapshot") || !hardestHtml.includes("Latest checked snapshot")) {
  errors.push("Ranked pages must explain the dated source snapshot");
}

if (errors.length) {
  console.error("Original-value verification failed:\n" + errors.map(e=>" - "+e).join("\n"));
  process.exit(1);
}
console.log("Original-value audit passed: distinct content, training data report and narrow ad allowlist.");
