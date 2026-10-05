-- Applied once, transactionally. Metric kg/cm values are already canonical: retain them exactly.
-- Imperial is a presentation change, so there is no lossy metric-to-metric rewrite.
ALTER TABLE profiles DROP COLUMN gender;
-- Existing verified accounts must not receive a new-account tour.
ALTER TABLE account_metadata ADD COLUMN tour_state TEXT NOT NULL DEFAULT 'complete'
 CHECK(tour_state IN ('pending','started','complete'));
CREATE TABLE clinic_accessibility (
 clinic_id TEXT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
 attribute TEXT NOT NULL CHECK(attribute IN ('wheelchair','parking','elevator','restroom','asl','languageServices','sensoryFriendly')),
 availability TEXT NOT NULL CHECK(availability IN ('available','unavailable','unknown')),
 PRIMARY KEY(clinic_id,attribute)
);
-- Missing real directory attributes remain unknown. Fictional coverage is added only by the demo seed.
INSERT INTO clinic_accessibility
 SELECT c.id, k.value, COALESCE(json_extract(c.document, '$.accessibility.' || k.value), 'unknown')
 FROM clinics c, json_each('["wheelchair","parking","elevator","restroom","asl","languageServices","sensoryFriendly"]') k;

-- Retain every report, key, constraint and index while allowing an explicitly unknown visit mode.
ALTER TABLE reports RENAME TO reports_previous;
CREATE TABLE reports (
 id TEXT PRIMARY KEY, clinic_id TEXT NOT NULL REFERENCES clinics(id), user_id TEXT REFERENCES user(id) ON DELETE CASCADE,
 actor_hash TEXT, request_key TEXT NOT NULL, fingerprint TEXT NOT NULL, kind TEXT NOT NULL CHECK(kind IN ('current-wait','completed-visit')),
 mode TEXT CHECK(mode IN ('walk-in','scheduled','urgent')), total_minutes INTEGER, elapsed_minutes INTEGER,
 submitted_at INTEGER NOT NULL, visit_date TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('accepted','review','rejected')),
 public_document TEXT NOT NULL CHECK(json_valid(public_document)), UNIQUE(actor_hash,request_key),
 CHECK((kind='current-wait' AND total_minutes IS NULL AND elapsed_minutes BETWEEN 0 AND 1440) OR (kind='completed-visit' AND total_minutes BETWEEN 1 AND 1440 AND elapsed_minutes IS NULL))
);
INSERT INTO reports SELECT * FROM reports_previous;
DROP TABLE reports_previous;
CREATE INDEX reports_evidence ON reports(clinic_id,mode,status,submitted_at);
CREATE INDEX reports_owner ON reports(user_id);
CREATE TABLE accessibility_feedback (
 id TEXT PRIMARY KEY, message TEXT NOT NULL CHECK(length(message) BETWEEN 5 AND 1000), created_at INTEGER NOT NULL
);
