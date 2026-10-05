import RefreshRateTest from "../../components/RefreshRateTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refresh Rate Test | Browser Display Hz Estimate",
  description:
    "Estimate the display refresh cadence observed by requestAnimationFrame in your browser.",
  alternates: { canonical: "/refresh-rate" },
  openGraph: {
    title: "Refresh Rate Test | Browser Display Hz Estimate",
    description: "Estimate the display refresh cadence observed by requestAnimationFrame in your browser.",
    url: "https://geometrydashspam.cc/refresh-rate",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Refresh Rate Test | Browser Display Hz Estimate",
    description: "Estimate the display refresh cadence observed by requestAnimationFrame in your browser.",
  },
};

export default function RefreshRatePage() {
  return <RefreshRateTest />;
}
