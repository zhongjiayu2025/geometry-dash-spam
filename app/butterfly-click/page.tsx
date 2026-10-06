import ButterflyClickTest from "../../components/ButterflyClickTest";
import Breadcrumbs from "../../components/Breadcrumbs";
import ClickTestHero from "../../components/ClickTestHero";
import RelatedTools from "../../components/RelatedTools";
import ClickTechniqueGuide from "../../components/ClickTechniqueGuide";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Butterfly Click Test | Two-Finger CPS Practice",
  description:
    "Practice butterfly clicking and compare two-finger click speed and consistency in your browser.",
  alternates: { canonical: "/butterfly-click" },
  openGraph: {
    title: "Butterfly Click Test | Two-Finger CPS Practice",
    description: "Practice butterfly clicking and compare two-finger click speed and consistency in your browser.",
    url: "https://geometrydashspam.cc/butterfly-click",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Butterfly Click Test | Two-Finger CPS Practice",
    description: "Practice butterfly clicking and compare two-finger click speed and consistency in your browser.",
  },
};

export default function ButterflyClickPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Butterfly Click Test",
    url: "https://geometrydashspam.cc/butterfly-click",
    description: "Practice butterfly clicking and compare two-finger click speed and consistency in your browser.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    isPartOf: { "@id": "https://geometrydashspam.cc/#website" },
    publisher: { "@id": "https://geometrydashspam.cc/#organization" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
            <Breadcrumbs items={[{ label: "Butterfly Click", href: "/butterfly-click", active: true }]} />
      <ClickTestHero variant="butterfly" />
      <ButterflyClickTest />
      <ClickTechniqueGuide variant="butterfly" />
      <RelatedTools currentTool="butterfly" />
    </>
  );
}
