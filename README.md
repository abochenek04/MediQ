# MediQ

**Know before you go.**

MediQ is a polished, responsive healthcare-navigation prototype for planning the time around a medical visit. It shows fictional current and historical total-visit estimates, separates scheduled from walk-in experiences, explains how trustworthy an estimate is, and helps a patient plan travel and a leave-by time.

This repository is an early product prototype for patient testing, clinic-pilot conversations, developer handoff, and investor demonstrations. It does **not** use real clinic data or provide medical advice.

## Run locally

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:4173`).

Useful commands:

```bash
npm run typecheck   # TypeScript validation
npm run build       # Production build in dist/
npm run preview     # Preview the Vite build
npm run serve:dist  # Preview with client-route fallback
npm test            # Build plus dependency-free route/asset smoke checks
```

## Development vs. production: which should I use?

Use **development mode** while editing MediQ. Use a **production build** when checking the finished app before a demo or preparing files for deployment.

| | Development mode | Production build |
| --- | --- | --- |
| Command | `npm run dev` | `npm run build` |
| Purpose | Make changes and test interactions as you work | Validate TypeScript and generate optimized deployment files |
| What it does | Starts a local Vite development server | Creates the built application in `dist/`; does not start a server |
| When you edit code | Changes usually appear immediately through hot reload | Run the build again to include new changes |
| Debugging | Development warnings and error details help troubleshoot issues | Optimized output reflects what you would deploy |

### While developing

From the project folder, run:

```bash
npm run dev
```

Keep that terminal running while you edit files. Open the URL printed in the terminal and use **Ctrl+C** to stop the server. Run `npm run typecheck` separately when you want TypeScript validation without creating a production build; the development server is not a substitute for this check.

### Before a demo or deployment

Build the current source, then preview those exact files locally:

```bash
npm run build
npm run preview
```

Only start the preview after the build succeeds. Preview serves the existing `dist/` files, so rebuild and refresh the browser after making further source changes. Stop the preview with **Ctrl+C**.

This project configures both development and preview to use port **4173**. Stop one before starting the other, and always use the URL printed in the terminal if that port is already occupied.

For deployment, use the generated `dist/` folder with a suitable hosting service. `npm run preview` is a local checking tool, not a production hosting service. Neither building nor previewing automatically publishes the site.

Both modes contain the same MediQ features and fictional demo data. A production build does **not** activate real clinic data, Google ratings, booking, email, or other external integrations.

## Included product experience

- Guest-first onboarding with free-account and future-Plus concepts
- Care search by clinic, provider, specialty, or symptom
- Durham, NC demo location and location placeholder interaction
- Insurance, specialty, distance, visit-mode, open-now, and time-of-day filters
- Responsive list and synchronized stylized-map views
- Six fictional clinics spanning urgent care, family medicine, pediatrics, women’s health, community health, and walk-in care
- Scheduled, walk-in, and urgent visit estimates with meaningful stage breakdowns
- High-, medium-, and low-confidence estimates with visible reasoning
- Detailed clinic identity, hours, insurance, languages, provider cards, and booking placeholders
- Accessible SVG historical charts with day and time-of-day views
- Structured clinic and provider experience reviews
- Recent report feed that accepts new local sample reports
- One-minute post-visit report flow with validation and anonymous mode
- Saved clinics and saved visit planning in local storage
- Leave-by, likely-arrival, and likely-finish calculations
- Simulated queue-change alerts and location/booking integrations
- English, Spanish, Chinese, and Arabic preference controls with key interface translations
- Comprehensive “What You Need to Know” product guide
- Loading, empty, error, confirmation, hover, focus, selected, and disabled states
- Responsive mobile navigation and reduced-motion support

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Guest/account/Plus entry experience |
| `/find` | Primary Find Care dashboard, filters, list, and map |
| `/clinic/:id` | Detailed clinic timing, reliability, providers, reviews, and queue concept |
| `/saved` | Saved appointments, leave-by calculation, and saved clinics |
| `/report` | Validated post-visit timing and experience report |
| `/know` | About: Why MediQ, Patient Journey, Wait Estimates, and Reliability |
| `/contact` | Demo contact form; no message is sent |

Every route can be opened directly when the host is configured to return `index.html` for unknown paths. Netlify and Vercel rewrite files are included.

## Repository guide: where to make changes

MediQ is currently a **frontend application** built with React and TypeScript. The UI, filtering, calculations, and mock services run in the browser. There is **no real backend or database yet**; saved clinics, appointments, reports, and preferences use browser storage.

### What each folder does

| Location | Responsibility |
| --- | --- |
| `src/pages/` | Complete screens and their interactions |
| `src/components/` | Reusable UI pieces such as cards, navigation, dialogs, and the logo |
| `src/styles.css` | Colors, fonts, spacing, alignment, and responsive layouts |
| `src/context/` | Shared application state, actions, and translations |
| `src/data/` | Fictional clinic, provider, review, and estimate data |
| `src/services/` | Mock data operations and browser location access; future API connection points |
| `src/utils/` | Shared calculations, navigation helpers, and report validation |
| `src/types.ts` | Definitions of the fields in clinics, filters, appointments, and reports |
| `public/` | Static assets such as the favicon and hosting rewrite file |
| `scripts/` | Local preview and automated checks |
| `docs/` | Product background and verification notes |

`.tsx` files usually contain React UI plus interaction logic. `.ts` files usually contain data, types, or helpers. Neither extension means “backend.” The current `services/` files also run in the browser. A future backend would handle database storage, authentication, and server-side validation; the service layer would call its API.

### If I want to change X, where do I go?

| Change | Start here |
| --- | --- |
| Initial guest/account welcome screen | [OnboardingPage.tsx](src/pages/OnboardingPage.tsx) |
| Find Care headline, search, quick picks, or filter controls | [FindCarePage.tsx](src/pages/FindCarePage.tsx) |
| Clinic detail screen | [ClinicPage.tsx](src/pages/ClinicPage.tsx) |
| Appointments and saved clinics | [SavedPage.tsx](src/pages/SavedPage.tsx) |
| Full Report Wait form | [ReportPage.tsx](src/pages/ReportPage.tsx) |
| About or Contact content | [KnowPage.tsx](src/pages/KnowPage.tsx), [ContactPage.tsx](src/pages/ContactPage.tsx) |
| Colors, alignment, typography, or mobile layout | [styles.css](src/styles.css) |
| Header, footer, or navigation | [Layout.tsx](src/components/Layout.tsx) |
| Logo or browser-tab icon | [Brand.tsx](src/components/Brand.tsx), [favicon.svg](public/favicon.svg) |
| Clinic cards, visit stages, map, or historical chart | [ClinicComponents.tsx](src/components/ClinicComponents.tsx) |
| Shared dialogs, badges, loading, or safety messages | [UI.tsx](src/components/UI.tsx) |
| Quick-report popup or product tour | [QuickReport.tsx](src/components/QuickReport.tsx), [ProductTour.tsx](src/components/ProductTour.tsx) |
| Shared saved items, report submission, or notification messages | [AppContext.tsx](src/context/AppContext.tsx) |
| Translated text | [interfaceTranslations.ts](src/context/interfaceTranslations.ts), plus the original translation keys in [AppContext.tsx](src/context/AppContext.tsx) |
| Fictional clinic information or example estimates | [mockData.ts](src/data/mockData.ts) |
| Which clinics match a filter or how mock reports are processed | [clinicService.ts](src/services/clinicService.ts) |
| Browser location requests | [locationService.ts](src/services/locationService.ts) |
| Leave-by/finish-time calculations or report validation | [time.ts](src/utils/time.ts), [report.ts](src/utils/report.ts) |
| Data fields or allowed values | [types.ts](src/types.ts) |
| Which page opens for a URL | [App.tsx](src/App.tsx); navigation helpers are in [navigation.tsx](src/utils/navigation.tsx) |

`SavedPage.tsx` is the Appointments page, and `KnowPage.tsx` is About. Their original filenames and routes are retained for compatibility.

### Common examples

- **Center a headline or change a color:** edit the relevant CSS rule in `src/styles.css`. Change the page/component only if its content or structure also needs changing.
- **Add a filter:** add its control in `FindCarePage.tsx`, its field in `types.ts`, and its default and matching logic in `clinicService.ts`. Update the active-filter count, Clear all behavior, translations, and mock data as needed.
- **Add a page:** create it under `src/pages/`, register its route in `App.tsx`, and add a link in `Layout.tsx` if appropriate.
- **Connect real clinic data later:** implement the `ClinicDataService` interface with API calls while keeping the existing pages and components using that shared service.

### Supporting files and editing workflow

- `src/main.tsx` starts the React application; `index.html` supplies the browser document and root element.
- `package.json` defines npm commands and dependencies; `package-lock.json` records resolved dependency versions and is maintained by npm.
- `vite.config.ts` configures development/build tooling and local ports; `tsconfig*.json` configures TypeScript.
- `vercel.json` and `public/_redirects` support direct navigation to application routes on hosting platforms.
- `scripts/smoke-test.mjs` checks routes, assets, and application logic. `scripts/serve-dist.mjs` previews built files; it is not an application backend.

Edit source files, **not `dist/` or `node_modules/`**. `dist/` is regenerated by the production build; `node_modules/` contains installed third-party packages. Use `npm run dev` while editing, `npm run typecheck` for TypeScript validation, and `npm test` for the build and smoke checks when changing behavior. See the development-versus-production section above for preview and deployment commands.

## Project structure

```text
mediq/
├── public/
│   ├── _redirects              # Netlify SPA fallback
│   └── favicon.svg             # MediQ watch-and-queue mark
├── scripts/
│   ├── serve-dist.mjs          # Small production-build preview server
│   └── smoke-test.mjs          # Route, asset, and fixture checks
├── src/
│   ├── components/
│   │   ├── Brand.tsx           # Logo and wordmark
│   │   ├── ClinicComponents.tsx# Clinic cards, map, stages, historical chart
│   │   ├── Layout.tsx          # Header, footer, language, mobile nav, toasts
│   │   ├── ProductTour.tsx     # Replayable interface introduction
│   │   ├── QuickReport.tsx     # Current/recent visit reporting dialog
│   │   └── UI.tsx              # Demo, confidence, safety, and loading UI
│   ├── context/
│   │   ├── AppContext.tsx      # Guest persistence and shared app actions
│   │   └── interfaceTranslations.ts # Expanded interface translations
│   ├── data/
│   │   └── mockData.ts         # All fictional clinics, providers, waits, and reviews
│   ├── pages/
│   │   ├── ClinicPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── FindCarePage.tsx
│   │   ├── KnowPage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── ReportPage.tsx
│   │   └── SavedPage.tsx
│   ├── services/
│   │   ├── clinicService.ts    # Typed async data adapter and production swap point
│   │   └── locationService.ts  # Optional approximate browser location
│   ├── utils/
│   │   ├── navigation.tsx      # Lightweight History API router
│   │   ├── report.ts          # Shared report drafts and validation
│   │   └── time.ts             # Date and visit-plan calculations
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── types.ts
├── index.html
├── package.json
├── tsconfig*.json
├── vercel.json
└── vite.config.ts
```

## Mock-data model

All fictional information lives in `src/data/mockData.ts`; UI components do not define clinic fixtures. Type contracts are in `src/types.ts` and include:

- `Clinic`
- `Provider`
- `VisitMode`
- `LiveWaitEstimate`
- `HistoricalWaitRecord`
- `PatientReport`
- `StructuredReview`
- `SavedAppointment`
- `ReliabilityScore`
- `DataSourceType`

To change a clinic, edit its object in `src/data/mockData.ts`. Each visit mode has its own total, likely range, stage breakdown, freshness, and report count. Keep names, addresses, people, phone numbers, and reviews fictional until approved data is available.

## Where real APIs connect

`src/services/clinicService.ts` defines the `ClinicDataService` interface. Replace `mockClinicService` with a production adapter while preserving these methods:

```ts
searchClinics(filters)
getClinicById(id)
getLiveEstimate(clinicId, visitType)
getHistoricalWaits(clinicId)
submitWaitReport(report)
saveAppointment(appointment)
getSavedAppointments()
```

Likely production adapters:

| Need | Integration point |
| --- | --- |
| Clinic/provider directory | SQL-backed API behind `searchClinics` and `getClinicById` |
| Clinic queue signals | Queue/EHR adapter behind `getLiveEstimate` |
| Historical model | Analytics endpoint behind `getHistoricalWaits` |
| Patient reports | Validated API behind `submitWaitReport` |
| Booking | Clinic-specific booking adapter used by booking actions |
| Travel time | Mapping provider used by saved-visit planning |
| Authentication | Account provider above `AppContext`; guest mode remains available |
| External reviews | Approved review-source adapter on clinic profiles |
| Notifications | Consent-aware queue/change notification service |

No component needs to know whether the implementation is local data, REST, GraphQL, or SQL-backed.

## Implemented vs. simulated vs. future

| Status | Features |
| --- | --- |
| Implemented in browser | Guest entry, search, filters, list/map toggle, clinic profiles, scheduled/walk-in switching, stage breakdowns, historical chart, confidence explanation, saved clinics, appointment planning, leave-by calculation, validated reporting, anonymous preference, report feed update, language preference, local persistence |
| Clickable simulation | Account preview, booking/contact integration, browser location, queue-change alerts, external review sources, cross-device sync, multi-language localization beyond key interface copy |
| Roadmap only | Direct in-app booking, real clinic queue feeds, online check-in, AI visit preparation/summaries, advanced clinic analytics, production fraud scoring, native push notifications |

Buttons for unavailable integrations always provide explanatory feedback; there are no intentional dead controls.

## Product decisions and assumptions

The source brief included account-level medical-history collection and a possible $4.99 tier. This prototype deliberately resolves those ideas conservatively:

- Guest mode is the recommended path and provides meaningful core value.
- Account preview does not collect medical history or protected health information.
- Plus is a research hypothesis without a price or finalized feature gate.
- Core care access remains free in the product hypothesis.
- Sponsored placement is discussed only as a clearly labeled future option.
- Reliability describes timing evidence, not clinical quality.
- “Current” information is always labeled demo/prototype data rather than genuinely live.
- All clinics, providers, availability, reviews, reports, addresses, and phone numbers are fictional.

## Privacy and safety limitations

This is not a production healthcare system and does not claim HIPAA compliance. It stores only guest preferences, saved items, onboarding state, language, and sample operational reports in browser local storage. It must not be used for diagnoses, symptoms, medications, medical histories, records, payments, or identifiable patient information.

Before production, MediQ would need legal, privacy, security, accessibility, consent, retention, vendor, incident-response, and clinical-safety review. Patient-report infrastructure would also need rate limiting, deduplication, verified-visit options, source weighting, anomaly checks, clinic-gaming defenses, and moderation.

## Accessibility and responsive design

The interface targets WCAG 2.1 AA practices with semantic headings, visible focus states, labeled controls, keyboard-operable custom controls, minimum practical touch targets, text alternatives for charts, non-color confidence labels, a skip link, and `prefers-reduced-motion` support.

Responsive breakpoints cover the requested reference sizes:

- Desktop: 1440 × 900
- Tablet: 768 × 1024
- Mobile: 390 × 844

## Deployment

Build the static bundle:

```bash
npm run build
```

Deploy `dist/` to a static host.

- **Vercel:** import the repository, choose Vite, and deploy. `vercel.json` supplies the route fallback.
- **Netlify:** build command `npm run build`, publish directory `dist`. `public/_redirects` supplies the route fallback.
- **Cloudflare Pages:** build command `npm run build`, output directory `dist`; configure all unmatched routes to `/index.html`.
- **Other servers:** return `index.html` for non-file routes so `/clinic/:id`, `/saved`, and `/report` survive refresh.

## Backend implementation backlog

Backend development is backlogged pending the next-version requirements. See [Backend implementation backlog](docs/backend-backlog.md) for the proposed phases, architecture options, existing integration points, and decisions to revisit. Implementation has not started, and technology choices remain provisional.

## Recommended next steps

1. Conduct five to eight moderated patient usability sessions, including parents, hourly workers, and caregivers.
2. Test whether users understand total visit time, likely range, and confidence without explanation.
3. Select one clinic type for a tightly scoped pilot.
4. Define event timestamps with that clinic and compare them with patient reports.
5. Establish minimum report volume, freshness decay, source weighting, and verification rules.
6. Run privacy, security, legal, HIPAA-readiness, and accessibility reviews before collecting real data.
7. Connect booking, travel, and notifications only after the core timing signal proves useful.

## Prototype disclaimer

Wait estimates are planning information, not medical advice or guarantees. If you believe you are experiencing a medical emergency, contact emergency services.

## Second-generation prototype refinement

The existing architecture and routes are retained. `/saved` is now labeled **Appointments**, `/know` is now **About**, and `/contact` adds a local demo contact form.

Find Care includes language and minimum clinic-rating filters, shared typed service filtering, a current/recent report dialog, and optional browser geolocation. Ratings are derived from fictional clinic reviews with explicit source metadata; location only changes straight-line distances to fictional Durham fixtures. Manual search remains available. Morning/afternoon selections prioritize historical duration when using the default sort.

Visit visualizations consistently use **Check in → Wait → Care → Check out**, preserving existing durations. The global AppContext translation system now covers the main workflows in English, Spanish, Chinese, and Arabic, including RTL layout. The skippable interface tour can be replayed from the footer. Completion is stored under `mediq-tour-v1`.

Quick and full reports share draft creation, validation, AppContext submission, and ClinicDataService. Ongoing reports have `reportKind: 'current-wait'` and `elapsedMinutes`; their `totalMinutes` is zero because the full visit is not complete. Future estimate adapters must treat these separately. Exact reports retain their date and timing fields.

`npm test` builds the application and tests routes/assets, fixture integrity, old and new filters, historical sort, location permission adapter outcomes, rounded distance calculations, report validation/submission, visit-plan arithmetic, and translation catalog completeness. Browser interaction checks are documented in `docs/verification.md`. Background product and integration notes are retained in `docs/product-background.md`.

If an existing checked-in Vite dependency cache causes a duplicate React runtime during development, restart with `npm run dev -- --force`.
