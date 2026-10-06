import BlogList from "../../components/BlogList";
import Breadcrumbs from "../../components/Breadcrumbs";
import { BLOG_POSTS } from "../../data/blogContent";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geometry Dash Spam Guides – Wave, CPS & Demon Training",
  description:
    "Practical Geometry Dash guides covering spam, wave control, CPS measurement, input methods and demon practice without fabricated performance claims.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Geometry Dash Spam Guides – Wave, CPS & Demon Training",
    description: "Practical Geometry Dash guides covering spam, wave control, CPS measurement, input methods and demon practice without fabricated performance claims.",
    url: "https://geometrydashspam.cc/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geometry Dash Spam Guides – Wave, CPS & Demon Training",
    description: "Practical Geometry Dash guides covering spam, wave control, CPS measurement, input methods and demon practice without fabricated performance claims.",
  },
};

const guideGroups = [
  {
    title: "Wave & spam control",
    description: "Learn press-and-release rhythm, corridor control and how wave spam differs from raw CPS.",
    href: "/geometry-dash-wave",
    cta: "Open Wave Trainer",
  },
  {
    title: "CPS & input consistency",
    description: "Measure click speed separately, then compare repeatability instead of relying on a single peak run.",
    href: "/cps-test",
    cta: "Open CPS Test",
  },
  {
    title: "Demons & progression",
    description: "Use source-checked Demon List references, wave-focused examples and beginner progression guides.",
    href: "/demon-list",
    cta: "Browse Demon Guides",
  },
];

export default function BlogPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Geometry Dash Spam Guides",
    url: "https://geometrydashspam.cc/blog",
    description:
      "Practical guides for Geometry Dash spam, wave control, CPS measurement, input methods and demon practice.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: BLOG_POSTS.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://geometrydashspam.cc/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Guides", href: "/blog" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

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

      <section className="mb-10 grid gap-4 md:grid-cols-3">
        {guideGroups.map((group) => (
          <Link
            key={group.title}
            href={group.href}
            className="rounded-2xl border border-white/10 bg-slate-900/30 p-5 transition hover:border-blue-500/40 hover:bg-slate-900/50"
          >
            <h2 className="mb-2 text-lg font-bold text-white">{group.title}</h2>
            <p className="mb-4 text-sm leading-6 text-slate-400">{group.description}</p>
            <span className="text-sm font-semibold text-blue-400">{group.cta} →</span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="latest-guides-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Latest library</p>
            <h2 id="latest-guides-heading" className="text-2xl font-bold text-white">Geometry Dash training articles</h2>
          </div>
          <p className="text-sm text-slate-500">{BLOG_POSTS.length} practical guides</p>
        </div>
        <BlogList />
      </section>
    </>
  );
}
