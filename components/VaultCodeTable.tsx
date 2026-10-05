"use client";

import React, { useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import type { VaultCode } from "../data/vaultCodes";

export default function VaultCodeTable({
  codes,
  label,
}: {
  codes: VaultCode[];
  label: string;
}) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return codes;
    return codes.filter(
      (item) =>
        item.code.toLowerCase().includes(value) ||
        item.reward.toLowerCase().includes(value) ||
        item.note?.toLowerCase().includes(value)
    );
  }, [codes, query]);

  const copyCode = async (code: string) => {
    if (code.includes("→") || code.startsWith("your ")) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="space-y-4">
      <label className="relative block">
        <span className="sr-only">Search {label}</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${label.toLowerCase()}…`}
          className="w-full rounded-xl border border-white/10 bg-black/25 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/60"
        />
      </label>

      <div className="overflow-hidden rounded-xl border border-white/10">
        {filtered.map((item) => {
          const canCopy = !item.code.includes("→") && !item.code.startsWith("your ");
          return (
            <div
              key={item.code}
              className="grid gap-3 border-b border-white/5 bg-slate-950/25 p-4 last:border-b-0 md:grid-cols-[minmax(180px,0.8fr)_1fr_auto] md:items-center"
            >
              <code className="break-all font-mono text-sm font-bold text-blue-300">{item.code}</code>
              <div>
                <div className="text-sm font-semibold text-white">{item.reward}</div>
                {item.note && <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p>}
              </div>
              <button
                type="button"
                onClick={() => copyCode(item.code)}
                disabled={!canCopy}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label={canCopy ? `Copy code ${item.code}` : `Code ${item.code} requires manual entry`}
              >
                {copied === item.code ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                {copied === item.code ? "Copied" : "Copy"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
