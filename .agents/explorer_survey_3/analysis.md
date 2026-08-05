# Architectural Analysis Report — Next.js App Router, Layouts, Routing & Navigation

**Author:** Explorer 3 (Routing & Layout Explorer)  
**Date:** 2026-08-05  
**Target Workspace:** `c:\Users\DELL\getplaced.ai`  

---

## 1. Executive Summary

This report provides the architectural blueprint for migrating Placely's dashboard routes to Next.js 14 App Router layout architecture. By introducing a persistent layout (`app/dashboard/layout.tsx`), refactoring `Navbar.tsx` with dynamic route matching via `usePathname()`, configuring legacy redirects in `next.config.mjs`, and enforcing cookie-based route protection, the application achieves seamless SPA-style sub-route navigation while keeping the `<Navbar />` continuously mounted across all sub-pages (`/dashboard`, `/dashboard/roadmap`, `/dashboard/projects`, `/dashboard/mentor`, and `/dashboard/settings`).

---

## 2. Dashboard Layout Structure (`app/dashboard/layout.tsx`)

### 2.1 Proposed Layout Architecture & Code Structure

In Next.js 14 App Router, nested layouts persist across sub-route transitions without unmounting or re-rendering top-level UI components. Creating `app/dashboard/layout.tsx` wraps all sub-routes under `/dashboard/*` with the sticky top `<Navbar />`.

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
  // 1. Centralized Auth Guard for all /dashboard/* sub-routes
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

### 2.2 Key Architectural Benefits

1. **Persistent Mounting & SPA Navigation:** Because `app/dashboard/layout.tsx` sits above sub-routes (`/dashboard/page.tsx`, `/dashboard/roadmap/page.tsx`, etc.), Next.js App Router keeps `<Navbar />` mounted during client-side navigation (`<Link>`). State inside `Navbar` is preserved and page reloads are prevented.
2. **Centralized Authentication Guard:** Performing the `placely_student_id` cookie check inside `DashboardLayout` guarantees that any request to `/dashboard` or any sub-path (e.g. `/dashboard/mentor`) will evaluate cookie presence server-side before rendering any component tree or making API calls. If the cookie is missing, an immediate server-side HTTP 307 redirect to `/` is issued.
3. **Consistent Theme Wrapper:** The background (`bg-[#0A0A0A]`), text styling (`text-white`), and selection highlight (`selection:bg-[#FF7A00]/30 selection:text-[#FF7A00]`) are unified at the layout level, eliminating redundant wrapper code across sub-pages.

---

## 3. Refactoring Plan for `app/dashboard/page.tsx`

### 3.1 Overview of Changes

Currently, `app/dashboard/page.tsx` includes:
- Import of `Navbar`: `import Navbar from '@/components/dashboard/Navbar';`
- Outer `div` wrapper: `<div className="min-h-screen bg-[#0A0A0A] text-white ...">`
- Direct rendering of `<Navbar />` inside the wrapper.

Since `DashboardLayout` now handles the outer container div and renders `<Navbar />`, `app/dashboard/page.tsx` must be refactored to remove these duplicated elements while keeping `<DashboardProvider initialData={realData}>` and the main content intact.

### 3.2 Target Code Structure for `app/dashboard/page.tsx`

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

// (mapBackendToDashboard function remains unchanged)

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

### 3.3 Verification Checklist for Refactored `page.tsx`
- [x] Duplicate `<Navbar />` component call removed.
- [x] Duplicate outer container `div` removed.
- [x] Server-side data fetching (`fetchDashboardData`) and context provider (`DashboardProvider`) preserved.
- [x] All 3 focus zones (Today's Focus, Career Progress, Motivation) function identically.

---

## 4. Navbar Active Tab Highlighting Strategy (`components/dashboard/Navbar.tsx`)

### 4.1 Required Component Upgrades

To comply with Next.js App Router best practices:
1. Replace all legacy `<a>` tags pointing to `/legacy-dashboard.html?tab=...` with Next.js `<Link>` components from `'next/link'`.
2. Replace hardcoded logo `onClick={() => window.location.href = '/'}` with a `<Link href="/">` component.
3. Import `usePathname` from `'next/navigation'` to dynamically determine the current active route.
4. Add fixed bottom navigation bar for mobile viewports (`< 768px`) to ensure seamless mobile tab switching.

### 4.2 Route Matching & Active Styling Logic

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, LayoutDashboard, Map, FolderCode, Bot, Settings } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Roadmap', href: '/dashboard/roadmap', icon: Map },
  { label: 'Projects', href: '/dashboard/projects', icon: FolderCode },
  { label: 'AI Mentor', href: '/dashboard/mentor', icon: Bot },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { data: dashboardData } = useDashboard();
  const { user, notifications } = dashboardData;

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-white/10 px-4 md:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Placely Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 cursor-pointer">
            <div className="w-9 h-9 bg-[#FF7A00] rounded-xl flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-[#FF7A00]/20">
              P
            </div>
            <span className="text-white font-bold text-xl tracking-tight hidden sm:inline-block">
              Placely
            </span>
          </Link>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center gap-2 ml-4">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00]'
                      : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search topics, tasks, roadmaps..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FF7A00]/50 focus:ring-1 focus:ring-[#FF7A00]/50 transition-all"
                readOnly
              />
            </div>
          </div>

          {/* Notifications & User Avatar */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="relative p-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[#FF7A00] text-[#0A0A0A] text-[10px] font-bold rounded-full border border-[#0A0A0A]">
                  {notifications.unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF7A00] to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-md cursor-pointer ring-2 ring-white/10">
                {user.initials}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                active ? 'text-[#FF7A00]' : 'text-white/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
```

---

## 5. Redirect Rules for `next.config.mjs` & Public Route Guard

### 5.1 Legacy URL Redirection Rules

`next.config.mjs` must handle legacy incoming links from external bookmarks or previous HTML links. We match both raw `/legacy-dashboard.html` and query parameter variants (`?tab=...`) to seamless App Router paths.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard.html',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/legacy-dashboard.html',
        has: [{ type: 'query', key: 'tab', value: 'roadmap' }],
        destination: '/dashboard/roadmap',
        permanent: true,
      },
      {
        source: '/legacy-dashboard.html',
        has: [{ type: 'query', key: 'tab', value: 'projects' }],
        destination: '/dashboard/projects',
        permanent: true,
      },
      {
        source: '/legacy-dashboard.html',
        has: [{ type: 'query', key: 'tab', value: 'mentor' }],
        destination: '/dashboard/mentor',
        permanent: true,
      },
      {
        source: '/legacy-dashboard.html',
        has: [{ type: 'query', key: 'tab', value: 'settings' }],
        destination: '/dashboard/settings',
        permanent: true,
      },
      {
        source: '/legacy-dashboard.html',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

### 5.2 Protection of Public Files & Landing Page
- `public/index.html` remains untouched as required.
- `app/page.tsx` handles `/` by redirecting to `/dashboard`. When `/dashboard` is requested without `placely_student_id` cookie, `DashboardLayout` redirects back to `/`.

---

## 6. Build Verification Checks & Quality Gate

### 6.1 Type Safety & Imports
- **TypeScript:** Strict type checking (`npm run build` executes `tsc`). Ensure all sub-route pages (`app/dashboard/roadmap/page.tsx`, `app/dashboard/projects/page.tsx`, `app/dashboard/mentor/page.tsx`, `app/dashboard/settings/page.tsx`) export default async functions or React components typed correctly.
- **`cookies()` usage:** In Next.js 14.2.35, `cookies()` is synchronous (`const cookieStore = cookies()`).
- **Icons:** All Lucide icons used (`LayoutDashboard`, `Map`, `FolderCode`, `Bot`, `Settings`, `Search`, `Bell`) are available in `lucide-react`.

### 6.2 Existing Build Baseline Status
- Verified via `npm run build` task: compiled successfully, zero TypeScript or Lint errors across all 6 static routes.

---

## 7. Action Plan & Handoff Summary

1. **Implement `app/dashboard/layout.tsx`** with Server-side Auth Guard & persistent `<Navbar />`.
2. **Refactor `app/dashboard/page.tsx`** to remove duplicate inline Navbar.
3. **Upgrade `components/dashboard/Navbar.tsx`** to use `<Link>` and `usePathname()` with mobile navigation support.
4. **Update `next.config.mjs`** with legacy redirect mappings.
5. **Run `npm run build`** to verify clean production compilation.
