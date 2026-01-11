
import JitterClickTest from "../../components/JitterClickTest";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Jitter Click Test | Vibration Clicking Technique Tutorial",
    description: "Learn to Jitter Click safely. Increase your CPS to 14+ with our vibration technique tutorial and speed test. Essential for spam wave.",
    alternates: {
        canonical: '/jitter-click',
    }
};

export default function JitterClickPage() {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://geometrydashspam.cc"
        },{
            "@type": "ListItem",
            "position": 2,
            "name": "Jitter Click Test",
            "item": "https://geometrydashspam.cc/jitter-click"
        }]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <JitterClickTest />
        </>
    );
}
