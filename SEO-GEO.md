# Geometry Dash Spam — SEO / GEO Operating Standard

This repository follows the owner baseline in `chenmu2024/Website-Starter-Standard`, especially `SEO-GEO-QUALITY-GATE.md`. This file is the project-specific overlay for geometrydashspam.cc.

## Core rules

- Preserve approved search intents and established URLs unless the owner explicitly changes them.
- One primary intent maps to one canonical destination.
- Do not create near-duplicate pages for keyword variants or AI-query variants.
- Do not invent search volume, KD, CPC, traffic, ranking, backlink, player-count, testimonial, or AI-visibility data.
- Keep important SEO copy, metadata, schema, and internal links in statically rendered HTML whenever practical.
- Time-sensitive rankings, codes, releases, and related-game facts require a source and a checked date.
- Browser measurements are diagnostics, not laboratory hardware measurements.
- The wave trainer is practice-oriented and must not be described as an exact reproduction of official Geometry Dash physics.
- `llms.txt` is optional interoperability metadata. It is not treated as a Google ranking signal.

## Intent → canonical page map

| Search intent | Canonical page | Notes |
|---|---|---|
| Geometry Dash spam test / wave spam practice | `/` | Core spam-control trainer. |
| Geometry Dash wave / wave trainer | `/geometry-dash-wave` | Normal, mini, spam, precision and endless wave practice. |
| GD CPS test / Geometry Dash CPS test / spam click test | `/cps-test` | Raw repeated-input speed and consistency. |
| Jitter click | `/jitter-click` | Technique-specific support page. |
| Butterfly click | `/butterfly-click` | Technique-specific support page. |
| Spacebar CPS / spacebar counter | `/spacebar-counter` | Keyboard tapping speed. |
| Right click CPS | `/right-click` | RMB-specific speed comparison. |
| Geometry Dash Demon List | `/demon-list` | Source-checked Pointercrate snapshot. |
| Spam demonlist / spam-heavy Demons | `/demon-list/spam-demons` | Practice references; not an official spam ranking. |
| Wave Demons | `/demon-list/wave-demons` | Wave-focused Demon references. |
| Spam Challenge List | `/spam-challenge-list` | Community spam-challenge list entry point. |
| Top spam levels | `/blog/top-spam-levels-2026` | Search-intent bridge separating SCL, Demons and wave references. |
| Hardest Geometry Dash level | `/hardest-level` | Current #1 tied to dated Demon List data. |
| Geometry Dash codes | `/geometry-dash-codes` | Broad code reference. |
| Vault of Secrets codes | `/geometry-dash-vault-of-secrets-codes` | Dedicated Vault of Secrets intent. |
| Geometry Dash Breeze | `/geometry-dash-breeze` | Source-checked fan-project guide. |
| Dashmetry | `/dashmetry` | Legacy search intent mapped to current Challenge Rush identity. |

## Indexation policy

- Sitemap membership means the URL is canonical and intentionally indexable.
- Generic utilities with weak Geometry Dash search intent remain `noindex,follow`.
- Noindex utilities must not receive prominent authority from core pages.
- Redirected legacy routes must stay out of the sitemap.
- Important indexable pages must have at least one crawlable inbound link from another indexable page outside the HTML sitemap.

## AI-search / GEO execution

- Treat GEO as an extension of normal SEO, not a separate technical stack.
- The same canonical pages serve users, classic Search and AI-assisted Search; do not create duplicate AI-answer pages.
- Prioritize original value already present on this site: interactive trainers, browser-observed metrics, source-checked snapshots and comparison guidance.
- Keep important entity names consistent across visible content, metadata and JSON-LD: Geometry Dash Spam, Geometry Dash Spam Editorial and the cited third-party sources.
- Do not add special AI-only schema or claim that `llms.txt` affects Google rankings.
- The current robots policy allows ordinary search crawlers and does not explicitly block Google-Extended; any future training-crawler restriction must be treated separately from Search indexing.
- Use first-party Search Console reporting when evaluating search/AI-search performance. Do not create synthetic AI-visibility scores.

## GEO / answer-engine policy

Important pages should make the answer extractable without sacrificing usefulness:

- Put a direct answer or task explanation early when the query benefits from it.
- Use self-contained factual passages for definitions, limitations, and changing facts.
- Use question-shaped headings only when they match real user intent.
- State formulas, units, assumptions, browser limitations, and simulator limitations explicitly.
- Use dated primary or maintained first-party/community sources for changing claims.
- Keep visible content and JSON-LD consistent.
- Keep the site identity and correction path explicit through About and Contact.

## Evidence hierarchy

1. Maintainer/official first-party documentation, repositories, releases, or product pages.
2. Purpose-built community sources for claims they directly own, such as Pointercrate for its Demon List and the maintained SCL for its own rules/rankings.
3. Secondary sources only when the primary source does not cover the fact, with qualification where needed.
4. Internal measurements only for metrics the browser tool itself actually observes.

## Audit cadence

- L1: every SEO-sensitive change — build, raw HTML, metadata, canonical, robots, sitemap, internal links, schema and affected content checks.
- L2: major release — L1 plus responsive/visual/performance review and production verification.
- L3: periodic — use real GSC/field data to evaluate queries, landing pages, CTR, cannibalization and drift.

Private analytics and Search Console metrics should stay out of this public repository unless the owner explicitly chooses to publish them.


## Project evidence artifacts

- `SEO-GEO-PROJECT-BRIEF.md` records this site's approved intent ownership, indexation policy, source registry, entity map, schema plan and crawler policy.
- `SEO-GEO-RELEASE-EVIDENCE.md` records deterministic release checks and production verification without publishing private Search Console numbers.
