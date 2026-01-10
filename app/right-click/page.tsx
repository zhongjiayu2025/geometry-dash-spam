import RightClickTest from "../../components/RightClickTest";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Right Click CPS Test | RMB Speed Benchmark",
    description: "Test your Right Mouse Button speed. Vital for MOBA kite-mechanics and Minecraft bridging. How fast is your middle finger?",
};

export default function RightClickPage() {
    return (
        <RightClickTest />
    );
}