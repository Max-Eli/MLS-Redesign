import { NextResponse } from 'next/server'

export const revalidate = 3600 // re-fetch every hour

export async function GET() {
  const apiKey  = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    return NextResponse.json({ reviews: [] })
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) return NextResponse.json({ reviews: [] })

    const data = await res.json()
    const reviews = (data.result?.reviews ?? [])
      .filter((r: { rating: number }) => r.rating === 5)
      .map((r: {
        author_name: string
        text: string
        relative_time_description: string
        profile_photo_url?: string
        rating: number
      }) => ({
        name:     r.author_name,
        text:     r.text,
        time:     r.relative_time_description,
        avatar:   r.profile_photo_url ?? null,
        rating:   r.rating,
        source:   'google' as const,
      }))

    return NextResponse.json({
      reviews,
      totalRating:  data.result?.rating ?? null,
      totalReviews: data.result?.user_ratings_total ?? null,
    })
  } catch {
    return NextResponse.json({ reviews: [] })
  }
}
