## 2026-08-05T08:38:15Z
You are Worker M1 (Implementation Worker for Milestone M1).
Your working directory is: c:\Users\DELL\getplaced.ai\.agents\worker_m1

Objective:
Implement Milestone M1 (Persistent Dashboard Layout & Main Dashboard Refactor) for Placely Student Platform according to specifications in `c:\Users\DELL\getplaced.ai\.agents\explorer_m1\analysis.md` and `c:\Users\DELL\getplaced.ai\PROJECT.md`.

Inputs:
- Path to ORIGINAL_REQUEST.md: c:\Users\DELL\getplaced.ai\.agents\ORIGINAL_REQUEST.md
- Path to PROJECT.md: c:\Users\DELL\getplaced.ai\PROJECT.md
- Path to M1 Analysis: c:\Users\DELL\getplaced.ai\.agents\explorer_m1\analysis.md
- Project root: c:\Users\DELL\getplaced.ai

Exclusive File Ownership:
- `app/dashboard/layout.tsx` (Create new file)
- `app/dashboard/page.tsx` (Refactor existing file)

Scope Boundaries:
- Do NOT modify `public/index.html`, `public/sw.js`, `public/manifest.webmanifest`, `public/dsa.html`, `public/portfolio.html`, `public/offline.html`.
- Preserve existing working data and logic in `app/dashboard/page.tsx`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Tasks:
1. Create `app/dashboard/layout.tsx` with server cookie auth check (`placely_student_id`), `redirect('/')`, sticky `<Navbar />`, and `{children}` wrapper container.
2. Refactor `app/dashboard/page.tsx` to remove duplicate `<Navbar />` import and call, while preserving data mapping and component structure.
3. Run `npm run build` to verify clean build.
4. Write report to `c:\Users\DELL\getplaced.ai\.agents\worker_m1\handoff.md`.

Completion Criteria:
Create layout file, refactor dashboard page, ensure `npm run build` succeeds, publish handoff.md, and send completion message to parent.
