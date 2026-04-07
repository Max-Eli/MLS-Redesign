import { Container } from '@/components/ui/Container'

interface LegalPageProps {
  eyebrow: string
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalPage({ eyebrow, title, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-dark pt-36 pb-16">
        <Container>
          <p className="eyebrow mb-4 text-mauve-300">{eyebrow}</p>
          <h1 className="display-lg text-white max-w-2xl">{title}</h1>
          <p className="mt-4 text-sm text-white/30">Last updated: {lastUpdated}</p>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-luxury p-8 md:p-12 prose-legal">
            {children}
          </div>
        </div>
      </Container>
    </div>
  )
}
