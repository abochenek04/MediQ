# Healthcare service upgrade

Development branch: `codex/mediq-healthcare-upgrade`; clean baseline commit `ddc4786` (`v2.1.4`). Implemented and verified October 4–5, 2026. Actual environment files and existing development/production databases were preserved. No deployment or push was performed. Tests use temporary databases and `.data/e2e` only.

## Baseline, inventory and sequence

All four baseline commands passed: `npm run typecheck`, `npm test`, `npm run test:backend` (6 groups), `npm run test:browser` (7 suites). Logs: `/private/tmp/mediq-baseline/`. No pre-existing test failures. Existing non-failing bundle-size, SQLite experimental and terminal-color warnings remain visible.

The assumed platform upgrade was present: Better Auth verification/recovery/sessions, durable SQLite with owner checks, private profiles/plans, temporary guest state, independent environment guards, staging-only administration, seven languages and deterministic meaning/typo search. External hosting/email delivery, licensed directory/reviews/routing/booking and professional reviews remain separately tracked platform launch work. General Contact was already an explicitly unsent demo; it is preserved alongside a new working accessibility feedback path. One pre-existing metadata gap was corrected: the claimed Node 22.13 minimum did not provide the online-backup API; package/runbook now require 22.16+ on the 22.x line or 23.8+.

Executed sequence: baseline/inventory → typed contracts and migration → estimation/accessibility/reporting API → navigation/search/report/settings UI → design/localization → interaction verification → release builds and documentation.

| Requirement | Implementation locations | Status and verification |
|---|---|---|
| Calm baby-blue/eggshell shared palette; sparing orange | `src/styles.css`, Brand, favicon | Implemented/tested: 13 text contrast pairs ≥4.5:1, actual rendered button contrast, responsive screenshots. Orange softened to #a84c17. |
| Approachable freely licensed multilingual typography; simpler hierarchy | `public/fonts/`, `index.html`, CSS | Implemented: Source Sans 3 plus Noto Arabic/Devanagari/Gujarati, CJK system fallbacks; OFL files/hashes verified and TrueType hinting tables present, primary preload and optional font display. Seven-language rendering tested; owner license/native review remains. |
| Navigation, first-name menu, mobile, footer and legacy routes | Layout, App | Implemented/tested: four primary links, guest entry, long-name accessible truncation, Escape/focus, account races, footer pages, `/appointments` and `/about` aliases; original routes/anchors retained. Production build excludes internal page/endpoints. |
| Functional homepage location/category search above fold | Onboarding, FindCare, shared search service | Implemented/tested: 320/390/768/1440px, category/location propagation, all supported categories, semantic/typo behavior preserved. |
| Report a Wait / Urgent Care labels and prominent translated safety notices | Layout, report/search/clinic screens, catalogs | Implemented/tested: stable `urgent` and `Urgent care` machine values, diagnosis limitation, exact emergency notice at care selection and insurance confirmation by filters/profiles. |
| Bound stage labels/times; yellow wait/green care/blue check-in/purple check-out | VisitBreakdown, CSS | Implemented/tested at four widths × seven languages and RTL; labels/values share one element and accessible name; shapes and bar patterns survive protanopia/deuteranopia/tritanopia/grayscale simulations. Text contrasts 5.41/10.70/7.49/5.53:1. |
| Ratings separated from time confidence | ClinicCard, ClinicPage, EstimateEvidence | Implemented/tested: separate patient-experience section, labeled demo source, textual confidence categories rather than a matching score/stars. |
| Actual freshness/contributing sources and honest sparse/stale states | `server/estimator.ts`, application, typed provenance, EstimateEvidence, planning helpers | Implemented/tested: retained completed-report count/timestamps, no ongoing/outlier inflation, ready API output, localized minute aging, sparse/stale real totals/stages/finish unavailable; explicitly fictional references remain usable. No invented clinic/history source claims. |
| Seven tri-state clinic accessibility attributes, strict filters and admin editing | migration 002, types, accessibility utility, both adapters/search, Admin, profile | Implemented/tested: unknown default, seven hard filters and combinations, API validation, audited corrections, fictional coverage clearly labeled. Real sourcing remains owner work. |
| Contextual accessible concepts | ConceptHelp and estimate/history/report/plan screens | Implemented/tested: native details works with keyboard/touch and exposes expanded text; visit estimate, confidence, history, reporting, leave-by and finish microcopy translated. |
| Distinct reporting modes; localized time dropdowns, overnight order, unknown details | ReportPage, QuickReport, TimePicker, shared validation/API | Implemented/tested end to end: ongoing SQL total remains NULL, exact/range/current modes, hour/minute/locale AM/PM, explicit next-day/full-day and client-timezone validation, nullable mode/check-in/provider/experience and optional context. Unknown modes stay useful in the feed without guessing a mode-specific estimate. |
| Empty guest Appointments | AppContext, SavedPage | Implemented/tested: new session/reload/new tab starts with zero plans; helpful plan-not-booking empty state; user-created temporary plans still work. |
| Tour right after first verified signup only; server persistence/manual replay | auth, account metadata/API, AccountPage, AppContext, ProductTour | Implemented/tested across browser contexts: verification auto-signs in; atomic server claim once; dismissal/completion persists; old accounts migrate complete; returning login does not trigger. Guest behavior stays once per temporary session. |
| Remove gender stored data; clearable imperial dropdowns/canonical retention | migration 002, profile API, Settings, measurements utility | Implemented/tested on legacy schema: gender column removed; old exact kg/cm and reports preserved; 154 lb conversion, ft/in, repeated saves and 1/650 kg legacy endpoints retain exact values; all fields optional/private and excluded from admin/analytics/reports. |
| Dedicated Accessibility page, working issue path, reduced motion, text resize | AccessibilityPage, Contact/API/admin feedback tab, CSS and scrolling | Implemented/tested: skip link, named native dialogs/focus restoration, keyboard details, real persisted feedback, reduced-motion CSS/JS scrolling, 200% body text and reflow. No formal certification; full assistive-technology review remains external. |
| All seven interface languages, RTL and owner checklist | six catalogs + English, healthcareKeys/audit, seed tasks | Implemented/tested: 592 audited keys ×6 translated catalogs and seven-locale browser flows; Intl numbers/times/relative units. Sixteen persistent founder tasks include four new concrete sourcing/license/native-review/provenance actions. Native-speaker review pending. |
| Preserve platform/care behavior; focused interaction tests and reproducible docs | original smoke/API/browser suites, new healthcare tests, README/runbook/data/backlog | Implemented/tested: original suites retained with expectations changed only for authorized labels/units/tour/empty plans. 12 backend groups, 16 browser suites, typecheck, npm test and both release builds pass. |

## Design and source decisions

[Endeavor Health’s public site](https://www.endeavorhealth.org/) informed the restrained hierarchy, whitespace, navigation and humanist tone; no proprietary font or asset was copied. Original font files came from the [Google Fonts source repository](https://github.com/google/fonts); each upstream URL, SHA-256 and unchanged OFL text is bundled in `public/fonts/manifest.json` and companion license files. Source Sans 3 is the Latin base, with Noto companion coverage and native CJK fallback. Owner license confirmation is a distribution review, not a missing font implementation.

Tokens: background #f8f5ed; surface #fffdf7; border #c5d1d8; primary fill #245d82; hover #194963; primary text #173b53; pale family #d9edf7; focus #184b71; link #195d87. Stage colors: check-in #1468cc, wait #ffe24d, care #38d977, check-out #b427a8. Color simulations are useful checks, not a conformance certification or substitute for user testing.

## Intentional compatibility changes

Navigation/footer/homepage/design and labels changed as requested; old routes and machine values remain. The only removed profile column is gender. API now rejects gender payloads; canonical measurement names remain kg/cm even though UI is imperial. Verification now creates a session so the new-account tour can appear immediately. Old accounts’ tour state defaults complete. Guest seeded plans are removed. Optional reporting details may be NULL; they never turn into zero/default evidence. Plans remain distinct from bookings.

Migration 002 is intentionally incompatible with the prior profile server. The corrected backup command opens the source read-only and does not migrate before copying; it refuses existing destinations/public assets. Stop writes, back up and restore-test before applying the upgrade to a shared database. Rollback requires the old schema snapshot with its matching old server. Backup retention and deletion reconciliation stay operator responsibilities.

## Remaining external work and owner actions

No requested, independently implementable feature remains a placeholder. Real clinic records, real ratings/travel/booking/notifications and delivered email require authorized providers and owner configuration; their existing unavailable states remain honest. Specifically:

| Action | Why / owner work | Completion evidence |
|---|---|---|
| Real accessibility data | Confirm all seven attributes with clinics, preserve unknowns, record permission and update dates | Approved source records match filters and profiles in staging |
| Font distribution review | Review bundled OFL/attribution; retain originals in shipped artifacts | Every font has its source/hash/license and recorded approval |
| Native-speaker review | Review all new safety/report/settings/accessibility copy and RTL/long layouts | Reviewer records and resolved findings in seven-locale flows |
| Authorized evidence sources | Obtain licensed clinic timing/history feeds and their freshness/count contract before adding them as contributors | Source attribution matches actual estimator inputs in staging |
| Existing platform launch tasks | Separate hosting/secrets/senders, real mail delivery, licensed integrations, monitoring/backups, private production operations and outside review | Complete the protected founder checklist and runbook staging acceptance |

Live cloud email/delivery, real clinic accuracy, real routing/booking, human screen-reader testing and formal accessibility/native review were not verified. No production publishing was performed.

Final commands/evidence are recorded in [verification.md](verification.md). Exact fresh-clone and existing-checkout startup/backup instructions are in [README.md](../README.md) and [runbook.md](runbook.md).
