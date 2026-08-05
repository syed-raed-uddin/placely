# Handoff Report — Explorer 3 (Routing & Layout Explorer)

**Working Directory:** `c:\Users\DELL\getplaced.ai\.agents\explorer_survey_3`  
**Target Project Root:** `c:\Users\DELL\getplaced.ai`  
**Date:** 2026-08-05  

---

## 1. Observation

- **`app/layout.tsx` (lines 18-30):** Defines root HTML/body structure (`bg-[#0A0A0A]`, `Inter` font, `dark` theme class). Does NOT contain any dashboard navigation bar.
- **`app/dashboard/page.tsx` (lines 123-124):** Currently renders `<Navbar />` inside `<DashboardProvider initialData={realData}>` and a `div` wrapper `<div className="min-h-screen bg-[#0A0A0A] text-white...">`. Performs cookie auth check (`placely_student_id`) on lines 114-116.
- **`components/dashboard/Navbar.tsx` (lines 26-40):** Uses legacy HTML `<a>` tags with hardcoded `href="/legacy-dashboard.html?tab=..."` and hardcoded active styling on the Dashboard link. Uses `window.location.href = '/'` on logo click (line 15). Lacks fixed bottom navigation for mobile screen sizes (`< 768px`).
- **`next.config.mjs` (lines 3-11):** Contains a single redirect rule from `/dashboard.html` to `/dashboard`. Does not yet contain redirect rules for `/legacy-dashboard.html` or its `?tab=` query parameter variants.
- **`package.json` (lines 11-19):** Runs Next.js `14.2.35` with `framer-motion`, `lucide-react`, `tailwindcss`, and `typescript`.
- **`npm run build` command execution:** Succeeded with exit code 0, generating 6 static/dynamic routes (`/`, `/_not-found`, `/dashboard`).

---

## 2. Logic Chain

1. **Persistent Navbar Requirement (R1):** Next.js 14 App Router layout components (`app/dashboard/layout.tsx`) wrap all descendant sub-routes (`/dashboard`, `/dashboard/roadmap`, `/dashboard/projects`, `/dashboard/mentor`, `/dashboard/settings`). Placing `<Navbar />` in `layout.tsx` guarantees that `<Navbar />` remains continuously mounted during client-side navigation (`<Link>`), maintaining React state and avoiding full page refreshes.
2. **Page Refactoring (R1):** Since `layout.tsx` renders `<Navbar />` and the outer layout container, `app/dashboard/page.tsx` must remove its inline `<Navbar />` import and JSX element to prevent duplicate navbar rendering.
3. **Route Highlighting & Navigation Wiring (R6):** Upgrading `Navbar.tsx` to use Next.js `<Link>` components and `usePathname()` from `next/navigation` allows active tab styling (`text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00]`) to update dynamically based on `pathname`. Adding a mobile bottom navbar (`md:hidden fixed bottom-0`) ensures complete mobile responsiveness.
4. **Redirects (R6):** Configuring `next.config.mjs` with `redirects()` matching `/legacy-dashboard.html` and query param `tab` ensures backwards compatibility for legacy links and bookmarks.
5. **Auth Protection:** Reading `placely_student_id` cookie inside `layout.tsx` provides a centralized auth guard for all `/dashboard/*` sub-routes, redirecting unauthenticated visitors to `/`.

---

## 3. Caveats

- **State Sync in `Navbar`:** `Navbar.tsx` relies on `useDashboard()` context. When rendered inside `layout.tsx`, if a sub-route (e.g. `/dashboard/roadmap`) does not wrap its page with `DashboardProvider`, `useDashboard()` cleanly defaults to `fallbackData`. If persistent user initials are needed across all pages, sub-pages should either use `DashboardProvider` or data can be fetched in layout/provider.
- **Backend API Availability:** Server-side fetches to `https://placely-backend-production.up.railway.app` depend on network availability; fallback to `lib/mockData.ts` handles API timeouts/failures cleanly.

---

## 4. Conclusion

The Next.js App Router layout and routing structure is fully designed and documented in `c:\Users\DELL\getplaced.ai\.agents\explorer_survey_3\analysis.md`. Implementing `app/dashboard/layout.tsx`, refactoring `app/dashboard/page.tsx`, updating `components/dashboard/Navbar.tsx` with `<Link>` and `usePathname()`, and configuring `next.config.mjs` will satisfy all acceptance criteria for R1, R6, auth protection, and build integrity.

---

## 5. Verification Method

To verify the implementation once written:
1. **Build Verification:** Run `npm run build` in `c:\Users\DELL\getplaced.ai` — verify 0 TypeScript / Lint errors.
2. **Layout & Navbar Persistence:** Navigate between `/dashboard`, `/dashboard/roadmap`, `/dashboard/projects`, `/dashboard/mentor`, and `/dashboard/settings`. Verify the Navbar remains visible, state is preserved, and no browser page flash/refresh occurs.
3. **Active Tab Highlighting:** Inspect DOM classes on active tab; verify `#FF7A00` styling matches current `pathname`.
4. **Auth Guard:** Clear browser cookies (`placely_student_id`) and navigate to `/dashboard/roadmap` — verify immediate redirect to `/`.
5. **Redirect Rule:** Visit `http://localhost:3000/legacy-dashboard.html?tab=projects` — verify 307/308 redirect to `/dashboard/projects`.
