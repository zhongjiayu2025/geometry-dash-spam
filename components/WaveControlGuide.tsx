import { DIFFICULTY_CONFIGS, WAVE_SPEED_Y } from "../constants";
import { WAVE_PRESETS } from "../data/wavePresets";

export default function WaveControlGuide() {
  const normalSpeed = WAVE_SPEED_Y * 60;
  const drift = normalSpeed * (0.15 - 0.05);

  return (
    <section aria-labelledby="wave-control-lab" className="space-y-6 rounded-2xl border border-blue-500/20 bg-blue-950/10 p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Inside this browser trainer</p>
      <h2 id="wave-control-lab" className="text-2xl font-bold text-white">Same CPS, different wave path</h2>
      <p className="text-sm leading-7 text-slate-300">
        A click counter records when a press starts. The wave also responds to how long you keep holding it.
        In this simulator, holding moves upward and releasing moves downward at the same speed.
        Five evenly spaced presses per second can still send you into the ceiling if every hold lasts longer than its release.
      </p>
      <figure className="rounded-xl border border-white/10 bg-slate-950 p-4">
        <svg viewBox="0 0 640 400" role="img" aria-labelledby="wave-duty-title wave-duty-desc" className="h-auto w-full">
          <title id="wave-duty-title">Two five-CPS inputs with different hold times</title>
          <desc id="wave-duty-desc">A schematic of three press-release cycles. Holding for 100 milliseconds and releasing for 100 returns to the same height. Holding for 150 and releasing for 50 drifts upward each cycle. Both register one press every 200 milliseconds.</desc>
          <g fill="#cbd5e1" fontSize="15" fontFamily="sans-serif">
            <text x="16" y="28">5 CPS: hold 100 ms / release 100 ms</text>
            <text x="16" y="178">5 CPS: hold 150 ms / release 50 ms</text>
          </g>
          <g stroke="#334155" strokeDasharray="4 5">
            <path d="M20 110 H620 M20 374 H620" />
          </g>
          <polyline points="20,110 120,60 220,110 320,60 420,110 520,60 620,110" fill="none" stroke="#38bdf8" strokeWidth="4" />
          <polyline points="20,374 170,299 220,324 370,249 420,274 570,199 620,224" fill="none" stroke="#fbbf24" strokeWidth="4" />
          <g fill="#94a3b8" fontSize="12" fontFamily="sans-serif">
            <text x="20" y="133">0 ms</text><text x="198" y="133">200 ms</text><text x="398" y="133">400 ms</text><text x="576" y="133">600 ms</text>
          </g>
        </svg>
        <figcaption className="mt-3 text-xs leading-6 text-slate-400">
          Schematic input paths on a flat corridor, not a recorded player run. Both have equally spaced press starts;
          the second spends 75% of each cycle rising. A high click-interval consistency score cannot detect that hold/release imbalance.
        </figcaption>
      </figure>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-bold text-white">Check the arithmetic</h3>
          <p className="text-sm leading-7 text-slate-300">
            Normal wave speed is {WAVE_SPEED_Y} canvas pixels per nominal 60 Hz step, or {normalSpeed} pixels per second
            of simulation time. A 100 ms hold rises {(normalSpeed * 0.1).toFixed(1)} pixels; a 100 ms release falls the same amount.
            A 150/50 ms cycle instead rises a net {drift.toFixed(1)} pixels. Mini Wave multiplies vertical speed by 1.5,
            so the same imbalance produces {(drift * 1.5).toFixed(1)} pixels of upward drift per cycle.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-bold text-white">Try it before chasing a higher CPS</h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-300">
            <li>Choose Easy with Mini Wave and Endless off. Start a run and alternate short holds with equally long releases.</li>
            <li>Keep the press cadence similar but hold a little longer. Watch whether the path climbs.</li>
            <li>If you keep hitting the upper wall, release earlier. If you keep hitting the lower wall, hold slightly longer.</li>
          </ol>
        </div>
      </div>
      <h3 className="font-bold text-white">What each preset actually changes</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="mb-3 text-left text-xs leading-6 text-slate-400">Values from this trainer&apos;s configuration. Horizontal speed uses nominal 60 Hz steps; gap is the base opening before pattern-specific adjustments and player clearance.</caption>
          <thead className="border-b border-white/20 text-slate-200"><tr><th className="p-3">Preset</th><th className="p-3">Speed</th><th className="p-3">Base gap</th><th className="p-3">Modes</th></tr></thead>
          <tbody className="divide-y divide-white/10 text-slate-300">
            {WAVE_PRESETS.map((preset) => {
              const config = DIFFICULTY_CONFIGS[preset.difficulty];
              return <tr key={preset.id}>
                <th className="p-3 font-semibold"><a className="text-blue-400 hover:underline" href={`#drill-${preset.id}`}>{preset.label}</a></th>
                <td className="p-3">{config.speed} px / step</td>
                <td className="p-3">{preset.mini ? config.gap * 0.8 : config.gap} px</td>
                <td className="p-3">{preset.mini ? "Mini · " : "Normal · "}{preset.endless ? "Endless" : "15s goal"}</td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs leading-6 text-slate-400">
        These numbers explain this site&apos;s own movement model, not official Geometry Dash physics.
        The runtime caps long frame gaps, so simulation time can advance more slowly than wall time on a stalled device.
        Moving corridors require a changing balance; equal holds and releases are a flat-corridor exercise, not a way to clear every section.
      </p>
    </section>
  );
}
