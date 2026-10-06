import PollingRateTest from "../../components/PollingRateTest";
import RelatedTools from "../../components/RelatedTools";
import InputToolGuide from "../../components/InputToolGuide";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mouse Polling Rate Test | Browser Hz Estimate",
  description:
    "Estimate mouse pointer report frequency from browser events. Results can vary with hardware, operating system and browser scheduling.",
  alternates: { canonical: "/polling-rate" },
  openGraph: {
    title: "Mouse Polling Rate Test | Browser Hz Estimate",
    description: "Estimate mouse pointer report frequency from browser events. Results can vary with hardware, operating system and browser scheduling.",
    url: "https://geometrydashspam.cc/polling-rate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mouse Polling Rate Test | Browser Hz Estimate",
    description: "Estimate mouse pointer report frequency from browser events. Results can vary with hardware, operating system and browser scheduling.",
  },
};

export default function PollingRatePage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          BROWSER-OBSERVED REPORT RATE
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">MOUSE POLLING RATE TEST</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Estimate the rate at which pointer events reach this browser. Treat it as a diagnostic, not a laboratory USB measurement.
        </p>
      </div>
      <PollingRateTest />
      <InputToolGuide tool="polling-rate" />
          <RelatedTools currentTool="pollingRate" />
</>
  );
}
