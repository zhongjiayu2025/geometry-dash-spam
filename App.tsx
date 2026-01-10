import React, { useState, useEffect } from 'react';
import WaveSimulator from './components/WaveSimulator';
import CpsTest from './components/CpsTest';
import JitterClickTest from './components/JitterClickTest';
import ButterflyClickTest from './components/ButterflyClickTest';
import RightClickTest from './components/RightClickTest';
import SpacebarCounter from './components/SpacebarCounter';
import ReactionTest from './components/ReactionTest';
import BlogList from './components/BlogList';
import BlogPostReader from './components/BlogPost.tsx';
import { AboutPage, ContactPage, PrivacyPage, TermsPage } from './components/InfoPages';
import { BLOG_POSTS, BlogPost } from './data/blogContent';
import { Gamepad2, MousePointer2, Keyboard, Timer, Menu, X, Zap, BookOpen, ChevronDown, Activity, Fingerprint, Mouse } from 'lucide-react';

type View = 'game' | 'cps' | 'jitter' | 'butterfly' | 'rightClick' | 'spacebar' | 'reaction' | 'blog' | 'article' | 'about' | 'contact' | 'privacy' | 'terms';

// --- SEO & ROUTING CONFIGURATION ---

// 1. Metadata for HTML Head
const VIEW_METADATA: Record<string, { title: string; desc: string }> = {
  game: {
    title: "Geometry Dash Spam Test | Ultimate Wave Simulator & Physics",
    desc: "Master the wave with the most accurate Geometry Dash Spam Simulator. Replicates 2.2 physics, gravity, and mini-wave mechanics. Test your consistency now."
  },
  cps: {
    title: "CPS Test 10 Seconds | Check Clicking Speed - Geometry Dash",
    desc: "How fast can you click? Take the 10-second CPS test designed for gamers. Measure your raw clicking speed and compare with pros."
  },
  jitter: {
    title: "Jitter Click Test & Tutorial | Master Arm Vibration",
    desc: "Learn how to Jitter Click safely. Test your arm vibration speed and improve your CPS for Geometry Dash and Minecraft PVP."
  },
  butterfly: {
    title: "Butterfly Click Test | Double Clicking Speed Trainer",
    desc: "Test your Butterfly Clicking technique. The ultimate double-finger clicking test for high CPS. Optimize your mouse grip today."
  },
  rightClick: {
    title: "Right Click CPS Test | RMB Speed Tester",
    desc: "Don't neglect your right mouse button. Test your Right Click CPS speed. Essential for MOBA players and specialized bridging techniques."
  },
  spacebar: {
    title: "Spacebar Counter & Speed Test | Keyboard Latency Check",
    desc: "Test your spacebar spamming speed. precise counter with timer. Check your keyboard latency and mechanical switch performance."
  },
  reaction: {
    title: "Reaction Time Test | Visual Reflex Benchmark (ms)",
    desc: "Test your visual reaction time in milliseconds. Are you faster than a pro gamer? The average human reaction time is 250ms."
  },
  blog: {
    title: "Geometry Dash Guides, Tips & Hardware Reviews | GD Spam Blog",
    desc: "Expert guides on improving Wave consistency, choosing the best mouse for Geometry Dash, and understanding game physics."
  },
  about: { title: "About Us | Geometry Dash Spam Test", desc: "Our mission to build the best training tools for the Geometry Dash community." },
  contact: { title: "Contact Us | Feature Requests & Support", desc: "Get in touch with the GeometryDashSpam.cc team." },
  privacy: { title: "Privacy Policy", desc: "How we handle your data." },
  terms: { title: "Terms of Service", desc: "Usage agreements." },
};

// 2. Path Mapping for Clean URLs (SEO Friendly)
const PATH_MAP: Record<View, string> = {
    game: '/',
    cps: '/cps-test',
    jitter: '/jitter-click',
    butterfly: '/butterfly-click',
    rightClick: '/right-click',
    spacebar: '/spacebar-counter',
    reaction: '/reaction-test',
    blog: '/blog',
    article: '/blog/', // Prefix for articles
    about: '/about',
    contact: '/contact',
    privacy: '/privacy',
    terms: '/terms'
};

// Helper to find View from current Path
const getViewFromPath = (path: string): { view: View; slug?: string } => {
    if (path === '/' || path === '') return { view: 'game' };
    
    // Handle Blog Articles (/blog/some-slug)
    if (path.startsWith('/blog/') && path.length > 6) {
        const slug = path.replace('/blog/', '');
        return { view: 'article', slug };
    }

    // Exact matches
    const entry = Object.entries(PATH_MAP).find(([key, val]) => val === path);
    if (entry) return { view: entry[0] as View };

    // Fallback
    return { view: 'game' };
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cpsDropdownOpen, setCpsDropdownOpen] = useState(false);
  
  // Initialize State from URL Path
  const initialRoute = typeof window !== 'undefined' ? getViewFromPath(window.location.pathname) : { view: 'game' as View };
  
  const [currentView, setCurrentView] = useState<View>(initialRoute.view);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(() => {
    if (initialRoute.view === 'article' && initialRoute.slug) {
        return BLOG_POSTS.find(p => p.slug === initialRoute.slug) || null;
    }
    return null;
  });

  // --- ROUTING ENGINE ---
  
  // Function to handle internal navigation
  const navigate = (view: View, post?: BlogPost) => {
    setCurrentView(view);
    if (post) setCurrentPost(post);
    setMobileMenuOpen(false);
    
    // Construct new URL
    let newPath = PATH_MAP[view];
    if (view === 'article' && post) {
        newPath = `/blog/${post.slug}`;
    }

    // Push to history
    window.history.pushState({ view, slug: post?.slug }, '', newPath);
    window.scrollTo(0, 0);
  };

  // Effect to handle SEO Title/Meta updates and Browser Back Button
  useEffect(() => {
    // 1. Update Document Title & Meta
    let meta = VIEW_METADATA[currentView];
    if (currentView === 'article' && currentPost) {
        document.title = `${currentPost.title} | GD Spam Blog`;
        const metaDescTag = document.querySelector('meta[name="description"]');
        if (metaDescTag) metaDescTag.setAttribute('content', currentPost.excerpt);
    } else if (meta) {
        document.title = meta.title;
        const metaDescTag = document.querySelector('meta[name="description"]');
        if (metaDescTag) metaDescTag.setAttribute('content', meta.desc);
    }

    // 2. Update Canonical Tag
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', window.location.href);

  }, [currentView, currentPost]);

  // Handle Browser Back/Forward Buttons (PopState)
  useEffect(() => {
      const handlePopState = () => {
          const route = getViewFromPath(window.location.pathname);
          setCurrentView(route.view);
          if (route.view === 'article' && route.slug) {
              const post = BLOG_POSTS.find(p => p.slug === route.slug);
              if (post) setCurrentPost(post);
          }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'game': return <WaveSimulator />;
      case 'cps': return <CpsTest />;
      case 'jitter': return <JitterClickTest />;
      case 'butterfly': return <ButterflyClickTest />;
      case 'rightClick': return <RightClickTest />;
      case 'spacebar': return <SpacebarCounter />;
      case 'reaction': return <ReactionTest />;
      case 'blog': return <BlogList onReadPost={(post) => navigate('article', post)} />;
      case 'article': return currentPost ? <BlogPostReader post={currentPost} onBack={() => navigate('blog')} onNavigate={(view) => navigate(view)} /> : <BlogList onReadPost={(post) => navigate('article', post)} />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'privacy': return <PrivacyPage />;
      case 'terms': return <TermsPage />;
      default: return <WaveSimulator />;
    }
  };

  // Navigation Link Component
  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => {
    const isActive = (currentView === view || (currentView === 'article' && view === 'blog'));
    const href = PATH_MAP[view];

    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          navigate(view);
        }}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm tracking-wide
          ${isActive 
            ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10' 
            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
        `}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-500 shadow-[0_0_8px_#3b82f6] rounded-full"></span>
        )}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        
        {/* Dynamic Glow based on View */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[120px] opacity-15 transition-colors duration-1000
          ${currentView === 'game' ? 'bg-blue-600' : ''}
          ${['cps', 'jitter', 'butterfly', 'rightClick'].includes(currentView) ? 'bg-cyan-600' : ''}
          ${currentView === 'spacebar' ? 'bg-purple-600' : ''}
          ${currentView === 'reaction' ? 'bg-green-600' : ''}
          ${['blog','article','about','contact'].includes(currentView) ? 'bg-indigo-600' : ''}
          ${['privacy','terms'].includes(currentView) ? 'bg-slate-600' : ''}
        `}></div>
        
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent"></div>
      </div>

      {/* HEADER MENU */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Logo */}
          <a 
            href="/"
            className="flex items-center gap-3 cursor-pointer group"
            onClick={(e) => { e.preventDefault(); navigate('game'); }}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/50 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-lg md:text-xl text-white tracking-tight leading-none uppercase">
                Geometry Dash Spam
              </div>
              <span className="text-[10px] md:text-xs text-blue-400 font-mono tracking-widest uppercase">
                Ultimate Wave Test
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavItem view="game" icon={Gamepad2} label="Wave Sim" />
            
            {/* Click Tests Dropdown */}
            <div className="relative" onMouseLeave={() => setCpsDropdownOpen(false)}>
              <button
                className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm tracking-wide
                  ${['cps', 'jitter', 'butterfly', 'rightClick'].includes(currentView)
                    ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
                `}
                onMouseEnter={() => setCpsDropdownOpen(true)}
                onClick={() => setCpsDropdownOpen(!cpsDropdownOpen)}
              >
                <MousePointer2 className={`w-4 h-4 ${['cps', 'jitter', 'butterfly', 'rightClick'].includes(currentView) ? 'text-blue-400' : 'text-slate-500'}`} />
                Click Tests
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>
              
              {cpsDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-48 z-50 animate-in fade-in slide-in-from-top-2">
                   <div className="bg-[#0b1021] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1">
                       <button onClick={() => { navigate('cps'); setCpsDropdownOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                          <MousePointer2 className="w-4 h-4 text-blue-400" /> Standard CPS
                       </button>
                       <button onClick={() => { navigate('jitter'); setCpsDropdownOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                          <Activity className="w-4 h-4 text-orange-400" /> Jitter Click
                       </button>
                       <button onClick={() => { navigate('butterfly'); setCpsDropdownOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                          <Fingerprint className="w-4 h-4 text-pink-400" /> Butterfly Click
                       </button>
                       <button onClick={() => { navigate('rightClick'); setCpsDropdownOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                          <Mouse className="w-4 h-4 text-emerald-400" /> Right Click
                       </button>
                   </div>
                </div>
              )}
            </div>

            <NavItem view="spacebar" icon={Keyboard} label="Spacebar" />
            <NavItem view="reaction" icon={Timer} label="Reflexes" />
            <div className="w-px h-8 bg-white/10 mx-2"></div>
            <NavItem view="blog" icon={BookOpen} label="Blog & Guides" />
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#0b1021] border-b border-white/10 p-4 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
            <NavItem view="game" icon={Gamepad2} label="Wave Simulator" />
            <div className="py-2 px-2 border-y border-white/5 my-1">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Click Speed Tests</p>
               <NavItem view="cps" icon={MousePointer2} label="Standard CPS Test" />
               <NavItem view="jitter" icon={Activity} label="Jitter Click Test" />
               <NavItem view="butterfly" icon={Fingerprint} label="Butterfly Click Test" />
               <NavItem view="rightClick" icon={Mouse} label="Right Click Test" />
            </div>
            <NavItem view="spacebar" icon={Keyboard} label="Spacebar Counter" />
            <NavItem view="reaction" icon={Timer} label="Reaction Time" />
            <NavItem view="blog" icon={BookOpen} label="Blog & Guides" />
            <div className="h-px bg-white/10 my-2"></div>
            <button onClick={() => { navigate('about'); }} className="px-4 py-2 text-slate-400 text-left hover:text-white">About Us</button>
            <button onClick={() => { navigate('contact'); }} className="px-4 py-2 text-slate-400 text-left hover:text-white">Contact</button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow pt-24 md:pt-32 pb-12 px-4 w-full max-w-7xl mx-auto">
        {/* Page Title & Breadcrumbs */}
        {['game', 'cps', 'spacebar', 'reaction', 'blog'].includes(currentView) && (
          <div className="mb-8 md:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                SYSTEM ONLINE
             </div>
             <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-2xl uppercase">
                {currentView === 'game' && "GEOMETRY DASH SPAM TEST"}
                {currentView === 'cps' && "CLICK SPEED TEST"}
                {currentView === 'spacebar' && "SPACEBAR COUNTER"}
                {currentView === 'reaction' && "REACTION TEST"}
                {currentView === 'blog' && "LATEST INSIGHTS"}
             </h1>
             <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                {currentView === 'game' && "Master the wave mechanic. Improve consistency. Survive the spam."}
                {currentView === 'cps' && "Measure your raw clicking speed over a 10-second interval."}
                {currentView === 'spacebar' && "Test your keyboard latency and spamming capability."}
                {currentView === 'reaction' && "Test your visual reflex speed. Wait for green, then click."}
                {currentView === 'blog' && "Expert guides, hardware reviews, and strategy for Geometry Dash players."}
             </p>
          </div>
        )}

        {/* Tool Container */}
        <div className="w-full">
           {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#020617] mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex flex-col gap-2">
               <a href="/" className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" onClick={(e) => { e.preventDefault(); navigate('game'); }}>
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span className="font-display font-bold text-slate-300">GEOMETRY DASH SPAM</span>
               </a>
               <p className="text-slate-600 text-xs font-mono max-w-xs">
                 The ultimate training toolkit for Geometry Dash players. Master the wave, improve CPS, and break your limits.
               </p>
             </div>
             
             <div className="flex flex-col items-center md:items-end gap-4">
               <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-medium">
                  <a href="/about" onClick={(e) => { e.preventDefault(); navigate('about'); }} className="hover:text-white transition-colors">About</a>
                  <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('contact'); }} className="hover:text-white transition-colors">Contact</a>
                  <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('privacy'); }} className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('terms'); }} className="hover:text-white transition-colors">Terms of Service</a>
               </div>
               <p className="text-slate-700 text-[10px] font-mono text-center md:text-right">
                  &copy; 2026 GEOMETRYDASHSPAM.CC<br/>
                  NOT AFFILIATED WITH ROBTOP GAMES.
               </p>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}