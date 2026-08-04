## 2026-07-29T12:25:00Z

You are the Worker for Milestone 2: Typed Mock Data Layer & Reusable UI Primitives for Placely Student Dashboard.

Target directory: c:\Users\DELL\getplaced.ai\dashboard-next
Your working directory: c:\Users\DELL\getplaced.ai\.agents\worker_m2

Tasks:
1. Create working directory `c:\Users\DELL\getplaced.ai\.agents\worker_m2`.
2. Create `lib/mockData.ts`:
   - Define strict TypeScript interfaces: `DashboardData`, `TaskItem`, `RoadmapInfo`, `ProjectInfo`, `AIMentorInfo`, `CareerMetric`, `JourneyStage`, `QuickAction`, `PlacementTrackerInfo`, `StreakInfo`, `XPInfo`, `NotificationInfo`.
   - Ensure `DashboardData` contains ALL required fields:
     - `user`: { name: "Syed Raed", avatar: "/avatar.png", initials: "SR" }
     - `careerReadiness`: { score: 78, nextMilestone: "Mock Interview Round 2" }
     - `todayTasks`: array of at least 4 realistic items with `id`, `title`, `estimatedTime`, `xpReward`, `priority` ('High'|'Medium'|'Low'), `completed`, `subProgress` (optional 0-100)
     - `currentRoadmap`: { name: "Full Stack SDE Track", currentModule: "System Design & Distributed Caching", modulesCompleted: 14, totalModules: 20, estimatedCompletion: "Aug 15, 2026" }
     - `currentProject`: { name: "AI Resume Parser & Scorer", progress: 65, currentMilestone: "ATS Parsing Algorithm", remainingTasks: 3, estimatedCompletion: "Aug 5, 2026" }
     - `aiMentor`: { lastMessage: "Your DSA consistency is up 40%! Focus on Dynamic Programming graphs today.", suggestedQuestions: ["How to optimize Graph Dijkstra?", "Review my System Design schema", "Mock behavioral question"] }
     - `careerBreakdown`: array of 4 objects (e.g. Data Structures & Algo, System Design, Projects & Portfolio, Behavioral & HR) with `name`, `icon` (Lucide name string e.g. "Code", "Server", "FolderGit2", "Users"), `percentage`, `suggestion`, `status` ('On Track'|'Needs Work'|'Excellent')
     - `placementJourney`: array of 7 stage objects (Profile Building, Resume Verification, Skill Assessment, Mock Interviews, Company Applications, HR Round, Offer Letter) with `id`, `stage`, `icon` (Lucide string), `status` ('Completed'|'Current'|'Locked')
     - `quickActions`: array of 7 objects (Resume Builder, Mock Interview, DSA Practice, Cold Email AI, Salary Benchmark, Referral Finder, Portfolio Generator) with `id`, `label`, `icon`, `color`
     - `placementTracker`: { applicationsSent: 34, repliesReceived: 12, interviewsScheduled: 5, offers: 2, responseRate: 35, daysSinceLastApplication: 2, aiRecommendation: "High response rate! Send 3 more applications to top tier product companies this week." }
     - `streak`: { current: 14, longest: 21, weeklyActivity: [true, true, true, true, true, true, false] }
     - `xp`: { current: 3450, total: 5000, level: 12, nextLevelXP: 4000 }
     - `notifications`: { unreadCount: 3 }
   - Export typed constant `dashboardData: DashboardData`.
3. Create `components/ui/CircularRing.tsx` ('use client'):
   - Reusable SVG ring component using `framer-motion`.
   - Animates `strokeDashoffset` smoothly on mount/view.
   - Props: `progress: number` (0-100), `size?: number` (default 160), `strokeWidth?: number` (default 12), `ringColor?: string` (default '#FF7A00'), `backgroundColor?: string`, `className?: string`, `children?: React.ReactNode`.
   - File length MUST be under 200 lines.
4. Create `components/ui/AnimatedNumber.tsx` ('use client'):
   - Reusable count-up number component using `framer-motion` (`useInView`, `animate`, or `useSpring`).
   - Props: `value: number`, `duration?: number` (default 1.5), `prefix?: string`, `suffix?: string`, `className?: string`.
   - File length MUST be under 200 lines.
5. Create `components/ui/ProgressBar.tsx` ('use client'):
   - Reusable animated progress bar using `framer-motion`.
   - Props: `value: number`, `max?: number` (default 100), `colorClass?: string` (default 'bg-[#FF7A00]'), `bgClass?: string` (default 'bg-white/10'), `heightClass?: string` (default 'h-2'), `className?: string`.
   - File length MUST be under 200 lines.
6. Verify build: run `npm run build` in `c:\Users\DELL\getplaced.ai\dashboard-next`.
7. Write detailed handoff report in `c:\Users\DELL\getplaced.ai\.agents\worker_m2\handoff.md`.
