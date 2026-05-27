"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Gamepad2, MousePointer2, Keyboard, Timer, Menu, X, BookOpen, ChevronDown, Activity, Fingerprint, Mouse, Target, Trophy, BrainCircuit } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cpsDropdownOpen, setCpsDropdownOpen] = useState(false);
  const [keyboardDropdownOpen, setKeyboardDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        onClick={() => setMobileMenuOpen(false)}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm tracking-wide
          ${active 
            ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10' 
            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
        `}
      >
        <Icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-slate-500'}`} />
        {label}
        {active && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-500 shadow-[0_0_8px_#3b82f6] rounded-full"></span>
        )}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Geometry Dash Spam Home"
        >
          <Image 
            src="/logo.svg" 
            alt="Geometry Dash Spam Logo" 
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10 rounded-xl shadow-lg shadow-blue-[500]/20 group-hover:scale-110 transition-transform duration-300"
            referrerPolicy="no-referrer"
            priority
          />
          <div>
            <div className="font-display font-bold text-lg md:text-xl text-white tracking-tight leading-none uppercase">
              Geometry Dash Spam
            </div>
            <span className="text-[10px] md:text-xs text-blue-400 font-mono tracking-widest uppercase">
              Ultimate Wave Test
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <NavItem href="/" icon={Gamepad2} label="Wave Sim" />
          
          <div className="relative" onMouseLeave={() => setCpsDropdownOpen(false)}>
            <button
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm tracking-wide ${['/cps-test', '/jitter-click', '/butterfly-click', '/right-click', '/drag-click', '/scroll-test'].some(p => pathname.startsWith(p)) ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
              onMouseEnter={() => setCpsDropdownOpen(true)}
              onClick={() => setCpsDropdownOpen(!cpsDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={cpsDropdownOpen}
            >
              <MousePointer2 className={`w-4 h-4 ${['/cps-test', '/jitter-click', '/butterfly-click', '/right-click', '/drag-click', '/scroll-test'].some(p => pathname.startsWith(p)) ? 'text-blue-400' : 'text-slate-500'}`} />
              Click Tests
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            {cpsDropdownOpen && (
              <div className="absolute top-full left-0 pt-2 w-48 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-[#0b1021] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1">
                      <Link href="/cps-test" onClick={() => setCpsDropdownOpen(false)} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"><MousePointer2 className="w-4 h-4 text-blue-400" /> Standard CPS</Link>
                      <Link href="/jitter-click" onClick={() => setCpsDropdownOpen(false)} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"><Activity className="w-4 h-4 text-orange-400" /> Jitter Click</Link>
                      <Link href="/butterfly-click" onClick={() => setCpsDropdownOpen(false)} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"><Fingerprint className="w-4 h-4 text-pink-400" /> Butterfly Click</Link>
                      <Link href="/right-click" onClick={() => setCpsDropdownOpen(false)} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"><Mouse className="w-4 h-4 text-emerald-400" /> Right Click</Link>
                      <Link href="/drag-click" onClick={() => setCpsDropdownOpen(false)} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"><MousePointer2 className="w-4 h-4 text-purple-400" /> Drag Click</Link>
                      <Link href="/scroll-test" onClick={() => setCpsDropdownOpen(false)} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"><Activity className="w-4 h-4 text-indigo-400" /> Scroll Test</Link>
                      <Link href="/double-click" onClick={() => setCpsDropdownOpen(false)} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"><MousePointer2 className="w-4 h-4 text-fuchsia-400" /> Double Click</Link>
                      <Link href="/mouse-acceleration" onClick={() => setCpsDropdownOpen(false)} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"><Activity className="w-4 h-4 text-orange-400" /> Mouse Acceleration</Link>
                  </div>
              </div>
            )}
          </div>

          <NavItem href="/polling-rate" icon={Activity} label="Mouse Hz" />
          <NavItem href="/typing-test" icon={Keyboard} label="Typing Test" />
          
          <div 
             className="relative"
             onMouseEnter={() => setKeyboardDropdownOpen(true)}
             onMouseLeave={() => setKeyboardDropdownOpen(false)}
          >
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              <Keyboard className="w-4 h-4" />
              Keyboard
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            {keyboardDropdownOpen && (
              <div className="absolute top-full left-0 pt-2 w-48 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-[#0b1021] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1">
                      <Link href="/spacebar-counter" onClick={() => setKeyboardDropdownOpen(false)} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"><Keyboard className="w-4 h-4 text-blue-400" /> Spacebar Counter</Link>
                      <Link href="/key-rollover" onClick={() => setKeyboardDropdownOpen(false)} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"><Keyboard className="w-4 h-4 text-amber-400" /> Key Rollover Test</Link>
                      <Link href="/keyboard-ghosting" onClick={() => setKeyboardDropdownOpen(false)} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"><Keyboard className="w-4 h-4 text-orange-400" /> Keyboard Ghosting</Link>
                      <Link href="/keyboard-latency" onClick={() => setKeyboardDropdownOpen(false)} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"><Keyboard className="w-4 h-4 text-yellow-400" /> Keyboard Latency</Link>
                  </div>
              </div>
            )}
          </div>

          <NavItem href="/sound-reaction" icon={Timer} label="Audio Reflex" />
          <NavItem href="/aim-trainer" icon={Target} label="Aim Trainer" />
          <div className="w-px h-8 bg-white/10 mx-2"></div>
          <NavItem href="/dashboard" icon={Trophy} label="My Stats" />
          <NavItem href="/leaderboard" icon={Trophy} label="Global Leaderboards" />
          <NavItem href="/refresh-rate" icon={Activity} label="Refresh Rate (Hz)" />
          <NavItem href="/system-info" icon={Activity} label="System Info" />
          <NavItem href="/blog" icon={BookOpen} label="Guides" />
        </nav>
        <button 
          className="md:hidden p-2 text-slate-400 hover:text-white" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0b1021] border-b border-white/10 p-4 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
          <NavItem href="/" icon={Gamepad2} label="Wave Simulator" />
          <div className="py-2 px-2 border-y border-white/5 my-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Click Speed Tests</p>
              <NavItem href="/cps-test" icon={MousePointer2} label="Standard CPS Test" />
              <NavItem href="/jitter-click" icon={Activity} label="Jitter Click Test" />
              <NavItem href="/butterfly-click" icon={Fingerprint} label="Butterfly Click Test" />
              <NavItem href="/right-click" icon={Mouse} label="Right Click Test" />
              <NavItem href="/drag-click" icon={MousePointer2} label="Drag Click Test" />
              <NavItem href="/double-click" icon={MousePointer2} label="Double Click Test" />
              <NavItem href="/mouse-acceleration" icon={Activity} label="Mouse Acceleration Test" />
              <NavItem href="/scroll-test" icon={Activity} label="Scroll Speed Test" />
          </div>
          <NavItem href="/polling-rate" icon={Activity} label="Mouse Polling Rate (Hz)" />
          <NavItem href="/typing-test" icon={Keyboard} label="Typing Speed Test" />
          <NavItem href="/spacebar-counter" icon={Keyboard} label="Spacebar Counter" />
          <NavItem href="/key-rollover" icon={Keyboard} label="Key Rollover Test" />
          <NavItem href="/keyboard-ghosting" icon={Keyboard} label="Keyboard Ghosting" />
          <NavItem href="/keyboard-latency" icon={Keyboard} label="Keyboard Latency Test" />
          <NavItem href="/bpm-tapper" icon={Timer} label="BPM Tapper" />
          <NavItem href="/aim-trainer" icon={Target} label="Aim Trainer" />
          <NavItem href="/chimp-test" icon={BrainCircuit} label="Chimp Memory Test" />
          <NavItem href="/visual-memory" icon={BrainCircuit} label="Visual Memory Test" />
          <NavItem href="/sound-reaction" icon={Timer} label="Audio Reaction" />
          <NavItem href="/reaction-test" icon={Timer} label="Reaction Time" />
          <NavItem href="/dashboard" icon={Trophy} label="My Stats" />
          <NavItem href="/leaderboard" icon={Trophy} label="Global Leaderboards" />
          <NavItem href="/refresh-rate" icon={Activity} label="Refresh Rate (Hz)" />
          <NavItem href="/system-info" icon={Activity} label="System Info" />
          <NavItem href="/blog" icon={BookOpen} label="Blog & Guides" />
          <div className="h-px bg-white/10 my-2"></div>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-slate-400 text-left hover:text-white">About Us</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-slate-400 text-left hover:text-white">Contact</Link>
          <Link href="/sitemap" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-slate-400 text-left hover:text-white">Sitemap</Link>
        </div>
      )}
    </header>
  );
}