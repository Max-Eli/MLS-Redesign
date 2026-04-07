-- ─────────────────────────────────────────────────────────────────────────────
-- MLS Services — Set image_url from WordPress media library
-- Run in: Supabase → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ── HAIR RESTORATION ─────────────────────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/New-Project-11.jpg'
  where slug = 'prp-hair-injections';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/10/PRP-Microneedling.png'
  where slug = 'microneedling-with-prp-hair';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/07/Chemical-Peels-manhattan-laser-spa-Upper-East-Side-Newyork.jpeg'
  where slug = 'jetcare-with-prp';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/10/PRP-Microneedling.png'
  where slug = 'microneedling-jetpeel-combo-prp';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/PRP-for-hair-growth_hair-loss_hair-restoration-three-procedures-manhattan-laser-spa.jpg'
  where slug = 'scalp-hair-complex';

-- ── LASER SKIN TREATMENTS ────────────────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Laser-FacialsGenesis-One-sessions-manhattan-laser-spa.jpg'
  where slug = 'laser-genesis';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Laser-Genesis-manhattan-laser-spa.jpg'
  where slug = 'laser-genesis-6-sessions';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Clear-Brilliant-Full-Face-manhattan-laser-spa.jpg'
  where slug = 'clear-and-brilliant';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Clear-Brilliant-Three-sessions-manhattan-laser-spa.jpg'
  where slug = 'clear-and-brilliant-3-sessions';

-- CO2 variants — all use the same laser skin tightening image (best match available)
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Laser-Skin-Tightening-manhattan-laser-spa.jpg'
  where slug in ('co2-mild','co2-mild-3-sessions','co2-moderate','co2-moderate-3-sessions',
                 'co2-aggressive','co2-aggressive-3-sessions','co2-decollete','co2-decollete-3-sessions',
                 'co2-stretch-marks-scars','co2-arms-legs-body');
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2025/04/3.jpg'
  where slug in ('co2-eyes-perioral','co2-eyes-perioral-3-sessions');

-- KTP / sun spot
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/New-Project-19.jpg'
  where slug = 'ktp-iridex';

-- IPL
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/The-Lumenis%C2%AE-M22-IPL-manhattan-laser-spa.jpg'
  where slug = 'ipl-photofacial';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/The-Lumenis%C2%AE-M22%E2%84%A2-IPL-Three-sessions-manhattan-laser-spa.jpg'
  where slug = 'ipl-photofacial-3-sessions';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/New-Project-17.jpg'
  where slug = 'ipl-photofacial-6-sessions';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/09/benefits-img-02.jpg'
  where slug in ('smoothglo','smoothglo-3-sessions');

-- ── FACIAL TREATMENTS ────────────────────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2025/12/istockphoto-1077172296-612x612-1.jpg'
  where slug in ('espresso-facial','manhattan-facial','luxurious-facial','led-therapy','dermaplaning');
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/07/Chemical-Peels-manhattan-laser-spa-Upper-East-Side-Newyork.jpeg'
  where slug = 'jetpeel-hydration-facial';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/RF-Microneedling-manhattan-laser-spa.jpg'
  where slug = 'rf-microneedling';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/RF-Microneedling-Three-sessions-manhattan-laser-spa.jpg'
  where slug = 'rf-microneedling-3-sessions';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/10/PRP-Microneedling.png'
  where slug in ('microneedling-facial','microneedling-3-sessions-facial');
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/VI-Peel-manhattan-laser-spa.jpg'
  where slug in ('prx-t33-peel','prx-t33-peel-4-sessions','vi-peel','vi-peel-3-sessions');
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2022/04/Chemical-Peel-For-Acne-Scars-Before-And-After-VI-Peel-lounge-Manhattan-Laser-Spa.jpeg'
  where slug in ('blue-peel','blue-peel-3-sessions');
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Hydrafacial-Six-Sessions-manhattan-laser-spa.jpg'
  where slug not in (
    select slug from services where image_url is not null
  ) and category_slug = 'facial-treatments';

-- ── BODY TREATMENTS ──────────────────────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/10/Coolsculpting.png'
  where slug = 'coolsculpting-consultation';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/07/emsculpt-new-manhattan-laser-spa.jpg'
  where slug in ('emsculpt-single','emsculpt-4-sessions');
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/08/ENDOSPHERE-THERAPY-body-treatment-fl.jpg'
  where slug in ('body-contouring-single','body-contouring-4-sessions');
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/LPG-endermologie-one-session-manhattan-laser-spa.jpeg'
  where slug in ('massage-60-min','massage-90-min','face-neck-decollete-massage');

-- ── INJECTABLES ──────────────────────────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/New-Project-13.jpg'
  where slug = 'botox-xeomin-per-unit';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/One-syringe-of-Juvederm-Ultra-Plus-manhattan-laser-spa.jpg'
  where slug = 'juvederm-per-syringe';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/radiesse-dermal-filler-manhattan-laser-spa.jpg'
  where slug = 'radiesse-per-syringe';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/07/Sculptra-manhattan-laser-spa-Brooklyn-Newyork.jpeg'
  where slug = 'sculptra-per-vial';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/11/Kybella-scaled.jpeg'
  where slug = 'kybella-per-vial-inj';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/PRP-Facelift-manhattan-laser-spa.jpg'
  where slug in ('prp-face-lift','prp-p2-sci');

-- ── IV WELLNESS THERAPY ───────────────────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/IV-therapy-Vitamin-infusion-manhattan-laser-spa.jpg'
  where slug in (
    'booster-shots','athletic-recovery-drip','hangover-banana-bag','beauty-drip',
    'immune-defense-drip','myers-cocktail','transformation-drip','get-up-go-energy',
    'be-lean-drip','weight-loss-drip','nad-therapy','nad-2-3','trt-aptosis'
  );
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2024/09/semaglutidephoto.jpg'
  where slug = 'semaglutide';

-- ── HORMONAL REPLACEMENT THERAPY ─────────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/IV-therapy-Vitamin-infusion-manhattan-laser-spa.jpg'
  where slug = 'hrt-consultation';

-- ── LASER HAIR REMOVAL — SMALL AREAS ─────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/areola-manhattan-laser-spa.jpeg'
  where slug = 'lhr-areola';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/belly-manhattan-laser-spa.jpeg'
  where slug = 'lhr-belly-line-strip';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/New-Project-7.jpg'
  where slug in ('lhr-cheeks','lhr-chin','lhr-full-face');
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Ears-manhattan-laser-spa.jpg'
  where slug = 'lhr-ears';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/toes-manhattan-laser-spa.jpeg'
  where slug = 'lhr-feet-toes';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Forehead-manhattan-laser-spa.jpg'
  where slug = 'lhr-forehead';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/hands-manhattan-laser-spa.jpeg'
  where slug = 'lhr-hands-fingers';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/New-Project-6.jpg'
  where slug = 'lhr-sideburns';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Lip-upper-lower-manhattan-laser-spa.jpg'
  where slug = 'lhr-upper-lip';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Full-bodymanhattan-laser-spa.jpg'
  where slug = 'lhr-small-area-pkg-6';

-- ── LASER HAIR REMOVAL — MEDIUM AREAS ────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/bikini-line-manhattan-laser-spa.jpeg'
  where slug = 'lhr-bikini-line';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Neck-back-or-front-manhattan-laser-spa.jpg'
  where slug = 'lhr-neck';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/full-stomach-manhattan-laser-spa.jpeg'
  where slug = 'lhr-stomach';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/knees-manhattan-laser-spa.jpeg'
  where slug = 'lhr-knees';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/buttocks-manhattan-laser-spa.jpeg'
  where slug in ('lhr-inner-butt-strip','lhr-outer-buttocks');
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Full-bodymanhattan-laser-spa.jpg'
  where slug = 'lhr-medium-area-pkg-6';

-- ── LASER HAIR REMOVAL — LARGE AREAS ─────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/New-Project-3.jpg'
  where slug = 'lhr-brazilian-bikini';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/chest-manhattan-laser-spa.jpeg'
  where slug = 'lhr-chest';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/half-back-manhattan-laser-spa.jpeg'
  where slug = 'lhr-lower-back';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/full-back-manhattan-laser-spa.jpeg'
  where slug = 'lhr-upper-back';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/New-Project-1.jpg'
  where slug = 'lhr-upper-arm';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Full-arms-one-session-manhattan-laser-spa.jpg'
  where slug = 'lhr-lower-arm';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/lower-legs-manhattan-laser-spa.jpeg'
  where slug = 'lhr-lower-legs';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/full-legs-manhattan-laser-spa.jpeg'
  where slug = 'lhr-upper-legs';
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Full-bodymanhattan-laser-spa.jpg'
  where slug = 'lhr-large-area-pkg-6';

-- ── LASER HAIR REMOVAL — FULL BODY ────────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Full-bodymanhattan-laser-spa.jpg'
  where slug in ('lhr-full-body-single','lhr-full-body-6-sessions');
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/Full-body-brazilian-manhattan-laser-spa.jpg'
  where slug in ('lhr-head-to-toe-single','lhr-head-to-toe-6-sessions');

-- ── MEMBERSHIPS ───────────────────────────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2025/05/VIP-Member.png'
  where slug = 'membership-info';

-- ── GIFT CARDS ────────────────────────────────────────────────────────────────
update services set image_url = 'https://manhattanlaserspa.com/wp-content/uploads/2023/06/6.svg'
  where category_slug = 'gift-cards';
