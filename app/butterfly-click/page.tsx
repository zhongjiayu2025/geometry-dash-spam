import ButterflyClickTest from "../../components/ButterflyClickTest";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Butterfly Click Test | Double Click Mouse Trainer",
    description: "Train your Butterfly Clicking speed. Learn the double-finger technique used by pros to achieve 20+ CPS in Geometry Dash.",
};

export default function ButterflyClickPage() {
    return (
        <ButterflyClickTest />
    );
}