import { TermsPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using GeometryDashSpam.cc browser tools, practice measurements, sourced guides and external links.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <TermsPage />;
}
