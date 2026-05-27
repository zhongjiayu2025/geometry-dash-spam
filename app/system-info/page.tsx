import SystemInfo from "../../components/SystemInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "System & Browser Info Test | Hardware Diagnostics",
    description: "Check your browser identity, screen resolution, and hardware properties securely.",
};

export default function SystemInfoPage() {
    return <SystemInfo />;
}
