import RefreshRateTest from "../../components/RefreshRateTest";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Refresh Rate (Hz) Test | Screen FPS Check",
    description: "Check your monitor's true refresh rate natively in your browser using requestAnimationFrame.",
};

export default function RefreshRatePage() {
    return <RefreshRateTest />;
}
