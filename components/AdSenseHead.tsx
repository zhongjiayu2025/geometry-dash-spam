"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import adPages from "../data/adPages.json";

// An explicit allowlist prevents future utility/error routes from receiving ads
// by default. React hoists this async script into the document head during SSR.
export default function AdSenseHead() {
  const pathname = usePathname()?.replace(/\/$/, "") || "/";
  useEffect(() => {
    // AdSense is a document-wide SDK. Cross the ad boundary with a fresh
    // document so an SDK loaded on a content page cannot carry into a utility.
    const onNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.download || (anchor.target && anchor.target !== "_self")) return;
      const target = new URL(anchor.href, window.location.href);
      if (target.origin !== window.location.origin) return;
      const nextPath = target.pathname.replace(/\/$/, "") || "/";
      if (adPages.includes(pathname) === adPages.includes(nextPath)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(target.href);
    };
    document.addEventListener("click", onNavigation, true);
    return () => document.removeEventListener("click", onNavigation, true);
  }, [pathname]);
  if (!adPages.includes(pathname)) return null;
  return (
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1528586776567779"
      crossOrigin="anonymous"
    />
  );
}
