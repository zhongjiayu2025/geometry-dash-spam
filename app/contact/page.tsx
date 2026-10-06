import { ContactPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Geometry Dash Spam",
  description:
    "Contact GeometryDashSpam.cc for bug reports, ranking corrections, source updates and feature suggestions.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Geometry Dash Spam",
    description: "Contact GeometryDashSpam.cc for bug reports, ranking corrections, source updates and feature suggestions.",
    url: "https://geometrydashspam.cc/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Geometry Dash Spam",
    description: "Contact GeometryDashSpam.cc for bug reports, ranking corrections, source updates and feature suggestions.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://geometrydashspam.cc/contact#page",
    url: "https://geometrydashspam.cc/contact",
    name: "Contact Geometry Dash Spam",
    description:
      "Contact GeometryDashSpam.cc for bug reports, ranking corrections, source updates and feature suggestions.",
    dateModified: "2026-10-07",
    inLanguage: "en",
    isPartOf: { "@id": "https://geometrydashspam.cc/#website" },
    about: { "@id": "https://geometrydashspam.cc/#organization" },
    publisher: { "@id": "https://geometrydashspam.cc/#organization" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ContactPage />
    </>
  );
}
