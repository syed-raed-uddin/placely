# PROJECT: Placely — Premium Student Dashboard (Next.js) — Phase 1

## Architecture
- **Framework**: Next.js 14 (App Router) with React 18 & TypeScript
- **Styling**: TailwindCSS, Shadcn UI / radix primitives, custom CSS variables for dark glassmorphism
- **Design System**:
  - Background: `#0A0A0A`
  - Primary Accent: `#FF7A00` (orange)
  - Glassmorphic Cards: `backdrop-blur-md`, `bg-white/5`, `border border-white/10`, `rounded-2xl`/`rounded-3xl`
  - Typography: Modern sans-serif (Inter/Geist), white text, muted secondary text
  - Responsiveness: Mobile-first (375px / 768px / 1280px)
- **Animations**: Framer Motion for count-up numbers, SVG ring dash offset, task completion reordering & floating +XP, stepper line fill, staggered card entrances, hover scaling & glow effects.
- **Data Layer**: Centralized typed mock data module `lib/mockData.ts`. ZERO hardcoded strings/numbers in UI components.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Bootstrap & Design System | Next.js 14 setup in `dashboard-next`, Tailwind, Lucide, Framer Motion, globals.css, theme config | None | DONE |
| 2 | Mock Data & UI Primitives | `lib/mockData.ts` typed interface + data, `CircularRing.tsx`, `AnimatedNumber.tsx`, `ProgressBar.tsx` | M1 | DONE |
| 3 | Zone 1 Components | `Navbar.tsx`, `HeroGreeting.tsx`, `TodaysMission.tsx`, `RoadmapCard.tsx`, `ProjectCard.tsx` | M2 | DONE |
| 4 | Zone 2 & Zone 3 Components | `CareerBreakdown.tsx`, `PlacementJourney.tsx`, `PlacementTracker.tsx`, `AIMentorPreview.tsx`, `QuickActions.tsx`, `StreakXPCard.tsx` | M2 | DONE |
| 5 | Assembly, Build & Audit | `app/dashboard/page.tsx` integration, 3 vertical zones with section labels, line count limit checks (<200 lines), `npm run build` verification, Reviewer & Forensic Audit | M3, M4 | DONE |

## Interface Contracts & Component Architecture
- `lib/mockData.ts` exports typed `DashboardData` interface and `dashboardData` object.
- Reusable UI Components:
  - `components/ui/CircularRing.tsx` (size, progress, strokeWidth, className, children)
  - `components/ui/AnimatedNumber.tsx` (value, duration, prefix, suffix, className)
  - `components/ui/ProgressBar.tsx` (value, max, colorClass, heightClass, className)
- Dashboard Components:
  - `components/dashboard/Navbar.tsx`
  - `components/dashboard/HeroGreeting.tsx`
  - `components/dashboard/TodaysMission.tsx`
  - `components/dashboard/RoadmapCard.tsx`
  - `components/dashboard/ProjectCard.tsx`
  - `components/dashboard/CareerBreakdown.tsx`
  - `components/dashboard/PlacementJourney.tsx`
  - `components/dashboard/PlacementTracker.tsx`
  - `components/dashboard/AIMentorPreview.tsx`
  - `components/dashboard/QuickActions.tsx`
  - `components/dashboard/StreakXPCard.tsx`
  - `app/dashboard/page.tsx`
  - `app/not-found.tsx`
  - `app/error.tsx`

## Code Layout
- Target Directory: `c:\Users\DELL\getplaced.ai\dashboard-next`
- All files under 200 lines.
