"use client";

import React, { useMemo, useState } from "react";
import { DEMONS, DEMON_SOURCE_URL, DEMON_VERIFIED_AT } from "../data/demons";

type RangeFilter = "all" | "top10" | "top25" | "26to50";

export default function DemonListTable() {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<RangeFilter>("all");

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();

    return DEMONS.filter((item) => {
      const matchesQuery =
        !value ||
        item.level.toLowerCase().includes(value) ||
        item.publisher.toLowerCase().includes(value);

      const matchesRange =
        range === "all" ||
        (range === "top10" && item.rank <= 10) ||
        (range === "top25" && item.rank <= 25) ||
        (range === "26to50" && item.rank >= 26 && item.rank <= 50);

      return matchesQuery && matchesRange;
    });
  }, [query, range]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-slate-900/35 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
            <div>Top 50 snapshot · checked {DEMON_VERIFIED_AT}</div>
            <a
              href={DEMON_SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Source: Pointercrate Demonlist
            </a>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            ["all", "All 50"],
            ["top10", "Top 10"],
            ["top25", "Top 25"],
            ["26to50", "#26–50"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setRange(value as RangeFilter)}
              className={
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors " +
                (range === value
                  ? "border-blue-400/60 bg-blue-500/15 text-blue-200"
                  : "border-white/10 bg-black/20 text-slate-500 hover:text-white")
              }
            >
              {label}
            </button>
          ))}
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
        This is a dated snapshot of Pointercrate&apos;s Main List, not a permanent ranking. The live source remains authoritative when positions change.
      </p>
    </div>
  );
}
