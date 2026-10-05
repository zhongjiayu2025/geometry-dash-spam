import { PrivacyPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how GeometryDashSpam.cc uses local browser storage, email information and third-party advertising services.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy",
    description: "Read how GeometryDashSpam.cc uses local browser storage, email information and third-party advertising services.",
    url: "https://geometrydashspam.cc/privacy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy",
    description: "Read how GeometryDashSpam.cc uses local browser storage, email information and third-party advertising services.",
  },
};

export default function Page() {
  return <PrivacyPage />;
}
