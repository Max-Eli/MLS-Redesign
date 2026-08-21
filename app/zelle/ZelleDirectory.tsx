'use client'

import { useState } from 'react'
import { Check, Copy, Send } from 'lucide-react'
import { Container } from '@/components/ui/Container'

export interface ZelleProvider {
  name: string
  role?: string
  zelle: string
  /** Exact URL decoded from the provider's bank-issued Zelle QR code — preferred over a generated link. */
  link?: string
}

// Zelle QR-code payload format: tapping this on a phone opens the sender's
// Zelle-enrolled banking app with the recipient pre-filled.
function zelleLink(p: ZelleProvider) {
  if (p.link) return p.link
  const data = btoa(JSON.stringify({ token: p.zelle, name: p.name.toUpperCase(), action: 'payment' }))
  return `https://enroll.zellepay.com/qr-codes?data=${data}`
}

function initials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatRecipient(zelle: string) {
  if (/^\d{10}$/.test(zelle)) return `(${zelle.slice(0, 3)}) ${zelle.slice(3, 6)}-${zelle.slice(6)}`
  return zelle
}

export function ZelleDirectory({ providers }: { providers: ZelleProvider[] }) {
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(zelle: string) {
    try {
      await navigator.clipboard.writeText(zelle)
    } catch {
      // Older browsers / non-secure contexts — fall back to a temp input
      const el = document.createElement('input')
      el.value = zelle
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      el.remove()
    }
    setCopied(zelle)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section className="min-h-[70vh] bg-cream py-16 md:py-24">
      <Container size="md">
        <div className="text-center mb-12">
          <p className="text-2xs tracking-[0.25em] uppercase text-mauve mb-3">Manhattan Laser Spa</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-dark-50 mb-4">
            Pay with <span className="italic">Zelle</span>
          </h1>
          <p className="text-dark-50/60 max-w-xl mx-auto">
            Send payment directly to your provider. On your phone, tap{' '}
            <span className="font-medium text-dark-50">Open in Zelle</span> — or copy their Zelle
            address into your banking app.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {providers.map(p => (
            <div
              key={p.zelle}
              className="bg-white rounded-2xl border border-cream-200 p-6 flex flex-col gap-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 flex-shrink-0 rounded-full bg-gradient-to-br from-mauve-50 to-mauve-100 flex items-center justify-center ring-1 ring-mauve/10">
                  <span className="font-display text-lg text-mauve-700">{initials(p.name)}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xl text-dark-50 leading-tight">{p.name}</p>
                  {p.role && (
                    <p className="text-2xs tracking-widest uppercase text-dark-50/40 mt-0.5">{p.role}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl bg-cream-100 px-4 py-3">
                <span className="text-sm text-dark-50/70 truncate">{formatRecipient(p.zelle)}</span>
                <button
                  onClick={() => copy(p.zelle)}
                  aria-label={`Copy ${p.name}'s Zelle address`}
                  className="flex-shrink-0 flex items-center gap-1.5 text-2xs tracking-widest uppercase text-mauve hover:text-mauve-700 transition-colors"
                >
                  {copied === p.zelle ? <Check size={14} /> : <Copy size={14} />}
                  {copied === p.zelle ? 'Copied' : 'Copy'}
                </button>
              </div>

              <a
                href={zelleLink(p)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-none bg-mauve text-white text-xs font-medium tracking-widest uppercase hover:bg-mauve-600 transition-all duration-300 ease-luxury shadow-sm"
              >
                <Send size={14} />
                Open in Zelle
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-dark-50/40 mt-10">
          On a computer? Open this page on your phone, or copy the Zelle address into your banking
          app. Payments go directly to your provider — please confirm the name matches before
          sending.
        </p>
      </Container>
    </section>
  )
}
