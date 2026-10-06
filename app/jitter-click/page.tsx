
import JitterClickTest from "../../components/JitterClickTest";
import Breadcrumbs from "../../components/Breadcrumbs";
import RelatedTools from "../../components/RelatedTools";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Jitter Click Test | 10-Second CPS Practice",
    description: "Run a 10-second jitter click test and compare browser-registered CPS. Practice a rapid clicking technique without relying on claimed benchmark speeds.",
    alternates: {
        canonical: '/jitter-click',
    },
  openGraph: {
    title: "Jitter Click Test | 10-Second CPS Practice",
    description: "Run a 10-second jitter click test and compare browser-registered CPS. Practice a rapid clicking technique without relying on claimed benchmark speeds.",
    url: "https://geometrydashspam.cc/jitter-click",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Jitter Click Test | 10-Second CPS Practice",
    description: "Run a 10-second jitter click test and compare browser-registered CPS. Practice a rapid clicking technique without relying on claimed benchmark speeds.",
  },
};

export default function JitterClickPage() {
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Jitter Click Test",
        "url": "https://geometrydashspam.cc/jitter-click",
        "description": "Run a 10-second jitter click test and compare browser-registered CPS. Practice a rapid clicking technique without relying on claimed benchmark speeds.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
            />
            <Breadcrumbs items={[{ label: "Jitter Click", href: "/jitter-click", active: true }]} />
        <JitterClickTest />
        <RelatedTools currentTool="jitter" />
        </>
    );
}
