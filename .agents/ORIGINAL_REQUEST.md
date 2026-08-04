# Original User Request

## 2026-07-27T19:48:20Z

<USER_REQUEST>
# Teamwork Project Prompt — Draft

> Status: Ready for launch — awaiting user approval
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

The Course Management section's "Buy Track" button needs to intelligently display specific server-side errors (such as prerequisite locks) using a modal popup, instead of failing silently with a generic error toast.

Working directory: c:/Users/DELL/getplaced.ai
Integrity mode: development

## Requirements

### R1. Display Specific Server Errors in a Modal
When the `/create-order` API returns an error payload (e.g., a 403 Forbidden because a prerequisite track is incomplete), the frontend must parse the JSON `{"error": "..."}` response and display that exact message inside a clean, centered modal popup.

### R2. Maintain Vanilla JS Architecture
The modal must be built using the existing Vanilla JS/HTML/CSS architecture of the application. Do not introduce new UI frameworks or dependencies.

## Acceptance Criteria

### Error Handling & UX
- [ ] Attempting to purchase a track with an unmet prerequisite successfully intercepts the 403 backend error without crashing the checkout flow.
- [ ] A custom modal popup appears containing the specific error message provided by the server.
- [ ] The modal includes a functional "Close" or "Dismiss" button that hides it from view.
</USER_REQUEST>

## 2026-07-29T17:47:22Z

<USER_REQUEST>
# Placely — Premium Student Dashboard (Next.js) — Phase 1

Build a stunning, production-ready student career dashboard for Placely — an AI-powered career companion for engineering students. The dashboard must feel like a premium productivity app, not an admin panel. The student should feel motivated AND know exactly what to do within 5 seconds of opening it.

Working directory: c:\Users\DELL\getplaced.ai\dashboard-next
Integrity mode: development

---

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TailwindCSS
- Shadcn UI
- Framer Motion
- Lucide Icons

---

## Design System

- Background: #0A0A0A
- Primary Accent: #FF7A00 (orange)
- White typography
- Glassmorphism cards (backdrop-blur, white/10 borders)
- Large rounded corners (rounded-2xl, rounded-3xl)
- Modern sans-serif (Inter or Geist from Google Fonts)
- Mobile-first, fully responsive (375px / 768px / 1280px)
- Pixel-perfect, production-ready

---

## Page Architecture: Three Zones

The dashboard is organized into three vertical zones. Each zone has a clear purpose and a subtle section label in the UI.

Zone 1 - TODAY'S FOCUS (Action area - What should I do today?)
Zone 2 - CAREER PROGRESS (Progress area - How am I growing?)
Zone 3 - MOTIVATION (Retention area - What keeps me going?)

---

## Requirements

### R1. Project Bootstrap

Initialize a Next.js 14 project with App Router inside `c:\Users\DELL\getplaced.ai\dashboard-next`. Install: TailwindCSS, Shadcn UI, Framer Motion, Lucide Icons. Configure the global design system in `tailwind.config.js` and `globals.css` with the colors and font above. The app must start with `npm run dev` on port 3000 without errors.

### R2. Dynamic Data Layer

Create `lib/mockData.ts` with a typed `DashboardData` interface. Populate it with realistic dummy data for every field used in the UI. No component file may contain hardcoded user-facing strings or numbers - all values must be imported from this file.

Required fields (minimum):
- user.name, user.avatar, user.initials
- careerReadiness (number 0-100), careerReadiness.nextMilestone (string)
- todayTasks[] with fields: id, title, estimatedTime, xpReward, priority (High/Medium/Low), completed, subProgress (0-100 optional)
- currentRoadmap.name, currentRoadmap.currentModule, currentRoadmap.modulesCompleted, currentRoadmap.totalModules, currentRoadmap.estimatedCompletion
- currentProject.name, currentProject.progress (0-100), currentProject.currentMilestone, currentProject.remainingTasks, currentProject.estimatedCompletion
- aiMentor.lastMessage, aiMentor.suggestedQuestions[]
- careerBreakdown[] array with: name, icon (string), percentage, suggestion, status (On Track/Needs Work/Excellent)
- placementJourney[] array with: stage, icon, status (Completed/Current/Locked)
- quickActions[] array with: label, icon, color
- placementTracker.applicationsSent, placementTracker.repliesReceived, placementTracker.interviewsScheduled, placementTracker.offers, placementTracker.responseRate, placementTracker.daysSinceLastApplication, placementTracker.aiRecommendation
- streak.current, streak.longest, streak.weeklyActivity[] (7 booleans)
- xp.current, xp.total, xp.level, xp.nextLevelXP
- notifications.unreadCount

### R3. Navbar

Sticky top navbar. Contains: Placely logo (orange square with "P" + "Placely" wordmark), search bar (cosmetic placeholder), notifications bell icon with unread badge count, user avatar showing initials. Collapses gracefully on mobile.

### R4. Zone 1 - Today's Focus

Section label: "TODAY'S FOCUS" in small muted uppercase tracking-widest text.

R4a. Hero / Greeting Strip:
Full-width card. Left side: time-sensitive greeting ("Good Morning/Afternoon/Evening, {user.name}") computed from current hour, subtitle "Here's your plan for today.", a large orange "Continue Learning" CTA button. Right side: large animated circular progress ring (Apple Fitness style, SVG-based) showing careerReadiness% with label "Career Readiness" centered inside it and "Next: {nextMilestone}" below. Ring animates strokeDashoffset from 0 to target on load using Framer Motion. On mobile the ring moves below the greeting.

R4b. Today's Mission:
The most important UI element. Vertical stack of task cards.
Each task card:
- Circular checkbox (animated checkmark SVG draw on click)
- Task title text
- Estimated time chip (e.g. "45 min")
- XP badge in orange (e.g. "+50 XP")
- Priority label (High=red, Medium=yellow, Low=green)
- Thin sub-progress bar if subProgress is set

On task completion:
- Checkbox fills orange with animated checkmark
- Card gets subtle green-500/20 border + opacity-60
- Card animates to bottom using Framer Motion AnimatePresence + layout prop
- "+XP" floating text animates upward and fades out (absolute positioned, keyframe)

R4c. Two-column row (stack on mobile):

Current Roadmap card: roadmap name (header), current module title, linear progress bar with "X of Y modules" label, estimated completion date, "Continue Learning" button with arrow icon.

Current Project card: project name (header), circular mini ring showing progress%, current milestone label, "X tasks remaining", estimated completion, "Open Project" button.

### R5. Zone 2 - Career Progress

Section label: "CAREER PROGRESS" in small muted uppercase text.

R5a. Career Readiness Breakdown Grid:
Responsive grid: 4-col desktop, 2-col tablet, 1-col mobile.
For each item in careerBreakdown[]:
- Icon + metric name
- Large animated percentage number (count-up using Framer Motion useInView)
- Color-coded progress bar (red <40%, yellow 40-69%, green >=70%)
- Status badge (On Track / Needs Work / Excellent)
- AI suggestion sentence in muted small text

R5b. Placement Journey:
Horizontal stepper on desktop, vertical on mobile. 7 stages from placementJourney[].
Completed stages: green check icon, full opacity.
Current stage: orange glow + animated pulse ring around the icon.
Locked stages: grayscale, opacity-40.
Connected by a line; the line fills orange from left up to current stage using Framer Motion on scroll-into-view.

R5c. Placement Tracker:
Card header: "Placement Tracker" title + "Log Application" button (right-aligned, cosmetic).
Top: 2x3 stats grid. Each stat: large animated count-up number, small label below.
Stats: Applications Sent, Replies Received, Interviews Scheduled, Offers, Response Rate (show as X%), Days Since Last Application.
Bottom: AI recommendation strip with Sparkles icon + aiRecommendation text.

R5d. AI Mentor Preview:
Card with Kiro bot avatar (orange circle with bot icon), "Kiro - AI Mentor" title + "Online" green dot.
Last message preview (2 lines, line-clamp-2).
3 question pills as buttons (pill shaped, border, hover orange).
"Continue Conversation" button.

### R6. Zone 3 - Motivation

Section label: "MOTIVATION" in small muted uppercase text.
This zone is compact - it does not dominate the page.

R6a. Quick Actions:
2-row grid on desktop (4+3), horizontal scroll on mobile.
7 action cards from quickActions[]. Each: large icon on top, label below, glassmorphism background. Hover: orange glow border + scale-105.

R6b. Streak + XP Card:
Single card split into two halves.
Left: animated flame icon (Framer Motion pulse + orange-to-red color), current streak number large, "day streak" label, "Longest: X days" below. Small 7-day weekly activity bar (7 columns, filled=orange, empty=gray).
Right: Level badge (e.g. "LVL 12" in orange pill), current XP large number, "/ {nextLevelXP} XP" label, thin XP progress bar.
Bottom full-width: motivational message based on streak.current (0/1-6/7+/30+ days rules).

---

## Component Architecture

Create these exact files:
- app/dashboard/page.tsx (composes all zones)
- components/dashboard/Navbar.tsx
- components/dashboard/HeroGreeting.tsx
- components/dashboard/TodaysMission.tsx
- components/dashboard/RoadmapCard.tsx
- components/dashboard/ProjectCard.tsx
- components/dashboard/CareerBreakdown.tsx
- components/dashboard/PlacementJourney.tsx
- components/dashboard/PlacementTracker.tsx
- components/dashboard/AIMentorPreview.tsx
- components/dashboard/QuickActions.tsx
- components/dashboard/StreakXPCard.tsx
- components/ui/CircularRing.tsx (reusable SVG ring component)
- components/ui/AnimatedNumber.tsx (reusable count-up)
- components/ui/ProgressBar.tsx (reusable animated bar)
- lib/mockData.ts

No component file should exceed 200 lines.

---

## Animations (Framer Motion)

- Hero ring: animates strokeDashoffset on mount
- AnimatedNumber: useInView + useSpring or animate for count-up
- Task completion: AnimatePresence + layout + floating XP text
- Journey line: scaleX or width animation on useInView
- Progress bars: animate width on useInView
- Cards: fade-up stagger entrance (y: 20 to 0, opacity 0 to 1, 0.1s stagger)
- Quick action hover: whileHover scale + glow shadow

---

## Acceptance Criteria

### Functional
- `npm run dev` starts without errors at localhost:3000
- All 11 dashboard components render with no blank areas
- Completing a task triggers the XP float animation and task moves to bottom
- Career readiness ring animates on load
- PlacementTracker renders all 6 stats from mockData
- No hardcoded user-facing strings in component files

### Design
- Background #0A0A0A across all viewports
- Orange #FF7A00 for all CTAs, active states, highlights
- All cards use glassmorphism (backdrop-blur-md, bg-white/5, border border-white/10)
- No horizontal scrollbar at 375px
- Navbar sticky on scroll
- All three zone labels visible

### Code Quality
- TypeScript, no `any` types in component files
- Every component file under 200 lines
- TailwindCSS only, no inline styles
- `npm run build` succeeds

---

## NOT in scope

Do NOT build:
- Resume detail card
- GitHub heatmap card
- Mock Interview card
- AI Insights panel
- Activity Timeline
- Leaderboard
- Achievements/Badges
- Activity Calendar
- Notifications panel
</USER_REQUEST>
