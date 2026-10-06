import type { Metadata } from "next";
import JitterClickTest from "../../components/JitterClickTest";
import ClickTestHero from "../../components/ClickTestHero";
import Breadcrumbs from "../../components/Breadcrumbs";
import RelatedTools from "../../components/RelatedTools";
import ClickTechniqueGuide from "../../components/ClickTechniqueGuide";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";

const description =
  "Take a 10-second jitter click test and measure CPS, click count and repeatability in your browser. Compare several runs on the same mouse and setup.";

const jitterFaqs = [
  {
    q: "Is jitter clicking good for Geometry Dash?",
    a: "It can produce rapid repeated inputs, but it may reduce fine control. For Geometry Dash wave practice, compare raw CPS with whether the input rhythm stays controllable.",
  },
  {
    q: "Butterfly vs Jitter Clicking?",
    a: "They use different input motions, so one may feel faster or more controllable for a particular player. Compare both with the same test duration and device instead of assuming one universal winner.",
  },
  {
    q: "Why do jitter CPS scores vary?",
    a: "Input hardware, browser event handling, test duration and technique all affect the number your browser records. Repeated tests on the same setup are the most comparable.",
  },
];

export const metadata: Metadata = {
  title: "Jitter Click Test | 10 Second CPS Test",
  description,
  alternates: { canonical: "/jitter-click" },
  openGraph: {
    title: "Jitter Click Test | 10 Second CPS Test",
    description,
    url: "https://geometrydashspam.cc/jitter-click",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jitter Click Test | 10 Second CPS Test",
    description,
  },
};

export default function JitterClickPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: jitterFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ToolWebApplicationSchema
        name="Jitter Click Test"
        path="/jitter-click"
        description={description}
      />
      <Breadcrumbs items={[{ label: "Jitter Click", href: "/jitter-click", active: true }]} />
      <ClickTestHero variant="jitter" />
      <JitterClickTest />
      <ClickTechniqueGuide variant="jitter" />
      <RelatedTools currentTool="jitter" />
    </>
  );
}
