import React, { useEffect } from 'react';
import { Mail, Shield, FileText, Info, CheckCircle, AlertTriangle, ExternalLink, Server, Globe, Lock, Cookie } from 'lucide-react';

interface InfoPageProps {
  title: string;
  icon: React.ReactNode;
  lastUpdated: string;
  children: React.ReactNode;
}

const InfoPageLayout: React.FC<InfoPageProps> = ({ title, icon, lastUpdated, children }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  
  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 pb-8 border-b border-white/10 relative z-10">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl text-blue-400 shadow-lg shadow-blue-900/20">
            {icon}
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3 tracking-tight drop-shadow-sm">{title}</h1>
            <div className="flex items-center gap-3 text-sm font-mono text-slate-400 bg-black/20 w-fit px-3 py-1 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
        
        {/* Content Body */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

const SectionCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-slate-950/30 border border-white/5 rounded-xl p-6 md:p-8 mb-6 hover:border-white/10 transition-colors">
    <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
      {icon && <span className="text-blue-500">{icon}</span>}
      {title}
    </h3>
    <div className="text-slate-300 leading-relaxed space-y-4">
      {children}
    </div>
  </div>
);

export const AboutPage = () => (
  <InfoPageLayout title="About Us" icon={<Info className="w-10 h-10"/>} lastUpdated="January 10, 2026">
    <div className="space-y-8">
      {/* Introduction */}
      <div className="text-lg md:text-xl text-slate-200 leading-relaxed font-light border-l-4 border-blue-500 pl-6 py-2">
        Welcome to <strong className="text-white">GeometryDashSpam.cc</strong>, the premier training facility engineered for Geometry Dash players who demand precision, speed, and consistency.
      </div>

      {/* Mission Section */}
      <SectionCard title="Our Mission" icon={<Globe className="w-6 h-6"/>}>
        <p>
          The meta of Geometry Dash has evolved. With the rise of "Extreme Demons" like <em>Slaughterhouse</em>, <em>Sakupen Circles</em>, and <em>VSC</em>, the physical demands on players have never been higher. Standard gameplay often isn't enough to train the specific muscle memory required for sustained high-CPS (Clicks Per Second) wave sections.
        </p>
        <p>
          We built this platform to bridge that gap. By replicating 2.2 physics in a web environment, we allow you to isolate and train your spam mechanics without the frustration of loading times or level restart delays.
        </p>
      </SectionCard>

      {/* Features Grid */}
      <div>
        <h3 className="text-2xl font-display font-bold text-white mb-6">What We Offer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Wave Simulator', desc: 'Adjustable physics from Easy to Extreme Demon.', icon: <CheckCircle className="w-5 h-5 text-green-400"/> },
            { title: 'CPS Analytics', desc: 'Precise 10-second speed tests with graphs.', icon: <CheckCircle className="w-5 h-5 text-green-400"/> },
            { title: 'Hardware Lab', desc: 'Spacebar latency and durability counters.', icon: <CheckCircle className="w-5 h-5 text-green-400"/> },
            { title: 'Knowledge Base', desc: 'Guides on mice, health, and technique.', icon: <CheckCircle className="w-5 h-5 text-green-400"/> },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all">
              <div className="mt-1">{item.icon}</div>
              <div>
                <h4 className="font-bold text-white text-sm uppercase tracking-wide">{item.title}</h4>
                <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-slate-900 rounded-lg border border-white/5 text-xs text-slate-500 text-center font-mono">
        GeometryDashSpam.cc is a fan-made project and is not affiliated with RobTop Games. All game assets are inspired by the official game.
      </div>
    </div>
  </InfoPageLayout>
);

export const ContactPage = () => (
  <InfoPageLayout title="Contact Us" icon={<Mail className="w-10 h-10"/>} lastUpdated="January 10, 2026">
    <div className="space-y-8">
      <p className="text-lg text-slate-300">
        Have a feature request? Found a physics bug? Or just want to show off your 15 CPS score? We want to hear from you.
      </p>

      {/* Main Contact Card */}
      <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-900/40 to-indigo-900/20 border border-blue-500/30 flex flex-col items-center text-center space-y-6 shadow-2xl">
        <div className="p-4 bg-blue-600 rounded-full shadow-lg shadow-blue-500/40">
           <Mail className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">General Inquiries</h3>
          <p className="text-blue-200/80 max-w-md mx-auto">For support, partnerships, and bug reports, please email us directly.</p>
        </div>
        <a 
          href="mailto:info@geometrydashspam.cc" 
          className="px-8 py-4 bg-white hover:bg-slate-100 text-blue-900 font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-xl flex items-center gap-3"
        >
          info@geometrydashspam.cc <ExternalLink className="w-5 h-5 opacity-50"/>
        </a>
      </div>

      {/* FAQ / Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Response Time">
           We are a small, dedicated team. We aim to respond to all legitimate emails within <strong>24-48 hours</strong>.
        </SectionCard>
        <SectionCard title="Scope of Support">
           We support our web tools only. For issues regarding the official Geometry Dash game account or servers, please contact RobTop Games.
        </SectionCard>
      </div>
    </div>
  </InfoPageLayout>
);

export const PrivacyPage = () => (
  <InfoPageLayout title="Privacy Policy" icon={<Shield className="w-10 h-10"/>} lastUpdated="January 10, 2026">
    <div className="space-y-4">
      <p className="mb-8 text-slate-300">
        At <strong>GeometryDashSpam.cc</strong> ("we", "us"), protecting your privacy is paramount. This policy outlines exactly what we do (and don't do) with your data.
      </p>

      <SectionCard title="1. Information Collection" icon={<Server className="w-5 h-5"/>}>
        <p><strong>Personal Data:</strong> We do <span className="text-green-400 font-bold">NOT</span> collect names, addresses, phone numbers, or require account registration.</p>
        <p><strong>Usage Data:</strong> We may collect anonymous metrics (browser type, device type, pages visited) to optimize our simulator's performance across different hardware.</p>
      </SectionCard>

      <SectionCard title="2. Local Storage & Cookies" icon={<Cookie className="w-5 h-5"/>}>
        <p>We use standard local storage technology to improve your experience. This data lives 100% on your device and includes:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
           <li>Your personal "Best Time" records in the simulator.</li>
           <li>Your preferred difficulty settings (so you don't have to reset them every visit).</li>
        </ul>
        <p className="mt-4 text-sm bg-slate-900/50 p-3 rounded border border-white/5">
           <strong>Note:</strong> You can wipe this data anytime by clearing your browser cache. We never see it.
        </p>
      </SectionCard>

      <SectionCard title="3. Third-Party Services" icon={<Globe className="w-5 h-5"/>}>
        <p>
           We may use trusted third-party services like Google Analytics to understand site traffic trends. These services may set their own cookies, governed by their respective privacy policies.
        </p>
      </SectionCard>

      <SectionCard title="4. Children's Privacy" icon={<Lock className="w-5 h-5"/>}>
        <p>
           Our tools are designed for general gaming audiences. We do not knowingly collect identifiable information from children under 13.
        </p>
      </SectionCard>

      <div className="text-center pt-8 border-t border-white/10">
        <p className="text-slate-500 text-sm">Questions? Contact us at <a href="mailto:info@geometrydashspam.cc" className="text-blue-400 hover:text-white transition-colors">info@geometrydashspam.cc</a></p>
      </div>
    </div>
  </InfoPageLayout>
);

export const TermsPage = () => (
  <InfoPageLayout title="Terms of Service" icon={<FileText className="w-10 h-10"/>} lastUpdated="January 10, 2026">
    <div className="space-y-6">
      <p className="text-slate-300 mb-6">
        By accessing <strong>https://geometrydashspam.cc</strong>, you agree to the following terms. Please read them carefully.
      </p>

      <SectionCard title="1. Use License">
        <p>We grant you a limited, revocable, non-exclusive license to access our tools for personal entertainment and training.</p>
        <div className="mt-4">
           <strong className="text-white block mb-2">You agree NOT to:</strong>
           <ul className="grid gap-2">
              <li className="flex items-center gap-2 text-sm text-slate-400"><div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> Reverse engineer the physics engine.</li>
              <li className="flex items-center gap-2 text-sm text-slate-400"><div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> Use automated bots to falsify leaderboard scores (if applicable).</li>
              <li className="flex items-center gap-2 text-sm text-slate-400"><div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> Frame or mirror this site without written consent.</li>
           </ul>
        </div>
      </SectionCard>

      <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-6 md:p-8">
        <h3 className="text-xl font-bold text-yellow-500 flex items-center gap-2 mb-4">
           <AlertTriangle className="w-6 h-6" /> 2. Disclaimer & Warranty
        </h3>
        <p className="text-slate-300 leading-relaxed">
           The materials on GeometryDashSpam.cc are provided "as is". While we strive for 1:1 physics accuracy with the official game, we make no warranties regarding the absolute precision of the simulation. We are not liable if your practice here does not perfectly translate to the Geometry Dash game client due to hardware differences.
        </p>
      </div>

      <SectionCard title="3. Limitations of Liability">
        <p>
           In no event shall GeometryDashSpam.cc be liable for any damages (including data loss or business interruption) arising out of the use or inability to use our website, even if we have been notified of the possibility of such damage.
        </p>
      </SectionCard>

      <SectionCard title="4. Governing Law">
        <p>
           These terms are governed by the laws applicable to internet standards and international regulations. We reserve the right to update these terms at any time without prior notice.
        </p>
      </SectionCard>
    </div>
  </InfoPageLayout>
);