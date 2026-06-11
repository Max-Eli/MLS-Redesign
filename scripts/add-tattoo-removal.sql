-- ─────────────────────────────────────────────────────────────────────────────
-- Laser Tattoo Removal (PicoWay) — category + size-based buyable services
-- Run in: Supabase → SQL Editor
-- Idempotent: safe to re-run; uses ON CONFLICT to update existing rows.
--
-- After running:
--   • /services/laser-tattoo-removal       — editorial page (already in code)
--   • /treatments/tattoo-removal           — category listing of size packages
--   • Each size tier becomes purchasable at /product/<slug>
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


-- 2. Five size-based per-session services. Adjust prices below to match
--    the practice's actual rates before going live — the placeholder
--    values are reasonable Florida-market estimates.
insert into services (
  slug, title, excerpt, category_slug, price, duration,
  badge, is_featured, active, sort_order, image_url
) values
  ('tattoo-removal-extra-small',
   'Laser Tattoo Removal — Extra Small (up to 2"×2")',
   'Single session of PicoWay laser tattoo removal for tattoos up to 2"×2" (5cm×5cm). Most clients need 5–8 sessions spaced 6–8 weeks apart for complete clearance.',
   'tattoo-removal',
   '99', '15 min',
   null, false, true, 10,
   '/laserskintreatments.png'),

  ('tattoo-removal-small',
   'Laser Tattoo Removal — Small (up to 4"×4")',
   'Single session of PicoWay laser tattoo removal for tattoos up to 4"×4" (10cm×10cm). Multiple sessions typically required for complete removal.',
   'tattoo-removal',
   '149', '20 min',
   null, false, true, 20,
   '/laserskintreatments.png'),

  ('tattoo-removal-medium',
   'Laser Tattoo Removal — Medium (up to 6"×6")',
   'Single session of PicoWay laser tattoo removal for tattoos up to 6"×6" (15cm×15cm). Multiple sessions typically required for complete removal.',
   'tattoo-removal',
   '249', '30 min',
   null, false, true, 30,
   '/laserskintreatments.png'),

  ('tattoo-removal-large',
   'Laser Tattoo Removal — Large (up to 8"×8")',
   'Single session of PicoWay laser tattoo removal for tattoos up to 8"×8" (20cm×20cm). Multiple sessions typically required for complete removal.',
   'tattoo-removal',
   '399', '45 min',
   null, false, true, 40,
   '/laserskintreatments.png'),

  ('tattoo-removal-extra-large',
   'Laser Tattoo Removal — Extra Large (over 8"×8")',
   'Single session of PicoWay laser tattoo removal for tattoos larger than 8"×8". Pricing varies with size, location, and ink density — book a free consultation for an accurate quote.',
   'tattoo-removal',
   '', '60 min',
   null, false, true, 50,
   '/laserskintreatments.png')
on conflict (slug) do update set
  title         = excluded.title,
  excerpt       = excluded.excerpt,
  category_slug = excluded.category_slug,
  price         = excluded.price,
  duration      = excluded.duration,
  is_featured   = excluded.is_featured,
  active        = excluded.active,
  sort_order    = excluded.sort_order,
  image_url     = excluded.image_url;
