-- Add a sequential, human-friendly order number to order_redemptions.
-- The webhook handler now eagerly creates a redemption row on payment success
-- so each order has a stable MLS-##### reference shown in customer/spa emails
-- and the admin dashboard.
--
-- Postgres assigns a value to every existing row when the column is added,
-- so back-fill happens automatically in insertion order.

alter table order_redemptions
  add column if not exists order_number bigserial;

-- Unique index doubles as the lookup index for admin search by order number.
create unique index if not exists order_redemptions_order_number_unique_idx
  on order_redemptions (order_number);
