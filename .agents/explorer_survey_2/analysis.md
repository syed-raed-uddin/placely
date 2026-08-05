# Detailed Feature Specification & Mine Report — Placely Dashboard Migration

**Agent:** Spec Miner 2 (HTML Dashboard & Feature Spec Miner)  
**Date:** 2026-08-05  
**Target Routes:** `/dashboard/roadmap`, `/dashboard/projects`, `/dashboard/mentor`, `/dashboard/settings`  
**Source Baseline:** `public/legacy-dashboard.html`, `public/projects.js`, `public/projects.css`, `app/dashboard/page.tsx`, `components/dashboard/*`, `lib/mockData.ts`, `lib/api.ts`

---

## 1. Roadmap Page (`/dashboard/roadmap`) — Specification (R2)

### UI Components & Layout Structure
- **Persistent Navbar Integration**: Header uses `components/dashboard/Navbar.tsx` with active link highlighted on "Roadmap".
- **Today's Mission Banner**:
  - Title: "Today's Mission"
  - Subtitle: Streak status (`🔥 X day streak`).
  - Action CTA: "Continue Roadmap" button (smooth scrolls to current open phase/task).
- **Hero Learning Sprint Card**:
  - Header text: `Day X of Y` (e.g. `Day 14 of 20`).
  - Subtext: Track Sprint name (e.g., `Full Stack SDE Track sprint`).
  - Streak pill: `🔥 14 day streak`.
  - Progress bar: Dual indicator with fill animation (`#FF7A00` gradient) and ASCII representation (`██████░░░░ 60% Complete`).
  - Next Milestone indicator: Text displaying upcoming milestone title & day threshold (e.g., `Next milestone: Mock Interview Round 2 (day 15)`).
- **Next Part / Track Unlock Banner**:
  - Displayed when `is_skill_complete` is true.
  - Cards: `🏆 Track complete!` or `🎉 Next part unlocked!` with start CTA link.
- **Badge Shelf Section**:
  - Header: "Badges"
  - Grid of 5 canonical badges:
    1. 🐣 **First Step** (Day 1)
    2. 🗺️ **Python / Track Explorer** (Day 5)
    3. 🔄 **Loop Starter** (Day 10)
    4. ⚡ **Function Wizard** (Day 15)
    5. 🎓 **Graduate** (Day 22)
  - States: `Earned` (accent border, glow, colorful emoji) vs `Locked` (grayscale emoji, lock icon 🔒, opacity 0.32).
- **AI Checkpoint Section**:
  - Displayed when current day matches `checkpoint.after_day`.
  - Contains title (e.g. `Day 14 Checkpoint`), 3 self-assessment questions, score selector buttons `[0]` `[1]` `[2]` `[3]`, and "Submit Checkpoint" button.
  - Displays pass (`green`) vs revise (`orange`) feedback banner upon submission.
- **Roadmap Accordion List**:
  - Ordered Phase Cards (Phase 1, Phase 2, etc.):
    - Phase Head: Phase number badge, Phase title, completed task ratio (`X / Y tasks done`), toggle chevron.
    - Phase Body: Task Cards list.
  - Task Cards inside Phase:
    - Task Head: Status icon (`✅` Done, `⚠️` Stuck, `•` Pending), Day indicator (`DAY X`), Task title, Status pill (`Done` / `Stuck`), accordion toggle.
    - Task Content:
      - Video Resource Link Button(s): `▶ Watch [Resource Title] →` (external YouTube/link).
      - "Your Task" instruction text block.
      - "Why it matters" real-world context block.
      - Optional & Stretch challenges block.
      - Task Action buttons: `✅ Mark as Done`, `⚠️ Mark as Stuck`.
      - Code Submission Box: Monospace `<textarea>` for code input + `✨ Submit for AI Review` button.
      - AI Mentor Feedback Box: Markdown container displaying AI review comments.
- **Milestone Overlay Modal**:
  - Animated pop-up modal when milestone or track completion occurs (`🎉 Milestone unlocked!`).

### Mock Data & Data Schema (R2)
- **Data Source**: `GET /api/dashboard/{student_id}` (Backend API) with fallback to `lib/mockData.ts` `currentRoadmap`, `todayTasks`.
- **Fields**:
  - `enrollment`: `{ current_day, total_days, is_active }`
  - `skill`: `{ id, name, total_days, has_dsa }`
  - `streak`: `{ current_streak, longest_streak }`
  - `next_milestone`: `{ title, after_day, description }`
  - `all_badges`: Array of `{ name, emoji, day_threshold }`
  - `phases`: Array of `{ id, title, order_index, tasks: [...] }`
  - `task` schema: `{ id, day_number, title, instruction, real_world_context, optional_challenge, stretch_challenge, resources: [{ title, url }], progress: { status: 'done' | 'stuck' | 'pending', submitted_code, ai_feedback } }`

---

## 2. Projects Page (`/dashboard/projects`) — Specification (R3)

### UI Components & Layout Structure
- **Hero AI Recommended Project Card**:
  - Header badge: `AI Recommended Project` with AI icon.
  - Title: Recommended Project Title (e.g., `AI Resume Parser & Scorer`).
  - Recommendation Quote: "Because you completed your recent track, this is the perfect next step to strengthen your portfolio."
  - Metrics Grid: Match Score (`95%` highlighted in `#FF7A00`), Difficulty (`Intermediate`), Est. Time (`~24 hrs`).
  - Recruiter Value Box:
    - Rating: `★★★★★`
    - Target Companies: List (`Amazon`, `Google`, `Tech Startups`).
    - Demonstrated Skills: List (`Node.js`, `Python`, `ATS Algorithms`, `REST API`).
    - Interview Discussion Estimate: `15-20 mins`.
  - Actions: `Start Project` (primary button), `View Details` (modal trigger).
  - Thumbnail Preview Image.
- **AI Portfolio Insights Box**:
  - Purple themed card (`border-left: 4px solid #9D4EDD`).
  - Bullet list of portfolio feedback and gap analyses.
- **Project Journey Stepper**:
  - Horizontal timeline showing project milestones (Setup -> ATS Parser -> Scoring Engine -> Deployment).
  - Node States: Done (`✓` filled orange), Active (glowing orange ring), Locked (gray).
- **Currently Building Card**:
  - Tag: `CURRENTLY BUILDING` (orange uppercase).
  - Project Title & Current Milestone name.
  - GitHub Repo status: `View Repository` link or `Submit GitHub Repo` button.
  - Animated Circular Progress Ring (`CircularRing.tsx`): Displays current project completion percentage (e.g. `65%`).
- **Project Analytics Grid**:
  - 4 Stat Cards: Projects Completed, Projects Remaining, Portfolio Strength, Career Readiness rating.
- **Project Catalog Grids**:
  - Sections: "Highly Recommended Projects", "Completed Projects", "Optional Projects".
  - Cards: Thumbnail, Title, Difficulty Chip, Match Score Chip, Recruiter Rating, Description, "View Details" button.
- **Project Details Modal**:
  - Full modal overlay with cover image background.
  - "After completing this project" benefits checklist (Portfolio Ready, Resume Ready, GitHub Ready, Deployable, Interview Ready).
  - "Features to Build" list.
  - "Resume Bullet Example" highlighted callout block.
  - "Interview Questions" list.
  - Technology tags & impact scores breakdown.
  - "Start Building Project" CTA button.

### Mock Data & Data Schema (R3)
- **Data Source**: `GET /api/projects/dashboard` or `GET /api/dashboard/{student_id}` with fallback to `lib/mockData.ts` `currentProject`.
- **Fields**:
  - `currentProject`: `{ name, progress, currentMilestone, remainingTasks, estimatedCompletion, githubUrl }`
  - `heroRecommendation`: `{ id, title, description, matchScore, difficulty, estimatedHours, recruiterValue: { rating, companies, skills, discussionTime }, thumbnailUrl }`
  - `analytics`: `{ completed, remaining, portfolioStrength, careerReadiness }`
  - `completedProjects`: Array of project objects.

---

## 3. AI Mentor Page (`/dashboard/mentor`) — Specification (R4)

### UI Components & Layout Structure
- **Full Chat App Interface**:
  - Designed as a full-height chat window (`max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-[#0A0A0A] border border-white/10 rounded-2xl`).
- **Chat Header Bar**:
  - Avatar: `🤖` Kiro icon.
  - Title: "Kiro — AI Mentor".
  - Status indicator: `● Online` (emerald green text).
  - Action buttons: Focus Mode button (opens Pomodoro timer overlay).
- **Message Stream History**:
  - Auto-scrollable message viewport.
  - Student Message Bubbles: Right-aligned, solid orange background (`bg-[#FF7A00]`), rounded corners with tail, white text, timestamp.
  - Kiro Message Bubbles: Left-aligned, dark glassmorphism card background (`bg-[#1A1A1A] border border-white/10`), formatted Markdown response (bold text, code blocks with syntax highlighting, bullet points), timestamp.
  - Streaming Token Output: Token-by-token text appending in real-time as SSE data chunks arrive.
  - Animated 3-dot typing indicator displayed while waiting for initial SSE response.
- **Suggested Question Chips**:
  - Chips rendered above chat input.
  - Sourced from `lib/mockData.ts` `aiMentor.suggestedQuestions` (e.g. "How to optimize Graph Dijkstra?", "Review my System Design schema", "Mock behavioral question").
  - Click populates chat input and triggers send.
- **Chat Input Bar**:
  - Attachment icon button (`📎`).
  - Textarea with auto-expanding height, placeholder "Message Kiro...", Enter to send (Shift+Enter for newline).
  - Send button (`#chat-send`) with paper plane icon, disabled during active stream or empty input.
- **Focus Mode Overlay**:
  - Full-screen pomodoro session modal with 25:00 timer, start/pause/reset controls, and Picture-in-Picture support.

### Streaming Protocol & API Specs (R4)
- **Endpoint**: `POST /api/mentor/chat` (or `POST /api/chat/message`).
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`.
- **Payload**: `{ message: string, student_id: string }`.
- **Response Format**: Server-Sent Events (SSE) stream.
  - Chunk format: `data: {"text": "..."}`
  - Completion signal: `data: [DONE]`

---

## 4. Settings Page (`/dashboard/settings`) — Specification (R5)

### UI Components & Layout Structure
- **Header Section**: "Settings & Profile".
- **Profile Info Card**:
  - Displays Avatar initials, Name (`Syed Raed`), Email, Active Course / Track, Enrollment Date, Current Day number.
- **Course & Track Management Card**:
  - List of available tracks.
  - Status badges: `Active` (current track), `Switch Track` (for enrolled tracks), `Buy Track` (Rs. 199 Razorpay integration).
- **My Personal Notes Card**:
  - Textarea for saving pseudocode / ideas to `localStorage` (`placely_settings_notes`).
  - Save Notes button & Clear button.
- **My Tasks Checklist Card**:
  - Add task text input + Add button.
  - Task list items with Done toggle and Delete button (saved to `localStorage` `placely_settings_tasks`).
- **Deep Work Pomodoro Card**:
  - Banner: "Deep Work — Enter a distraction-free Pomodoro session."
  - "Start Focus Mode" button.
- **Account Actions / Log Out Card**:
  - Prominent "Log Out" button:
    - Calls `POST /api/auth/logout` (best effort).
    - Clears cookies `placely_student_id` and `placely_token`.
    - Clears `localStorage` keys (`placely_student_id`, `placely_token`).
    - Redirects user to `/`.

---

## 5. Exact Styling Tokens & Glassmorphic Patterns

### Color System Tokens
```css
:root {
  --bg: #0A0A0A;
  --card: #1A1A1A;
  --card-2: #202028;
  --accent: #FF7A00;          /* Placely Brand Orange */
  --accent-secondary: #FF6B00;
  --accent-dim: rgba(255, 122, 0, 0.1);
  --border-line: rgba(255, 255, 255, 0.08);
  --text-main: #ECECF1;
  --text-muted: #9A9AA8;
  --text-muted-2: #6B6B78;
  --green: #22C55E;
  --green-dim: rgba(34, 197, 94, 0.12);
  --red: #EF4444;
  --red-dim: rgba(239, 68, 68, 0.12);
  --fire: #FF7A18;
  --radius: 16px;
}
```

### Glassmorphism Utility Classes
- **Glass Card**: `bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl`
- **Hover Lift**: `transition-all duration-200 hover:-translate-y-1 hover:border-[#FF7A00]/30 hover:shadow-xl`
- **Accent Glow**: `shadow-lg shadow-[#FF7A00]/20`

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Roadmap | Today's Mission Banner | Displays streak & CTA to continue active roadmap day | Student ID / Streak | Banner UI + Scroll CTA | Muted fallback text | `legacy-dashboard.html` |
| 2 | Roadmap | Hero Learning Sprint Card | Displays Day X of Y, streak, progress bar, ASCII progress, next milestone | Enrollment & Skill data | Animated progress card | Defaults to Day 1 of 30 | `legacy-dashboard.html` |
| 3 | Roadmap | Unlock & Completion Banners | Displays banner when track or part is completed | `is_skill_complete`, `next_part` | Track/Part finish CTA | Hidden when incomplete | `legacy-dashboard.html` |
| 4 | Roadmap | Badge Shelf | Displays 5 canonical badges (First Step to Graduate) | `current_day`, `badges` | Earned/Locked badge cards | Muted lock icons | `legacy-dashboard.html` |
| 5 | Roadmap | AI Checkpoints | 3-question self-assessment at key milestone days | `after_day`, checkpoint Qs | Pass/Revise feedback card | Submit button disabled until score selected | `legacy-dashboard.html` |
| 6 | Roadmap | Accordion Roadmap & Tasks | Expandable phase & task list with resource watch buttons, code submission, AI feedback | Phase & Task objects | Accordion UI & Code Review response | Toast alert on failure | `legacy-dashboard.html` |
| 7 | Projects | AI Recommended Hero Project | Highlights top project matching student track with recruiter value breakdown | `heroRecommendation` | Hero Card UI + Recruiter box | Fallback card | `projects.js` |
| 8 | Projects | AI Portfolio Insights | Purple highlight box with portfolio advice bullets | `insights` array | Insight bullets list | Hidden if empty | `projects.js` |
| 9 | Projects | Project Journey Stepper | Milestone progress stepper for active project | `journey.milestones` | Timeline stepper nodes | Hidden if empty | `projects.js` |
| 10 | Projects | Currently Building & Ring Progress | Card showing active project, progress %, GitHub submission | `currentProject` object | Animated SVG Circular Ring UI | Empty state card | `projects.js` / `CircularRing.tsx` |
| 11 | Projects | Project Catalog Grids & Modal | Filtered grids (Recommended, Completed, Optional) with detailed slide-over modal | Project arrays, project ID | Catalog cards & modal UI | Modal close action | `projects.js` |
| 12 | AI Mentor | Streaming Chat Interface | Token-by-token real-time AI conversation with markdown & code syntax highlighting | User chat message | Streamed response bubbles | Error bubble with retry suggestion | `legacy-dashboard.html` |
| 13 | AI Mentor | Quick Question Chips | Suggested prompt chips for fast questioning | `suggestedQuestions` array | Clickable chips | Hidden if empty | `legacy-dashboard.html` |
| 14 | AI Mentor | Focus Mode Pomodoro Timer | Distraction-free timer overlay with Web Worker & Picture-in-Picture | Duration / Timer controls | Full-screen timer UI + PiP window | Browser PiP fallback | `legacy-dashboard.html` |
| 15 | Settings | Course / Track Switcher | List of enrolled/available tracks with switch active track action | Enrollments list | Track management UI | Red error message | `legacy-dashboard.html` |
| 16 | Settings | Local Notes & Tasks | Offline persistent scratchpad and task checklist | User text input | `localStorage` state | Corrupt storage reset | `legacy-dashboard.html` |
| 17 | Settings | Profile & Log Out | Displays profile details and clears cookies on logout | Cookies / Session | Auth redirect to `/` | Fallback local storage clear | `legacy-dashboard.html` |

---

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Auth Guard | Missing `placely_student_id` cookie | Immediate server-side redirect to `/` |
| 2 | Backend API | API fetch failure or offline network | Graceful fallback to `lib/mockData.ts` structures without crashing |
| 3 | Roadmap Progress | 0% progress / fresh student | Renders 0% progress, empty ASCII bar `░░░░░░░░░░ 0%`, Day 1 default |
| 4 | Code Review | Empty textarea submission | Toast notification alert: "Paste some code first" |
| 5 | AI Mentor Chat | SSE network disconnection | Catch block removes typing indicator and appends error message bubble |
| 6 | Projects Catalog | No recommended projects available | Renders empty state card with dashed border: "No projects available for this skill right now." |
| 7 | Settings Notes | Exceeds localStorage quota | Try/catch prevents crash, displays fallback alert |
| 8 | Responsive Design | Viewport width < 768px (Mobile) | Desktop tab navbar hides, mobile bottom navigation bar renders at bottom |
