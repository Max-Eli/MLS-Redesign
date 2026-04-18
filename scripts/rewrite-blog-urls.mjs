#!/usr/bin/env node
// Rewrites manhattanlaserspa.com/wp-content/uploads/... URLs in blog_posts
// (both content HTML and featured_image column) to point at the Supabase
// Storage wp-uploads bucket.
//
//   node scripts/rewrite-blog-urls.mjs            # apply updates
//   node scripts/rewrite-blog-urls.mjs --dry-run  # preview only

import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

function loadEnv(p) {
  if (!fs.existsSync(p)) return
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (!m) continue
    if (process.env[m[1]]) continue
    process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
}
loadEnv('.env.local')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — check .env.local')
  process.exit(1)
}

const BUCKET   = 'wp-uploads'
const NEW_BASE = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`
const DRY      = process.argv.includes('--dry-run')

// Matches both absolute (https://[www.]manhattanlaserspa.com/wp-content/uploads/)
// and root-relative (/wp-content/uploads/) URLs
const OLD_PATTERN = /(https?:\/\/(?:www\.)?manhattanlaserspa\.com)?\/wp-content\/uploads\//g

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const { data: posts, error } = await supabase
  .from('blog_posts')
  .select('id, slug, content, featured_image')
if (error) {
  console.error('fetch failed:', error.message)
  process.exit(1)
}
console.log(`Loaded ${posts.length} posts. Rewriting to ${NEW_BASE}/${DRY ? '  [DRY RUN]' : ''}\n`)

let updated = 0, unchanged = 0, failed = 0

for (const p of posts) {
  const newContent = p.content.replace(OLD_PATTERN, `${NEW_BASE}/`)
  const newImage   = p.featured_image
    ? p.featured_image.replace(OLD_PATTERN, `${NEW_BASE}/`)
    : null
  const changed = newContent !== p.content || newImage !== p.featured_image

  if (!changed) { unchanged++; continue }

  if (DRY) {
    console.log(`  [dry] ${p.slug}`)
    updated++
    continue
  }

  const { error } = await supabase
    .from('blog_posts')
    .update({ content: newContent, featured_image: newImage })
    .eq('id', p.id)

  if (error) {
    console.error(`  ✗ ${p.slug}: ${error.message}`)
    failed++
  } else {
    console.log(`  ✓ ${p.slug}`)
    updated++
  }
}

console.log(`\nDone. Updated: ${updated}  Unchanged: ${unchanged}  Failed: ${failed}`)
