import type { Metadata } from "next";
import ButterflyClickTest from "../../components/ButterflyClickTest";
import Breadcrumbs from "../../components/Breadcrumbs";
import ClickTestHero from "../../components/ClickTestHero";
import RelatedTools from "../../components/RelatedTools";
import ClickTechniqueGuide from "../../components/ClickTechniqueGuide";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";

const description =
  "Practice butterfly clicking and compare two-finger click speed and consistency in your browser.";

export const metadata: Metadata = {
  title: "Butterfly Click Test | Two-Finger CPS Practice",
  description,
  alternates: { canonical: "/butterfly-click" },
  openGraph: {
    title: "Butterfly Click Test | Two-Finger CPS Practice",
    description,
    url: "https://geometrydashspam.cc/butterfly-click",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Butterfly Click Test | Two-Finger CPS Practice",
    description,
  },
};

export default function ButterflyClickPage() {
  return (
    <>
      <ToolWebApplicationSchema
        name="Butterfly Click Test"
        path="/butterfly-click"
        description={description}
      />
      <Breadcrumbs items={[{ label: "Butterfly Click", href: "/butterfly-click", active: true }]} />
      <ClickTestHero variant="butterfly" />
      <ButterflyClickTest />
      <ClickTechniqueGuide variant="butterfly" />
      <RelatedTools currentTool="butterfly" />
    </>
  );
}
