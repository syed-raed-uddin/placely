## 2026-08-05T14:20:00Z
You are Worker M5 (Settings Page Implementation).
Your working directory is: c:\Users\DELL\getplaced.ai\.agents\worker_m5

Objective:
Implement Requirement R5: Settings Page at `app/dashboard/settings/page.tsx`.

Inputs:
- Path to ORIGINAL_REQUEST.md: c:\Users\DELL\getplaced.ai\.agents\ORIGINAL_REQUEST.md
- Path to PROJECT.md: c:\Users\DELL\getplaced.ai\PROJECT.md
- Path to Spec Miner report: c:\Users\DELL\getplaced.ai\.agents\explorer_survey_2\analysis.md
- Project root: c:\Users\DELL\getplaced.ai

Exclusive File Ownership:
- `app/dashboard/settings/page.tsx` (Create file and parent directory)

Requirements & UI Sections to Implement:
1. Server-side Auth Guard checking `cookies().get('placely_student_id')`. Redirect to `/` if missing.
2. Profile Information Display: Student name, email, active course/track, enrollment date, current day/streak.
3. Track Management Card: List of enrolled and available tracks with switch active track action.
4. My Personal Notes Card: Persistent scratchpad saved to `localStorage` (`placely_settings_notes`).
5. My Tasks Checklist Card: Interactive checklist with add/complete/delete saved to `localStorage` (`placely_settings_tasks`).
6. Deep Work Banner: Pomodoro focus mode button trigger.
7. Account Actions & Log Out: Styled "Log Out" button that clears cookies (`placely_student_id`, `placely_token`), clears `localStorage` keys, and redirects to `/`.

Scope Boundaries:
- Do NOT modify protected public files (`public/index.html`, etc.).

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Completion Criteria:
Create `app/dashboard/settings/page.tsx`, verify `npm run build` passes cleanly, write handoff.md, and send completion message to parent.
