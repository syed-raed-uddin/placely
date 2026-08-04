# Orchestration Plan — Placely Premium Student Dashboard (Phase 1)

## Objective
Build a production-ready, high-performance student career dashboard in `c:\Users\DELL\getplaced.ai\dashboard-next` using Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion, and Lucide Icons following a dark glassmorphic design system (`#0A0A0A` background, `#FF7A00` orange accents).

## Milestones Breakdown

### Milestone 1: Project Initialization & Design System Setup
- Initialize Next.js 14 App Router project in `c:\Users\DELL\getplaced.ai\dashboard-next`.
- Install TailwindCSS, Framer Motion, Lucide Icons, `clsx`, `tailwind-merge`.
- Configure `tailwind.config.js` and `globals.css` with dark theme (`#0A0A0A` background, `#FF7A00` primary accent, glassmorphism utilities, dark scrollbars).
- Configure root layout (`app/layout.tsx`) and root redirect/page (`app/page.tsx`).
- Verify build with `npm run build`.

### Milestone 2: Typed Mock Data Layer & Reusable UI Primitives
- Create `lib/mockData.ts` with complete `DashboardData` interface and exported `dashboardData` containing realistic values for all R2 requirements.
- Create `components/ui/CircularRing.tsx` (Framer Motion SVG strokeDashoffset animated ring).
- Create `components/ui/AnimatedNumber.tsx` (Framer Motion count-up animation).
- Create `components/ui/ProgressBar.tsx` (Framer Motion animated width bar).
- Verify typing and file size constraints (<200 lines).

### Milestone 3: Zone 1 Components (Action Area)
- `components/dashboard/Navbar.tsx` (sticky navbar, logo, search placeholder, notifications bell, user avatar).
- `components/dashboard/HeroGreeting.tsx` (dynamic greeting based on hour, CTA button, circular progress ring with careerReadiness% and nextMilestone).
- `components/dashboard/TodaysMission.tsx` (interactive task checkboxes, SVG checkmark, card transition to bottom on completion, floating +XP animation).
- `components/dashboard/RoadmapCard.tsx` (current roadmap info, progress bar, completion estimate, CTA).
- `components/dashboard/ProjectCard.tsx` (current project info, mini ring, tasks remaining, CTA).

### Milestone 4: Zone 2 & Zone 3 Components (Progress & Motivation Areas)
- `components/dashboard/CareerBreakdown.tsx` (4-col grid, metrics, count-up %, color-coded progress bars, status badges, AI suggestions).
- `components/dashboard/PlacementJourney.tsx` (7 stages stepper, completed/current/locked states, orange line fill animation).
- `components/dashboard/PlacementTracker.tsx` (2x3 stats grid with count-up numbers, AI recommendation strip).
- `components/dashboard/AIMentorPreview.tsx` (bot avatar, last message preview, question pills, CTA button).
- `components/dashboard/QuickActions.tsx` (7 action cards, glassmorphic hover scale + orange glow).
- `components/dashboard/StreakXPCard.tsx` (split card: flame icon animation + streak + 7-day weekly activity; level badge + XP count + progress bar; dynamic motivational message).

### Milestone 5: Integration, Page Assembly, Build Verification & Integrity Audit
- Create `app/dashboard/page.tsx` assembling Zone 1, Zone 2, Zone 3 with small muted uppercase tracking-widest section labels ("TODAY'S FOCUS", "CAREER PROGRESS", "MOTIVATION").
- Check line counts for all files (strictly <200 lines).
- Dispatch Reviewers, Challengers, and Forensic Auditor to verify functionality, performance, design accuracy, and code integrity.
- Run `npm run build` verification.
- Send completion victory report.
