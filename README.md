# MediQ

**Know before you go.** MediQ helps people compare total visit times and plan around care. It retains the React 19 / TypeScript / Vite interface and six clearly fictional Durham clinics. The healthcare-service upgrade builds on the existing Node/SQLite API and Better Auth platform: calmer eggshell/blue design, care-first search, accessible timing controls, honest estimate evidence, clinic accessibility filters, imperial private settings and a server-persisted signup tour. Seven languages and staging-only administration remain supported.

No live clinic directory, ratings source, travel routing, booking or notification provider is connected. Fictional data is not medical advice. **Saved visit plans are not clinic reservations.**

## Run locally

Use Node 24 LTS (22.x minimum 22.16). The startup sequence below applies migrations, so complete the backup step first for an existing database:

For this existing checkout, keep the current `.env` files. Before starting the upgraded API against an existing development database, stop the old API and create a pre-migration snapshot:

```sh
npm run db:backup -- /private/tmp/mediq-before-healthcare-upgrade.sqlite
```

Choose a new path if that file already exists. The backup command reads the original schema without migrating it. Migration 002 intentionally removes stored gender data; kg/cm remain the exact canonical values. See the runbook for incompatible-schema rollback.

```sh
npm ci
cp -n .env.example .env
cp -n server/.env.example server/.env
npm run db:migrate
npm run db:seed
npm run api
```

In another terminal:

```sh
npm run dev -- --force
```

Open **http://localhost:4173**. Development verification codes go to private files in `.data/development/mail`; they are not emailed. Sign up → enter the code at `/verify` → the verified account signs in and its introduction opens once. Returning logins do not trigger the tour. Account data persists in `.data/development/mediq.sqlite`. See the [complete setup/release runbook](docs/runbook.md) for secrets, real email, cloud hosting, administrator bootstrap and rollback. The requested personal `README-LOCAL-SETUP.md` is deliberately Git-ignored; all reproducible instructions are also tracked.

To browse without an API, set `VITE_DATA_MODE=demo` and restart Vite. This explicitly labeled fictional mode uses temporary memory and disables account actions. Configured backend mode reports service failures and never silently falls back to demo data.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite on 4173, proxying `/api` to 3001 |
| `npm run api` | API; applies pending transactional migrations at startup |
| `npm run db:migrate` / `npm run db:seed` | Migrations / fictional development seed (seed refuses production) |
| `npm run admin:grant -- verified-email` | Trusted terminal-only role grant in development/staging |
| `npm run jobs` | Estimate recalculation, retention and configured external refresh |
| `npm run db:backup -- /private/path/snapshot.sqlite` | Consistent SQLite online backup |
| `npm run typecheck` | Frontend and backend/test TypeScript |
| `npm test` | Translation and palette audits, build, and original care/route/asset regression suite |
| `npm run test:backend` | Fresh-database auth, ownership, reports, search and estimator integration tests |
| `npm run test:browser` | Real API + Chromium interaction tests; first install `npx playwright install chromium` |
| `npm run build` / `npm run preview` | Build / local static preview (API still needed in backend mode) |
| `npm run build:staging` / `npm run build:production` | Separate deployment modes; use matching `.env.*.example` values |
| `npm run serve:dist` | Original static route-fallback preview |

## Preserved product features and routes

Guest-first entry; clinic/provider/symptom search; insurance, specialty, spoken-language, rating, visit-mode, distance, timing and tri-state accessibility filters; synchronized list/map; geolocation with manual fallback; clinic profiles, providers, fictional reviews, historical charts and confidence explanations; quick/full reports; saved clinics and visit planning; leave-by/arrival/finish arithmetic; product tour; About, Contact and footer anchors; responsive navigation, native dialogs, keyboard focus and Arabic RTL.

| Route | Purpose |
| --- | --- |
| `/` | Location/category search above the fold; guest/account entry |
| `/find` | Search, filters, list/map |
| `/clinic/:id` | Clinic detail, evidence, historical patterns and planning |
| `/saved`, `/appointments` | Saved visit plans and clinics; no confirmed-booking implication |
| `/report` | Full timing report |
| `/know`, `/about` | About, original privacy/safety anchors, limitations and future Plus concept |
| `/privacy`, `/safety`, `/accessibility` | Dedicated footer pages |
| `/contact` | Original unsent demo form plus working `/contact#accessibility-feedback` form |
| `/signup`, `/login`, `/verify`, `/reset-password` | Real account flows when backend is configured |
| `/settings` | Authenticated private profile and account controls |
| `/admin` | Development/staging administrator tools; excluded from public builds |

Direct routes work through the Node server's SPA fallback. Original Netlify/Vercel rewrite files remain for frontend-only demos. A static Vite deployment alone cannot provide authentication or persistence.

## Intentional behavior changes

- **Guest state is temporary memory.** It survives client-side navigation, then resets on reload/new tab/closure. Only named legacy `mediq-*` personal-storage keys are removed; unrelated storage is untouched. New guest Appointments starts empty with a planning explanation. No guest-to-account merge happens implicitly.
- **Accounts are real.** A normalized unique email/password identity remains pending until its one-time code verifies. Only verified sessions can access private data. Optional sex, weight in pounds, height in feet/inches and age use clearable dropdowns. Values remain private; kg/cm are canonical and preserved without repeated-save drift. Stored gender is dropped by migration 002. Passwords are never readable profile fields. Logout, switching, revocation and deletion invalidate private UI state.
- **Shared reports persist independently.** Guest interface reset does not delete an accepted backend report. Public reports contain operational summaries, never names, email, free-text notes or raw timing entries. Account deletion deletes that account's submitted reports and private records; nonidentifying aggregate event counts remain.
- **Search uses deterministic concepts and typo tolerance.** `head pain` matches explicitly supported `headache` capabilities; `Brightwel urgent car` matches Brightwell. Exact names outrank strong concepts and weaker fuzzy names. Selected filters are always enforced. Recommended order preserves relevance; nearest/shortest/confidence remain explicit sorts. No search is sent to an AI provider.
- **Seven interface languages:** English, Spanish, Chinese, Arabic, Polish, Gujarati and Hindi. Interface choice and clinic spoken-language filtering are separate. Named locale catalogs extend the original three-locale catalog safely. Translation drafts require native-speaker review; directory proper names and original review prose remain source content.
- **Brand:** eggshell `#f8f5ed`, surface `#fffdf7`, pale blue `#d9edf7`, filled primary `#245d82`, sparing softer orange `#a84c17`. Shared tokens drive text, links, focus and controls. Self-hosted Source Sans 3 pairs with Noto Arabic/Devanagari/Gujarati and system CJK fallbacks; OFL files and hashes are included.
- **Navigation:** Find Care / Appointments / Report a Wait / About, language and a stored-first-name account menu; footer holds contact and policy/accessibility pages. Original routes remain available. `urgent` and `Urgent care` machine values are unchanged; interface labels read Urgent Care.
- **Evidence:** actual calculation and contributing-report timestamps/counts; only sources used by the estimator are named. Real stale/sparse estimates are unavailable. Fictional reference models stay explicitly labeled. Patient-experience ratings have separate placement and wording.
- **Reports:** current wait and completed total remain separate; hour/minute/localized AM/PM dropdowns, explicit next-day validation and nullable optional details. Unknown visit types are accepted but do not invent mode-specific evidence.
- **Tours:** first verified signup claims its introduction once on the server; complete/dismiss persists across devices. Existing accounts migrate as complete. Guest tour remains once per temporary session; manual replay is available in the footer and account menu.

## Repository guide

| Location | Responsibility |
| --- | --- |
| `src/pages`, `src/components` | Existing care UI plus account/settings/internal screens |
| `src/context/AppContext.tsx` | Session restoration, isolated state, saves and reports |
| `src/context/translate.ts`, `locales/*.json` | Safe lookup, interpolation and seven languages |
| `src/services/clinicService.ts` | Compatible demo/backend adapters |
| `src/services/search.ts` | Shared intent, fuzzy name matching, strict filtering |
| `src/services/locationService.ts`, `src/utils/time.ts`, `src/utils/report.ts` | Preserved location, visit arithmetic and report validation |
| `src/data/mockData.ts`, `src/types.ts` | Fictional fixtures and shared contracts |
| `server/` | Auth, API authorization/validation, schema, estimation, jobs, seed and CLI |
| `tests/`, `scripts/smoke-test.mjs` | API/browser/regression checks |
| `deploy/`, `.env*.example`, `server/.env*.example` | Independent staging/production deployment templates |
| `docs/runbook.md` | Cloud/email/local setup, migrations, backup/restore/release |
| `docs/data-and-estimates.md` | Data handling, estimator, search and metric definitions |
| `docs/healthcare-upgrade-checklist.md`, `docs/verification.md` | Current acceptance evidence and owner actions; original platform checklist retained separately |

## Deployment and safety boundaries

Local → staging validation → deliberate production promotion. Nothing here deploys automatically or modifies the existing public site. Separate services/disks/secrets/senders prevent test data crossing into production. Disk-backed single-instance hosting has brief restart outages and is not horizontally scalable; see the runbook. Real clinic data/source permissions, external integrations, sender/domain configuration, monitoring, backups and outside reviews remain explicit launch tasks.

MediQ does not diagnose, guarantee visit times, or claim HIPAA/security certification. Contact emergency services for a suspected emergency. Complete privacy, security, clinical-safety, accessibility and translation review before collecting real pilot data.
