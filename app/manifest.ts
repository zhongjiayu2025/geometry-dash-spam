import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Geometry Dash Spam",
    short_name: "GD Spam",
    description:
      "Geometry Dash spam, wave and CPS training tools for browser-based practice.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    lang: "en",
    dir: "ltr",
    categories: ["games", "utilities"],
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
    shortcuts: [
      {
        name: "Geometry Dash Wave Trainer",
        short_name: "Wave",
        description: "Open the Geometry Dash wave practice trainer.",
        url: "/geometry-dash-wave",
        icons: [{ src: "/logo.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Geometry Dash CPS Test",
        short_name: "CPS",
        description: "Open the Geometry Dash clicks-per-second test.",
        url: "/cps-test",
        icons: [{ src: "/logo.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Geometry Dash Demon List",
        short_name: "Demon List",
        description: "Open the sourced top-50 Demon List snapshot.",
        url: "/demon-list",
        icons: [{ src: "/logo.svg", sizes: "any", type: "image/svg+xml" }],
      },
    ],
  };
}
