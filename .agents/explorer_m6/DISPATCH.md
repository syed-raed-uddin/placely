## 2026-08-05T14:54:42Z
Investigate the codebase to specify exact technical implementation steps for Milestone M6:
1. Navbar Wiring: Inspect `components/dashboard/Navbar.tsx` (and `app/dashboard/layout.tsx` or related components). Find all legacy links like `href="/legacy-dashboard.html?tab=..."` or similar and detail how to replace them with proper Next.js `<Link>` tags pointing to:
   - `/dashboard` (Overview)
   - `/dashboard/roadmap` (Roadmap)
   - `/dashboard/projects` (Projects)
   - `/dashboard/mentor` (AI Mentor)
   - `/dashboard/settings` (Settings)
2. Active Tab Highlighting: Detail how active link highlighting should be implemented using `usePathname()` from `next/navigation`. Verify how active state styling (e.g. orange text/border, glass glow) works with exact path matches or prefix matches.
3. Redirects Configuration: Inspect `next.config.mjs` (or `next.config.js`). Specify the exact `redirects()` async function configuration to permanently redirect `/legacy-dashboard.html` -> `/dashboard` (permanent: true).
4. Verify if any other files in the project contain legacy dashboard links that need updating for consistency.
5. Confirm constraints: `public/index.html` must NOT be touched. `npm run build` must pass cleanly. All files must remain < 200 lines.
