#!/usr/bin/env node
/**
 * Creates Gift Cards category + products in WordPress
 * Run: node scripts/add-gift-cards.mjs
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

const giftCards = [
  { name: 'Gift Card – $50',   price: '50',  slug: 'gift-card-50'  },
  { name: 'Gift Card – $100',  price: '100', slug: 'gift-card-100' },
  { name: 'Gift Card – $150',  price: '150', slug: 'gift-card-150' },
  { name: 'Gift Card – $200',  price: '200', slug: 'gift-card-200' },
  { name: 'Gift Card – $250',  price: '250', slug: 'gift-card-250' },
  { name: 'Gift Card – $300',  price: '300', slug: 'gift-card-300' },
  { name: 'Gift Card – $500',  price: '500', slug: 'gift-card-500' },
  { name: 'Gift Card – $1000', price: '1000', slug: 'gift-card-1000' },
]

async function run() {
  console.log('🎁  Creating Gift Cards...\n')

  // 1. Create the category
  let catId
  try {
    const cat = await wpPost('/mls_service_cat', {
      name: 'Gift Cards',
      slug: 'gift-cards',
    })
    catId = cat.id
    console.log(`✅  Created category: Gift Cards (id: ${catId})\n`)
  } catch (e) {
    // Might already exist — try to fetch it
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/mls_service_cat?slug=gift-cards`, {
      headers: { Authorization: `Basic ${WP_AUTH}` },
    })
    const data = await res.json()
    if (data[0]) {
      catId = data[0].id
      console.log(`ℹ️   Category already exists (id: ${catId})\n`)
    } else {
      throw e
    }
  }

  // 2. Create gift card products
  for (const card of giftCards) {
    try {
      await wpPost('/mls_service', {
        title:           card.name,
        slug:            card.slug,
        content:         '<p>Manhattan Laser Spa gift cards never expire and can be used toward any treatment or product. The perfect gift for someone special.</p>',
        excerpt:         'Give the gift of beauty. Valid for any treatment or product at Manhattan Laser Spa.',
        status:          'publish',
        mls_service_cat: [catId],
        meta: {
          mls_price:           card.price,
          mls_sale_price:      '',
          mls_duration:        '',
          mls_badge:           '',
          mls_is_featured:     false,
          mls_stripe_price_id: '',
        },
      })
      console.log(`  ✅  ${card.name}`)
    } catch (e) {
      console.error(`  ❌  ${card.name}: ${e.message}`)
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅  Done — Gift Cards created in WordPress')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

run().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
