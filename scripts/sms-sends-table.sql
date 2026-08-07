-- ─────────────────────────────────────────────────────────────────────────────
-- Per-campaign SMS send log. Lets the same audience be texted across multiple
-- distinct campaigns (e.g. a day-before and a day-of reminder) while the unique
-- (rsvp_id, campaign) constraint guarantees no double-send WITHIN a campaign.
-- Run once in Supabase → SQL Editor. Idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists sms_sends (
  id          bigserial primary key,
  rsvp_id     bigint not null references rsvps(id) on delete cascade,
  campaign    text   not null,
  to_phone    text,
  twilio_sid  text,
  status      text,
  sent_at     timestamptz not null default now(),
  unique (rsvp_id, campaign)
);

create index if not exists sms_sends_campaign_idx on sms_sends (campaign);

alter table sms_sends enable row level security;
drop policy if exists "service role full access sms_sends" on sms_sends;
create policy "service role full access sms_sends"
  on sms_sends for all
  using (auth.role() = 'service_role');
