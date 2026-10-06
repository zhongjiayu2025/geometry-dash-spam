import RightClickTest from "../../components/RightClickTest";
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
    card: "summary",
    title: "Right Click CPS Test | RMB Click Speed Test",
    description: "Measure right-mouse-button clicks per second with a simple browser-based RMB speed test.",
  },
};

export default function RightClickPage() {
  return (
    <>
      <RightClickTest />
      <InputToolGuide tool="right-click" />
          <RelatedTools currentTool="rightClick" />
</>
  );
}
