#!/usr/bin/env node
// Imports parsed wp-posts.json into the Supabase blog_posts table.
// Prereqs: run scripts/blog-posts-schema.sql in Supabase, then:
//   node scripts/import-blog-posts.mjs

import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

// Minimal .env.local loader — avoids a dotenv dependency for this one-off script
function loadEnv(path) {
  if (!fs.existsSync(path)) return
  for (const line of fs.readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (!m) continue
    const [, key, rawVal] = m
    if (process.env[key]) continue
    process.env[key] = rawVal.replace(/^['"]|['"]$/g, '')
  }
}
loadEnv('.env.local')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — check .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const { posts } = JSON.parse(fs.readFileSync('scripts/wp-posts.json', 'utf8'))
console.log(`Loaded ${posts.length} posts from wp-posts.json\n`)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function firstImageUrl(html) {
  if (!html) return null
  // Prefer <figure class="wp-block-image"> hero images
  const figure = html.match(/<figure[^>]*wp-block-image[^>]*>[\s\S]*?<img[^>]*\ssrc="([^"]+)"/i)
  if (figure) return figure[1]
  const first = html.match(/<img[^>]*\ssrc="([^"]+)"/i)
  return first ? first[1] : null
}

function stripHtml(html) {
  return (html ?? '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function readingMinutes(html) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function buildExcerpt(excerpt, content) {
  const clean = stripHtml(excerpt || '')
  if (clean.length > 40) return clean.slice(0, 280)
  const fromBody = stripHtml(content).slice(0, 280)
  return fromBody
}

// ─── Transform ───────────────────────────────────────────────────────────────

const rows = posts.map(p => ({
  wp_id:           p.id,
  slug:            p.slug,
  title:           p.title,
  content:         p.content,
  excerpt:         buildExcerpt(p.excerpt, p.content),
  featured_image:  firstImageUrl(p.content),
  reading_minutes: readingMinutes(p.content),
  published_at:    p.published_at,
  modified_at:     p.modified_at,
  active:          true,
}))

const withImages    = rows.filter(r => r.featured_image).length
const withoutImages = rows.length - withImages
console.log(`Featured images extracted: ${withImages}/${rows.length}`)
if (withoutImages) console.log(`No image detected in: ${withoutImages} posts\n`)

// ─── Upsert ──────────────────────────────────────────────────────────────────

const BATCH = 20
let ok = 0
let failed = 0

for (let i = 0; i < rows.length; i += BATCH) {
  const chunk = rows.slice(i, i + BATCH)
  const { error } = await supabase
    .from('blog_posts')
    .upsert(chunk, { onConflict: 'slug' })
  if (error) {
    console.error(`  batch ${i}..${i + chunk.length - 1} FAILED:`, error.message)
    failed += chunk.length
  } else {
    ok += chunk.length
    console.log(`  ✓ upserted ${ok}/${rows.length}`)
  }
}

console.log(`\nDone. Inserted/updated: ${ok}  Failed: ${failed}`)
