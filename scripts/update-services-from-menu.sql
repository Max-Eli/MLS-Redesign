-- ─────────────────────────────────────────────────────────────────────────────
-- MLS Services — Full update from menu photos
-- Run in: Supabase → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Clear existing data
delete from services;
delete from service_categories;

-- ── Categories ────────────────────────────────────────────────────────────────
insert into service_categories (name, slug, sort_order) values
('Hair Restoration',            'hair-restoration',            1),
('Laser Skin Treatments',       'laser-skin-treatments',       2),
('Facial Treatments',           'facial-treatments',           3),
('Body Treatments',             'body-treatments',             4),
('Injectables',                 'injectables',                 5),
('IV Wellness Therapy',         'iv-wellness-therapy',         6),
('Hormonal Replacement Therapy','hormonal-replacement-therapy',7),
('Laser Hair Removal',          'laser-hair-removal',          8),
('Memberships',                 'memberships',                 9),
('Promotions',                  'promotions',                  10),
('Gift Cards',                  'gift-cards',                  11);

-- ── Services ──────────────────────────────────────────────────────────────────
insert into services (slug, title, excerpt, category_slug, price, sale_price, duration, badge, is_featured, sort_order) values

-- ─── HAIR RESTORATION ────────────────────────────────────────────────────────
('prp-hair-injections',              'PRP Hair Injections',                        'Platelet-rich plasma injections to stimulate natural hair regrowth. Package of 3: $1,349.',           'hair-restoration', '499',  null,  '60 min',      null,          false, 1),
('microneedling-with-prp-hair',      'Microneedling with PRP',                     'Microneedling combined with PRP for enhanced hair restoration results. Package of 3: $1,349.',         'hair-restoration', '499',  null,  '75 min',      null,          false, 2),
('jetcare-with-prp',                 'JetCare with PRP',                           'Needle-free JetCare scalp treatment combined with platelet-rich plasma. Package of 3: $1,349.',        'hair-restoration', '499',  null,  '60 min',      null,          false, 3),
('microneedling-jetpeel-combo-prp',  'Microneedling + JetPeel Combo with PRP',     'Combined microneedling and JetPeel scalp treatment with PRP for maximum results.',                    'hair-restoration', '599',  null,  '90 min',      null,          false, 4),
('scalp-hair-complex',               'Scalp & Hair Complex',                       'Comprehensive scalp and hair rejuvenation package. Contact us for package pricing.',                  'hair-restoration', '',     null,  null,          null,          false, 5),

-- ─── LASER SKIN TREATMENTS ───────────────────────────────────────────────────
-- Genesis
('laser-genesis',                    'Laser Genesis – Single Session',             'Non-invasive skin rejuvenation with zero downtime. Reduces redness, pores, and fine lines. Package of 6: $1,349.',  'laser-skin-treatments', '199',  null, '30 min',  null, true,  1),
('laser-genesis-6-sessions',         'Laser Genesis – 6 Sessions',                'Best value package of 6 Laser Genesis sessions.',                                                     'laser-skin-treatments', '1349', null, '6 sessions', 'Best Value', false, 2),
('clear-and-brilliant',              'Clear + Brilliant – Single Session',         'Gentle fractional laser for luminous, youthful skin. Package of 3: $1,499.',                         'laser-skin-treatments', '549',  null, '45 min',  null, false, 3),
('clear-and-brilliant-3-sessions',   'Clear + Brilliant – 3 Sessions',            'Package of 3 Clear + Brilliant treatments for lasting radiance.',                                     'laser-skin-treatments', '1499', null, '3 sessions', 'Best Value', false, 4),
-- CO2 Helix
('co2-mild',                         'CO2 Laser – Mild (Face + Neck)',             'Mild fractional CO2 resurfacing for fine lines and texture. Package of 3: $1,500.',                  'laser-skin-treatments', '650',  null, '60 min',  null, false, 5),
('co2-mild-3-sessions',              'CO2 Laser Mild – 3 Sessions',               'Package of 3 mild CO2 laser sessions.',                                                               'laser-skin-treatments', '1500', null, '3 sessions', 'Best Value', false, 6),
('co2-moderate',                     'CO2 Laser – Moderate (Face + Neck)',         'Moderate fractional CO2 for deeper resurfacing and collagen remodeling. Package of 3: $3,000.',      'laser-skin-treatments', '1200', null, '60–75 min', null, false, 7),
('co2-moderate-3-sessions',          'CO2 Laser Moderate – 3 Sessions',           'Package of 3 moderate CO2 laser sessions.',                                                           'laser-skin-treatments', '3000', null, '3 sessions', 'Best Value', false, 8),
('co2-aggressive',                   'CO2 Laser – Aggressive (Face + Neck)',       'Aggressive fractional CO2 for significant skin renewal and deep wrinkle treatment. Package of 3: $4,500.', 'laser-skin-treatments', '1800', null, '75–90 min', null, false, 9),
('co2-aggressive-3-sessions',        'CO2 Laser Aggressive – 3 Sessions',         'Package of 3 aggressive CO2 laser sessions.',                                                         'laser-skin-treatments', '4500', null, '3 sessions', 'Best Value', false, 10),
('co2-eyes-perioral',                'CO2 Laser – Eyes / Perioral',               'Fractional CO2 for the delicate eye and perioral area. Package of 3: $1,500.',                       'laser-skin-treatments', '550',  null, '45 min',  null, false, 11),
('co2-eyes-perioral-3-sessions',     'CO2 Laser Eyes/Perioral – 3 Sessions',      'Package of 3 CO2 eye and perioral treatments.',                                                       'laser-skin-treatments', '1500', null, '3 sessions', 'Best Value', false, 12),
('co2-decollete',                    'CO2 Laser – Décolletté',                    'Fractional CO2 resurfacing for the chest and décolletté. Package of 3: $1,050.',                     'laser-skin-treatments', '399',  null, '45 min',  null, false, 13),
('co2-decollete-3-sessions',         'CO2 Laser Décolletté – 3 Sessions',         'Package of 3 CO2 décolletté treatments.',                                                             'laser-skin-treatments', '1050', null, '3 sessions', 'Best Value', false, 14),
('co2-stretch-marks-scars',          'CO2 Laser – Stretch Marks / Scars',         'Fractional CO2 for stretch marks and scar reduction. Pricing from $250 depending on area.',         'laser-skin-treatments', '250',  null, null,      null, false, 15),
('co2-arms-legs-body',               'CO2 Laser – Arms / Legs / Body',            'Fractional CO2 resurfacing for arms, legs, and body areas. Pricing from $250.',                     'laser-skin-treatments', '250',  null, null,      null, false, 16),
('ktp-iridex',                       'KTP Iridex Series',                         'Targets skin tags, telangiectasias, hemangiomas, lentigo, actinic keratosis, benign pigmented lesions, warts, moles. Starting at $50 depending on size, type, and amount.', 'laser-skin-treatments', '50', null, null, null, false, 17),
-- IPL
('ipl-photofacial',                  'IPL Photofacial (Stellar M22) – Single',    'Intense pulsed light treatment for sun damage, pigmentation, and redness. 3 sessions: $649.',       'laser-skin-treatments', '299',  null, '30–45 min', null, false, 18),
('ipl-photofacial-3-sessions',       'IPL Photofacial – 3 Sessions',              'Package of 3 IPL Photofacial treatments using the Lumenis Stellar M22.',                             'laser-skin-treatments', '649',  null, '3 sessions', null, false, 19),
('ipl-photofacial-6-sessions',       'IPL Photofacial – 6 Sessions',              'Best value package of 6 IPL Photofacial treatments.',                                                 'laser-skin-treatments', '999',  null, '6 sessions', 'Best Value', false, 20),
('smoothglo',                        'SmoothGlo – Single Session',                'Combined IPL + laser treatment for total skin rejuvenation. Package of 3: $1,999.',                  'laser-skin-treatments', '799',  null, '60 min',  null, false, 21),
('smoothglo-3-sessions',             'SmoothGlo – 3 Sessions',                   'Package of 3 SmoothGlo treatments.',                                                                  'laser-skin-treatments', '1999', null, '3 sessions', 'Best Value', false, 22),

-- ─── FACIAL TREATMENTS ───────────────────────────────────────────────────────
('espresso-facial',                  'Espresso Facial (30 min)',                   'Quick and revitalizing facial treatment for an instant glow.',                                       'facial-treatments', '99',   null, '30 min',  null, false, 1),
('manhattan-facial',                 'Manhattan Facial (40 min)',                  'Our signature facial tailored to your skin type and concerns.',                                       'facial-treatments', '149',  null, '40 min',  null, true,  2),
('luxurious-facial',                 'Luxurious Facial (90 min)',                  'An indulgent 90-minute facial experience for deep skin transformation.',                             'facial-treatments', '275',  null, '90 min',  null, false, 3),
('jetpeel-hydration-facial',         'JetPeel & Hydration Facial (40 min)',        'Supersonic jet infusion facial for deep hydration and radiant skin.',                                'facial-treatments', '199',  null, '40 min',  null, false, 4),
('led-therapy',                      'LED Therapy (30 min)',                       'Light therapy for anti-aging, acne, and skin healing.',                                              'facial-treatments', '65',   null, '30 min',  null, false, 5),
('dermaplaning',                     'Dermaplaning',                               'Manual exfoliation to remove dead skin and peach fuzz for silky smooth skin.',                       'facial-treatments', '99',   null, '30 min',  null, false, 6),
('rf-microneedling',                 'RF Microneedling – Single Session',          'Radiofrequency microneedling for skin tightening and deep collagen stimulation. 3 sessions: $1,499.','facial-treatments', '549',  null, '60 min',  null, false, 7),
('rf-microneedling-3-sessions',      'RF Microneedling – 3 Sessions',             'Package of 3 RF Microneedling sessions.',                                                             'facial-treatments', '1499', null, '3 sessions', 'Best Value', false, 8),
('microneedling-facial',             'Microneedling – Single Session',             'Collagen-stimulating microneedling for smoother, firmer skin. 3 sessions: $749.',                   'facial-treatments', '299',  null, '60 min',  null, false, 9),
('microneedling-3-sessions-facial',  'Microneedling – 3 Sessions',               'Package of 3 microneedling sessions.',                                                                'facial-treatments', '749',  null, '3 sessions', 'Best Value', false, 10),
-- Chemical Peels
('prx-t33-peel',                     'PRX-T33 Red Carpet Peel – Single',           'No-downtime chemical peel for tightening and radiance. 4 sessions: $1,000.',                        'facial-treatments', '299',  null, '45 min',  null, false, 11),
('prx-t33-peel-4-sessions',          'PRX-T33 Red Carpet Peel – 4 Sessions',      'Full course of 4 PRX-T33 red carpet peel sessions.',                                                 'facial-treatments', '1000', null, '4 sessions', 'Best Value', false, 12),
('vi-peel',                          'VI Peel (Acne / Anti-aging / Discoloration)','Medical-grade chemical peel for acne, aging, and discoloration. 3 sessions: $649.',                 'facial-treatments', '349',  null, '45 min',  null, false, 13),
('vi-peel-3-sessions',               'VI Peel – 3 Sessions',                      'Package of 3 VI Peel treatments.',                                                                   'facial-treatments', '649',  null, '3 sessions', null, false, 14),
('blue-peel',                        'Blue Peel – Single Session',                 'Deep resurfacing peel for significant skin renewal. 3 sessions: $1,199.',                           'facial-treatments', '449',  null, '60 min',  null, false, 15),
('blue-peel-3-sessions',             'Blue Peel – 3 Sessions',                    'Package of 3 Blue Peel treatments.',                                                                 'facial-treatments', '1199', null, '3 sessions', 'Best Value', false, 16),

-- ─── BODY TREATMENTS ─────────────────────────────────────────────────────────
('coolsculpting-consultation',       'CoolSculpting (Core Cool)',                  'FDA-cleared fat freezing for chin, arms, inner/outer thighs, stomach, love handles, under buttocks, and above knees. Pricing based on consultation.', 'body-treatments', '', null, null, null, true, 1),
('emsculpt-single',                  'EMSculpt – Single Session',                  'Build muscle and burn fat with HIFEM technology. Abdomen, glutes, arms, or calves. 4 sessions: $2,000.', 'body-treatments', '749',  null, '30 min',  null, false, 2),
('emsculpt-4-sessions',              'EMSculpt – 4 Sessions',                     'Recommended package of 4 EMSculpt sessions for optimal results.',                                    'body-treatments', '2000', null, '4 sessions', 'Best Value', true, 3),
('body-contouring-single',           'Body Contouring – Single Session',           'Lower or upper body contouring treatment. 4 sessions: $699.',                                       'body-treatments', '199',  null, '60 min',  null, false, 4),
('body-contouring-4-sessions',       'Body Contouring – 4 Sessions',              'Package of 4 body contouring sessions.',                                                             'body-treatments', '699',  null, '4 sessions', 'Best Value', false, 5),
('massage-60-min',                   'Massage (60 min)',                           'Relaxing full-body massage for stress relief and muscle recovery.',                                  'body-treatments', '99',   null, '60 min',  null, false, 6),
('massage-90-min',                   'Massage (90 min)',                           'Extended full-body massage for deep relaxation and recovery.',                                       'body-treatments', '149',  null, '90 min',  null, false, 7),
('face-neck-decollete-massage',      'Face + Neck / Décolletté Massage (60 min)', 'Rejuvenating massage for face, neck, and décolletté.',                                              'body-treatments', '99',   null, '60 min',  null, false, 8),

-- ─── INJECTABLES ─────────────────────────────────────────────────────────────
('botox-xeomin-per-unit',            'Botox / Xeomin – Per Unit',                  'FDA-approved neuromodulator to smooth fine lines and wrinkles.',                                    'injectables', '13',   null, 'Per unit', null,          true,  1),
('juvederm-per-syringe',             'Juvederm – Per Syringe',                     'Hyaluronic acid filler for volume restoration and contouring.',                                     'injectables', '699',  null, '30–45 min', null,         false, 2),
('radiesse-per-syringe',             'Radiesse – Per Syringe',                     'Calcium hydroxylapatite filler for deep volume and collagen stimulation.',                          'injectables', '649',  null, '30 min',  null,          false, 3),
('sculptra-per-vial',                'Sculptra – Per Vial',                        'Poly-L-lactic acid filler that gradually restores facial volume.',                                  'injectables', '699',  null, '30–45 min', null,         false, 4),
('kybella-per-vial-inj',             'Kybella – Per Vial',                         'FDA-approved injectable to permanently destroy submental fat (double chin).',                       'injectables', '649',  null, '30 min',  null,          false, 5),
('prp-face-lift',                    'PRP Face Lift',                              'Natural facial rejuvenation using your own platelet-rich plasma growth factors.',                   'injectables', '599',  null, '60 min',  null,          false, 6),
('prp-p2-sci',                       'PRP P2 SCI',                                 'Advanced PRP treatment. Package of 3: $1,800.',                                                    'injectables', '600',  null, '60 min',  null,          false, 7),

-- ─── IV WELLNESS THERAPY ─────────────────────────────────────────────────────
('booster-shots',                    'Booster Shots',                              'Quick vitamin and nutrient booster injections for immediate energy and wellness.',                  'iv-wellness-therapy', '100',  null, '15 min',  null, false, 1),
('athletic-recovery-drip',           'Athletic Performance & Recovery Drip',       'IV infusion designed for athletes to boost performance and speed up recovery.',                     'iv-wellness-therapy', '149',  null, '45 min',  null, false, 2),
('hangover-banana-bag',              'Hangover / Banana Bag',                      'Fast-acting IV hydration and vitamins to cure hangover symptoms.',                                  'iv-wellness-therapy', '149',  null, '45 min',  null, false, 3),
('beauty-drip',                      'Beauty Drip',                                'IV infusion packed with biotin, glutathione, and vitamins for glowing skin and hair.',              'iv-wellness-therapy', '149',  null, '45 min',  null, false, 4),
('immune-defense-drip',              'Immune Defense',                             'High-dose Vitamin C and immune-boosting nutrients delivered directly into your bloodstream.',       'iv-wellness-therapy', '149',  null, '45 min',  null, false, 5),
('myers-cocktail',                   'Myers Cocktail',                             'The gold standard IV drip — magnesium, calcium, B vitamins, and Vitamin C.',                       'iv-wellness-therapy', '199',  null, '45 min',  null, false, 6),
('transformation-drip',              'Transformation',                             'Comprehensive IV infusion for total body renewal and cellular health.',                             'iv-wellness-therapy', '249',  null, '60 min',  null, false, 7),
('get-up-go-energy',                 'Get Up & Go Energy',                         'Energy-boosting IV blend with B12, B-complex, and amino acids.',                                   'iv-wellness-therapy', '149',  null, '45 min',  null, false, 8),
('be-lean-drip',                     'Be Lean',                                    'Metabolism-boosting IV drip to support weight management and fat burning.',                         'iv-wellness-therapy', '249',  null, '45 min',  null, false, 9),
('weight-loss-drip',                 'Weight Loss',                                'Medical weight loss IV infusion to support your weight management goals.',                          'iv-wellness-therapy', '299',  null, '60 min',  null, false, 10),
('nad-therapy',                      'NAD Therapy',                                'Nicotinamide adenine dinucleotide IV for cellular repair, energy, and anti-aging.',                 'iv-wellness-therapy', '299',  null, '60–90 min', null, false, 11),
('nad-2-3',                          'NAD 2/3',                                    'Higher dose NAD IV therapy for deeper cellular restoration.',                                       'iv-wellness-therapy', '399',  null, '90–120 min', null, false, 12),
('semaglutide',                      'Semaglutide',                                'FDA-approved GLP-1 weight loss injection. Pricing starts at $499 per session.',                    'iv-wellness-therapy', '499',  null, 'Per injection', null, false, 13),
('trt-aptosis',                      'TRT / Aptosis',                              'Testosterone replacement therapy and hormonal optimization. Pricing from $200.',                   'iv-wellness-therapy', '200',  null, null,       null, false, 14),

-- ─── HORMONAL REPLACEMENT THERAPY ────────────────────────────────────────────
('hrt-consultation',                 'Hormone Replacement Therapy',                'Personalized hormonal replacement therapy programs. Visit manhattanlaserspa.com or call us for pricing and consultation.', 'hormonal-replacement-therapy', '', null, null, null, false, 1),

-- ─── LASER HAIR REMOVAL — SMALL AREAS ($147 single / $399 pkg of 6) ─────────
('lhr-areola',            'LHR – Areola',             'Laser hair removal for areola area. Pkg of 6: $399.',             'laser-hair-removal', '147', null, '1 session', null, false, 101),
('lhr-belly-line-strip',  'LHR – Belly Line Strip',   'Laser hair removal for belly line strip. Pkg of 6: $399.',       'laser-hair-removal', '147', null, '1 session', null, false, 102),
('lhr-cheeks',            'LHR – Cheeks',             'Laser hair removal for cheeks. Pkg of 6: $399.',                 'laser-hair-removal', '147', null, '1 session', null, false, 103),
('lhr-chin',              'LHR – Chin',               'Laser hair removal for chin. Pkg of 6: $399.',                   'laser-hair-removal', '147', null, '1 session', null, false, 104),
('lhr-ears',              'LHR – Ears',               'Laser hair removal for ears. Pkg of 6: $399.',                   'laser-hair-removal', '147', null, '1 session', null, false, 105),
('lhr-feet-toes',         'LHR – Feet & Toes',        'Laser hair removal for feet and toes. Pkg of 6: $399.',          'laser-hair-removal', '147', null, '1 session', null, false, 106),
('lhr-forehead',          'LHR – Forehead',           'Laser hair removal for forehead. Pkg of 6: $399.',               'laser-hair-removal', '147', null, '1 session', null, false, 107),
('lhr-hands-fingers',     'LHR – Hands & Fingers',    'Laser hair removal for hands and fingers. Pkg of 6: $399.',      'laser-hair-removal', '147', null, '1 session', null, false, 108),
('lhr-sideburns',         'LHR – Sideburns',          'Laser hair removal for sideburns. Pkg of 6: $399.',              'laser-hair-removal', '147', null, '1 session', null, false, 109),
('lhr-upper-lip',         'LHR – Upper Lip',          'Laser hair removal for upper lip. Pkg of 6: $399.',              'laser-hair-removal', '147', null, '1 session', null, false, 110),
('lhr-small-area-pkg-6',  'LHR – Small Area (Pkg of 6)','Any small area — 6 laser hair removal sessions.',              'laser-hair-removal', '399', null, '6 sessions', 'Best Value', false, 111),

-- ─── LASER HAIR REMOVAL — MEDIUM AREAS ($189 single / $499 pkg of 6) ────────
('lhr-bikini-line',       'LHR – Bikini Line',        'Laser hair removal for bikini line. Pkg of 6: $499.',            'laser-hair-removal', '189', null, '1 session', null, false, 201),
('lhr-neck',              'LHR – Front or Back of Neck','Laser hair removal for front or back of neck. Pkg of 6: $499.','laser-hair-removal', '189', null, '1 session', null, false, 202),
('lhr-stomach',           'LHR – Stomach',            'Laser hair removal for stomach. Pkg of 6: $499.',               'laser-hair-removal', '189', null, '1 session', null, false, 203),
('lhr-knees',             'LHR – Knees',              'Laser hair removal for knees. Pkg of 6: $499.',                  'laser-hair-removal', '189', null, '1 session', null, false, 204),
('lhr-inner-butt-strip',  'LHR – Inner Butt Strip',   'Laser hair removal for inner butt strip. Pkg of 6: $499.',      'laser-hair-removal', '189', null, '1 session', null, false, 205),
('lhr-medium-area-pkg-6', 'LHR – Medium Area (Pkg of 6)','Any medium area — 6 laser hair removal sessions.',           'laser-hair-removal', '499', null, '6 sessions', 'Best Value', false, 206),

-- ─── LASER HAIR REMOVAL — LARGE AREAS ($249 single / $599 pkg of 6) ─────────
('lhr-brazilian-bikini',  'LHR – Brazilian Bikini',   'Laser hair removal for Brazilian bikini area. Pkg of 6: $599.', 'laser-hair-removal', '249', null, '1 session', null, false, 301),
('lhr-outer-buttocks',    'LHR – Outer Buttocks',     'Laser hair removal for outer buttocks. Pkg of 6: $599.',        'laser-hair-removal', '249', null, '1 session', null, false, 302),
('lhr-chest',             'LHR – Chest',              'Laser hair removal for chest. Pkg of 6: $599.',                 'laser-hair-removal', '249', null, '1 session', null, false, 303),
('lhr-full-face',         'LHR – Full Face',          'Laser hair removal for full face. Pkg of 6: $599.',             'laser-hair-removal', '249', null, '1 session', null, false, 304),
('lhr-lower-back',        'LHR – Lower Back',         'Laser hair removal for lower back. Pkg of 6: $599.',            'laser-hair-removal', '249', null, '1 session', null, false, 305),
('lhr-upper-back',        'LHR – Upper Back',         'Laser hair removal for upper back. Pkg of 6: $599.',            'laser-hair-removal', '249', null, '1 session', null, false, 306),
('lhr-upper-arm',         'LHR – Upper Arm',          'Laser hair removal for upper arm. Pkg of 6: $599.',             'laser-hair-removal', '249', null, '1 session', null, false, 307),
('lhr-lower-arm',         'LHR – Lower Arm',          'Laser hair removal for lower arm. Pkg of 6: $599.',             'laser-hair-removal', '249', null, '1 session', null, false, 308),
('lhr-lower-legs',        'LHR – Lower Legs',         'Laser hair removal for lower legs. Pkg of 6: $599.',            'laser-hair-removal', '249', null, '1 session', null, false, 309),
('lhr-upper-legs',        'LHR – Upper Legs',         'Laser hair removal for upper legs. Pkg of 6: $599.',            'laser-hair-removal', '249', null, '1 session', null, false, 310),
('lhr-large-area-pkg-6',  'LHR – Large Area (Pkg of 6)','Any large area — 6 laser hair removal sessions.',             'laser-hair-removal', '599', null, '6 sessions', 'Best Value', false, 311),

-- ─── LASER HAIR REMOVAL — FULL BODY / HEAD TO TOE ────────────────────────────
('lhr-full-body-single',       'LHR – Full Body (7 Parts) – Single',         'Laser hair removal for any 7 body parts in one session.',                        'laser-hair-removal', '499',  null, '1 session',   null,          true,  401),
('lhr-full-body-6-sessions',   'LHR – Full Body (7 Parts) – 6 Sessions',     'Best value package — any 7 body parts, 6 sessions.',                            'laser-hair-removal', '2499', null, '6 sessions',  'Best Value',  false, 402),
('lhr-head-to-toe-single',     'LHR – Head to Toe – Single',                 'Complete head-to-toe laser hair removal — all body parts in one session.',      'laser-hair-removal', '699',  null, '1 session',   null,          false, 403),
('lhr-head-to-toe-6-sessions', 'LHR – Head to Toe – 6 Sessions',             'Ultimate package — complete head-to-toe laser hair removal, 6 sessions.',       'laser-hair-removal', '2999', null, '6 sessions',  'Best Value',  false, 404),

-- ─── MEMBERSHIPS ─────────────────────────────────────────────────────────────
('membership-info',          'Spa Memberships',           'Ask about our exclusive membership plans for unlimited services and special pricing. Visit our app or call 305-705-3997.', 'memberships', '', null, null, null, false, 1),

-- ─── GIFT CARDS ──────────────────────────────────────────────────────────────
('gift-card-50',   'Gift Card – $50',    'Manhattan Laser Spa gift card. Valid for any treatment or product. Never expires.', 'gift-cards', '50',   null, null, null, false, 1),
('gift-card-100',  'Gift Card – $100',   'Manhattan Laser Spa gift card. Valid for any treatment or product. Never expires.', 'gift-cards', '100',  null, null, null, false, 2),
('gift-card-150',  'Gift Card – $150',   'Manhattan Laser Spa gift card. Valid for any treatment or product. Never expires.', 'gift-cards', '150',  null, null, null, false, 3),
('gift-card-200',  'Gift Card – $200',   'Manhattan Laser Spa gift card. Valid for any treatment or product. Never expires.', 'gift-cards', '200',  null, null, null, false, 4),
('gift-card-250',  'Gift Card – $250',   'Manhattan Laser Spa gift card. Valid for any treatment or product. Never expires.', 'gift-cards', '250',  null, null, null, false, 5),
('gift-card-300',  'Gift Card – $300',   'Manhattan Laser Spa gift card. Valid for any treatment or product. Never expires.', 'gift-cards', '300',  null, null, null, false, 6),
('gift-card-500',  'Gift Card – $500',   'Manhattan Laser Spa gift card. Valid for any treatment or product. Never expires.', 'gift-cards', '500',  null, null, null, false, 7),
('gift-card-1000', 'Gift Card – $1,000', 'Manhattan Laser Spa gift card. Valid for any treatment or product. Never expires.', 'gift-cards', '1000', null, null, null, false, 8);
