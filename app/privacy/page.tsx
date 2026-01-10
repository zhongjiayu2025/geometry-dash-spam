import { PrivacyPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "How we handle your data.",
};

export default function Page() {
    return <PrivacyPage />;
}