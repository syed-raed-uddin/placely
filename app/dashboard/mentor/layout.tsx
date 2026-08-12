import React from 'react';
import ProGate from '@/components/dashboard/ProGate';

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProGate featureName="AI Mentor">
      {children}
    </ProGate>
  );
}
