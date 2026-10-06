import SpacebarCounter from "../../components/SpacebarCounter";
import Breadcrumbs from "../../components/Breadcrumbs";
import SpacebarGuide from "../../components/SpacebarGuide";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";
import RelatedTools from "../../components/RelatedTools";
import InputToolGuide from "../../components/InputToolGuide";
import { Metadata } from "next";

const spacebarFaqs = [
  {
    q: "What does the spacebar CPS test measure?",
    a: "It counts browser-registered Space key presses over 10 seconds and converts the total into presses per second.",
  },
  {
    q: "Is this a keyboard latency test?",
    a: "No. The page measures repeated key presses in the browser. It does not measure physical switch actuation, scan rate or end-to-end keyboard latency.",
  },
  {
    q: "Can I use the spacebar for Geometry Dash?",
    a: "Yes. Space is a standard Geometry Dash input option. Raw press speed is still separate from the timing and control needed for wave spam.",
  },
];

export const metadata: Metadata = {
  title: "Spacebar CPS Test | 10 Second Spacebar Counter",
  description:
    "Take a 10-second spacebar CPS test, count key presses and compare press speed across repeated runs. Browser results are not direct hardware-latency measurements.",
  alternates: { canonical: "/spacebar-counter" },
  openGraph: {
    title: "Spacebar CPS Test | 10 Second Spacebar Counter",
    description: "Take a 10-second spacebar CPS test, count key presses and compare press speed across repeated runs. Browser results are not direct hardware-latency measurements.",
    url: "https://geometrydashspam.cc/spacebar-counter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spacebar CPS Test | 10 Second Spacebar Counter",
    description: "Take a 10-second spacebar CPS test, count key presses and compare press speed across repeated runs. Browser results are not direct hardware-latency measurements.",
  },
};

export default function SpacebarCounterPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: spacebarFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ToolWebApplicationSchema
        name="Spacebar Counter"
        path="/spacebar-counter"
        description="Take a 10-second spacebar CPS test, count key presses and compare press speed across repeated runs. Browser results are not direct hardware-latency measurements."
      />
      <Breadcrumbs items={[{ label: "Spacebar Counter", href: "/spacebar-counter", active: true }]} />
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          KEY PRESS SPEED
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">SPACEBAR CPS TEST</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Run a 10-second spacebar counter and compare presses per second across repeated runs.
        </p>
      </div>
      <SpacebarCounter />
      <SpacebarGuide />
      <InputToolGuide tool="spacebar" />
      <section className="mx-auto mt-10 max-w-5xl">
        <h2 className="mb-4 text-2xl font-display font-bold text-white">Spacebar CPS Test FAQ</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {spacebarFaqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
              <h3 className="mb-2 font-bold text-white">{item.q}</h3>
              <p className="text-sm leading-6 text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
      <RelatedTools currentTool="spacebar" />
    </>
  );
}
