#!/usr/bin/env node
/**
 * Adds missing services to WordPress and cleans up promo slugs
 * Run: node scripts/add-missing-services.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8')
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#\s][^=]*)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
})

const WP_URL  = process.env.WORDPRESS_URL
const WP_AUTH = Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APP_PASSWORD}`).toString('base64')

async function wpPost(endpoint, body) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Basic ${WP_AUTH}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${endpoint} → ${res.status}: ${await res.text()}`)
  return res.json()
}

async function wpPatch(endpoint, body) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Basic ${WP_AUTH}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PATCH ${endpoint} → ${res.status}: ${await res.text()}`)
  return res.json()
}

async function wpGet(endpoint) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2${endpoint}`, {
    headers: { Authorization: `Basic ${WP_AUTH}` },
  })
  if (!res.ok) throw new Error(`GET ${endpoint} → ${res.status}`)
  return res.json()
}

async function run() {
  console.log('🚀  Starting...\n')

  // ── 1. Create CO2 Laser service ───────────────────────────────────────────
  console.log('➕  Creating CO2 Laser service...')
  try {
    const co2 = await wpPost('/mls_service', {
      title:           'CO2 Laser Resurfacing',
      slug:            'co2-laser',
      content:         '<p>CO2 Laser Resurfacing is a powerful skin renewal treatment that uses fractional carbon dioxide laser energy to reduce fine lines, wrinkles, acne scars, sun damage, and uneven skin tone. The treatment stimulates collagen production for long-lasting rejuvenation with minimal downtime.</p>',
      excerpt:         'Advanced fractional CO2 laser treatment for skin resurfacing, scar reduction, and collagen stimulation.',
      status:          'publish',
      mls_service_cat: [143],
      meta: {
        mls_price:           '',
        mls_sale_price:      '',
        mls_duration:        '60 min',
        mls_badge:           '',
        mls_is_featured:     false,
        mls_stripe_price_id: '',
      },
    })
    console.log(`  ✅  Created: ${co2.title.rendered} → /product/co2-laser`)
  } catch (e) {
    console.error(`  ❌  ${e.message}`)
  }

  // ── 2. Rename "Black Friday PROMO" services to clean slugs ────────────────
  console.log('\n🔧  Cleaning up promo slugs...')

  const promoFixes = [
    {
      search: 'lpg-endermologie-6-sessions-black-friday-promo',
      newSlug: 'lpg-endermologie',
      newTitle: 'LPG® Endermologie – 6 Sessions',
    },
    {
      search: 'emsculpt-1-session-black-friday-promo',
      newSlug: 'emsculpt-1-session',
      newTitle: 'EMSculpt – 1 Session',
    },
    {
      search: 'endosphere-therapy-6-sessions-black-friday-promo',
      newSlug: 'endosphere-therapy-6-sessions',
      newTitle: 'Endosphere Therapy – 6 Sessions',
    },
    {
      search: 'prp-for-hair-restoration-1-procedure-black-friday-promo',
      newSlug: 'prp-hair-restoration-1-procedure',
      newTitle: 'PRP for Hair Restoration – 1 Procedure',
    },
  ]

  for (const fix of promoFixes) {
    try {
      const results = await wpGet(`/mls_service?slug=${fix.search}&status=publish`)
      if (!results.length) {
        console.log(`  ⚠️  Not found: ${fix.search}`)
        continue
      }
      const post = results[0]
      await wpPatch(`/mls_service/${post.id}`, {
        slug:  fix.newSlug,
        title: fix.newTitle,
      })
      console.log(`  ✅  ${fix.search}`)
      console.log(`      → ${fix.newSlug}`)
    } catch (e) {
      console.error(`  ❌  ${fix.search}: ${e.message}`)
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅  Done')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

run().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
