# BRIEFING — 2026-08-05T08:50:00Z

## Mission
Implement Requirement R4: AI Mentor Page at `app/dashboard/mentor/page.tsx` with full chat interface, SSE streaming handler, markdown/code formatting, suggested questions, pomodoro focus mode modal, server-side auth guard check.

## 🔒 My Identity
- Archetype: implementer
- Roles: implementer, qa, specialist
- Working directory: c:\Users\DELL\getplaced.ai\.agents\worker_m4
- Original parent: 140e9e0f-577b-4840-9424-d08967401270
- Milestone: Requirement R4 (AI Mentor Page)

## 🔒 Key Constraints
- Exclusive file ownership: `app/dashboard/mentor/page.tsx`
- Build must pass (`npm run build`)
- Genuine state & logic, no cheating or hardcoded mock pass

## Current Parent
- Conversation ID: 140e9e0f-577b-4840-9424-d08967401270
- Updated: 2026-08-05T08:50:00Z

## Task Summary
- **What to build**: AI Mentor Page at `app/dashboard/mentor/page.tsx`
- **Success criteria**:
  1. Auth guard checking `cookies().get('placely_student_id')` or next/headers cookies. Redirect to `/` if missing. Note: Next.js App Router server component or client component wrapping server check / layout check.
  2. Full chat interface with Kiro (`🤖`, `● Online`, title "Kiro — AI Mentor").
  3. Scrollable message history with distinct bubbles (Student right `#FF7A00`, Kiro left `glass-card`).
  4. SSE Streaming handler: send POST to `/api/mentor/chat` or `/api/chat/message`, consume SSE (`data: {"text": "..."}` or token stream), ending in `[DONE]`.
  5. Markdown & code block formatting with copy button.
  6. Animated 3-dot typing indicator.
  7. Suggested question chips.
  8. Textarea with auto-grow and Enter key handling.
  9. Pomodoro Focus Mode overlay modal with timer controls.

## Change Tracker
- **Files modified**: `app/dashboard/mentor/page.tsx`
- **Build status**: Pending
- **Pending issues**: None

## Quality Status
- **Build/test result**: Untested
- **Lint status**: Clean
- **Tests added/modified**: Pending verification

## Loaded Skills
- None
