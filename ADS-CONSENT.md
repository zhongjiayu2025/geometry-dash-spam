# AdSense Consent / CMP Setup

Status: source prerequisites complete; a published Google European-regulations
message was observed in production using Google's official preview on
2026-10-18 (Asia/Shanghai). Account-editor settings and real regional behavior
have not been inspected.

## Why this exists

GeometryDashSpam.cc loads Google AdSense. For personalized ads served to users in the EEA, the UK and Switzerland, Google requires publishers to use a Google-certified consent management platform (CMP) integrated with the IAB TCF.

The repository can verify the code-side prerequisites, but it cannot prove whether the AdSense account has a published Privacy & messaging message.

## Code-side state

- The root layout uses `AdSenseHead` to load the publisher tag on the explicit
  40-page allowlist; navigation, information, utility and error pages are excluded.
- `ads.txt` contains the site publisher relationship.
- Referrer policy is `strict-origin-when-cross-origin`, which is compatible with Google's documented requirement for Privacy & messaging messages.
- Privacy policy URL: https://geometrydashspam.cc/privacy
- The privacy page distinguishes local practice-tool storage from advertising/consent processing.

## AdSense account setup reference

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

## Production preview verification — 2026-10-18 (Asia/Shanghai)

- Official testing reference:
  https://developers.google.com/funding-choices/fc-api-docs#testing_and_debugging_on_your_site
- Tested URL: https://geometrydashspam.cc/?fc=alwaysshow&fctype=gdpr
- The published Google message appeared after its asynchronous scripts loaded,
  naming geometrydashspam.cc and displaying consent and management controls.
  Funding Choices was loaded for publisher `ca-pub-1528586776567779`.
- Opening Manage options showed purpose/vendor controls and the confirmation
  control. This establishes an observable published message and working entry
  to preferences; it does not certify every region, consent signal or account
  setting.
- Saving the test visitor choices was not executed: automatic approval review
  rejected that action because explicit authorization to save privacy choices
  was absent. Save/withdrawal behavior is therefore still unverified.
- The AdSense account editor redirected to Google sign-in; no account settings
  were changed. A second homemade consent banner was not introduced.
