"use client";
import { useState } from "react";
import { WAVE_SPEED_Y } from "../constants";

export default function WaveRhythmLab() {
  const [hold, setHold] = useState(100);
  const [release, setRelease] = useState(100);
  const [mini, setMini] = useState(false);
  const speed = WAVE_SPEED_Y * 60 * (mini ? 1.5 : 1);
  const period = hold + release;
  const cps = 1000 / period;
  const drift = speed * (hold - release) / 1000;
  let x = 24, y = 142;
  const points = [`${x},${y}`];
  for (let i = 0; i < 4; i++) {
    x += 148 * hold / period; y -= speed * hold / 1000 * 0.44;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    x += 148 * release / period; y += speed * release / 1000 * 0.44;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const direction = Math.abs(drift) < 0.001 ? "balanced" : drift > 0 ? "upward" : "downward";
  return (
    <section id="rhythm-lab" aria-labelledby="rhythm-title" className="mx-auto mb-7 max-w-5xl scroll-mt-28 rounded-2xl border border-cyan-500/25 bg-slate-900/40 p-5 md:p-7">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-cyan-300">Original interactive model</p>
      <h2 id="rhythm-title" className="mb-3 text-2xl font-bold text-white">Wave Rhythm Lab</h2>
      <p className="mb-6 text-sm leading-7 text-slate-300">Explore how a press/release rhythm moves the wave in our flat-corridor training model. Compare equal-pace inputs with different hold times before trying a live run.</p>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-5">
          <div><label htmlFor="rhythm-hold" className="mb-2 flex justify-between text-sm text-white"><span>Hold duration</span><output htmlFor="rhythm-hold" className="font-mono">{hold} ms</output></label><input id="rhythm-hold" type="range" min={40} max={180} step={10} value={hold} onChange={e=>setHold(Number(e.currentTarget.value))} className="w-full accent-cyan-400"/></div>
          <div><label htmlFor="rhythm-release" className="mb-2 flex justify-between text-sm text-white"><span>Release duration</span><output htmlFor="rhythm-release" className="font-mono">{release} ms</output></label><input id="rhythm-release" type="range" min={40} max={180} step={10} value={release} onChange={e=>setRelease(Number(e.currentTarget.value))} className="w-full accent-cyan-400"/></div>
          <label className="flex items-center gap-2 text-sm text-slate-200"><input type="checkbox" checked={mini} onChange={e=>setMini(e.currentTarget.checked)} className="accent-cyan-400"/> Mini Wave (1.5× vertical speed)</label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={()=>{setHold(100);setRelease(100);}} className="rounded border border-white/20 px-3 py-2 text-xs text-white hover:border-cyan-300">Balanced 100/100</button>
            <button type="button" onClick={()=>{setHold(150);setRelease(50);}} className="rounded border border-white/20 px-3 py-2 text-xs text-white hover:border-cyan-300">Rising 150/50</button>
            <button type="button" onClick={()=>{setHold(50);setRelease(150);}} className="rounded border border-white/20 px-3 py-2 text-xs text-white hover:border-cyan-300">Falling 50/150</button>
          </div>
        </div>
        <div>
          <figure className="rounded-lg border border-white/10 bg-slate-950 p-3">
            <svg viewBox="0 0 640 255" role="img" aria-labelledby="rhythm-graph-title rhythm-graph-desc" className="w-full">
              <title id="rhythm-graph-title">Four modeled press/release cycles</title>
              <desc id="rhythm-graph-desc">{hold} millisecond holds and {release} millisecond releases create a {direction} path.</desc>
              <rect x="12" y="17" width="616" height="216" rx="12" fill="#0f172a" stroke="#334155"/>
              <path d="M24 142 H616" stroke="#64748b" strokeDasharray="6 8"/>
              <polyline points={points.join(" ")} fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="24" cy="142" r="6" fill="#f8fafc"/>
              <text x="24" y="248" fontSize="12" fill="#94a3b8">Schematic path · four cycles · no obstacles</text>
            </svg>
            <figcaption className="mt-2 text-xs leading-6 text-slate-400">Calculated from this site's movement constant; not player-measured data or official game physics.</figcaption>
          </figure>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
            {[
              ["Cycle", period+" ms"],
              ["Press frequency", cps.toFixed(2)+" CPS"],
              ["Hold share", (hold/period*100).toFixed(0)+"%"],
              ["Drift/cycle", (drift>0?"+":"")+drift.toFixed(1)+" px"],
            ].map(([name,value])=><div key={name} className="rounded-lg bg-black/20 p-3"><p className="text-xs text-slate-400">{name}</p><p className="font-mono font-bold text-white">{value}</p></div>)}
          </div>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-slate-300"><strong className="text-white">Interpretation:</strong> {direction} drift. At a fixed cycle length, shifting time from release to hold changes the path without changing CPS. Compare the 100/100 and 150/50 presets; both use 200 ms cycles.</p>
      <p className="mt-2 text-xs leading-6 text-slate-400">Model formula: vertical speed = {WAVE_SPEED_Y} px per nominal 60 Hz step × 60 × {mini ? "1.5" : "1"}; drift = speed × (hold − release) / 1,000. Runtime frame caps and obstacles are omitted.</p>
    </section>
  );
}
