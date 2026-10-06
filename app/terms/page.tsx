import { TermsPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using GeometryDashSpam.cc browser tools, practice measurements, sourced guides and external links.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use",
    description: "Terms for using GeometryDashSpam.cc browser tools, practice measurements, sourced guides and external links.",
    url: "https://geometrydashspam.cc/terms",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use",
    description: "Terms for using GeometryDashSpam.cc browser tools, practice measurements, sourced guides and external links.",
  },
};

export default function Page() {
  return <TermsPage />;
}
