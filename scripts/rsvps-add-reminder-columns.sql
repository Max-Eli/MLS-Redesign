-- ─────────────────────────────────────────────────────────────────────────────
-- Add reminder-tracking columns to the rsvps table so the cron worker can
-- deduplicate — each column stores when that particular reminder was sent,
-- so a re-run of the cron won't double-send. Run once in Supabase.
-- Idempotent (ADD COLUMN IF NOT EXISTS).
-- ─────────────────────────────────────────────────────────────────────────────

alter table rsvps
  add column if not exists reminder_week_sent_at  timestamptz,
  add column if not exists reminder_48h_sent_at   timestamptz,
  add column if not exists reminder_dayof_sent_at timestamptz;

-- Fast filter: "which RSVPs still need reminder X" queries scan on these.
create index if not exists rsvps_reminder_week_pending_idx
  on rsvps (event_slug, attending)
  where reminder_week_sent_at is null and attending = true;

create index if not exists rsvps_reminder_48h_pending_idx
  on rsvps (event_slug, attending)
  where reminder_48h_sent_at is null and attending = true;

create index if not exists rsvps_reminder_dayof_pending_idx
  on rsvps (event_slug, attending)
  where reminder_dayof_sent_at is null and attending = true;
