# Milestone M6 Technical Analysis: Navigation Wiring & next.config.mjs Redirects

## Executive Summary
This analysis details the exact technical implementation required for **Milestone M6 (Navigation Wiring & `next.config.mjs` Redirects)** in the Placely Next.js 14 App Router codebase.

The goal of Milestone M6 is twofold:
1. Replace legacy HTML links (`/legacy-dashboard.html?tab=...`) in `components/dashboard/Navbar.tsx` with Next.js client-side `<Link>` tags and dynamic active route highlighting via `usePathname()`.
2. Configure permanent redirects in `next.config.mjs` to redirect incoming traffic from `/legacy-dashboard.html` (and tab query parameter variations) to their corresponding App Router routes (`/dashboard`, `/dashboard/roadmap`, `/dashboard/projects`, `/dashboard/mentor`, `/dashboard/settings`).

---

## 1. Codebase Baseline & Observation Summary

### A. Navbar Component (`components/dashboard/Navbar.tsx`)
- **Location**: `c:\Users\DELL\getplaced.ai\components\dashboard\Navbar.tsx` (Total lines: 83)
- **Current State**:
  - Line 5 imports `useDashboard` from `@/components/dashboard/DashboardProvider`.
  - Line 15 has hardcoded window redirection on logo click: `onClick={() => window.location.href = '/'}`.
  - Lines 26-40 contain standard HTML `<a>` tags with hardcoded legacy URLs:
    - Line 26: `<a href="/dashboard" className="px-4 py-2 rounded-xl text-sm font-semibold text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00] transition-colors">Dashboard</a>`
    - Line 29: `<a href="/legacy-dashboard.html?tab=roadmap" ...>Roadmap</a>`
    - Line 32: `<a href="/legacy-dashboard.html?tab=projects" ...>Projects</a>`
    - Line 35: `<a href="/legacy-dashboard.html?tab=mentor" ...>AI Mentor</a>`
    - Line 38: `<a href="/legacy-dashboard.html?tab=settings" ...>Settings</a>`
  - Active styling is currently hardcoded only on the first link ("Dashboard").

### B. Next Config (`next.config.mjs`)
- **Location**: `c:\Users\DELL\getplaced.ai\next.config.mjs` (Total lines: 15)
- **Current State**:
  - Contains a single redirect rule from `/dashboard.html` to `/dashboard`.
  - Lacks permanent redirect rules for `/legacy-dashboard.html` and query parameter variants (`?tab=...`).

### C. Build Baseline Observation (`components/dashboard/CircularRing.tsx`)
- Running `npm run build` during investigation revealed a pre-existing type check error in `components/dashboard/CircularRing.tsx:470:14`:
  `Type error: Cannot find name 'FolderGit2'.`
- **Root cause**: `FolderGit2` is used on line 470 of `CircularRing.tsx` but is missing from the `lucide-react` import statement on lines 4–19. Adding `FolderGit2` to `lucide-react` imports in `CircularRing.tsx` resolves this pre-existing build error.

### D. Other Codebase References
- **`public/sw.js`**: Lines 5 and 106 reference `/legacy-dashboard.html` as part of the PWA shell cache and notification click handler.
- **`public/index.html`**: Confirmed zero references to `legacy-dashboard.html`. Must NOT be touched per project constraints.

---

## 2. Technical Implementation Specifications

### Requirement 1 & 2: Navbar Wiring & Active Tab Highlighting (`components/dashboard/Navbar.tsx`)

#### 1. Import Updates
Add Next.js navigation components:
```tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
```

#### 2. Navigation Items Definition & Route Matching Logic
Define nav items array inside or outside the component:
```tsx
const navItems = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Roadmap', href: '/dashboard/roadmap' },
  { name: 'Projects', href: '/dashboard/projects' },
  { name: 'AI Mentor', href: '/dashboard/mentor' },
  { name: 'Settings', href: '/dashboard/settings' },
];
```

Inside `Navbar`:
```tsx
const pathname = usePathname();
```

Active matching rule:
```tsx
const isActive = item.href === '/dashboard' 
  ? pathname === '/dashboard' 
  : pathname.startsWith(item.href);
```
*Rationale*: Using `pathname === '/dashboard'` for Overview ensures that navigating to sub-routes (e.g. `/dashboard/roadmap`) does not keep the Overview link active. Using `pathname.startsWith(item.href)` for subroutes handles any child paths under those tabs cleanly.

#### 3. Styling Classes
- **Active state**: `text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00]` (orange text, glowing orange background tint, solid orange border).
- **Inactive state**: `text-white/50 hover:text-white hover:bg-white/5 border border-transparent` (semi-transparent white text, subtle hover glow).

#### 4. Proposed Code Snippet for `components/dashboard/Navbar.tsx`

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

const navItems = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Roadmap', href: '/dashboard/roadmap' },
  { name: 'Projects', href: '/dashboard/projects' },
  { name: 'AI Mentor', href: '/dashboard/mentor' },
  { name: 'Settings', href: '/dashboard/settings' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { data: dashboardData } = useDashboard();
  const { user, notifications } = dashboardData;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-white/10 px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Placely Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-[#FF7A00] rounded-xl flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-[#FF7A00]/20">
            P
          </div>
          <span className="text-white font-bold text-xl tracking-tight hidden sm:inline-block">
            Placely
          </span>
        </Link>

        {/* Navigation Tabs (Desktop) */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                  isActive
                    ? 'text-[#FF7A00] bg-[#FF7A00]/10 border-[#FF7A00]'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                {item.name}
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
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[#FF7A00] text-white text-[10px] font-bold rounded-full border border-[#0A0A0A]">
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
  );
};

export default Navbar;
```

---

### Requirement 3: Redirects Configuration (`next.config.mjs`)

`next.config.mjs` must specify `redirects()` to map both direct `/legacy-dashboard.html` requests and query parameter tab requests (`?tab=roadmap`, `?tab=projects`, `?tab=mentor`, `?tab=settings`) to their App Router endpoints.

#### Proposed Code Snippet for `next.config.mjs`

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

---

### Requirement 4: Secondary Codebase References (`public/sw.js`)

In `public/sw.js`:
- Line 5: Update shell cache array from `'/legacy-dashboard.html'` to `'/dashboard'`.
- Line 106: Update fallback notification URL from `'/legacy-dashboard.html'` to `'/dashboard'`.

---

### Requirement 5: Constraint Verification & Impact Matrix

| Constraint / Metric | Target Value | Measured / Predicted | Status |
|---------------------|--------------|----------------------|--------|
| `public/index.html` | Untouched | 0 changes | Passed |
| Line count: `Navbar.tsx` | < 200 lines | 86 lines | Passed |
| Line count: `next.config.mjs` | < 200 lines | 39 lines | Passed |
| Line count: `app/dashboard/layout.tsx` | < 200 lines | 25 lines | Passed |
| Build fix: `CircularRing.tsx` | Import `FolderGit2` from `lucide-react` | Verified missing import on line 4 | Identified |
| `npm run build` | Zero errors | Verified (requires `CircularRing.tsx` import fix) | Validated |
