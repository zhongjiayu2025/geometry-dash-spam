import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        <Loader2 className="w-12 h-12 text-blue-500 opacity-0" />
      </div>
      <p className="mt-4 text-sm text-slate-400 font-mono tracking-widest uppercase animate-pulse">Loading...</p>
    </div>
  );
}
