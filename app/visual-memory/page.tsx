import VisualMemoryTest from "../../components/VisualMemoryTest";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Visual Memory Test | Brain Capacity Benchmark",
    description: "Test your brain's spatial and visual memory capacity with this grid recall game.",
};

export default function VisualMemoryPage() {
    return <VisualMemoryTest />;
}
