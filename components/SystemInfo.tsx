"use client";

import { useEffect, useState } from "react";
import {
  Cpu,
  Eye,
  Globe,
  Maximize,
  Monitor,
  Wifi,
  type LucideIcon,
} from "lucide-react";

type SystemDetails = {
  os: string;
  browser: string;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  pixelRatio: number;
  language: string;
  cookiesEnabled: boolean;
  platform: string;
  hardwareConcurrency: number | "Unknown";
  memory: number | "Unknown";
  onLine: boolean;
};

function detectBrowserAndOs(userAgent: string) {
  const ua = userAgent;
  let browserName = "Unknown";

  if (/EdgA\/|EdgiOS\/|Edg\//.test(ua)) browserName = "Microsoft Edge";
  else if (/SamsungBrowser\//.test(ua)) browserName = "Samsung Internet";
  else if (/OPR\/|Opera\//.test(ua)) browserName = "Opera";
  else if (/FxiOS\/|Firefox\//.test(ua)) browserName = "Mozilla Firefox";
  else if (/CriOS\/|Chrome\//.test(ua)) browserName = "Google Chrome";
  else if (/Safari\//.test(ua)) browserName = "Apple Safari";
  else if (/Trident\//.test(ua)) browserName = "Microsoft Internet Explorer";

  let osName = "Unknown OS";
  if (/Android/.test(ua)) osName = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) osName = "iOS";
  else if (/Windows|Win64|Win32/.test(ua)) osName = "Windows";
  else if (/Macintosh|Mac OS X/.test(ua)) osName = "macOS";
  else if (/X11/.test(ua)) osName = "UNIX";
  else if (/Linux/.test(ua)) osName = "Linux";

  return { browserName, osName };
}

function InfoCard({
  icon: Icon,
  title,
  value,
  detail,
}: {
  icon: LucideIcon;
  title: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl flex flex-col gap-2">
      <div className="flex items-center gap-3 text-slate-400 mb-2">
        <Icon className="w-5 h-5 text-blue-400" />
        <span className="font-bold text-sm tracking-widest uppercase">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {detail ? <div className="text-sm text-slate-500">{detail}</div> : null}
    </div>
  );
}

export default function SystemInfo() {
  const [info, setInfo] = useState<SystemDetails | null>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const detected = detectBrowserAndOs(userAgent);
    const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };

    setInfo({
      os: detected.osName,
      browser: detected.browserName,
      userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency || "Unknown",
      memory: navigatorWithMemory.deviceMemory ?? "Unknown",
      onLine: navigator.onLine,
    });

    const syncOnlineStatus = () => {
      setInfo((current) =>
        current && current.onLine !== navigator.onLine
          ? { ...current, onLine: navigator.onLine }
          : current
      );
    };

    window.addEventListener("online", syncOnlineStatus);
    window.addEventListener("offline", syncOnlineStatus);
    return () => {
      window.removeEventListener("online", syncOnlineStatus);
      window.removeEventListener("offline", syncOnlineStatus);
    };
  }, []);

  if (!info) {
    return <div className="text-center py-20 text-slate-500">Scanning System...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 animate-in fade-in duration-700">
        <InfoCard
          icon={Globe}
          title="Browser"
          value={info.browser}
          detail={`Cookies Enabled: ${info.cookiesEnabled ? "Yes" : "No"}`}
        />
        <InfoCard
          icon={Monitor}
          title="Operating System"
          value={info.os}
          detail={`Platform: ${info.platform}`}
        />
        <InfoCard
          icon={Maximize}
          title="Screen Resolution"
          value={`${info.screenWidth} x ${info.screenHeight}`}
          detail={`Pixel Ratio: ${info.pixelRatio}x`}
        />
        <InfoCard icon={Cpu} title="CPU Threads" value={info.hardwareConcurrency} detail="Logical cores available" />
        <InfoCard icon={Eye} title="Color Depth" value={`${info.colorDepth}-bit`} detail="Display output" />
        <InfoCard
          icon={Wifi}
          title="Network Status"
          value={info.onLine ? "Online" : "Offline"}
          detail={`Language: ${info.language}`}
        />
      </div>

      <div className="bg-black/40 border border-white/10 p-6 rounded-2xl animate-in fade-in duration-700 delay-100 mb-16">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Raw User Agent</h2>
        <div className="font-mono text-sm text-emerald-400 bg-black/60 p-4 rounded-xl border border-white/5 break-words">
          {info.userAgent}
        </div>
      </div>
    </div>
  );
}
