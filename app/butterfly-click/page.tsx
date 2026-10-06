import type { Metadata } from "next";
import ButterflyClickTest from "../../components/ButterflyClickTest";
import Breadcrumbs from "../../components/Breadcrumbs";
import ClickTestHero from "../../components/ClickTestHero";
import RelatedTools from "../../components/RelatedTools";
import ClickTechniqueGuide from "../../components/ClickTechniqueGuide";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";

const description =
  "Take a 10-second butterfly click test and measure two-finger CPS, click count and repeatability. Compare several runs on the same mouse and setup.";

export const metadata: Metadata = {
  title: "Butterfly Click Test | 10 Second CPS Test",
  description,
  alternates: { canonical: "/butterfly-click" },
  openGraph: {
    title: "Butterfly Click Test | 10 Second CPS Test",
    description,
    url: "https://geometrydashspam.cc/butterfly-click",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Butterfly Click Test | 10 Second CPS Test",
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
