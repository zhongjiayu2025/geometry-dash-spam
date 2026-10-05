import { ContactPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Geometry Dash Spam",
  description:
    "Contact GeometryDashSpam.cc for bug reports, ranking corrections, source updates and feature suggestions.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <ContactPage />;
}
