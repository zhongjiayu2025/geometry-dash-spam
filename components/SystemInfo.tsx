"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));
import { Monitor, Cpu, Globe, Search, Wifi, Clock, Eye, Maximize } from 'lucide-react';


export default function SystemInfo() {
    const [info, setInfo] = useState<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const getBrowserInfo = () => {
            const ua = navigator.userAgent;
            let browserName = "Unknown";
            let osName = "Unknown OS";

            if (ua.indexOf("Firefox") > -1) browserName = "Mozilla Firefox";
            else if (ua.indexOf("SamsungBrowser") > -1) browserName = "Samsung Internet";
            else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browserName = "Opera";
            else if (ua.indexOf("Trident") > -1) browserName = "Microsoft Internet Explorer";
            else if (ua.indexOf("Edge") > -1) browserName = "Microsoft Edge";
            else if (ua.indexOf("Chrome") > -1) browserName = "Google Chrome";
            else if (ua.indexOf("Safari") > -1) browserName = "Apple Safari";

            if (ua.indexOf("Win") > -1) osName = "Windows";
            else if (ua.indexOf("Mac") > -1) osName = "MacOS";
            else if (ua.indexOf("X11") > -1) osName = "UNIX";
            else if (ua.indexOf("Linux") > -1) osName = "Linux";
            else if (ua.indexOf("Android") > -1) osName = "Android";
            else if (ua.indexOf("like Mac OS X") > -1) osName = "iOS";

            return { browserName, osName, ua };
        };

        const bi = getBrowserInfo();

        setInfo({
            os: bi.osName,
            browser: bi.browserName,
            userAgent: bi.ua,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            colorDepth: window.screen.colorDepth,
            pixelRatio: window.devicePixelRatio,
            language: navigator.language,
            cookiesEnabled: navigator.cookieEnabled,
            platform: navigator.platform,
            hardwareConcurrency: navigator.hardwareConcurrency || "Unknown",
            memory: (navigator as any).deviceMemory || "Unknown",
            onLine: navigator.onLine,
        });
    }, []);

    if (!info) return <div className="text-center py-20 text-slate-500">Scanning System...</div>;

    const InfoCard = ({ icon: Icon, title, value, detail }: any) => (
        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-3 text-slate-400 mb-2">
                <Icon className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-sm tracking-widest uppercase">{title}</span>
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            {detail && <div className="text-sm text-slate-500">{detail}</div>}
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
            <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 mb-6">
                    <Search className="w-10 h-10 text-blue-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                    Browser & System Info
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    A quick diagnostic tool that reveals what your browser is telling the websites you visit.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 animate-in fade-in duration-700 delay-100">
                <InfoCard icon={Globe} title="Browser" value={info.browser} detail={`Cookies Enabled: ${info.cookiesEnabled ? 'Yes' : 'No'}`} />
                <InfoCard icon={Monitor} title="Operating System" value={info.os} detail={`Platform: ${info.platform}`} />
                <InfoCard icon={Maximize} title="Screen Resolution" value={`${info.screenWidth} x ${info.screenHeight}`} detail={`Pixel Ratio: ${info.pixelRatio}x`} />
                <InfoCard icon={Cpu} title="CPU Threads" value={info.hardwareConcurrency} detail="Logical cores available" />
                <InfoCard icon={Eye} title="Color Depth" value={`${info.colorDepth}-bit`} detail="Display output" />
                <InfoCard icon={Wifi} title="Network Status" value={info.onLine ? "Online" : "Offline"} detail={`Language: ${info.language}`} />
            </div>

            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl animate-in fade-in duration-700 delay-200 mb-16">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Raw User Agent</h3>
                <div className="font-mono text-sm text-emerald-400 bg-black/60 p-4 rounded-xl border border-white/5 break-words">
                    {info.userAgent}
                </div>
            </div>
            
            <RelatedTools currentTool="systemInfo" />
        </div>
    );
}
