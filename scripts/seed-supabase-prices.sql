-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- 1. Create the table
create table if not exists service_prices (
  slug        text primary key,
  price       text not null default '',
  sale_price  text,
  duration    text,
  badge       text,
  active      boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at on changes
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on service_prices;
create trigger set_updated_at
  before update on service_prices
  for each row execute function update_updated_at();

-- Enable RLS and allow read access to anon (public)
alter table service_prices enable row level security;
drop policy if exists "allow public read" on service_prices;
create policy "allow public read" on service_prices
  for select using (true);

-- 2. Seed all prices
insert into service_prices (slug, price, sale_price, duration, badge) values
-- Laser Hair Removal
('botox-1-unit',                                     '13',    null,   'Per unit',         null),
('full-face-botox',                                  '495',   null,   '20–30 min',        null),
('full-body-7-parts-6-sessions',                     '2499',  null,   '6 sessions',       null),
('full-body-head-to-toe-6-sessions',                 '2999',  null,   '6 sessions',       null),
('full-body-7-parts-unlimited-sessions',             '8000',  null,   'Unlimited',        null),
('full-body-head-to-toe-unlimited-sessions',         '12000', null,   'Unlimited',        null),
('full-body-7-parts',                                '',      null,   null,               null),
('full-body-head-to-toe',                            '',      null,   null,               null),
('large-area-6-sessions',                            '599',   null,   '6 sessions',       null),
('large-area-unlimited-sessions',                    '2000',  null,   'Unlimited',        null),
('medium-area-6-sessions',                           '499',   null,   '6 sessions',       null),
('medium-area-unlimited-sessions',                   '1500',  null,   'Unlimited',        null),
('full-legs-1-session',                              '599',   null,   '1 session',        null),
('full-leg-feet-brazilian-6-sessions',               '849',   null,   '6 sessions',       null),
('full-legs-feetbikini-line-6-sessions',             '777',   null,   '6 sessions',       null),
('lower-leg-knee-down-feet',                         '249',   null,   '1 session',        null),
('lower-legs-1-session',                             '249',   null,   '1 session',        null),
('upper-leg-bikini-line-6-sessions',                 '438',   null,   '6 sessions',       null),
('full-arms-1-session',                              '499',   null,   '1 session',        null),
('half-arms-1-session',                              '249',   null,   '1 session',        null),
('full-back-1-session',                              '599',   null,   '1 session',        null),
('half-back-1-session',                              '249',   null,   '1 session',        null),
('full-face-1-session',                              '249',   null,   '1 session',        null),
('underarms-1-session',                              '189',   null,   '1 session',        null),
('bikini-line-1-session',                            '189',   null,   '1 session',        null),
('brazilian-1-session',                              '249',   null,   '1 session',        null),
('buttocks-1-session',                               '249',   null,   '1 session',        null),
('chest-1-session',                                  '249',   null,   '1 session',        null),
('belly-1-session',                                  '189',   null,   '1 session',        null),
('belly-ext-1-session',                              '189',   null,   '1 session',        null),
('full-stomach-1-session',                           '249',   null,   '1 session',        null),
('neck-back-or-front-1-session',                     '149',   null,   '1 session',        null),
('lip-upper-lower-1-session',                        '149',   null,   '1 session',        null),
('forehead-1-session',                               '149',   null,   '1 session',        null),
('jawline-1-session',                                '149',   null,   '1 session',        null),
('sideburns-1-session',                              '149',   null,   '1 session',        null),
('scalp-1-session',                                  '149',   null,   '1 session',        null),
('hairline-1-session',                               '149',   null,   '1 session',        null),
('eyebrow-center-1-session',                         '149',   null,   '1 session',        null),
('nose-1-session',                                   '149',   null,   '1 session',        null),
('ears-1-session',                                   '149',   null,   '1 session',        null),
('feet-1-session',                                   '149',   null,   '1 session',        null),
('toes-1-session',                                   '149',   null,   '1 session',        null),
('fingers-1-session',                                '149',   null,   '1 session',        null),
('hands-1-session',                                  '149',   null,   '1 session',        null),
('knees-1-session',                                  '189',   null,   '1 session',        null),
('happy-trail-1-session',                            '189',   null,   '1 session',        null),
('areola-1-session',                                 '149',   null,   '1 session',        null),
-- Laser Treatments
('laser-genesis-1-session',                          '199',   null,   '30 min',           null),
('laser-genesis-3-sessions',                         '599',   null,   '3 sessions',       null),
('laser-genesis-facial-6-sessions',                  '1199',  null,   '6 sessions',       null),
('laser-skin-tightening-1-session',                  '199',   null,   '45 min',           null),
('sun-spot-age-spot-removal-1-session',              '250',   null,   '1 session',        null),
('sun-spot-age-spot-freckles-removal-3-sessions',    '450',   null,   '3 sessions',       null),
-- Body Contouring
('coolsculpting-large-area-1-session',               '1499',  null,   '35 min/area',      null),
('coolsculpting-small-area-1-session',               '799',   null,   '35 min/area',      null),
('coolsculpting-mini-double-chin-1-session',         '999',   null,   '45 min',           null),
('emsculpt-4-session',                               '2000',  null,   '4 sessions',       'Best Value'),
('emsculpt',                                         '749',   null,   '1 session',        null),
('endosphere-therapy-12-sessions',                   '1549',  null,   '12 sessions',      'Best Value'),
('endosphere-therapy',                               '549',   '549',  '1 session',        null),
('lpg-endermologie',                                 '1194',  null,   '6 sessions',       null),
('lpg-endermologie-one-session',                     '1194',  null,   '1 session',        null),
-- Injectables
('1-syringe-of-juvederm-ultra-plus',                 '649',   null,   '30–45 min',        null),
('1-syringe-of-juvederm-volbella',                   '699',   null,   '30–45 min',        null),
('1-syringe-of-juvederm-voluma',                     '699',   null,   '30–45 min',        null),
('lip-enhancements-1-session',                       '649',   null,   '30–45 min',        null),
('under-eye-fillers-1-session',                      '699',   null,   '30–45 min',        null),
('radiesse-dermal-filler-1-syringe',                 '649',   null,   '30 min',           null),
('radiesse-non-surgical-butt-lift-8-syringes',       '3992',  null,   '60 min',           null),
('kybella-per-vial',                                 '499',   null,   'Per vial',         null),
('kybella',                                          '499',   null,   'Per vial',         null),
('pdo-thread-lift-full-face',                        '',      null,   null,               null),
('pdo-thread-lift-single-area',                      '',      null,   null,               null),
('prp-facelift',                                     '599',   null,   '60 min',           null),
-- Skin Care
('hydrafacial-1-session',                            '249',   null,   '30–45 min',        null),
('hydrafacial-3-sessions',                           '597',   null,   '3 sessions',       null),
('hydrafacial-6-sessions',                           '1194',  null,   '6 sessions',       'Best Value'),
('microneedling-1-session',                          '299',   null,   '60 min',           null),
('microneedling-3-sessions',                         '749',   null,   '3 sessions',       null),
('prp-microneedling-1-session',                      '449',   null,   '75 min',           null),
('prp-microneedling-3-sessions',                     '999',   null,   '3 sessions',       null),
('rf-microneedling-1-session',                       '549',   null,   '60 min',           null),
('rf-microneedling-3-sessions',                      '1499',  null,   '3 sessions',       null),
('jetpeel',                                          '299',   null,   '45 min',           null),
('prx-t33-red-carpet-peel',                          '',      null,   '45 min',           null),
('prx-t33-red-carpet-peel-4-sessions',               '',      null,   '4 sessions',       null),
-- Epicutis
('epicutis-arctigenin-brightening-treatment',        '175',   null,   null,               null),
('epicutis-arctigenin-brightening-treatment-2',      '175',   null,   null,               null),
('epicutis-cleansing-essentials-set',                '105',   null,   null,               null),
('epicutis-cleansing-essentials-set-2',              '105',   null,   null,               null),
('epicutis-hyvia-creme',                             '195',   null,   null,               null),
('epicutis-hyvia-creme-2',                           '195',   null,   null,               null),
('epicutis-lipid-body-treatment',                    '225',   null,   null,               null),
('epicutis-lipid-body-treatment-2',                  '225',   null,   null,               null),
('epicutis-lipid-recovery-mask',                     '125',   null,   null,               null),
('epicutis-lipid-recovery-mask-2',                   '125',   null,   null,               null),
('epicutis-lipid-serum',                             '250',   null,   null,               null),
('epicutis-luxury-skin-care-set',                    '395',   null,   null,               'Best Value'),
('epicutis-luxury-skin-care-set-2',                  '395',   null,   null,               'Best Value'),
('epicutis-oil-cleanser',                            '85',    null,   null,               null),
-- Wellness
('iv-therapy',                                       '149',   null,   '30–45 min',        null),
('iv-therapy-vitamin-infusion-one-cocktail',         '149',   null,   '30–45 min',        null),
('nad-iv-therapy-non-members',                       '',      null,   null,               null),
('prp-for-hair-growth-hair-loss-hair-restoration-3-procedures', '1200', null, '3 procedures', 'Best Value'),
('prp-for-hair-restoration-1-procedure',             '549',   null,   '1 procedure',      null),
('prp-hair-restoration-1-procedure',                 '549',   null,   '1 procedure',      null),
('semaglutide-weight-loss-injection',                '499',   null,   'Per injection',    null),
-- Memberships
('full-body-membership',                             '389',   null,   'Monthly',          'Membership'),
('large-area-membership',                            '109',   null,   'Monthly',          'Membership'),
('medium-area-membership',                           '89',    null,   'Monthly',          'Membership'),
-- Gift Cards
('gift-card-50',                                     '50',    null,   null,               null),
('gift-card-100',                                    '100',   null,   null,               null),
('gift-card-150',                                    '150',   null,   null,               null),
('gift-card-200',                                    '200',   null,   null,               null),
('gift-card-250',                                    '250',   null,   null,               null),
('gift-card-300',                                    '300',   null,   null,               null),
('gift-card-500',                                    '500',   null,   null,               null),
('gift-card-1000',                                   '1000',  null,   null,               null)
on conflict (slug) do update set
  price      = excluded.price,
  sale_price = excluded.sale_price,
  duration   = excluded.duration,
  badge      = excluded.badge,
  active     = excluded.active;
