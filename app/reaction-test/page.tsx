import ReactionTest from "../../components/ReactionTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reaction Time Test (ms) | Visual Response Test",
  description:
    "Measure browser-based visual response time by clicking when the screen changes. Results depend on your device, display and browser.",
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
    </>
  );
}
