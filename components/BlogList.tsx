import React from 'react';
import { BLOG_POSTS, BlogPost } from '../data/blogContent';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogListProps {
  onReadPost: (post: BlogPost) => void;
}

const BlogList: React.FC<BlogListProps> = ({ onReadPost }) => {
  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post, index) => (
          <article 
            key={post.id}
            onClick={() => onReadPost(post)}
            className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20"
          >
            {/* Image Container */}
            <div className="h-48 overflow-hidden relative bg-slate-800">
               <img 
                 src={post.coverImage} 
                 alt={post.title}
                 width="400" 
                 height="250"
                 loading={index < 3 ? "eager" : "lazy"} // Eager load top row for LCP, lazy load others
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
               
               {/* Tags */}
               <div className="absolute top-4 left-4 flex gap-2">
                 {post.tags.map(tag => (
                   <span key={tag} className="px-2 py-1 bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-wider rounded backdrop-blur-sm">
                     {tag}
                   </span>
                 ))}
               </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-3 font-mono">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
              </div>
              
              <h2 className="text-xl font-display font-bold text-white mb-3 leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                {post.title}
              </h2>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center text-blue-400 text-sm font-bold tracking-wide group-hover:gap-2 transition-all">
                READ ARTICLE <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogList;