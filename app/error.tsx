'use client';

import { useEffect } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
      <h2 className="text-3xl font-display font-bold text-white mb-4">Something went wrong!</h2>
      <p className="text-slate-400 max-w-md mx-auto mb-8">
        We encountered an unexpected issue while loading this tool. Please try refreshing or resetting.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 font-bold transition-colors"
      >
        <RotateCcw className="w-5 h-5" /> Try again
      </button>
    </div>
  );
}
