import ChimpTest from "../../components/ChimpTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chimp Test | Number Sequence Memory Test",
  description:
    "Test visual sequence memory by remembering numbered positions before they are hidden.",
  alternates: { canonical: "/chimp-test" },
};

export default function ChimpTestPage() {
  return <ChimpTest />;
}
