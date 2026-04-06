import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { getPosts, getCategories, getPostFeaturedImage, getPostCategories, formatDate, stripHtml } from '@/lib/wordpress'
import { readingTime } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog | Aesthetic Treatments & Skin Care Tips',
  description:
    'Expert insights on laser treatments, body contouring, injectables, and advanced skincare from Manhattan Laser Spa in Sunny Isles Beach, FL.',
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string }
}) {
  const page = parseInt(searchParams.page ?? '1')
  const { posts, total, totalPages } = await getPosts({ page, perPage: 12 })
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-dark pt-32 pb-20">
        <Container>
          <p className="eyebrow mb-4 text-mauve-400">Education & Insights</p>
          <h1 className="display-xl text-white max-w-2xl">
            The Aesthetics Blog
          </h1>
          <p className="mt-6 text-base text-white/50 max-w-xl leading-relaxed">
            Expert guides, treatment insights, and skincare education from our medical team
            in Sunny Isles Beach.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        {/* Featured post */}
        {posts[0] && (() => {
          const featured = posts[0]
          const image = getPostFeaturedImage(featured)
          const cats = getPostCategories(featured)
          return (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block bg-white rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-500 mb-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-72 lg:h-auto min-h-[320px] bg-cream-200">
                  {image && (
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  )}
                  {cats[0] && (
                    <div className="absolute top-5 left-5">
                      <Badge variant="mauve">{cats[0].name}</Badge>
                    </div>
                  )}
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-2xs text-dark-50/40 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDate(featured.date)}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {readingTime(stripHtml(featured.content.rendered))} min read
                    </span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-light text-dark-50 leading-snug mb-4 group-hover:text-mauve transition-colors">
                    {featured.title.rendered}
                  </h2>
                  <p className="text-sm text-dark-50/60 leading-relaxed mb-6 line-clamp-3">
                    {stripHtml(featured.excerpt.rendered)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-mauve group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          )
        })()}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post) => {
            const image = getPostFeaturedImage(post)
            const cats = getPostCategories(post)
            return (
              <article key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-cream-200 overflow-hidden">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-mauve-50 to-cream-200" />
                    )}
                    {cats[0] && (
                      <div className="absolute top-4 left-4">
                        <Badge variant="mauve">{cats[0].name}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-2xs text-dark-50/40 mb-3 flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDate(post.date)}
                    </p>
                    <h3 className="font-display text-xl font-light text-dark-50 leading-snug mb-3 line-clamp-2 group-hover:text-mauve transition-colors">
                      {post.title.rendered}
                    </h3>
                    <p className="text-sm text-dark-50/60 leading-relaxed line-clamp-3">
                      {stripHtml(post.excerpt.rendered)}
                    </p>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}`}
                className="px-5 py-2.5 text-xs font-medium tracking-widest uppercase border border-cream-300 rounded-full text-dark-50/60 hover:text-mauve hover:border-mauve transition-colors"
              >
                Previous
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}`}
                className={`size-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-mauve text-white'
                    : 'text-dark-50/50 hover:text-mauve border border-cream-300 hover:border-mauve'
                }`}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}`}
                className="px-5 py-2.5 text-xs font-medium tracking-widest uppercase border border-cream-300 rounded-full text-dark-50/60 hover:text-mauve hover:border-mauve transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}
