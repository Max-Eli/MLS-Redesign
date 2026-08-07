-- ─────────────────────────────────────────────────────────────────────────────
-- Add the SMS-reminder dedup column to the rsvps table so the anniversary-sms
-- endpoint can stamp-before-send and never double-text a guest. Run once in
-- Supabase → SQL Editor. Idempotent (ADD COLUMN IF NOT EXISTS).
-- ─────────────────────────────────────────────────────────────────────────────

alter table rsvps
  add column if not exists reminder_sms_sent_at timestamptz;

-- Fast filter: "which attending RSVPs still need the SMS" scans on this.
create index if not exists rsvps_reminder_sms_pending_idx
  on rsvps (event_slug, attending)
  where reminder_sms_sent_at is null and attending = true;
