import React, { useEffect } from 'react';
import { BlogPost } from '../data/blogContent';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, Zap, MousePointer2 } from 'lucide-react';

// Need to match the View type from App.tsx partially or just use string
type View = 'game' | 'cps' | 'jitter' | 'butterfly' | 'rightClick' | 'spacebar' | 'reaction' | 'blog' | 'article' | 'about' | 'contact' | 'privacy' | 'terms';

interface BlogPostProps {
  post: BlogPost;
  onBack: () => void;
  onNavigate: (view: View) => void;
}

const BlogPostReader: React.FC<BlogPostProps> = ({ post, onBack, onNavigate }) => {
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [post]);

  return (
    <article className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      
      {/* Navigation */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </button>

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
                <button className="text-slate-400 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
            </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-white/5 shadow-2xl relative group">
         <img 
           src={post.coverImage} 
           alt={post.title}
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-50"></div>
      </div>

      {/* Content Body */}
      <div className="prose prose-lg prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
        {post.content}
      </div>

      {/* ACTION CTA CARD (New Addition for Conversion) */}
      <div className="mt-16 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
         <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>

         <div className="flex-grow relative z-10 text-center md:text-left">
            <h3 className="text-2xl font-display font-bold text-white mb-2">Ready to Test Your Skills?</h3>
            <p className="text-slate-300">Don't just read about it. Put your clicking speed and wave consistency to the test right now.</p>
         </div>
         
         <div className="flex flex-col gap-3 relative z-10 w-full md:w-auto">
             <button 
                onClick={() => onNavigate('game')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
             >
                <Zap className="w-5 h-5" /> Launch Wave Sim
             </button>
             <button 
                onClick={() => onNavigate('cps')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg border border-white/10 flex items-center justify-center gap-2 transition-all"
             >
                <MousePointer2 className="w-5 h-5" /> Take CPS Test
             </button>
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
             <button className="p-3 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors text-white"><Twitter className="w-4 h-4" /></button>
             <button className="p-3 bg-slate-800 rounded-full hover:bg-blue-700 transition-colors text-white"><Facebook className="w-4 h-4" /></button>
             <button className="p-3 bg-slate-800 rounded-full hover:bg-blue-500 transition-colors text-white"><Linkedin className="w-4 h-4" /></button>
         </div>
      </div>

    </article>
  );
};

export default BlogPostReader;