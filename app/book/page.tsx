import type { Metadata } from 'next'
import { PORTAL_LOGIN_URL } from '@/lib/lume'
import { BookingFlow } from './BookingFlow'

export const metadata: Metadata = {
  title: 'Book a Consultation | Manhattan Laser Spa',
  description:
    'Book a complimentary consultation at Manhattan Laser Spa in Sunny Isles Beach. Real-time availability for injectables, skin analysis, laser hair removal, and body contouring consults.',
  alternates: { canonical: 'https://manhattanlaserspa.com/book' },
}

export default function BookPage() {
  return <BookingFlow portalLoginUrl={PORTAL_LOGIN_URL} />
}
