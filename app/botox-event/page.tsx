import type { Metadata } from 'next'
import { Calendar, Clock, MapPin, Gift, Tag, Wine, Syringe, CalendarPlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { RsvpForm } from '@/components/botox-event/RsvpForm'
import { BOTOX_EVENT as EVENT } from '@/lib/botox-event'

const PERKS = [
  { icon: Tag,     title: '$6.99 / Unit Botox',  blurb: 'Event-only pricing, one evening only' },
  { icon: Syringe, title: 'Expert Injector',     blurb: 'Complimentary consultations all evening' },
  { icon: Wine,    title: 'Champagne',           blurb: 'Sip something sparkling while you mingle' },
  { icon: Gift,    title: 'Raffles & Goodie Bags', blurb: 'Prizes and gifts throughout the night' },
]

export const metadata: Metadata = {
  title:       'You’re Invited: The Botox Event | Manhattan Laser Spa',
  description: `Join Manhattan Laser Spa for The Botox Event — ${EVENT.date}, ${EVENT.time}. Event-only Botox pricing, complimentary consultations, bubbly, raffles & giveaways.`,
  // Private event page — kept out of search index and sitemap.
  robots:      { index: false, follow: false },
  alternates:  { canonical: EVENT.page },
  openGraph: {
    title:       'You’re Invited: The Botox Event at Manhattan Laser Spa',
    description: `${EVENT.date} · ${EVENT.time}. Event-only Botox pricing, bubbly, raffles & giveaways.`,
    type:        'website',
  },
}

export default function BotoxEventPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* ── Hero — light & editorial ─────────────────────────────────────── */}
      <section className="relative pt-32 pb-14 md:pt-44 md:pb-20 overflow-hidden">
        <div className="absolute -top-20 right-[-10%] size-80 rounded-full bg-mauve/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-4rem] left-[-8%] size-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        <Container className="relative">
          <div className="max-w-2xl mx-auto text-center">
            <p className="eyebrow text-mauve-600 mb-5">You&apos;re Invited</p>

            <h1 className="font-display font-light text-dark-50 leading-[0.95] text-[3.4rem] sm:text-7xl md:text-8xl">
              The <span className="italic text-mauve">Botox</span>
              <br />
              Event
            </h1>

            <div className="w-10 h-px bg-gold-400 mx-auto my-7 md:my-9" />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-6 text-sm md:text-[0.95rem] text-dark-50/75">
              <span className="inline-flex items-center gap-2">
                <Calendar size={14} className="text-mauve" strokeWidth={1.75} />
                {EVENT.dateShort}
              </span>
              <span className="hidden sm:inline text-gold-400/70">◆</span>
              <span className="inline-flex items-center gap-2">
                <Clock size={14} className="text-mauve" strokeWidth={1.75} />
                4:00 – 8:00 PM
              </span>
              <span className="hidden sm:inline text-gold-400/70">◆</span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-mauve" strokeWidth={1.75} />
                Sunny Isles Beach
              </span>
            </div>

            <p className="mt-6 md:mt-7 text-sm md:text-[0.95rem] text-dark-50/55 leading-relaxed max-w-md mx-auto">
              An evening of beauty and bubbly — with Botox at{' '}
              <span className="font-semibold text-dark-50">$6.99 per unit</span>,
              available during the event only.
            </p>

            <div className="mt-8 md:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#rsvp"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-mauve hover:bg-mauve-600 px-9 py-4 text-xs font-semibold tracking-widest uppercase text-white transition-colors shadow-mauve-glow"
              >
                Reserve My Spot
              </a>
              <a
                href="/api/calendar/botox-event.ics"
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-cream-300 hover:border-mauve/50 bg-white/60 hover:bg-white px-8 py-4 text-xs font-semibold tracking-widest uppercase text-dark-50/70 hover:text-mauve transition-colors"
              >
                <CalendarPlus size={14} strokeWidth={1.75} />
                Add to Calendar
              </a>
            </div>

            <p className="mt-5 text-2xs tracking-[0.2em] uppercase text-dark-50/35">
              Space is limited · RSVP required
            </p>
          </div>
        </Container>
      </section>

      {/* ── Perks ────────────────────────────────────────────────────────── */}
      <section className="pb-14 md:pb-20">
        <Container size="lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {PERKS.map(({ icon: Icon, title, blurb }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-cream-200 p-5 md:p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex items-center justify-center size-11 rounded-2xl bg-mauve-50 border border-mauve/10">
                  <Icon size={17} className="text-mauve" strokeWidth={1.75} />
                </div>
                <p className="font-display text-base md:text-lg text-dark-50 leading-snug mb-1.5">{title}</p>
                <p className="text-2xs md:text-xs text-dark-50/50 leading-relaxed">{blurb}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Statement band ───────────────────────────────────────────────── */}
      <section className="pb-14 md:pb-20">
        <Container size="md">
          <div className="relative bg-dark rounded-3xl overflow-hidden px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14 text-center">
            <div className="absolute -top-16 -right-10 size-52 rounded-full bg-mauve/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-14 -left-8 size-44 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

            <p className="eyebrow text-gold-400 mb-4">One Evening Only</p>
            <p className="font-display font-light leading-none text-white text-6xl sm:text-7xl md:text-[6.5rem]">
              $6<span className="text-gold-400">.99</span>
              <span className="align-top text-lg sm:text-xl md:text-2xl tracking-[0.2em] ml-2 md:ml-3">/ UNIT</span>
            </p>
            <p className="mt-4 font-display italic text-mauve-300 text-lg md:text-xl">Botox, event pricing</p>
            <div className="w-10 h-px bg-gold-400 mx-auto my-6" />
            <p className="text-sm text-white/60 leading-relaxed max-w-sm mx-auto">
              This pricing is available during the event only — come see us,
              sip something sparkling, and let&apos;s talk beauty.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Details card ─────────────────────────────────────────────────── */}
      <section className="pb-14 md:pb-20">
        <Container size="md">
          <div className="bg-white rounded-3xl shadow-luxury-lg p-6 sm:p-8 md:p-12">
            <div className="text-center mb-8 md:mb-10">
              <p className="eyebrow text-mauve-600 mb-3">The Details</p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-dark-50">
                Save the <span className="italic text-mauve">Date</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              <DetailItem icon={Calendar} label="Date" value={EVENT.date} />
              <DetailItem icon={Clock}    label="Time" value={EVENT.time} />
              <DetailItem icon={MapPin}   label="Location" value={<>
                {EVENT.address1}<br />
                {EVENT.address2}
              </>} />
            </div>
          </div>
        </Container>
      </section>

      {/* ── RSVP ─────────────────────────────────────────────────────────── */}
      <section id="rsvp" className="py-16 md:py-24 bg-white scroll-mt-16">
        <Container size="md">
          <div className="text-center mb-8 md:mb-10 px-4">
            <p className="eyebrow text-mauve-600 mb-3">RSVP</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-dark-50 mb-3 md:mb-4">
              Join Us on <span className="italic text-mauve">October 15</span>
            </h2>
            <p className="text-sm md:text-[0.95rem] text-dark-50/60 leading-relaxed max-w-md mx-auto">
              Space is limited — reserve below and we&apos;ll save your spot.
            </p>
          </div>

          <div className="max-w-xl mx-auto px-4 sm:px-0">
            <RsvpForm />
          </div>

          <div className="max-w-xl mx-auto px-4 sm:px-0 mt-10 md:mt-12">
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-cream-200" />
              <p className="text-2xs font-medium tracking-widest uppercase text-dark-50/40">Or reach us</p>
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

      {/* ── Signature ────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-cream border-t border-cream-200">
        <Container size="md">
          <div className="text-center">
            <p className="font-display text-lg md:text-xl italic text-mauve mb-2">See you there,</p>
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
        <p className="text-2xs font-semibold tracking-[0.2em] uppercase text-dark-50/40 mb-1">{label}</p>
        <p className="text-sm md:text-[0.95rem] text-dark-50 leading-snug">{value}</p>
      </div>
    </div>
  )
}
