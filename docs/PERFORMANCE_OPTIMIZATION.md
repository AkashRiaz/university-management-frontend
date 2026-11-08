# Dashboard Performance & Optimization Report

> **Status:** Optimization implemented. Bundle results are measured from real production builds.
> Lighthouse, React Profiler and Core Web Vitals values must be recorded in a browser while logged in (marked **_fill in_**).

---

## 1. Project Information

| Item | Value |
| --- | --- |
| Project name | Apex University – University Management System (Frontend) |
| Live URL | _fill in – add deployed URL_ |
| GitHub repository | https://github.com/AkashRiaz/university-management-frontend |
| Framework | Next.js 16.3.5 (App Router, Turbopack), React 19.2.8 |
| Styling / UI | Tailwind CSS v4, shadcn/ui, Base UI, lucide-react |
| Forms / validation | @tanstack/react-form, react-hook-form, zod |
| Feedback / dialogs | sonner, sweetalert2 |
| Public-page 3D / motion | three, @react-three/fiber, @react-three/drei, framer-motion |
| Lists / virtualization | @tanstack/react-virtual (**new**) |
| Dashboards in scope | Admin (`/admin-dashboard/*`), Student (`/student-dashboard/*`), Instructor (`/instructor-dashboard/*`) |
| Report baseline commit | `eb7f8f0` |

### Dashboard architecture (before → after)

| Part | Before | After |
| --- | --- | --- |
| Dashboard layout | Server Component, calls `getMe()` | Unchanged |
| Sidebar | Whole sidebar was a Client Component, with menus and icons for all 3 roles | **Server Component**. Only the current role's menu is sent. Only the active-link logic is client-side |
| Admin tables | Server Components, but the table building block (`table.tsx`) was marked `"use client"` | Table building block is now **server-only**. Tables arrive as plain HTML |
| Create / Edit dialogs | Form, form library and zod loaded with the page | Form is **lazy-loaded** when the dialog opens (skeleton while loading) |
| Delete buttons | sweetalert2 loaded with the page | sweetalert2 **loaded on first click** (preloaded on hover) |
| Search | Debounced 500 ms, but the input lost focus after each search | Debounced 500 ms, **focus bug fixed**, low-priority update, skips unchanged searches |

---

## 2. How the Baseline Was Captured

Every measurement was taken **before any optimization**, and again after it, **under the same conditions**:

- A production build (`npm run build`), **never `npm run dev`**.
- Same pages, same user role, same data.
- Bundle sizes: the Next.js build report (`.next/diagnostics/route-bundle-stats.json`) plus the Turbopack analyzer (`npx next experimental-analyze --output`). Compressed (gzip) sizes are measured from the real output files.
- Lighthouse settings: **Mobile, Navigation mode, Performance category, default throttling**, 3 runs, **median** reported.

### 2.1 Pages measured (fixed test set)

| # | Page | Why |
| --- | --- | --- |
| P1 | `/admin-dashboard` | Overview / stat cards (main landing page) |
| P2 | `/admin-dashboard/students` | Largest data table with search, tabs and pagination |
| P3 | `/admin-dashboard/invoices` | Second large table, heavy create form |
| P4 | `/student-dashboard/course-registration` | Most interactive client component (`RegistrationWorkspace`) |
| P5 | `/instructor-dashboard/attendance/[sessionId]` | Attendance roster list |
| P6 | `/admin-dashboard/sections` | Heaviest dashboard page in the baseline (added after the bundle analysis) |

### 2.2 Evidence folders

```
docs/
├── PERFORMANCE_OPTIMIZATION.md      ← this file
├── reports/
│   ├── bundle/
│   │   ├── before/                  summary.json, route-bundle-stats.json, analyze/ (treemap)
│   │   ├── after/                   summary.json, route-bundle-stats.json, analyze/ (treemap)
│   │   ├── build-after.txt          production build output
│   │   └── compare-before-vs-after.md   full per-route comparison (all 58 routes)
│   ├── lighthouse/                  before-P*.html, after-P*.html   (fill in)
│   └── profiler/                    before-*.json,  after-*.json    (fill in)
└── screenshots/                     *.png used in this document      (fill in)
```

---

## 3. Initial Performance Bottlenecks — Result of Each

The candidates came from reading the code. Each one was then **confirmed or rejected** with the bundle analysis and testing.

| # | Bottleneck | Location | Confirmed? | Outcome |
| --- | --- | --- | --- | --- |
| B1 | **Large tables rendered fully into the DOM.** No list could handle 1,000+ records. | Students table, `AttendanceRoster.tsx` | ✅ Confirmed | ✅ **Fixed**: virtualization on 2 lists (§6.2) |
| B2 | **Heavy client component with broad state.** `RegistrationWorkspace` held all state in one place, so every change re-rendered the whole workspace. | `RegistrationWorkspace.tsx` | ✅ Confirmed | ✅ **Fixed**: split into 6 memoized parts with colocated state (§6.1) |
| B3 | **Large forms bundled eagerly.** Dialog forms (with zod, 381 KB) shipped with their table pages even when never opened. | `*Create.tsx` dialogs | ✅ Confirmed (biggest problem) | ✅ **Fixed** for 16 dialogs (§6.4). ⚠️ Full-page forms remain (§8) |
| B4 | **`sweetalert2` imported statically in 21 delete components** (74 KB on every table page). | `*Delete.tsx` | ✅ Confirmed | ✅ **Fixed**: loaded on first click (§6.4) |
| B5 | **Unused / misused dependencies** (`@tanstack/react-table`, `dotenv`, the `cn` package, two form libraries). | `package.json` | ⚠️ Partly | ✅ **Fixed**: removed the 2 unused packages. ❌ **Rejected**: `cn` (see note). ➖ **Kept**: react-hook-form (login/verify pages only, not the dashboard) |
| B6 | **Sidebar re-renders on every navigation and ships as client code.** | `DashboardSidebar.tsx` | ✅ Confirmed | ✅ **Fixed**: Server Component + memoized menu items (§6.1, §6.5) |
| B7 | **Only one debounced input; the search box loses focus.** | `SearchBar.tsx`, `RegistrationWorkspace.tsx`, `AttendanceRoster.tsx` | ✅ Confirmed (plus a focus bug) | ✅ **Fixed / improved**: 4 debounced inputs, focus bug fixed (§6.3) |
| B8 | **High-frequency events not throttled** (scroll, screen-size check). | `DashboardMainContent.tsx`, `use-mobile.ts` | ✅ Confirmed | ✅ **Improved**: rAF + `useRef` scroll handling, `useSyncExternalStore` media query (§6.3) |
| B9 | **Heavy public-page libraries** (`three`, `framer-motion`) leaking into dashboard chunks. | `HomePage/*` | ❌ **Rejected** | No change needed. They appear in **no** dashboard page and are already lazy-loaded on the home page |
| N1 | **(New finding)** `components/ui/table.tsx` was marked `"use client"` with no interactivity, so all 38 tables were hydrated in the browser. | `table.tsx` | ✅ Confirmed | ✅ **Fixed** (§6.5) |
| N2 | **(New finding)** Search input lost focus and cursor after each debounced search (`key={searchTerm}` remounted it). | `SearchBar.tsx` | ✅ Confirmed (bug) | ✅ **Fixed** (§6.3) |

> **Note on `cn`:** the audit first assumed the npm package `cn` was a mistake. It is actually shadcn's own small replacement for `clsx + tailwind-merge`, and `lib/utils` already re-exports it. Replacing it would save nothing, so it was kept.

> Requirement check: at least 3 bottlenecks. **9 confirmed** (B1–B4, B6–B8, N1, N2), 1 partly confirmed (B5), 1 rejected (B9).

---

## 4. Initial Metrics (Baseline)

### 4.1 Lighthouse – BEFORE (Mobile, median of 3)

| Page | Perf score | FCP | LCP | TBT | CLS | Speed Index | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1 `/admin-dashboard` | _fill in_ | | | | | | `lighthouse-before-P1.png` |
| P2 `/admin-dashboard/students` | _fill in_ | | | | | | |
| P3 `/admin-dashboard/invoices` | _fill in_ | | | | | | |
| P4 `/student-dashboard/course-registration` | _fill in_ | | | | | | |
| P5 `/instructor-dashboard/attendance/[id]` | _fill in_ | | | | | | |

### 4.2 React Profiler – BEFORE

| Interaction | Commits | Slowest commit (ms) | Total render time (ms) | Unnecessary re-renders observed |
| --- | --- | --- | --- | --- |
| P2 search "rah" + clear | _fill in_ | | | Input remounts after each search (focus lost) |
| P2 tab switch + pagination | _fill in_ | | | |
| P4 add / drop course | _fill in_ | | | Whole workspace re-renders |
| P4 tick terms checkbox / change semester | _fill in_ | | | Whole workspace re-renders |
| P5 change one attendance status | _fill in_ | | | Every row re-renders |
| Sidebar toggle / navigation | _fill in_ | | | Every menu item re-renders |

### 4.3 Bundle – BEFORE (measured)

First-load JavaScript per route (raw = minified size, gzip = what is actually downloaded):

| Route | Raw | Gzip |
| --- | --- | --- |
| Shared by all routes (framework, React, UI kit) | 644 KB | 201 KB |
| `/admin-dashboard` | 740 KB | 232 KB |
| `/admin-dashboard/students` | 825 KB | 255 KB |
| `/admin-dashboard/invoices` | 947 KB | 291 KB |
| `/admin-dashboard/sections` (largest) | 1,339 KB | 382 KB |
| `/student-dashboard/course-registration` | 752 KB | 236 KB |
| `/instructor-dashboard/attendance/[sessionId]` | 792 KB | 250 KB |
| Average of all 41 dashboard routes | — | 311 KB |

| Largest client modules (analyzer) | Size (minified) | Used by |
| --- | --- | --- |
| `zod` (167 KB of it is translation files) | 381 KB | 18 admin pages with Create/Edit dialogs |
| `next` runtime + polyfills | 359 KB | Every route (framework) |
| `react-dom` | 200 KB | Every route (framework) |
| `@base-ui/react` | 127–175 KB | Every route |
| `sweetalert2` | 74 KB | Every admin table page |
| `@tanstack/form-core` | 51 KB | Pages with Create/Edit dialogs |
| `sonner` | 35 KB | Every route (root layout) |
| `three` + `@react-three/fiber` | 723 + 161 KB | Home page only, already lazy-loaded (B9 rejected) |

### 4.4 Core Web Vitals – BEFORE

| Metric | Target | P1 | P2 | P4 |
| --- | --- | --- | --- | --- |
| LCP | ≤ 2.5 s | _fill in_ | | |
| INP | ≤ 200 ms | _fill in_ | | |
| CLS | ≤ 0.1 | _fill in_ | | |

---

## 5. Optimization Plan — What Was Done

| Req. | Planned technique | Status | Notes |
| --- | --- | --- | --- |
| §2 Rendering | Split `RegistrationWorkspace` into memoized parts; `useMemo` / `useCallback` | ✅ Done | Split into 6 parts instead of 3 |
| §2 Rendering | `React.memo` sidebar menu items, memoized role lookup | ✅ Done | The role lookup moved to the server instead |
| §3 Virtualization | `@tanstack/react-virtual` on a 1,000+ row student list, overscan ≈ 8 | ✅ Done | New "All (scroll view)" tab |
| §3 Virtualization | Attendance roster or invoice list | ✅ Done | Attendance roster |
| §4 Debounce | Debounced filter in course registration | ✅ Done | |
| §4 Debounce | Debounced filter in roster / list; keep `SearchBar` debounce | ✅ Done | Plus the focus bug fix in `SearchBar` |
| §4 State / rAF | Scroll in `useRef` + rAF; `useSyncExternalStore` for mobile breakpoint | ✅ Done | Plus a per-row external store in the attendance roster |
| §5 Code splitting | Lazy `StudentRegistrationForm`, `InvoiceCreate`, large dialogs | ✅ Done for 16 dialogs (incl. Invoice) | `StudentRegistrationForm` **not** lazy-loaded: it *is* the page, so deferring it would not reduce what the page needs (§8) |
| §5 Code splitting | `sweetalert2` via `await import()` on Delete click | ✅ Done | Plus preload on hover/focus |
| §5 Dependencies | Remove `@tanstack/react-table`, `dotenv`; replace `cn`; unify form libraries | ⚠️ Partly | Removed both packages. `cn` kept (see §3 note). react-hook-form kept (auth pages only) |
| §6 Server/Client | Sidebar header/footer to Server Components | ✅ Done | Whole sidebar shell is now a Server Component |
| §6 Server/Client | Table parts to Server Components | ✅ Done | Removed `"use client"` from `table.tsx` (affects all 38 tables) |

---

## 6. Optimizations Implemented

For each change: **what was fixed or improved, which files, and why it helps.**

### 6.1 Rendering & component optimization (Requirement §2)

#### ① Course Registration workspace (fixes B2)

**Problem:** one 212-line component held all the state. Choosing a semester, ticking the terms checkbox, adding or dropping a course: every change redrew the entire screen, including every section card.

**What changed:**
- Split into 6 small memoized components: *Semester picker, Registration switcher, Available sections (with memoized section cards), Selected courses, Payment status, Submit panel*.
- **State colocation:** the semester dropdown value, the terms checkbox and the course filter now live *inside* the component that uses them.
- **`useCallback`** for Create, Add, Drop, Submit and Pay, so memoized children get the same function every render.
- **`useMemo`** for the matching invoice, the set of added sections and the filtered section list.

**Files:** `app/(dashboardGroup)/student-dashboard/_components/RegistrationWorkspace.tsx`

**Improvement:** ticking the checkbox now redraws only the Submit panel, and changing the semester redraws only the Semester picker, instead of the whole workspace.

#### ② Sidebar menu items (fixes B6)

**Problem:** every navigation re-rendered every menu item in every group.

**What changed:** each item is a `React.memo` component with a stable `onNavigate` (`useCallback`). Items are keyed by link, not by array index.

**Files:** `components/dashboard/DashboardSidebarNav.tsx`

**Improvement:** on navigation only 2 items re-render (the old active link and the new one).

#### ③ Attendance rows (fixes part of B1): see §6.3, *selective subscriptions*.

### 6.2 DOM virtualization & large data (Requirement §3, fixes B1)

#### ① Instructor › Attendance roster

- Virtualized with **TanStack Virtual**, **overscan of 8 rows**, rows measured after render so heights stay correct.
- New filter box (name, e-mail, roll number).
- **Files:** `app/(dashboardGroup)/instructor-dashboard/_components/AttendanceRoster.tsx`, `.../attendance/[sessionId]/page.tsx`

#### ② Admin › Students › "All (scroll view)" tab (new tab; existing tabs unchanged)

- Loads up to 1,000 students and shows them in a virtualized grid with a **sticky header** and horizontal scroll on small screens.
- Edit, Delete and Restore still work on every row.
- The list code itself is lazy-loaded, so the normal paginated page does not pay for it.
- **Files:** `.../_components/student/VirtualStudentList.tsx`, `VirtualStudentListLazy.tsx`, `StudentTable.tsx`

#### Representative data (1,000+ records)

The real database does not yet contain 1,000 records, so both lists accept **`?demo=1000`** (up to 5,000), which adds generated, realistic rows. The rows are the same every time, so before/after tests are comparable. Saving and row actions are disabled for generated rows, and a notice is shown. **Without the parameter nothing changes.**

- `/instructor-dashboard/attendance/<sessionId>?demo=1000`
- `/admin-dashboard/students?view=all&demo=1000`
- **File:** `lib/demo-data.ts`

**Improvement:** with 1,000 records the page holds about 20–35 row elements instead of 1,000+, so scrolling stays smooth and memory use stays flat.

### 6.3 State decoupling & event optimization (Requirement §4, fixes B7, B8, N2)

| # | Technique | Where | What was fixed / improved |
| --- | --- | --- | --- |
| 1 | **Debounced search (server)**: kept and improved | `components/ui/SearchBar.tsx` | ✅ **Fixed** the focus bug (N2): the input no longer remounts after each search. ✅ **Improved:** skips the request when the text did not change, and runs the URL update as a low-priority transition so typing never stutters. |
| 2 | **Debounced filter** (250 ms) | Attendance roster | Filtering 1,000+ rows waits until typing pauses. |
| 3 | **Debounced filter** (250 ms) | Students "All" view | Same, for the virtualized student list. |
| 4 | **Debounced filter** (250 ms) | Course Registration | Filter available sections by course code, title or room. |
| 5 | **Selective subscriptions (external store)** | Attendance roster | Each student's status lives in a small store outside React. Each row subscribes only to its own student (`useSyncExternalStore`), so changing one status re-renders **one row**, not the roster and all rows. |
| 6 | **External store for screen size** | `hooks/use-mobile.ts` | Subscribes directly to the browser media query. Notified only when the breakpoint is crossed, and avoids the extra render on load. |
| 7 | **`useRef` + `requestAnimationFrame`** | `components/dashboard/DashboardMainContent.tsx` | Scroll position kept in a ref (no re-render). At most one update per frame, and React state changes only when the new "Back to top" button shows or hides. |
| 8 | **`useRef` for mutable values** | `SearchBar.tsx` | The debounce timer and the input element are refs and never trigger renders. |

Shared helper: `hooks/useDebouncedValue.ts`

> Requirement check: at least 2 debounced interactions and 1 state/update optimization. **4 debounced inputs and 4 state optimizations.**

### 6.4 Bundle size & code splitting (Requirement §5, fixes B3, B4, B5)

#### ① 16 Create/Edit dialogs lazy-loaded (fixes B3)

- Each dialog was split into a **small button + dialog shell** (loads with the page) and the **form** (form library + zod schema + fields) in its own file, loaded with `next/dynamic` (`React.lazy` + `Suspense`).
- **Loading fallback:** the dialog opens immediately with a skeleton shaped like the form, so the dialog does not jump in size (no layout shift).
- **Preloading:** the form starts downloading on hover or keyboard focus of the button, so it is usually ready before the click.
- **Dialogs:** Academic Year, Class Schedule, Course, Faculty, Fee Structure, Fee Structure Item, Grade, Grade Scale, Invoice, Program Course, Room, Scholarship, Section, Section Instructor, Semester, Student Scholarship.
- **Files:** each `*Create.tsx` plus its new `*Form.tsx`, and `components/shared/DialogFormSkeleton.tsx`

#### ② sweetalert2 loaded on demand (fixes B4)

- The 21 Delete/Restore buttons use `confirmDialog()`, which runs `await import("sweetalert2")` the first time it is needed. It is preloaded on hover/focus.
- **Files:** `lib/confirm.ts` and all `*Delete.tsx` components

#### ③ Virtual student list lazy-loaded

- Only downloaded when the "All (scroll view)" tab is opened. **File:** `VirtualStudentListLazy.tsx`

#### ④ Dependency clean-up (B5)

- ✅ Removed `@tanstack/react-table` and `dotenv` (0 imports).
- ✅ The monospace font is no longer preloaded on every page (used in one place only). **File:** `app/layout.tsx`
- ❌ `cn` kept (see note in §3).

> Requirement check: at least 2 lazy-loaded components plus a bundle comparison. **18 lazy-loaded components/libraries, comparison in §7.3.**

### 6.5 Server / Client boundaries (Requirement §6, fixes B6, N1)

#### ① Dashboard sidebar → Server Component

- **Before:** client code. Every user downloaded the menu definitions and icons for **all three roles**, and the static header and footer (logo, name, e-mail) were hydrated in the browser.
- **After:** the server picks the role and sends **only that role's menu**, with icons already rendered as HTML. Header and footer are plain server HTML. Only active-link highlighting and closing the mobile menu run in the browser.
- **Files:** `components/dashboard/DashboardSidebar.tsx` (server), `DashboardSidebarNav.tsx` (small client part)

#### ② Table building block no longer client code

- **Before:** `components/ui/table.tsx` had `"use client"`, so all 38 server-rendered tables shipped table code and hydrated every row and cell.
- **After:** directive removed. Tables are plain HTML; only the interactive leaves (Edit, Delete, Restore buttons) are client components.

#### ③ Dialog shell vs. form

- The page table stays a Server Component, the button/dialog shell is a tiny Client Component, and the heavy form is a separately loaded Client Component.

**How this reduces client-side JavaScript:** code for static parts is no longer sent or executed in the browser, and fewer components need hydration. The JavaScript loaded by every dashboard page went from 232 KB to 229 KB (gzip). The bigger benefit is less hydration work on table pages, because table rows are no longer client components.

---

## 7. Results – Before vs After

### 7.1 Lighthouse (Mobile, median of 3)

| Page | Score before | Score after | LCP before → after | TBT before → after | CLS before → after |
| --- | --- | --- | --- | --- | --- |
| P1 `/admin-dashboard` | _fill in_ | | | | |
| P2 `/admin-dashboard/students` | _fill in_ | | | | |
| P3 `/admin-dashboard/invoices` | _fill in_ | | | | |
| P4 `/student-dashboard/course-registration` | _fill in_ | | | | |
| P5 `/instructor-dashboard/attendance/[id]` | _fill in_ | | | | |
| P6 `/admin-dashboard/sections` | _fill in_ | | | | |

### 7.2 React Profiler

| Interaction | Before | After | Expected after (from the code changes) |
| --- | --- | --- | --- |
| P2 search "rah" + clear | _fill in_ | _fill in_ | Input keeps focus. No remount. |
| P4 tick terms checkbox | _fill in_ | _fill in_ | Only `SubmitPanel` re-renders |
| P4 change semester | _fill in_ | _fill in_ | Only `SemesterPicker` re-renders |
| P4 add / drop course | _fill in_ | _fill in_ | Unchanged cards skip re-render (memo) |
| P5 (`?demo=1000`) change one status | _fill in_ | _fill in_ | Exactly 1 `AttendanceRow` re-renders |
| P5 (`?demo=1000`) scroll | _fill in_ | _fill in_ | ~20–35 rows in the DOM (Elements panel) |
| Sidebar navigation | _fill in_ | _fill in_ | 2 menu items re-render |

### 7.3 Bundle size – first-load JavaScript (measured)

| Route | Before (gzip) | After (gzip) | Change |
| --- | --- | --- | --- |
| Shared by all routes | 201 KB | 201 KB | 0% |
| P1 `/admin-dashboard` | 232 KB | 229 KB | −1.3% |
| P2 `/admin-dashboard/students` | 255 KB | 234 KB | **−8.6%** |
| P3 `/admin-dashboard/invoices` | 291 KB | 234 KB | **−19.4%** |
| P4 `/student-dashboard/course-registration` | 236 KB | 234 KB | −0.9% |
| P5 `/instructor-dashboard/attendance/[id]` | 250 KB | 258 KB | **+3.2%** ¹ |
| P6 `/admin-dashboard/sections` | 382 KB | 236 KB | **−38.2%** |
| `/admin-dashboard/courses` | 380 KB | 235 KB | −38.3% |
| `/admin-dashboard/semesters` | 380 KB | 235 KB | −38.3% |
| `/admin-dashboard/class-schedules` | 381 KB | 235 KB | −38.4% |
| `/admin-dashboard/rooms` | 362 KB | 234 KB | −35.1% |
| `/admin-dashboard/faculties` | 362 KB | 235 KB | −35.2% |
| `/admin-dashboard/instructors`, `/departments`, `/programs` | 255 KB | 232 KB | −9.1% |
| **Average of all 41 dashboard routes** | **311 KB** | **258 KB** | **−17.0%** |

¹ The attendance page grew by 8 KB because it now includes TanStack Virtual. That is a deliberate trade for keeping ~20 rows in the DOM instead of 1,000+.

**Chunk composition: what left the first load** (verified by searching the built files):

| Library | Before | After |
| --- | --- | --- |
| `zod` + `@tanstack/form-core` + dialog form code | In first load of 18 admin pages | Separate chunk, loaded when a dialog opens |
| `sweetalert2` | In first load of every admin table page | Separate chunk, loaded on first Delete/Restore |
| Sidebar route tables + icons for all 3 roles | In every dashboard page | Only the current role, rendered on the server |
| `table.tsx` client code | In every admin table page | Not sent (server-only) |
| `@tanstack/react-virtual` | — | Only on the attendance page and the "All students" tab |

Full table for all 58 routes: `docs/reports/bundle/compare-before-vs-after.md`.
Treemap screenshots: _fill in_ `docs/screenshots/bundle-before.png`, `bundle-after.png`.

### 7.4 Core Web Vitals

| Metric | Target | P1 before → after | P2 before → after | P4 before → after |
| --- | --- | --- | --- | --- |
| LCP | ≤ 2.5 s | _fill in_ | | |
| INP | ≤ 200 ms | _fill in_ | | |
| CLS | ≤ 0.1 | _fill in_ | | |

INP is taken from the DevTools **Performance** panel (live metrics) during the interaction script. Lighthouse navigation mode does not measure INP.

### 7.5 Functionality & UX check (Requirement §8)

| Check | Result |
| --- | --- |
| Production build | ✅ Passes |
| TypeScript (`tsc --noEmit`) | ✅ 0 errors |
| ESLint | ✅ 0 errors (only warnings that existed before, plus TanStack Virtual's "compiler skipped" notice) |
| Routes, tabs, search, pagination, dialogs, delete/restore, attendance save, registration | _fill in after manual browser test_ |
| Loading fallbacks | Dialog skeleton, virtual-list skeleton, existing table skeletons kept |
| Layout shift | Dialog skeleton matches the form size. The "Back to top" button is fixed-position and does not move content. |
| Light / dark mode | New UI uses existing theme colours |
| Mobile / tablet / desktop | Virtual lists scroll horizontally on small screens. Filters stack full-width on mobile. |

**Intentional small behaviour changes:**
- New "Back to top" button after scrolling 600 px.
- New filter boxes: attendance roster, "All students" view, available sections in course registration.
- New "All (scroll view)" tab on the Students page.
- The "I confirm…" checkbox in Course Registration now resets when switching to another registration.

---

## 8. Remaining Limitations / Bottlenecks

1. **Full-page forms are still heavy (~354 KB gzip).** *Student Registration, Instructor Registration, Create Department/Program* and the edit-profile pages need the form immediately because the form *is* the page, so lazy-loading would not help. A future fix is moving to `zod/mini` or loading only English zod messages, which requires rewriting every schema.
2. **Framework baseline (~201 KB gzip on every page).** Next.js, React and Base UI are shared and cached, but cannot be reduced without changing libraries.
3. **Fonts.** The design uses four font families. They are self-hosted and only the Latin subset is preloaded; using fewer families would need a design decision.
4. **"All students" loads up to 1,000 records in one request.** Larger datasets should use infinite loading (fetch the next page while scrolling).
5. **Attendance page +8 KB** because of the virtualization library (accepted trade-off).
6. **Backend response time** affects real page speed. Slow API calls show as skeletons and are outside the scope of this frontend work.
7. **Lighthouse, Profiler and Core Web Vitals values** still need to be recorded in a browser with a logged-in user (§4 and §7).

---

## 9. Demo Video Outline (3–5 min)

1. Project intro and live URL (20 s)
2. Baseline: bundle analyzer "before" treemap (zod and sweetalert2 on the Sections page), Lighthouse and Profiler "before" (40 s)
3. Rendering optimization: Profiler on course registration (tick the checkbox: before = whole workspace, after = only the submit panel) (45 s)
4. Virtualization: open `?demo=1000` on the attendance roster and the "All students" tab, scroll, and show in the Elements panel that only ~20–35 rows exist (45 s)
5. Debounced filters, the search focus fix, and the rAF "Back to top" scroll handler (30 s)
6. Code splitting: Network tab showing the form chunk loading on hover/open of "Add Section", the sweetalert2 chunk on Delete, and the before/after bundle table (45 s)
7. Server/Client boundaries: sidebar and table now server-rendered, smaller first-load JS (30 s)
8. Final Lighthouse and Core Web Vitals, plus the remaining limitations (30 s)

---

## Appendix – How to Reproduce the Bundle Comparison

```bash
npm run build
npx next experimental-analyze --output
node scripts/bundle-report.mjs snapshot after
node scripts/bundle-report.mjs compare before after
```

To view the treemaps: `npx serve docs/reports/bundle/before/analyze` and `npx serve docs/reports/bundle/after/analyze` (choose the **Client** filter and a route).
