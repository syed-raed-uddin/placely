## 2026-08-05T09:28:28Z
Milestone M6 (Navigation Wiring & next.config.mjs Redirects)
Original User Request File: c:\Users\DELL\getplaced.ai\.agents\ORIGINAL_REQUEST.md
Project Root: c:\Users\DELL\getplaced.ai
Your Working Directory: c:\Users\DELL\getplaced.ai\.agents\worker_m6
Explorer Handoff: c:\Users\DELL\getplaced.ai\.agents\explorer_m6\handoff.md

Scope & Tasks:
1. `components/dashboard/Navbar.tsx`:
   - Import `Link` from `'next/link'` and `usePathname` from `'next/navigation'`.
   - Update logo click / brand link to use Next.js `<Link href="/dashboard">` or `<Link href="/">`.
   - Replace standard HTML `<a>` tags with Next.js `<Link>` components pointing to:
     - `/dashboard` (Overview / Dashboard)
     - `/dashboard/roadmap` (Roadmap)
     - `/dashboard/projects` (Projects)
     - `/dashboard/mentor` (AI Mentor)
     - `/dashboard/settings` (Settings)
   - Implement active tab highlighting using `usePathname()`:
     - Overview: `pathname === '/dashboard'`
     - Sub-routes: `pathname.startsWith(href)` (or `pathname === href` for subroute match)
     - Active styling: `text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00]`
     - Inactive styling: `text-white/50 hover:text-white hover:bg-white/5 border border-transparent`
   - Keep file line count under 200 lines.

2. `next.config.mjs`:
   - Update `redirects()` async function to include permanent redirects (`permanent: true`):
     - `/legacy-dashboard.html` -> `/dashboard`
     - Any required legacy tab redirects.

3. Fix pre-existing import issue in `components/dashboard/CircularRing.tsx`:
   - Add missing `FolderGit2` to the `lucide-react` import list on line 4–19 if needed.

4. `public/sw.js`:
   - Update legacy references (`/legacy-dashboard.html` -> `/dashboard`) in app shell cache list.

5. Verification:
   - Run `npm run build` at project root `c:\Users\DELL\getplaced.ai` to verify clean build.
   - Verify `public/index.html` was NOT modified.
