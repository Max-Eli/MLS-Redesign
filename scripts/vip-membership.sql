-- ─────────────────────────────────────────────────────────────────────────────
-- VIP Membership — $3,999, includes 12 service credits
-- Run in: Supabase → SQL Editor
-- Idempotent: safe to re-run (uses on conflict do update).
-- ─────────────────────────────────────────────────────────────────────────────

-- Ensure the Memberships & Packages category exists (FK target for services)
insert into service_categories (name, slug, sort_order, active) values
  ('Memberships & Packages', 'memberships-packages', 7, true)
on conflict (slug) do update set
  name       = excluded.name,
  sort_order = excluded.sort_order,
  active     = excluded.active;

insert into services (
  slug,
  title,
  excerpt,
  content,
  category_slug,
  price,
  sale_price,
  duration,
  badge,
  is_featured,
  active,
  sort_order,
  image_url
) values (
  'vip-membership',
  'VIP Membership',
  'Our most coveted membership — 12 service credits to redeem on any treatment of your choice, with priority scheduling and members-only perks.',
  $CONTENT$
    <p>
      The <strong>VIP Membership</strong> is designed for clients who want the full
      Manhattan Laser Spa experience — curated, flexible, and entirely yours.
      Twelve credits, redeemable across our full service menu, waiting for you to use
      whenever the moment feels right.
    </p>

    <h2>What's Included</h2>
    <ul>
      <li><strong>12 service credits</strong> — one credit redeems any single eligible treatment</li>
      <li><strong>Priority booking</strong> — skip the wait, reserve your favorite time slots first</li>
      <li><strong>Complimentary consultations</strong> with our licensed specialists</li>
      <li><strong>Members-only pricing</strong> on products and add-on services</li>
      <li><strong>Flexible use</strong> — share a credit with a family member or save for later</li>
      <li><strong>Valid for 12 months</strong> from the date of purchase</li>
    </ul>

    <h2>How It Works</h2>
    <ol>
      <li>Complete your purchase online — we'll confirm by email within 24 hours.</li>
      <li>Our concierge will help you plan your first visit and map out your credits.</li>
      <li>Book any eligible treatment and simply apply a credit — no checkout, no surprise charges.</li>
    </ol>

    <h2>Eligible Treatments</h2>
    <p>
      Credits apply to any single-session treatment on our service menu — including
      injectables, laser treatments, facials, and body contouring sessions. Multi-session
      packages, product retail, and gift cards are not eligible. Our team will walk you
      through the full list when you join.
    </p>

    <h2>Pay Over Time</h2>
    <p>
      Not ready to pay in full? Split the membership into <strong>interest-free monthly
      installments with Affirm or Klarna</strong> at checkout — as low as approximately
      $334/month over 12 months, subject to approval.
    </p>

    <p style="font-size:13px;color:#5a5068;margin-top:24px;">
      <em>Memberships are non-refundable once services begin. Questions? Call us at
      305-705-3997 — we're happy to walk you through the details before you join.</em>
    </p>
  $CONTENT$,
  'memberships-packages',
  '3999',
  null,
  '12 credits · 12 months',
  'VIP',
  true,
  true,
  0,
  '/injectables.png'
)
on conflict (slug) do update set
  title       = excluded.title,
  excerpt     = excluded.excerpt,
  content     = excluded.content,
  category_slug = excluded.category_slug,
  price       = excluded.price,
  sale_price  = excluded.sale_price,
  duration    = excluded.duration,
  badge       = excluded.badge,
  is_featured = excluded.is_featured,
  active      = excluded.active,
  sort_order  = excluded.sort_order,
  image_url   = excluded.image_url;
