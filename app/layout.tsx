import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#020617",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://geometrydashspam.cc"),
  title: {
    default: "Geometry Dash Spam Test – Wave Spam Trainer Online",
    template: "%s | Geometry Dash Spam",
  },
  description:
    "Practice Geometry Dash spam, wave control and CPS with free browser-based training tools, sourced demon references and no account required.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  appleWebApp: {
    capable: true,
    title: "GD Spam",
    statusBarStyle: "black-translucent",
  },
  verification: {
    google: "Yz_6YlW_BzjxZVMUNDmQKQV3n-Jf8cRUr6sMnqJDzyQ",
  },
  openGraph: {
    type: "website",
    url: "https://geometrydashspam.cc",
    siteName: "Geometry Dash Spam",
    title: "Geometry Dash Spam Test – Wave Spam Trainer Online",
    description:
      "Practice Geometry Dash wave spam online and compare CPS, click consistency and repeatable control in a free browser trainer.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geometry Dash Spam Test",
    description: "Practice Geometry Dash wave spam and measure CPS, click consistency and control.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://geometrydashspam.cc/#organization",
        name: "Geometry Dash Spam",
        url: "https://geometrydashspam.cc",
        description:
          "Fan-made browser tools and sourced guides for Geometry Dash spam practice, wave control, CPS and Demon List discovery.",
        email: "info@geometrydashspam.cc",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "site support and corrections",
          email: "info@geometrydashspam.cc",
          url: "https://geometrydashspam.cc/contact",
        },
        knowsAbout: [
          "Geometry Dash spam practice",
          "Geometry Dash wave practice",
          "clicks per second testing",
          "Geometry Dash Demon List references",
        ],
        logo: {
          "@type": "ImageObject",
          url: "https://geometrydashspam.cc/logo.svg",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://geometrydashspam.cc/#website",
        name: "Geometry Dash Spam",
        url: "https://geometrydashspam.cc",
        description:
          "Browser-based Geometry Dash spam, wave and CPS training tools.",
        publisher: {
          "@id": "https://geometrydashspam.cc/#organization",
        },
        about: [
          { "@type": "Thing", name: "Geometry Dash spam practice" },
          { "@type": "Thing", name: "Geometry Dash wave practice" },
          { "@type": "Thing", name: "clicks per second testing" },
        ],
        inLanguage: "en",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        <link rel="describedby" href="/llms.txt" type="text/markdown" />
        <meta property="og:site_name" content="Geometry Dash Spam" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://geometrydashspam.cc/opengraph-image" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Geometry Dash Spam — Spam, Wave and CPS browser practice tools" />
        <meta name="twitter:image" content="https://geometrydashspam.cc/twitter-image" />
        <meta name="twitter:image:alt" content="Geometry Dash Spam — Spam, Wave and CPS browser practice tools" />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500 selection:text-white flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only z-[100] rounded-md bg-white px-4 py-2 font-semibold text-slate-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1528586776567779"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-grid opacity-15"></div>
          <div className="absolute top-0 left-1/2 hidden -translate-x-1/2 w-[900px] h-[520px] rounded-full blur-[120px] opacity-10 bg-blue-600 md:block"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent"></div>
        </div>

        <Header />

        <main id="main-content" tabIndex={-1} className="relative z-10 flex-grow pt-24 md:pt-28 pb-12 px-4 w-full max-w-7xl mx-auto">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
