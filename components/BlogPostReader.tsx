"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '../data/blogContent';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, Zap, MousePointer2, List } from 'lucide-react';

interface BlogPostProps {
  post: BlogPost;
}

const BlogPostReader: React.FC<BlogPostProps> = ({ post }) => {
  
  // Next.js handles scroll restoration, but this ensures top of article
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [post]);

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(post.title);
      let shareUrl = '';

      switch (platform) {
          case 'twitter':
              shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
              break;
          case 'facebook':
              shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
              break;
          case 'linkedin':
              shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
              break;
      }
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const copyLink = () => {
      navigator.clipboard.writeText(window.location.href);
      // Optional: Add a toast notification here
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <article className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      
      {/* Navigation */}
      <Link 
        href="/blog"
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 group transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>

      {/* Header */}
      <header className="mb-12">
        <div className="flex gap-2 mb-6">
            {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">
                    {tag}
                </span>
            ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between border-b border-white/10 pb-8">
            <div className="flex items-center gap-6 text-sm text-slate-400 font-mono">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.readTime}</span>
            </div>
            
            <div className="flex gap-4">
                <button onClick={copyLink} className="text-slate-400 hover:text-white transition-colors" title="Copy Link"><Share2 className="w-5 h-5" /></button>
            </div>
        </div>
      </header>

      {/* Featured Image - Optimized for LCP */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-white/5 shadow-2xl relative group bg-slate-800">
         <img 
           src={post.coverImage} 
           alt={`Cover image for ${post.title}`}
           width="896"
           height="504"
           loading="eager" // Hero image should load immediately
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-50"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
             {/* TABLE OF CONTENTS (Mobile/Inline) */}
             {post.toc && post.toc.length > 0 && (
                <div className="lg:hidden mb-8 bg-slate-900/50 border border-white/10 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <List className="w-4 h-4" /> Table of Contents
                    </h3>
                    <ul className="space-y-3">
                        {post.toc.map(item => (
                            <li key={item.id}>
                                <button 
                                    onClick={() => scrollToSection(item.id)} 
                                    className="text-slate-300 hover:text-blue-400 text-sm text-left transition-colors"
                                >
                                    {item.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
             )}

             <div className="prose prose-lg prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-headings:scroll-mt-24">
                {post.content}
             </div>
          </div>

          {/* Sidebar / Desktop TOC */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
             <div className="sticky top-32 space-y-8">
                 {post.toc && post.toc.length > 0 && (
                    <div className="bg-slate-900/30 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <List className="w-4 h-4" /> In this Article
                        </h3>
                        <ul className="space-y-3 border-l border-white/10 ml-1">
                            {post.toc.map(item => (
                                <li key={item.id} className="-ml-px">
                                    <button 
                                        onClick={() => scrollToSection(item.id)} 
                                        className="pl-4 text-slate-400 hover:text-blue-400 hover:border-l-blue-400 border-l border-transparent text-sm text-left transition-all py-1 block w-full"
                                    >
                                        {item.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                 )}
                 
                 {/* Mini CTA in Sidebar */}
                 <div className="bg-gradient-to-b from-blue-900/20 to-slate-900/20 border border-blue-500/20 rounded-xl p-6 text-center">
                    <Zap className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h4 className="font-bold text-white mb-2 text-sm">Train Your Wave</h4>
                    <p className="text-xs text-slate-400 mb-4">Put this theory into practice now.</p>
                    <Link
                        href="/"
                        className="w-full block py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded uppercase tracking-wider transition-colors"
                    >
                        Start Simulator
                    </Link>
                 </div>
             </div>
          </aside>
      </div>

      {/* ACTION CTA CARD */}
      <div className="mt-16 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
         <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>

         <div className="flex-grow relative z-10 text-center md:text-left">
            <h3 className="text-2xl font-display font-bold text-white mb-2">Ready to Test Your Skills?</h3>
            <p className="text-slate-300">Don't just read about it. Put your clicking speed and wave consistency to the test right now.</p>
         </div>
         
         <div className="flex flex-col gap-3 relative z-10 w-full md:w-auto">
             <Link 
                href="/"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
             >
                <Zap className="w-5 h-5" /> Launch Wave Sim
             </Link>
             <Link 
                href="/cps-test"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg border border-white/10 flex items-center justify-center gap-2 transition-all"
             >
                <MousePointer2 className="w-5 h-5" /> Take CPS Test
             </Link>
         </div>
      </div>

      {/* Footer / Author */}
      <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/30 p-8 rounded-2xl">
         <div>
             <p className="text-slate-400 text-sm font-mono mb-2 uppercase tracking-widest">Written By</p>
             <h4 className="text-xl font-bold text-white">GD Spam Team</h4>
             <p className="text-slate-500 text-sm mt-1">Dedicated to pushing the limits of human clicking potential.</p>
         </div>
         <div className="flex gap-4">
             <button onClick={() => handleShare('twitter')} className="p-3 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors text-white" aria-label="Share on Twitter"><Twitter className="w-4 h-4" /></button>
             <button onClick={() => handleShare('facebook')} className="p-3 bg-slate-800 rounded-full hover:bg-blue-700 transition-colors text-white" aria-label="Share on Facebook"><Facebook className="w-4 h-4" /></button>
             <button onClick={() => handleShare('linkedin')} className="p-3 bg-slate-800 rounded-full hover:bg-blue-500 transition-colors text-white" aria-label="Share on LinkedIn"><Linkedin className="w-4 h-4" /></button>
         </div>
      </div>

    </article>
  );
};

export default BlogPostReader;