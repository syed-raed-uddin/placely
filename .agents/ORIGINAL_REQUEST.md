# Original User Request

## 2026-08-05T13:52:29Z

Migrate the Placely student platform's legacy HTML dashboard into the existing Next.js App Router codebase, building premium React pages for every dashboard section (Roadmap, Projects, AI Mentor, Settings, and the main overview). The landing page (`public/index.html`) must NOT be touched.

Working directory: `c:\Users\DELL\getplaced.ai`
Integrity mode: development

---

## Context

The project is a Next.js 14 App Router app deployed on Vercel.
- **Backend:** Flask API on Railway → `https://placely-backend-production.up.railway.app`
- **Auth:** `localStorage` stores `student_id` and `token`. On login, `public/index.html` also writes them to browser cookies (`placely_student_id`, `placely_token`) so Next.js Server Components can read them via `cookies()`.
- **Existing premium dashboard:** `app/dashboard/page.tsx` already works as a polished premium page using components in `components/dashboard/` and types/data in `lib/mockData.ts`.
- **Legacy to retire:** `public/legacy-dashboard.html` has all the other sections (Roadmap, Projects, AI Mentor, Settings) as a single giant HTML file. These need to become proper Next.js routes.
- **DO NOT MODIFY:** `public/index.html`, `public/sw.js`, `public/manifest.webmanifest`, `public/dsa.html`, `public/portfolio.html`, `public/offline.html`, or any existing working code in `app/dashboard/page.tsx`, `components/dashboard/`, `lib/mockData.ts`, `lib/api.ts`, `app/layout.tsx`, `app/globals.css`.

---

## Requirements

### R1. Dashboard Layout with Persistent Navbar
Create `app/dashboard/layout.tsx` that wraps all `/dashboard/*` routes with the existing `<Navbar />` component (from `components/dashboard/Navbar.tsx`). Remove the `<Navbar />` from `app/dashboard/page.tsx` (since the layout will render it) and verify the main dashboard page still works identically. The Navbar must remain mounted during client-side navigation between dashboard tabs — no full page reloads.

### R2. Roadmap Page — `/dashboard/roadmap`
Create a premium Next.js page at `app/dashboard/roadmap/page.tsx`. It should display the student's full learning roadmap: the phases, modules/tasks (with their completion status, day number, and type), and overall progress. Auth is read from cookies, and data is fetched from the backend at `GET /api/dashboard/{student_id}` (which returns `phases`, `enrollment`, `skill` fields). If cookies are missing, redirect to `/`. Fall back to `lib/mockData.ts` data if the API call fails. Design must match the dark, premium aesthetic of the existing dashboard (glassmorphism cards, `#FF7A00` accent, `bg-[#0A0A0A]` background, Framer Motion animations).

### R3. Projects Page — `/dashboard/projects`
Create a premium Next.js page at `app/dashboard/projects/page.tsx`. It should display the student's active project: name, progress percentage (animated circular ring), current milestone, remaining tasks, and estimated completion. It should also display a list of all past/completed projects if available from the backend. Same auth pattern and dark premium aesthetic as R2.

### R4. AI Mentor Page — `/dashboard/mentor`
Create a premium Next.js page at `app/dashboard/mentor/page.tsx`. It should render a full chat interface with "Kiro", the AI Mentor. The chat sends messages to the backend's streaming endpoint at `POST /api/mentor/chat` (streams SSE with `data:` lines containing JSON `{text: "..."}` chunks, ending with `[DONE]`). The `student_id` and `token` from cookies must be included in all requests. The UI must feel like a premium messaging app (chat bubbles, streaming token-by-token response display, loading indicators). Suggested quick questions from `lib/mockData.ts` (`aiMentor.suggestedQuestions`) should be displayed as chips.

### R5. Settings Page — `/dashboard/settings`
Create a premium Next.js page at `app/dashboard/settings/page.tsx`. It should display the student's profile info (name, email, course/track, enrollment date) read from the backend response. Include a styled "Log Out" button that clears cookies (`placely_student_id`, `placely_token`) and redirects to `/`. This is a static display page — no editable forms required for this version.

### R6. Navigation Wiring
Update the Navbar in `components/dashboard/Navbar.tsx` to replace all `href="/legacy-dashboard.html?tab=..."` links with proper Next.js `<Link>` tags pointing to `/dashboard`, `/dashboard/roadmap`, `/dashboard/projects`, `/dashboard/mentor`, and `/dashboard/settings`. The active link should be highlighted based on the current pathname.

Update `next.config.mjs` to add permanent redirects from the legacy URLs to the new routes:
- `/legacy-dashboard.html` → `/dashboard`

---

## Acceptance Criteria

### Build & Safety
- [ ] `npm run build` completes with zero errors after all changes.
- [ ] `public/index.html` is byte-for-byte identical to before (no modifications).
- [ ] All existing files in `components/dashboard/`, `lib/mockData.ts`, `lib/api.ts` have their data/logic preserved.
- [ ] The existing `/dashboard` page renders correctly and all its existing components work.

### New Routes
- [ ] Navigating to `/dashboard/roadmap` renders a page (not a 404).
- [ ] Navigating to `/dashboard/projects` renders a page (not a 404).
- [ ] Navigating to `/dashboard/mentor` renders a page (not a 404).
- [ ] Navigating to `/dashboard/settings` renders a page (not a 404).
- [ ] All new pages redirect to `/` when `placely_student_id` cookie is absent.

### Navigation
- [ ] Clicking each Navbar tab navigates without a full page reload (the Navbar stays mounted — verify by checking that the page does NOT flash/reload, React state in the Navbar is preserved).
- [ ] The active tab is visually highlighted on each page.

### Auth & Logout
- [ ] The Settings page "Log Out" button clears both `placely_student_id` and `placely_token` cookies and redirects to `/`.

### Design Quality
- [ ] All new pages use the same dark glassmorphism aesthetic as the existing dashboard (dark background, orange `#FF7A00` accent, blurred glass cards, smooth Framer Motion transitions).
- [ ] All new pages are mobile-responsive.
