import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#020617] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <Link href="/" className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                <img src="/logo.svg" alt="Geometry Dash Spam Logo" className="w-6 h-6 rounded-md" />
                <span className="font-display font-bold text-slate-300">GEOMETRY DASH SPAM</span>
              </Link>
              <p className="text-slate-400 text-xs font-mono max-w-xs">
                The ultimate training toolkit for Geometry Dash players. Master the wave, improve CPS, and break your limits.
              </p>
              <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">4.9/5 RATING (12.5K RUNS)</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-medium">
                <Link href="/about" className="hover:text-white transition-colors">About</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
              </div>
              <p className="text-slate-500 text-[10px] font-mono text-center md:text-right">
                &copy; 2026 GEOMETRYDASHSPAM.CC<br/>
                NOT AFFILIATED WITH ROBTOP GAMES.
              </p>
            </div>
        </div>
      </div>
    </footer>
  );
}