import BpmTapper from "../../components/BpmTapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BPM Tapper | Rhythm & Beat Finder",
  description:
    "Tap along with a song to estimate its beats per minute and practice steady rhythm.",
  alternates: { canonical: "/bpm-tapper" },
};

export default function BpmTapperPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          RHYTHM TOOL
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">BPM TAPPER</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Tap to the rhythm to estimate beats per minute.
        </p>
      </div>
      <BpmTapper />
    </>
  );
}
