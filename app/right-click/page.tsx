import RightClickTest from "../../components/RightClickTest";
import Breadcrumbs from "../../components/Breadcrumbs";
import ClickTestHero from "../../components/ClickTestHero";
import RelatedTools from "../../components/RelatedTools";
import InputToolGuide from "../../components/InputToolGuide";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Right Click CPS Test | RMB Click Speed Test",
  description:
    "Measure right-mouse-button clicks per second with a simple browser-based RMB speed test.",
  alternates: { canonical: "/right-click" },
  openGraph: {
    title: "Right Click CPS Test | RMB Click Speed Test",
    description: "Measure right-mouse-button clicks per second with a simple browser-based RMB speed test.",
    url: "https://geometrydashspam.cc/right-click",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Right Click CPS Test | RMB Click Speed Test",
    description: "Measure right-mouse-button clicks per second with a simple browser-based RMB speed test.",
  },
};

export default function RightClickPage() {
  return (
    <>
            <Breadcrumbs items={[{ label: "Right Click", href: "/right-click", active: true }]} />
      <ClickTestHero variant="rightClick" />
      <RightClickTest />
      <InputToolGuide tool="right-click" />
          <RelatedTools currentTool="rightClick" />
</>
  );
}
