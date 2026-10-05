# Backend implementation status and launch backlog

The earlier provisional backlog has been implemented as a local/staging full-stack platform; this is no longer an account-preview/browser-storage prototype. The retained React UI calls a Node/SQLite API with Better Auth verification and persistent owner-scoped storage. See [architecture/runbook](runbook.md), [data/estimates](data-and-estimates.md) and the [requirement checklist](upgrade-checklist.md).

Implemented: migrations, fictional development seed, verified signup/login/recovery/change/delete, sessions, private settings/plans/clinics, validated shared reports, dedupe/rate limits/review, recency/sample/outlier estimates, jobs, unavailable integration adapters, administrator role checks, account directory, metrics, audited corrections and editable persistent launch tasks. Demo mode remains explicit and guest customizations are temporary memory.

The healthcare-service release also implements schema 002, tri-state accessibility filters/editor, contributing-source timestamps/counts, nullable report details/overnight validation, account tour claims, imperial dropdown settings, local licensed fonts and accessibility feedback. The full checklist is [healthcare upgrade](healthcare-upgrade-checklist.md).

Remaining work requires owner/provider configuration or outside review:

- Create independent cloud staging and production services/disks/secrets. Validate actual sender-domain ownership and email delivery. No cloud project or public site was altered here.
- Source and verify real accessibility attributes with explicit unknown values and update permissions; fictional attributes are demonstrations only. Confirm bundled OFL attribution with the distribution owner, obtain native-speaker review of every new catalog, and authorize any clinic/history inputs before listing them as estimation sources. These four release-specific actions are seeded in the founder checklist.
- Acquire licensed clinic/provider data and source refresh permissions. Existing records are fictional. Obtain permitted ratings, route and scheduling APIs before implementing a vendor-specific adapter or claiming availability/reservations.
- Configure hosting domains/TLS, monitoring, job scheduling and encrypted off-host backups; test restores and document the real provider retention policy.
- Arrange privacy/security, clinical-safety, accessibility and native-speaker review before a real-data pilot.
- Establish private production operations/moderation access. Current web administrator tools are deliberately development/staging-only; production public assets and APIs expose no internal tools. Trusted operator maintenance requires a backup and recorded changes.
- Consider managed PostgreSQL and multiple application instances when a single persistent-disk service no longer meets availability/scale needs. Do not promise zero-downtime disk-backed deploys.
- Notifications require a consent-aware delivery provider; the preference and extension point do not send messages. Booking availability, confirmed reservations and cancellation workflows depend on clinic/vendor authorization. The general contact form remains an unsent demo; accessibility issues now have a working persisted submission path.

These are also specific editable records in the internal Launch checklist, with reasons, owner actions and verification criteria. They do not replace implemented local backend work with vague future tasks.
