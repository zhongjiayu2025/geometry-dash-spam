# SEO / GEO Release Evidence — Website Starter Standard Alignment

Release date: 2026-10-07  
Production URL: https://geometrydashspam.cc  
Scope: apply `chenmu2024/Website-Starter-Standard` SEO/GEO governance to the live Geometry Dash Spam architecture.

Private Search Console metrics are intentionally not stored in this public repository.

## Release under test

- Architecture/content commit: `da820caf0f4bee4f077308ab2bded845d3c62c45`
- Verified production content commit: `3dc1aa0b4eac66a7a86e4b054659535dba9c8993`
- Reviewer: repository automation + manual architecture review

## 1. Deterministic checks

| Check | Command / mechanism | Status | Evidence |
|---|---|---|---|
| TypeScript | `npm run check` | PASS | GitHub Actions Build run 37550666721 |
| Static build | `npm run build` | PASS | GitHub Actions Build run 37550666721 |
| Data/source verification | `npm run verify:data` | PASS | Demon/Vault/related-game verifiers in run 37550666721 |
| Export SEO/GEO verification | `npm run verify:export` | PASS | route/metadata/schema/link/index checks in run 37550666721 |
| Redirects | export verifier | PASS | required 301 map |
| Sitemap/canonical/robots | export verifier | PASS | sitemap ↔ indexable canonical parity |
| Duplicate title/description/H1 | export verifier | PASS | sitemap-page semantic checks |
| Broken internal links | export verifier | PASS | exported HTML link crawl |
| Orphan indexable pages | export verifier | PASS | inbound-link audit excluding HTML sitemap |
| Intent clusters | export verifier | PASS | protected CPS/Wave/Demon/keyboard clusters |
| Source/entity checks | export verifier | PASS | #editorial + About source links |

## 2. Raw HTML / entity alignment

The current static architecture is expected to preserve the following in exported HTML:

- one H1 on sitemap pages
- self canonical and intended robots directives
- Organization `#organization`
- Geometry Dash Spam Editorial `#editorial`
- WebSite `#website`
- Article/Breadcrumb/visible FAQ schema where applicable
- direct source links on source-sensitive content
- crawlable intent-cluster links

Verification status: PASS in GitHub Actions run `37550666721`.

## 3. Intent / content quality

- Approved core intent ownership is recorded in `SEO-GEO-PROJECT-BRIEF.md`.
- Winning canonical routes are preserved.
- No new near-duplicate AI-query pages were introduced.
- The high-impression top-spam guide now exposes direct links to the maintained SCL and Pointercrate sources.
- About now exposes editorial responsibility plus primary-source/freshness policy.
- Browser measurements remain described as diagnostics rather than laboratory certification.
- Wave simulation remains described as a practice model rather than official game physics.

## 4. GEO / AI-search alignment

- GEO is treated as an extension of normal SEO.
- The site uses the same canonical pages for people, classic Search and AI-assisted Search.
- No special AI-only schema was added.
- `llms.txt` remains optional interoperability metadata and is not described as a Google ranking signal.
- Google-Extended is not explicitly blocked; the project brief records that training-crawler policy is separate from Search indexing.
- No synthetic AI-visibility score is published.

## 5. Production verification

- Build: PASS
- Production deployment: PASS
- `deploy-status.json` commit match/descendant check: PASS for `3dc1aa0b4eac66a7a86e4b054659535dba9c8993` in GitHub Actions run `37550666721`
- robots.txt / sitemap.xml: enforced by CI/export checks
- Production freshness: enforced by the `verify-production` workflow

## 6. Post-launch follow-up

Use private Search Console data outside this public repository to review:

- query → landing page ownership
- positions 4–15 with meaningful impressions
- CTR changes on the CPS, spam, wave and Demon clusters
- indexation drift
- cannibalization
- generative-AI Search reporting when available
- multimodal/image-input reporting when relevant

## 7. Drift baseline

Public drift baseline: `SEO-GEO-BASELINE.md`.

A future release is a regression if it unintentionally changes protected canonical URLs, creates sitemap/indexation mismatch, creates orphan pages, removes source/freshness evidence, weakens entity consistency, or moves important SEO content into client-only rendering.


## 10. Design-system and consent follow-up

- `DESIGN.md`: added to freeze the current visual language and prevent arbitrary UI drift.
- `QA-CHECKLIST.md`: added for project-specific mobile/visual/accessibility/release checks.
- AdSense tag: present in the root layout.
- Referrer policy: `strict-origin-when-cross-origin`, compatible with Google's documented consent-message requirement.
- `ADS-CONSENT.md`: records the required account-side CMP setup.
- Source code cannot prove that an AdSense Privacy & messaging European regulations message has been published. This must be verified in the AdSense account.


## 11. First-party blog media

- All 11 blog hero covers were migrated from third-party stock-photo URLs to same-origin first-party SVG visuals under `/blog-covers/`.
- Article UI no longer depends on Unsplash for above-the-fold hero media.
- Article Open Graph/Twitter/Article structured-data image references use the site-owned PNG Open Graph endpoint for broad social/search crawler compatibility.
- The Next image config no longer needs an Unsplash remote-host allowlist.
- Export verification rejects a regression back to remote/Unsplash blog covers and checks every expected local cover exists.
