import KeyboardLatencyTest from "../../components/KeyboardLatencyTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyboard Key Timing Test | Key Press Duration Utility",
  description:
    "Measure browser-observed key press and release timing. This is not a laboratory keyboard latency measurement.",
  alternates: { canonical: "/keyboard-latency" },
};

export default function KeyboardLatencyPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          BROWSER KEY TIMING
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">KEYBOARD KEY TIMING</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Inspect keydown-to-keyup timing reported by the browser; results include human hold time and browser scheduling.
        </p>
      </div>
      <KeyboardLatencyTest />
    </>
  );
}
