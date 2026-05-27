import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-6xl font-display font-bold text-white mb-4">404</h2>
      <p className="text-xl text-slate-400 mb-8 max-w-md mx-auto">
        Oops! We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 font-bold transition-colors shadow-lg">
        <Home className="w-5 h-5" /> Back to Home
      </Link>
    </div>
  );
}
