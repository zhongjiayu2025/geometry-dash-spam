import type { Metadata } from "next";
import JitterClickTest from "../../components/JitterClickTest";
import ClickTestHero from "../../components/ClickTestHero";
import Breadcrumbs from "../../components/Breadcrumbs";
import RelatedTools from "../../components/RelatedTools";
import ClickTechniqueGuide from "../../components/ClickTechniqueGuide";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";

const description =
  "Run a 10-second jitter click test and compare browser-registered CPS. Practice a rapid clicking technique without relying on claimed benchmark speeds.";

export const metadata: Metadata = {
  title: "Jitter Click Test | 10-Second CPS Practice",
  description,
  alternates: { canonical: "/jitter-click" },
  openGraph: {
    title: "Jitter Click Test | 10-Second CPS Practice",
    description,
    url: "https://geometrydashspam.cc/jitter-click",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jitter Click Test | 10-Second CPS Practice",
    description,
  },
};

export default function JitterClickPage() {
  return (
    <>
      <ToolWebApplicationSchema
        name="Jitter Click Test"
        path="/jitter-click"
        description={description}
      />
      <Breadcrumbs items={[{ label: "Jitter Click", href: "/jitter-click", active: true }]} />
      <ClickTestHero variant="jitter" />
      <JitterClickTest />
      <ClickTechniqueGuide variant="jitter" />
      <RelatedTools currentTool="jitter" />
    </>
  );
}
