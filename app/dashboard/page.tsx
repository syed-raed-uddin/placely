import React from 'react';
import HeroGreeting from '@/components/dashboard/HeroGreeting';
import TodaysMission from '@/components/dashboard/TodaysMission';
import RoadmapCard from '@/components/dashboard/RoadmapCard';
import ProjectCard from '@/components/dashboard/ProjectCard';
import CareerBreakdown from '@/components/dashboard/CareerBreakdown';
import PlacementTracker from '@/components/dashboard/PlacementTracker';
import AIMentorPreview from '@/components/dashboard/AIMentorPreview';
import QuickActions from '@/components/dashboard/QuickActions';
import StreakXPCard from '@/components/dashboard/StreakXPCard';

// Auth, data fetching, and DashboardProvider are now handled by app/dashboard/layout.tsx

export default function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-16">
      {/* Zone 1: TODAY'S FOCUS */}
      <section>
        <h2 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">
          TODAY&apos;S FOCUS
        </h2>
        <div className="space-y-6">
          <HeroGreeting />
          <TodaysMission />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RoadmapCard />
            <ProjectCard />
          </div>
        </div>
      </section>

      {/* Zone 2: CAREER PROGRESS */}
      <section>
        <h2 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">
          CAREER PROGRESS
        </h2>
        <div className="space-y-6">
          <CareerBreakdown />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PlacementTracker />
            <AIMentorPreview />
          </div>
        </div>
      </section>

      {/* Zone 3: MOTIVATION */}
      <section>
        <h2 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">
          MOTIVATION
        </h2>
        <div className="space-y-6">
          <QuickActions />
          <StreakXPCard />
        </div>
      </section>
    </main>
  );
}
