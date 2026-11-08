import Link from "next/link";

export default function HomeChallengeBrief() {
  return (
    <section aria-labelledby="challenge-brief" className="mx-auto mb-5 max-w-5xl rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-5 md:p-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-300">Play the challenge</p>
      <h2 id="challenge-brief" className="mb-3 text-2xl font-bold text-white">15-Second Spam Challenge</h2>
      <p className="mb-4 text-sm leading-7 text-slate-300">Stay inside the corridor for 15 seconds. This is an independent browser practice game, not an official Geometry Dash level. For a useful baseline, keep the same difficulty and input method across attempts.</p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg bg-black/20 p-4"><h3 className="font-semibold text-white">1 · Learn the movement</h3><p className="mt-1 text-sm leading-6 text-slate-400">Choose Easy. Hold to rise, release to fall, and practice a controlled rhythm.</p></div>
        <div className="rounded-lg bg-black/20 p-4"><h3 className="font-semibold text-white">2 · Complete three runs</h3><p className="mt-1 text-sm leading-6 text-slate-400">Use identical settings so the results are comparable.</p></div>
        <div className="rounded-lg bg-black/20 p-4"><h3 className="font-semibold text-white">3 · Compare your records</h3><p className="mt-1 text-sm leading-6 text-slate-400">Review survival time, registered CPS and timing variation.</p></div>
      </div>
      <p className="mt-4 text-sm text-slate-400">Why can equal CPS create different paths?{" "}<Link href="/geometry-dash-wave#rhythm-lab" className="font-semibold text-cyan-300 hover:underline">Try the Wave Rhythm Lab</Link>.</p>
    </section>
  );
}
