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
    card: "summary",
    title: "Contact Geometry Dash Spam",
    description: "Contact GeometryDashSpam.cc for bug reports, ranking corrections, source updates and feature suggestions.",
  },
};

export default function Page() {
  return <ContactPage />;
}
