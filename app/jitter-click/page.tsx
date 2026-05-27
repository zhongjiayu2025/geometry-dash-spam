
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
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Jitter Click Test",
        "url": "https://geometrydashspam.cc/jitter-click",
        "description": "Learn to Jitter Click safely. Increase your CPS to 14+ with our vibration technique tutorial and speed test. Essential for spam wave.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
            />
            <JitterClickTest />
        </>
    );
}
