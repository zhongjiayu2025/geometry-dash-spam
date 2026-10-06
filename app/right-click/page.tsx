import type { Metadata } from "next";
import RightClickTest from "../../components/RightClickTest";
import Breadcrumbs from "../../components/Breadcrumbs";
import ClickTestHero from "../../components/ClickTestHero";
import RelatedTools from "../../components/RelatedTools";
import InputToolGuide from "../../components/InputToolGuide";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";

const description =
  "Measure right-mouse-button clicks per second with a simple browser-based RMB speed test.";

const rightClickFaqs = [
  {
    q: "What does the right click CPS test measure?",
    a: "It counts browser-registered right-mouse-button clicks over a 10-second test and converts the total into clicks per second.",
  },
  {
    q: "Is right click CPS the same as Geometry Dash performance?",
    a: "No. Right-click CPS is useful for comparing mouse-button speed and repeatability, but standard Geometry Dash input usually uses left click, Space or another bound key.",
  },
  {
    q: "Why can right-click CPS differ from left-click CPS?",
    a: "Mouse button shape, switch feel, finger position, debounce behavior and your grip can all affect repeated clicking. Compare several runs on the same setup instead of relying on one attempt.",
  },
];

export const metadata: Metadata = {
  title: "Right Click CPS Test | RMB Click Speed Test",
  description,
  alternates: { canonical: "/right-click" },
  openGraph: {
    title: "Right Click CPS Test | RMB Click Speed Test",
    description,
    url: "https://geometrydashspam.cc/right-click",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Right Click CPS Test | RMB Click Speed Test",
    description,
  },
};

export default function RightClickPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: rightClickFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ToolWebApplicationSchema
        name="Right Click CPS Test"
        path="/right-click"
        description={description}
      />
      <Breadcrumbs items={[{ label: "Right Click", href: "/right-click", active: true }]} />
      <ClickTestHero variant="rightClick" />
      <RightClickTest />
      <InputToolGuide tool="right-click" />
      <section className="mx-auto mt-10 max-w-5xl">
        <h2 className="mb-4 text-2xl font-display font-bold text-white">Right Click CPS Test FAQ</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {rightClickFaqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
              <h3 className="mb-2 font-bold text-white">{item.q}</h3>
              <p className="text-sm leading-6 text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
      <RelatedTools currentTool="rightClick" />
    </>
  );
}
