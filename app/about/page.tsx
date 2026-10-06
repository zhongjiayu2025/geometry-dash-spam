import { AboutPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Geometry Dash Spam",
  description:
    "Learn what GeometryDashSpam.cc is, how its browser training tools work and how practice metrics and sourced ranking data are handled.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Geometry Dash Spam",
    description: "Learn what GeometryDashSpam.cc is, how its browser training tools work and how practice metrics and sourced ranking data are handled.",
    url: "https://geometrydashspam.cc/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Geometry Dash Spam",
    description: "Learn what GeometryDashSpam.cc is, how its browser training tools work and how practice metrics and sourced ranking data are handled.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://geometrydashspam.cc/about#page",
    url: "https://geometrydashspam.cc/about",
    name: "About Geometry Dash Spam",
    description:
      "How GeometryDashSpam.cc measures browser inputs, handles source-checked claims and separates fan-made practice tools from official Geometry Dash.",
    dateModified: "2026-10-07",
    inLanguage: "en",
    isPartOf: { "@id": "https://geometrydashspam.cc/#website" },
    about: { "@id": "https://geometrydashspam.cc/#organization" },
    publisher: { "@id": "https://geometrydashspam.cc/#organization" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <AboutPage />
    </>
  );
}
