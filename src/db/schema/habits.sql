CREATE TABLE IF NOT EXISTS habits (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL,
  schedule_days TEXT NOT NULL DEFAULT '["mon","tue","wed","thu","fri","sat","sun"]',
  schedule_time TEXT NOT NULL DEFAULT '09:00',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
