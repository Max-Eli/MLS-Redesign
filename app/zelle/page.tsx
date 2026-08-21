import type { Metadata } from 'next'
import { ZelleDirectory, type ZelleProvider } from './ZelleDirectory'

// Hidden page — reachable only by direct link (share: manhattanlaserspa.com/zelle).
// Not linked in the nav, excluded from the sitemap, and noindexed below.
export const metadata: Metadata = {
  title: 'Pay Your Provider',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

// ─── Edit this list to add/remove providers ─────────────────────────────
// `zelle` is the email or U.S. phone number the provider's Zelle is enrolled with
//   (phone: digits only, e.g. '3055551234') — shown on the card with a Copy button.
// `link` is the exact URL decoded from the provider's bank-issued Zelle QR code;
//   when present it powers the "Open in Zelle" button. `role` is optional.
// Display first names only.
const PROVIDERS: ZelleProvider[] = [
  {
    name: 'Dixiana',
    zelle: '7543298022',
    link: 'https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiRElYSUFOQSIsInRva2VuIjoiNzU0MzI5ODAyMiIsImFjdGlvbiI6InBheW1lbnQifQ==',
  },
  {
    name: 'Mariia',
    zelle: '7288882001',
    link: 'https://enroll.zellepay.com/qr-codes?data=ewogICJ0b2tlbiIgOiAiNzI4ODg4MjAwMSIsCiAgIm5hbWUiIDogIk1BUklJQSIsCiAgImFjdGlvbiIgOiAicGF5bWVudCIKfQ==',
  },
]
// ────────────────────────────────────────────────────────────────────────

export default function ZellePage() {
  return <ZelleDirectory providers={PROVIDERS} />
}
