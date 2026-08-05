# Handoff Report — Spec Miner 2 (HTML Dashboard & Feature Spec Miner)

## 1. Observation
- **Legacy Source Files Mapped**:
  - `public/legacy-dashboard.html`: Single giant legacy HTML file (2,081 lines) containing Roadmap (lines 411-484), Badge Shelf (lines 454-457), Checkpoints (lines 460-476), Settings & Track Switcher (lines 487-499 & 556-585), Focus Mode Pomodoro (lines 598-619), and AI Mentor Chat interface (lines 514-548).
  - `public/projects.js`: AI Project Coach JS module (400 lines) containing `ProjectsApp` with Hero Recommendation, AI Insights, Project Journey Stepper, Currently Building card with Circular Ring, Analytics, Catalog Grids, and Modal.
  - `public/projects.css`: Styling for projects (492 lines) defining glassmorphism (`.glass`, `.hover-lift`, `.proj-hero-card`, `.insights-box`, `.proj-modal-overlay`).
- **Existing Next.js Components & Data**:
  - `app/dashboard/page.tsx`: Existing main overview page using `Navbar`, `DashboardProvider`, `fetchDashboardData`, `mapBackendToDashboard`.
  - `components/dashboard/Navbar.tsx`: Navbar rendering header links (`/legacy-dashboard.html?tab=...`).
  - `lib/mockData.ts`: Complete TypeScript mock data interfaces and default dataset (`dashboardData`).
  - `lib/api.ts`: API fetch helper `fetchDashboardData(studentId, token)`.
- **Target Page Routes to Create**:
  - `app/dashboard/roadmap/page.tsx` (R2)
  - `app/dashboard/projects/page.tsx` (R3)
  - `app/dashboard/mentor/page.tsx` (R4)
  - `app/dashboard/settings/page.tsx` (R5)
  - `app/dashboard/layout.tsx` (R1 - persistent navbar wrapper)

## 2. Logic Chain
1. **Observation**: `public/legacy-dashboard.html` lines 411–484 & script lines 630–1277 detail the exact UI hierarchy and logic for the Roadmap page (Today's Mission, Hero Sprint Card, Badges, AI Checkpoint, Accordion Phases & Tasks, Code Review, Milestone Modal).  
   **Inference**: R2 (`/dashboard/roadmap`) requires translating these HTML structures and JS handlers into React client components with dark glassmorphism styling, stateful accordion handling, code submission, and checkpoint validation.

2. **Observation**: `public/projects.js` lines 1–400 & `public/projects.css` lines 1–492 specify the entire layout and features for Projects (Hero Recommendation, AI Insights, Journey Stepper, Currently Building ring, Analytics grid, Recommended/Completed/Optional grids, and Detail Modal).  
   **Inference**: R3 (`/dashboard/projects`) requires implementing an active project ring component, recruiter value breakdown, interactive modal for project detail cards, and GitHub repository submission handlers.

3. **Observation**: `public/legacy-dashboard.html` lines 514–548 & script lines 1280–1579 describe the AI Mentor chat interface (floating/panel chat UI, markdown rendering via marked/DOMPurify, Prism code highlighting, SSE streaming endpoint `/api/mentor/chat`, suggested question chips, and Pomodoro focus mode).  
   **Inference**: R4 (`/dashboard/mentor`) requires a full-page premium chat page with SSE streaming reader (`ReadableStream`), suggested question chips, copyable code blocks, auto-scroll, and optional Focus Mode overlay.

4. **Observation**: `public/legacy-dashboard.html` lines 556–585 & script lines 1667–2050 specify the Settings tab (Profile summary, Course management/track switcher with Razorpay integration, Local Notes & Tasks, Deep Work card, and Log Out cookie/local storage clear).  
   **Inference**: R5 (`/dashboard/settings`) requires static profile display, course list, local notes/tasks persistence, and a styled Log Out button clearing `placely_student_id` & `placely_token` cookies.

5. **Observation**: `components/dashboard/Navbar.tsx` lines 25–41 contain legacy links (`/legacy-dashboard.html?tab=...`).  
   **Inference**: R6 requires updating `Navbar.tsx` to use Next.js `<Link>` components pointing to `/dashboard`, `/dashboard/roadmap`, `/dashboard/projects`, `/dashboard/mentor`, and `/dashboard/settings` with active pathname highlighting (`usePathname()`).

## 3. Caveats
- No source code or public assets were modified during this read-only mining session.
- Razorpay payment SDK logic in Settings track switcher is optional for static profile requirements but fully documented in `analysis.md`.
- No additional caveats.

## 4. Conclusion
All UI components, data structures, interactive behaviors, styling tokens, SSE streaming specifications, and edge cases for `/dashboard/roadmap`, `/dashboard/projects`, `/dashboard/mentor`, and `/dashboard/settings` have been fully probed, mined, and documented in `c:\Users\DELL\getplaced.ai\.agents\explorer_survey_2\analysis.md`.

## 5. Verification Method
- **File Inspection**: Verify existence and completeness of `c:\Users\DELL\getplaced.ai\.agents\explorer_survey_2\analysis.md` and `handoff.md`.
- **Coverage Audit**: Confirm that all 5 requirement zones (R2 Roadmap, R3 Projects, R4 AI Mentor, R5 Settings, and Styling Tokens) are documented with exact UI specs and data schemas.
