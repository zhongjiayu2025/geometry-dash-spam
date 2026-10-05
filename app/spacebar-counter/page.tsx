import SpacebarCounter from "../../components/SpacebarCounter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spacebar Counter | Spacebar CPS & Press Speed Test",
  description:
    "Count spacebar presses and measure press speed in your browser. This is not a direct keyboard hardware-latency measurement.",
  alternates: { canonical: "/spacebar-counter" },
};

export default function SpacebarCounterPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          KEY PRESS SPEED
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">SPACEBAR COUNTER</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Count presses and compare spacebar speed across repeated runs.
        </p>
      </div>
      <SpacebarCounter />
    </>
  );
}
