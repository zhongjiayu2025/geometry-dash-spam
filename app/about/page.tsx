import { AboutPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Geometry Dash Spam",
  description:
    "Learn what GeometryDashSpam.cc is, how its browser training tools work and how practice metrics and sourced ranking data are handled.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <AboutPage />;
}
