import { PrivacyPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how GeometryDashSpam.cc uses local browser storage, email information and third-party advertising services.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <PrivacyPage />;
}
