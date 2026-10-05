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
  Server,
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
  <InfoPageLayout title="About" icon={<Info className="w-10 h-10"/>} lastUpdated="October 5, 2026">
    <div className="space-y-8">
      <div className="text-lg md:text-xl text-slate-200 leading-relaxed border-l-4 border-blue-500 pl-6 py-2">
        <strong className="text-white">GeometryDashSpam.cc</strong> is a fan-made browser toolkit for practicing rapid input, wave control and click consistency.
      </div>

      <SectionCard title="What this site is for" icon={<Globe className="w-6 h-6"/>}>
        <p>
          The core tools isolate skills that are useful in Geometry Dash-style practice: repeated clicking, press-and-release timing, wave control and input consistency.
        </p>
        <p>
          The browser wave simulator uses its own practice-oriented movement model. It is not presented as an exact copy of the official Geometry Dash physics engine.
        </p>
      </SectionCard>

      <div>
        <h3 className="text-2xl font-display font-bold text-white mb-6">What We Offer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Spam Test', desc: 'Practice rapid wave-style input and compare run metrics.', icon: <CheckCircle className="w-5 h-5 text-green-400"/> },
            { title: 'Wave Trainer', desc: 'Normal, mini, precision and endless browser practice presets.', icon: <CheckCircle className="w-5 h-5 text-green-400"/> },
            { title: 'CPS Test', desc: 'Measure average CPS, rolling peak CPS and click-timing consistency.', icon: <CheckCircle className="w-5 h-5 text-green-400"/> },
            { title: 'Demon Guides', desc: 'Source-checked ranking snapshots and skill-focused practice references.', icon: <CheckCircle className="w-5 h-5 text-green-400"/> },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5">
              <div className="mt-1">{item.icon}</div>
              <div>
                <h4 className="font-bold text-white text-sm uppercase tracking-wide">{item.title}</h4>
                <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SectionCard title="How tool measurements are calculated">
        <p>
          Average CPS is registered clicks divided by elapsed test time. Peak CPS uses the busiest rolling one-second window, while click consistency is derived from variation between registered input intervals.
        </p>
        <p>
          Browser tools only observe events that reach the page. Display cadence, pointer-event rate, key timing and reaction results can be affected by hardware, the operating system and browser scheduling, so they are presented as browser-side diagnostics rather than hardware certification.
        </p>
      </SectionCard>

      <SectionCard title="How we handle claims" icon={<Shield className="w-5 h-5"/>}>
        <p>
          Site-specific metrics are described as training diagnostics, not laboratory measurements. Time-sensitive Demon List and code claims show a checked date and link to the source used for verification.
        </p>
        <p>
          If a ranking, code or guide becomes outdated, the Contact page provides a correction route. We prefer replacing or qualifying an unsupported claim instead of preserving it for marketing.
        </p>
      </SectionCard>

      <div className="mt-8 p-4 bg-slate-900 rounded-lg border border-white/5 text-xs text-slate-500 text-center font-mono">
        GeometryDashSpam.cc is a fan-made project and is not affiliated with RobTop Games.
      </div>
    </div>
  </InfoPageLayout>
);

export const ContactPage = () => (
  <InfoPageLayout title="Contact" icon={<Mail className="w-10 h-10"/>} lastUpdated="October 5, 2026">
    <div className="space-y-8">
      <p className="text-lg text-slate-300">
        Send bug reports, correction requests, source updates or feature suggestions by email.
      </p>

      <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-900/40 to-indigo-900/20 border border-blue-500/30 flex flex-col items-center text-center space-y-6 shadow-2xl">
        <div className="p-4 bg-blue-600 rounded-full shadow-lg shadow-blue-500/40">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Email</h3>
          <p className="text-blue-200/80 max-w-md mx-auto">
            For site support, ranking corrections and tool feedback.
          </p>
        </div>
        <a
          href="mailto:info@geometrydashspam.cc"
          className="px-8 py-4 bg-white hover:bg-slate-100 text-blue-900 font-bold text-lg rounded-xl transition-colors shadow-xl flex items-center gap-3"
        >
          info@geometrydashspam.cc <ExternalLink className="w-5 h-5 opacity-50"/>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Useful details to include">
          <p>For a bug report, include the page URL, browser/device, the action you took and what happened.</p>
        </SectionCard>
        <SectionCard title="Official game support">
          <p>We can only help with this website. Account, purchase or server issues for the official Geometry Dash game should be directed to its official support channels.</p>
        </SectionCard>
      </div>
    </div>
  </InfoPageLayout>
);

export const PrivacyPage = () => (
  <InfoPageLayout title="Privacy Policy" icon={<Shield className="w-10 h-10"/>} lastUpdated="October 5, 2026">
    <div className="space-y-4">
      <p className="mb-8 text-slate-300">
        This page explains the data used by <strong>GeometryDashSpam.cc</strong>. The interactive tools do not require an account.
      </p>

      <SectionCard title="1. Local browser data" icon={<Server className="w-5 h-5"/>}>
        <p>
          Supported tools store settings and personal-best values in your browser&apos;s local storage. That local data is used to restore your preferences and records on the same browser.
        </p>
        <p>
          Examples include selected difficulty, sound settings, CPS best scores, recent CPS and wave-run history, wave personal bests and clicker progress.
        </p>
      </SectionCard>

      <SectionCard title="2. Advertising and third-party requests" icon={<Cookie className="w-5 h-5"/>}>
        <p>
          The site loads Google AdSense. Google and its advertising partners may use cookies or similar technologies for ad delivery, measurement, fraud prevention and related purposes according to their own policies and the consent requirements that apply to the visitor.
        </p>
        <p>
          The site should not be understood as claiming that all data remains only on-device: advertising requests can involve third-party network services.
        </p>
      </SectionCard>

      <SectionCard title="3. Information you send us" icon={<Mail className="w-5 h-5"/>}>
        <p>
          If you email us, the message and contact information you provide are processed for the purpose of reading and responding to that request.
        </p>
      </SectionCard>

      <SectionCard title="4. Children" icon={<Lock className="w-5 h-5"/>}>
        <p>
          The site does not require users to create profiles or submit age information. Do not send personal information through email unless it is necessary for a support request.
        </p>
      </SectionCard>

      <SectionCard title="5. Your browser controls">
        <p>
          You can clear locally stored tool data through your browser settings. Advertising and cookie controls may also be available through your browser and any consent interface shown on the site.
        </p>
      </SectionCard>

      <div className="text-center pt-8 border-t border-white/10">
        <p className="text-slate-500 text-sm">
          Privacy questions: <a href="mailto:info@geometrydashspam.cc" className="text-blue-400 hover:text-white transition-colors">info@geometrydashspam.cc</a>
        </p>
      </div>
    </div>
  </InfoPageLayout>
);

export const TermsPage = () => (
  <InfoPageLayout title="Terms of Use" icon={<FileText className="w-10 h-10"/>} lastUpdated="October 5, 2026">
    <div className="space-y-6">
      <p className="text-slate-300 mb-6">
        These terms describe permitted use of <strong>GeometryDashSpam.cc</strong> and its browser-based tools.
      </p>

      <SectionCard title="1. Personal use">
        <p>
          You may use the site for personal entertainment, testing and practice. Do not use the service in a way that disrupts the site, attempts unauthorized access, or misrepresents site-generated results as independently verified records.
        </p>
      </SectionCard>

      <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-6 md:p-8">
        <h3 className="text-xl font-bold text-yellow-500 flex items-center gap-2 mb-4">
          <AlertTriangle className="w-6 h-6" /> 2. Simulator and measurement disclaimer
        </h3>
        <p className="text-slate-300 leading-relaxed">
          The browser tools are provided for practice and informal measurement. The wave trainer uses its own movement model, and browser timing can be affected by device hardware, operating system, browser scheduling and display conditions. Results are not guaranteed to match the official Geometry Dash client or laboratory equipment.
        </p>
      </div>

      <SectionCard title="3. External sources and links">
        <p>
          Some guides link to third-party sources such as live ranking sites. Those services control their own content and availability. A dated snapshot on this site may become outdated after its verification date.
        </p>
      </SectionCard>

      <SectionCard title="4. Availability and changes">
        <p>
          Features, content and tools may be changed, corrected or removed. We do not guarantee uninterrupted availability of every page or third-party dependency.
        </p>
      </SectionCard>

      <SectionCard title="5. Fan-made status">
        <p>
          GeometryDashSpam.cc is an independent fan-made project and is not affiliated with RobTop Games. References to Geometry Dash are used to describe the subject of the tools and guides.
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
          Geometry Dash Core & Reference
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
            { view: "/geometry-dash-codes", label: "Geometry Dash Codes", desc: "Vault, Vault of Secrets, Chamber of Time and Wraith codes." },
            { view: "/geometry-dash-vault-of-secrets-codes", label: "Vault of Secrets Codes", desc: "Dedicated code list and unlock instructions." },
            { view: "/how-to-get-diamonds-geometry-dash", label: "How to Get Diamonds", desc: "Official diamond sources and progression routine." },
            { view: "/how-to-get-gold-keys-geometry-dash", label: "How to Get Gold Keys", desc: "Event and Secret Room methods plus Treasure Room use." },
            { view: "/geometry-dash-difficulty-faces", label: "Geometry Dash Difficulty Faces", desc: "Difficulty ratings, star ranges and Demon sub-difficulties." },
            { view: "/geometry-dash-stuttering-high-end-pc", label: "Geometry Dash PC Stuttering", desc: "Evidence-aware troubleshooting for high-end PC frame stutter." },

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

      <div id="browser-utilities" className="bg-slate-950/30 border border-white/5 rounded-xl p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-3 border-b border-white/10 pb-2">
          Input & Hardware Tools
        </h2>
        <p className="mb-5 text-sm leading-6 text-slate-500">
          Supporting click, keyboard and hardware diagnostics that directly relate to Geometry Dash input practice. General-purpose browser tests are intentionally kept out of the search sitemap.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["/jitter-click", "Jitter Click"],
            ["/butterfly-click", "Butterfly Click"],
            ["/drag-click", "Drag Click"],
            ["/right-click", "Right Click CPS"],
            ["/double-click", "Double Click Test"],
            ["/spacebar-counter", "Spacebar Counter"],
            ["/polling-rate", "Mouse Polling Rate"],
            ["/keyboard-latency", "Keyboard Timing"],
            ["/keyboard-ghosting", "Keyboard Ghosting"],
            ["/key-rollover", "Key Rollover"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg border border-white/5 bg-black/15 px-3 py-2 text-sm text-slate-400 hover:border-blue-500/30 hover:text-white">
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-slate-950/30 border border-white/5 rounded-xl p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-4 border-b border-white/10 pb-2">
          Related Rhythm Games
        </h2>
        <div className="grid gap-3">
          <Link href="/geometry-dash-breeze" className="group block rounded-lg border border-white/5 bg-black/15 p-4 hover:border-sky-500/30">
            <div className="font-bold text-sky-400 group-hover:underline">Geometry Dash Breeze</div>
            <p className="mt-1 text-sm text-slate-400">Fan-made spinoff with source-checked release and platform information.</p>
          </Link>
          <Link href="/dashmetry" className="group block rounded-lg border border-white/5 bg-black/15 p-4 hover:border-cyan-500/30">
            <div className="font-bold text-cyan-400 group-hover:underline">Dashmetry / Challenge Rush</div>
            <p className="mt-1 text-sm text-slate-400">Legacy Dashmetry search intent connected to the current Challenge Rush game.</p>
          </Link>
        </div>
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
