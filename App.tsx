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
import { AboutPage, ContactPage, PrivacyPage, TermsPage, SitemapPage } from './components/InfoPages';
import { BLOG_POSTS, BlogPost } from './data/blogContent';
import { Gamepad2, MousePointer2, Keyboard, Timer, Menu, X, Zap, BookOpen, ChevronDown, Activity, Fingerprint, Mouse, AlertOctagon, Map } from 'lucide-react';

type View = 'game' | 'cps' | 'jitter' | 'butterfly' | 'rightClick' | 'spacebar' | 'reaction' | 'blog' | 'article' | 'about' | 'contact' | 'privacy' | 'terms' | 'sitemap' | '404';

// --- SEO & ROUTING CONFIGURATION ---

interface SeoConfig {
    title: string;
    desc: string;
    schemaType?: string;
    image?: string; // Optional custom OG image
}

// 1. Metadata & Schema Configuration
const VIEW_METADATA: Record<string, SeoConfig> = {
  game: {
    title: "Geometry Dash Spam Test | Ultimate Wave Simulator & Physics",
    desc: "Master the wave with the most accurate Geometry Dash Spam Simulator. Replicates 2.2 physics, gravity, and mini-wave mechanics. Test your consistency now.",
    schemaType: "VideoGame"
  },
  cps: {
    title: "CPS Test 10 Seconds | Check Clicking Speed - Geometry Dash",
    desc: "How fast can you click? Take the 10-second CPS test designed for gamers. Measure your raw clicking speed and compare with pros.",
    schemaType: "WebApplication"
  },
  jitter: {
    title: "Jitter Click Test & Tutorial | Master Arm Vibration",
    desc: "Learn how to Jitter Click safely. Test your arm vibration speed and improve your CPS for Geometry Dash and Minecraft PVP.",
    schemaType: "HowTo"
  },
  butterfly: {
    title: "Butterfly Click Test | Double Clicking Speed Trainer",
    desc: "Test your Butterfly Clicking technique. The ultimate double-finger clicking test for high CPS. Optimize your mouse grip today.",
    schemaType: "HowTo"
  },
  rightClick: {
    title: "Right Click CPS Test | RMB Speed Tester",
    desc: "Don't neglect your right mouse button. Test your Right Click CPS speed. Essential for MOBA players and specialized bridging techniques.",
    schemaType: "WebApplication"
  },
  spacebar: {
    title: "Spacebar Counter & Speed Test | Keyboard Latency Check",
    desc: "Test your spacebar spamming speed. precise counter with timer. Check your keyboard latency and mechanical switch performance.",
    schemaType: "WebApplication"
  },
  reaction: {
    title: "Reaction Time Test | Visual Reflex Benchmark (ms)",
    desc: "Test your visual reaction time in milliseconds. Are you faster than a pro gamer? The average human reaction time is 250ms.",
    schemaType: "WebApplication"
  },
  blog: {
    title: "Geometry Dash Guides, Tips & Hardware Reviews | GD Spam Blog",
    desc: "Expert guides on improving Wave consistency, choosing the best mouse for Geometry Dash, and understanding game physics.",
    schemaType: "Blog"
  },
  about: { title: "About Us | Geometry Dash Spam Test", desc: "Our mission to build the best training tools for the Geometry Dash community." },
  contact: { title: "Contact Us | Feature Requests & Support", desc: "Get in touch with the GeometryDashSpam.cc team." },
  privacy: { title: "Privacy Policy", desc: "How we handle your data." },
  terms: { title: "Terms of Service", desc: "Usage agreements." },
  sitemap: { title: "Sitemap | All Tools & Articles", desc: "Full list of Geometry Dash spam tools and guides." },
  '404': { title: "404 Page Not Found", desc: "The page you are looking for does not exist." }
};

// 2. Path Mapping for Clean URLs (SEO Friendly)
const PATH_MAP: Record<string, string> = {
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
    terms: '/terms',
    sitemap: '/sitemap'
};

// Helper to find View from current Path
const getViewFromPath = (path: string): { view: View; slug?: string } => {
    if (path === '/' || path === '') return { view: 'game' };
    
    // Handle Blog Articles (/blog/some-slug)
    if (path.startsWith('/blog/') && path.length > 6) {
        const slug = path.replace('/blog/', '');
        // Validate slug exists to avoid soft 404s on blog
        const exists = BLOG_POSTS.some(p => p.slug === slug);
        if (exists) return { view: 'article', slug };
        return { view: '404' };
    }

    // Exact matches
    const entry = Object.entries(PATH_MAP).find(([key, val]) => val === path);
    if (entry) return { view: entry[0] as View };

    // Fallback to 404 instead of Home to prevent Duplicate Content issues
    return { view: '404' };
};

// --- HELPER: Meta Tag Injection ---
const updateMetaTag = (selector: string, content: string, attrName: string = 'content') => {
    let element = document.querySelector(selector);
    if (!element) {
        element = document.createElement('meta');
        // Parse selector to create element attributes if needed
        if (selector.includes('name="')) element.setAttribute('name', selector.split('name="')[1].split('"')[0]);
        if (selector.includes('property="')) element.setAttribute('property', selector.split('property="')[1].split('"')[0]);
        document.head.appendChild(element);
    }
    element.setAttribute(attrName, content);
};

// --- SCHEMA GENERATOR ---
const generateSchema = (view: View, post: BlogPost | null) => {
    const baseUrl = 'https://geometrydashspam.cc';
    // Handle 404 or unknown views safely
    const path = PATH_MAP[view] || '/';
    const currentUrl = `${baseUrl}${path}`;
    
    // Base Breadcrumbs
    const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": VIEW_METADATA[view]?.title || view, "item": currentUrl }
        ]
    };

    if (view === 'game') {
        return [
            breadcrumbList,
            {
                "@context": "https://schema.org",
                "@type": "VideoGame",
                "name": "Geometry Dash Spam Test",
                "url": baseUrl,
                "description": VIEW_METADATA.game.desc,
                "genre": ["Rhythm", "Arcade", "Simulator"],
                "gamePlatform": "Web Browser",
                "applicationCategory": "Game",
                "operatingSystem": "Any"
            }
        ];
    }

    if (view === 'article' && post) {
        return [
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
                    { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${baseUrl}/blog` },
                    { "@type": "ListItem", "position": 3, "name": post.title, "item": `${baseUrl}/blog/${post.slug}` }
                ]
            },
            {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": post.title,
                "image": post.coverImage,
                "datePublished": new Date(post.date).toISOString().split('T')[0], 
                "author": { "@type": "Organization", "name": "GD Spam Team" },
                "publisher": {
                    "@type": "Organization",
                    "name": "Geometry Dash Spam Test",
                    "logo": { "@type": "ImageObject", "url": `${baseUrl}/icon.png` }
                },
                "description": post.excerpt
            }
        ];
    }
    
    // Generic WebApp Schema for Tools
    if (['cps', 'jitter', 'butterfly', 'spacebar', 'reaction'].includes(view)) {
        return [
            breadcrumbList,
            {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": VIEW_METADATA[view].title,
                "url": currentUrl,
                "description": VIEW_METADATA[view].desc,
                "applicationCategory": "Utility",
                "operatingSystem": "Any",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            }
        ];
    }

    return [breadcrumbList];
};

const NotFoundPage = ({ onHome }: { onHome: () => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-in fade-in zoom-in duration-300">
        <AlertOctagon className="w-24 h-24 text-red-500 mb-6" />
        <h1 className="text-6xl font-display font-black text-white mb-4">404</h1>
        <p className="text-xl text-slate-400 mb-8 max-w-md">
            The level you are looking for has been deleted from the servers.
        </p>
        <button 
            onClick={onHome}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all"
        >
            Return to Menu
        </button>
    </div>
);

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
  const navigate = (view: View, post?: BlogPost) => {
    setCurrentView(view);
    if (post) setCurrentPost(post);
    setMobileMenuOpen(false);
    
    let newPath = PATH_MAP[view as string]; // Cast to string to access generic record
    if (view === 'article' && post) {
        newPath = `/blog/${post.slug}`;
    }
    if (view === 'game') newPath = '/';

    if (newPath) {
        window.history.pushState({ view, slug: post?.slug }, '', newPath);
        window.scrollTo(0, 0);
    }
  };

  // SEO & Schema Injection Effect
  useEffect(() => {
    let title = "Page Not Found";
    let desc = "404 Error";
    let image = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"; 
    const baseUrl = 'https://geometrydashspam.cc';
    const currentUrl = `${baseUrl}${window.location.pathname}`;

    // 1. Determine Metadata
    let meta = VIEW_METADATA[currentView];
    if (currentView === 'article' && currentPost) {
        title = `${currentPost.title} | GD Spam Blog`;
        desc = currentPost.excerpt;
        image = currentPost.coverImage;
    } else if (meta) {
        title = meta.title;
        desc = meta.desc;
        if (meta.image) image = meta.image;
    }

    // 2. Update Document Title
    document.title = title;

    // 3. Update Standard Meta Tags
    updateMetaTag('meta[name="description"]', desc);

    // 4. Update Open Graph (Facebook/Discord)
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', desc);
    updateMetaTag('meta[property="og:image"]', image);
    updateMetaTag('meta[property="og:url"]', currentUrl);
    updateMetaTag('meta[property="og:type"]', currentView === 'article' ? 'article' : 'website');

    // 5. Update Twitter Cards
    updateMetaTag('meta[property="twitter:title"]', title);
    updateMetaTag('meta[property="twitter:description"]', desc);
    updateMetaTag('meta[property="twitter:image"]', image);
    
    // 6. Update Canonical Tag
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

    // 7. Inject Dynamic JSON-LD Schema
    const schemas = generateSchema(currentView, currentPost);
    
    // Remove old schema scripts to prevent duplicates
    const oldScripts = document.querySelectorAll('script[type="application/ld+json"][data-dynamic="true"]');
    oldScripts.forEach(s => s.remove());

    schemas.forEach(schemaData => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-dynamic', 'true');
        script.text = JSON.stringify(schemaData);
        document.head.appendChild(script);
    });

  }, [currentView, currentPost]);

  // Handle Browser Back/Forward
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
      case 'sitemap': return <SitemapPage onNavigate={(view, post) => navigate(view, post)} />;
      case '404': return <NotFoundPage onHome={() => navigate('game')} />;
      default: return <NotFoundPage onHome={() => navigate('game')} />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => {
    const isActive = (currentView === view || (currentView === 'article' && view === 'blog'));
    const href = PATH_MAP[view as string] || '#';

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
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[120px] opacity-15 transition-colors duration-1000
          ${currentView === 'game' ? 'bg-blue-600' : ''}
          ${['cps', 'jitter', 'butterfly', 'rightClick'].includes(currentView) ? 'bg-cyan-600' : ''}
          ${currentView === 'spacebar' ? 'bg-purple-600' : ''}
          ${currentView === 'reaction' ? 'bg-green-600' : ''}
          ${['blog','article','about','contact'].includes(currentView) ? 'bg-indigo-600' : ''}
          ${['privacy','terms', 'sitemap'].includes(currentView) ? 'bg-slate-600' : ''}
          ${currentView === '404' ? 'bg-red-900/40' : ''}
        `}></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent"></div>
      </div>

      {/* HEADER MENU */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
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

          <nav className="hidden md:flex items-center gap-2">
            <NavItem view="game" icon={Gamepad2} label="Wave Sim" />
            
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

          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

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
            <button onClick={() => { navigate('sitemap'); }} className="px-4 py-2 text-slate-400 text-left hover:text-white">Sitemap</button>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-grow pt-24 md:pt-32 pb-12 px-4 w-full max-w-7xl mx-auto">
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
                {currentView === '404' && "PAGE NOT FOUND"}
             </h1>
             <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                {currentView === 'game' && "Master the wave mechanic. Improve consistency. Survive the spam."}
                {currentView === 'cps' && "Measure your raw clicking speed over a 10-second interval."}
                {currentView === 'spacebar' && "Test your keyboard latency and spamming capability."}
                {currentView === 'reaction' && "Test your visual reflex speed. Wait for green, then click."}
                {currentView === 'blog' && "Expert guides, hardware reviews, and strategy for Geometry Dash players."}
                {currentView === '404' && "The requested resource could not be found."}
             </p>
          </div>
        )}

        <div className="w-full">
           {renderContent()}
        </div>
      </main>

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
                  <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('privacy'); }} className="hover:text-white transition-colors">Privacy</a>
                  <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('terms'); }} className="hover:text-white transition-colors">Terms</a>
                  <a href="/sitemap" onClick={(e) => { e.preventDefault(); navigate('sitemap'); }} className="hover:text-white transition-colors">Sitemap</a>
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