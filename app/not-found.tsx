import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center">
      <Container size="sm">
        <div className="text-center py-20">
          <p className="eyebrow mb-4">Page Not Found</p>
          <h1 className="display-lg text-dark-50 mb-4">404</h1>
          <p className="text-base text-dark-50/60 mb-10">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-mauve text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 hover:bg-mauve-600 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-cream-300 text-dark-50/60 hover:text-mauve text-xs font-semibold tracking-widest uppercase px-6 py-3 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
