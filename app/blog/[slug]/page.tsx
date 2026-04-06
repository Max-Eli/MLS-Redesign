import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { CTABanner } from '@/components/home/CTABanner'
import {
  getPostBySlug,
  getAllPostSlugs,
  getPosts,
  getPostFeaturedImage,
  getPostCategories,
  formatDate,
  stripHtml,
} from '@/lib/wordpress'
import { readingTime } from '@/lib/utils'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: 'Post Not Found' }

  const yoast = post.yoast_head_json
  const image = getPostFeaturedImage(post)

  return {
    title: yoast?.title ?? post.title.rendered,
    description: yoast?.description ?? stripHtml(post.excerpt.rendered),
    alternates: { canonical: `https://manhattanlaserspa.com/blog/${post.slug}` },
    openGraph: {
      title: yoast?.og_title ?? post.title.rendered,
      description: yoast?.og_description ?? stripHtml(post.excerpt.rendered),
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      ...(image ? { images: [{ url: image.src, alt: image.alt }] } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const [post, { posts: recentPosts }] = await Promise.all([
    getPostBySlug(params.slug),
    getPosts({ perPage: 3 }),
  ])

  if (!post) notFound()

  const image = getPostFeaturedImage(post)
  const categories = getPostCategories(post)

  return (
    <>
      {/* Article */}
      <article className="min-h-screen bg-cream">
        {/* Hero */}
        <div className="relative bg-dark pt-32 pb-0 overflow-hidden">
          {image && (
            <div className="absolute inset-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover opacity-25"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-dark/60 to-dark" />
            </div>
          )}
          <Container size="md" className="relative z-10 pb-16">
            {/* Back */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-2xs font-medium tracking-widest uppercase text-white/40 hover:text-mauve transition-colors mb-8"
            >
              <ArrowLeft size={12} />
              All Articles
            </Link>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <Badge key={cat.id} variant="mauve">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(post.date)}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {readingTime(stripHtml(post.content.rendered))} min read
              </span>
            </div>
          </Container>
        </div>

        {/* Content */}
        <Container size="md" className="py-16">
          <div
            className="wp-content"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Article footer */}
          <div className="mt-16 pt-8 border-t border-cream-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-dark-50/40 mb-1">
                Location
              </p>
              <p className="text-sm text-dark-50/70">
                Manhattan Laser Spa — Sunny Isles Beach, FL
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-mauve text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 hover:bg-mauve-600 transition-colors"
            >
              Book a Consultation
              <ArrowRight size={14} />
            </Link>
          </div>
        </Container>
      </article>

      {/* Related posts */}
      {recentPosts.filter((p) => p.slug !== params.slug).length > 0 && (
        <section className="bg-white py-16">
          <Container>
            <h2 className="display-sm text-dark-50 mb-10">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts
                .filter((p) => p.slug !== params.slug)
                .slice(0, 3)
                .map((p) => {
                  const img = getPostFeaturedImage(p)
                  return (
                    <Link
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      className="group block bg-cream rounded-2xl overflow-hidden hover:shadow-luxury transition-all duration-300"
                    >
                      <div className="relative h-44 bg-cream-200 overflow-hidden">
                        {img ? (
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-mauve-50 to-cream-200" />
                        )}
                      </div>
                      <div className="p-5">
                        <p className="text-2xs text-dark-50/40 mb-2">{formatDate(p.date)}</p>
                        <h3 className="font-display text-lg font-light text-dark-50 line-clamp-2 group-hover:text-mauve transition-colors">
                          {p.title.rendered}
                        </h3>
                      </div>
                    </Link>
                  )
                })}
            </div>
          </Container>
        </section>
      )}

      <CTABanner />
    </>
  )
}
