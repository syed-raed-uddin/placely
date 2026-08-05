## 2026-08-05T08:49:18Z
You are Worker M4 (AI Mentor Page Implementation).
Your working directory is: c:\Users\DELL\getplaced.ai\.agents\worker_m4

Objective:
Implement Requirement R4: AI Mentor Page at `app/dashboard/mentor/page.tsx`.

Inputs:
- Path to ORIGINAL_REQUEST.md: c:\Users\DELL\getplaced.ai\.agents\ORIGINAL_REQUEST.md
- Path to PROJECT.md: c:\Users\DELL\getplaced.ai\PROJECT.md
- Path to Spec Miner report: c:\Users\DELL\getplaced.ai\.agents\explorer_survey_2\analysis.md
- Project root: c:\Users\DELL\getplaced.ai

Exclusive File Ownership:
- `app/dashboard/mentor/page.tsx` (Create file and parent directory)

Requirements & UI Sections to Implement:
1. Server-side Auth Guard checking `cookies().get('placely_student_id')`. Redirect to `/` if missing.
2. Full Chat Interface with Kiro: Header with avatar (`🤖`), online status (`● Online`), title ("Kiro — AI Mentor").
3. Scrollable Message History: Distinct bubbles for student (right, `#FF7A00`) and Kiro (left, `glass-card`).
4. SSE Streaming Response Handler: Send `POST /api/mentor/chat` or `POST /api/chat/message` with student auth, consume Server-Sent Events (`data: {"text": "..."}`) ending in `[DONE]`, updating state token-by-token.
5. Markdown & Code formatting with syntax blocks and copy buttons.
6. Animated 3-dot typing indicator while awaiting stream chunk.
7. Suggested Question Chips: Render chips above input area (from mockData or API).
8. Textarea input with auto-growing height, send button (`Enter` to send, `Shift+Enter` for newline).
9. Focus Mode Pomodoro timer overlay modal with timer controls.

Scope Boundaries:
- Do NOT modify protected public files (`public/index.html`, etc.).

Completion Criteria:
Create `app/dashboard/mentor/page.tsx`, verify `npm run build` passes cleanly, write handoff.md, and send completion message to parent.
