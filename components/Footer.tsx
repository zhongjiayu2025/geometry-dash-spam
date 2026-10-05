import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#020617] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/5">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/logo.svg" alt="Geometry Dash Spam logo" width={32} height={32} className="w-8 h-8 rounded-md" />
              <span className="font-display font-bold text-white">GEOMETRY DASH SPAM</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-lg mt-4">
              Free browser-based tools for practicing Geometry Dash spam, wave control and click consistency. This fan-made site is not affiliated with RobTop Games.
            </p>
          </div>
          <div>
            <h2 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Core</h2>
            <div className="grid gap-2 text-sm">
              <Link href="/" className="text-slate-400 hover:text-white">Spam Test</Link>
              <Link href="/geometry-dash-wave" className="text-slate-400 hover:text-white">Wave Trainer</Link>
              <Link href="/cps-test" className="text-slate-400 hover:text-white">CPS Test</Link>
              <Link href="/demon-list" className="text-slate-400 hover:text-white">Demon List</Link>
              <Link href="/geometry-dash-codes" className="text-slate-400 hover:text-white">Geometry Dash Codes</Link>
            </div>
          </div>
          <div>
            <h2 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Explore</h2>
            <div className="grid gap-2 text-sm">
              <Link href="/hardest-level" className="text-slate-400 hover:text-white">Hardest Level</Link>
              <Link href="/easiest-demons" className="text-slate-400 hover:text-white">Easiest Demons</Link>
              <Link href="/geometry-dash-vault-of-secrets-codes" className="text-slate-400 hover:text-white">Vault of Secrets Codes</Link>
              <Link href="/geometry-dash-clicker" className="text-slate-400 hover:text-white">Clicker</Link>
              <Link href="/blog" className="text-slate-400 hover:text-white">Guides</Link>
              <Link href="/about" className="text-slate-400 hover:text-white">About</Link>
              <Link href="/contact" className="text-slate-400 hover:text-white">Contact</Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} geometrydashspam.cc</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms</Link>
            <Link href="/sitemap" className="hover:text-slate-300">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
