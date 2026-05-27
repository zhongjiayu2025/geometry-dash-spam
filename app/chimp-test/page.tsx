import ChimpTest from "../../components/ChimpTest";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chimp Test | Visual Memory Benchmark",
    description: "Are you smarter than a chimp? Test your visual memory by remembering a sequence of numbers.",
};

export default function ChimpTestPage() {
    return <ChimpTest />;
}
