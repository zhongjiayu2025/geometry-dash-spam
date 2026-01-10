import { SitemapPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sitemap | Tools & Guides",
    description: "Full list of Geometry Dash spam tools and guides.",
};

export default function Page() {
    return <SitemapPage />;
}