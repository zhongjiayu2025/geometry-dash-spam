"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copyLink}
      className="text-slate-400 transition-colors hover:text-white"
      title={copied ? "Copied" : "Copy link"}
      aria-label={copied ? "Link copied" : "Copy article link"}
    >
      {copied ? <Check className="h-5 w-5 text-green-400" /> : <Share2 className="h-5 w-5" />}
    </button>
  );
}
