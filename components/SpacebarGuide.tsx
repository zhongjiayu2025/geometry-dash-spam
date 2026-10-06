import { Keyboard } from "lucide-react";

export default function SpacebarGuide() {
  return (
    <section className="defer-render space-y-8 pb-12">
      <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 md:p-12">
        <h2 className="mb-6 flex items-center gap-3 text-3xl font-display font-bold text-white">
          <Keyboard className="h-8 w-8 text-purple-500" aria-hidden="true" />
          Spacebar spam as a separate input skill
        </h2>
        <div className="space-y-4 leading-relaxed text-slate-300">
          <p>
            Some players prefer a keyboard key while others prefer a mouse button. The useful comparison is personal: which input lets you keep a repeatable rhythm without losing control?
          </p>
          <p>
            This test counts registered spacebar presses over ten seconds. It does not measure switch actuation distance, keyboard scan rate or end-to-end hardware latency.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
          <h3 className="mb-2 font-bold text-white">Compare the same duration</h3>
          <p className="text-sm leading-6 text-slate-400">Use repeated 10-second runs when comparing keyboards or techniques.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
          <h3 className="mb-2 font-bold text-white">Separate speed from hardware specs</h3>
          <p className="text-sm leading-6 text-slate-400">Actuation force, travel and scan behavior vary by exact keyboard and switch implementation.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
          <h3 className="mb-2 font-bold text-white">Stop if it hurts</h3>
          <p className="text-sm leading-6 text-slate-400">Repeated high-effort pressing can become uncomfortable; take breaks instead of forcing longer sessions.</p>
        </div>
      </div>
    </section>
  );
}
