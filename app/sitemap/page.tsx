import { SitemapPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap – Geometry Dash Tools & Guides",
  description: "Browse Geometry Dash spam, wave, CPS, codes, demon guides and browser utilities.",
  alternates: { canonical: "/sitemap" },
};

export default function Page() {
  return <SitemapPage />;
}
