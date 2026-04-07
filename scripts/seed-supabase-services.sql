-- ─────────────────────────────────────────────────────────────────────────────
-- MLS Services + Categories schema for Supabase
-- Run this in: Supabase → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Categories ─────────────────────────────────────────────────────────────

create table if not exists service_categories (
  id          serial primary key,
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table service_categories enable row level security;
drop policy if exists "public read categories" on service_categories;
create policy "public read categories" on service_categories for select using (true);
drop policy if exists "auth write categories" on service_categories;
create policy "auth write categories" on service_categories for all using (auth.role() = 'service_role');

insert into service_categories (name, slug, sort_order) values
  ('Laser Hair Removal',  'laser-hair-removal', 1),
  ('Laser Treatments',    'laser-treatments',   2),
  ('Body Contouring',     'body-contouring',    3),
  ('Injectables',         'injectables',        4),
  ('Skin Care',           'skin-care',          5),
  ('Wellness & IV Therapy','wellness-iv-therapy',6),
  ('Memberships & Packages','memberships-packages',7),
  ('Gift Cards',          'gift-cards',         8)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;


-- ── 2. Services ───────────────────────────────────────────────────────────────

create table if not exists services (
  id              serial primary key,
  slug            text not null unique,
  title           text not null,
  excerpt         text,
  content         text,
  category_slug   text references service_categories(slug) on update cascade,
  price           text not null default '',
  sale_price      text,
  duration        text,
  badge           text,
  is_featured     boolean not null default false,
  stripe_price_id text,
  image_url       text,
  active          boolean not null default true,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists set_updated_at on services;
create trigger set_updated_at before update on services
  for each row execute function update_updated_at();

alter table services enable row level security;
drop policy if exists "public read services" on services;
create policy "public read services" on services for select using (true);
drop policy if exists "auth write services" on services;
create policy "auth write services" on services for all using (auth.role() = 'service_role');

create index if not exists services_category_slug_idx on services(category_slug);
create index if not exists services_active_idx on services(active);
create index if not exists services_featured_idx on services(is_featured);


-- ── 3. Drop old service_prices table (replaced by services) ──────────────────

drop table if exists service_prices;


-- ── 4. Seed all services ──────────────────────────────────────────────────────

insert into services (slug, title, excerpt, category_slug, price, sale_price, duration, badge, is_featured, sort_order) values

-- Laser Hair Removal
('botox-1-unit',                       'Botox – 1 Unit',                              'Professional Botox injections, priced per unit.',                          'laser-hair-removal', '13',    null,   'Per unit',    null,          false, 1),
('full-face-botox',                    'Full Face Botox',                             'Full face Botox treatment for a refreshed, natural look.',                 'injectables',        '495',   null,   '20–30 min',   null,          false, 2),
('full-body-7-parts-6-sessions',       'Full Body (7 Parts) – 6 Sessions',            'Laser hair removal for 7 body parts across 6 sessions.',                  'laser-hair-removal', '2499',  null,   '6 sessions',  'Best Value',  false, 10),
('full-body-head-to-toe-6-sessions',   'Full Body (Head to Toe) – 6 Sessions',        'Complete head-to-toe laser hair removal, 6 sessions.',                    'laser-hair-removal', '2999',  null,   '6 sessions',  'Best Value',  false, 11),
('full-body-7-parts-unlimited-sessions','Full Body (7 Parts) – Unlimited Sessions',   'Unlimited laser hair removal sessions for 7 body parts.',                 'laser-hair-removal', '8000',  null,   'Unlimited',   null,          false, 12),
('full-body-head-to-toe-unlimited-sessions','Full Body (Head to Toe) – Unlimited',    'Unlimited head-to-toe laser hair removal.',                               'laser-hair-removal', '12000', null,   'Unlimited',   null,          false, 13),
('large-area-6-sessions',              'Large Area – 6 Sessions',                     'Laser hair removal for large areas, 6 sessions.',                         'laser-hair-removal', '599',   null,   '6 sessions',  null,          false, 20),
('large-area-unlimited-sessions',      'Large Area – Unlimited Sessions',             'Unlimited laser hair removal for large areas.',                           'laser-hair-removal', '2000',  null,   'Unlimited',   null,          false, 21),
('medium-area-6-sessions',             'Medium Area – 6 Sessions',                    'Laser hair removal for medium areas, 6 sessions.',                        'laser-hair-removal', '499',   null,   '6 sessions',  null,          false, 22),
('medium-area-unlimited-sessions',     'Medium Area – Unlimited Sessions',            'Unlimited laser hair removal for medium areas.',                          'laser-hair-removal', '1500',  null,   'Unlimited',   null,          false, 23),
('full-legs-1-session',                'Full Legs – 1 Session',                       'Laser hair removal for full legs.',                                       'laser-hair-removal', '599',   null,   '1 session',   null,          false, 30),
('full-leg-feet-brazilian-6-sessions', 'Full Leg/Feet/Brazilian – 6 Sessions',        'Full legs, feet, and Brazilian laser hair removal, 6 sessions.',          'laser-hair-removal', '849',   null,   '6 sessions',  'Best Value',  false, 31),
('full-legs-feetbikini-line-6-sessions','Full Legs/Feet + Bikini Line – 6 Sessions',  'Full legs, feet, and bikini line, 6 sessions.',                           'laser-hair-removal', '777',   null,   '6 sessions',  null,          false, 32),
('lower-leg-knee-down-feet',           'Lower Leg (Knee Down)/Feet – 1 Session',      'Laser hair removal from knee down including feet.',                       'laser-hair-removal', '249',   null,   '1 session',   null,          false, 33),
('upper-leg-bikini-line-6-sessions',   'Upper Leg + Bikini Line – 6 Sessions',        'Upper leg and bikini line laser hair removal, 6 sessions.',               'laser-hair-removal', '438',   null,   '6 sessions',  null,          false, 34),
('full-arms-1-session',                'Full Arms – 1 Session',                       'Laser hair removal for full arms.',                                       'laser-hair-removal', '499',   null,   '1 session',   null,          false, 40),
('half-arms-1-session',                'Half Arms – 1 Session',                       'Laser hair removal for half arms.',                                       'laser-hair-removal', '249',   null,   '1 session',   null,          false, 41),
('full-back-1-session',                'Full Back – 1 Session',                       'Laser hair removal for full back.',                                       'laser-hair-removal', '599',   null,   '1 session',   null,          false, 42),
('half-back-1-session',                'Half Back – 1 Session',                       'Laser hair removal for half back.',                                       'laser-hair-removal', '249',   null,   '1 session',   null,          false, 43),
('full-face-1-session',                'Full Face – 1 Session',                       'Laser hair removal for full face.',                                       'laser-hair-removal', '249',   null,   '1 session',   null,          false, 44),
('underarms-1-session',                'Underarms – 1 Session',                       'Laser hair removal for underarms.',                                       'laser-hair-removal', '189',   null,   '1 session',   null,          false, 45),
('bikini-line-1-session',              'Bikini Line – 1 Session',                     'Laser hair removal for bikini line.',                                     'laser-hair-removal', '189',   null,   '1 session',   null,          false, 46),
('brazilian-1-session',                'Brazilian – 1 Session',                       'Laser hair removal for Brazilian area.',                                  'laser-hair-removal', '249',   null,   '1 session',   null,          false, 47),
('buttocks-1-session',                 'Buttocks – 1 Session',                        'Laser hair removal for buttocks.',                                        'laser-hair-removal', '249',   null,   '1 session',   null,          false, 48),
('chest-1-session',                    'Chest – 1 Session',                           'Laser hair removal for chest.',                                           'laser-hair-removal', '249',   null,   '1 session',   null,          false, 49),
('belly-1-session',                    'Belly – 1 Session',                           'Laser hair removal for belly.',                                           'laser-hair-removal', '189',   null,   '1 session',   null,          false, 50),
('full-stomach-1-session',             'Full Stomach – 1 Session',                    'Laser hair removal for full stomach area.',                               'laser-hair-removal', '249',   null,   '1 session',   null,          false, 51),
('neck-back-or-front-1-session',       'Neck (Back or Front) – 1 Session',            'Laser hair removal for neck front or back.',                              'laser-hair-removal', '149',   null,   '1 session',   null,          false, 52),
('lip-upper-lower-1-session',          'Lip (Upper/Lower) – 1 Session',               'Laser hair removal for upper or lower lip.',                              'laser-hair-removal', '149',   null,   '1 session',   null,          false, 53),
('forehead-1-session',                 'Forehead – 1 Session',                        'Laser hair removal for forehead.',                                        'laser-hair-removal', '149',   null,   '1 session',   null,          false, 54),
('jawline-1-session',                  'Jawline – 1 Session',                         'Laser hair removal for jawline.',                                         'laser-hair-removal', '149',   null,   '1 session',   null,          false, 55),
('sideburns-1-session',                'Sideburns – 1 Session',                       'Laser hair removal for sideburns.',                                       'laser-hair-removal', '149',   null,   '1 session',   null,          false, 56),
('scalp-1-session',                    'Scalp – 1 Session',                           'Laser hair removal for scalp.',                                           'laser-hair-removal', '149',   null,   '1 session',   null,          false, 57),
('hairline-1-session',                 'Hairline – 1 Session',                        'Laser hair removal for hairline.',                                        'laser-hair-removal', '149',   null,   '1 session',   null,          false, 58),
('eyebrow-center-1-session',           'Eyebrow Center – 1 Session',                  'Laser hair removal for eyebrow center.',                                  'laser-hair-removal', '149',   null,   '1 session',   null,          false, 59),
('nose-1-session',                     'Nose – 1 Session',                            'Laser hair removal for nose area.',                                       'laser-hair-removal', '149',   null,   '1 session',   null,          false, 60),
('ears-1-session',                     'Ears – 1 Session',                            'Laser hair removal for ears.',                                            'laser-hair-removal', '149',   null,   '1 session',   null,          false, 61),
('feet-1-session',                     'Feet – 1 Session',                            'Laser hair removal for feet.',                                            'laser-hair-removal', '149',   null,   '1 session',   null,          false, 62),
('toes-1-session',                     'Toes – 1 Session',                            'Laser hair removal for toes.',                                            'laser-hair-removal', '149',   null,   '1 session',   null,          false, 63),
('fingers-1-session',                  'Fingers – 1 Session',                         'Laser hair removal for fingers.',                                         'laser-hair-removal', '149',   null,   '1 session',   null,          false, 64),
('hands-1-session',                    'Hands – 1 Session',                           'Laser hair removal for hands.',                                           'laser-hair-removal', '149',   null,   '1 session',   null,          false, 65),
('knees-1-session',                    'Knees – 1 Session',                           'Laser hair removal for knees.',                                           'laser-hair-removal', '189',   null,   '1 session',   null,          false, 66),
('happy-trail-1-session',              'Happy Trail – 1 Session',                     'Laser hair removal for happy trail area.',                                'laser-hair-removal', '189',   null,   '1 session',   null,          false, 67),
('areola-1-session',                   'Areola – 1 Session',                          'Laser hair removal for areola area.',                                     'laser-hair-removal', '149',   null,   '1 session',   null,          false, 68),

-- Laser Treatments
('laser-genesis-1-session',            'Laser Genesis – 1 Session',                   'Non-invasive skin rejuvenation with zero downtime.',                      'laser-treatments',   '199',   null,   '30 min',      null,          false, 1),
('laser-genesis-3-sessions',           'Laser Genesis – 3 Sessions',                  'Save with a package of 3 Laser Genesis sessions.',                        'laser-treatments',   '599',   null,   '3 sessions',  null,          false, 2),
('laser-genesis-facial-6-sessions',    'Laser Genesis/Facial – 6 Sessions',           'Best value package for Laser Genesis treatments.',                        'laser-treatments',   '1199',  null,   '6 sessions',  'Best Value',  false, 3),
('laser-skin-tightening-1-session',    'Laser Skin Tightening – 1 Session',           'Firm and lift skin without surgery or downtime.',                         'laser-treatments',   '199',   null,   '45 min',      null,          false, 4),
('sun-spot-age-spot-removal-1-session','Sun Spot/Age Spot Removal – 1 Session',       'Remove sun spots and age spots with laser precision.',                    'laser-treatments',   '250',   null,   '1 session',   null,          false, 5),
('sun-spot-age-spot-freckles-removal-3-sessions','Sun Spot/Freckles Removal – 3 Sessions','Package of 3 sessions for sun spot and freckle removal.',            'laser-treatments',   '450',   null,   '3 sessions',  null,          false, 6),

-- Body Contouring
('coolsculpting-large-area-1-session', 'CoolSculpting – Large Area',                  'FDA-cleared fat freezing for large areas like abdomen or thighs.',        'body-contouring',    '1499',  null,   '35 min/area', null,          true,  1),
('coolsculpting-small-area-1-session', 'CoolSculpting – Small Area',                  'FDA-cleared fat freezing for small areas.',                               'body-contouring',    '799',   null,   '35 min/area', null,          false, 2),
('coolsculpting-mini-double-chin-1-session','CoolSculpting – Mini/Double Chin',       'Target stubborn double chin with CoolSculpting.',                         'body-contouring',    '999',   null,   '45 min',      null,          false, 3),
('emsculpt-4-session',                 'EMSculpt – 4 Sessions',                       'Build muscle and burn fat with 4 EMSculpt sessions.',                     'body-contouring',    '2000',  null,   '4 sessions',  'Best Value',  true,  4),
('emsculpt',                           'EMSculpt – 1 Session',                        'Single EMSculpt session for muscle building and fat burning.',             'body-contouring',    '749',   null,   '30 min',      null,          false, 5),
('endosphere-therapy-12-sessions',     'Endosphere Therapy – 12 Sessions',            'Full course of Endosphere for body reshaping and cellulite reduction.',    'body-contouring',    '1549',  null,   '12 sessions', 'Best Value',  false, 6),
('endosphere-therapy',                 'Endosphere Therapy – 1 Session',              'Single Endosphere compressive microvibration session.',                   'body-contouring',    '549',   null,   '1 session',   null,          false, 7),
('lpg-endermologie',                   'LPG® Endermologie – 6 Sessions',              'The original FDA-cleared cellulite treatment, 6 sessions.',               'body-contouring',    '1194',  null,   '6 sessions',  null,          false, 8),

-- Injectables
('1-syringe-of-juvederm-ultra-plus',   'Juvederm Ultra Plus – 1 Syringe',             'Restore volume and smooth deep lines with Juvederm Ultra Plus.',          'injectables',        '649',   null,   '30–45 min',   null,          false, 1),
('1-syringe-of-juvederm-volbella',     'Juvederm Volbella – 1 Syringe',               'Subtle lip enhancement and smoothing with Juvederm Volbella.',            'injectables',        '699',   null,   '30–45 min',   null,          false, 2),
('1-syringe-of-juvederm-voluma',       'Juvederm Voluma – 1 Syringe',                 'Restore cheek volume and lift with Juvederm Voluma.',                     'injectables',        '699',   null,   '30–45 min',   null,          false, 3),
('lip-enhancements-1-session',         'Lip Enhancements – 1 Session',                'Plump and define lips with expert filler technique.',                     'injectables',        '649',   null,   '30–45 min',   null,          false, 4),
('under-eye-fillers-1-session',        'Under Eye Fillers – 1 Session',               'Rejuvenate under-eye hollows with dermal filler.',                        'injectables',        '699',   null,   '30–45 min',   null,          false, 5),
('radiesse-dermal-filler-1-syringe',   'Radiesse Dermal Filler – 1 Syringe',          'Stimulate collagen with Radiesse for long-lasting volume.',               'injectables',        '649',   null,   '30 min',      null,          false, 6),
('radiesse-non-surgical-butt-lift-8-syringes','Radiesse Non-Surgical Butt Lift',      'Non-surgical butt lift using 8 syringes of Radiesse.',                   'injectables',        '3992',  null,   '60 min',      null,          false, 7),
('kybella-per-vial',                   'Kybella – Per Vial',                           'Permanently eliminate double chin with Kybella injections.',              'injectables',        '499',   null,   'Per vial',    null,          false, 8),
('pdo-thread-lift-full-face',          'PDO Thread Lift – Full Face',                  'Non-surgical facelift using dissolvable PDO threads.',                   'injectables',        '',      null,   null,          null,          false, 9),
('pdo-thread-lift-single-area',        'PDO Thread Lift – Single Area',                'Targeted lift for a single area using PDO threads.',                     'injectables',        '',      null,   null,          null,          false, 10),
('prp-facelift',                       'PRP Facelift',                                 'Harness your own growth factors to rejuvenate your skin.',                'injectables',        '599',   null,   '60 min',      null,          false, 11),
('prp-microneedling-1-session',        'PRP + Microneedling – 1 Session',              'Boost microneedling results with platelet-rich plasma.',                 'injectables',        '449',   null,   '75 min',      null,          false, 12),
('prp-microneedling-3-sessions',       'PRP + Microneedling – 3 Sessions',             'Package of 3 PRP + Microneedling sessions.',                             'injectables',        '999',   null,   '3 sessions',  'Best Value',  false, 13),

-- Skin Care
('hydrafacial-1-session',              'HydraFacial – 1 Session',                     'Cleanse, extract, and hydrate in one 30-minute treatment.',               'skin-care',          '249',   null,   '30–45 min',   null,          true,  1),
('hydrafacial-3-sessions',             'HydraFacial – 3 Sessions',                    'Package of 3 HydraFacial sessions.',                                      'skin-care',          '597',   null,   '3 sessions',  null,          false, 2),
('hydrafacial-6-sessions',             'HydraFacial – 6 Sessions',                    'Best value HydraFacial package of 6 sessions.',                           'skin-care',          '1194',  null,   '6 sessions',  'Best Value',  false, 3),
('microneedling-1-session',            'Microneedling – 1 Session',                   'Stimulate collagen for smoother, firmer skin.',                           'skin-care',          '299',   null,   '60 min',      null,          false, 4),
('microneedling-3-sessions',           'Microneedling – 3 Sessions',                  'Package of 3 microneedling sessions.',                                    'skin-care',          '749',   null,   '3 sessions',  'Best Value',  false, 5),
('rf-microneedling-1-session',         'RF Microneedling – 1 Session',                'Radiofrequency microneedling for deeper skin tightening.',                'skin-care',          '549',   null,   '60 min',      null,          false, 6),
('rf-microneedling-3-sessions',        'RF Microneedling – 3 Sessions',               'Package of 3 RF microneedling sessions.',                                 'skin-care',          '1499',  null,   '3 sessions',  'Best Value',  false, 7),
('jetpeel',                            'JetPeel',                                      'Supersonic jet infusion — the needle-free facial upgrade.',               'skin-care',          '299',   null,   '45 min',      null,          false, 8),
('prx-t33-red-carpet-peel',            'PRX-T33 Red Carpet Peel',                     'A no-downtime chemical peel with dramatic results.',                      'skin-care',          '',      null,   '45 min',      null,          false, 9),
('prx-t33-red-carpet-peel-4-sessions', 'PRX-T33 Red Carpet Peel – 4 Sessions',        'Full course of 4 PRX-T33 peel sessions.',                                'skin-care',          '',      null,   '4 sessions',  null,          false, 10),
-- Epicutis Products
('epicutis-arctigenin-brightening-treatment','Epicutis – Arctigenin Brightening Treatment','Advanced brightening treatment by Epicutis.',                         'skin-care',          '175',   null,   null,          null,          false, 20),
('epicutis-cleansing-essentials-set',  'Epicutis – Cleansing Essentials Set',          'Complete cleansing set by Epicutis.',                                     'skin-care',          '105',   null,   null,          null,          false, 21),
('epicutis-hyvia-creme',               'Epicutis – Hyvia Crème',                       'Luxurious hydrating crème by Epicutis.',                                  'skin-care',          '195',   null,   null,          null,          false, 22),
('epicutis-lipid-body-treatment',      'Epicutis – Lipid Body Treatment',              'Nourishing lipid body treatment by Epicutis.',                            'skin-care',          '225',   null,   null,          null,          false, 23),
('epicutis-lipid-recovery-mask',       'Epicutis – Lipid Recovery Mask',               'Restorative lipid recovery mask by Epicutis.',                           'skin-care',          '125',   null,   null,          null,          false, 24),
('epicutis-lipid-serum',               'Epicutis – Lipid Serum',                       'Advanced lipid serum for deep nourishment.',                              'skin-care',          '250',   null,   null,          null,          false, 25),
('epicutis-luxury-skin-care-set',      'Epicutis – Luxury Skin Care Set',              'Complete luxury skin care collection by Epicutis.',                       'skin-care',          '395',   null,   null,          'Best Value',  false, 26),
('epicutis-oil-cleanser',              'Epicutis – Oil Cleanser',                       'Gentle oil cleanser by Epicutis.',                                       'skin-care',          '85',    null,   null,          null,          false, 27),

-- Wellness & IV Therapy
('iv-therapy-vitamin-infusion-one-cocktail','IV Therapy – Vitamin Infusion',           'Direct nutrient delivery for energy, immunity, and glow.',               'wellness-iv-therapy','149',   null,   '30–45 min',   null,          false, 1),
('nad-iv-therapy-non-members',         'NAD+ IV Therapy',                             'Premium NAD+ IV therapy for cellular health and energy.',                 'wellness-iv-therapy','',      null,   null,          null,          false, 2),
('prp-hair-restoration-1-procedure',   'PRP Hair Restoration – 1 Procedure',          'Stimulate natural hair regrowth with your own growth factors.',           'wellness-iv-therapy','549',   null,   '60 min',      null,          false, 3),
('prp-for-hair-growth-hair-loss-hair-restoration-3-procedures','PRP Hair Restoration – 3 Procedures','Best value package for PRP hair restoration.',            'wellness-iv-therapy','1200',  null,   '3 procedures','Best Value',  false, 4),
('semaglutide-weight-loss-injection',  'Semaglutide Weight Loss Injection',           'Medically supervised weight loss with semaglutide.',                      'wellness-iv-therapy','499',   null,   'Per injection',null,         false, 5),

-- Memberships
('full-body-membership',               'Full Body Membership',                         'Monthly membership for unlimited full body laser hair removal.',          'memberships-packages','389',  null,   'Monthly',     'Membership',  false, 1),
('large-area-membership',              'Large Area Membership',                        'Monthly membership for large area laser hair removal.',                   'memberships-packages','109',  null,   'Monthly',     'Membership',  false, 2),
('medium-area-membership',             'Medium Area Membership',                       'Monthly membership for medium area laser hair removal.',                  'memberships-packages','89',   null,   'Monthly',     'Membership',  false, 3),

-- Gift Cards
('gift-card-50',   'Gift Card – $50',   'Manhattan Laser Spa gift card, valid for any treatment.', 'gift-cards', '50',   null, null, null, false, 1),
('gift-card-100',  'Gift Card – $100',  'Manhattan Laser Spa gift card, valid for any treatment.', 'gift-cards', '100',  null, null, null, false, 2),
('gift-card-150',  'Gift Card – $150',  'Manhattan Laser Spa gift card, valid for any treatment.', 'gift-cards', '150',  null, null, null, false, 3),
('gift-card-200',  'Gift Card – $200',  'Manhattan Laser Spa gift card, valid for any treatment.', 'gift-cards', '200',  null, null, null, false, 4),
('gift-card-250',  'Gift Card – $250',  'Manhattan Laser Spa gift card, valid for any treatment.', 'gift-cards', '250',  null, null, null, false, 5),
('gift-card-300',  'Gift Card – $300',  'Manhattan Laser Spa gift card, valid for any treatment.', 'gift-cards', '300',  null, null, null, false, 6),
('gift-card-500',  'Gift Card – $500',  'Manhattan Laser Spa gift card, valid for any treatment.', 'gift-cards', '500',  null, null, null, false, 7),
('gift-card-1000', 'Gift Card – $1,000','Manhattan Laser Spa gift card, valid for any treatment.', 'gift-cards', '1000', null, null, null, false, 8)

on conflict (slug) do update set
  title          = excluded.title,
  excerpt        = excluded.excerpt,
  category_slug  = excluded.category_slug,
  price          = excluded.price,
  sale_price     = excluded.sale_price,
  duration       = excluded.duration,
  badge          = excluded.badge,
  is_featured    = excluded.is_featured,
  sort_order     = excluded.sort_order;
