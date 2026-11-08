export default function WaveTrainerLoading() {
  return (
    <section role="status" aria-live="polite" className="flex min-h-[330px] w-full max-w-5xl flex-col justify-center gap-4 rounded-xl border border-cyan-500/20 bg-slate-950 p-5 text-slate-300 sm:aspect-video md:min-h-[500px] md:p-8">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-300">Preparing the interactive trainer</p>
        <h3 className="mb-2 text-xl font-bold text-white">Hold to rise, release to fall</h3>
        <p className="max-w-2xl text-sm leading-7">While the wave game loads, learn its controls: hold Space, Up, mouse or touch to rise; release to descend. Repeated input matters only when the path stays controlled.</p>
      </div>
      <svg viewBox="0 0 640 155" role="img" aria-labelledby="loading-title loading-desc" className="h-auto w-full max-w-2xl">
        <title id="loading-title">Wave control example</title>
        <desc id="loading-desc">Alternating rising and falling movement inside a schematic corridor, not a recorded game run.</desc>
        <rect x="8" y="12" width="624" height="130" rx="12" fill="#0f172a" stroke="#334155"/>
        <path d="M8 34 H632 M8 122 H632" stroke="#334155" strokeDasharray="8 9"/>
        <polyline points="24,103 92,49 160,103 228,49 296,103 364,49 432,103 500,49 568,103 615,65" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round"/>
      </svg>
      <div className="grid gap-3 text-xs leading-5 sm:grid-cols-3">
        <p><strong className="text-white">1. Select a preset.</strong> Begin with Easy.</p>
        <p><strong className="text-white">2. Start a run.</strong> Alternate press and release.</p>
        <p><strong className="text-white">3. Review evidence.</strong> Compare survival, CPS and timing.</p>
      </div>
    </section>
  );
}
