# AdSense Content Quality Review — Geometry Dash Spam

Reviewed: 2026-10-09  
Production: https://geometrydashspam.cc  
Background: the publisher reported a previous AdSense rejection described as "low-value content."

## What Google actually asks for

AdSense's published guidance emphasizes original, relevant publisher content, accessible navigation, visitor value and a good site experience. There is no official universal minimum word count, article count, or approval checklist that guarantees acceptance.

Authoritative references:
- https://support.google.com/adsense/answer/7299563
- https://support.google.com/adsense/answer/12176698
- https://support.google.com/adsense/answer/10502938
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## Findings and concrete remedies

| Finding | Risk to users | Change |
|---|---|---|
| Guide cards suggested 5–7 minutes while several guides were very short | Overpromised depth, low trust | Corrected to shorter, more realistic guide times |
| Mechanics and device-comparison guides offered broad statements without detailed experiments | User leaves without actionable next steps | Added comparable test procedures, decision tables and limits |
| 30-day practice plan named four phases but offered little day-to-day tracking structure | Not a practical plan | Added repeatable session and example record sheet |
| Click-timing "science" page lacked the actual site's calculation definitions | No uniquely verifiable explanation | Added rolling 1-second peak, interval variation and worked example |
| Top spam levels guide sent readers to other lists without level examples | Page did not fully answer its own headline | Added named practice examples while not inventing rank positions |
| Core CPS guide lacked detailed methodology at point of use | Valuable first-party functionality was not explained | Added formula, timed-run example and repeatability guidance |
| Some descriptions of Peak 1s CPS differed from implementation | Potentially misleading information | Corrected definitions to match the tool code |
| Site contains supporting generic browser diagnostics | Off-topic / thin-value risk | Keep noindex utility policies and avoid making unsupported AdSense claims about them |

## Original value to preserve

- The spam/wave trainer is interactive and offers repeatable drills, survival time and browser-side timing metrics.
- The CPS tool counts browser-registered input with selectable durations; it stores recent runs locally.
- Relevant guides now describe *how to use* those tools to test a practical question, not only repeat generic definitions.
- Ranking/code claims distinguish first-party interpretation from maintained third-party sources.
- The site clearly discloses it is fan-made and does not claim to reproduce exact official game physics.

## Submission readiness checklist

- [ ] Main page, Wave trainer and CPS test work on mobile and desktop, including start/end/retry and keyboard/pointer input.
- [ ] Latest deployment finished successfully, and all important links resolve.
- [ ] About, Contact, Privacy and Terms are accessible from every page.
- [ ] AdSense ownership script appears once in the global head and ads.txt matches the publisher ID.
- [ ] No placeholder content, fabricated testimonials, fake rank claims, or unfinished marketing landing pages.
- [ ] Screens intended for search have enough substance to answer a user task; supporting noindex tools remain useful, not misleading.
- [ ] Confirm the exact AdSense policy message and address any *additional* issues before requesting re-review.
- [ ] Request re-review only after the updated pages can be accessed in production.

## What cannot be verified from this repository

- Google's internal reason for this particular rejection.
- The exact pages a human or automated reviewer evaluated.
- Whether the AdSense account has any other restriction.
- Whether Google will approve on the next attempt.

Do **not** interpret this document or a passing CI build as an AdSense approval guarantee.

## Advertising network exclusivity

- The application source and main layout were audited for legacy third-party advertising integrations.
- Only the authorized AdSense publisher is configured in the website code and public ads.txt.
- Added `npm run verify:ads` to fail if legacy ad-network signatures or other external scripts enter exported HTML/JS, or if ads.txt authorizes any second seller.
- Added a production check against major live routes. Cloudflare dashboard / browser injections still require manual inspection if a visitor observes non-AdSense ads.
- The previous AdSense low-value-content finding is a separate review issue; removal of a second network alone does not guarantee approval.


## Repeat rejection review — 2026-10-17 (Asia/Shanghai)

The publisher supplied a screenshot showing **Low value content** and ads.txt **Authorized**. The screenshot does not identify individual failing pages or disclose Google's internal evaluation.

Verified before changes:
- Production `/deploy-status.json` served commit `64e1ef007faee556b345e08293051e1b753c1ddd`; the previous content and AdSense-only commits are included in its history.
- Current production About/Contact and homepage contain the previous revised content. A stale search-service Contact extract was checked against a fresh production response and was not treated as the current page.
- The homepage drill cards all used `#spam-test-tool`; selecting a named drill did not apply that preset.
- The Wave page reused the homepage simulator and much of its general CPS/control advice. It lacked a visual explanation of hold duration, despite hold/release balance being part of this runtime's movement model.
- CPS history showed individual runs and their mean but did not expose the typical pace/range recommended by the guides.

Changes in this review:
- Drill links select the named preset, including initial direct links, same-page hash changes, and repeated selection after manual settings changes. In-progress runs retain their existing settings.
- The existing Wave page now has an original, server-rendered hold/release diagram, a numerical example derived from `WAVE_SPEED_Y`, a control exercise, and a preset table derived from the real configuration.
- The diagram explicitly distinguishes input cadence from hold/release balance. Examples are labeled schematic rather than fabricated player measurements.
- CPS history exposes the median and range after at least three same-duration trials. It does not claim a measured improvement or assume unchanged hardware/technique.
- Homepage copy now describes the drill action rather than discussing SEO page-creation strategy. Core keywords and URLs are preserved; no new search landing pages are added.

These are concrete usability and explanatory-content improvements, **not proof that any one issue caused rejection**. No traffic minimum, word-count target, fixed waiting period, or approval guarantee is inferred from them. Re-review should follow verified production changes; do not remove/re-add the site as a workaround.

## Full audit implementation — 2026-10-17

The following changes address the concrete issues in the full page audit. They
are independent improvements, not a claim that Google identified these pages.

- Home + Wave: rolling-second peak counts no longer fall back to average CPS in
  short/single-click runs. Unavailable interval means and SD remain null; SD
  needs two observed intervals. Result and local-history displays show N/A.
  Existing low-click history is normalized without inventing a zero deviation.
- Difficulty faces: twelve actual reference sprites, including all five Demon
  faces, replace placeholder smileys/D1–D5. Credit and identification guidance
  accompany the images. No ownership or open-source license is asserted for
  RobTop's game artwork.
- SCL: three directly checked dated entries with exact IDs, evidence links,
  method/FPS/device/handcam fields, a current-rule summary and a worked
  eligibility example. These do not auto-refresh with the separate source-home
  health-check date; the entry snapshot has its own date.
- Demon references: exact level identities and permanent Pointercrate links,
  section-specific failure/practice tasks, and an introductory route. The
  Rulas Easy Demon and declanlc Extreme Demon named Ultra Paracosm are distinct.
  JSON-LD selections match the visible cards.
- Easiest Demons: a single responsive set of five exact-ID practice cards,
  different selection reasons and concrete checkpoint tasks; no invented clear
  results or universal easiest-to-hardest order.
- Key Rollover: expected-versus-observed combination trials with simultaneous
  snapshots and repeatable session records. Keyboard Timing: a fixed-key,
  20-tap series with separate hold and release summaries and sample counts.
- The 30-day article now has 30 distinct daily tasks, adjustment/review/rest
  decisions, browser-local completion/notes and CSV export.
- Top spam article compares sourced selections; Notable Levels is a distinct
  three-section analysis. Other revised guides add mouse worksheets, concrete
  input/posture comparisons, ten symptom/correction/retest cases and a real
  source-traceable measurement-claim analysis.
- Vault instructions include the full Sparky/Glubfub room sequence and an
  original six-number subtraction/concatenation example.
- Drag/right-click/polling pages have task-specific worked interpretations.
  Polling exposes actual event/sample duration counts, without claiming USB
  certification. Breeze and Dashmetry add source-based version/mode comparisons;
  Windows/Android installs and gameplay performance have not been independently
  tested in this review.
- Privacy names advertising network data types and links Google's data-use
  explanation. Advertising eligibility is explicitly scoped; see ADS-CONSENT.
  Memory utilities gain persistent semantic headings and task descriptions.
- Automated metrics regression checks cover zero/one/two-click runs, enough
  equal/unequal intervals, rolling-window edges, short-run peaks and legacy
  nullable history. Existing complete build/export/SEO/provider checks remain.

Core keywords, existing search URLs and robots settings are preserved. No new
search landing pages are introduced. Source dates and content-modification
sitemap dates are tracked separately. The existing daily source workflow is
retained; its newer Pointercrate snapshot is preserved when integrating this
release.

Remaining limits: no private AdSense rejection details or account settings were
available; CMP publication and regional behavior are not certified by a source
build. No artificial word-count, traffic threshold, guaranteed approval or
fixed reapplication waiting period is claimed.
