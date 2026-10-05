"use client";

import React from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Cookie,
  ExternalLink,
  FileText,
  Globe,
  Info,
  Lock,
  Mail,
  Map,
  Shield,
} from "lucide-react";
import { BLOG_POSTS } from "../data/blogContent";
import Link from "next/link";

interface InfoPageProps {
  title: string;
  icon: React.ReactNode;
  lastUpdated: string;
  children: React.ReactNode;
}

const InfoPageLayout: React.FC<InfoPageProps> = ({
  title,
  icon,
  lastUpdated,
  children,
}) => (
  <div className="w-full max-w-5xl mx-auto">
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 pb-8 border-b border-white/10 relative z-10">
        <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
          {icon}
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3 tracking-tight">
            {title}
          </h1>
          <div className="text-sm font-mono text-slate-500">
            Last updated: {lastUpdated}
          </div>
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  </div>
);

const SectionCard: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <section className="bg-slate-950/30 border border-white/5 rounded-xl p-6 md:p-8 mb-6">
    <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
      {icon && <span className="text-blue-500">{icon}</span>}
      {title}
    </h2>
    <div className="text-slate-300 leading-relaxed space-y-4">{children}</div>
  </section>
);

export const AboutPage = () => (
  <InfoPageLayout
    title="About Geometry Dash Spam"
    icon={<Info className="w-10 h-10" />}
    lastUpdated="October 5, 2026"
  >
    <div className="space-y-8">
      <div className="text-lg md:text-xl text-slate-200 leading-relaxed border-l-4 border-blue-500 pl-6 py-2">
        <strong className="text-white">GeometryDashSpam.cc</strong> is a fan-made browser toolkit focused on Geometry Dash spam practice, wave control, CPS measurement and sourced Demon List reference pages.
      </div>

      <SectionCard title="What the site is for" icon={<Globe className="w-6 h-6" />}>
        <p>
          The site separates raw input speed from movement control. The CPS Test measures browser-recorded click timing, while the Spam Test and Wave Trainer turn repeated input into a playable control exercise.
        </p>
        <p>
          The simulator uses its own practice-oriented movement model. It is not presented as an exact recreation of the official Geometry Dash engine.
        </p>
      </SectionCard>

      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-6">What we maintain</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Spam & Wave Training",
              desc: "Difficulty presets, Mini Wave, Endless Mode and browser-side run metrics.",
            },
            {
              title: "CPS Measurement",
              desc: "1–60 second tests with average CPS, rolling one-second peak and timing consistency.",
            },
            {
              title: "Demon References",
              desc: "A dated Pointercrate Main List snapshot plus skill-focused wave and spam guides.",
            },
            {
              title: "Local Progress",
              desc: "Personal bests and clicker progress stored in your browser without an account.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5"
            >
              <CheckCircle className="w-5 h-5 text-green-400 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-white text-sm uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-slate-900 rounded-lg border border-white/5 text-xs text-slate-500 text-center font-mono">
        GeometryDashSpam.cc is an independent fan-made project and is not affiliated with RobTop Games.
      </div>
    </div>
  </InfoPageLayout>
);

export const ContactPage = () => (
  <InfoPageLayout
    title="Contact"
    icon={<Mail className="w-10 h-10" />}
    lastUpdated="October 5, 2026"
  >
    <div className="space-y-8">
      <p className="text-lg text-slate-300">
        Send bug reports, source corrections, privacy questions or feature suggestions by email.
      </p>

      <div className="p-8 md:p-12 rounded-3xl bg-blue-950/25 border border-blue-500/30 flex flex-col items-center text-center space-y-6">
        <div className="p-4 bg-blue-600 rounded-full">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Email</h2>
          <p className="text-blue-200/80 max-w-md mx-auto">
            Include the page URL and enough detail to reproduce a bug when possible.
          </p>
        </div>
        <a
          href="mailto:info@geometrydashspam.cc"
          className="px-6 py-3 bg-white hover:bg-slate-100 text-blue-900 font-bold rounded-xl transition-colors flex items-center gap-3"
        >
          info@geometrydashspam.cc <ExternalLink className="w-4 h-4 opacity-50" />
        </a>
      </div>

      <SectionCard title="Scope of support">
        <p>
          This contact address covers the tools and content on GeometryDashSpam.cc. For official Geometry Dash accounts, purchases or game-server issues, use RobTop Games&apos; official support channels.
        </p>
      </SectionCard>
    </div>
  </InfoPageLayout>
);

export const PrivacyPage = () => (
  <InfoPageLayout
    title="Privacy Policy"
    icon={<Shield className="w-10 h-10" />}
    lastUpdated="October 5, 2026"
  >
    <div className="space-y-4">
      <p className="mb-8 text-slate-300">
        This policy describes the data used by GeometryDashSpam.cc and the browser features used to save local progress.
      </p>

      <SectionCard title="1. Accounts and personal data" icon={<Lock className="w-5 h-5" />}>
        <p>
          The site does not require an account for its training tools. Personal-best scores, trainer preferences and clicker progress are stored locally in your browser where those features are supported.
        </p>
        <p>
          If you email us, the information in that message is necessarily provided to the email service used to receive and answer it.
        </p>
      </SectionCard>

      <SectionCard title="2. Local storage" icon={<Cookie className="w-5 h-5" />}>
        <p>Local storage is used for features such as:</p>
        <ul className="list-disc pl-5 space-y-2 text-slate-400">
          <li>Spam-test personal bests and trainer preferences.</li>
          <li>CPS personal-best scores.</li>
          <li>Geometry Dash Clicker progress and achievements.</li>
        </ul>
        <p className="text-sm text-slate-400">
          You can remove this information through your browser&apos;s site-data controls. Clearing local site data resets the saved progress.
        </p>
      </SectionCard>

      <SectionCard title="3. Advertising and third parties" icon={<Globe className="w-5 h-5" />}>
        <p>
          The site loads Google AdSense advertising. Google and its advertising partners may use cookies or similar technologies in accordance with their own policies and the consent choices available in your region.
        </p>
        <p>
          We do not describe advertising identifiers or third-party cookies as local-only data because they are controlled by the relevant third-party service.
        </p>
      </SectionCard>

      <SectionCard title="4. Children">
        <p>
          The site is a general gaming utility and does not provide account registration. If you believe personal information has been sent to us inappropriately, contact us so the issue can be reviewed.
        </p>
      </SectionCard>

      <div className="text-center pt-8 border-t border-white/10">
        <p className="text-slate-500 text-sm">
          Privacy questions:{" "}
          <a
            href="mailto:info@geometrydashspam.cc"
            className="text-blue-400 hover:text-white transition-colors"
          >
            info@geometrydashspam.cc
          </a>
        </p>
      </div>
    </div>
  </InfoPageLayout>
);

export const TermsPage = () => (
  <InfoPageLayout
    title="Terms of Use"
    icon={<FileText className="w-10 h-10" />}
    lastUpdated="October 5, 2026"
  >
    <div className="space-y-6">
      <p className="text-slate-300 mb-6">
        These terms govern use of the browser tools and content provided on GeometryDashSpam.cc.
      </p>

      <SectionCard title="1. Permitted use">
        <p>
          You may use the site for personal entertainment, practice and reference. Do not use automated traffic, abusive requests or other behavior intended to disrupt the service or falsify site-generated results.
        </p>
      </SectionCard>

      <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2 mb-4">
          <AlertTriangle className="w-6 h-6" /> 2. Simulator disclaimer
        </h2>
        <p className="text-slate-300 leading-relaxed">
          The browser simulator is a practice tool with its own movement model. Results may differ from the official Geometry Dash game because of game physics, hardware, browser behavior and input devices.
        </p>
      </div>

      <SectionCard title="3. Accuracy and availability">
        <p>
          We aim to keep tool behavior and sourced pages accurate, but rankings, external sources and browser behavior can change. Time-sensitive Demon List pages therefore show a verification date and link to the live source.
        </p>
        <p>
          The site may be changed, interrupted or removed without guaranteeing uninterrupted availability.
        </p>
      </SectionCard>

      <SectionCard title="4. Third-party names and services">
        <p>
          Geometry Dash and related names belong to their respective owners. References to third-party websites, products or services do not imply endorsement or affiliation unless explicitly stated.
        </p>
      </SectionCard>
    </div>
  </InfoPageLayout>
);

export const SitemapPage = () => (
  <InfoPageLayout
    title="Sitemap"
    icon={<Map className="w-10 h-10" />}
    lastUpdated="October 5, 2026"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-slate-950/30 border border-white/5 rounded-xl p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6 border-b border-white/10 pb-2">
          Core & Tools
        </h2>
        <ul className="space-y-4">
          {[
            { view: "/", label: "Geometry Dash Spam Test", desc: "Core wave-spam training tool." },
            { view: "/geometry-dash-wave", label: "Geometry Dash Wave Trainer", desc: "Normal, mini, spam, precision and endless presets." },
            { view: "/cps-test", label: "Geometry Dash CPS Test", desc: "1–60 second click speed and timing tests." },
            { view: "/demon-list", label: "Geometry Dash Demon List", desc: "Sourced top-50 Pointercrate snapshot." },
            { view: "/hardest-level", label: "Hardest Geometry Dash Level", desc: "Current #1 answer with verification date." },
            { view: "/easiest-demons", label: "Easiest Demons", desc: "Beginner-oriented practice references." },
            { view: "/demon-list/wave-demons", label: "Wave Demons", desc: "Wave-focused Demon List references." },
            { view: "/demon-list/spam-demons", label: "Spam Demons", desc: "Rapid-input practice references." },
            { view: "/geometry-dash-clicker", label: "Geometry Dash Clicker", desc: "Local-save orb clicker game." },
            { view: "/jitter-click", label: "Jitter Click Test", desc: "Jitter clicking practice." },
            { view: "/butterfly-click", label: "Butterfly Click Test", desc: "Two-finger clicking practice." },
            { view: "/drag-click", label: "Drag Click Test", desc: "Drag-click input practice." },
            { view: "/spacebar-counter", label: "Spacebar Counter", desc: "Keyboard press counter." },
            { view: "/polling-rate", label: "Mouse Polling Rate", desc: "Browser-observed pointer report rate." },
            { view: "/keyboard-latency", label: "Keyboard Latency Test", desc: "Browser-side key timing utility." },
            { view: "/reaction-test", label: "Reaction Time Test", desc: "Visual response practice." },
            { view: "/aim-trainer", label: "Aim Trainer", desc: "Mouse precision practice." },
            { view: "/typing-test", label: "Typing Test", desc: "Typing speed practice." },
            { view: "/visual-memory", label: "Visual Memory", desc: "Pattern memory practice." },
            { view: "/chimp-test", label: "Chimp Test", desc: "Sequence memory practice." },
            { view: "/refresh-rate", label: "Refresh Rate Test", desc: "Browser-observed display refresh rate." },
            { view: "/system-info", label: "System Information", desc: "Browser-exposed device information." },
          ].map((item) => (
            <li key={item.view}>
              <Link href={item.view} className="group block">
                <div className="flex items-center gap-2 text-blue-400 font-bold group-hover:underline">
                  {item.label}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-950/30 border border-white/5 rounded-xl p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6 border-b border-white/10 pb-2">
          Guides & Articles
        </h2>
        <ul className="space-y-4">
          {BLOG_POSTS.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="flex items-center gap-2 text-purple-400 font-bold group-hover:underline">
                  {post.title}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{post.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-2 bg-slate-950/30 border border-white/5 rounded-xl p-6">
        <h2 className="font-bold text-slate-400 mb-4 uppercase tracking-widest text-sm">
          Legal & Info
        </h2>
        <div className="flex flex-wrap gap-6">
          {["About", "Contact", "Privacy", "Terms"].map((page) => (
            <Link
              key={page}
              href={`/${page.toLowerCase()}`}
              className="text-slate-300 hover:text-white hover:underline"
            >
              {page}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </InfoPageLayout>
);
