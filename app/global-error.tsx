'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
          <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
          <p className="text-slate-400 mb-6 max-w-md text-center">
            {error.message || "An unexpected error occurred in the application."}
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
