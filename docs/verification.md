# MediQ refinement verification

Verified on September 21, 2026 against the existing React/TypeScript prototype.

## Automated checks

- Production TypeScript/Vite build passed.
- Expanded smoke suite passed: all primary route fallbacks, missing-clinic/404 routes, built assets, and six original fixtures.
- Existing search, insurance, specialty, visit-mode, open-now, distance, and empty-result checks passed.
- Language, minimum rating, combined filters, manual ZIP search, historical time-of-day ordering, and immutable distance calculations passed.
- All estimates retain their original totals, and every stage sequence is Check in / Wait / Care / Check out.
- Exact, range, and ongoing report validation/submission passed; date/order errors, anonymous/source-labeled reports, retained timing records, and invalid elapsed times were checked.
- Leave-by and expected-finish arithmetic passed.
- The location adapter was checked with mocked granted, denied, and unavailable outcomes. Successful coordinates are rounded before leaving the adapter.
- Translation catalog entries contain all three non-English translations.
- Source whitespace checks passed.

## Browser checks

- Guest onboarding, six tour steps, completed-tour persistence after reload, footer replay, mobile filter highlighting, and skipping passed.
- Language/rating/insurance combinations return the expected clinic; active counts and Clear all update correctly on desktop and mobile.
- Existing quick filters, list/map switching, map selection, clinic navigation, historical chart controls, provider/review display, booking placeholder feedback, saving/removing clinics, planning a visit, and removing the saved visit passed.
- Quick current-wait and completed-visit reports passed. Ongoing waits appear separately from completed totals in the shared clinic feed.
- Full-report empty-form validation, exact-time submission (60 minutes), range submission (45 minutes), both privacy choices, and confirmation passed.
- The browser's unavailable-location path showed a fallback message; manual Lakewood search still returned the matching clinic. A real GPS fix was not requested or verified. The granted adapter path was tested with synthetic coordinates.
- About exposes the four primary sections. Footer privacy/limitations/safety anchors remain valid. Contact's demo submission confirms that no message was sent or saved.
- All seven primary routes, every clinic detail route, an unknown clinic, and a 404 route rendered directly. No new errors or warnings appeared in the clean audit tab.
- Spanish and Chinese switching, Arabic RTL, and filtering in Arabic passed. Fictional clinic content intentionally remains in its original language.
- Primary layouts were checked at 320, 390, 768, and desktop widths. Review-metric and historical-chart overflow found during testing was fixed and rechecked at 320/768px.
- Native report/planning dialogs fit narrow screens, contain focus, close with Escape, and restore focus to the initiating control. The mobile report dialog was checked after scrolling.

## Prototype boundaries

No real clinic, Google Places, booking, travel-routing, email, account, or notification API was added. Ratings and clinical fixtures remain clearly labeled fictional. Reports and plans remain browser-local. The contact form does not transmit or retain messages.
