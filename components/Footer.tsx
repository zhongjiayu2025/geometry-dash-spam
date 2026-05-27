import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#020617] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-8 border-b border-white/5 mb-8">
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity cursor-pointer">
                <Image src="/logo.svg" alt="Geometry Dash Spam Logo" width={32} height={32} className="w-8 h-8 rounded-md" referrerPolicy="no-referrer" />
                <span className="font-display font-bold text-white text-lg">GEOMETRY DASH SPAM</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                The ultimate training toolkit for Geometry Dash players. Master the wave, improve CPS, and break your limits with our science-backed click testing simulators.
              </p>
              <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">4.9/5 RATING (12.5K LIKES)</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
               <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">Popular Tests</h3>
               <Link href="/cps-test" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">CPS Test (Clicks Per Second)</Link>
               <Link href="/jitter-click" className="text-slate-400 hover:text-orange-400 text-sm transition-colors">Jitter Click Test</Link>
               <Link href="/butterfly-click" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">Butterfly Click Test</Link>
               <Link href="/drag-click" className="text-slate-400 hover:text-purple-400 text-sm transition-colors">Drag Click Test</Link>
               <Link href="/right-click" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">Right Click Test</Link>
               <Link href="/spacebar-counter" className="text-slate-400 hover:text-green-400 text-sm transition-colors">Spacebar Counter</Link>
            </div>

            <div className="flex flex-col gap-3">
               <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">Hardware & Reaction</h3>
               <Link href="/reaction-test" className="text-slate-400 hover:text-yellow-400 text-sm transition-colors">Reaction Time Test</Link>
               <Link href="/polling-rate" className="text-slate-400 hover:text-red-400 text-sm transition-colors">Mouse Polling Rate (Hz)</Link>
               <Link href="/double-click" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">Double Click Checker</Link>
               <Link href="/keyboard-ghosting" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Keyboard Ghosting Test</Link>
               <Link href="/aim-trainer" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Aim Trainer Utility</Link>
               <Link href="/blog" className="text-slate-400 hover:text-white text-sm transition-colors font-bold mt-2">Read The Blog →</Link>
            </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-slate-500 font-medium">
                <Link href="/about" className="hover:text-white transition-colors">About</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms Conditions</Link>
            </div>
            <p className="text-slate-600 text-xs font-mono text-center md:text-right">
                &copy; {new Date().getFullYear()} GEOMETRYDASHSPAM.CC<br/>
                NOT AFFILIATED WITH ROBTOP GAMES.
            </p>
        </div>
      </div>
    </footer>
  );
}