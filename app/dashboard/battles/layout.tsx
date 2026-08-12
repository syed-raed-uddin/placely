import React from 'react';
import ProGate from '@/components/dashboard/ProGate';

export default function BattlesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProGate featureName="Global Battles">
      {children}
    </ProGate>
  );
}
