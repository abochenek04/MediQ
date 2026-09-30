-- Better Auth 1.7 schema. All timestamps in auth tables are epoch milliseconds.
CREATE TABLE IF NOT EXISTS user (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT COLLATE NOCASE NOT NULL UNIQUE,
 emailVerified INTEGER NOT NULL DEFAULT 0, image TEXT,
 createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL,
 firstName TEXT NOT NULL DEFAULT '', lastName TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS session (
 id TEXT PRIMARY KEY, expiresAt INTEGER NOT NULL, token TEXT NOT NULL UNIQUE,
 createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL, ipAddress TEXT, userAgent TEXT,
 userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
);
CREATE INDEX session_owner ON session(userId);
CREATE TABLE IF NOT EXISTS account (
 id TEXT PRIMARY KEY, accountId TEXT NOT NULL, providerId TEXT NOT NULL,
 userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE, accessToken TEXT, refreshToken TEXT,
 idToken TEXT, accessTokenExpiresAt INTEGER, refreshTokenExpiresAt INTEGER, scope TEXT, password TEXT,
 createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL
);
CREATE INDEX account_owner ON account(userId);
CREATE TABLE IF NOT EXISTS verification (
 id TEXT PRIMARY KEY, identifier TEXT NOT NULL, value TEXT NOT NULL, expiresAt INTEGER NOT NULL,
 createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL
);
CREATE INDEX verification_identifier ON verification(identifier);
CREATE TABLE IF NOT EXISTS environment (id INTEGER PRIMARY KEY CHECK(id=1), name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS profiles (
 user_id TEXT PRIMARY KEY REFERENCES user(id) ON DELETE CASCADE,
 sex TEXT, gender TEXT, weight_kg REAL, height_cm REAL, age INTEGER,
 language TEXT NOT NULL DEFAULT 'en', notifications INTEGER NOT NULL DEFAULT 0,
 CHECK(weight_kg IS NULL OR weight_kg BETWEEN 1 AND 650),
 CHECK(height_cm IS NULL OR height_cm BETWEEN 30 AND 300),
 CHECK(age IS NULL OR age BETWEEN 0 AND 125)
);
CREATE TABLE IF NOT EXISTS account_metadata (
 user_id TEXT PRIMARY KEY REFERENCES user(id) ON DELETE CASCADE, verified_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS administrators (
 user_id TEXT PRIMARY KEY REFERENCES user(id) ON DELETE CASCADE, granted_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS clinics (id TEXT PRIMARY KEY, document TEXT NOT NULL CHECK(json_valid(document)), updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS providers (id TEXT PRIMARY KEY, clinic_id TEXT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE, document TEXT NOT NULL CHECK(json_valid(document)));
CREATE TABLE IF NOT EXISTS clinic_languages (clinic_id TEXT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE, language TEXT NOT NULL, PRIMARY KEY(clinic_id, language));
CREATE TABLE IF NOT EXISTS clinic_insurance (clinic_id TEXT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE, insurance TEXT NOT NULL, PRIMARY KEY(clinic_id, insurance));
CREATE TABLE IF NOT EXISTS source_metadata (clinic_id TEXT PRIMARY KEY REFERENCES clinics(id) ON DELETE CASCADE, source TEXT NOT NULL, fictional INTEGER NOT NULL, refreshed_at INTEGER);
CREATE TABLE IF NOT EXISTS saved_clinics (
 user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE, clinic_id TEXT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
 PRIMARY KEY(user_id, clinic_id)
);
CREATE TABLE IF NOT EXISTS visit_plans (
 id TEXT NOT NULL, user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
 clinic_id TEXT NOT NULL REFERENCES clinics(id), document TEXT NOT NULL CHECK(json_valid(document)), created_at INTEGER NOT NULL,
 PRIMARY KEY(user_id, id)
);
CREATE TABLE IF NOT EXISTS reports (
 id TEXT PRIMARY KEY, clinic_id TEXT NOT NULL REFERENCES clinics(id), user_id TEXT REFERENCES user(id) ON DELETE CASCADE,
 actor_hash TEXT, request_key TEXT NOT NULL, fingerprint TEXT NOT NULL, kind TEXT NOT NULL CHECK(kind IN ('current-wait','completed-visit')),
 mode TEXT NOT NULL CHECK(mode IN ('walk-in','scheduled','urgent')), total_minutes INTEGER, elapsed_minutes INTEGER,
 submitted_at INTEGER NOT NULL, visit_date TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('accepted','review','rejected')),
 public_document TEXT NOT NULL CHECK(json_valid(public_document)),
 UNIQUE(actor_hash,request_key),
 CHECK((kind='current-wait' AND total_minutes IS NULL AND elapsed_minutes BETWEEN 0 AND 1440) OR (kind='completed-visit' AND total_minutes BETWEEN 1 AND 1440 AND elapsed_minutes IS NULL))
);
CREATE INDEX reports_evidence ON reports(clinic_id,mode,status,submitted_at);
CREATE INDEX reports_owner ON reports(user_id);
CREATE TABLE IF NOT EXISTS estimates (clinic_id TEXT NOT NULL REFERENCES clinics(id), mode TEXT NOT NULL, document TEXT NOT NULL CHECK(json_valid(document)), calculated_at INTEGER NOT NULL, PRIMARY KEY(clinic_id,mode));
CREATE TABLE IF NOT EXISTS estimate_history (clinic_id TEXT NOT NULL REFERENCES clinics(id), mode TEXT NOT NULL, hour INTEGER NOT NULL, document TEXT NOT NULL, PRIMARY KEY(clinic_id,mode,hour));
CREATE TABLE IF NOT EXISTS daily_metrics (day TEXT NOT NULL, metric TEXT NOT NULL, value INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(day,metric));
CREATE TABLE IF NOT EXISTS presence (key TEXT PRIMARY KEY, user_id TEXT REFERENCES user(id) ON DELETE CASCADE, session_id TEXT REFERENCES session(id) ON DELETE CASCADE, last_seen INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, resets_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS launch_tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, why TEXT NOT NULL, action TEXT NOT NULL, verification TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo','doing','done')), notes TEXT NOT NULL DEFAULT '', guide TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit_log (id TEXT PRIMARY KEY, actor_id TEXT REFERENCES user(id) ON DELETE SET NULL, action TEXT NOT NULL, target TEXT NOT NULL, changes TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS job_runs (id TEXT PRIMARY KEY, job TEXT NOT NULL, started_at INTEGER NOT NULL, finished_at INTEGER, status TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, error_code TEXT);
