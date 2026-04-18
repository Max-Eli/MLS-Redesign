import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { fetchAbandonedCartByToken } from '@/lib/abandoned-carts'
import { CartRecoveryClient } from './CartRecoveryClient'

export const dynamic = 'force-dynamic'

export default async function CartRecoverPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token?.trim()
  if (!token) notFound()

  const cart = await fetchAbandonedCartByToken(token)
  if (!cart) notFound()

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20">
      <Container size="lg">
        <div className="max-w-xl mx-auto text-center">
          <p className="eyebrow mb-3">Welcome Back</p>
          <h1 className="display-md text-dark-50 mb-4">Restoring Your Cart…</h1>
          <p className="text-base text-dark-50/60 leading-relaxed mb-8">
            Hang tight — we're putting everything back exactly where you left it.
          </p>
          <CartRecoveryClient
            items={cart.items}
            firstName={cart.first_name ?? ''}
            lastName={cart.last_name ?? ''}
            email={cart.email}
            phone={cart.phone ?? ''}
          />
        </div>
      </Container>
    </div>
  )
}
