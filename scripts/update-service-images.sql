-- ─────────────────────────────────────────────────────────────────────────────
-- MLS Services — Set image_url to matched Unsplash stock photos
-- Run in: Supabase → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ── LASER HAIR REMOVAL (all areas) ───────────────────────────────────────────
-- cosmetologist holding laser device on patient
update services set image_url = 'https://images.unsplash.com/photo-0c1BW_XAdjg?w=800&q=80'
  where category_slug = 'laser-hair-removal';

-- ── LASER SKIN TREATMENTS ────────────────────────────────────────────────────
-- Laser Genesis — glowing skin portrait, no-downtime glow
update services set image_url = 'https://images.unsplash.com/photo-ymA4mWq9c3w?w=800&q=80'
  where slug in ('laser-genesis','laser-genesis-6-sessions','laser-genesis-1-session');

-- Clear + Brilliant — light patterns on skin, gentle resurfacing
update services set image_url = 'https://images.unsplash.com/photo-bXpzhkPM5Qg?w=800&q=80'
  where slug in ('clear-and-brilliant','clear-and-brilliant-3-sessions');

-- CO2 Laser — professional skin analyzer / laser equipment on face
update services set image_url = 'https://images.unsplash.com/photo-G_ovGyrlsZM?w=800&q=80'
  where slug like 'co2-%';

-- IPL Photofacial — radiant glowing skin close-up
update services set image_url = 'https://images.unsplash.com/photo-270y1bUPtsM?w=800&q=80'
  where slug in ('ipl-photofacial','ipl-photofacial-3-sessions','ipl-photofacial-6-sessions');

-- KTP / SmoothGlo / other laser skin — spa face close-up
update services set image_url = 'https://images.unsplash.com/photo-39Q379dPvwQ?w=800&q=80'
  where slug in ('ktp-iridex','smoothglo','smoothglo-3-sessions');

-- ── FACIAL TREATMENTS ────────────────────────────────────────────────────────
-- HydraFacial — hydrated face close-up, spa setting
update services set image_url = 'https://images.unsplash.com/photo-39Q379dPvwQ?w=800&q=80'
  where slug in ('hydrafacial-1-session','hydrafacial','jetpeel-hydration-facial','jetpeel');

-- JetPeel — supersonic water jet on face
update services set image_url = 'https://images.unsplash.com/photo-iEZKrAfaEUQ?w=800&q=80'
  where slug in ('jetpeel','jetpeel-hydration-facial');

-- RF Microneedling / Microneedling — serum/skin close-up, collagen induction
update services set image_url = 'https://images.unsplash.com/photo-e4dtJ3bnYtM?w=800&q=80'
  where slug in (
    'rf-microneedling','rf-microneedling-3-sessions',
    'microneedling-facial','microneedling-3-sessions-facial',
    'microneedling-1-session','microneedling-with-prp-hair',
    'microneedling-jetpeel-combo-prp'
  );

-- PRX-T33 / VI Peel / Blue Peel — radiant eye/skin close-up (no peeling, no downtime)
update services set image_url = 'https://images.unsplash.com/photo-270y1bUPtsM?w=800&q=80'
  where slug in (
    'prx-t33-peel','prx-t33-peel-4-sessions','prx-t33-red-carpet-peel',
    'vi-peel','vi-peel-3-sessions',
    'blue-peel','blue-peel-3-sessions'
  );

-- Spa facials (espresso, manhattan, luxurious, led, dermaplaning) — woman on spa table
update services set image_url = 'https://images.unsplash.com/photo-km3sO7BibWY?w=800&q=80'
  where slug in (
    'espresso-facial','manhattan-facial','luxurious-facial',
    'led-therapy','dermaplaning','manhattan-laser-facial'
  );

-- ── BODY TREATMENTS ──────────────────────────────────────────────────────────
-- CoolSculpting — woman measuring waist / body contouring
update services set image_url = 'https://images.unsplash.com/photo-oThoRP1zGzE?w=800&q=80'
  where slug in ('coolsculpting-consultation','coolsculpting','coolsculpting-elite');

-- EMSculpt — toned abs, muscle definition
update services set image_url = 'https://images.unsplash.com/photo-unjFZgjSsTk?w=800&q=80'
  where slug in ('emsculpt-single','emsculpt-4-sessions','emsculpt-4-session','emsculpt');

-- Endosphere — body massage/rolling treatment
update services set image_url = 'https://images.unsplash.com/photo-jmRbgqXLCI0?w=800&q=80'
  where slug in (
    'body-contouring-single','body-contouring-4-sessions',
    'endosphere-therapy-12-sessions','endosphere'
  );

-- LPG / Massage — luxury wellness spa massage
update services set image_url = 'https://images.unsplash.com/photo-xWgn8kVi6c4?w=800&q=80'
  where slug in (
    'massage-60-min','massage-90-min','face-neck-decollete-massage',
    'lpg-endermologie','lpg'
  );

-- ── INJECTABLES ──────────────────────────────────────────────────────────────
-- Botox / Xeomin — forehead injection close-up
update services set image_url = 'https://images.unsplash.com/photo-T0KSepDR3Oo?w=800&q=80'
  where slug in ('botox-xeomin-per-unit','botox-1-unit','botox');

-- Dermal Fillers (Juvederm, Radiesse, Sculptra) — face treatment, volume restoration
update services set image_url = 'https://images.unsplash.com/photo-grsi7rOosTk?w=800&q=80'
  where slug in (
    'juvederm-per-syringe','radiesse-per-syringe','sculptra-per-vial',
    '1-syringe-of-juvederm-ultra-plus','dermal-fillers',
    'pdo-thread-lift-full-face','pdo-thread-lift'
  );

-- Kybella — defined jawline and neck close-up
update services set image_url = 'https://images.unsplash.com/photo-mordABNyEQ4?w=800&q=80'
  where slug in ('kybella-per-vial-inj','kybella-per-vial','kybella');

-- PRP Facelift — blood sample tubes / PRP centrifuge
update services set image_url = 'https://images.unsplash.com/photo-L1KVK-S4Bhw?w=800&q=80'
  where slug in ('prp-face-lift','prp-p2-sci','prp-facelift');

-- ── HAIR RESTORATION ─────────────────────────────────────────────────────────
-- PRP hair / scalp treatments — hair restoration context
update services set image_url = 'https://images.unsplash.com/photo-EDFQVwLl3cs?w=800&q=80'
  where slug in (
    'prp-hair-injections','scalp-hair-complex','jetcare-with-prp',
    'prp-hair-restoration-1-procedure','prp-hair-restoration'
  );

-- ── IV WELLNESS THERAPY ───────────────────────────────────────────────────────
-- IV drips — IV drip on patient's hand
update services set image_url = 'https://images.unsplash.com/photo-jvB1v06W6jU?w=800&q=80'
  where slug in (
    'booster-shots','athletic-recovery-drip','hangover-banana-bag',
    'beauty-drip','immune-defense-drip','myers-cocktail',
    'transformation-drip','get-up-go-energy','be-lean-drip',
    'nad-therapy','nad-2-3','trt-aptosis','iv-therapy','hrt-consultation'
  );

-- Weight loss / Semaglutide — healthy lifestyle, cooking
update services set image_url = 'https://images.unsplash.com/photo-8ing4Zv8FBE?w=800&q=80'
  where slug in ('semaglutide','weight-loss-drip','weight-loss','medical-weight-loss');

-- ── MEMBERSHIPS ───────────────────────────────────────────────────────────────
-- VIP membership — woman in luxury spa setting
update services set image_url = 'https://images.unsplash.com/photo-km3sO7BibWY?w=800&q=80'
  where category_slug = 'memberships'
     or slug = 'membership-info';

-- ── GIFT CARDS ────────────────────────────────────────────────────────────────
-- Gift cards — glowing skin / luxury beauty
update services set image_url = 'https://images.unsplash.com/photo-ymA4mWq9c3w?w=800&q=80'
  where category_slug = 'gift-cards';

-- ── FALLBACK — anything still missing ────────────────────────────────────────
-- Catch-all for any service not matched above
update services set image_url = 'https://images.unsplash.com/photo-39Q379dPvwQ?w=800&q=80'
  where image_url is null or image_url = '';
