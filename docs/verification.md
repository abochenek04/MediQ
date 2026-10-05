# Healthcare-service upgrade verification

Verified October 4–5, 2026 on `codex/mediq-healthcare-upgrade`, starting from clean `ddc4786`. Node 23.11.0 and Chromium were used locally; Node 24 LTS is recommended. No production publishing, real sender configuration, environment-secret changes or existing database migration was performed. Every database mutation in tests targets a disposable temporary database or `.data/e2e`.

The current [requirement checklist](healthcare-upgrade-checklist.md) records implementation locations, compatibility changes and external owner actions. Baseline passed: typecheck, npm test, 6 backend groups, 7 browser suites. Logs are `/private/tmp/mediq-baseline/`.

## Final results

| Command | Final result |
|---|---|
| `npm run typecheck` | PASS: frontend/backend/configuration/tests |
| `npm test` | PASS: translation/palette audits, build and all original smoke assertions |
| `npm run test:i18n` (within npm test) | PASS: 592 keys ×6 translated catalogs; placeholders and new dynamic labels audited |
| `npm run test:palette` (within npm test) | PASS: 13 text pairs; minimum 5.41:1; actual button CSS also checked in Chromium |
| `npm run test:backend` | PASS: 12 integration groups, original six plus healthcare six |
| `npm run test:browser` | PASS: 16 Chromium interaction suites, original seven plus healthcare nine |
| `npm run build:staging` | PASS: backend mode forced, internal administration chunk present |
| `npm run build:production` | PASS: backend mode forced, internal administration chunk and protected endpoint code absent |
| `git diff --check` | PASS: no whitespace errors |

The final full suite passed after the reporting-boundary and evidence-contrast fixes; an additional focused three-suite visual/evidence run also passed. Generated tracked build/cache artifacts were restored to the clean baseline to keep the source diff reviewable; rebuild `dist` before a static preview or release.

Complete final logs are `/private/tmp/mediq-healthcare-final/`. Existing non-failing >500kB bundle-size, SQLite experimental and terminal-color warnings were not suppressed. No final automated check failed. During implementation, failures identified missing select accessible names, a missed Urgent Care label, a mobile fixed-font override and test locator/expected-number mistakes; these were fixed, with original coverage retained.

## Substantial behavior verified

- Legacy 001-schema upgrade and pre-migration backup: exact canonical kg/cm and prior reports retained, gender actually removed, previous accounts complete, repeat migration idempotent. Backup preserves the old schema without applying 002 and refuses overwriting an existing snapshot.
- Real Better Auth signup/verification/automatic session, immediate tour, atomic claim across devices, persisted dismissal, returning-login non-replay/manual replay; first-name long truncation and account/session race isolation.
- Homepage search button above fold at 320/390/768/1440; stable urgent machine values, care categories/location, preserved symptom concepts and typo tolerance, diagnosis/emergency/insurance notices, all strict existing and accessibility filters, list/map consistency and honest empty/error states.
- Stage label/time grouping at four widths ×seven languages/RTL; four fills, localized labels/values and accessible names; distinct patterns/shapes. Protanopia, deuteranopia, tritanopia and grayscale screenshots were reviewed; 200% body text/reflow and reduced-motion behavior checked.
- Actual contributing count/timestamps derived from accepted retained reports in backend output. Ongoing/outlier/stale/sparse cases; real unavailable UI hides stages/ranges. Minute aging tested with a controlled browser clock, including Arabic formatting.
- Full/quick ongoing reports remain separate from completed visits. Dropdown times, explicit midnight flag/order rejection, a completed 24-hour visit, client/server calendar-date differences, normalized empty optional context, unknown fields/mode accepted through API/feed, SQL ongoing total NULL, mode-specific estimator never guesses an unknown mode.
- Empty guest plans on session/reload/new tab; user-created plans still work. Settings dropdowns and clear; imperial conversion and no drift across saves, including existing minimum/maximum kg values and a non-rounded cm value. Profile values remain private.
- Dedicated footer accessibility/policy pages and old anchors; working feedback submission/database record/admin-only reads; strict tri-state editor correction validation/audit; all 16 founder tasks persist.
- Original authentication recovery/expiry/rate limits, account deletion, cross-tab logout, permission/environment boundaries, job retry/retention/backup restoration, geolocation/manual fallback, profiles/providers/reviews/charts, planning and direct routes remain covered by original suites.

Screenshots under ignored `test-results/`: `healthcare-homepage.png`, `healthcare-stages-{320,390,768,1440}.png`, and `healthcare-colors-{protanopia,deuteranopia,tritanopia,achromatopsia}.png`. Browser HTML results are in ignored `playwright-report/`. API tests use real server/auth/SQLite handlers; only targeted UI freshness cases use controlled API fixtures, backed by separate actual API evidence tests.

## Unverified / external

Real provider email delivery, cloud hosting/secrets/domain setup, licensed directory/accessibility sources, ratings/travel/booking/notification vendors and human assistive-technology/native-speaker reviews remain owner/provider work. Browser accessible-name/focus/keyboard checks are not a human screen-reader certification. No formal conformance or calibrated clinical reliability is claimed. See the four release-specific founder tasks and the existing platform launch backlog.

The historical platform notes below are retained as prior-release evidence. Their old palette, key counts, suite counts and font behavior are superseded by the current release above.

---

# Earlier platform verification — September 28, 2026

Verified locally on September 28, 2026 on branch `codex/mediq-platform-upgrade`. No production service, cloud database, domain or email sender was changed.

## Baseline and clean setup

Before implementation, the existing TypeScript check and build/smoke suite passed. A sandbox-only socket denial prevented the first smoke server from starting; rerunning with local-server permission passed. The original untracked `docs/next-version-implementation-prompt.md` was preserved.

`npm ci` completed successfully from the lockfile: 56 packages installed, 57 audited, zero reported vulnerabilities. The runtime used for this verification was Node 23.11.0; Node 24 LTS is recommended. Explicit TypeScript ambient types prevent unrelated duplicate `@types/* 2` cache directories from breaking builds. Actual local `.env` files were created only if absent, a random server auth secret was generated without printing it, and the development database was initialized with no accounts. `db:migrate`, `db:seed`, `jobs` and `db:backup` completed. Independent API tests always start with new temporary databases; browser tests recreate only `.data/e2e`.

The initialized development API and Vite proxy were also started and checked: health reported the development environment and ready database, the directory returned six fictional clinics, the initial session was a guest, and `/signup` loaded directly. An old, empty Git index lock was confirmed unowned and removed. Generated tracked build/cache changes were restored to their baseline to keep the implementation diff focused; run a build to regenerate `dist` for the new source.

## Final automated checks

| Command | Result and scope |
| --- | --- |
| `npm run typecheck` | Passed: frontend, Vite configuration, server and tests |
| `npm test` | Passed: translation audit, core palette contrast, production build and original smoke suite |
| `npm run test:i18n` | Passed: 529 static/conditional UI, page-title and seeded checklist keys across six translated catalogs; interpolation placeholders checked |
| `npm run test:palette` | Passed: primary 6.45:1, orange secondary 4.83:1, body 12.27:1, muted 6.03:1, link 6.37:1; normal text target 4.5:1 |
| `npm run test:backend` | Passed: six integration/test groups using real Better Auth handlers, SQL persistence and isolated databases |
| `npm run test:browser` | Passed: seven Chromium suites using the actual API and separate browser contexts |
| `npm run build:staging` | Passed: backend mode forced; administrator chunk present |
| `npm run build:production` | Passed: backend mode forced; administrator chunk and internal directory/checklist endpoint code absent, even with a development `.env` present |
| `git diff --check` | Passed |

### Preserved product coverage

The original smoke assertions remain: primary route fallback and assets, six fictional clinics, search and combined insurance/specialty/mode/open/distance/language/rating filters, manual location and synthetic geolocation, immutable distance calculations, historical timing, stage ordering/totals, exact/range/ongoing validation and planning arithmetic. Its service import explicitly selects the demo adapter so it continues testing those original contracts independently of backend environment settings.

Browser checks cover onboarding/tour dismissal, typo search, list/map consistency, clinic profile/providers/chart controls, quick ongoing report and shared feed after reload, save/plan navigation and reset, every original and new route plus missing clinic/404, honest search empty/error/retry states, intent search, explicit shortest sorting and delayed search-response rejection. Routes remain compatible. Saved plans are never described as confirmed reservations.

### Authentication, privacy and administration

API checks cover normalized unique signup, pending identity denial, wrong/expired/exhausted/one-time verification codes, resend cooldown, recovery, password changes, restored sessions, second-device persistence, direct private-record denial to another account/guest, injected ownership rejection, expected-account mismatch, logout and atomic password-confirmed deletion. Deletion revokes other sessions, preserves the other account and unrelated email verification records, removes private plans, and retains non-identifying aggregate counts.

Additional checks cover exact-origin and JSON write rules; public-server denial even with an admin role; environment-mismatch rejection; expired-session and pending-account cleanup; presence distinctions; online backup integrity and restored records; three-attempt job retry and recorded failure.

Reports are validated, deduplicated by request key/content, rate limited and separated into ongoing/completed evidence. Suspicious reports remain hidden pending review. Moderation transitions, audited clinic corrections, checklist edits and metrics are verified. Estimator tests cover insufficient samples, stale evidence, outliers and ongoing evidence never becoming a completed zero-minute visit. Search tests cover exact/typo ranking, headache synonyms, hard constraints and unsupported results.

Browser account tests use actual verification message files, cookies, settings, another browser context and two tabs. They verify multi-tab logout, deletion/revocation, account switching, private-cache clearing, a delayed account snapshot not undoing a new save, and a delayed response not restoring private state after logout. Guest customizations survive SPA navigation but reset on reload/new tab; unrelated localStorage remains intact. Normal-account admin access is denied in both the page and API; trusted role bootstrap enables directory/checklist persistence.

### Languages, layout and accessibility

All seven interface selections, independent Polish/Gujarati/Hindi clinic-language filters, translated Pediatrics machine-value stability and Arabic RTL pass browser checks. Direct routes and layouts are checked at 320, 390, 768 and 1440 pixels, including Gujarati signup. Generated narrow-screen signup imagery was visually inspected. Dialog keyboard containment, Escape closing and restored trigger focus pass. Core palette ratios are tested; this is not a complete accessibility certification. Translation audits cover known static/conditional strings and seeded tasks, not arbitrary future dynamic content. Native-speaker and assistive-technology reviews remain pre-launch tasks.

## Fixes and non-blocking warnings

Iteration exposed and fixed an inaccessible password input name, invalid range-report elapsed values, translated quick-filter machine values, stale account restoration, email-prefix deletion scope, build environment contamination, the orange text contrast and dependency-cache ambient types. A browser assertion was corrected to expect no appointment-list element for an empty authenticated account. All final suites pass; no failing check is being waived.

Node 23 emits an experimental SQLite warning, Playwright emits a terminal color-environment warning, and Vite warns that the eagerly loaded main bundle exceeds 500 kB (seven catalogs are included). These do not fail builds; locale/code splitting is a future performance improvement. The intentional wrong-password API test prints an authentication warning. No external email delivery, live GPS fix, licensed provider result or cloud deployment is inferred from these local results.

## External verification still required

- Create separate staging and production services/disks/secrets; configure domains/TLS and trusted proxy boundaries. Templates are prepared, not deployed.
- Verify a Resend sender domain and test real verification/recovery delivery. Local mailbox transport is not an email delivery test.
- Obtain real directory/provider permissions and implement authorized vendor-specific ratings, routing, scheduling and notification adapters. Current adapters report unavailable; clinic records remain fictional.
- Connect real monitoring and encrypted off-host backup retention, test cloud restoration, and establish private production moderation/operations access before a real-data launch. Current web administration is development/staging-only.
- Complete privacy/security, clinical-safety, accessibility and native-speaker review.

See [the requirement checklist](upgrade-checklist.md), [runbook](runbook.md) and [data/estimation policy](data-and-estimates.md). The ignored root `README-LOCAL-SETUP.md` contains the requested personal setup guide without secrets.
