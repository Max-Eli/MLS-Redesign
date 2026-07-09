-- ─────────────────────────────────────────────────────────────────────────────
-- Event RSVPs — table for the anniversary celebration and any future events
-- Run in: Supabase → SQL Editor
-- Idempotent: safe to re-run (create if not exists + drop/create policies).
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists rsvps (
  id                    bigserial primary key,
  event_slug            text        not null,
  full_name             text        not null,
  email                 text        not null,
  phone                 text        not null,
  attending             boolean     not null,
  num_guests            integer     not null default 1 check (num_guests between 0 and 10),
  dietary_restrictions  text,
  notes                 text,
  created_at            timestamptz not null default now()
);

-- Fast lookup by event when the client wants to see the guest list.
create index if not exists rsvps_event_slug_idx on rsvps (event_slug, created_at desc);

-- Prevent one email from RSVPing twice for the same event (they can call to
-- update the count if plans change).
create unique index if not exists rsvps_email_event_uniq
  on rsvps (lower(email), event_slug);

alter table rsvps enable row level security;

-- Only the service role writes; anonymous clients never touch this table
-- directly — everything flows through /api/rsvp on the server.
drop policy if exists "service role full access rsvps" on rsvps;
create policy "service role full access rsvps"
  on rsvps for all
  using (auth.role() = 'service_role');
