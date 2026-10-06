import React from "react";
import { DEMONS, DEMON_SOURCE_URL, DEMON_VERIFIED_AT } from "../data/demons";
import DemonListFilterControls from "./DemonListFilterControls";

export default function DemonListTable() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-900/25 px-4 py-3 text-xs leading-5 text-slate-500 md:flex-row md:items-center md:justify-between">
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

      <DemonListFilterControls total={DEMONS.length} />

      <div
        id="demon-list-results"
        role="table"
        aria-label="Filtered Demon List"
        aria-rowcount={DEMONS.length}
        className="overflow-hidden rounded-xl border border-white/10"
      >
        <div
          role="row"
          className="hidden grid-cols-[72px_minmax(0,2fr)_minmax(0,1.2fr)_110px] bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-500 md:grid"
        >
          <div role="columnheader" className="px-4 py-3">Rank</div>
          <div role="columnheader" className="px-4 py-3">Level</div>
          <div role="columnheader" className="px-4 py-3">Published by</div>
          <div role="columnheader" className="px-4 py-3">Difficulty</div>
        </div>

        <div role="rowgroup" className="divide-y divide-white/5">
          {DEMONS.map((item) => (
            <div
              key={item.rank}
              role="row"
              data-demon-row
              data-rank={item.rank}
              data-search={`${item.level} ${item.publisher}`.toLowerCase()}
              className="grid grid-cols-[52px_minmax(0,1fr)_auto] items-start gap-3 bg-slate-950/25 p-4 md:grid-cols-[72px_minmax(0,2fr)_minmax(0,1.2fr)_110px] md:items-center md:gap-0 md:p-0"
            >
              <div role="cell" className="font-mono text-sm font-bold text-blue-400 md:px-4 md:py-4">
                #{item.rank}
              </div>
              <div role="cell" className="min-w-0 md:px-4 md:py-4">
                <div className="break-words font-semibold text-white">{item.level}</div>
                <div className="mt-1 text-xs text-slate-500 md:hidden">by {item.publisher}</div>
              </div>
              <div role="cell" className="hidden text-slate-400 md:block md:px-4 md:py-4">
                {item.publisher}
              </div>
              <div role="cell" className="justify-self-end rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-1 text-[10px] font-semibold text-purple-300 md:justify-self-stretch md:rounded-none md:border-0 md:bg-transparent md:px-4 md:py-4 md:text-sm">
                {item.difficulty}
              </div>
            </div>
          ))}

          <div id="demon-list-empty-state" role="row" hidden>
            <div role="cell" className="bg-slate-950/25 px-4 py-8 text-center text-sm text-slate-500">
              No matching demon found in this top-50 snapshot.
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs leading-5 text-slate-500">
        This is a dated snapshot of Pointercrate&apos;s Main List, not a permanent ranking. The live source remains authoritative when positions change.
      </p>
    </div>
  );
}
