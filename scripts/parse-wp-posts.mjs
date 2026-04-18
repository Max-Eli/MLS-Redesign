#!/usr/bin/env node
// Parses a phpMyAdmin wp_posts dump and emits clean JSON of published posts.
// Usage: node --max-old-space-size=4096 scripts/parse-wp-posts.mjs <path-to-sql> [out.json]

import fs from 'node:fs'

const INPUT  = process.argv[2] || 'scripts/wp_posts.sql'
const OUTPUT = process.argv[3] || 'scripts/wp-posts.json'

const sql = fs.readFileSync(INPUT, 'utf8')
console.log(`Loaded ${(sql.length / 1024 / 1024).toFixed(1)} MB`)

// ─── Primitive parsers (slice-based; avoids O(n²) string concat) ──────────────

function unescapeMySQL(raw) {
  // Only called on string contents, once
  return raw.replace(/\\(.)/g, (_, n) => {
    switch (n) {
      case 'n':  return '\n'
      case 'r':  return '\r'
      case 't':  return '\t'
      case '0':  return '\0'
      case 'Z':  return '\x1A'
      case "'":  return "'"
      case '"':  return '"'
      case '\\': return '\\'
      default:   return n
    }
  })
}

function parseString(text, i) {
  // text[i] === "'"
  const start = i + 1
  let j = start
  while (j < text.length) {
    const c = text.charCodeAt(j)
    if (c === 92 /* \ */) {
      j += 2
    } else if (c === 39 /* ' */) {
      return [unescapeMySQL(text.slice(start, j)), j + 1]
    } else {
      j++
    }
  }
  throw new Error('unterminated string at ' + start)
}

function parseLiteral(text, i) {
  const start = i
  while (i < text.length) {
    const c = text.charCodeAt(i)
    if (c === 44 /* , */ || c === 41 /* ) */) break
    i++
  }
  const v = text.slice(start, i).trim()
  if (v === 'NULL') return [null, i]
  if (/^-?\d+$/.test(v)) return [Number(v), i]
  if (/^-?\d*\.\d+$/.test(v)) return [parseFloat(v), i]
  return [v, i]
}

function skipWS(text, i) {
  while (i < text.length) {
    const c = text.charCodeAt(i)
    if (c === 32 || c === 9 || c === 10 || c === 13) i++
    else break
  }
  return i
}

function parseValue(text, i) {
  i = skipWS(text, i)
  if (text.charCodeAt(i) === 39) return parseString(text, i)
  return parseLiteral(text, i)
}

function parseTuple(text, i) {
  // text[i] === '('
  i++
  const row = []
  while (i < text.length) {
    const [val, ni] = parseValue(text, i)
    row.push(val)
    i = skipWS(text, ni)
    const c = text.charCodeAt(i)
    if (c === 44) { i++; continue }
    if (c === 41) return [row, i + 1]
    throw new Error(`unexpected char ${text[i]} at ${i} in tuple`)
  }
  throw new Error('unterminated tuple')
}

function parseValues(text, start) {
  const rows = []
  let i = start
  while (i < text.length) {
    i = skipWS(text, i)
    const c = text.charCodeAt(i)
    if (c === 40 /* ( */) {
      const [row, ni] = parseTuple(text, i)
      rows.push(row)
      i = skipWS(text, ni)
      const cc = text.charCodeAt(i)
      if (cc === 44) { i++; continue }
      if (cc === 59 /* ; */) { i++; break }
    } else {
      break
    }
  }
  return [rows, i]
}

// ─── Walk the file ────────────────────────────────────────────────────────────

const HEADER_RE = /INSERT INTO `wp_posts` \(([^)]+)\) VALUES\s*/g

const allRows = []
let m
let stmtCount = 0
while ((m = HEADER_RE.exec(sql)) !== null) {
  stmtCount++
  const cols = m[1].split(',').map(c => c.trim().replace(/`/g, ''))
  const [rows, next] = parseValues(sql, HEADER_RE.lastIndex)
  for (const r of rows) {
    const obj = {}
    for (let j = 0; j < cols.length; j++) obj[cols[j]] = r[j]
    allRows.push(obj)
  }
  HEADER_RE.lastIndex = next
  if (stmtCount % 200 === 0) {
    console.log(`  …parsed ${stmtCount} INSERT statements, ${allRows.length} rows so far`)
  }
}
console.log(`Parsed ${stmtCount} INSERT statements → ${allRows.length} rows\n`)

// ─── Summary by post_type/status ──────────────────────────────────────────────

const byType = {}
for (const r of allRows) {
  const key = `${r.post_type}/${r.post_status}`
  byType[key] = (byType[key] ?? 0) + 1
}
console.log('By post_type/post_status:')
for (const [k, v] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k}: ${v}`)
}

// ─── Extract published blog posts ─────────────────────────────────────────────

const posts = allRows
  .filter(r => r.post_type === 'post' && r.post_status === 'publish')
  .map(r => ({
    id:           r.ID,
    slug:         r.post_name,
    title:        r.post_title,
    content:      r.post_content,
    excerpt:      r.post_excerpt,
    published_at: r.post_date_gmt,
    modified_at:  r.post_modified_gmt,
    guid:         r.guid,
  }))
  .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))

// Attachments (id → url) so later passes can resolve _thumbnail_id → image URL
const attachments = allRows
  .filter(r => r.post_type === 'attachment')
  .map(r => ({ id: r.ID, url: r.guid, parent: r.post_parent, mime: r.post_mime_type }))

fs.writeFileSync(OUTPUT, JSON.stringify({ posts, attachments }, null, 2))

console.log(`\n✓ Published posts: ${posts.length}`)
console.log(`✓ Attachments: ${attachments.length}`)
console.log(`✓ Wrote ${OUTPUT} (${(fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(1)} MB)\n`)

if (posts.length) {
  console.log('Latest 5 posts:')
  for (const p of posts.slice(0, 5)) {
    console.log(`  ${(p.published_at ?? '').slice(0, 10) || '?'}  ${p.title}  (${p.slug})`)
  }
}
