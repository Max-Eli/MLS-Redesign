#!/usr/bin/env node
/**
 * MLS Service Cleanup Script
 * Run: node scripts/cleanup-services.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath   = path.join(__dirname, '../.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#\s][^=]*)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
})

const WP_URL  = process.env.WORDPRESS_URL
const WP_USER = process.env.WP_USERNAME
const WP_PASS = process.env.WP_APP_PASSWORD
const WP_AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64')

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ─── Categories to DELETE entirely (services + term) ─────────────────────────
const CATEGORIES_TO_DELETE = [
  'face',
  'services',
  'vampire',
  'o-shot',
  'p-shot',
  'massage',
  'sauna',
  'double-chin-reduction-with-kybella',
  'priapus',
  'lhrlaborday',
  'test',
  'prp-facelift',
  'velashape',
]

// ─── Skin Care: keywords that should be REMOVED ───────────────────────────────
const SKIN_CARE_REMOVE_KEYWORDS = [
  'ipl',
  'carbon laser',
  'clear + brilliant',
  'clear+brilliant',
  'vi peel',
  'vi-peel',
  'chemical peel',
  'laser facial',
]

// ─── Body Contouring: slugs/keywords to KEEP (everything else deleted) ────────
const BODY_CONTOURING_KEEP_KEYWORDS = [
  'coolsculpt',
  'cool sculpt',
  'emsculpt',
  'emscultping',
  'endosphere',
  'lpg',
]

// ─── Injectables: keywords to REMOVE ─────────────────────────────────────────
const INJECTABLES_REMOVE_KEYWORDS = [
  'iv therapy',
  'iv drip',
]

// ─── API helpers ──────────────────────────────────────────────────────────────

async function wpGet(endpoint) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2${endpoint}`, {
    headers: { Authorization: `Basic ${WP_AUTH}` },
  })
  if (!res.ok) throw new Error(`GET ${endpoint} → ${res.status}`)
  return { data: await res.json(), headers: res.headers }
}

async function wpDelete(endpoint) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2${endpoint}`, {
    method: 'DELETE',
    headers: { Authorization: `Basic ${WP_AUTH}` },
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`DELETE ${endpoint} → ${res.status}: ${txt}`)
  }
  return res.json()
}

async function getAllCategories() {
  const { data } = await wpGet('/mls_service_cat?per_page=100')
  return data
}

async function getServicesByCategory(catId) {
  let page = 1, all = []
  while (true) {
    const { data, headers } = await wpGet(
      `/mls_service?mls_service_cat=${catId}&per_page=100&page=${page}&status=publish`
    )
    if (!data.length) break
    all = all.concat(data)
    const totalPages = parseInt(headers.get('x-wp-totalpages') || '1')
    if (page >= totalPages) break
    page++
  }
  return all
}

async function deleteService(id, name) {
  await wpDelete(`/mls_service/${id}?force=true`)
  console.log(`    🗑  Deleted service: ${name}`)
}

async function deleteCategory(id, name) {
  await wpDelete(`/mls_service_cat/${id}?force=true`)
  console.log(`    🗑  Deleted category: ${name}`)
}

function nameMatches(name, keywords) {
  const lower = name.toLowerCase()
  return keywords.some(kw => lower.includes(kw.toLowerCase()))
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function cleanup() {
  console.log('🧹  Starting MLS service cleanup\n')

  const allCats = await getAllCategories()
  const catBySlug = {}
  const catByName = {}
  for (const c of allCats) {
    catBySlug[c.slug.toLowerCase()] = c
    catByName[c.name.toLowerCase()] = c
  }

  let totalDeleted = 0

  // ── 1. Delete entire categories + their services ───────────────────────────
  console.log('━━━  Step 1: Deleting unwanted categories entirely\n')

  for (const slug of CATEGORIES_TO_DELETE) {
    const cat = catBySlug[slug] || catBySlug[slug.replace(/-/g, ' ')] || catByName[slug]
    if (!cat) {
      console.log(`  ⚠️  Category not found: ${slug} (skipping)`)
      continue
    }
    console.log(`  📂  Category: "${cat.name}" (${cat.count} services)`)
    const services = await getServicesByCategory(cat.id)
    for (const s of services) {
      await deleteService(s.id, s.title.rendered)
      totalDeleted++
      await sleep(100)
    }
    try {
      await deleteCategory(cat.id, cat.name)
    } catch (e) {
      console.warn(`  ⚠️  Could not delete category term: ${e.message}`)
    }
    await sleep(200)
  }

  // ── 2. Promotions: delete all services, keep category ─────────────────────
  console.log('\n━━━  Step 2: Clearing all services from Promotions\n')

  const promosCat = catBySlug['promotions'] || catByName['promotions']
  if (promosCat) {
    const services = await getServicesByCategory(promosCat.id)
    console.log(`  📂  Promotions: ${services.length} services`)
    for (const s of services) {
      await deleteService(s.id, s.title.rendered)
      totalDeleted++
      await sleep(100)
    }
  } else {
    console.log('  ⚠️  Promotions category not found')
  }

  // ── 3. Skin Care: remove non-physical-product services ────────────────────
  console.log('\n━━━  Step 3: Cleaning up Skin Care\n')

  const skinCat = catBySlug['skin-care'] || catByName['skin care']
  if (skinCat) {
    const services = await getServicesByCategory(skinCat.id)
    console.log(`  📂  Skin Care: ${services.length} services — checking for treatments to remove`)
    for (const s of services) {
      const name = s.title.rendered.replace(/<[^>]*>/g, '')
      if (nameMatches(name, SKIN_CARE_REMOVE_KEYWORDS)) {
        await deleteService(s.id, name)
        totalDeleted++
        await sleep(100)
      } else {
        console.log(`    ✅  Keeping: ${name}`)
      }
    }
  } else {
    console.log('  ⚠️  Skin Care category not found')
  }

  // ── 4. Body Contouring: keep only specific services ───────────────────────
  console.log('\n━━━  Step 4: Cleaning up Body Contouring\n')

  const bodyCat = catBySlug['body-contouring'] || catByName['body contouring']
  if (bodyCat) {
    const services = await getServicesByCategory(bodyCat.id)
    console.log(`  📂  Body Contouring: ${services.length} services`)
    for (const s of services) {
      const name = s.title.rendered.replace(/<[^>]*>/g, '')
      if (!nameMatches(name, BODY_CONTOURING_KEEP_KEYWORDS)) {
        await deleteService(s.id, name)
        totalDeleted++
        await sleep(100)
      } else {
        console.log(`    ✅  Keeping: ${name}`)
      }
    }
  } else {
    console.log('  ⚠️  Body Contouring category not found')
  }

  // ── 5. Injectables: remove IV therapy ─────────────────────────────────────
  console.log('\n━━━  Step 5: Cleaning up Injectables\n')

  const injectCat = catBySlug['injectables'] || catByName['injectables']
  if (injectCat) {
    const services = await getServicesByCategory(injectCat.id)
    console.log(`  📂  Injectables: ${services.length} services`)
    for (const s of services) {
      const name = s.title.rendered.replace(/<[^>]*>/g, '')
      if (nameMatches(name, INJECTABLES_REMOVE_KEYWORDS)) {
        await deleteService(s.id, name)
        totalDeleted++
        await sleep(100)
      } else {
        console.log(`    ✅  Keeping: ${name}`)
      }
    }
  } else {
    console.log('  ⚠️  Injectables category not found')
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Cleanup complete — ${totalDeleted} services deleted
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)
}

cleanup().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
