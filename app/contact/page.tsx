import { ContactPage } from "../../components/InfoPages";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Feature Requests & Support",
    description: "Get in touch with the GeometryDashSpam.cc team.",
};

export default function Page() {
    return <ContactPage />;
}