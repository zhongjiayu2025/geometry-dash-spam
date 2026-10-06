import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="flex min-h-[50vh] w-full flex-col items-center justify-center animate-in fade-in duration-500"
      role="status"
      aria-label="Loading Geometry Dash tools"
    >
      <div className="relative" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-500" />
        <Loader2 className="h-12 w-12 text-blue-500 opacity-0" />
      </div>
    </div>
  );
}
