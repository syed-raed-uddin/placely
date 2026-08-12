import React from 'react';
import ProGate from '@/components/dashboard/ProGate';

export default function ProjectDefenseLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProGate featureName="Project Defense">
      {children}
    </ProGate>
  );
}
