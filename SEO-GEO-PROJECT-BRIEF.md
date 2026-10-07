# SEO / GEO Project Brief — Geometry Dash Spam

Status: active production architecture  
Production: https://geometrydashspam.cc  
Primary language: English  
Rendering: Next.js static export

This file applies the owner standard from `chenmu2024/Website-Starter-Standard` to this specific site. Private Search Console metrics are intentionally not stored in this public repository.

## 1. Product / search identity

- Brand: Geometry Dash Spam
- Product type: browser training tools + source-checked Geometry Dash reference content
- Primary user tasks: practice spam/wave control, measure CPS/input behavior, find sourced Demon/code/list information
- Monetization: advertising
- Cost model: static/free-tier-first infrastructure
- Fan status: independent fan-made project, not affiliated with RobTop Games

## 2. Approved keyword source

The owner supplied and approved the keyword set through external keyword research. Numeric Volume/KD/CPC values remain outside this public repository.

Protected intent families include:

- geometry dash spam / geometry dash spam test
- geometry dash wave
- gd cps test / geometry dash cps test / spam click test
- geometry dash demon list / spam demonlist / wave demons
- spam challenge list
- geometry dash breeze
- dashmetry
- supporting click/input-test intents with proven or strategically relevant search demand

Approved phrases are not silently replaced because another variant appears easier.

## 3. Intent ownership / canonical map

| Primary intent | Canonical route | Role |
|---|---|---|
| Geometry Dash spam / wave-spam control | `/` | Core spam-control trainer |
| Geometry Dash wave / wave trainer | `/geometry-dash-wave` | Dedicated wave trainer |
| GD CPS / spam click test | `/cps-test` | Raw repeated-input speed |
| Jitter clicking | `/jitter-click` | Technique support |
| Butterfly clicking | `/butterfly-click` | Technique support |
| Spacebar CPS | `/spacebar-counter` | Keyboard repeated-input support |
| Right-click CPS | `/right-click` | RMB-specific support |
| Reaction time | `/reaction-test` | Visual-response support |
| Aim trainer | `/aim-trainer` | Pointer-precision support |
| Demon List | `/demon-list` | Pointercrate snapshot |
| Spam Demons | `/demon-list/spam-demons` | Spam-heavy rated-Demon references |
| Wave Demons | `/demon-list/wave-demons` | Wave-focused rated-Demon references |
| Spam Challenge List | `/spam-challenge-list` | Maintained SCL entry point |
| Top spam levels | `/blog/top-spam-levels-2026` | Intent-separation overview |
| Hardest level | `/hardest-level` | Current #1 tied to dated Demon data |
| Codes | `/geometry-dash-codes` | Broad code reference |
| Vault of Secrets codes | `/geometry-dash-vault-of-secrets-codes` | Dedicated code intent |
| Geometry Dash Breeze | `/geometry-dash-breeze` | Source-checked fan-project guide |
| Dashmetry | `/dashmetry` | Legacy query → current Challenge Rush identity |

## 4. Indexation policy

- Sitemap URLs must be canonical and indexable.
- Legacy redirects are excluded from the sitemap.
- Generic utilities with weak Geometry Dash search intent remain `noindex,follow`.
- Indexable pages must have an inbound crawlable link from another indexable page outside the HTML sitemap.
- Core authority pages must not prominently leak authority into noindex utilities.
- New indexable utilities require an explicit intent decision before sitemap inclusion.

### Conservative indexation audit — 2026-10-07

The site keeps three practical route tiers:

1. **Core / proven search pages** — homepage, Wave, CPS, Demon/SCL, proven support tools and source-checked Geometry Dash guides remain indexable.
2. **Supporting input diagnostics with clear Geometry Dash relevance** — Polling Rate, Keyboard Timing, Ghosting/Rollover, Drag Click and similar pages remain indexable while they have distinct intent and useful explanatory content.
3. **Narrow or generic diagnostics** — remain usable but use `noindex,follow` when a separate search landing page would add little topical value.

Current reduction decision:
- `/double-click` → **noindex,follow** and removed from XML/HTML search-sitemap promotion. It remains accessible as a browser diagnostic through narrower related-tool flows.
- Existing noindex utility pages remain noindex.
- No GSC-proven winner was deindexed.

This is deliberately conservative: absence from a top-pages report alone is not treated as proof that an indexable route has zero value.

## 5. Internal-link architecture

Primary hubs:
- `/`
- `/geometry-dash-wave`
- `/cps-test`
- `/demon-list`
- `/blog`

Protected clusters:
- CPS → Jitter / Butterfly / Spacebar / Reaction / Aim / CPS guide
- Wave → Wave Demons / Wave-vs-UFO / notable wave-spam levels
- Demon List → SCL / Spam Demons / Wave Demons / top-spam guide
- Keyboard Ghosting ↔ Key Rollover

The export verifier checks orphan pages, broken links, core interlinks and intent-cluster links.

## 6. GEO / AI-search answer plan

- Use the same canonical pages for users, normal Search and AI-assisted Search.
- Put direct answers near the top when the query benefits from them.
- Keep formulas, units, browser limitations and simulator limitations explicit.
- Preserve original value: interactive tools, repeatable browser measurements, sourced snapshots and intent-separation guidance.
- Do not create duplicate AI-answer pages or special AI-only schema.
- `llms.txt` is retained only as optional interoperability metadata and is not described as a Google ranking signal.

## 7. Source / evidence registry

| Claim family | Source of truth | Freshness |
|---|---|---|
| Pointercrate Demon positions | https://pointercrate.com/demonlist/ | dated in `data/demons.ts` |
| Spam Challenge List | maintained SCL source in `data/relatedSearch.json` | dated in related-search data |
| Vault / Wraith codes | Geometry Dash Wiki pages in `data/vaultCodes.ts` | dated in vault data |
| Geometry Dash Breeze | maintained GitHub repo/releases in related-search data | dated in related-search data |
| Dashmetry / Challenge Rush | rebrand/current-game sources in related-search data | dated in related-search data |
| Browser tool metrics | calculations from events observed by the page | reproducible in tool code |

Changing claims must expose or link to the appropriate source and checked date where useful.

## 8. Entity map

| Entity | Type | Stable ID / URL |
|---|---|---|
| Geometry Dash Spam | Organization | `https://geometrydashspam.cc/#organization` |
| Geometry Dash Spam Editorial | Organization/editorial identity | `https://geometrydashspam.cc/#editorial` |
| Geometry Dash Spam website | WebSite | `https://geometrydashspam.cc/#website` |

Entity names must stay consistent across visible copy and JSON-LD. The site does not present itself as RobTop Games or an official Geometry Dash publisher.

## 9. Structured-data plan

- Global: Organization + editorial Organization + WebSite
- Interactive tools: WebApplication where truthful
- Blog: Article + BreadcrumbList; FAQPage only where the FAQ is visibly rendered
- Source/reference pages: WebPage/FAQ/ItemList where they describe visible content
- No schema type is added solely as a GEO tactic

## 10. International SEO

N/A for the current production architecture. The site is English-first. Do not add translated URLs/hreflang until market-specific keywords and localized content are validated.

## 11. Programmatic SEO

The current site does not mass-publish programmatic keyword pages. Any future generated page set must pass the owner quality gate before indexation.

## 12. Media / multimodal

- Social previews are generated at site level; blog cover media must remain relevant and load reliably.
- Meaningful screenshots/charts should have nearby explanatory text.
- Decorative imagery must not receive keyword-stuffed alt text.
- Multimodal Search Console reporting can be reviewed during L3 audits if enough relevant data exists.

## 13. Search / AI crawler policy

- Googlebot/Search crawlers: allowed by the current wildcard robots policy.
- Google-Extended: not explicitly blocked; it currently inherits the wildcard allow rule.
- A future training-crawler restriction must be documented separately and must not be described as a Search ranking/index control.
- `llms.txt`: optional interoperability metadata only.

## 14. Release verification

L1:
- `npm run check`
- `npm run build`
- `npm run verify`

The verifier checks route presence, redirects, metadata, H1, canonical/robots/sitemap parity, structured data, content/source checks, internal links, orphans, authority leakage and intent clusters.

L2:
- L1 plus visual/mobile review, lab performance review and production commit verification.

L3:
- real Search Console query/page/index data, CrUX when available, cannibalization/drift review, and AI/multimodal Search reporting when relevant.

## 15. Owner constraints

- Preserve approved keywords and established winning URLs unless explicitly changed.
- Do not fabricate keyword/search/traffic/AI-visibility metrics.
- Prefer zero/freemium infrastructure until traffic/revenue validates paid services.
- Do not publish unfinished thin route sets as a substitute for the agreed complete scope.
