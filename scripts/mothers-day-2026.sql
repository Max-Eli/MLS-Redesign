-- ─────────────────────────────────────────────────────────────────────────────
-- Mother's Day 2026 campaign
-- Run in: Supabase → SQL Editor
-- Self-contained: creates the promotions table if it doesn't already exist.
-- ─────────────────────────────────────────────────────────────────────────────

-- 0. Ensure the promotions table exists (from create-promotions-table.sql)
create table if not exists promotions (
  id              serial primary key,
  title           text not null,
  description     text,
  services        text,
  original_price  numeric(10,2),
  promo_price     numeric(10,2),
  badge           text,
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

-- 1. Add product_slug column so promotions can link to a purchasable service
alter table promotions add column if not exists product_slug text;

-- 2. Insert the 4 Mother's Day services (separate from the year-round catalog
--    so regular prices are untouched when the campaign ends)
insert into services (slug, title, excerpt, category_slug, price, sale_price, duration, badge, is_featured, active, sort_order, image_url) values
  -- price = original/struck-through, sale_price = what Stripe charges (checkout uses sale_price || price)
  ('mothers-day-botox-per-unit',
   'Mother''s Day Botox – Per Unit',
   'Limited-time Mother''s Day pricing on Botox. Priced per unit, administered by our licensed injector.',
   'injectables',
   '13', '8.99', 'Per unit',
   'Mother''s Day', true, true, 1,
   '/mothersdaypromosite.png'),

  ('mothers-day-lip-filler',
   'Mother''s Day Lip Filler',
   'Soft, natural-looking lip enhancement with premium hyaluronic acid filler. Mother''s Day exclusive.',
   'injectables',
   '650', '399', '30–45 min',
   'Mother''s Day', true, true, 2,
   '/mothersdaypromosite.png'),

  ('mothers-day-co2-eye-rejuvenation',
   'Mother''s Day CO2 Eye Rejuvenation',
   'Fractional CO2 laser treatment around the eyes — smooths fine lines, tightens skin, brightens the under-eye.',
   'laser-skin-treatments',
   '500', '299', '45 min',
   'Mother''s Day', true, true, 3,
   '/mothersdaypromosite.png'),

  ('mothers-day-deep-cleansing-facial',
   'Mother''s Day Deep Cleansing Facial',
   'Detoxifying deep-cleansing facial with extractions, steam, and a nourishing mask. Mother''s Day exclusive.',
   'facial-treatments',
   '175', '120', '60 min',
   'Mother''s Day', true, true, 4,
   '/mothersdaypromosite.png')
on conflict (slug) do update set
  title       = excluded.title,
  excerpt     = excluded.excerpt,
  price       = excluded.price,
  sale_price  = excluded.sale_price,
  duration    = excluded.duration,
  badge       = excluded.badge,
  is_featured = excluded.is_featured,
  active      = excluded.active,
  sort_order  = excluded.sort_order,
  image_url   = excluded.image_url;


-- 3. Clear any prior Mother's Day promotions so re-running this script is
--    idempotent (only targets rows this script created — leaves other promos alone).
delete from promotions where product_slug like 'mothers-day-%';

-- 4. Insert the 4 promotions that appear on /promotions and drive the popup
insert into promotions (title, description, services, original_price, promo_price, badge, image_url, product_slug, active, starts_at, ends_at, sort_order) values
  ('Botox for Mom',
   'Celebrate her with a refreshed, radiant look. Licensed injector, premium product, Mother''s Day pricing.',
   'Botox by the unit',
   13, 8.99,
   'Mother''s Day',
   '/mothersdaypromosite.png',
   'mothers-day-botox-per-unit',
   true, '2026-04-17', '2026-05-12', 1),

  ('Lip Filler for Mom',
   'Soft, natural-looking enhancement with premium hyaluronic acid filler — priced specially for Mother''s Day.',
   'Full lip filler session',
   650, 399,
   'Mother''s Day',
   '/mothersdaypromosite.png',
   'mothers-day-lip-filler',
   true, '2026-04-17', '2026-05-12', 2),

  ('CO2 Eye Rejuvenation',
   'Smooth fine lines, tighten, and brighten the eye area with fractional CO2 — our Mother''s Day signature treatment.',
   'CO2 fractional laser around the eyes',
   500, 299,
   'Mother''s Day',
   '/mothersdaypromosite.png',
   'mothers-day-co2-eye-rejuvenation',
   true, '2026-04-17', '2026-05-12', 3),

  ('Deep Cleansing Facial',
   'A detoxifying deep-cleansing facial — extractions, steam, and a nourishing mask. The perfect gift for Mom.',
   'Deep cleansing facial with extractions',
   175, 120,
   'Mother''s Day',
   '/mothersdaypromosite.png',
   'mothers-day-deep-cleansing-facial',
   true, '2026-04-17', '2026-05-12', 4);
