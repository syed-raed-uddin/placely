import React from 'react';
import ProGate from '@/components/dashboard/ProGate';

export default function DSALayout({ children }: { children: React.ReactNode }) {
  return (
    <ProGate featureName="DSA Platform">
      {children}
    </ProGate>
  );
}
