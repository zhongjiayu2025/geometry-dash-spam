import { MetadataRoute } from "next";

export const dynamic = "force-static";

const UPDATED = "2026-10-05";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://geometrydashspam.cc";

  const routes = [
    "",
    "/geometry-dash-wave",
    "/cps-test",
    "/demon-list",
    "/demon-list/wave-demons",
    "/demon-list/spam-demons",
    "/hardest-level",
    "/easiest-demons",
    "/geometry-dash-clicker",
    "/geometry-dash-codes",
    "/geometry-dash-vault-of-secrets-codes",
    "/how-to-get-diamonds-geometry-dash",
    "/how-to-get-gold-keys-geometry-dash",
    "/geometry-dash-difficulty-faces",
    "/jitter-click",
    "/butterfly-click",
    "/drag-click",
    "/spacebar-counter",
    "/scroll-test",
    "/reaction-test",
    "/sound-reaction",
    "/chimp-test",
    "/visual-memory",
    "/aim-trainer",
    "/keyboard-latency",
    "/polling-rate",
    "/mouse-acceleration",
    "/keyboard-ghosting",
    "/key-rollover",
    "/bpm-tapper",
    "/refresh-rate",
    "/right-click",
    "/double-click",
    "/typing-test",
    "/system-info",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/sitemap",
  ];

  const blogSlugs = [
    "what-is-spam-geometry-dash-guide",
    "how-to-improve-cps-geometry-dash",
    "best-mouse-for-spam-geometry-dash",
    "wave-vs-ufo-spam",
    "top-spam-levels-2026",
    "30-day-spam-challenge",
    "science-of-clicking",
    "mobile-vs-pc-spam",
    "common-spam-mistakes",
    "interview-top-players",
  ];

  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: UPDATED,
      changeFrequency: route === "" || route === "/demon-list" ? ("weekly" as const) : ("monthly" as const),
      priority:
        route === ""
          ? 1
          : ["/geometry-dash-wave", "/cps-test", "/demon-list", "/geometry-dash-codes"].includes(route)
          ? 0.9
          : 0.6,
    })),
    ...blogSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
