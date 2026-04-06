#!/usr/bin/env node
/**
 * MLS WooCommerce → Service CPT Migration Script
 *
 * Pulls all WooCommerce products and creates them as
 * mls_service posts in WordPress.
 *
 * Run: node scripts/migrate-woocommerce.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── Load .env.local ──────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '../.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#\s][^=]*)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
})

const WP_URL      = process.env.WORDPRESS_URL
const WP_USER     = process.env.WP_USERNAME
const WP_PASS     = process.env.WP_APP_PASSWORD
const WC_KEY      = process.env.WC_CONSUMER_KEY
const WC_SECRET   = process.env.WC_CONSUMER_SECRET

if (!WP_URL || !WP_USER || !WP_PASS || !WC_KEY || !WC_SECRET) {
  console.error('❌  Missing credentials in .env.local')
  process.exit(1)
}

const WP_AUTH  = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64')
const WC_AUTH  = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ─── WooCommerce helpers ──────────────────────────────────────────────────────

async function wcGet(endpoint) {
  const res = await fetch(`${WP_URL}/wp-json/wc/v3${endpoint}`, {
    headers: { Authorization: `Basic ${WC_AUTH}` }
  })
  if (!res.ok) throw new Error(`WC ${endpoint} → ${res.status}`)
  return { data: await res.json(), headers: res.headers }
}

async function getAllWCProducts() {
  let page = 1
  let all  = []
  console.log('📦  Fetching WooCommerce products...')
  while (true) {
    const { data, headers } = await wcGet(`/products?per_page=100&page=${page}&status=publish`)
    if (!data.length) break
    all = all.concat(data)
    const totalPages = parseInt(headers.get('x-wp-totalpages') || '1')
    console.log(`    Page ${page}/${totalPages} — ${all.length} products so far`)
    if (page >= totalPages) break
    page++
    await sleep(300)
  }
  console.log(`✅  Fetched ${all.length} WooCommerce products\n`)
  return all
}

async function getAllWCCategories() {
  const { data } = await wcGet('/products/categories?per_page=100')
  return data
}

// ─── WordPress helpers ────────────────────────────────────────────────────────

async function wpGet(endpoint) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2${endpoint}`, {
    headers: { Authorization: `Basic ${WP_AUTH}` }
  })
  if (!res.ok) throw new Error(`WP GET ${endpoint} → ${res.status}`)
  return res.json()
}

async function wpPost(endpoint, body) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${WP_AUTH}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`WP POST ${endpoint} → ${res.status}: ${err}`)
  }
  return res.json()
}

async function getExistingServiceCategories() {
  const cats = await wpGet('/mls_service_cat?per_page=100')
  return cats
}

async function createServiceCategory(name, slug) {
  return wpPost('/mls_service_cat', { name, slug })
}

async function sideloadImage(imageUrl, filename) {
  try {
    const imgRes = await fetch(imageUrl)
    if (!imgRes.ok) return null
    const buffer = await imgRes.arrayBuffer()

    const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${WP_AUTH}`,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': imgRes.headers.get('content-type') || 'image/jpeg',
      },
      body: buffer,
    })
    if (!res.ok) return null
    const media = await res.json()
    return media.id
  } catch {
    return null
  }
}

// ─── Category mapping ─────────────────────────────────────────────────────────

function mapCategoryName(wcCatName) {
  const name = wcCatName.toLowerCase()
  if (name.includes('laser hair'))      return 'Laser Hair Removal'
  if (name.includes('laser'))           return 'Laser Treatments'
  if (name.includes('body') || name.includes('sculpt') || name.includes('contouring')) return 'Body Contouring'
  if (name.includes('inject') || name.includes('botox') || name.includes('filler')) return 'Injectables'
  if (name.includes('skin') || name.includes('facial') || name.includes('peel') || name.includes('hydra')) return 'Skin Care'
  if (name.includes('iv') || name.includes('wellness') || name.includes('vitamin') || name.includes('weight')) return 'Wellness & IV Therapy'
  if (name.includes('member') || name.includes('package') || name.includes('gift')) return 'Memberships & Packages'
  if (name.includes('promo') || name.includes('special') || name.includes('sale')) return 'Promotions'
  return null
}

// ─── Main migration ───────────────────────────────────────────────────────────

async function migrate() {
  console.log('🚀  Starting MLS WooCommerce migration\n')

  // 1. Get all WC products and categories
  const [wcProducts, wcCategories] = await Promise.all([
    getAllWCProducts(),
    getAllWCCategories(),
  ])

  // 2. Get existing service categories from WP
  const existingCats = await getExistingServiceCategories()
  const catMap = {}  // normalizedName → WP term ID

  for (const cat of existingCats) {
    catMap[cat.name.toLowerCase()] = cat.id
  }
  console.log(`📂  Found ${existingCats.length} existing service categories\n`)

  // 3. Build WC category id → mls_service_cat id map
  const wcCatIdToServiceCatId = {}

  for (const wcCat of wcCategories) {
    if (wcCat.name === 'Uncategorized') continue
    const mappedName = mapCategoryName(wcCat.name) || wcCat.name
    const key = mappedName.toLowerCase()

    if (catMap[key]) {
      wcCatIdToServiceCatId[wcCat.id] = catMap[key]
    } else {
      // Create the category if it doesn't exist yet
      try {
        const newCat = await createServiceCategory(mappedName, mappedName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
        catMap[key] = newCat.id
        wcCatIdToServiceCatId[wcCat.id] = newCat.id
        console.log(`  ➕  Created category: ${mappedName}`)
        await sleep(200)
      } catch (e) {
        console.warn(`  ⚠️   Could not create category "${mappedName}": ${e.message}`)
      }
    }
  }

  // 4. Create service posts
  console.log(`\n🔄  Creating ${wcProducts.length} service posts...\n`)

  let created = 0
  let skipped = 0
  let failed  = 0

  for (const product of wcProducts) {
    try {
      // Map categories
      const serviceCatIds = product.categories
        .map(c => wcCatIdToServiceCatId[c.id])
        .filter(Boolean)

      // Create the post (images skipped — add via WP admin later)
      const postBody = {
        title:           product.name,
        content:         product.description || '',
        excerpt:         product.short_description || '',
        status:          'publish',
        mls_service_cat: serviceCatIds,
        meta: {
          mls_price:           product.price || product.regular_price || '',
          mls_sale_price:      product.sale_price || '',
          mls_duration:        '',
          mls_badge:           product.featured ? 'Most Popular' : '',
          mls_is_featured:     product.featured,
          mls_stripe_price_id: '',
        },
      }

      await wpPost('/mls_service', postBody)
      created++
      console.log(`  ✅  [${created}/${wcProducts.length}] ${product.name}`)

    } catch (err) {
      failed++
      console.error(`  ❌  Failed: ${product.name} — ${err.message}`)
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Migration complete
   Created : ${created}
   Failed  : ${failed}
   Total   : ${wcProducts.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)
}

migrate().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
