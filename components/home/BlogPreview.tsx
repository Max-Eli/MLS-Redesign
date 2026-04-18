import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { fetchBlogPosts, formatBlogDate, stripHtml, type BlogPostRow } from '@/lib/blog'

function BlogCard({ post }: { post: BlogPostRow }) {
  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-500 ease-luxury hover:-translate-y-1">
      <div className="relative h-52 overflow-hidden bg-cream-200 flex-shrink-0">
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-mauve-50 to-cream-200" />
        )}
        {post.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-dark-50 text-2xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-1.5 text-2xs text-dark-50/40 mb-3">
          <Calendar size={11} />
          <time dateTime={post.published_at}>{formatBlogDate(post.published_at)}</time>
        </div>
        <h3 className="font-display text-lg font-light text-dark-50 leading-snug mb-3 group-hover:text-mauve transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-dark-50/60 leading-relaxed line-clamp-3 flex-1 mb-5">
          {post.excerpt ?? stripHtml(post.content).slice(0, 160)}
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
  const { posts } = await fetchBlogPosts({ perPage: 3 })

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
