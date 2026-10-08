# Data, estimates, search and metric definitions

## Ownership and deletion

The browser has no database credentials. Every private API call derives the owner from a verified, unexpired Better Auth session. ID changes cannot retrieve another user's plan; payloads with unknown ownership fields are rejected. A plan ID is unique **within** an owner, so another user cannot overwrite the original. Profiles, preferences, saved clinics, plans, identities and sessions have deletion cascades. Optional profile fields are private and omitted from routine administrator directories and analytics. No account email editing is exposed; password changes and resets use the provider and revoke other sessions.

Account deletion requires a current password plus explicit `DELETE` confirmation. Password checking uses Better Auth, then a single SQLite transaction deletes the identity and its cascaded data/reports and recomputes estimates. Failure rolls back, so the account remains recoverable rather than half-deleted. Aggregate daily counts have no owner linkage and remain. Old signed cookies cannot restore a deleted identity. Backup removal depends on actual operator/provider retention; do not promise immediate deletion from backups. See the runbook's restore/deletion reconciliation procedure.

Guests use in-memory personal state only. Accepted backend reports are independent shared data. An HttpOnly signed random anonymous cookie lasts one day; its HMAC is stored for report deduplication/rate limiting and presence. IP addresses are HMACed before persistent rate-limit storage and never included in reports. They are pseudonymous anti-abuse identifiers, **not anonymous in an absolute sense**. Rate-limit rows expire via jobs (up to one day after their window); report actor hashes/fingerprints are removed after seven days. Presence expires from active metrics after five minutes and is purged after fifteen. Jobs must be running for physical deletion. User-agent/raw IP storage in auth sessions is disabled. Network/proxy/email vendors may retain metadata according to their own configuration; review this before launch.

Free-text report notes and exact input timestamps are validated but not retained by the backend or public feed. Public reports expose only report ID, clinic, mode, submission timestamp, completed total or ongoing elapsed time, report kind, source, anonymous label, simple experience choices and review status. The demo adapter retains its original fictional local report shape for compatibility. Selecting a source-label preference never makes a name/email public; backend reports are always publicly anonymous. Production server logs use path/error category only; operators must similarly exclude query strings/bodies from proxy logs.

No search history is stored or sent to an external AI service. Approximate coordinates are rounded by the existing location adapter and used in a request to calculate straight-line distance; the API does not persist them. Manual location/query fallback remains available.

## Reports and estimation

Server rules validate an existing clinic and supported visit mode, strict date/time formats, ordered check-in/provider/departure times, 0–1440 elapsed minutes, 1–1440 completed minutes, known total ranges, optional ratings and bounded input lengths. Completed visits must be within 31 days; current waits within two local calendar dates, to allow overnight time zones. A supplied bounded timezone offset allows validating today's future departure times. Reports above eight hours are held for review and excluded from public feeds/estimates pending administrator acceptance.

An idempotency key is required; retrying the same actor/key returns its existing result. A content fingerprint also catches repeats within a day. Each actor is limited to five submission attempts/hour and each network bucket to twenty/hour; malformed requests consume limits too. These are pilot defenses, not proof of a visit or complete fraud prevention. Anonymous cookies can be cleared, and shared networks can reach limits. Actual source/visit verification remains an operational launch decision.

Estimation runs separately for **each clinic and visit mode**, synchronously after report/moderation/deletion changes and on the five-minute job:

1. Only accepted **completed** reports with positive totals from the last seven days enter total-visit estimation. Pending/rejected reports and all ongoing waits are excluded.
2. Require at least three completed samples. Remove values more than `max(30 minutes, 3 × median absolute deviation)` from the median; require at least three remaining samples.
3. Require at least one remaining sample less than 24 hours old. Older-only evidence is `stale`; sparse evidence is `insufficient`. Both return a null current total/range, not zero.
4. Recency weight is `exp(-age / 48 hours)`. The estimate is the rounded weighted mean. Half-range is the largest of 10 minutes, 1.5 weighted standard deviations, and 30% of total for fewer than ten samples (15% otherwise).
5. Confidence is high only for at least 20 eligible samples, at least 10 from the past day and half-range/total <35%; medium requires at least 8 samples and 3 from the past day; otherwise low. Display scores 85/65/35 are **ordinal confidence categories, not calibrated probabilities**. Insufficient/stale evidence displays zero evidence score. No quality-of-care inference is intended.
6. Ongoing waits from the last two hours are counted separately, exposing their maximum reported elapsed time as a lower-bound observation. They never become completed visits of zero minutes, and are not guessed into total durations.

Current results and hourly history snapshots are durable. History snapshots retain 90 days. Existing fictional day/time charts remain explicitly modeled reference data until an authorized source provides a suitable real history. Where evidence is insufficient, a seeded clinic's original fictional reference estimate remains visibly labeled as fictional, never presented as fresh live evidence. Stage proportions are a modeled allocation of a ready total, not measured stage durations. The stage sequence stays **Check in → Wait → Care → Check out**.

## Search algorithm and coverage

The shared matcher normalizes Unicode, case, Latin accents and punctuation. It preserves Indian-script marks. Scores: exact clinic/provider name 120, contained name 105, address/neighborhood/ZIP phrase 95, actual specialty/symptom phrase 90, curated supported concept 88, all exact name tokens 80, typo name matching 50–67. All query tokens must match distinct name words. Tokens of <=2 characters allow no edits; 3–7 allow one; >=8 allow two. Fuzzy matching is limited to clinic/provider names. Threshold 50, so unsupported queries retain a real empty state.

Curated concepts cover headache/head pain, fever, cough, sore throat, sprain/minor injury, pediatrics and routine checkups, with common English/Spanish/Chinese/Arabic/Polish/Gujarati/Hindi terms. This is a finite vocabulary, not universal semantic understanding or diagnosis. A concept matches only a listed directory capability. The fictional Brightwell and Juniper fixtures explicitly include headache for the demonstration.

All insurance/language/rating/specialty/mode/time/distance filters are hard constraints. Recommended with a nonempty query uses relevance first; with no query it retains original open/distance ordering or historical morning/afternoon ordering. Explicit nearest, shortest and confidence sorts override relevance intentionally. The page no longer re-sorts recommended search results by distance. Both adapters use the same matcher; the page's request sequence ignores old results after rapid edits. List and map consume the same sorted array.

## Internal metrics

All date windows use **UTC**. Recent = today plus previous six UTC calendar days; all-time = aggregate counters since the database was initialized. Seed fixtures/test environments are separate and not production analytics. Reopening a page creates no business event.

| Metric | Meaning |
| --- | --- |
| Verified accounts | Current users with `emailVerified=1`; pending and deleted identities excluded |
| Verified signups | One event when an identity first verifies; retained as an aggregate after deletion |
| Active accounts | Distinct verified account IDs with visible, recently interacted sessions seen in last 5 minutes |
| Account sessions | Valid server sessions with presence in that window; several may belong to one account |
| Guest sessions | Signed anonymous cookie identities with presence in that window; not unique humans |
| Saved visit plans | First successful insertion of an owner/plan ID; updates/retries do not increment; removals do not erase historical creation totals |
| Confirmed bookings | Unavailable (`null`), never equated with saved plans |
| Accepted ongoing/completed reports | First acceptance, including a single moderation transition from review; report ID/kind determines bucket |
| Reports flagged for review | New suspicious records, not repeated review reads |
| Report rejections | Invalid-report validation or a moderation rejection; attempts may count separately |
| Service/job/email failures | Stored failure events; no request bodies, identities or health-profile fields |

Presence heartbeats run only for visible pages with interaction within five minutes, once/minute. Account presence references its session so revocation/logout removes it. Directory/metrics refresh every 30 seconds; there are no realtime subscription claims. The administrator role is granted by trusted server CLI, never from signup/settings. Public builds contain no internal page, and production API denies admin routes independently. Admin corrections, review decisions and checklist edits append audit records in the same transaction.

## Localization

The seven locale catalogs are keyed by source string. Existing Spanish/Chinese/Arabic catalogs stay compatible; new catalogs override changed copy. Safe fallback is the source English string, and interpolation uses each locale's number formatter. Date/time/relative-time formatting uses Intl. Arabic sets document RTL. System font stacks cover Arabic, Devanagari and Gujarati without sending requests to an external font provider. Native labels are used in interface-language selection; clinic filter values remain stable English machine values.

Translations are working drafts, not professional translations. Native-speaker review is outstanding for all seven-language flows, especially health/consent/deletion language and long layouts. Directory proper names, fictional review prose, administrator-entered notes and audit payloads retain their source language. Seeded launch-checklist titles, reasons, actions and verification instructions are translated. They are not silently described as professionally localized clinical content.
