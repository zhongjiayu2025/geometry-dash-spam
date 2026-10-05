"use client";

import React, { useMemo, useState } from "react";
import { DEMONS, DEMON_SOURCE_URL, DEMON_VERIFIED_AT } from "../data/demons";

export default function DemonListTable() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return DEMONS;
    return DEMONS.filter(
      (item) =>
        item.level.toLowerCase().includes(value) ||
        item.publisher.toLowerCase().includes(value)
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between rounded-xl border border-white/10 bg-slate-900/35 p-4">
        <label className="flex-1">
          <span className="sr-only">Search demon list</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search level or publisher…"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/60"
          />
        </label>
        <div className="text-xs leading-5 text-slate-500 md:text-right">
          <div>Verified: {DEMON_VERIFIED_AT}</div>
          <a href={DEMON_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            Source: Pointercrate
          </a>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Published by</th>
              <th className="px-4 py-3">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.rank} className="border-t border-white/5 bg-slate-950/25">
                <td className="px-4 py-4 font-mono font-bold text-blue-400">#{item.rank}</td>
                <td className="px-4 py-4 font-semibold text-white">{item.level}</td>
                <td className="px-4 py-4 text-slate-400">{item.publisher}</td>
                <td className="px-4 py-4 text-purple-300">{item.difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs leading-5 text-slate-500">
        Rankings change as new levels enter the list. This snapshot shows when the data was checked and links to the live source rather than presenting the order as permanently fixed.
      </p>
    </div>
  );
}
