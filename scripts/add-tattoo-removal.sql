-- ─────────────────────────────────────────────────────────────────────────────
-- Laser Tattoo Removal (PicoWay) — category + size-based buyable services
-- Run in: Supabase → SQL Editor
-- Idempotent: safe to re-run; uses ON CONFLICT to update existing rows.
--
-- Pricing confirmed by the owner (May 2026):
--   XS  $199  Under 1"x1"
--   S   $249  Palm-sized
--   M   $299  Hand-sized
--   L   $399  Larger than hand
--   XL  $499  Half sleeve
--   XXL $649  Full sleeve
--   Permanent Makeup Removal  $399
--
-- After running:
--   • /services/laser-tattoo-removal     — editorial page (already in code)
--   • /treatments/tattoo-removal         — category listing of size packages
--   • Each tier becomes purchasable at /product/<slug>
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Category row so the shop's category filter and /treatments/tattoo-removal
--    listing both pick it up.
insert into service_categories (name, slug, description, sort_order, active) values
  ('Laser Tattoo Removal',
   'tattoo-removal',
   'PicoWay laser tattoo removal — every color, every skin tone.',
   25,
   true)
on conflict (slug) do update set
  name        = excluded.name,
  description = excluded.description,
  sort_order  = excluded.sort_order,
  active      = excluded.active;


-- 2. Drop any earlier draft tier that's no longer in the lineup. Safe no-op if
--    you've never run an earlier version of this script.
delete from services where slug = 'tattoo-removal-extra-large';


-- 3. Six tattoo-size tiers + permanent makeup removal, all priced per session.
insert into services (
  slug, title, excerpt, category_slug, price, duration,
  badge, is_featured, active, sort_order, image_url
) values
  ('tattoo-removal-extra-small',
   'Laser Tattoo Removal — Extra Small (Under 1"×1")',
   'PicoWay laser tattoo removal for tattoos smaller than 1"×1" — wrist initials, finger rings, small symbols. Single session; most clients need 5–8 sessions spaced 6–8 weeks apart for complete clearance.',
   'tattoo-removal',
   '199', '15 min',
   'New', false, true, 10,
   '/laserskintreatments.png'),

  ('tattoo-removal-small',
   'Laser Tattoo Removal — Small (Palm-Sized)',
   'PicoWay laser tattoo removal for palm-sized tattoos — typical small wrist, ankle, or forearm pieces. Single session; multiple sessions required for complete removal.',
   'tattoo-removal',
   '249', '20 min',
   'New', false, true, 20,
   '/laserskintreatments.png'),

  ('tattoo-removal-medium',
   'Laser Tattoo Removal — Medium (Hand-Sized)',
   'PicoWay laser tattoo removal for hand-sized tattoos — about the area of an open hand. Single session; multiple sessions required for complete removal.',
   'tattoo-removal',
   '299', '30 min',
   'New', false, true, 30,
   '/laserskintreatments.png'),

  ('tattoo-removal-large',
   'Laser Tattoo Removal — Large (Larger Than Hand)',
   'PicoWay laser tattoo removal for tattoos larger than a hand — small back pieces, larger forearm work, calf tattoos. Single session; multiple sessions required for complete removal.',
   'tattoo-removal',
   '399', '45 min',
   'New', false, true, 40,
   '/laserskintreatments.png'),

  ('tattoo-removal-half-sleeve',
   'Laser Tattoo Removal — Half Sleeve',
   'PicoWay laser tattoo removal for half-sleeve coverage — upper or lower arm, shoulder to elbow or elbow to wrist. Single session; multiple sessions required for complete removal.',
   'tattoo-removal',
   '499', '60 min',
   'New', false, true, 50,
   '/laserskintreatments.png'),

  ('tattoo-removal-full-sleeve',
   'Laser Tattoo Removal — Full Sleeve',
   'PicoWay laser tattoo removal for full-sleeve coverage — shoulder all the way to wrist. Single session; multiple sessions required for complete removal.',
   'tattoo-removal',
   '649', '90 min',
   'New', false, true, 60,
   '/laserskintreatments.png'),

  ('permanent-makeup-removal',
   'Permanent Makeup Removal',
   'PicoWay laser removal of permanent makeup — microblading, lip blush, eyeliner, and brow tattoos. Performed with careful technique to avoid the pigment darkening that can occur with cosmetic tattoo inks.',
   'tattoo-removal',
   '399', '45 min',
   'New', false, true, 70,
   '/laserskintreatments.png')
on conflict (slug) do update set
  title         = excluded.title,
  excerpt       = excluded.excerpt,
  category_slug = excluded.category_slug,
  price         = excluded.price,
  duration      = excluded.duration,
  badge         = excluded.badge,
  is_featured   = excluded.is_featured,
  active        = excluded.active,
  sort_order    = excluded.sort_order,
  image_url     = excluded.image_url;
