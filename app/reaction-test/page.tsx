import ReactionTest from "../../components/ReactionTest";
import RelatedTools from "../../components/RelatedTools";
import { Metadata } from "next";
import { Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Reaction Time Test (ms) | Visual Response Test",
  description:
    "Measure browser-based visual response time by clicking when the screen changes. Results depend on your device, display and browser.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/reaction-test" },
  openGraph: {
    title: "Reaction Time Test (ms) | Visual Response Test",
    description: "Measure browser-based visual response time by clicking when the screen changes. Results depend on your device, display and browser.",
    url: "https://geometrydashspam.cc/reaction-test",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Reaction Time Test (ms) | Visual Response Test",
    description: "Measure browser-based visual response time by clicking when the screen changes. Results depend on your device, display and browser.",
  },
};

export default function ReactionTestPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          VISUAL RESPONSE PRACTICE
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">REACTION TIME TEST</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Wait for the visual cue, then click as quickly as you can.
        </p>
      </div>
      <ReactionTest />
      <section className="mx-auto mt-12 max-w-4xl space-y-8 pb-12">
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 md:p-12">
          <h2 className="mb-6 flex items-center gap-3 text-3xl font-display font-bold text-white">
            <Eye className="h-8 w-8 text-green-500" /> How to use this reaction test
          </h2>
          <div className="space-y-4 leading-relaxed text-slate-300">
            <p>This page measures the time between a browser visual cue and the input event that reaches the page. The result includes your response plus delay from the display, input device, operating system and browser.</p>
            <p>Use several attempts on the same setup and compare your own results. A single unusually fast or slow run is less useful than a repeatable range.</p>
            <p>Refresh rate can change how quickly a visual cue becomes visible, but the display frame interval is not the same thing as total end-to-end input latency.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <h3 className="mb-2 font-bold text-white">Keep the setup fixed</h3>
            <p className="text-sm leading-6 text-slate-400">Compare runs using the same device, browser, display and input method.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <h3 className="mb-2 font-bold text-white">Use multiple attempts</h3>
            <p className="text-sm leading-6 text-slate-400">Your local best is useful, but repeated results are more informative than one outlier.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <h3 className="mb-2 font-bold text-white">Treat it as a browser test</h3>
            <p className="text-sm leading-6 text-slate-400">The number is not a laboratory measurement of your nervous system or one hardware component.</p>
          </div>
        </div>
      </section>
      <RelatedTools currentTool="reaction" />
    </>
  );
}
