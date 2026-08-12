'use client';

import React, { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Dashboard Error Boundary caught error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-[#0A0A0A] text-white">
      <div className="max-w-md w-full p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            We couldn&apos;t load your dashboard
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Dashboard data is temporarily unavailable due to a connection error or server maintenance. Your account and progress remain safe.
          </p>
        </div>

        {error.message && (
          <div className="text-xs font-mono text-white/40 bg-black/40 p-3 rounded-lg border border-white/5 break-all text-left">
            {error.message}
          </div>
        )}

        <div className="pt-2 flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-3 px-6 rounded-xl font-medium text-sm bg-gradient-to-r from-[#FF7A00] to-[#FF9E00] text-black hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF7A00]/20"
          >
            <RefreshCw size={16} />
            Try again
          </button>
          
          <a
            href="/"
            className="text-xs text-white/40 hover:text-white/80 transition-colors pt-1"
          >
            Return to homepage
          </a>
        </div>
      </div>
    </div>
  );
}
