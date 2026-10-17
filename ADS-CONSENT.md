# AdSense Consent / CMP Setup

Status: source-code prerequisites complete; AdSense account-side publication must be verified manually.

## Why this exists

GeometryDashSpam.cc loads Google AdSense. For personalized ads served to users in the EEA, the UK and Switzerland, Google requires publishers to use a Google-certified consent management platform (CMP) integrated with the IAB TCF.

The repository can verify the code-side prerequisites, but it cannot prove whether the AdSense account has a published Privacy & messaging message.

## Code-side state

- AdSense publisher tag is loaded from the root layout.
- `ads.txt` contains the site publisher relationship.
- Referrer policy is `strict-origin-when-cross-origin`, which is compatible with Google's documented requirement for Privacy & messaging messages.
- Privacy policy URL: https://geometrydashspam.cc/privacy
- The privacy page distinguishes local practice-tool storage from advertising/consent processing.

## Required AdSense account action

In AdSense:

1. Open **Privacy & messaging**.
2. Open **European regulations**.
3. Create or manage the European regulations message.
4. Select **geometrydashspam.cc**.
5. Use **https://geometrydashspam.cc/privacy** as the privacy-policy URL.
6. Configure the required user choices and languages.
7. Publish the message.
8. If useful for your setup, review consent-mode settings separately.
9. Verify the production message in an eligible region or with Google's supported preview/debug method.

## Important distinction

- A CMP/consent message controls advertising/privacy choices.
- It is not an SEO or GEO ranking feature.
- Search crawling/indexing should not be blocked merely to control model-training or advertising consent.
- Local CPS/Wave/preferences stored by the site's tools are a separate data flow from advertising consent.

## Release check

A release may mark CMP status as **verified** only after someone has confirmed the published message in the AdSense account or production behavior. Source code alone is not sufficient evidence.

## Page eligibility revision — 2026-10-17

- `data/adPages.json` is the explicit page allowlist (40 content/tool routes).
- `components/AdSenseHead.tsx` retains the authorized asynchronous publisher tag
  in eligible exported document heads. It excludes the 12 existing noindex
  utilities, the two exported error templates, and six navigation/information
  pages (`/blog`, `/sitemap`, `/about`, `/contact`, `/privacy`, `/terms`).
- The component performs a full document navigation when an ordinary internal
  link crosses the allowlist boundary. This prevents an already loaded,
  document-wide AdSense SDK from carrying into an excluded page through Next.js
  client navigation. It does not change indexed URLs or robots policy.
- `verify:ads` checks all exported HTML against this allowlist. Production CI
  checks both included and excluded sample routes.
- This code change does not prove the account has a published CMP or establish
  which Auto ads placements Google will choose. Account-side CMP publication,
  consent-message behavior and Auto ads previews remain separately verifiable
  only with access to that configuration or observable regional behavior.
