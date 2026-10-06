import RefreshRateTest from "../../components/RefreshRateTest";
import RelatedTools from "../../components/RelatedTools";
import { Metadata } from "next";
import { Info, Monitor } from "lucide-react";

export const metadata: Metadata = {
  title: "Refresh Rate Test | Browser Display Hz Estimate",
  description:
    "Estimate the display refresh cadence observed by requestAnimationFrame in your browser.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/refresh-rate" },
  openGraph: {
    title: "Refresh Rate Test | Browser Display Hz Estimate",
    description: "Estimate the display refresh cadence observed by requestAnimationFrame in your browser.",
    url: "https://geometrydashspam.cc/refresh-rate",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Refresh Rate Test | Browser Display Hz Estimate",
    description: "Estimate the display refresh cadence observed by requestAnimationFrame in your browser.",
  },
};

export default function RefreshRatePage() {
  return (
    <>
      <div className="mb-8 text-center">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3">
          <Monitor className="h-10 w-10 text-cyan-400" />
        </div>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
          Browser Refresh Rate Test
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
          Estimate the refresh cadence observed by requestAnimationFrame. The result reflects this browser session and can be affected by tab visibility, power saving and browser scheduling.
        </p>
      </div>
      <RefreshRateTest />
      <div className="mx-auto mb-16 mt-8 max-w-5xl rounded-2xl border border-white/5 bg-slate-900 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <Info className="mt-1 h-6 w-6 shrink-0 text-blue-400" />
          <div>
            <h2 className="mb-2 font-bold text-white">If the number is lower than expected</h2>
            <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-400">
              <li>Keep this tab visible and focused while the measurement stabilizes.</li>
              <li>Check the operating system&apos;s display refresh-rate setting.</li>
              <li>Browser power saving, laptop battery modes and background load can reduce animation cadence.</li>
              <li>Use the result as a browser-side estimate, not as proof of one hardware specification.</li>
            </ul>
          </div>
        </div>
      </div>
      <RelatedTools currentTool="refreshRate" />
    </>
  );
}
