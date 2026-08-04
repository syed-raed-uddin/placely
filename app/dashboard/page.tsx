import React from 'react';
import Navbar from '@/components/dashboard/Navbar';
import HeroGreeting from '@/components/dashboard/HeroGreeting';
import TodaysMission from '@/components/dashboard/TodaysMission';
import RoadmapCard from '@/components/dashboard/RoadmapCard';
import ProjectCard from '@/components/dashboard/ProjectCard';
import CareerBreakdown from '@/components/dashboard/CareerBreakdown';
import PlacementJourney from '@/components/dashboard/PlacementJourney';
import PlacementTracker from '@/components/dashboard/PlacementTracker';
import AIMentorPreview from '@/components/dashboard/AIMentorPreview';
import QuickActions from '@/components/dashboard/QuickActions';
import StreakXPCard from '@/components/dashboard/StreakXPCard';
import { DashboardProvider } from '@/components/dashboard/DashboardProvider';
import { fetchDashboardData } from '@/lib/api';
import { dashboardData as fallbackData, DashboardData, TaskItem } from '@/lib/mockData';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBackendToDashboard(backendData: any): DashboardData {
  const merged = JSON.parse(JSON.stringify(fallbackData)) as DashboardData;
  if (!backendData) return merged;

  try {
    // 1. User
    if (backendData.student) {
      merged.user.name = backendData.student.name;
      const initials = backendData.student.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2);
      merged.user.initials = initials;
    }

    // 2. Streak
    if (backendData.streak) {
      merged.streak.current = backendData.streak.current_streak || 0;
      merged.streak.longest = backendData.streak.longest_streak || 0;
    }

    // 3. Roadmap / Progress
    if (backendData.skill) {
      merged.currentRoadmap.name = backendData.skill.name;
      // Find current module based on enrollment current_day
      const currentDay = backendData.enrollment?.current_day || 1;
      let currentModuleTitle = 'Module';
      let doneTasks = 0;
      let totalTasks = 0;
      const todayTasksList: TaskItem[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (backendData.phases || []).forEach((phase: any) => {
        let hasCurrentDayTask = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (phase.tasks || []).forEach((task: any) => {
          totalTasks++;
          if (task.progress?.status === 'completed') doneTasks++;
          if (task.day_number === currentDay) {
            hasCurrentDayTask = true;
            todayTasksList.push({
              id: task.id.toString(),
              title: task.title,
              estimatedTime: '45 mins',
              xpReward: 100,
              priority: 'High',
              completed: task.progress?.status === 'completed',
            });
          }
        });
        if (hasCurrentDayTask) currentModuleTitle = phase.title;
      });

      merged.currentRoadmap.currentModule = currentModuleTitle;
      merged.currentRoadmap.modulesCompleted = backendData.enrollment?.current_day - 1 || 0;
      merged.currentRoadmap.totalModules = backendData.skill.total_days || 0;
      
      const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
      merged.careerReadiness.score = progressPercent;
      
      // Always override so we don't fall back to mock data
      merged.todayTasks = todayTasksList;
    }

    // 4. Milestone
    if (backendData.next_milestone) {
      merged.careerReadiness.nextMilestone = backendData.next_milestone.title;
    }

    // 5. Zero out unimplemented features so they don't show fake example data for new students
    // The user wants to see real (empty) states until they actually start them.
    merged.currentProject = null as unknown as typeof merged.currentProject; 
    
    // Clear out Career Breakdown so Python students don't see "System Design"
    merged.careerBreakdown = [];

    // Clear out AI Mentor mock questions so Python students don't see "Graph Dijkstra"
    merged.aiMentor.suggestedQuestions = [];
    merged.aiMentor.lastMessage = "Hello! I am your AI Mentor. Let me know if you need help with your current mission.";

    merged.placementJourney = merged.placementJourney.map((stage, idx) => ({
      ...stage,
      status: idx === 0 ? 'Current' : 'Locked'
    }));

  } catch (err) {
    console.error('Error mapping backend data:', err);
  }

  return merged;
}

export default async function DashboardPage() {
  const cookieStore = cookies();
  const studentId = cookieStore.get('placely_student_id')?.value;
  const token = cookieStore.get('placely_token')?.value;

  if (!studentId) {
    redirect('/');
  }

  const backendData = await fetchDashboardData(studentId, token);
  const realData = mapBackendToDashboard(backendData);

  return (
    <DashboardProvider initialData={realData}>
      <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF7A00]/30 selection:text-[#FF7A00]">
        <Navbar />
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
              <PlacementJourney />
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
      </div>
    </DashboardProvider>
  );
}
