# MediQ - Sol

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
| `/know` | Complete product, trust, privacy, pilot, business, and architecture guide |

Every route can be opened directly when the host is configured to return `index.html` for unknown paths. Netlify and Vercel rewrite files are included.

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
│   │   └── UI.tsx              # Demo, confidence, safety, and loading UI
│   ├── context/
│   │   └── AppContext.tsx      # Guest persistence and shared app actions
│   ├── data/
│   │   └── mockData.ts         # All fictional clinics, providers, waits, and reviews
│   ├── pages/
│   │   ├── ClinicPage.tsx
│   │   ├── FindCarePage.tsx
│   │   ├── KnowPage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── ReportPage.tsx
│   │   └── SavedPage.tsx
│   ├── services/
│   │   └── clinicService.ts    # Typed async data adapter and production swap point
│   ├── utils/
│   │   ├── navigation.tsx      # Lightweight History API router
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
