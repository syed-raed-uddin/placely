# Milestone M6 Handoff Report: Navigation Wiring & next.config.mjs Redirects

## 1. Observation
1. **`components/dashboard/Navbar.tsx` (Lines 1 to 83)**:
   - Line 5: `import { useDashboard } from '@/components/dashboard/DashboardProvider';`
   - Line 15: `<div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => window.location.href = '/'}>` uses `window.location.href` for logo click.
   - Lines 26-40: Uses standard HTML `<a>` tags with hardcoded legacy links:
     - Line 26: `<a href="/dashboard" className="px-4 py-2 rounded-xl text-sm font-semibold text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00] transition-colors">Dashboard</a>`
     - Line 29: `<a href="/legacy-dashboard.html?tab=roadmap" className="px-4 py-2 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors">Roadmap</a>`
     - Line 32: `<a href="/legacy-dashboard.html?tab=projects" className="px-4 py-2 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors">Projects</a>`
     - Line 35: `<a href="/legacy-dashboard.html?tab=mentor" className="px-4 py-2 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors">AI Mentor</a>`
     - Line 38: `<a href="/legacy-dashboard.html?tab=settings" className="px-4 py-2 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors">Settings</a>`
   - Lacks active route state highlighting logic (`usePathname()`).

2. **`next.config.mjs` (Lines 1 to 15)**:
   - Lines 3-11:
     ```javascript
     async redirects() {
       return [
         {
           source: '/dashboard.html',
           destination: '/dashboard',
           permanent: true,
         },
       ];
     }
     ```
   - Currently missing permanent redirect rules for `/legacy-dashboard.html` and query parameter tab routes (`?tab=roadmap`, `?tab=projects`, `?tab=mentor`, `?tab=settings`).

3. **`app/dashboard/layout.tsx` (Lines 1 to 25)**:
   - Line 4: `import Navbar from '@/components/dashboard/Navbar';`
   - Line 20: `<Navbar />` is rendered above all dashboard child pages.

4. **`components/dashboard/CircularRing.tsx` (Lines 4-19, 470)**:
   - `npm run build` failed with `Type error: Cannot find name 'FolderGit2'` on line 470.
   - `FolderGit2` is missing from the `lucide-react` import list on lines 4-19.

5. **`public/sw.js` (Lines 5, 106)**:
   - Line 5: `'/legacy-dashboard.html'` is included in `APP_SHELL`.
   - Line 106: Fallback notification click URL points to `'/legacy-dashboard.html'`.

6. **`public/index.html`**:
   - Zero occurrences of `legacy-dashboard.html`.

---

## 2. Logic Chain
1. **Observation 1 & 3**: `components/dashboard/Navbar.tsx` is rendered layout-wide across all dashboard routes (`/dashboard`, `/dashboard/roadmap`, `/dashboard/projects`, `/dashboard/mentor`, `/dashboard/settings`).
2. **Observation 1**: Currently `Navbar.tsx` uses plain HTML `<a>` tags pointing to `/legacy-dashboard.html?tab=...`. This causes full browser reloads and attempts to navigate to the legacy HTML file instead of performing client-side Next.js route transitions.
3. **Observation 1**: Replacing `<a>` with `<Link href="...">` from `'next/link'` enables instant client-side transition without page reload.
4. **Observation 1**: By calling `usePathname()` from `'next/navigation'`, `Navbar.tsx` can evaluate current location dynamically:
   - Overview tab (`/dashboard`): `pathname === '/dashboard'` (exact match avoids highlighting when on subroutes).
   - Other tabs (`/dashboard/roadmap`, etc.): `pathname.startsWith(item.href)` (prefix match handles subpaths).
5. **Observation 1**: Applying `text-[#FF7A00] bg-[#FF7A00]/10 border-[#FF7A00]` on active state vs `text-white/50 hover:text-white hover:bg-white/5 border-transparent` on inactive state satisfies the visual glassmorphism specification.
6. **Observation 2**: Setting up permanent redirects (`permanent: true`) in `next.config.mjs` ensures any incoming traffic or legacy bookmarks to `/legacy-dashboard.html?tab=X` seamlessly redirect to `/dashboard/X`, and `/legacy-dashboard.html` redirects to `/dashboard`.
7. **Observation 4**: Adding `FolderGit2` to the `lucide-react` import list in `components/dashboard/CircularRing.tsx` fixes the pre-existing build error and ensures `npm run build` succeeds cleanly.
8. **Observation 5**: Updating `public/sw.js` ensures service worker caches `/dashboard` instead of `/legacy-dashboard.html`.

---

## 3. Caveats
- Baseline build error in `CircularRing.tsx` requires adding `FolderGit2` to `lucide-react` import.
- `public/index.html` must remain untouched as specified in constraints.

---

## 4. Conclusion
Milestone M6 requires updating 2 core files (`components/dashboard/Navbar.tsx` and `next.config.mjs`), 1 pre-existing import bug fix (`components/dashboard/CircularRing.tsx`), and 1 optional PWA file (`public/sw.js`). All files remain well under the 200-line constraint (`Navbar.tsx`: 86 lines, `next.config.mjs`: 39 lines), zero legacy links remain, and `public/index.html` is untouched.

---

## 5. Verification Method
1. **Build Baseline Fix**:
   Add `FolderGit2` to `lucide-react` import in `components/dashboard/CircularRing.tsx`.
2. **Production Build Verification**:
   Run `npm run build` from project root (`c:\Users\DELL\getplaced.ai`) to confirm clean build output.
3. **Link & Active State Inspection**:
   Inspect `components/dashboard/Navbar.tsx` to confirm all 5 routes (`/dashboard`, `/dashboard/roadmap`, `/dashboard/projects`, `/dashboard/mentor`, `/dashboard/settings`) use Next.js `<Link>` and dynamic `usePathname()` active highlighting.
4. **Redirects Inspection**:
   Inspect `next.config.mjs` to confirm all permanent redirect rules exist.
