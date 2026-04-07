import Image from 'next/image'
import { Instagram, Play } from 'lucide-react'
import { Container } from '@/components/ui/Container'

interface BeholdPost {
  id: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  isReel?: boolean
  mediaUrl: string
  thumbnailUrl?: string
  permalink: string
  caption?: string
  prunedCaption?: string
}

async function getPosts(): Promise<BeholdPost[]> {
  const feedId = process.env.BEHOLD_FEED_ID
  if (!feedId) return []

  try {
    const res = await fetch(`https://feeds.behold.so/${feedId}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    const posts: BeholdPost[] = Array.isArray(data) ? data : (data.posts ?? [])
    return posts.slice(0, 6)
  } catch {
    return []
  }
}

export async function InstagramFeed() {
  const posts = await getPosts()
  if (!posts.length) return null

  return (
    <section className="section bg-white">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow mb-3">Behind the Scenes</p>
            <h2 className="display-md text-dark-50">
              Follow Our{' '}
              <em className="not-italic text-mauve">Journey</em>
            </h2>
          </div>
          <a
            href="https://www.instagram.com/manhattanlaserspa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-dark-50/50 hover:text-mauve transition-colors flex-shrink-0"
          >
            <Instagram size={14} />
            @manhattanlaserspa
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {posts.map((post, i) => {
            // Use thumbnailUrl for videos/reels, mediaUrl for images
            const imgSrc = post.thumbnailUrl ?? post.mediaUrl
            const caption = post.prunedCaption ?? post.caption ?? ''
            const isVideo = post.mediaType === 'VIDEO' || post.isReel

            return (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden bg-cream-200 block"
              >
                <Image
                  src={imgSrc}
                  alt={caption ? caption.slice(0, 100) : 'Manhattan Laser Spa on Instagram'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  priority={i < 3}
                />

                {/* Reel play badge */}
                {isVideo && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                    <Play size={10} className="text-white fill-white" />
                    <span className="text-white text-2xs font-medium">Reel</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/55 transition-all duration-400 flex items-end justify-start p-5">
                  <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Instagram size={18} className="text-white/70 mb-2" />
                    {caption && (
                      <p className="text-white text-xs leading-relaxed line-clamp-3">
                        {caption}
                      </p>
                    )}
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* Follow CTA */}
        <div className="mt-8 flex justify-center">
          <a
            href="https://www.instagram.com/manhattanlaserspa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full border border-dark-50/15 hover:border-mauve hover:text-mauve text-sm font-medium text-dark-50/60 tracking-wide transition-colors"
          >
            <Instagram size={15} />
            Follow on Instagram
          </a>
        </div>
      </Container>
    </section>
  )
}
