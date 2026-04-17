-- ─────────────────────────────────────────────────────────────────────────────
-- Skincare Catalog — AlumierMD (46 products, full catalog as of April 2026)
-- Run in: Supabase → SQL Editor
-- Self-contained: creates the skincare_products table if missing.
-- Idempotent: re-running upserts by (brand, slug).
--
-- Each product links out to the brand's storefront. The referral code is
-- appended by the app at render time (stored in env: ALUMIERMD_REFERRAL_CODE)
-- so the value can rotate without re-running this migration.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists skincare_products (
  id            serial primary key,
  brand         text not null,
  slug          text not null,
  name          text not null,
  description   text,
  category      text,
  price         numeric(10,2),
  image_url     text,
  external_path text,
  is_featured   boolean not null default false,
  sort_order    int    not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  unique (brand, slug)
);

alter table skincare_products enable row level security;
drop policy if exists "public read skincare" on skincare_products;
create policy "public read skincare" on skincare_products for select using (true);
drop policy if exists "service role write skincare" on skincare_products;
create policy "service role write skincare" on skincare_products for all using (auth.role() = 'service_role');

create index if not exists skincare_brand_idx    on skincare_products(brand);
create index if not exists skincare_category_idx on skincare_products(category);
create index if not exists skincare_active_idx   on skincare_products(active);

-- Re-seed: wipe any existing AlumierMD rows so re-running reflects the latest
-- names/prices without leaving stale slugs behind.
delete from skincare_products where brand = 'alumiermd';

insert into skincare_products (brand, slug, name, description, category, price, image_url, external_path, is_featured, sort_order) values

-- ── Featured / Hero Products ─────────────────────────────────────────────────
('alumiermd','ultimate-boost-serum','Ultimate Boost Serum',
 'Advanced antioxidant and peptide serum that hydrates, brightens, and defends against visible signs of aging.',
 'Serums',116.00,
 'https://us.alumiermd.com/cdn/shop/files/UltimateBoost_590e4001-db9f-4c96-8e36-2f4edc29d960.png?v=1718321341&width=533',
 '/products/ultimate-boost-serum', true, 1),

('alumiermd','everactive-c-e-peptide','EverActive C&E®+ Peptide',
 'Potent Vitamin C, E, and peptide serum activated at first use — neutralizes free radicals and smooths fine lines.',
 'Serums',212.00,
 'https://us.alumiermd.com/cdn/shop/files/EverActive_Pipette.png?v=1719415793&width=533',
 '/products/everactive-c-e-peptide', true, 2),

('alumiermd','everactive-c-e-peptide-single','EverActive C&E® + Peptide (Single)',
 'Single-use activator for the cult-favorite Vitamin C and peptide serum — try it before committing to the full kit.',
 'Serums',95.00,
 'https://us.alumiermd.com/cdn/shop/files/EverActive-retail-single-with-box.jpg?v=1748451760&width=533',
 '/products/everactive-c-e-peptide-single', false, 3),

('alumiermd','intellibright-complex','Intellibright® Complex',
 'Targeted brightening serum that evens skin tone and reduces the appearance of dark spots and discoloration.',
 'Serums',121.00,
 'https://us.alumiermd.com/cdn/shop/files/IntelliBright_5ba95e10-1080-42a4-a040-0e2efbcdf99d.png?v=1718321543&width=533',
 '/products/intellibright-complex', true, 4),

('alumiermd','alumineye','AluminEye®',
 'Lightweight eye serum that firms, smooths, and reduces the look of puffiness and fine lines around the eye area.',
 'Eye & Lip',129.00,
 'https://us.alumiermd.com/cdn/shop/files/AluminEye_265f74b0-c10b-491c-b932-14dbd45ad3ff.png?v=1718322645&width=533',
 '/products/alumineye', true, 5),

('alumiermd','bright-and-clear-solution','Bright & Clear Solution',
 'Exfoliating, brightening toner that clarifies, refines, and preps skin for deeper product absorption.',
 'Exfoliants',52.00,
 'https://us.alumiermd.com/cdn/shop/files/1272-060326011_-_New_Beauty_Award_-_Bright_and_Clear_Solution_-_Website_Image.png?v=1743001741&width=533',
 '/products/bright-and-clear-solution', true, 6),

-- ── Cleansers ────────────────────────────────────────────────────────────────
('alumiermd','purifying-gel-cleanser','Purifying Gel Cleanser',
 'Gentle foaming cleanser for normal to oily skin — removes impurities without stripping essential moisture.',
 'Cleansers',52.00,
 'https://us.alumiermd.com/cdn/shop/files/PGC.png?v=1719415794&width=533',
 '/products/purifying-gel-cleanser', false, 10),

('alumiermd','clarifying-cleanser','Acne Clarifying Cleanser',
 'Salicylic-acid cleanser formulated to clear congestion, reduce breakouts, and balance blemish-prone skin.',
 'Cleansers',55.00,
 'https://us.alumiermd.com/cdn/shop/files/Acne_Clarifying_Cleanser.png?v=1715870198&width=533',
 '/products/clarifying-cleanser', false, 11),

('alumiermd','sensicalm','SensiCalm',
 'Soothing cream cleanser for sensitive and reactive skin — calms redness while cleansing gently.',
 'Cleansers',52.00,
 'https://us.alumiermd.com/cdn/shop/files/SensiCalm_18c3e6b5-606b-45de-a7c4-0f73b4c7fb6e.png?v=1719415793&width=533',
 '/products/sensicalm', false, 12),

-- ── Serums ───────────────────────────────────────────────────────────────────
('alumiermd','retinol-resurfacing-serum-0-25','Retinol Resurfacing Serum 0.25',
 'Entry-level retinol — smooths texture and minimizes fine lines with a low-strength formula for newcomers.',
 'Serums',91.00,
 'https://us.alumiermd.com/cdn/shop/files/Retinol_0_25.png?v=1718320893&width=533',
 '/products/retinol-resurfacing-serum-0-25', false, 20),

('alumiermd','retinol-resurfacing-serum-0-5','Retinol Resurfacing Serum 0.5',
 'Mid-strength retinol serum that refines texture, softens lines, and renews dull skin with minimal irritation.',
 'Serums',104.00,
 'https://us.alumiermd.com/cdn/shop/files/Retinol_0_5.png?v=1718321009&width=533',
 '/products/retinol-resurfacing-serum-0-5', false, 21),

('alumiermd','retinol-resurfacing-serum-1-0','Retinol Resurfacing Serum 1.0',
 'High-strength retinol for experienced users — accelerates cell turnover for visibly smoother, younger-looking skin.',
 'Serums',115.00,
 'https://us.alumiermd.com/cdn/shop/files/Retinol_1_0.png?v=1718321129&width=533',
 '/products/retinol-resurfacing-serum-1-0', false, 22),

('alumiermd','aha-renewal-serum','AHA Renewal Serum',
 'Glycolic and lactic acid serum that exfoliates, brightens, and refines uneven texture overnight.',
 'Serums',88.00,
 'https://us.alumiermd.com/cdn/shop/files/AHA_Copy.png?v=1718322473&width=533',
 '/products/aha-renewal-serum', false, 23),

('alumiermd','acne-balancing-serum','Acne Balancing Serum',
 'Lightweight serum with salicylic acid and botanicals — calms active breakouts while balancing oil production.',
 'Serums',87.00,
 'https://us.alumiermd.com/cdn/shop/files/Acne_Balancing_Serum_Blank.png?v=1719415793&width=533',
 '/products/acne-balancing-serum', false, 24),

('alumiermd','calm-r','Calm-R®',
 'Calming concentrate that reduces redness and soothes reactive skin with anti-inflammatory botanicals.',
 'Serums',137.00,
 'https://us.alumiermd.com/cdn/shop/files/Calm-R.png?v=1718322379&width=533',
 '/products/calm-r', false, 25),

('alumiermd','eventone','EvenTone',
 'Non-hydroquinone brightening serum that targets dark spots, melasma, and uneven pigmentation.',
 'Serums',128.00,
 'https://us.alumiermd.com/cdn/shop/files/EvenTone_eda5a31f-bbf6-419d-9414-2160c0c997de.png?v=1718321626&width=533',
 '/products/eventone', false, 26),

('alumiermd','alumience-a-g-e','Alumience A.G.E.®',
 'Advanced anti-aging serum that neutralizes glycation damage to visibly firm and revitalize mature skin.',
 'Serums',174.00,
 'https://us.alumiermd.com/cdn/shop/files/AlumienceAGE_52bd48df-3586-4f1a-8a62-8c9df3fbd61e.png?v=1719415792&width=533',
 '/products/alumience-a-g-e', false, 27),

('alumiermd','vitamin-rich-smoother','Vitamin Rich Smoother',
 'Nourishing multivitamin serum that hydrates, smooths, and restores radiance to dull, fatigued skin.',
 'Serums',133.00,
 'https://us.alumiermd.com/cdn/shop/files/Vitamin_Rich_Smoother_e615d9e2-4b86-4285-825e-6a050c4e7b27.png?v=1718321265&width=533',
 '/products/vitamin-rich-smoother', false, 28),

-- ── Moisturizers ─────────────────────────────────────────────────────────────
('alumiermd','hydraboost','HydraBoost',
 'Lightweight oil-free gel moisturizer — deeply hydrates oily and combination skin without clogging pores.',
 'Moisturizers',52.00,
 'https://us.alumiermd.com/cdn/shop/files/HydraBoost.png?v=1719415794&width=533',
 '/products/hydraboost', false, 30),

('alumiermd','hydradew','HydraDew',
 'Silky hydrating moisturizer for normal to combination skin — restores suppleness and a healthy glow.',
 'Moisturizers',86.00,
 'https://us.alumiermd.com/cdn/shop/files/HydraDew_e921eadd-536a-44bf-b96c-881aef8ed2e2.png?v=1719415793&width=533',
 '/products/hydradew', false, 31),

('alumiermd','hydralight','HydraLight',
 'Airy, oil-free moisturizer for oily and acne-prone skin — delivers weightless hydration.',
 'Moisturizers',86.00,
 'https://us.alumiermd.com/cdn/shop/files/HydraLight_5b2314a8-2bd3-48a1-8f46-404c714bc0bf.png?v=1719415793&width=533',
 '/products/hydralight', false, 32),

('alumiermd','hydracalm','HydraCalm',
 'Rich, calming moisturizer formulated for sensitive, reactive, or rosacea-prone skin.',
 'Moisturizers',86.00,
 'https://us.alumiermd.com/cdn/shop/files/HydraCalm_d6bd83e1-2be2-4712-9284-3c186026580f.png?v=1719415793&width=533',
 '/products/hydracalm', false, 33),

('alumiermd','hydraclarite','HydraClarité',
 'Balancing moisturizer for blemish-prone skin — clears congestion while maintaining optimal hydration.',
 'Moisturizers',87.00,
 'https://us.alumiermd.com/cdn/shop/files/HydraClarite_8ee83388-d9df-44af-be90-47afd0ec4846.png?v=1718320166&width=533',
 '/products/hydraclarite', false, 34),

('alumiermd','hydrarich','HydraRich',
 'Luxurious, deeply nourishing moisturizer for dry and mature skin — restores barrier and smooths texture.',
 'Moisturizers',103.00,
 'https://us.alumiermd.com/cdn/shop/files/HydraRich_8edb803c-326b-4df2-b483-ccf6effff18e.png?v=1718317287&width=533',
 '/products/hydrarich', false, 35),

('alumiermd','neck-and-decollete-firming-cream','Neck & Décolleté Firming Cream',
 'Targeted firming cream that lifts, smooths, and strengthens the delicate neck and chest area.',
 'Moisturizers',110.00,
 'https://us.alumiermd.com/cdn/shop/files/NeckAndDec.png?v=1719415793&width=533',
 '/products/neck-and-decollete-firming-cream', false, 36),

-- ── Exfoliants ───────────────────────────────────────────────────────────────
('alumiermd','microderm-polish','MicroDerm Polish',
 'At-home microdermabrasion scrub that polishes, brightens, and reveals smoother, more luminous skin.',
 'Exfoliants',76.00,
 'https://us.alumiermd.com/cdn/shop/files/MicroDerm.png?v=1718324505&width=533',
 '/products/microderm-polish', false, 40),

('alumiermd','enzymatic-peel','Enzymatic Peel',
 'Gentle at-home enzyme peel that resurfaces, refines, and restores glow without irritation.',
 'Exfoliants',95.00,
 'https://us.alumiermd.com/cdn/shop/files/EnzymaticPeel.png?v=1718323857&width=533',
 '/products/enzymatic-peel', false, 41),

-- ── Eye & Lip ────────────────────────────────────────────────────────────────
('alumiermd','retinol-eye-gel','Retinol Eye Gel',
 'Targeted retinol eye treatment that smooths fine lines and brightens the delicate under-eye area.',
 'Eye & Lip',110.00,
 'https://us.alumiermd.com/cdn/shop/files/Retinol_Eye_Gel_7500d6b9-a954-4996-bf4f-7c243e5b4bd3.png?v=1718326421&width=533',
 '/products/retinol-eye-gel', false, 50),

('alumiermd','eye-rescue-pads','Eye Rescue Pads',
 'Pre-soaked eye pads that de-puff, hydrate, and revive tired eyes in minutes.',
 'Eye & Lip',55.00,
 'https://us.alumiermd.com/cdn/shop/files/EyeRescuePads.png?v=1709314872&width=533',
 '/products/eye-rescue-pads', false, 51),

('alumiermd','rejuvenating-eye-collection','Rejuvenating Eye Collection',
 'Complete under-eye regimen — pairs AluminEye with Eye Rescue Pads for maximum brightening and firming.',
 'Eye & Lip',212.00,
 'https://us.alumiermd.com/cdn/shop/files/Rejuvenating_Eye_Collection.jpg?v=1774961219&width=533',
 '/products/rejuvenating-eye-collection', false, 52),

-- ── Sunscreen ────────────────────────────────────────────────────────────────
('alumiermd','sheer-hydration-broad-spectrum-suncreen-spf-40-versatile-tint','Sheer Hydration SPF 40 — Versatile Tint',
 'Tinted, weightless sunscreen that blends seamlessly into all skin tones while protecting against UVA/UVB.',
 'Sunscreen',59.00,
 'https://us.alumiermd.com/cdn/shop/files/SheerHydration_Versatile.png?v=1718326564&width=533',
 '/products/sheer-hydration-broad-spectrum-suncreen-spf-40-versatile-tint', false, 60),

('alumiermd','sheer-hydration-broad-spectrum-sunscreen-spf-40','Sheer Hydration SPF 40 — Untinted',
 'Lightweight, transparent broad-spectrum sunscreen that hydrates and protects without leaving a white cast.',
 'Sunscreen',59.00,
 'https://us.alumiermd.com/cdn/shop/files/SheerHydration_Untinted_NA.png?v=1718326786&width=533',
 '/products/sheer-hydration-broad-spectrum-sunscreen-spf-40', false, 61),

('alumiermd','clear-shield-broad-spectrum-sunscreen-spf-42','Clear Shield Broad Spectrum SPF 42',
 'Oil-free, matte-finish sunscreen ideal for oily and acne-prone skin — protects without breakouts.',
 'Sunscreen',59.00,
 'https://us.alumiermd.com/cdn/shop/files/ClearShield_NA.png?v=1718323644&width=533',
 '/products/clear-shield-broad-spectrum-sunscreen-spf-42', false, 62),

('alumiermd','moisture-matte-broad-spectrum-sunscreen-spf-40-sand','Moisture Matte SPF 40 — Sand',
 'Tinted mineral sunscreen with a velvety matte finish — protects and perfects in one step.',
 'Sunscreen',58.00,
 'https://us.alumiermd.com/cdn/shop/files/MM_Sand.png?v=1718324889&width=533',
 '/products/moisture-matte-broad-spectrum-sunscreen-spf-40-sand', false, 63),

('alumiermd','moisture-matte-broad-spectrum-sunscreen-spf-40-ivory','Moisture Matte SPF 40 — Ivory',
 'Tinted mineral sunscreen in a lighter shade — smooths, mattifies, and shields fair skin tones.',
 'Sunscreen',58.00,
 'https://us.alumiermd.com/cdn/shop/files/MM_Ivory.png?v=1718324896&width=533',
 '/products/moisture-matte-broad-spectrum-sunscreen-spf-40-ivory', false, 64),

-- ── Masks & Balms ────────────────────────────────────────────────────────────
('alumiermd','aqua-infusion-mask','Aqua Infusion Mask',
 'Deeply hydrating gel mask that quenches thirsty skin and leaves it visibly plumped and dewy.',
 'Masks',78.00,
 'https://us.alumiermd.com/cdn/shop/files/AquaInfusionMask.png?v=1718322765&width=533',
 '/products/aqua-infusion-mask', false, 70),

('alumiermd','refining-clay-mask','Refining Clay Mask',
 'Purifying kaolin clay mask that detoxifies, refines pores, and clarifies congested skin.',
 'Masks',67.00,
 'https://us.alumiermd.com/cdn/shop/files/RefiningClayMask_bddd5954-8444-49d9-a3ee-480ae53a6609.png?v=1718325855&width=533',
 '/products/refining-clay-mask', false, 71),

('alumiermd','recovery-balm','Recovery Balm',
 'Ultra-nourishing balm that soothes, protects, and accelerates healing after treatments or on compromised skin.',
 'Post Procedure',112.00,
 'https://us.alumiermd.com/cdn/shop/files/RecoveryBalm_032b94dd-aac9-4d70-9c08-d719f9750db1.png?v=1719416117&width=533',
 '/products/recovery-balm', false, 72),

-- ── Kit Collections ──────────────────────────────────────────────────────────
('alumiermd','prep-enhance-rejuvenation','Prep & Enhance — Rejuvenation',
 'Complete prep regimen to optimize skin before and after anti-aging treatments.',
 'Kit Collections',319.00,
 'https://us.alumiermd.com/cdn/shop/files/Prep_and_Enhance_Rejuvenation_NA.jpg?v=1722968628&width=533',
 '/products/prep-enhance-rejuvenation', false, 80),

('alumiermd','prep-enhance-discoloration-non-hq','Prep & Enhance — Discoloration (non-HQ)',
 'Pre/post-treatment kit for targeting hyperpigmentation without hydroquinone.',
 'Kit Collections',319.00,
 'https://us.alumiermd.com/cdn/shop/files/Prep_and_Enhance_Discolouration_WithoutHQ_NA.jpg?v=1722968027&width=533',
 '/products/prep-enhance-discoloration-non-hq', false, 81),

('alumiermd','clarifying-collection','Clarifying Collection',
 'Complete regimen for breakout-prone skin — cleanse, balance, clarify, and protect in one curated kit.',
 'Kit Collections',210.00,
 'https://us.alumiermd.com/cdn/shop/files/Clarifying-NHP_CAN_US.jpg?v=1774534363&width=533',
 '/products/clarifying-collection', false, 82),

('alumiermd','calming-collection','Calming Collection',
 'Curated regimen for sensitive and reactive skin — soothes, strengthens, and restores the skin barrier.',
 'Kit Collections',307.00,
 'https://us.alumiermd.com/cdn/shop/files/Calming-NHP_CAN_US.jpg?v=1774533382&width=533',
 '/products/calming-collection', false, 83),

('alumiermd','rejuvenating-collection-normal-oily','Rejuvenating Collection — Normal/Oily',
 'Anti-aging regimen tailored to normal-to-oily skin — firms, smooths, and restores youthful radiance.',
 'Kit Collections',439.00,
 'https://us.alumiermd.com/cdn/shop/files/RejuvenatingOily-NHP_CAN_US.jpg?v=1774984069&width=533',
 '/products/rejuvenating-collection-normal-oily', false, 84),

('alumiermd','rejuvenating-collection-normal-dry','Rejuvenating Collection — Normal/Dry',
 'Anti-aging regimen tailored to normal-to-dry skin — nourishes, firms, and renews with richer textures.',
 'Kit Collections',439.00,
 'https://us.alumiermd.com/cdn/shop/files/RejuvenatingDry-NHP_CANUS.jpg?v=1774983366&width=533',
 '/products/rejuvenating-collection-normal-dry', false, 85),

('alumiermd','brightening-collection-normal-oily','Brightening Collection — Oily & Combination',
 'Targeted brightening regimen for oily and combination skin — evens tone while balancing oil.',
 'Kit Collections',375.00,
 'https://us.alumiermd.com/cdn/shop/files/BrighteningOily-NHP_CANUS.jpg?v=1774282602&width=533',
 '/products/brightening-collection-normal-oily', false, 86),

('alumiermd','brightening-collection-normal-dry','Brightening Collection — Normal/Dry (non-HQ)',
 'Brightening regimen for normal to dry skin — fades discoloration without hydroquinone.',
 'Kit Collections',375.00,
 'https://us.alumiermd.com/cdn/shop/files/BrighteningDry-NHP_CAN_US.jpg?v=1774901378&width=533',
 '/products/brightening-collection-normal-dry', false, 87);
