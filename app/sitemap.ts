import { MetadataRoute } from "next";
import { BLOG_POSTS } from "../data/blogContent";
import { DEMON_VERIFIED_AT } from "../data/demons";
import { VAULT_CODES_CHECKED_AT } from "../data/vaultCodes";
import relatedSearchData from "../data/relatedSearch.json";

export const dynamic = "force-static";

const UPDATED = "2026-10-07";

const DEMON_ROUTES = new Set([
  "/demon-list",
  "/demon-list/wave-demons",
  "/demon-list/spam-demons",
  "/hardest-level",
]);

const CODE_ROUTES = new Set([
  "/geometry-dash-codes",
  "/geometry-dash-vault-of-secrets-codes",
  "/how-to-get-gold-keys-geometry-dash",
]);

const RELATED_ROUTE_DATES = new Map<string, string>([
  ["/spam-challenge-list", relatedSearchData.spamChallengeList.checkedAt],
  ["/dashmetry", relatedSearchData.dashmetry.checkedAt],
  ["/geometry-dash-breeze", relatedSearchData.breeze.checkedAt],
]);

const CORE_ROUTES = [
  "",
  "/geometry-dash-wave",
  "/cps-test",
  "/reaction-test",
  "/demon-list",
  "/demon-list/wave-demons",
  "/demon-list/spam-demons",
  "/spam-challenge-list",
  "/hardest-level",
  "/easiest-demons",
  "/geometry-dash-clicker",
  "/geometry-dash-codes",
  "/geometry-dash-vault-of-secrets-codes",
  "/how-to-get-diamonds-geometry-dash",
  "/how-to-get-gold-keys-geometry-dash",
  "/geometry-dash-difficulty-faces",
  "/geometry-dash-stuttering-high-end-pc",
  "/geometry-dash-breeze",
  "/dashmetry",
  "/jitter-click",
  "/butterfly-click",
  "/drag-click",
  "/spacebar-counter",
  "/keyboard-latency",
  "/polling-rate",
  "/keyboard-ghosting",
  "/key-rollover",
  "/right-click",
  "/double-click",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/sitemap",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://geometrydashspam.cc";

  const routeEntries: MetadataRoute.Sitemap = CORE_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: DEMON_ROUTES.has(route)
      ? DEMON_VERIFIED_AT
      : CODE_ROUTES.has(route)
        ? VAULT_CODES_CHECKED_AT
        : RELATED_ROUTE_DATES.get(route) ?? UPDATED,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated ?? post.date,
  }));

  return [...routeEntries, ...blogEntries];
}
