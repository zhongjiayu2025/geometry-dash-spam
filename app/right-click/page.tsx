import RightClickTest from "../../components/RightClickTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Right Click CPS Test | RMB Click Speed Test",
  description:
    "Measure right-mouse-button clicks per second with a simple browser-based RMB speed test.",
  alternates: { canonical: "/right-click" },
};

export default function RightClickPage() {
  return <RightClickTest />;
}
