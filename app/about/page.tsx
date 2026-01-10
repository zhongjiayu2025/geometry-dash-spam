import { AboutPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | Geometry Dash Spam Training",
    description: "Our mission to build the best training tools for the Geometry Dash community.",
};

export default function Page() {
    return <AboutPage />;
}