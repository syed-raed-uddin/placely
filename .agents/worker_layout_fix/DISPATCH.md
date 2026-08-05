## 2026-08-05T14:23:12Z

You are Worker Layout Fix (Layout Context Provider Fix).
Your working directory is: c:\Users\DELL\getplaced.ai\.agents\worker_layout_fix

Objective:
Fix React Context hierarchy regression identified by Challenger 2 in `app/dashboard/layout.tsx` so that `<Navbar />` receives authentic student data from `<DashboardProvider>`.

Inputs:
- Path to ORIGINAL_REQUEST.md: c:\Users\DELL\getplaced.ai\.agents\ORIGINAL_REQUEST.md
- Path to PROJECT.md: c:\Users\DELL\getplaced.ai\PROJECT.md
- File to modify: `app/dashboard/layout.tsx` at `c:\Users\DELL\getplaced.ai\app\dashboard\layout.tsx`
- File to reference: `app/dashboard/page.tsx` for `mapBackendToDashboard` function.

Problem Identified:
`Navbar` calls `useDashboard()`. Currently `DashboardProvider` is inside `app/dashboard/page.tsx`, so `Navbar` in `layout.tsx` is outside the provider tree and falls back to mock initials "AC".

Fix Requirements:
1. Make `app/dashboard/layout.tsx` an async server component.
2. Read `placely_student_id` and `placely_token` cookies. If missing, `redirect('/')`.
3. Fetch dashboard data via `fetchDashboardData(studentId, token)` and map it to `DashboardData` using the `mapBackendToDashboard` logic.
4. Wrap both `<Navbar />` and `{children}` inside `<DashboardProvider initialData={realData}>`.
5. Verify `npm run build` succeeds with 0 errors.

Scope Boundaries:
- Do NOT touch protected files (`public/index.html`, etc.).

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Completion Criteria:
Update `app/dashboard/layout.tsx`, verify clean build, write handoff.md, and notify parent.
