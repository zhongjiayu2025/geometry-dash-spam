import type { WaveRun } from "../lib/waveStorage";

type Props = {
  mode: string;
  runs: WaveRun[];
  onReset: () => void;
  isPlaying: boolean;
};

export default function SpamRunComparison({ mode, runs, onReset, isPlaying }: Props) {
  const first = runs[0];
  const latest = runs[2];
  let feedback = "Finish three attempts with the same input method and settings. Keep the game window the same size.";
  if (first && latest) {
    if (latest.averageCps > first.averageCps && latest.time < first.time) {
      feedback = "Your last attempt was faster but ended sooner. Try your first attempt’s pace again and make smaller corrections.";
    } else if (latest.result === "won") {
      feedback = "Your last attempt reached the time goal. Repeat at the same pace to see whether you can reproduce it.";
    } else if (latest.time > first.time) {
      feedback = "Your last attempt lasted longer. Try repeating that rhythm before changing the difficulty.";
    } else {
      feedback = "The last attempt did not last longer. If you keep hitting the same wall, practice hold and release timing in the Wave Trainer.";
    }
  }

  return (
    <section id="spam-run-comparison" aria-labelledby="spam-run-heading" className="mt-6 w-full max-w-5xl scroll-mt-20 rounded-2xl border border-blue-500/20 bg-slate-900/35 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="spam-run-heading" className="text-xl font-bold text-white">Compare three spam runs</h2>
          <p className="text-sm text-slate-400">{mode} · This page session</p>
        </div>
        <button type="button" onClick={onReset} disabled={isPlaying || runs.length === 0} className="rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-200 disabled:opacity-40">
          Clear comparison
        </button>
      </div>
      {runs.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[350px] text-left text-sm text-slate-300">
            <caption className="sr-only">Latest completed attempts for the selected settings</caption>
            <thead className="border-b border-white/15">
              <tr>
                <th scope="col" className="p-2">Attempt</th>
                <th scope="col" className="p-2">Time</th>
                <th scope="col" className="p-2">Average CPS</th>
                <th scope="col" className="p-2">Timing spread</th>
                <th scope="col" className="p-2">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run, index) => (
                <tr key={index} className="border-b border-white/10">
                  <th scope="row" className="p-2">{index + 1}</th>
                  <td className="p-2">{run.time.toFixed(2)} s</td>
                  <td className="p-2">{run.averageCps.toFixed(2)}</td>
                  <td className="p-2">{run.timingSd === null ? "—" : `${run.timingSd} ms`}</td>
                  <td className="p-2">{run.result === "won" ? "Goal reached" : "Collision"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p role="status" className="mt-4 text-sm leading-6 text-slate-200">{runs.length}/3. {feedback}</p>
      <p className="mt-2 text-xs leading-5 text-slate-400">
        Timing spread measures variation between presses. A lower value means more evenly spaced presses.
        A dash means there were too few presses to calculate it.
        {" "}<a href="/geometry-dash-wave#wave-control-lab" className="text-blue-400 underline">Practice hold and release</a>
      </p>
    </section>
  );
}
