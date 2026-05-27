import KeyboardGhostingTest from "../../components/KeyboardGhostingTest";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Keyboard Ghosting & N-Key Rollover Test",
    description: "Visually test your keyboard's matrix, rollover limits, and discover ghosting weaknesses.",
};

export default function KeyboardGhostingPage() {
    return <KeyboardGhostingTest />;
}
