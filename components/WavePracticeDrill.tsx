"use client";

import { Star } from "lucide-react";

export default function WavePracticeDrill({ onAccept }: { onAccept: () => void }) {
  return (
    <section className="w-full max-w-5xl mt-6 mb-8">
      <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 p-6 md:flex-row">
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-yellow-500/10 blur-[50px]" />

        <div className="relative z-10 flex items-start gap-4">
          <div className="rounded-lg bg-yellow-500/20 p-3 text-yellow-400">
            <Star className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-widest text-yellow-400">Practice Drill</div>
            <h3 className="mb-1 text-xl font-display font-bold text-white">15-Second Mini Wave Drill</h3>
            <p className="max-w-md text-sm text-slate-400">
              Practice goal: Survive <span className="font-bold text-white">15 seconds</span> on{" "}
              <span className="font-bold text-white">Insane</span> difficulty using{" "}
              <span className="font-bold text-white">Mini Wave</span>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAccept}
          className="relative z-10 flex items-center gap-2 rounded-lg bg-yellow-600 px-6 py-2 font-bold text-white shadow-lg shadow-yellow-900/20 transition-all hover:bg-yellow-500"
        >
          <Star className="h-4 w-4 fill-current" aria-hidden="true" />
          ACCEPT CHALLENGE
        </button>
      </div>
    </section>
  );
}
