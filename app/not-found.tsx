'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest">Placely</span>
          <h1 className="text-2xl font-extrabold tracking-tight">404 - Page Not Found</h1>
          <p className="text-sm text-white/60">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white text-sm font-semibold transition-all shadow-lg shadow-[#FF7A00]/25"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
