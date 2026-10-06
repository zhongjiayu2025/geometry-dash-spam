import SpacebarCounter from "../../components/SpacebarCounter";
import Breadcrumbs from "../../components/Breadcrumbs";
import SpacebarGuide from "../../components/SpacebarGuide";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";
import RelatedTools from "../../components/RelatedTools";
import InputToolGuide from "../../components/InputToolGuide";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spacebar CPS Test | 10 Second Spacebar Counter",
  description:
    "Take a 10-second spacebar CPS test, count key presses and compare press speed across repeated runs. Browser results are not direct hardware-latency measurements.",
  alternates: { canonical: "/spacebar-counter" },
  openGraph: {
    title: "Spacebar CPS Test | 10 Second Spacebar Counter",
    description: "Take a 10-second spacebar CPS test, count key presses and compare press speed across repeated runs. Browser results are not direct hardware-latency measurements.",
    url: "https://geometrydashspam.cc/spacebar-counter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spacebar CPS Test | 10 Second Spacebar Counter",
    description: "Take a 10-second spacebar CPS test, count key presses and compare press speed across repeated runs. Browser results are not direct hardware-latency measurements.",
  },
};

export default function SpacebarCounterPage() {
  return (
    <>
      <ToolWebApplicationSchema
        name="Spacebar Counter"
        path="/spacebar-counter"
        description="Take a 10-second spacebar CPS test, count key presses and compare press speed across repeated runs. Browser results are not direct hardware-latency measurements."
      />
      <Breadcrumbs items={[{ label: "Spacebar Counter", href: "/spacebar-counter", active: true }]} />
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          KEY PRESS SPEED
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">SPACEBAR CPS TEST</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Run a 10-second spacebar counter and compare presses per second across repeated runs.
        </p>
      </div>
      <SpacebarCounter />
      <SpacebarGuide />
      <InputToolGuide tool="spacebar" />
      <RelatedTools currentTool="spacebar" />
    </>
  );
}
