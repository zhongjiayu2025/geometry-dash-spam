import BlogList from "../../components/BlogList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "GD Spam Blog | Guides, Hardware Reviews & Physics Analysis",
    description: "Deep dive into Geometry Dash mechanics. Guides on improving wave consistency, best mice for spam, and 2.2 physics analysis.",
};

export default function BlogPage() {
    return (
        <>
            <div className="mb-8 md:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM ONLINE
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-2xl uppercase">
                    LATEST INSIGHTS
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                    Expert guides, hardware reviews, and strategy for Geometry Dash players.
                </p>
            </div>
            <BlogList />
        </>
    );
}