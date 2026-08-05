# Project: Placely Student Platform Dashboard Migration

## Architecture
Next.js 14 App Router codebase with Tailwind CSS, Lucide icons, Framer Motion, and dark glassmorphism design system (`bg-[#0A0A0A]`, `#FF7A00` accent, `.glass-card`).
Routes are nested under `/dashboard/*` wrapped in a persistent server layout `app/dashboard/layout.tsx`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Persistent Dashboard Layout | Layout wrapping all `/dashboard/*` routes with Navbar and auth guard | M1 | R1 |
| 2 | Main Dashboard Page Refactor | Remove duplicate Navbar from `app/dashboard/page.tsx` | M1 | R1 |
| 3 | Roadmap Page - Hero & Progress | Sprint card, Day X of Y, streak, progress bar, next milestone | M2 | R2 |
| 4 | Roadmap Page - Badge Shelf | Grid of 5 canonical badges (earned vs locked states) | M2 | R2 |
| 5 | Roadmap Page - AI Checkpoint | Quiz checkpoint with 3 questions, scoring, pass/revise banner | M2 | R2 |
| 6 | Roadmap Page - Accordion & Code Review | Accordion phases, task cards, video links, code submission & AI review | M2 | R2 |
| 7 | Projects Page - Hero Recommendation | Hero project card, match score, difficulty, recruiter value box | M3 | R3 |
| 8 | Projects Page - Portfolio Insights | AI portfolio advice banner | M3 | R3 |
| 9 | Projects Page - Journey Stepper | Project milestone node timeline | M3 | R3 |
| 10 | Projects Page - Currently Building & Ring | Active project card with SVG circular progress ring & GitHub link | M3 | R3 |
| 11 | Projects Page - Analytics Grid | 4 stat cards (Completed, Remaining, Portfolio Strength, Career Readiness) | M3 | R3 |
| 12 | Projects Page - Catalog Grids & Modal | Filtered grids (Recommended, Completed, Optional) with details modal | M3 | R3 |
| 13 | AI Mentor Page - Header & Status | Kiro AI mentor avatar, online status, title | M4 | R4 |
| 14 | AI Mentor Page - Streaming SSE Chat | Token-by-token SSE stream, typing indicator, markdown & syntax code formatting | M4 | R4 |
| 15 | AI Mentor Page - Quick Prompt Chips | Suggested question chips above chat input | M4 | R4 |
| 16 | AI Mentor Page - Focus Mode Pomodoro | Distraction-free Pomodoro session timer overlay | M4 | R4 |
| 17 | Settings Page - Profile & Track Management | Student profile details & active/enrolled track management | M5 | R5 |
| 18 | Settings Page - Local Notes & Tasks | Scratchpad and checklist persistent in localStorage | M5 | R5 |
| 19 | Settings Page - Log Out Action | Clears cookies & localStorage, redirects to `/` | M5 | R5 |
| 20 | Navigation Wiring - Navbar Links | Dynamic route active tab styling with `usePathname()`, Next `<Link>` | M6 | R6 |
| 21 | Navigation Wiring - Mobile Bottom Bar | Responsive mobile bottom navigation bar for `< 768px` | M6 | R6 |
| 22 | Navigation Wiring - Legacy Redirects | `next.config.mjs` permanent redirects for `/dashboard.html` and `/legacy-dashboard.html?tab=...` | M6 | R6 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Dashboard Layout & persistent Navbar | `app/dashboard/layout.tsx`, refactor `app/dashboard/page.tsx` | none | PLANNED |
| M2 | Roadmap Page | `app/dashboard/roadmap/page.tsx` | M1 | PLANNED |
| M3 | Projects Page | `app/dashboard/projects/page.tsx` | M1 | PLANNED |
| M4 | AI Mentor Page | `app/dashboard/mentor/page.tsx` | M1 | PLANNED |
| M5 | Settings Page | `app/dashboard/settings/page.tsx` | M1 | PLANNED |
| M6 | Navigation Wiring & Redirects | `components/dashboard/Navbar.tsx`, `next.config.mjs` | M1-M5 | PLANNED |

## Interface Contracts
### Dashboard Layout ↔ Sub-Routes
- `app/dashboard/layout.tsx` validates `cookies().get('placely_student_id')`.
- Renders sticky top `<Navbar />` and wraps `{children}` inside `#0A0A0A` container.

### Navbar ↔ Routes
- Active route matching using `usePathname()`.
- `/dashboard` -> Dashboard tab active when `pathname === '/dashboard'`.
- `/dashboard/*` -> Sub-tabs active when `pathname.startsWith(href)`.

## Code Layout
- `app/dashboard/layout.tsx`: Server Layout with Navbar and Auth Guard.
- `app/dashboard/page.tsx`: Overview Dashboard.
- `app/dashboard/roadmap/page.tsx`: Roadmap Page.
- `app/dashboard/projects/page.tsx`: Projects Page.
- `app/dashboard/mentor/page.tsx`: AI Mentor Page.
- `app/dashboard/settings/page.tsx`: Settings Page.
- `components/dashboard/Navbar.tsx`: Persistent Navigation Bar.
- `components/dashboard/CircularRing.tsx`: SVG Circular Progress Ring.
- `next.config.mjs`: Legacy Redirects Config.

## Protected Files (DO NOT MODIFY)
- `public/index.html`
- `public/sw.js`
- `public/manifest.webmanifest`
- `public/dsa.html`
- `public/portfolio.html`
- `public/offline.html`
