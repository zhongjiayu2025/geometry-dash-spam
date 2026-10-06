import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import RelatedTools from "./RelatedTools";

export default function CpsGuide() {
  return (
    <div className="defer-render">
      <section className="mb-12 rounded-2xl border border-blue-500/20 bg-blue-900/10 p-6 md:p-8">
        <h2 className="mb-4 text-2xl font-display font-bold text-white">How is CPS Calculated?</h2>
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="rounded-xl border border-white/5 bg-black/30 p-6 font-mono text-sm text-slate-300">
            <p className="mb-2">
              <span className="text-blue-400">CPS</span> ={" "}
              <span className="text-green-400">Total Clicks</span> /{" "}
              <span className="text-yellow-400">Time (seconds)</span>
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Example:<br />
              If you click 60 times in 5 seconds,<br />
              60 / 5 = 12 CPS.
            </p>
          </div>
          <div className="leading-relaxed text-slate-300">
            <p className="mb-2">
              <strong>CPS</strong> stands for <em>Clicks Per Second</em>. It measures how quickly a person can register repeated mouse or keyboard inputs.
            </p>
            <p>
              For <strong className="text-white">Geometry Dash</strong> practice, average CPS and click timing answer different questions.
              Use short modes for bursts and longer 30s or 60s modes to compare whether your pace stays repeatable.
            </p>
          </div>
        </div>
      </section>

      <Link
        href="/blog/how-to-improve-cps-geometry-dash"
        className="group relative mb-12 block overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-900/40 to-slate-900/40 p-6 transition-colors hover:border-blue-400/50 md:p-8"
      >
        <div aria-hidden="true" className="absolute right-0 top-0 h-full w-1/3 bg-blue-500/10 blur-[50px] transition-colors group-hover:bg-blue-500/20" />
        <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> Recommended Guide
            </div>
            <h2 className="font-display text-2xl font-bold text-white group-hover:text-blue-200">
              Improve CPS Without Losing Click Consistency
            </h2>
            <p className="max-w-xl text-slate-400">
              Compare normal, jitter and butterfly clicking with repeatable test durations, then train the method that stays most consistent for you.
            </p>
          </div>
          <div aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/50 transition-transform group-hover:translate-x-2 group-hover:scale-110">
            <ArrowRight className="h-6 w-6" />
          </div>
        </div>
      </Link>

      <RelatedTools currentTool="cps" />
    </div>
  );
}
