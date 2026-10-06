import type { Metadata } from "next";
import ButterflyClickTest from "../../components/ButterflyClickTest";
import Breadcrumbs from "../../components/Breadcrumbs";
import ClickTestHero from "../../components/ClickTestHero";
import RelatedTools from "../../components/RelatedTools";
import ClickTechniqueGuide from "../../components/ClickTechniqueGuide";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";

const description =
  "Take a 10-second butterfly click test and measure two-finger CPS, click count and repeatability. Compare several runs on the same mouse and setup.";

const butterflyFaqs = [
  {
    q: "What is Butterfly Clicking?",
    a: "Butterfly clicking alternates two fingers on the same mouse button to produce repeated clicks. Results vary by player, mouse, browser and technique.",
  },
  {
    q: "Why use Butterfly Clicking in Geometry Dash?",
    a: "Alternating two fingers may feel more sustainable or controllable for some players during rapid-input sections, but it is not universally better. Compare it with your normal method on the same device and test length.",
  },
  {
    q: "Is it Cheating?",
    a: "Rules vary by leaderboard or community. Check the rules of the specific competition or list before using modified input behavior.",
  },
];

export const metadata: Metadata = {
  title: "Butterfly Click Test | 10 Second CPS Test",
  description,
  alternates: { canonical: "/butterfly-click" },
  openGraph: {
    title: "Butterfly Click Test | 10 Second CPS Test",
    description,
    url: "https://geometrydashspam.cc/butterfly-click",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Butterfly Click Test | 10 Second CPS Test",
    description,
  },
};

export default function ButterflyClickPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: butterflyFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ToolWebApplicationSchema
        name="Butterfly Click Test"
        path="/butterfly-click"
        description={description}
      />
      <Breadcrumbs items={[{ label: "Butterfly Click", href: "/butterfly-click", active: true }]} />
      <ClickTestHero variant="butterfly" />
      <ButterflyClickTest />
      <ClickTechniqueGuide variant="butterfly" />
      <RelatedTools currentTool="butterfly" />
    </>
  );
}
