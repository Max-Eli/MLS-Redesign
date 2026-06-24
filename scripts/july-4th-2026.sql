-- ─────────────────────────────────────────────────────────────────────────────
-- Independence Day (July 4th) 2026 campaign
-- Run in: Supabase → SQL Editor
-- Idempotent: safe to re-run; uses ON CONFLICT to update existing rows.
--
-- Owner-confirmed offers:
--   PicoWay Pigmentation Treatment    $249  (Reg. $499)
--   Laser Hair Removal — Small         $199  (Package of 6)
--   Laser Hair Removal — Medium        $299  (Package of 6)
--   Laser Hair Removal — Large         $399  (Package of 6)
--   Laser Hair Removal — Full Body    $1400  (Package of 6)
--   RF Microneedling                   $399  (Reg. $550)
--   Lip Filler                         $399
--
-- Campaign window: 2026-06-25 → 2026-07-06 (offer expires July 6).
-- Limited appointments.
--
-- After running:
--   • Each offer is purchasable on the shop with badge "Limited Time"
--   • The Independence Day popup shows them on the homepage
--   • When ends_at passes (July 7 00:00), the promotions filter
--     automatically hides the services from shop/featured/product pages.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Seven services in the catalog. Kept separate from year-round rows so
--    regular pricing stays untouched when the campaign ends.
insert into services (
  slug, title, excerpt, category_slug, price, sale_price, duration,
  badge, is_featured, active, sort_order, image_url
) values
  ('july-4th-picoway-pigmentation',
   'July 4th Special: PicoWay Pigmentation Treatment',
   'Single session of PicoWay pigmentation treatment — melasma, sun damage, age spots, uneven skin tone. Independence Day pricing.',
   'laser-skin-treatments',
   '499', '249', '30 min',
   'Limited Time', true, true, 1,
   '/laserskintreatments.png'),

  ('july-4th-laser-hair-removal-small',
   'July 4th Special: Laser Hair Removal — Small (Package of 6)',
   'Six sessions of laser hair removal for small areas — upper lip, chin, sideburns, underarms, or comparable. Independence Day pricing.',
   'laser-hair-removal',
   '199', null, '6 sessions',
   'Limited Time', true, true, 2,
   '/laserhairremoval.jpg'),

  ('july-4th-laser-hair-removal-medium',
   'July 4th Special: Laser Hair Removal — Medium (Package of 6)',
   'Six sessions of laser hair removal for medium areas — half arms, bikini line, lower legs, or comparable. Independence Day pricing.',
   'laser-hair-removal',
   '499', '299', '6 sessions',
   'Limited Time', true, true, 3,
   '/laserhairremoval.jpg'),

  ('july-4th-laser-hair-removal-large',
   'July 4th Special: Laser Hair Removal — Large (Package of 6)',
   'Six sessions of laser hair removal for large areas — full arms, full legs, full back, or Brazilian. Independence Day pricing.',
   'laser-hair-removal',
   '599', '399', '6 sessions',
   'Limited Time', true, true, 4,
   '/laserhairremoval.jpg'),

  ('july-4th-laser-hair-removal-full-body',
   'July 4th Special: Laser Hair Removal — Full Body (Package of 6)',
   'Six sessions of full-body laser hair removal — head-to-toe coverage. Independence Day pricing on our most popular package.',
   'laser-hair-removal',
   '2499', '1400', '6 sessions',
   'Limited Time', true, true, 5,
   '/laserhairremoval.jpg'),

  ('july-4th-rf-microneedling',
   'July 4th Special: RF Microneedling',
   'Single session of RF Microneedling — collagen-stimulating treatment for fine lines, scarring, texture, and pore size. Independence Day pricing.',
   'facial-treatments',
   '550', '399', '60 min',
   'Limited Time', true, true, 6,
   '/facialtreaments.png'),

  ('july-4th-lip-filler',
   'July 4th Special: Lip Filler',
   'Soft, natural-looking lip enhancement with premium hyaluronic acid filler. Performed by our licensed injector. Independence Day pricing.',
   'injectables',
   '399', null, '30–45 min',
   'Limited Time', true, true, 7,
   '/injectables.png')
on conflict (slug) do update set
  title         = excluded.title,
  excerpt       = excluded.excerpt,
  category_slug = excluded.category_slug,
  price         = excluded.price,
  sale_price    = excluded.sale_price,
  duration      = excluded.duration,
  badge         = excluded.badge,
  is_featured   = excluded.is_featured,
  active        = excluded.active,
  sort_order    = excluded.sort_order,
  image_url     = excluded.image_url;


-- 2. Clean re-run: drop any prior promotion rows the campaign created so
--    a second run of this script doesn't leave duplicates.
delete from promotions where product_slug like 'july-4th-%';


-- 3. Seven promotion rows, one per service. product_slug links each promotion
--    to its service so the visibility filter (lib/supabase.ts:fetchInactivePromoSlugs)
--    auto-hides every campaign service the moment the window closes.
insert into promotions (
  title, description, services, original_price, promo_price, badge,
  image_url, product_slug, active, starts_at, ends_at, sort_order
) values
  ('PicoWay Pigmentation Treatment',
   'Clear melasma, sun spots, and uneven tone with the most advanced picosecond laser available. Limited-time Independence Day pricing.',
   'PicoWay pigmentation session',
   499, 249,
   'July 4th',
   '/laserskintreatments.png',
   'july-4th-picoway-pigmentation',
   true, '2026-06-25', '2026-07-07', 1),

  ('Laser Hair Removal — Small (Package of 6)',
   'Six sessions of laser hair removal for small areas — upper lip, chin, sideburns, underarms.',
   '6-session package',
   null, 199,
   'July 4th',
   '/laserhairremoval.jpg',
   'july-4th-laser-hair-removal-small',
   true, '2026-06-25', '2026-07-07', 2),

  ('Laser Hair Removal — Medium (Package of 6)',
   'Six sessions of laser hair removal for medium areas — half arms, bikini line, lower legs.',
   '6-session package',
   499, 299,
   'July 4th',
   '/laserhairremoval.jpg',
   'july-4th-laser-hair-removal-medium',
   true, '2026-06-25', '2026-07-07', 3),

  ('Laser Hair Removal — Large (Package of 6)',
   'Six sessions of laser hair removal for large areas — full arms, full legs, full back, Brazilian.',
   '6-session package',
   599, 399,
   'July 4th',
   '/laserhairremoval.jpg',
   'july-4th-laser-hair-removal-large',
   true, '2026-06-25', '2026-07-07', 4),

  ('Laser Hair Removal — Full Body (Package of 6)',
   'Six sessions of full-body laser hair removal — head-to-toe coverage at our biggest Independence Day savings.',
   '6-session package',
   2499, 1400,
   'July 4th',
   '/laserhairremoval.jpg',
   'july-4th-laser-hair-removal-full-body',
   true, '2026-06-25', '2026-07-07', 5),

  ('RF Microneedling',
   'Collagen-stimulating RF microneedling for fine lines, scarring, texture, and pore size.',
   'Single RF microneedling session',
   550, 399,
   'July 4th',
   '/facialtreaments.png',
   'july-4th-rf-microneedling',
   true, '2026-06-25', '2026-07-07', 6),

  ('Lip Filler',
   'Soft, natural-looking lip enhancement with premium hyaluronic acid filler, by our licensed injector.',
   'Full lip filler session',
   null, 399,
   'July 4th',
   '/injectables.png',
   'july-4th-lip-filler',
   true, '2026-06-25', '2026-07-07', 7);
