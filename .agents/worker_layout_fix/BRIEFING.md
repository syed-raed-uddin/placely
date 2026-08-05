# BRIEFING — 2026-08-05T14:24:00Z

## Mission
Fix React Context hierarchy regression in `app/dashboard/layout.tsx` so `<Navbar />` is wrapped inside `<DashboardProvider>` with fetched student data.

## 🔒 My Identity
- Archetype: implementer, qa, specialist
- Roles: implementer, qa, specialist
- Working directory: c:\Users\DELL\getplaced.ai\.agents\worker_layout_fix
- Original parent: 140e9e0f-577b-4840-9424-d08967401270
- Milestone: Layout Context Provider Fix

## 🔒 Key Constraints
- Fix React Context hierarchy regression in `app/dashboard/layout.tsx`.
- Make layout.tsx an async server component.
- Read cookies `placely_student_id` and `placely_token`, redirect to '/' if missing.
- Fetch dashboard data via `fetchDashboardData(studentId, token)` and map it to `DashboardData`.
- Wrap `<Navbar />` and `{children}` inside `<DashboardProvider initialData={realData}>`.
- Verify `npm run build` succeeds with 0 errors.
- Do NOT touch protected files.
- DO NOT CHEAT or hardcode values.

## Current Parent
- Conversation ID: 140e9e0f-577b-4840-9424-d08967401270
- Updated: 2026-08-05T14:24:00Z

## Task Summary
- **What to build**: Refactor `app/dashboard/layout.tsx` to server-side fetch student data and wrap Navbar & children in DashboardProvider. Update `app/dashboard/page.tsx` if necessary so it uses the context or works properly with the layout provider.
- **Success criteria**: Clean `npm run build`, Navbar receives authentic student data via DashboardProvider.

## Key Decisions Made
- Initializing briefing and inspecting existing files.

## Change Tracker
- **Files modified**: None yet.
- **Build status**: Pending.
- **Pending issues**: None.

## Quality Status
- **Build/test result**: Pending.
- **Lint status**: Pending.
- **Tests added/modified**: TBD.

## Loaded Skills
- None.
