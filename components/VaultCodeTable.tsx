"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import type { VaultCode } from "../data/vaultCodes";

type Room = "the-vault" | "vault-of-secrets" | "chamber-of-time" | "wraith";
type StatusFilter = "all" | "untried" | "tried";

export default function VaultCodeTable({ codes, label, room }: {
  codes: VaultCode[];
  label: string;
  room: Room;
}) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [tried, setTried] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const key = "gd_vault_progress_v1_" + room;
  const validCodes = useMemo(() => new Set(codes.map(item => item.code)), [codes]);

  useEffect(() => {
    const reload = () => {
      try {
        const saved = JSON.parse(window.localStorage.getItem(key) || "[]");
        setTried(Array.isArray(saved) ? saved.filter((value): value is string => typeof value === "string" && validCodes.has(value)) : []);
      } catch {
        setTried([]);
      }
      setReady(true);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) reload();
    };
    reload();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, validCodes]);

  const marked = useMemo(() => new Set(tried.filter(code => validCodes.has(code))), [tried, validCodes]);
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return codes.filter(item => {
      const matchesText = !search || item.code.toLowerCase().includes(search) ||
        item.reward.toLowerCase().includes(search) || (item.note?.toLowerCase().includes(search) ?? false);
      const matchesStatus = filter === "all" || (filter === "tried" ? marked.has(item.code) : !marked.has(item.code));
      return matchesText && matchesStatus;
    });
  }, [codes, query, filter, marked]);

  const markCode = (code: string, checked: boolean) => {
    if (!validCodes.has(code)) return;
    const next = checked ? [...new Set([...tried, code])] : tried.filter(value => value !== code);
    setTried(next);
    try { window.localStorage.setItem(key, JSON.stringify(next)); }
    catch { /* In-memory interaction still works when storage is unavailable. */ }
  };

  const clear = () => {
    if (!window.confirm("Clear your tried-code checklist for " + label + "?")) return;
    setTried([]);
    try { window.localStorage.removeItem(key); } catch { /* Storage may be disabled. */ }
  };

  const copyCode = async (code: string) => {
    if (code.includes("→") || code.startsWith("your ")) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      window.setTimeout(() => setCopied(current => current === code ? null : current), 1500);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="space-y-4">
      <section aria-label={label + " personal progress"} className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white">Your code checklist</h3>
            <p className="mt-1 text-sm text-slate-300" aria-live="polite">
              {ready ? marked.size + " of " + codes.length + " marked as tried" : codes.length + " codes available"}
            </p>
          </div>
          <button type="button" onClick={clear} disabled={!ready || marked.size === 0}
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35">
            Clear this room
          </button>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0}
          aria-valuemax={codes.length} aria-valuenow={marked.size} aria-label={"Codes marked as tried in " + label}>
          <div className="h-full rounded-full bg-cyan-400 transition-all"
            style={{ width: (codes.length ? 100 * marked.size / codes.length : 0) + "%" }} />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-400">
          Tick codes you have personally tried. This does not redeem them, verify a reward,
          or access your game account. Progress is saved only in this browser, not uploaded.
        </p>
      </section>

      <label className="relative block">
        <span className="sr-only">Search {label}</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" aria-hidden="true" />
        <input value={query} onChange={event => setQuery(event.target.value)}
          placeholder={"Search " + label.toLowerCase() + "…"}
          className="w-full rounded-xl border border-white/10 bg-black/25 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/60" />
      </label>

      <div role="group" aria-label={"Filter " + label + " by tried status"} className="flex flex-wrap gap-2">
        {([["all", "All"], ["untried", "Not tried"], ["tried", "Tried"]] as const).map(([value, text]) => (
          <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value}
            className={"rounded-full border px-3 py-1.5 text-xs font-semibold " +
              (filter === value ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-100" : "border-white/10 text-slate-400 hover:text-white")}>
            {text}
          </button>
        ))}
      </div>
      <p role="status" aria-live="polite" className="text-xs text-slate-500">
        Showing {filtered.length} of {codes.length} codes in this room.
      </p>

      <div className="overflow-hidden rounded-xl border border-white/10">
        {filtered.length === 0 && (
          <p className="p-5 text-sm text-slate-300">No codes match the current search and progress filter.</p>
        )}
        {filtered.map(item => {
          const canCopy = !item.code.includes("→") && !item.code.startsWith("your ");
          return (
            <div key={item.code}
              className="grid gap-3 border-b border-white/5 bg-slate-950/25 p-4 last:border-b-0 md:grid-cols-[minmax(160px,0.8fr)_1fr_auto] md:items-center">
              <div className="min-w-0">
                <code className="break-all font-mono text-sm font-bold text-blue-300">{item.code}</code>
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                  <input type="checkbox" checked={marked.has(item.code)}
                    onChange={event => markCode(item.code, event.target.checked)}
                    className="h-4 w-4 accent-cyan-400" aria-label={"Mark " + item.code + " as tried"} />
                  Tried this code
                </label>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{item.reward}</div>
                {item.note && <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p>}
              </div>
              <button type="button" onClick={() => copyCode(item.code)} disabled={!canCopy}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label={canCopy ? "Copy code " + item.code : "Code " + item.code + " requires manual entry"}>
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
