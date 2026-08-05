# Milestone M1 Analysis Report: Persistent Dashboard Layout & Main Dashboard Refactor

## Executive Summary
This report presents the architectural design and code specifications for **Milestone M1: Persistent Dashboard Layout & Main Dashboard Refactor** in `getplaced.ai`.
Milestone M1 establishes the central layout boundary for all student dashboard routes (`/dashboard/*`). It implements a server-side cookie authentication guard checking `placely_student_id`, mounts a persistent sticky top `<Navbar />` to prevent re-render flickering, and refactors `app/dashboard/page.tsx` to eliminate duplicate Navbar rendering and redundant layout markup.

---

## 7-Step CTO Architectural Workflow Analysis

### STEP 1: Business Goal
The primary objective is to build a scalable, high-performance single-page application (SPA) shell for student dashboard experience.
- **Persistence**: Navigation between dashboard tabs (`/dashboard`, `/dashboard/roadmap`, `/dashboard/projects`, `/dashboard/mentor`, `/dashboard/settings`) must retain the `<Navbar />` mounted state without full page reloads or DOM flashes.
- **Security & Authorization**: All sub-routes under `/dashboard/*` must be protected at the server boundary. Unauthenticated users (missing `placely_student_id` cookie) must be immediately redirected to `/` before executing sub-page logic or API calls.
- **Maintainability**: Simplify sub-page authoring so future sub-routes do not need to repeat auth checks or Navbar imports.

### STEP 2: Edge Cases & Scenarios
1. **Unauthenticated Deep Linking**: Accessing `/dashboard/roadmap` directly with no `placely_student_id` cookie.
   - *Behavior*: `app/dashboard/layout.tsx` runs on the server, detects missing cookie, and triggers `redirect('/')` before rendering children.
2. **Client-Side Navigation**: Navigating between `/dashboard` and `/dashboard/projects`.
   - *Behavior*: Next.js App Router preserves `app/dashboard/layout.tsx` across sub-route transitions. `<Navbar />` remains mounted and intact.
3. **Missing Auth Token with Present Student ID**: `placely_student_id` cookie is set, but `placely_token` is missing or expired.
   - *Behavior*: Layout passes auth guard check; sub-page `fetchDashboardData` handles API response and falls back to `lib/mockData.ts` safely.
4. **Context Provider Decoupling**: `Navbar` relies on `useDashboard()` from `DashboardProvider.tsx`.
   - *Behavior*: `DashboardContext` has a safe fallback default value (`fallbackData`), enabling `<Navbar />` to render inside `layout.tsx` without requiring a top-level provider in `layout.tsx` if individual sub-pages manage their own providers.

### STEP 3: Best Architecture
- **Server Component Layout Shell (`app/dashboard/layout.tsx`)**:
  - Acts as a Server Component (async or standard export).
  - Reads `cookies()` from `next/headers`.
  - Validates presence of `placely_student_id`. If absent, executes `redirect('/')`.
  - Wraps `{children}` in a container `div` with styling `min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF7A00]/30 selection:text-[#FF7A00]`.
  - Renders `<Navbar />` above `{children}`.
- **Refactored Dashboard Overview (`app/dashboard/page.tsx`)**:
  - Removes `import Navbar from '@/components/dashboard/Navbar';`.
  - Removes duplicate `<Navbar />` component call.
  - Removes the outer `div` wrapper, leaving `<DashboardProvider>` wrapping `<main className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-16">`.

### STEP 4: Architecture Comparison & Justification
| Architecture Approach | Pros | Cons | Decision |
|---|---|---|---|
| **A. Persistent Server Layout (Chosen)** | Centralized auth guard for all `/dashboard/*` routes; persistent Navbar mounting; DRY sub-pages; zero client flash. | Requires layout structure compliance for sub-routes. | **Selected** |
| **B. Page-Level Auth & Navbar** | Independent page control. | Code duplication across 5+ routes; Navbar unmounts and remounts on tab switch causing layout flickering. | Rejected |
| **C. Global Middleware Redirect (`middleware.ts`)** | Intercepts at edge before route handler. | Adds global middleware complexity for solo founder; layout auth guard is more explicit and co-located with route hierarchy. | Rejected for M1 (Layout guard is sufficient and explicit) |

### STEP 5: Target Files to Change
1. `app/dashboard/layout.tsx` — **CREATE NEW FILE**
2. `app/dashboard/page.tsx` — **MODIFY FILE** (Refactor to remove duplicate Navbar & outer wrapper)

### STEP 6: Risk Analysis & Mitigation
- **Risk 1: Infinite Redirect Loop**: If `/` redirects to `/dashboard`, missing cookies could loop.
  - *Mitigation*: Public root route `/` (`public/index.html` or `app/page.tsx`) does not redirect to `/dashboard` unless authenticated.
- **Risk 2: Hydration Mismatches**: Dynamic cookie reading on server vs client.
  - *Mitigation*: Layout is a Pure Server Component using standard Next.js 14 `cookies()` and server-side `redirect()`.

### STEP 7: CTO Self-Critique & Transparency

1. **Critique of Chosen Design**:
   - In `layout.tsx`, `<Navbar />` is rendered outside of individual sub-page `<DashboardProvider>` components. `Navbar` falls back to `fallbackData` when sub-pages provide initialData asynchronously.
2. **Simpler Alternative Considered**:
   - Wrapping `layout.tsx` in a global client `DashboardProvider`.
3. **Why Rejected**:
   - Fetching student dashboard data in `layout.tsx` would delay rendering of all sub-pages until the main dashboard API call finishes. Keeping sub-page data fetching isolated ensures faster sub-route initial loads and independent page fetching.
4. **Confidence Level**: 98% (High confidence).
5. **Assumptions Made**:
   - Cookie `placely_student_id` is set upon successful student login in `public/index.html`.
   - Next.js 14 App Router conventions (`cookies()` from `next/headers`, `redirect()` from `next/navigation`).
6. **Uncertainties**: None.

---

## Exact Code Specifications

### 1. File Specification: `app/dashboard/layout.tsx` (To Be Created)

```tsx
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/dashboard/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const studentId = cookieStore.get('placely_student_id')?.value;

  if (!studentId) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF7A00]/30 selection:text-[#FF7A00]">
      <Navbar />
      {children}
    </div>
  );
}
```

---

### 2. File Specification: `app/dashboard/page.tsx` (Refactored)

```tsx
import React from 'react';
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
    </DashboardProvider>
  );
}
```

---

## Verification Plan
1. **File Integrity Verification**:
   - Inspect `app/dashboard/layout.tsx` to verify presence of `cookies().get('placely_student_id')`, `redirect('/')`, `<Navbar />`, and `{children}`.
   - Inspect `app/dashboard/page.tsx` to confirm removal of `import Navbar` and `<Navbar />`.
2. **Build Validation**:
   - Execute `npm run build` in `c:\Users\DELL\getplaced.ai` and verify zero compilation/TypeScript errors.
3. **Runtime & Auth Guard Verification**:
   - Verify unauthenticated HTTP request to `/dashboard` returns redirect (307/308) to `/`.
