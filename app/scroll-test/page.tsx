import ScrollTest from "../../components/ScrollTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scroll Speed Test | Mouse Wheel Speed Test",
  description:
    "Measure browser-observed mouse-wheel scrolling speed during a timed test.",
  alternates: { canonical: "/scroll-test" },
};

export default function ScrollTestPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          MOUSE WHEEL TEST
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">SCROLL SPEED TEST</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Test how quickly your browser receives mouse-wheel input during the timed run.
        </p>
      </div>
      <ScrollTest />
    </>
  );
}
