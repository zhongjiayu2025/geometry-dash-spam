import BlogList from "../../components/BlogList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geometry Dash Spam Guides – Wave, CPS & Demon Training",
  description:
    "Practical Geometry Dash guides covering spam, wave control, CPS measurement, input methods and demon practice without fabricated performance claims.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-blue-400 mb-4">
          TRAINING GUIDES
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 uppercase">
          Geometry Dash Spam Guides
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-7">
          Practical guides for wave control, CPS measurement, clicking methods and demon practice.
          Claims are kept reproducible and separated from official game physics or rankings.
        </p>
      </div>
      <BlogList />
    </>
  );
}
