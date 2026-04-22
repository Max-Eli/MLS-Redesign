-- Order redemptions
-- Tracks which Stripe payment_intents have been redeemed (customer showed up and used
-- their purchase). Keyed by payment_intent_id so there's no need for a parallel orders
-- table — we keep pulling orders live from Stripe and join this in for redemption state.

create table if not exists order_redemptions (
  stripe_payment_intent_id text primary key,
  redeemed_at              timestamptz,
  redeemed_by              text,
  notes                    text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- Lookup for dashboard filters (pending vs redeemed).
create index if not exists order_redemptions_redeemed_at_idx
  on order_redemptions (redeemed_at);

-- Lock the table: all server code uses the service role key (which bypasses RLS),
-- so enabling RLS with NO policies denies anon/authenticated access entirely.
alter table order_redemptions enable row level security;
