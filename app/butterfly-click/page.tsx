import ButterflyClickTest from "../../components/ButterflyClickTest";
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
  return (
    <>
      <ButterflyClickTest />
      <ClickTechniqueGuide variant="butterfly" />
      <RelatedTools currentTool="butterfly" />
    </>
  );
}
