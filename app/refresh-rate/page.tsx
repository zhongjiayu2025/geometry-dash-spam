import RefreshRateTest from "../../components/RefreshRateTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refresh Rate Test | Browser Display Hz Estimate",
  description:
    "Estimate the display refresh cadence observed by requestAnimationFrame in your browser.",
  alternates: { canonical: "/refresh-rate" },
};

export default function RefreshRatePage() {
  return <RefreshRateTest />;
}
