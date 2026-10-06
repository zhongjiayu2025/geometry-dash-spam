"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HeaderRouteState() {
  const pathname = usePathname();

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-nav-href]").forEach((link) => {
      const href = link.dataset.navHref;
      if (!href) return;

      const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
      link.classList.toggle("nav-active", active);

      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    document.querySelectorAll<HTMLDetailsElement>("details[data-header-menu]").forEach((menu) => {
      menu.open = false;
    });
  }, [pathname]);

  useEffect(() => {
    const closeMenus = (except?: Node | null) => {
      document
        .querySelectorAll<HTMLDetailsElement>("details[data-header-menu][open]")
        .forEach((menu) => {
          if (!except || !menu.contains(except)) menu.open = false;
        });
    };

    const handlePointerDown = (event: PointerEvent) => {
      closeMenus(event.target as Node | null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
