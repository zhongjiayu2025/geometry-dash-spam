type ToolWebApplicationSchemaProps = {
  name: string;
  path: string;
  description: string;
  applicationCategory?: string;
};

export default function ToolWebApplicationSchema({
  name,
  path,
  description,
  applicationCategory = "UtilityApplication",
}: ToolWebApplicationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: `https://geometrydashspam.cc${path}`,
    description,
    applicationCategory,
    operatingSystem: "Any",
    isAccessibleForFree: true,
    isPartOf: { "@id": "https://geometrydashspam.cc/#website" },
    publisher: { "@id": "https://geometrydashspam.cc/#organization" },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
