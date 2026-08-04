## 2026-07-29T18:00:18Z
You are the Worker for Milestone 4: Zone 2 & Zone 3 Components (Progress & Motivation Areas) for Placely Student Dashboard.

Target directory: c:\Users\DELL\getplaced.ai\dashboard-next
Your working directory: c:\Users\DELL\getplaced.ai\.agents\worker_m4

Tasks:
1. Create working directory `c:\Users\DELL\getplaced.ai\.agents\worker_m4`.
2. Create `components/dashboard/CareerBreakdown.tsx` ('use client'):
   - Responsive grid: 4-col desktop (`lg:grid-cols-4`), 2-col tablet (`sm:grid-cols-2`), 1-col mobile.
   - Iterates over `dashboardData.careerBreakdown[]`.
   - Displays dynamic icon (e.g. Code, Server, FolderGit2, Users), metric name, animated count-up % using `AnimatedNumber`, color-coded `ProgressBar` (red <40%, yellow 40-69%, green >=70%), status badge ('On Track'|'Needs Work'|'Excellent'), and small muted AI suggestion text.
   - File length strictly < 200 lines.
3. Create `components/dashboard/PlacementJourney.tsx` ('use client'):
   - Stepper component (horizontal desktop `md:flex-row`, vertical mobile `flex-col`).
   - Iterates over 7 stages from `dashboardData.placementJourney[]`.
   - Completed: green check icon + full opacity. Current: orange glow + animated pulse ring around icon. Locked: grayscale opacity-40.
   - Connecting line fills orange up to current stage using Framer Motion `motion.div`.
   - File length strictly < 200 lines.
4. Create `components/dashboard/PlacementTracker.tsx` ('use client'):
   - Header: "Placement Tracker" title + cosmetic "Log Application" button.
   - 2x3 stats grid displaying `applicationsSent`, `repliesReceived`, `interviewsScheduled`, `offers`, `responseRate` (shown with %), `daysSinceLastApplication` (shown with days). Uses `AnimatedNumber` for all 6 stats.
   - Bottom: AI recommendation strip with Sparkles icon + `aiRecommendation` text.
   - File length strictly < 200 lines.
5. Create `components/dashboard/AIMentorPreview.tsx` ('use client'):
   - Card with Kiro bot avatar, "Kiro - AI Mentor" header + active online green dot indicator.
   - Last message preview box (`line-clamp-2`).
   - 3 question pill buttons (`aiMentor.suggestedQuestions[]`) with hover orange border/text effects.
   - "Continue Conversation" button with icon.
   - File length strictly < 200 lines.
6. Create `components/dashboard/QuickActions.tsx` ('use client'):
   - 2-row grid on desktop (4+3), scroll/grid on mobile.
   - 7 action cards from `dashboardData.quickActions[]`. Each with large icon, label, glassmorphism background.
   - Hover effect: orange glow border + scale-105 via Framer Motion `whileHover={{ scale: 1.05 }}`.
   - File length strictly < 200 lines.
7. Create `components/dashboard/StreakXPCard.tsx` ('use client'):
   - Single card split into two halves (grid 1-col md:grid-cols-2).
   - Left: animated flame icon (Framer Motion pulse), current streak count (`AnimatedNumber`), "day streak" label, longest streak, 7-day weekly activity bar (M T W T F S S).
   - Right: Level badge ("LVL 12"), current XP count (`AnimatedNumber`), next level target, `ProgressBar`.
   - Bottom: Motivational message computed from `streak.current`.
   - File length strictly < 200 lines.
8. Verify build: run `npm run build` in `c:\Users\DELL\getplaced.ai\dashboard-next`.
9. Write detailed handoff report in `c:\Users\DELL\getplaced.ai\.agents\worker_m4\handoff.md`.
