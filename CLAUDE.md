# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Status: greenfield. The repository is currently empty. The plan below is the source of truth until code lands; once the scaffold exists, prefer reading the actual code over this file for anything code-derivable (paths, conventions, structure).

---

# Construction Snag List MVP — Implementation Plan (polished)

## 1. Context & Audience

A portfolio MVP demonstrating full-stack skills to a **construction consultancy**. The reviewers understand site workflows, so domain accuracy matters as much as code quality. Use realistic terminology throughout: *snag, defect, punch list, RFI, trade, MEP, fit-out, handover*.

The app: site engineers log defects ("snags") against projects, track them through resolution, and export client-ready PDF reports.

Build is split across **three sessions**. This document covers **Session 1 (Foundation + Core CRUD)** in depth, with Sessions 2 & 3 outlined for context. Session 1 stops for human review **before** the snag detail page and filter UI are built.

## 2. Tech Stack (locked)

| Layer | Choice | Notes |
|---|---|---|
| Backend | Laravel 11 | Latest stable. PHP 8.2+ |
| Frontend | React 18 + TypeScript via **Inertia.js** | No REST boilerplate; full-stack in one repo |
| Scaffold | **Breeze** React + Inertia + TypeScript starter | `php artisan breeze:install react --typescript` |
| Styling | Tailwind CSS + **shadcn/ui** (real `npx shadcn@latest add`, not hand-rolled) | Components live in `resources/js/Components/ui/` |
| DB | **MySQL 8.x or MariaDB 10.6+** | MySQL-compatible. `.env.example` ships MySQL config; README documents `CREATE DATABASE snag_list_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`. Local environment: MariaDB 10.6.22. |
| i18n / direction | **Arabic + English with full RTL support** | `<html lang dir>` driven by user/session locale; Tailwind `rtl:` variants; logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`) — no `ml-*`/`mr-*`/`pl-*`/`pr-*` |
| File storage | Laravel `public` disk + `storage:link` | Photos at `storage/app/public/snags/...` |
| Charts (S3) | Recharts | Data shaped in controllers, rendered React-side |
| PDF (S3) | `barryvdh/laravel-dompdf` | Battle-tested |
| IDs | UUID PKs via `HasUuids` trait | Looks professional in URLs |

## 3. Style Direction

- **Modern, beautiful, restrained.** Linear / Notion / vendor-SOW aesthetic. No gradients, neon, or glassmorphism.
- **Small border-radius only.** Set the shadcn CSS variable `--radius: 0.375rem` (6px) globally. Buttons, inputs, cards, badges, dialogs all inherit this. Never use `rounded-2xl`, `rounded-3xl`, or `rounded-full` except for tight cases like avatars and dot indicators.
- Palette: **slate neutrals + a single blue accent**. Use shadcn's `slate` base theme with the blue accent variable.
- **Typography:** crisp hierarchy. Latin: Inter (or system-ui). Arabic: **IBM Plex Sans Arabic** or **Noto Sans Arabic** loaded alongside Inter. `font-feature-settings: "ss01", "cv11"` for tabular numerals where useful.
- **Spacing & density:** generous whitespace, 8px base. Tables and lists tight enough to scan but not cramped.
- **Motion:** subtle `transition-colors`/`transition-opacity` only. No bouncy springs.
- Severity badges (semantic): `critical=red`, `high=orange`, `medium=yellow`, `low=gray`.
- Status badges: `open=red`, `in-progress=blue`, `closed=green`, `rejected=gray`.
- **Dark mode** supported via shadcn's CSS variables and a top-nav toggle (persisted in `localStorage`).
- **RTL/LTR mirror perfectly.** Test every screen in both directions before shipping a slice.
- Mobile-first. Verify usable at **375px**. Field engineers will trial this on phones.

## 4. Domain Model

### Enums (single source of truth — duplicate as TS string unions in `resources/js/types.ts`)

| Enum | Values |
|---|---|
| `ProjectStatus` | `active`, `completed`, `on-hold` |
| `Trade` | `electrical`, `plumbing`, `mep`, `civil`, `finishing`, `structural`, `hvac` |
| `Severity` | `low`, `medium`, `high`, `critical` |
| `SnagStatus` | `open`, `in-progress`, `closed`, `rejected` |

### Tables (UUID PKs everywhere)

**`projects`** — `id (uuid)`, `name`, `client`, `location`, `start_date (date)`, `status (ProjectStatus, default active)`, timestamps.

**`snags`** — `id (uuid)`, `project_id (uuid, FK→projects.id, cascade delete)`, `title`, `description (text)`, `location` (e.g., "Level 3, Unit 304, Master Bathroom"), `trade (Trade)`, `severity (Severity)`, `status (SnagStatus, default open)`, `photo_path (nullable)`, `assigned_to (nullable string)` (free text MVP, e.g., "ABC Electrical Contractors"), `due_date (nullable date)`, timestamps. Index `(project_id, status)`, `(project_id, severity)`, `(project_id, trade)` to support filter UI.

**`comments`** — `id (uuid)`, `snag_id (uuid, FK→snags.id, cascade delete)`, `author (string)` (free text MVP), `body (text)`, timestamps.

All models use `HasUuids` + `HasFactory`. Cast enum columns with PHP 8.1 backed enums in `$casts`.

## 5. Decisions

1. **Accent color:** blue (slate + blue).
2. **Auth gating:** **login required** on all app routes via Breeze. A seeded demo user lets reviewers sign in. Demo Mode banner remains as a visual indicator across pages but does **not** unlock unauthenticated access.
3. **Inline-first:** no premature abstraction. Components/utilities extracted only on the second use site.
4. **UI library:** real **shadcn/ui** via CLI (`npx shadcn@latest add ...`). No hand-rolled forks of components shadcn already provides.
5. **Border radius:** small only — `--radius: 0.375rem` (6px). No `rounded-2xl`/`rounded-3xl` outside avatars and dot indicators.
6. **Bilingual from day one:** English + Arabic with full RTL. Locale toggle in nav. Translation files for all UI chrome; user-generated content stays in whatever language it was entered.
7. **Database:** MySQL 8 in dev and prod (utf8mb4 / unicode_ci).
8. **Breeze + shadcn coexistence:** install Breeze first, then run `shadcn init` and **let it own** `tailwind.config.js` + `resources/css/app.css` (CSS variables). Refactor Breeze's auth pages (`Login`, `Register`, `ForgotPassword`, `ResetPassword`, `VerifyEmail`, `ConfirmPassword`) to use shadcn primitives. **Delete** Breeze's `PrimaryButton`/`SecondaryButton`/`TextInput`/`InputLabel`/`InputError` wrappers — one component system only.
9. **Inertia version:** stay on **Inertia v1** (Breeze default) for Session 1. Revisit v2 (deferred props, polling, prefetch) later.
10. **Arabic validation messages:** `php artisan lang:publish` to scaffold `lang/en/*.php`, then hand-translate the ~20 validation keys actually used into `lang/ar/validation.php`. No `caouecs/laravel-lang` dep — keeps the tree small and the AR copy under our control.
11. **Runtime versions:** **PHP ^8.3** (8.3 or 8.4 both pass), **Node 22 LTS**. Pinned in `composer.json` (`"php": "^8.3"`) and `.nvmrc` (`22`). README documents both. Local environment confirmed: PHP 8.4.19, Node 22.21.1.
12. **Locale defaults:** default UI locale **`en`** on first visit (locale toggle persists choice in session); `APP_TIMEZONE=Asia/Riyadh`; **Gregorian** dates everywhere (matches GCC construction-report convention). No Hijri formatting in MVP.

## 6. Session 1 — Definition of Done

1. `laravel new .` (or `composer create-project laravel/laravel .`) inside this empty dir, then `php artisan breeze:install react --typescript`.
2. `php artisan migrate:fresh --seed` exits clean with: 1 demo user, 2 realistic projects, ~15 snags each, mixed comments.
3. Realistic seed data — projects e.g. **"Riyadh Metro Station Fit-Out"**, **"Dammam Corniche Tower Phase 2"**. Snags must read like real reports: *"Cracked tile at WC-3 entrance, Level 2"*, *"Exposed conduit above false ceiling in Meeting Room 4B"*, *"Misaligned gypsum ceiling grid, corridor C-12"*. **No "Project A" / "Snag 1".**
4. Inertia routes shipped (Session 1 stop point — items marked ⚐ are deferred to the post-review continuation, also Session 1):

   | Method | URI | Page / Action | Stop point? |
   |---|---|---|---|
   | GET | `/` | `Dashboard` (project cards w/ snag counts by status) | after S1 review |
   | GET | `/projects` | `Projects/Index` | ✅ ship before review |
   | GET | `/projects/{project}` | `Projects/Show` (snag list, no filters yet) | ✅ ship before review |
   | GET | `/projects/{project}/snags/create` | `Snags/Create` (mobile-first, photo upload) | ✅ ship before review |
   | POST | `/projects/{project}/snags` | store | ✅ |
   | GET | `/projects/{project}/snags/{snag}` | `Snags/Show` (stub) | ⚐ post-review |
   | filters via querystring on `Projects/Show` | — | controller-side filter | ⚐ post-review |

5. **Resource controllers** with proper RESTful methods. Route-model binding by UUID. Nested `snags` under `projects` for create/store/show.
6. **Form Requests** carry all validation:
   - `StoreProjectRequest`: name (req, max 255), client (req, max 255), location (req, max 255), start_date (req, date), status (in:enum).
   - `StoreSnagRequest`: title (req, max 255), description (req), location (req, max 255), trade (in:enum), severity (in:enum), photo (nullable, image, mimes:jpg,jpeg,png,webp, max:5120), assigned_to (nullable, max 255), due_date (nullable, date, after_or_equal:today).
   - `UpdateSnagRequest`: same shape, all sometimes-required.
   - `StoreCommentRequest`: author (req, max 255), body (req).
7. **Photo upload**: Inertia `useForm` posts multipart; controller calls `$request->file('photo')->store('snags', 'public')`; persists returned path. Render via `Storage::url()` or `/storage/snags/...`. `php artisan storage:link` documented in README.
8. **Shared Inertia props** (in `HandleInertiaRequests::share`): `auth.user`, flash `success`/`error`, `demoMode` boolean (true when `APP_ENV=local` or `DEMO_MODE=true`).
9. **Shared TS types** in `resources/js/types.ts`: `Project`, `Snag`, `Comment` interfaces; enum unions; `PageProps<T>` extending Inertia's. Imported across all pages.
10. **shadcn/ui installed properly** via `npx shadcn@latest init` (style: `new-york`, base color: `slate`, radius: `0.375rem`). Components added per slice with `npx shadcn@latest add button input select textarea label badge card dialog dropdown-menu table sonner sheet tabs separator avatar`. `cn()` helper from `lib/utils.ts`. **No hand-rolled forks** of components shadcn already provides.
11. **AppLayout** wraps every page: top nav (with locale toggle EN/AR + theme toggle), demo-mode banner, sonner toast outlet. Layout sets `dir="rtl"` when locale is `ar` and applies `font-arabic` class.
12. **i18n + RTL plumbing**:
    - Backend: Laravel locale set from `session('locale')` (fallback `en`) in a middleware; expose `locale` and `direction` (`ltr`/`rtl`) via `HandleInertiaRequests::share`. `POST /locale` route to switch.
    - Frontend: `app.blade.php` reads Inertia-shared locale to render `<html lang="@{{ $locale }}" dir="@{{ $direction }}">`. Use `tailwindcss-rtl` plugin (or rely on logical properties) so `rtl:` variants are available where needed.
    - All strings go through Laravel translation files (`lang/en/*.php`, `lang/ar/*.php`) on the server side, and a typed `t()` helper or `useTranslations()` consuming Inertia-shared messages on the client. **No hardcoded user-facing strings** in components.
    - Numerals: keep Western Arabic numerals (0-9) for snag counts/dates to match construction-report convention; document this choice.
13. README updated: setup, `.env`, **MySQL provisioning** (`CREATE DATABASE ...`), migrate-seed, `storage:link`, dev servers (`php artisan serve` + `npm run dev`), Arabic/RTL note, deployment notes (Forge / Railway / VPS with MySQL).
13. **Out of scope this session:** observer-driven status changes, comment thread UI, edit snag, bulk actions, activity feed, policies, charts, PDF export, polish pass.

## 7. Critical Files (to be created)

```
app/
  Http/
    Controllers/{ProjectController, SnagController, CommentController, LocaleController}.php
    Requests/{StoreProjectRequest, StoreSnagRequest, UpdateSnagRequest, StoreCommentRequest}.php
    Middleware/{HandleInertiaRequests, SetLocale}.php   # demoMode, flash, locale, direction
  Models/{Project, Snag, Comment}.php                   # HasUuids + HasFactory + $casts enums
  Enums/{ProjectStatus, Trade, Severity, SnagStatus}.php
lang/
  en/{app, projects, snags, validation}.php
  ar/{app, projects, snags, validation}.php             # full Arabic mirror
database/
  migrations/*_create_projects_table.php
  migrations/*_create_snags_table.php
  migrations/*_create_comments_table.php
  factories/{ProjectFactory, SnagFactory, CommentFactory}.php
  seeders/DatabaseSeeder.php                            # demo user + 2 realistic projects (EN + AR seed text)
resources/js/
  types.ts                                              # shared TS types incl. Locale, Direction
  lib/utils.ts                                          # cn() from shadcn init
  lib/i18n.ts                                           # client t() helper consuming shared messages
  Layouts/AppLayout.tsx                                 # nav + locale toggle + theme toggle + demo banner
  Components/ui/                                        # shadcn-generated (button, input, select, badge, card, ...)
  Components/{LocaleToggle, ThemeToggle, SeverityBadge, StatusBadge}.tsx
  Pages/Dashboard.tsx
  Pages/Projects/{Index, Show}.tsx
  Pages/Snags/{Create, Show}.tsx                        # Show is a stub in S1
resources/css/app.css                                   # shadcn CSS vars incl. --radius: 0.375rem
resources/views/app.blade.php                           # <html lang dir> driven by shared props
routes/web.php                                          # auth-gated resource routes + POST /locale
components.json                                         # shadcn config
README.md
```

## 8. Build Order (vertical slices — get one snag end-to-end before scaling)

1. Verify toolchain: PHP 8.3, Node 20 LTS, MySQL 8 reachable. Write `.nvmrc` (`20`).
2. Scaffold Laravel + Breeze React/TS. Configure `.env` for **MySQL**; `APP_TIMEZONE=Asia/Riyadh`, `APP_LOCALE=en`. Create db. `php artisan migrate`. Sanity check: `php artisan serve` + `npm run dev`, sign up & log in.
3. **shadcn init**: `npx shadcn@latest init` → style `new-york`, base color `slate`, radius `0.375rem`. Let it overwrite `tailwind.config.js` and `app.css`. Add the initial component set (button, input, label, select, textarea, badge, card, dialog, dropdown-menu, table, sonner, sheet, separator, tabs, avatar). **Refactor Breeze auth pages** to use shadcn primitives; delete Breeze's `PrimaryButton`/`SecondaryButton`/`TextInput`/`InputLabel`/`InputError`.
4. `php artisan lang:publish`. Create `lang/ar/` mirror; hand-translate validation keys we touch and app-chrome keys.
5. **i18n + RTL infra first** (before screens, so every screen is built bilingual from day one): `SetLocale` middleware, shared `locale`/`direction` props, `app.blade.php` `<html lang dir>`, Arabic font loaded, `LocaleToggle` + `ThemeToggle` in nav. Verify swap works on the (now-shadcn) Breeze auth pages.
6. Enum classes → migrations → models (`HasUuids`, casts, relations). `migrate:fresh` clean.
7. Factories → DatabaseSeeder: demo user + 2 realistic Saudi-context projects + ~15 snags each. Seed snag titles/locations in **English** (construction-industry standard for GCC site reports); UI chrome is what gets translated.
8. `HandleInertiaRequests` shared props (auth, flash, demoMode, locale, direction). AppLayout + demo banner.
9. Shared TS types + `SeverityBadge`/`StatusBadge` wrappers around shadcn `Badge`.
10. **Vertical slice 1:** `/projects` index → `/projects/{project}` show (snag list, no filters) → `/projects/{project}/snags/create` posts a real snag with a photo. **Test in both EN and AR** before moving on. End-to-end before adding more.
11. `/` Dashboard with grouped counts via `Project::withCount(['snags as open_count' => fn ($q) => $q->where('status','open')])` etc.
12. README (PHP 8.3, Node 20, MySQL 8, locale defaults documented). Commit per logical step (`git log` should read like a teaching narrative).
13. **Stop. Hand back for review.**
14. (Post-review, still S1) Snag show stub + filters on project show.

## 9. Verification (Session 1 acceptance)

- MySQL up; `CREATE DATABASE snag_list_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;` then `php artisan migrate:fresh --seed` succeeds: user + 2 projects + ~30 snags + comments.
- `php artisan storage:link` — `public/storage` symlink created.
- `php artisan serve` + `npm run dev` — log in as demo user.
- Manual smoke: open a project → create a snag with a photo → photo renders on the project page.
- **Toggle locale to AR** — entire UI mirrors (nav, forms, tables, badges). Latin numerals preserved. Arabic font renders cleanly. Toggle back to EN — mirrors back.
- **Dark mode toggle** — colors flip via shadcn CSS vars; no contrast regressions.
- DevTools at 375px in both EN and AR — every form/list usable, no horizontal scroll, no clipped icons.
- Visually scan: no `rounded-2xl`/`rounded-3xl` outside avatars; corners look 6px-ish throughout.
- `php artisan route:list` — shows resource routes scoped under `projects.snags` plus `POST /locale`.
- `./vendor/bin/pint` — clean. `npm run lint` (Breeze's ESLint) — clean. `npx tsc --noEmit` — clean.

## 10. Risks & Edge Cases

- **UUID route-model binding:** ensure `getRouteKeyName()` is fine (default `id` is correct since PK is uuid). No need to override.
- **Photo orientation/size:** validate mime + max size in Form Request; do not auto-rotate in S1 (out of scope). Document limitation.
- **Cascade deletes:** confirm `onDelete('cascade')` on FKs. Comments must die with snags; snags with projects.
- **Enum drift:** TS unions and PHP enums must stay in lockstep. Single source of truth = `app/Enums/*`; mirror manually in `types.ts` (no codegen in S1).
- **Storage symlink in production:** documented in README. Do not commit `public/storage`.
- **Demo Mode confusion:** banner is cosmetic; auth still required. Make banner copy explicit: *"Demo data — sign in as demo@snags.test / password"*.
- **RTL pitfalls:** never use directional Tailwind classes (`ml-*`/`mr-*`/`pl-*`/`pr-*`/`text-left`/`text-right`/`left-*`/`right-*`). Use logical equivalents (`ms-*`/`me-*`/`ps-*`/`pe-*`/`text-start`/`text-end`/`start-*`/`end-*`) or `rtl:` variants. Icons that imply direction (chevrons, arrows) must flip in RTL — wrap with `rtl:rotate-180` or use `lucide-react`'s LTR/RTL-aware patterns.
- **Mixed-direction text:** Arabic UI showing English snag titles (and vice versa) — wrap user content in `dir="auto"` so the browser picks the right direction per string.
- **MySQL collation:** must be `utf8mb4_unicode_ci` (or `utf8mb4_0900_ai_ci` on MySQL 8) to store Arabic correctly. Verify in `config/database.php`.
- **Form validation messages:** Laravel's Arabic validation translations come from publishing `lang/ar/validation.php` — do not skip this; English-only errors break the bilingual story.
- **shadcn discipline:** add components via the CLI; do not copy-paste from docs into bespoke files. If you customize, edit the generated file in place — don't fork it under a new name.

## 11. Sessions 2 & 3 (preview only — do not build in S1)

**Session 2 — Status workflow + comments**
- `PATCH /snags/{snag}/status` route + dedicated controller method.
- Status changes recorded as **system comments** via a model **observer** or service class — never inline in controller.
- Comment thread + add-comment form on snag show.
- Edit snag (modal or inline) reusing the create form component.
- Bulk actions on snag list (checkboxes → change status / assign trade).
- Activity feed (last 10 actions per project).
- Laravel **policies** wired (even with single-user auth) to set up the structure.

**Session 3 — Dashboard charts + PDF + polish**
- Recharts on project dashboard: status donut, trade horizontal bar, severity stacked bar, open-snags trend line (group by `created_at::date`).
- `GET /projects/{project}/report` returns a dompdf PDF: cover page, summary stats, full snag list with embedded photos, consultancy-grade formatting.
- Empty states, loading states, toast notifications (`react-hot-toast`).
- README rewrite with screenshots, tech-stack rationale, "What I'd add next" (multi-tenancy, S3, RBAC, Reverb realtime, etc.).

## 12. Working-Style Rules (carry across sessions)

- Use **Laravel idioms**: Form Requests, Resource controllers, observers for side effects, policies for auth, factories for seeders. Don't write Laravel like Express.
- **Inertia patterns:** `useForm` for forms, `router.visit` for navigation, shared props for global state.
- **TypeScript** strict-ish; types live in `resources/js/types.ts`.
- **Inline first, extract on second use.**
- **Commit often** with meaningful messages. The git log is part of the portfolio.
- **Ask before guessing** on construction-domain decisions.
- **Don't deploy in Session 1.** Local clean-run only.
