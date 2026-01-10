import Link from 'next/link';
import { AlertOctagon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-in fade-in zoom-in duration-300">
        <AlertOctagon className="w-24 h-24 text-red-500 mb-6" />
        <h1 className="text-6xl font-display font-black text-white mb-4">404</h1>
        <p className="text-xl text-slate-400 mb-8 max-w-md">
            The level you are looking for has been deleted from the servers.
        </p>
        <Link 
            href="/"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all"
        >
            Return to Menu
        </Link>
    </div>
  );
}