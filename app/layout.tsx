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
  keywords: [
    "geometry dash spam",
    "geometry dash spam test",
    "geometry dash wave spam",
    "geometry dash wave",
    "geometry dash cps test",
    "gd cps test",
  ],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
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
    images: [{ url: "/logo.svg", alt: "Geometry Dash Spam" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Geometry Dash Spam Test",
    description: "Practice Geometry Dash wave spam and measure CPS, click consistency and control.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Geometry Dash Spam",
    url: "https://geometrydashspam.cc",
    description:
      "Browser-based Geometry Dash spam, wave and CPS training tools.",
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500 selection:text-white flex flex-col`}>
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

        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-grid opacity-15"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full blur-[120px] opacity-10 bg-blue-600"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent"></div>
        </div>

        <Header />

        <main className="relative z-10 flex-grow pt-24 md:pt-28 pb-12 px-4 w-full max-w-7xl mx-auto">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
