import type { Metadata } from 'next'
import { Calendar, Clock, MapPin, Music, Gift, Sparkles, Ticket, CalendarPlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { RsvpForm } from '@/components/anniversary/RsvpForm'

const EVENT = {
  date:      'Friday, August 7, 2026',
  time:      '6:00 PM – 10:00 PM',
  address1:  '16850 Collins Ave, Suite 105',
  address2:  'Sunny Isles Beach, FL',
  instagram: 'manhattanlaserspa_sunnyisles',
  phone:     '305-705-3997',
  phoneRaw:  '+13057053997',
}

const HIGHLIGHTS = [
  { icon: Music,    label: 'Live Music' },
  { icon: Sparkles, label: 'Champagne' },
  { icon: Ticket,   label: 'Raffles' },
  { icon: Gift,     label: 'Goodie Bags' },
]

export const metadata: Metadata = {
  title:       'You\'re Invited: 4 Year Anniversary Celebration | Manhattan Laser Spa',
  description: `Join Manhattan Laser Spa for our 4 year anniversary — ${EVENT.date}. Live music, champagne, raffles, goodie bags, and 30% off the entire menu for one night only.`,
  // Private event page — kept out of search index and sitemap.
  robots:      { index: false, follow: false },
  alternates:  { canonical: 'https://manhattanlaserspa.com/anniversary' },
  openGraph: {
    title:       'You\'re Invited: 4 Year Anniversary at Manhattan Laser Spa',
    description: `${EVENT.date}. Live music, champagne, raffles, and 30% off the entire menu for one night only.`,
    type:        'website',
  },
}

export default function AnniversaryPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-dark pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        {/* decorative glows */}
        <div className="absolute top-1/3 -right-24 size-72 rounded-full bg-mauve/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-16 size-64 rounded-full bg-gold/12 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

        <Container className="relative">
          <div className="max-w-xl mx-auto text-center">
            <p className="eyebrow text-gold-400 mb-4">You&apos;re Invited</p>

            <span className="block font-display font-light leading-none text-white text-[5rem] sm:text-[6.5rem] md:text-[8rem]">
              4
            </span>

            <p className="mt-3 md:mt-4 text-[0.7rem] md:text-xs font-medium tracking-[0.28em] uppercase text-white/50">
              Years of Manhattan Laser Spa
            </p>

            <div className="w-10 h-px bg-gold-400 mx-auto my-7 md:my-8" />

            <h1 className="font-display text-3xl md:text-4xl font-light text-white/95 leading-tight">
              An <span className="italic text-mauve-300">Evening</span> to Celebrate
            </h1>

            <p className="mt-4 md:mt-5 text-sm md:text-[0.95rem] text-white/50 leading-relaxed max-w-md mx-auto">
              Join us for a private evening celebrating four transformative years in Sunny Isles Beach.
            </p>

            <a
              href="#rsvp"
              className="mt-7 md:mt-8 inline-flex items-center justify-center rounded-full bg-mauve hover:bg-mauve-600 px-8 py-3.5 text-xs font-semibold tracking-widest uppercase text-white transition-colors"
            >
              Reserve Your Spot
            </a>
          </div>
        </Container>
      </section>

      {/* ── 30% OFF — the headline offer, above the details ─────────────── */}
      <section className="relative -mt-14 md:-mt-20 pb-14 md:pb-20">
        <Container size="md">
          <div className="relative bg-dark rounded-3xl overflow-hidden mx-2 sm:mx-0 px-6 py-10 sm:px-8 sm:py-12 md:px-14 md:py-14 text-center">
            <div className="absolute -top-16 -right-12 size-56 rounded-full bg-mauve/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-8 size-48 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

            <p className="eyebrow text-gold-400 mb-4">One Night Only</p>

            <p className="font-display text-6xl sm:text-7xl md:text-[7rem] font-light leading-none text-white">
              30<span className="text-gold-400">%</span>
              <span className="align-top text-2xl md:text-3xl tracking-widest ml-2 md:ml-3">OFF</span>
            </p>

            <div className="w-10 h-px bg-gold-400 mx-auto my-6" />

            <p className="text-sm md:text-[0.95rem] text-white/70 leading-relaxed max-w-sm mx-auto">
              The entire menu is 30% off — every treatment, package, and service — bookable at the event.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Event details card ──────────────────────────────────────────── */}
      <section className="pb-14 md:pb-20">
        <Container size="md">
          <div className="relative bg-white rounded-3xl shadow-luxury-lg p-6 sm:p-8 md:p-12 mx-2 sm:mx-0">
            <div className="text-center mb-8 md:mb-10">
              <p className="eyebrow text-mauve-600 mb-3">The Details</p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-dark-50">
                Save the <span className="italic text-mauve">Date</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              <DetailItem icon={Calendar} label="Date"     value={EVENT.date} />
              <DetailItem icon={Clock}    label="Time"     value={EVENT.time} />
              <DetailItem icon={MapPin}   label="Location" value={<>
                {EVENT.address1}<br />
                {EVENT.address2}
              </>} />
            </div>

            <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-cream-200">
              <p className="eyebrow text-mauve-600 mb-4 text-center">The Evening</p>
              <div className="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-5 gap-y-3">
                {HIGHLIGHTS.map(({ icon: Icon, label }, i) => (
                  <div key={label} className="flex items-center gap-2 md:gap-2.5">
                    <Icon size={13} className="text-mauve md:size-4" strokeWidth={1.75} />
                    <span className="text-sm md:text-[0.95rem] text-dark-50/80 tracking-wide">
                      {label}
                    </span>
                    {i < HIGHLIGHTS.length - 1 && (
                      <span className="hidden sm:inline text-gold-400/60 ml-3 md:ml-5">◆</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 md:mt-8 text-center">
              <a
                href="/api/calendar/anniversary.ics"
                download
                className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-300 hover:border-mauve/50 bg-cream-50 hover:bg-white px-6 py-3 text-xs font-semibold tracking-widest uppercase text-dark-50/70 hover:text-mauve transition-colors"
              >
                <CalendarPlus size={14} strokeWidth={1.75} />
                Add to Calendar
              </a>
              <p className="mt-3 text-2xs text-dark-50/40">
                Opens in Apple Calendar, Google Calendar, or Outlook
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── RSVP form ───────────────────────────────────────────────────── */}
      <section id="rsvp" className="py-16 md:py-24 bg-white scroll-mt-16">
        <Container size="md">
          <div className="text-center mb-8 md:mb-10 px-4">
            <p className="eyebrow text-mauve-600 mb-3">RSVP</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-dark-50 mb-3 md:mb-4">
              Registration <span className="italic text-mauve">Required</span>
            </h2>
            <p className="text-sm md:text-[0.95rem] text-dark-50/60 leading-relaxed max-w-md mx-auto">
              Space is limited — kindly reply below so we can save your spot.
            </p>
          </div>

          <div className="max-w-xl mx-auto px-4 sm:px-0">
            <RsvpForm />
          </div>

          {/* Alternative RSVP methods */}
          <div className="max-w-xl mx-auto px-4 sm:px-0 mt-10 md:mt-12">
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-cream-200" />
              <p className="text-2xs font-medium tracking-widest uppercase text-dark-50/40">
                Or reach us
              </p>
              <div className="flex-1 h-px bg-cream-200" />
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <a
                href={`https://instagram.com/${EVENT.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 min-h-[3rem] px-4 py-3 rounded-xl border border-cream-300 hover:border-mauve/40 bg-cream-50 hover:bg-white text-sm text-dark-50/80 hover:text-dark-50 transition-colors"
              >
                <span className="text-2xs font-medium tracking-widest uppercase text-mauve-600">DM</span>
                <span className="truncate">@{EVENT.instagram}</span>
              </a>
              <a
                href={`tel:${EVENT.phoneRaw}`}
                className="flex items-center justify-center gap-2 min-h-[3rem] px-4 py-3 rounded-xl border border-cream-300 hover:border-mauve/40 bg-cream-50 hover:bg-white text-sm text-dark-50/80 hover:text-dark-50 transition-colors"
              >
                <span className="text-2xs font-medium tracking-widest uppercase text-mauve-600">Call</span>
                <span>{EVENT.phone}</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Footer signature ────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-cream border-t border-cream-200">
        <Container size="md">
          <div className="text-center">
            <p className="font-display text-lg md:text-xl italic text-mauve mb-2">
              With gratitude,
            </p>
            <p className="text-2xs md:text-xs font-medium tracking-[0.25em] uppercase text-dark-50/60">
              The Manhattan Laser Spa Team
            </p>
          </div>
        </Container>
      </section>
    </div>
  )
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon:  LucideIcon
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 flex items-center justify-center size-11 rounded-2xl bg-mauve-50 border border-mauve/10">
        <Icon size={16} className="text-mauve" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 pt-1">
        <p className="text-2xs font-semibold tracking-[0.2em] uppercase text-dark-50/40 mb-1">
          {label}
        </p>
        <p className="text-sm md:text-[0.95rem] text-dark-50 leading-snug">
          {value}
        </p>
      </div>
    </div>
  )
}
