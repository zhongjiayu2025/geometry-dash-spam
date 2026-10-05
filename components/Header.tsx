"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Activity, BookOpen, ChevronDown, Gamepad2, KeyRound, Keyboard, Menu, MousePointer2, Trophy, X } from "lucide-react";

const coreItems = [
  { href: "/", label: "Spam Test", icon: Gamepad2 },
  { href: "/geometry-dash-wave", label: "Wave", icon: Activity },
  { href: "/cps-test", label: "CPS Test", icon: MousePointer2 },
  { href: "/demon-list", label: "Demon List", icon: Trophy },
  { href: "/geometry-dash-codes", label: "Codes", icon: KeyRound },
  { href: "/blog", label: "Guides", icon: BookOpen },
];

const moreItems = [
  ["/geometry-dash-clicker", "Geometry Dash Clicker"],
  ["/geometry-dash-difficulty-faces", "Difficulty Faces"],
  ["/geometry-dash-vault-of-secrets-codes", "Vault of Secrets Codes"],
  ["/jitter-click", "Jitter Click"],
  ["/butterfly-click", "Butterfly Click"],
  ["/drag-click", "Drag Click"],
  ["/spacebar-counter", "Spacebar Counter"],
  ["/polling-rate", "Mouse Polling Rate"],
  ["/keyboard-latency", "Keyboard Latency"],
  ["/reaction-test", "Reaction Time"],
  ["/aim-trainer", "Aim Trainer"],
  ["/typing-test", "Typing Test"],
  ["/visual-memory", "Visual Memory"],
  ["/chimp-test", "Chimp Test"],
  ["/refresh-rate", "Refresh Rate"],
  ["/system-info", "System Info"],
] as const;

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 border-b border-white/5 bg-[#020617]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0" onClick={() => setMobileOpen(false)} aria-label="Geometry Dash Spam home">
          <Image src="/logo.svg" alt="Geometry Dash Spam logo" width={40} height={40} className="w-9 h-9 rounded-lg" priority />
          <div className="hidden sm:block">
            <div className="font-display font-bold text-white tracking-tight uppercase">Geometry Dash Spam</div>
            <div className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">Spam · Wave · CPS</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {coreItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive(href) ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
            <button onClick={() => setMoreOpen((v) => !v)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5" aria-haspopup="true" aria-expanded={moreOpen}>
              <Keyboard className="w-4 h-4" />
              More Tools
              <ChevronDown className="w-3 h-3" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full pt-2 w-56">
                <div className="grid bg-[#0b1021] border border-white/10 rounded-xl p-2 shadow-2xl">
                  {moreItems.map(([href, label]) => (
                    <Link key={href} href={href} className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5">{label}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <button className="lg:hidden p-2 text-slate-300" onClick={() => setMobileOpen((v) => !v)} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 max-h-[82vh] overflow-y-auto border-b border-white/10 bg-[#0b1021] p-4 shadow-2xl">
          <div className="grid gap-1">
            {coreItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive(href) ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5"}`}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="px-4 mb-2 text-xs uppercase tracking-widest text-slate-500">More Tools</p>
              {moreItems.map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">{label}</Link>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2">
              <Link href="/about" onClick={() => setMobileOpen(false)} className="text-center p-2 text-sm text-slate-500 hover:text-white">About</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-center p-2 text-sm text-slate-500 hover:text-white">Contact</Link>
              <Link href="/sitemap" onClick={() => setMobileOpen(false)} className="text-center p-2 text-sm text-slate-500 hover:text-white">Sitemap</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
