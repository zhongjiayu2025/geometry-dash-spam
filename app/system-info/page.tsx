import SystemInfo from "../../components/SystemInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browser & System Info | Device Information Viewer",
  description:
    "View screen, browser and device information exposed to this page through standard web APIs.",
  alternates: { canonical: "/system-info" },
};

export default function SystemInfoPage() {
  return <SystemInfo />;
}
