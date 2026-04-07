-- Run in Supabase → SQL Editor

create table if not exists promo_codes (
  id            serial primary key,
  code          text not null unique,
  discount_cents int not null,
  label         text not null,
  active        boolean not null default true,
  uses          int not null default 0,
  created_at    timestamptz not null default now()
);

-- RLS
alter table promo_codes enable row level security;
drop policy if exists "service role full access" on promo_codes;
create policy "service role full access" on promo_codes for all using (auth.role() = 'service_role');

-- Seed the existing promo code
insert into promo_codes (code, discount_cents, label, active)
values ('MLS100OFF', 10000, '$100 off your first treatment', true)
on conflict (code) do nothing;
