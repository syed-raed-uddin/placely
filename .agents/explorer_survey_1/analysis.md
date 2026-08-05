# Explorer 1 Survey Report: Codebase Inventory & Requirements Analysis

**Date:** 2026-08-05  
**Target Codebase:** `c:\Users\DELL\getplaced.ai`  
**Working Directory:** `c:\Users\DELL\getplaced.ai\.agents\explorer_survey_1`  
**Status:** Complete Read-Only Investigation  

---

## 1. Executive Summary

This investigation surveys the `getplaced.ai` Next.js 14 App Router project to enable the migration of the legacy HTML dashboard (`public/legacy-dashboard.html`) into modular, dark-glassmorphism Next.js React pages for requirements **R1 to R6**.

Key findings:
1. **App Architecture**: Next.js 14.2.35 with TypeScript, Tailwind CSS, Lucide icons, and Framer Motion 12.43.0.
2. **Current State**: `app/dashboard/page.tsx` exists as a polished main overview page wrapped in `DashboardProvider` with `Navbar`.
3. **Legacy Dashboard**: `public/legacy-dashboard.html` contains rich tab features for Roadmap (phases, tasks, checkpoints, badges), Projects (project coach, recruiter value, journey, analytics), AI Mentor (Kiro SSE chat), and Settings (track management, notes, tasks, logout).
4. **Auth Scheme**: Server-side cookie check using `cookies().get('placely_student_id')` and `cookies().get('placely_token')`. Unauthenticated visits redirect to `/`.

---

## 2. Feature & Requirement Inventory (R1 – R6)

### R1. Dashboard Layout with Persistent Navbar (`app/dashboard/layout.tsx`)
* **Objective**: Introduce `app/dashboard/layout.tsx` to wrap all `/dashboard/*` sub-routes with the persistent `<Navbar />` component.
* **Changes Needed**:
  - Create `app/dashboard/layout.tsx` as a Server/Client component layout that mounts `<Navbar />` sticky at top and wraps children in a `<main>` container.
  - Remove `<Navbar />` from `app/dashboard/page.tsx` to avoid duplicate rendering.
  - Provide `DashboardProvider` in layout if global state sharing across dashboard tabs is required, or ensure state persistence during client-side navigation.
* **Layout Styling Pattern**:
  ```tsx
  <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF7A00]/30 selection:text-[#FF7A00]">
    <Navbar />
    <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-16">
      {children}
    </main>
  </div>
  ```

---

### R2. Roadmap Page (`app/dashboard/roadmap/page.tsx`)
* **Route**: `/dashboard/roadmap`
* **Core Requirements**:
  - Auth check via `cookies().get('placely_student_id')`. Redirect to `/` if missing.
  - Data fetching: Call backend `GET /api/dashboard/{student_id}` via `fetchDashboardData()`. Fallback to `lib/mockData.ts` if fetch fails.
  - **UI Sections**:
    1. **Hero & Overall Progress**: Day count (`Day X of Y`), streak count (`🔥 X day streak`), animated progress bar, ASCII percentage complete, and next milestone.
    2. **Badges Shelf**: Grid of earned and locked badges (`🐣 First Step`, `🗺️ Python Explorer`, `🔄 Loop Starter`, `⚡ Function Wizard`, `🎓 Python Graduate`).
    3. **AI Checkpoint**: Interactive quiz section (`Day X Checkpoint`) with 3 questions, score selection (0-3), submit button, and result display (Pass/Revise).
    4. **Roadmap Accordion**: Collapsible phases containing individual daily tasks.
    5. **Task Detail View**: Task status (Done ✅, Stuck ⚠️, Pending), instructional content, "Why it matters", video watch links, code submission textarea for AI review, and action buttons ("Mark as Done", "Mark as Stuck", "Submit for AI Review").
* **Aesthetic**: Dark glassmorphism cards (`glass-card`), `#FF7A00` accent, Framer Motion animations.

---

### R3. Projects Page (`app/dashboard/projects/page.tsx`)
* **Route**: `/dashboard/projects`
* **Core Requirements**:
  - Auth check via `cookies().get('placely_student_id')`. Redirect to `/` if missing.
  - Data fetching: Backend `GET /api/projects/dashboard` or fallback to `lib/mockData.ts` (`currentProject`, `quickActions`, and fallback project arrays).
  - **UI Sections**:
    1. **Hero Recommendation Card**: AI Recommended Project featuring Match Score (`95% Match`), Difficulty, Est. Hours, "Why Recruiters Care" box (companies, skills, interview discussion time), and CTA buttons ("Start Project", "View Details").
    2. **AI Portfolio Insights**: Banner highlighting actionable resume and portfolio advice.
    3. **Project Journey**: Interactive horizontal/vertical milestone node timeline showing completed vs active steps.
    4. **Currently Active Project Card**: Display active project name, animated circular progress ring, current milestone, repository links, and "Submit GitHub Repo" modal/action.
    5. **Project Analytics Grid**: 4 stat cards (Completed Projects, Remaining Projects, Portfolio Strength rating, Career Readiness level).
    6. **Project Catalogs**: Categorized grids for "Highly Recommended Projects", "Completed Projects", and "Optional Projects" with detail modals.
* **Aesthetic**: Glass cards (`glass-card`), circular SVG progress ring styled with `#FF7A00`, smooth modal overlays.

---

### R4. AI Mentor Page (`app/dashboard/mentor/page.tsx`)
* **Route**: `/dashboard/mentor`
* **Core Requirements**:
  - Auth check via `cookies().get('placely_student_id')`. Redirect to `/` if missing.
  - **Chat Interface with "Kiro"**:
    1. **Chat Header**: Avatar (`🤖`), online status indicator (`● Online`), title ("Kiro — AI Mentor").
    2. **Messages Area**: Scrollable message history with distinct bubbles for student (right, `#FF7A00` or accent) and Kiro (left, `glass-card` / `bg-[#1A1A1A]`).
    3. **Markdown & Code Support**: Render markdown responses with code blocks, copy-to-clipboard buttons, and syntax formatting.
    4. **Streaming Response Handler**: Send `POST /api/mentor/chat` or `POST /api/chat/message` with headers `x-dev-student-id` / `Authorization: Bearer <token>`. Consume Server-Sent Events (`data: {"text": "..."}`) ending in `[DONE]`, updating message state token-by-token.
    5. **Typing Indicator**: Animated 3-dot bounce indicator while waiting for initial SSE chunk.
    6. **Quick Question Chips**: Display suggested question chips (`aiMentor.suggestedQuestions` from `lib/mockData.ts` or API recommendations) above the input box.
    7. **Auto-resizing Input Area**: Textarea with character count limit, auto-growing height, and send button (`Enter` to send, `Shift+Enter` for newline).

---

### R5. Settings Page (`app/dashboard/settings/page.tsx`)
* **Route**: `/dashboard/settings`
* **Core Requirements**:
  - Auth check via `cookies().get('placely_student_id')`. Redirect to `/` if missing.
  - **Profile Information Display**: Student name, email, active track/course name, enrollment date, and current streak.
  - **Track Management**: Display active enrollment track with visual badge and available alternative tracks (e.g., Python, Full Stack SDE).
  - **Logout Action**: Styled "Log Out" button with confirmation.
    - Clears cookies: `placely_student_id` and `placely_token`.
    - Clears local storage keys: `localStorage.removeItem('placely_student_id')`, `localStorage.removeItem('placely_token')`.
    - Redirects user to `/`.

---

### R6. Navigation Wiring & Redirects
* **Navbar Component Update (`components/dashboard/Navbar.tsx`)**:
  - Import `Link` from `next/link` and `usePathname` from `next/navigation`.
  - Replace all legacy `href="/legacy-dashboard.html?tab=..."` anchor tags with proper Next.js `<Link>` tags:
    - `/dashboard` -> Main Dashboard
    - `/dashboard/roadmap` -> Roadmap
    - `/dashboard/projects` -> Projects
    - `/dashboard/mentor` -> AI Mentor
    - `/dashboard/settings` -> Settings
  - Highlight active tab visually based on `pathname === link.href` (or `pathname.startsWith(link.href)` for nested routes).
  - Ensure client-side navigation without full page reloads.
* **Redirects Update (`next.config.mjs`)**:
  - Add permanent redirect rules in `nextConfig.redirects()`:
    ```javascript
    async redirects() {
      return [
        {
          source: '/dashboard.html',
          destination: '/dashboard',
          permanent: true,
        },
        {
          source: '/legacy-dashboard.html',
          destination: '/dashboard',
          permanent: true,
        },
      ];
    }
    ```

---

## 3. Codebase Structure & Component Inventory

```
c:\Users\DELL\getplaced.ai
├── app/
│   ├── globals.css                # Global Tailwind CSS & .glass-card utility
│   ├── layout.tsx                 # Root layout (Inter font, dark theme background)
│   ├── page.tsx                   # Landing page router/redirect
│   ├── error.tsx                  # Global error boundary
│   ├── not-found.tsx              # Global 404 page
│   └── dashboard/
│       ├── page.tsx               # Main Dashboard Overview page
│       ├── layout.tsx             # [To Be Created - R1] Persistent Navbar layout
│       ├── roadmap/page.tsx       # [To Be Created - R2] Roadmap page
│       ├── projects/page.tsx      # [To Be Created - R3] Projects page
│       ├── mentor/page.tsx        # [To Be Created - R4] AI Mentor page
│       └── settings/page.tsx      # [To Be Created - R5] Settings page
├── components/
│   └── dashboard/
│       ├── Navbar.tsx             # Top navigation bar component (needs R6 update)
│       ├── DashboardProvider.tsx  # React Context for global dashboard state
│       ├── HeroGreeting.tsx       # Welcome hero header component
│       ├── TodaysMission.tsx      # Today's tasks & mission checklist
│       ├── RoadmapCard.tsx        # Compact roadmap preview widget
│       ├── ProjectCard.tsx        # Active project preview widget
│       ├── CareerBreakdown.tsx    # Skill score breakdown component
│       ├── PlacementJourney.tsx   # Step-by-step placement journey tracker
│       ├── PlacementTracker.tsx   # Job application stats widget
│       ├── AIMentorPreview.tsx    # Compact AI Mentor chat preview widget
│       ├── QuickActions.tsx       # Tool shortcut grid
│       └── StreakXPCard.tsx       # Streak & Gamification XP card
├── lib/
│   ├── api.ts                     # API fetcher functions (fetchDashboardData, API_BASE)
│   └── mockData.ts                # TypeScript interfaces & fallback mock data
├── public/
│   ├── index.html                 # [PROTECTED] Landing page
│   ├── legacy-dashboard.html      # Legacy reference HTML dashboard
│   ├── projects.js                # Legacy JS logic for projects app
│   └── projects.css               # Legacy styling for projects app
├── next.config.mjs                # Next.js configuration (needs R6 redirects)
└── package.json                   # Project dependencies and npm scripts
```

### Mock Data Models in `lib/mockData.ts`
- `UserInfo`: `{ name, avatar, initials }`
- `CareerReadinessInfo`: `{ score, nextMilestone }`
- `TaskItem`: `{ id, title, estimatedTime, xpReward, priority, completed, subProgress }`
- `RoadmapInfo`: `{ name, currentModule, modulesCompleted, totalModules, estimatedCompletion }`
- `ProjectInfo`: `{ name, progress, currentMilestone, remainingTasks, estimatedCompletion }`
- `AIMentorInfo`: `{ name, lastMessage, suggestedQuestions }`
- `CareerMetric`: `{ name, icon, percentage, suggestion, status }`
- `JourneyStage`: `{ id, stage, icon, status }`
- `QuickAction`: `{ id, label, icon, color }`
- `PlacementTrackerInfo`: `{ applicationsSent, repliesReceived, interviewsScheduled, offers, responseRate, daysSinceLastApplication, aiRecommendation }`
- `StreakInfo`: `{ current, longest, weeklyActivity, motivationalMessages }`
- `XPInfo`: `{ current, total, level, nextLevelXP }`
- `DashboardData`: Master interface encapsulating all above state fields.

---

## 4. Dark Glassmorphism Styling Conventions

1. **Root & Background**:
   - Page Root: `bg-[#0A0A0A] text-white min-h-screen`
   - Accent Color: `#FF7A00` (Orange), with variants `#FF7A00`/10 (light fill), `#FF7A00`/20 (glow), border-[#FF7A00]
2. **Glass Card Utility Class** (`app/globals.css`):
   ```css
   .glass-card {
     background-color: rgba(255, 255, 255, 0.05);
     backdrop-filter: blur(12px);
     -webkit-backdrop-filter: blur(12px);
     border: 1px solid rgba(255, 255, 255, 0.1);
     border-radius: 1rem;
   }
   ```
3. **Tailwind Glassmorphism Elements**:
   - Header: `sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-white/10`
   - Inputs: `bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#FF7A00]/50 focus:ring-1 focus:ring-[#FF7A00]/50`
   - Action Badges: `bg-[#FF7A00]/10 border border-[#FF7A00] text-[#FF7A00]`
   - Inactive Nav Items: `text-white/50 hover:text-white hover:bg-white/5`
4. **Framer Motion Animations**:
   - Card entrance: `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}`
   - Hover scale/lift: `whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}`

---

## 5. Protected Files & Constraints

The following files are **STRICTLY PROTECTED** and **MUST NOT BE EDITED OR MODIFIED**:

1. `public/index.html` (Landing page — MUST remain 100% byte-for-byte identical!)
2. `public/sw.js`
3. `public/manifest.webmanifest`
4. `public/dsa.html`
5. `public/portfolio.html`
6. `public/offline.html`

Existing files in `components/dashboard/`, `lib/mockData.ts`, `lib/api.ts`, `app/dashboard/page.tsx` must preserve all working data and logic (with `app/dashboard/page.tsx` only removing its duplicate `<Navbar />` reference once `app/dashboard/layout.tsx` is implemented).

---
