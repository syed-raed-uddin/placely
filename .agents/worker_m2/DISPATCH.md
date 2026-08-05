## 2026-08-05T08:49:18Z

You are Worker M2 (Roadmap Page Implementation).
Your working directory is: c:\Users\DELL\getplaced.ai\.agents\worker_m2

Objective:
Implement Requirement R2: Roadmap Page at `app/dashboard/roadmap/page.tsx`.

Inputs:
- Path to ORIGINAL_REQUEST.md: c:\Users\DELL\getplaced.ai\.agents\ORIGINAL_REQUEST.md
- Path to PROJECT.md: c:\Users\DELL\getplaced.ai\PROJECT.md
- Path to Spec Miner report: c:\Users\DELL\getplaced.ai\.agents\explorer_survey_2\analysis.md
- Project root: c:\Users\DELL\getplaced.ai

Exclusive File Ownership:
- `app/dashboard/roadmap/page.tsx` (Create file and parent directory if needed)

Requirements & UI Sections to Implement:
1. Server-side Auth Guard checking `cookies().get('placely_student_id')`. Redirect to `/` if missing.
2. Data fetching: Fetch `GET /api/dashboard/{student_id}` via `fetchDashboardData()` from `@/lib/api`. Fallback to `lib/mockData.ts` if fetch fails.
3. Hero & Overall Progress: Day count (`Day X of Y`), streak count (`🔥 X day streak`), animated progress bar, ASCII percentage complete, next milestone indicator.
4. Badges Shelf: Grid of 5 canonical badges (🐣 First Step, 🗺️ Track Explorer, 🔄 Loop Starter, ⚡ Function Wizard, 🎓 Graduate) with Earned vs Locked states.
5. AI Checkpoint: Quiz section for milestone days with 3 questions, score selector (0-3), submit button, pass/revise feedback banner.
6. Roadmap Accordion: Collapsible phases with tasks list.
7. Task Details View: Video watch buttons, task instructions, real-world context, code submission textarea with "Submit for AI Review" button, AI Mentor feedback block.

Scope Boundaries:
- Do NOT modify `public/index.html`, `public/sw.js`, `public/manifest.webmanifest`, `public/dsa.html`, `public/portfolio.html`, `public/offline.html`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Completion Criteria:
Create `app/dashboard/roadmap/page.tsx`, verify `npm run build` passes cleanly, write handoff.md, and send completion message to parent.
