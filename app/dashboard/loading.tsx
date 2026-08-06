import React from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#FF7A00] animate-spin" />
      </div>
      <p className="text-white/40 text-sm font-medium tracking-wide">
        Loading...
      </p>
    </div>
  );
}
