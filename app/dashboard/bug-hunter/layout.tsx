import React from 'react';
import ProGate from '@/components/dashboard/ProGate';

export default function BugHunterLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProGate featureName="Bug Hunter">
      {children}
    </ProGate>
  );
}
