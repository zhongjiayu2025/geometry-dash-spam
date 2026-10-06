"use client";

import { useCallback, useEffect, useState } from "react";

type RangeFilter = "all" | "top10" | "top25" | "26to50";

const RANGE_OPTIONS: Array<[RangeFilter, string]> = [
  ["all", "All 50"],
  ["top10", "Top 10"],
  ["top25", "Top 25"],
  ["26to50", "#26–50"],
];

export default function DemonListFilterControls({ total }: { total: number }) {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<RangeFilter>("all");
  const [visibleCount, setVisibleCount] = useState(total);

  const applyFilters = useCallback(() => {
    const value = query.trim().toLowerCase();
    const rows = Array.from(
      document.querySelectorAll<HTMLElement>("[data-demon-row]")
    );

    let count = 0;

    for (const row of rows) {
      const rank = Number(row.dataset.rank || "0");
      const search = row.dataset.search || "";

      const matchesQuery = !value || search.includes(value);
      const matchesRange =
        range === "all" ||
        (range === "top10" && rank <= 10) ||
        (range === "top25" && rank <= 25) ||
        (range === "26to50" && rank >= 26 && rank <= 50);

      const visible = matchesQuery && matchesRange;
      row.hidden = !visible;
      if (visible) count++;
    }

    const emptyState = document.getElementById("demon-list-empty-state");
    if (emptyState) emptyState.hidden = count !== 0;

    const table = document.getElementById("demon-list-results");
    if (table) table.setAttribute("aria-rowcount", String(count));

    setVisibleCount(count);
  }, [query, range]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <>
      <div className="rounded-xl border border-white/10 bg-slate-900/35 p-4">
        <label className="block">
          <span className="sr-only">Search demon list</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search level or publisher…"
            aria-controls="demon-list-results"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/60"
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          {RANGE_OPTIONS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setRange(value)}
              aria-pressed={range === value}
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

      <p className="text-xs text-slate-500" role="status" aria-live="polite">
        Showing {visibleCount} of {total} ranked levels.
      </p>
    </>
  );
}
