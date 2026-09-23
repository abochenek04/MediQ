# Backend implementation backlog

**Status:** Backlogged; implementation has not started.
**Recorded:** September 23, 2026.
**Next input:** The project owner's drafted next-version modifications, ideas, and feature requirements.

## Purpose

Add a backend so MediQ can grow beyond a browser-local prototype: shared clinic information, persistent reports, cross-device plans, and eventual real data integrations. Extend the existing application and service interfaces rather than rebuilding the frontend.

This document records the discussion for a future work session. The items below are candidates to refine against the owner's upcoming requirements, not a finalized implementation scope. No vendor, hosting provider, budget, or delivery date has been selected.

## Proposed work sequence

| Phase | Candidate work | Outcome to verify |
| --- | --- | --- |
| 1. Requirements and design | Review the next-version draft; decide the first backend release, data sources, guest/account behavior, storage model, and hosting | An agreed scope and implementation plan |
| 2. Shared clinic data | Create a database and API; seed the existing fictional clinics; connect search and clinic retrieval through the existing service adapter | Existing filters and clinic pages work with backend data while demo records stay labeled |
| 3. Persistent reporting | Store current-wait and completed-visit reports; validate on the server; handle duplicate submissions, retries, and rate limits | Reports persist beyond one browser, and malformed or duplicate submissions are handled consistently |
| 4. Accounts and saved plans | Add authentication and ownership rules; synchronize saved clinics and visit plans; decide how local guest data migrates | Users can access their own saved items across devices without exposing another user's data |
| 5. Estimates and reliability | Define report eligibility, freshness, sample-size thresholds, source weighting, ranges, and confidence; add recalculation jobs as needed | Estimates are traceable to appropriate evidence and clearly disclose insufficient or stale data |
| 6. External integrations | Add approved clinic, rating, travel, or scheduling sources individually; handle credentials, refreshes, failures, and source attribution | Each integration has a verified data source and a useful fallback |
| 7. Operations and administration | Provide appropriate record correction/report review tools, monitoring, backups, and operational documentation | The backend can be maintained and problems can be investigated |

Reorder or split these phases once the next-version requirements are available. Booking, notifications, and contact-message delivery are possible later features, not commitments for the first backend release.

## Architecture candidates to evaluate

- Keep the current React/TypeScript frontend.
- Use PostgreSQL for persistent relational data.
- Evaluate managed authentication and database hosting, including Supabase as one option.
- Use a small TypeScript API or server-side functions for operations requiring trusted validation and integration credentials.
- Add scheduled jobs when refreshing external data or recalculating estimates requires them.

Database candidates include clinics, providers, reports, estimate history, user preferences, saved clinics, and visit plans. Final tables and relationships should follow the agreed requirements.

## Existing integration points

| Existing file | Role in future work |
| --- | --- |
| [clinicService.ts](../src/services/clinicService.ts) | Replace mock operations with API requests while retaining the `ClinicDataService` contract where practical |
| [AppContext.tsx](../src/context/AppContext.tsx) | Coordinate shared state, authentication-aware actions, and the transition from browser-only persistence |
| [types.ts](../src/types.ts) | Keep frontend and backend data contracts coherent |
| [mockData.ts](../src/data/mockData.ts) | Reuse fictional fixtures for development and testing |
| [report.ts](../src/utils/report.ts) | Reuse suitable validation rules; independently enforce validation on the server |
| [locationService.ts](../src/services/locationService.ts) | Preserve optional browser permission and approximate-location handling |
| [time.ts](../src/utils/time.ts) | Preserve and test visit-planning arithmetic |

## Decisions to carry forward

- Backend infrastructure does not itself supply real clinic data. Establish the source and permitted use of each dataset or integration.
- Keep ongoing wait reports separate from completed total-visit reports. The current `reportKind` and `elapsedMinutes` fields already support this distinction.
- Do not let a single report automatically become a clinic's advertised wait time; define the estimation rules first.
- Preserve the Check in → Wait → Care → Check out experience model.
- Keep saved visit plans distinct from confirmed clinic bookings until a real scheduling integration exists.
- Preserve guest browsing, accessibility, translations, and mobile behavior.
- Define what anonymous reporting means, what identifiers are retained, and who can view reports. Focus collection on necessary operational timing rather than medical histories.
- Protect private user records through server/database access rules, and keep privileged credentials out of browser code.

## When work resumes

- [ ] Collect the owner's next-version draft.
- [ ] Reconcile those requirements with this backlog and the current repository.
- [ ] Identify the smallest useful first backend release and its acceptance criteria.
- [ ] Select the architecture, providers, data sources, and guest-data migration approach.
- [ ] Implement incrementally, verifying existing frontend workflows at each stage.

Related context: [product background](product-background.md), [current verification notes](verification.md), and the repository README's API integration section.
