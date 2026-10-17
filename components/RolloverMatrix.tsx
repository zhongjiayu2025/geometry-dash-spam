"use client";

import { useEffect, useRef, useState } from "react";
import { isInteractiveKeyboardTarget } from "../lib/inputTarget";

const chords = [
  ["Space", "ArrowUp"],
  ["KeyA", "KeyD", "Space"],
  ["KeyZ", "KeyX", "Space"],
  ["KeyW", "KeyA", "KeyS", "KeyD", "Space"],
];
const label = (keys: string[]) => keys.map((key) => key.replace(/^Key/, "")).join(" + ");
type Trial = { expected: string[]; observed: string[]; interrupted: boolean };

export default function RolloverMatrix() {
  const [selected, setSelected] = useState(0);
  const [armed, setArmed] = useState(false);
  const [trials, setTrials] = useState<Trial[]>([]);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!armed) return;
    const expected = chords[selected];
    const pressed = new Set<string>();
    let best: string[] = [];
    let started = false;
    let finished = false;
    const matched = (keys: string[]) => keys.filter((key) => expected.includes(key)).length;
    const finish = (interrupted = false) => {
      if (finished) return;
      finished = true;
      setArmed(false);
      if (started) setTrials((previous) => [{ expected, observed: best, interrupted }, ...previous].slice(0, 12));
    };
    finishRef.current = () => finish(true);
    const down = (event: KeyboardEvent) => {
      if (event.repeat || isInteractiveKeyboardTarget(event.target)) return;
      if (["Space", "ArrowUp"].includes(event.code)) event.preventDefault();
      started = true;
      pressed.add(event.code);
      const snapshot = [...pressed];
      if (matched(snapshot) > matched(best) || (matched(snapshot) === matched(best) && snapshot.length > best.length)) best = snapshot;
    };
    const up = (event: KeyboardEvent) => {
      pressed.delete(event.code);
      if (started && pressed.size === 0) finish();
    };
    const interrupt = () => finish(true);
    const hidden = () => { if (document.hidden) interrupt(); };
    const timer = window.setTimeout(interrupt, 15000);
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    window.addEventListener("blur", interrupt);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", interrupt);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [armed, selected]);

  return (
    <section className="mx-auto mt-8 max-w-4xl rounded-2xl border border-amber-500/20 bg-slate-900/40 p-5 md:p-8">
      <h2 className="mb-3 text-2xl font-bold text-white">Combination test matrix</h2>
      <p className="mb-4 text-sm leading-6 text-slate-300">Select a chord, start a trial, hold every expected key together, then release all keys. Each trial saves the best simultaneous snapshot, so separate taps cannot count as a successful chord. Repeat each combination three times.</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {chords.map((keys, index) => <button key={index} disabled={armed} onClick={() => setSelected(index)} aria-pressed={index === selected} className={`rounded-lg border px-3 py-2 text-sm disabled:opacity-50 ${index === selected ? "border-amber-400 bg-amber-900/40 text-white" : "border-white/10 text-slate-300"}`}>{label(keys)}</button>)}
      </div>
      <button disabled={armed} onClick={(event) => { event.currentTarget.blur(); setArmed(true); }} className="rounded-lg bg-amber-400 px-4 py-2 font-bold text-slate-950 disabled:opacity-50">Start combination trial</button>
      {armed && <button onClick={() => finishRef.current()} className="ml-3 rounded-lg border border-white/20 px-4 py-2">Cancel trial</button>}
      <p role="status" className="my-4 text-sm text-amber-200">{armed ? `Ready: hold ${label(chords[selected])} together, then release. Trial ends after 15 seconds or on focus loss.` : "Choose a combination to begin. Results stay in this tab only."}</p>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Observed simultaneous combinations in the latest twelve trials</caption><thead><tr className="text-slate-400"><th className="p-2">Expected</th><th className="p-2">Best simultaneous snapshot</th><th className="p-2">Result</th></tr></thead><tbody>
        {trials.map((trial, index) => {
          const missing = trial.expected.filter((key) => !trial.observed.includes(key));
          const extra = trial.observed.filter((key) => !trial.expected.includes(key));
          return <tr key={index} className="border-t border-white/10"><td className="p-2">{label(trial.expected)}</td><td className="p-2">{label(trial.observed) || "None"}</td><td className="p-2">{trial.interrupted ? "Interrupted — repeat" : missing.length ? `Not all seen: ${label(missing)}` : extra.length ? `All seen; extra: ${label(extra)}` : "All expected keys seen"}</td></tr>;
        })}
        {!trials.length && <tr><td colSpan={3} className="p-3 text-slate-500">No combination trials yet.</td></tr>}
      </tbody></table></div>
      {!!trials.length && <button className="mt-4 text-sm text-amber-300 underline" onClick={() => setTrials([])}>Clear matrix results</button>}
      <p className="mt-4 text-xs leading-5 text-slate-400">If a combination fails repeatedly, test each key alone, then add keys one at a time. A browser shortcut or incomplete overlap can also hide a key. A successful chord demonstrates that combination on this setup; it does not certify N-key rollover. These are diagnostic combinations, not required Geometry Dash bindings.</p>
    </section>
  );
}
