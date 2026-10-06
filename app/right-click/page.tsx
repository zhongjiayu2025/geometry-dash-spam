import type { Metadata } from "next";
import RightClickTest from "../../components/RightClickTest";
import Breadcrumbs from "../../components/Breadcrumbs";
import ClickTestHero from "../../components/ClickTestHero";
import RelatedTools from "../../components/RelatedTools";
import InputToolGuide from "../../components/InputToolGuide";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";

const description =
  "Measure right-mouse-button clicks per second with a simple browser-based RMB speed test.";

export const metadata: Metadata = {
  title: "Right Click CPS Test | RMB Click Speed Test",
  description,
  alternates: { canonical: "/right-click" },
  openGraph: {
    title: "Right Click CPS Test | RMB Click Speed Test",
    description,
    url: "https://geometrydashspam.cc/right-click",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Right Click CPS Test | RMB Click Speed Test",
    description,
  },
};

export default function RightClickPage() {
  return (
    <>
      <ToolWebApplicationSchema
        name="Right Click CPS Test"
        path="/right-click"
        description={description}
      />
      <Breadcrumbs items={[{ label: "Right Click", href: "/right-click", active: true }]} />
      <ClickTestHero variant="rightClick" />
      <RightClickTest />
      <InputToolGuide tool="right-click" />
      <RelatedTools currentTool="rightClick" />
    </>
  );
}
