import Link from 'next/link'
import Image from 'next/image'
import { Instagram } from 'lucide-react'
import { Container } from '@/components/ui/Container'

interface IGPost {
  id: string
  mediaUrl: string
  permalink: string
  caption?: string
  prunedCaption?: string
}

async function getInstagramPosts(): Promise<IGPost[]> {
  const feedId = process.env.BEHOLD_FEED_ID
  if (!feedId) return []

  try {
    const res = await fetch(
      `https://feeds.behold.so/${feedId}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    const posts = Array.isArray(data) ? data : (data.posts ?? [])
    return posts.slice(0, 6)
  } catch {
    return []
  }
}

export async function InstagramFeed() {
  const posts = await getInstagramPosts()
  if (!posts.length) return null

  return (
    <section className="section bg-cream overflow-hidden">
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
            className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-dark-50/50 hover:text-mauve transition-colors group flex-shrink-0"
          >
            <Instagram size={14} />
            @manhattanlaserspa
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {posts.map((post, i) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-cream-200 block"
            >
              <Image
                src={post.mediaUrl}
                alt={post.caption ? post.caption.slice(0, 80) : 'Manhattan Laser Spa on Instagram'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={i === 0}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/50 transition-all duration-400 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-3 p-5 text-center">
                  <Instagram size={22} className="text-white" />
                  {(post.prunedCaption || post.caption) && (
                    <p className="text-white text-xs leading-relaxed line-clamp-3 max-w-[180px]">
                      {post.prunedCaption || post.caption}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
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
