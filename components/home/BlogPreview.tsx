import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { getPosts, getPostFeaturedImage, getPostCategories, formatDate, stripHtml } from '@/lib/wordpress'
import type { WPPost } from '@/types/wordpress'

function BlogCard({ post }: { post: WPPost }) {
  const image = getPostFeaturedImage(post)
  const categories = getPostCategories(post)

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-500 ease-luxury hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-cream-200 flex-shrink-0">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-mauve-50 to-cream-200" />
        )}
        {categories[0] && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-dark-50 text-2xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
              {categories[0].name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-1.5 text-2xs text-dark-50/40 mb-3">
          <Calendar size={11} />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h3 className="font-display text-lg font-light text-dark-50 leading-snug mb-3 group-hover:text-mauve transition-colors duration-300 line-clamp-2">
          {post.title.rendered}
        </h3>
        <p className="text-sm text-dark-50/60 leading-relaxed line-clamp-3 flex-1 mb-5">
          {stripHtml(post.excerpt.rendered)}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-2xs font-semibold tracking-widest uppercase text-mauve hover:text-mauve-600 transition-colors group/link"
        >
          Read More
          <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}

export async function BlogPreview() {
  const { posts } = await getPosts({ perPage: 3 })

  if (!posts.length) return null

  return (
    <section className="section bg-cream">
      <Container>
        <div className="flex flex-col md:flex-row items-end justify-between mb-14 gap-4">
          <div>
            <p className="eyebrow mb-4">Education & Insights</p>
            <h2 className="display-lg text-dark-50">
              From the
              <em className="not-italic text-mauve"> Blog</em>
            </h2>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-dark-50/50 hover:text-mauve transition-colors group flex-shrink-0"
          >
            All Articles
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  )
}
