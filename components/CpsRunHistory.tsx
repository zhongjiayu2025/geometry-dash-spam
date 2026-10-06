"use client";

type CpsRun = {
  duration: number;
  clicks: number;
  cps: number;
  timestamp: number;
};

export default function CpsRunHistory({
  runs,
  selectedDuration,
}: {
  runs: CpsRun[];
  selectedDuration: number;
}) {
  const recentRuns = runs
    .filter((run) => run.duration === selectedDuration)
    .slice(0, 5);

  const recentAverage = recentRuns.length
    ? recentRuns.reduce((sum, run) => sum + run.cps, 0) / recentRuns.length
    : 0;

  return (
    <section className="mb-12 rounded-2xl border border-white/10 bg-slate-900/30 p-6 md:p-8">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-400">Local training history</p>
          <h2 className="text-2xl font-display font-bold text-white">Recent {selectedDuration}s CPS runs</h2>
        </div>
        {recentRuns.length > 0 && (
          <div className="text-sm text-slate-400">
            Last {recentRuns.length} average: <strong className="text-white">{recentAverage.toFixed(2)} CPS</strong>
          </div>
        )}
      </div>

      {recentRuns.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {recentRuns.map((run, index) => (
            <div key={`${run.timestamp}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-slate-500">Run {index + 1}</div>
              <div className="mt-1 font-mono text-2xl font-bold text-white">{run.cps.toFixed(2)}</div>
              <div className="text-xs font-semibold text-blue-400">CPS</div>
              <div className="mt-2 text-xs text-slate-500">{run.clicks} clicks</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-6 text-slate-400">
          No saved {selectedDuration}-second runs yet. Complete this duration to add one to your private browser history.
        </p>
      )}
    </section>
  );
}
