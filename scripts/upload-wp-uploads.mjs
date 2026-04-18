#!/usr/bin/env node
// Uploads the extracted WP uploads folder to the Supabase 'wp-uploads' bucket,
// preserving the YYYY/MM/filename.ext path structure.
//
// Prereqs: run scripts/wp-uploads-bucket.sql in Supabase, then:
//   node scripts/upload-wp-uploads.mjs            # full run
//   node scripts/upload-wp-uploads.mjs --dry-run  # list files, no uploads
//
// Expects extracted tree at scripts/uploads/

import fs from 'node:fs'
import path from 'node:path'
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
const BUCKET       = 'wp-uploads'
const ROOT         = path.resolve('scripts/uploads')
const CONCURRENCY  = 10
const DRY          = process.argv.includes('--dry-run')

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — check .env.local')
  process.exit(1)
}
if (!fs.existsSync(ROOT)) {
  console.error(`Missing ${ROOT} — extract the WP uploads zip into that folder first`)
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const MIME = {
  '.jpg':  'image/jpeg',  '.jpeg': 'image/jpeg',
  '.png':  'image/png',   '.gif':  'image/gif',
  '.webp': 'image/webp',  '.svg':  'image/svg+xml',
  '.avif': 'image/avif',  '.ico':  'image/x-icon',
  '.heic': 'image/heic',
  '.mp4':  'video/mp4',   '.webm': 'video/webm',
  '.pdf':  'application/pdf',
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.isFile()) out.push(full)
  }
  return out
}

const files = walk(ROOT)
const totalBytes = files.reduce((n, f) => n + fs.statSync(f).size, 0)
console.log(
  `Found ${files.length} files, ${(totalBytes / 1024 / 1024).toFixed(1)} MB total → bucket "${BUCKET}" ` +
  `(${CONCURRENCY} in parallel)${DRY ? '  [DRY RUN]' : ''}\n`
)

let done = 0, skipped = 0, failed = 0
const errors = []

async function uploadOne(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/')
  const ext = path.extname(file).toLowerCase()
  const contentType = MIME[ext] ?? 'application/octet-stream'

  if (DRY) return { ok: true, rel }

  const body = fs.readFileSync(file)
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(rel, body, { contentType, upsert: false, cacheControl: '31536000' })

  if (error) {
    // Treat "already exists" as success so re-runs are idempotent
    const msg = (error.message || '').toLowerCase()
    if (msg.includes('exists') || msg.includes('duplicate') || error.statusCode === '409') {
      return { ok: true, skipped: true, rel }
    }
    return { ok: false, rel, err: error.message }
  }
  return { ok: true, rel }
}

async function pool(items, worker) {
  const queue = items.slice()
  async function next() {
    while (queue.length) {
      const item = queue.shift()
      const r = await worker(item)
      if (r.skipped) skipped++
      else if (r.ok) done++
      else { failed++; errors.push(r) }
      const n = done + skipped + failed
      if (n % 250 === 0 || n === items.length) {
        console.log(`  ${n}/${items.length}  (uploaded ${done}, skipped ${skipped}, failed ${failed})`)
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, next))
}

await pool(files, uploadOne)

console.log(`\nDone. Uploaded: ${done}  Skipped (already existed): ${skipped}  Failed: ${failed}`)
if (errors.length) {
  console.log('\nFirst 10 errors:')
  for (const e of errors.slice(0, 10)) console.log(`  ${e.rel}: ${e.err}`)
  console.log('\nRe-run the script to retry failed uploads (existing objects will be skipped).')
}
