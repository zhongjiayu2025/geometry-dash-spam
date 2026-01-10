import React from "react";
import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  metadataBase: new URL("https://geometrydashspam.cc"),
  title: {
    default: "Geometry Dash Spam Test | Ultimate Wave Simulator",
    template: "%s | Geometry Dash Spam"
  },
  description: "Master the wave with the ultimate Geometry Dash Spam Test. Free online simulator to train spam consistency, improve CPS, and beat Extreme Demons.",
  keywords: ["geometry dash spam", "geometry dash spam test", "wave simulator", "gd spam", "cps test", "jitter click", "butterfly click"],
  alternates: {
    canonical: './',
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo.svg',
    },
  },
  verification: {
    google: "Yz_6YlW_BzjxZVMUNDmQKQV3n-Jf8cRUr6sMnqJDzyQ",
  },
  openGraph: {
    type: "website",
    url: "https://geometrydashspam.cc",
    siteName: "Geometry Dash Spam Test",
    title: "Geometry Dash Spam Test",
    description: "Test your clicking speed and precision.",
    images: [{ url: "https://geometrydashspam.cc/logo.svg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geometry Dash Spam Test",
    description: "Master the wave with the ultimate simulator.",
    images: ["https://geometrydashspam.cc/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable} min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500 selection:text-white flex flex-col`}>
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-grid opacity-20"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[120px] opacity-15 bg-blue-600 transition-colors duration-1000"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent"></div>
        </div>

        <Header />
        
        <main className="relative z-10 flex-grow pt-24 md:pt-32 pb-12 px-4 w-full max-w-7xl mx-auto">
           {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}