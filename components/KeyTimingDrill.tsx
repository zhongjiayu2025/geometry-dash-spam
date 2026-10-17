"use client";

import { useEffect, useRef, useState } from "react";
import { isInteractiveKeyboardTarget } from "../lib/inputTarget";

type Tap = { hold: number; release: number | null };
export default function KeyTimingDrill() {
  const [keyCode, setKeyCode] = useState("Space");
  const [running, setRunning] = useState(false);
  const [taps, setTaps] = useState<Tap[]>([]);
  const [message, setMessage] = useState("Select one key, then start a 20-tap series.");
  const count = useRef(0);
  useEffect(() => {
    if (!running) return;
    let downAt: number | null = null;
    let lastUp: number | null = null;
    let release: number | null = null;
    const down = (event: KeyboardEvent) => {
      if (event.code !== keyCode || event.repeat || downAt !== null || count.current >= 20 || isInteractiveKeyboardTarget(event.target)) return;
      event.preventDefault();
      const now = performance.now();
      release = lastUp === null ? null : now - lastUp;
      downAt = now;
    };
    const up = (event: KeyboardEvent) => {
      if (event.code !== keyCode || downAt === null || count.current >= 20) return;
      const now = performance.now();
      const tap = { hold: now - downAt, release };
      downAt = null;
      lastUp = now;
      count.current += 1;
      setTaps((previous) => [...previous, tap]);
      if (count.current === 20) { setRunning(false); setMessage("20 taps complete. Compare hold and release variation separately."); }
    };
    const interrupt = () => { setRunning(false); setMessage("Series interrupted by focus loss; partial taps remain visible. Start again for a comparable 20-tap series."); };
    const hidden = () => { if (document.hidden) interrupt(); };
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    window.addEventListener("blur", interrupt);
    document.addEventListener("visibilitychange", hidden);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", interrupt); document.removeEventListener("visibilitychange", hidden); };
  }, [running, keyCode]);
  const summary = (values: number[]) => {
    if (!values.length) return "N/A";
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const sd = values.length < 2 ? null : Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length);
    return `${mean.toFixed(0)}ms mean · ${sd === null ? "N/A" : `${sd.toFixed(0)}ms`} SD (${values.length} samples)`;
  };
  return <section className="mx-auto mt-8 max-w-4xl rounded-2xl border border-yellow-500/20 p-5 md:p-8">
    <h2 className="mb-3 text-2xl font-bold text-white">20-tap hold / release drill</h2>
    <p className="mb-4 text-sm leading-6 text-slate-300">Try to keep both your holds and gaps even at a comfortable pace. This series uses one fixed key. Hold is keydown → keyup; release gap is the previous keyup → next keydown. These are human input timings observed by the browser, not switch latency or debounce measurements.</p>
    <label className="mr-3 text-sm">Series key <select disabled={running} value={keyCode} onChange={(event) => setKeyCode(event.target.value)} className="rounded bg-slate-800 p-2"><option value="Space">Space</option><option value="ArrowUp">Up arrow</option><option value="KeyZ">Z</option></select></label>
    <button disabled={running} onClick={(event) => { event.currentTarget.blur(); count.current = 0; setTaps([]); setMessage("Tap and release the selected key 20 times."); setRunning(true); }} className="mt-3 rounded-lg bg-yellow-400 px-4 py-2 font-bold text-slate-950 disabled:opacity-50">Start 20-tap series</button>
    {running && <button onClick={() => { setRunning(false); setMessage("Stopped. Start a new series to reset these taps."); }} className="ml-3 underline">Stop series</button>}
    <p className="my-4 text-sm text-yellow-200" role="status">{taps.length}/20 · {message}</p>
    <p className="text-sm text-slate-300">Hold: {summary(taps.map((tap) => tap.hold))}</p>
    <p className="text-sm text-slate-300">Release: {summary(taps.flatMap((tap) => tap.release === null ? [] : [tap.release]))}</p>
    <p className="my-3 text-xs leading-5 text-slate-400">For this site’s normal-gravity wave, longer holds relative to gaps move the path upward; Mini magnifies the slope. If mean hold and gap are similar but SD differs, work on the less stable half. The first tap has no preceding release sample.</p>
    {!!taps.length && <div className="overflow-x-auto"><table className="w-full text-left font-mono text-xs"><caption className="sr-only">Hold and release durations for this series</caption><thead><tr><th className="p-2">Tap</th><th className="p-2">Hold</th><th className="p-2">Prior release gap</th></tr></thead><tbody>{taps.map((tap,index) => <tr key={index} className="border-t border-white/10"><td className="p-2">{index+1}</td><td className="p-2">{tap.hold.toFixed(0)}ms</td><td className="p-2">{tap.release === null ? "N/A" : `${tap.release.toFixed(0)}ms`}</td></tr>)}</tbody></table></div>}
  </section>;
}
