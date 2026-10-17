"use client";

import { useEffect, useState } from "react";
import { PRACTICE_PLAN } from "../data/practicePlan";
import { readStorage, writeStorage } from "../lib/browserStorage";

type Entry = { done: boolean; note: string };
const KEY = "gd_spam_30_day_plan_v1";

export default function PracticePlanLog() {
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const value = JSON.parse(readStorage(KEY) || "{}");
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const clean: Record<string, Entry> = {};
        for (let day = 1; day <= 30; day++) {
          const entry = value[day];
          if (entry && typeof entry === "object") clean[day] = { done: entry.done === true, note: typeof entry.note === "string" ? entry.note.slice(0, 1000) : "" };
        }
        setEntries(clean);
      }
    } catch { /* Start with an empty log if storage was edited or unavailable. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) writeStorage(KEY, JSON.stringify(entries)); }, [entries, ready]);
  const update = (day: number, patch: Partial<Entry>) => {
    setEntries((previous) => {
      const next = { ...previous, [day]: { ...(previous[day] ?? { done: false, note: "" }), ...patch } };
      return next;
    });
  };
  const download = () => {
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = [["Day", "Focus", "Task", "Decision", "Done", "Your results"]];
    PRACTICE_PLAN.forEach(([focus, task, decision], index) => rows.push([String(index + 1), focus, task, decision, entries[index + 1]?.done ? "Yes" : "No", entries[index + 1]?.note || ""]));
    const blob = new Blob(["\uFEFF" + rows.map((row) => row.map(quote).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "geometry-dash-30-day-practice.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <section className="my-8">
    <h2 className="mb-3 text-2xl font-bold text-white">Your 30-day task list and log</h2>
    <p className="mb-4 text-sm text-slate-300">Use one row per session; the day number is a sequence, not a deadline. Notes save on this browser when local storage is available. Export a CSV to keep your own copy. Nothing in this log is uploaded by the practice tool.</p>
    <button onClick={download} disabled={!ready} className="mb-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Export 30-day log (CSV)</button>
    <p className="mb-4 text-sm text-blue-200" role="status">{Object.values(entries).filter((entry) => entry.done).length} / 30 days checked</p>
    <div className="space-y-3">{PRACTICE_PLAN.map(([focus, task, decision], index) => <article key={index} className="rounded-xl border border-white/10 bg-slate-900/30 p-4">
      <h3 className="mb-2 text-lg font-bold text-white">Day {index + 1}: {focus}</h3>
      <p className="mb-2 text-sm leading-6 text-slate-300">{task}</p>
      <p className="mb-3 text-sm leading-6 text-blue-200">Next step: {decision}</p>
      <label className="mb-3 flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" disabled={!ready} checked={entries[index + 1]?.done ?? false} onChange={(event) => update(index + 1, { done: event.target.checked })} /> Day {index + 1} done</label>
      <label className="block text-xs text-slate-400">Day {index + 1} results and setup<textarea rows={2} maxLength={1000} disabled={!ready} value={entries[index + 1]?.note ?? ""} onChange={(event) => update(index + 1, { note: event.target.value })} placeholder="Date · device · duration/preset · run series · first error · next change" className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 p-3 text-sm text-white" /></label>
    </article>)}</div>
  </section>;
}
