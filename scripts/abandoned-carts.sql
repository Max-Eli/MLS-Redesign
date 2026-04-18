-- Abandoned cart recovery
-- Stores checkout sessions where a customer entered contact info but didn't complete payment.
-- A cron job (app/api/cron/abandoned-carts) picks these up once they're older than the
-- configured delay and sends a reminder email with a recovery link.

create table if not exists abandoned_carts (
  id                bigserial primary key,
  recovery_token    text unique not null,
  email             text not null,
  first_name        text,
  last_name         text,
  phone             text,
  items             jsonb not null default '[]'::jsonb,
  subtotal_cents    integer not null default 0,
  promo_code        text,
  last_updated_at   timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  reminder_sent_at  timestamptz,
  converted_at      timestamptz
);

-- Upsert key: one open cart per email. New items update the same row.
create unique index if not exists abandoned_carts_email_idx on abandoned_carts (lower(email));

-- Cron lookup: unsent, unconverted, older than threshold.
create index if not exists abandoned_carts_pending_idx
  on abandoned_carts (last_updated_at)
  where reminder_sent_at is null and converted_at is null;

-- Recovery lookup
create index if not exists abandoned_carts_token_idx on abandoned_carts (recovery_token);
