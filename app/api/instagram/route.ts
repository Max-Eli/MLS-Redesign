import { NextResponse } from 'next/server'

export const revalidate = 3600 // cache 1 hour

interface IGMedia {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  caption?: string
  timestamp: string
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) {
    return NextResponse.json({ posts: [] })
  }

  try {
    const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp'
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&limit=9&access_token=${token}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      console.error('Instagram API error:', res.status)
      return NextResponse.json({ posts: [] })
    }

    const data = await res.json()
    const posts: IGMedia[] = (data.data ?? []).filter(
      (p: IGMedia) => p.media_type === 'IMAGE' || p.media_type === 'CAROUSEL_ALBUM'
    )

    return NextResponse.json({ posts: posts.slice(0, 6) })
  } catch (err) {
    console.error('Instagram fetch failed:', err)
    return NextResponse.json({ posts: [] })
  }
}
