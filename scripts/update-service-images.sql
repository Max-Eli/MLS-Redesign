-- ─────────────────────────────────────────────────────────────────────────────
-- MLS Services — Set image_url to local uploaded category images
-- Run in: Supabase → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ── LASER HAIR REMOVAL ────────────────────────────────────────────────────────
update services set image_url = '/laserhairremoval.jpg'
  where category_slug = 'laser-hair-removal';

-- ── LASER SKIN TREATMENTS ─────────────────────────────────────────────────────
update services set image_url = '/laserskintreatments.png'
  where category_slug = 'laser-skin-treatments';

-- ── FACIAL TREATMENTS ─────────────────────────────────────────────────────────
update services set image_url = '/facialtreaments.png'
  where category_slug = 'facial-treatments';

-- ── BODY TREATMENTS ───────────────────────────────────────────────────────────
update services set image_url = '/bodytreatments.png'
  where category_slug = 'body-treatments';

-- ── INJECTABLES ───────────────────────────────────────────────────────────────
update services set image_url = '/injectables.png'
  where category_slug = 'injectables';

-- ── IV WELLNESS THERAPY ───────────────────────────────────────────────────────
update services set image_url = '/IVtherapy.png'
  where category_slug = 'iv-wellness-therapy';

-- ── HAIR RESTORATION ──────────────────────────────────────────────────────────
update services set image_url = '/IVtherapy.png'
  where category_slug = 'hair-restoration';

-- ── HORMONAL REPLACEMENT THERAPY ─────────────────────────────────────────────
update services set image_url = '/IVtherapy.png'
  where category_slug = 'hormonal-replacement-therapy';

-- ── MEMBERSHIPS ───────────────────────────────────────────────────────────────
update services set image_url = '/facialtreaments.png'
  where category_slug = 'memberships';

-- ── GIFT CARDS — no image (card renders branded price display) ────────────────
update services set image_url = null
  where category_slug = 'gift-cards';

-- ── FALLBACK — anything still missing ────────────────────────────────────────
update services set image_url = '/facialtreaments.png'
  where image_url is null or image_url = '';
