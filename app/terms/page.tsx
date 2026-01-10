import { TermsPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Usage agreements.",
};

export default function Page() {
    return <TermsPage />;
}