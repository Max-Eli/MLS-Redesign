-- ─────────────────────────────────────────────────────────────────────────────
-- MLS Services — Set image_url to matched Unsplash stock photos
-- Run in: Supabase → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ── LASER HAIR REMOVAL (all areas) ───────────────────────────────────────────
update services set image_url = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'
  where category_slug = 'laser-hair-removal';

-- ── LASER SKIN TREATMENTS ────────────────────────────────────────────────────
-- Laser Genesis — glowing skin, no downtime
update services set image_url = 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80'
  where slug in ('laser-genesis','laser-genesis-6-sessions','laser-genesis-1-session');

-- Clear + Brilliant — gentle resurfacing, radiant skin
update services set image_url = 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80'
  where slug in ('clear-and-brilliant','clear-and-brilliant-3-sessions');

-- CO2 Laser — fractional laser resurfacing
update services set image_url = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80'
  where slug like 'co2-%';

-- IPL Photofacial — even skin tone, photofacial
update services set image_url = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80'
  where slug in ('ipl-photofacial','ipl-photofacial-3-sessions','ipl-photofacial-6-sessions');

-- KTP / SmoothGlo — skin rejuvenation
update services set image_url = 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80'
  where slug in ('ktp-iridex','smoothglo','smoothglo-3-sessions');

-- ── FACIAL TREATMENTS ────────────────────────────────────────────────────────
-- HydraFacial — deep hydration, glowing skin
update services set image_url = 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80'
  where slug in ('hydrafacial-1-session','hydrafacial');

-- JetPeel — jet infusion facial
update services set image_url = 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80'
  where slug in ('jetpeel','jetpeel-hydration-facial');

-- RF Microneedling / Microneedling — collagen induction
update services set image_url = 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=800&q=80'
  where slug in (
    'rf-microneedling','rf-microneedling-3-sessions',
    'microneedling-facial','microneedling-3-sessions-facial',
    'microneedling-1-session','microneedling-with-prp-hair',
    'microneedling-jetpeel-combo-prp'
  );

-- PRX-T33 / VI Peel / Blue Peel — chemical peel, skin renewal
update services set image_url = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80'
  where slug in (
    'prx-t33-peel','prx-t33-peel-4-sessions','prx-t33-red-carpet-peel',
    'vi-peel','vi-peel-3-sessions',
    'blue-peel','blue-peel-3-sessions'
  );

-- Spa facials, LED, dermaplaning — relaxing facial treatment
update services set image_url = 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80'
  where slug in (
    'espresso-facial','manhattan-facial','luxurious-facial',
    'led-therapy','dermaplaning','manhattan-laser-facial'
  );

-- ── BODY TREATMENTS ──────────────────────────────────────────────────────────
-- CoolSculpting — body contouring, fat reduction
update services set image_url = 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80'
  where slug in ('coolsculpting-consultation','coolsculpting','coolsculpting-elite');

-- EMSculpt — muscle toning, toned abs
update services set image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'
  where slug in ('emsculpt-single','emsculpt-4-sessions','emsculpt-4-session','emsculpt');

-- Endosphere — body contouring massage
update services set image_url = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'
  where slug in (
    'body-contouring-single','body-contouring-4-sessions',
    'endosphere-therapy-12-sessions','endosphere'
  );

-- LPG / Massage — luxury body massage
update services set image_url = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'
  where slug in (
    'massage-60-min','massage-90-min','face-neck-decollete-massage',
    'lpg-endermologie','lpg'
  );

-- ── INJECTABLES ──────────────────────────────────────────────────────────────
-- Botox — anti-wrinkle injection
update services set image_url = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'
  where slug in ('botox-xeomin-per-unit','botox-1-unit','botox');

-- Dermal Fillers — volume, lip and cheek enhancement
update services set image_url = 'https://images.unsplash.com/photo-1591017403286-fd8493524e1e?w=800&q=80'
  where slug in (
    'juvederm-per-syringe','radiesse-per-syringe','sculptra-per-vial',
    '1-syringe-of-juvederm-ultra-plus','dermal-fillers'
  );

-- PDO Thread Lift — non-surgical lift
update services set image_url = 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80'
  where slug in ('pdo-thread-lift-full-face','pdo-thread-lift');

-- Kybella — double chin, jawline definition
update services set image_url = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
  where slug in ('kybella-per-vial-inj','kybella-per-vial','kybella');

-- PRP Facelift — natural rejuvenation with PRP
update services set image_url = 'https://images.unsplash.com/photo-1614804961561-0e93fa7f1d6c?w=800&q=80'
  where slug in ('prp-face-lift','prp-p2-sci','prp-facelift');

-- ── HAIR RESTORATION ─────────────────────────────────────────────────────────
update services set image_url = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
  where slug in (
    'prp-hair-injections','scalp-hair-complex','jetcare-with-prp',
    'prp-hair-restoration-1-procedure','prp-hair-restoration'
  );

-- ── IV WELLNESS THERAPY ───────────────────────────────────────────────────────
-- IV drips — nutrient infusion
update services set image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80'
  where slug in (
    'booster-shots','athletic-recovery-drip','hangover-banana-bag',
    'beauty-drip','immune-defense-drip','myers-cocktail',
    'transformation-drip','get-up-go-energy','be-lean-drip',
    'nad-therapy','nad-2-3','trt-aptosis','iv-therapy','hrt-consultation'
  );

-- Weight loss / Semaglutide — healthy lifestyle
update services set image_url = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80'
  where slug in ('semaglutide','weight-loss-drip','weight-loss','medical-weight-loss');

-- ── MEMBERSHIPS ───────────────────────────────────────────────────────────────
update services set image_url = 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80'
  where category_slug = 'memberships'
     or slug = 'membership-info';

-- ── GIFT CARDS ────────────────────────────────────────────────────────────────
update services set image_url = 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80'
  where category_slug = 'gift-cards';

-- ── FALLBACK — anything still missing ────────────────────────────────────────
update services set image_url = 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80'
  where image_url is null or image_url = '';
