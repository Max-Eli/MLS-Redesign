-- Run in Supabase → SQL Editor

create table if not exists promotions (
  id              serial primary key,
  title           text not null,
  description     text,
  services        text,           -- comma-separated list of what's included
  original_price  numeric(10,2),  -- optional, shows savings
  promo_price     numeric(10,2),  -- null = "call for pricing"
  badge           text,           -- e.g. "Limited Time", "Best Value", "New"
  image_url       text,
  active          boolean not null default true,
  starts_at       timestamptz,
  ends_at         timestamptz,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

alter table promotions enable row level security;
drop policy if exists "public read promotions" on promotions;
create policy "public read promotions" on promotions for select using (true);
drop policy if exists "service role full access promotions" on promotions;
create policy "service role full access promotions" on promotions for all using (auth.role() = 'service_role');
