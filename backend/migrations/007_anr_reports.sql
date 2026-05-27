-- Migration 007: ANR / Hang reports
-- Adds a table to store ANR and main-thread hang reports from mobile devices.

CREATE TABLE IF NOT EXISTS anr_reports (
  id UUID PRIMARY KEY,
  platform TEXT NOT NULL,
  type TEXT NOT NULL,
  timestamp TIMESTAMPTZ,
  thread_name TEXT,
  stack_trace TEXT NOT NULL,
  app_version TEXT,
  os_version TEXT,
  device_model TEXT,
  additional_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anr_reports_platform ON anr_reports(platform);
CREATE INDEX IF NOT EXISTS idx_anr_reports_type ON anr_reports(type);

INSERT INTO schema_migrations (version, name)
  VALUES (7, '007_anr_reports')
  ON CONFLICT (version) DO NOTHING;
