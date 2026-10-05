import SystemInfo from "../../components/SystemInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browser & System Info | Device Information Viewer",
  description:
    "View screen, browser and device information exposed to this page through standard web APIs.",
  alternates: { canonical: "/system-info" },
  openGraph: {
    title: "Browser & System Info | Device Information Viewer",
    description: "View screen, browser and device information exposed to this page through standard web APIs.",
    url: "https://geometrydashspam.cc/system-info",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Browser & System Info | Device Information Viewer",
    description: "View screen, browser and device information exposed to this page through standard web APIs.",
  },
};

export default function SystemInfoPage() {
  return <SystemInfo />;
}
