import type { Metadata } from 'next'
import Link from 'next/link'
import { Gift, Users, Star, ChevronRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Referral Program | Earn Rewards at Manhattan Laser Spa',
  description:
    'Refer a friend to Manhattan Laser Spa and earn $50 toward your next treatment. Your friend gets $50 off too. Everyone wins.',
  alternates: { canonical: 'https://manhattanlaserspa.com/referral' },
}

const steps = [
  {
    icon: Users,
    title: 'Refer a Friend',
    description:
      'Share your unique referral link or simply tell a friend to mention your name when they book.',
  },
  {
    icon: Star,
    title: 'They Book & Visit',
    description:
      'Your friend books any treatment at Manhattan Laser Spa and completes their first appointment.',
  },
  {
    icon: Gift,
    title: 'You Both Earn $50',
    description:
      'You receive $50 in spa credit toward any future service. Your friend gets $50 off their first treatment.',
  },
]

const faqs = [
  {
    q: 'Who can participate?',
    a: 'Any existing Manhattan Laser Spa client can refer friends and family. There is no limit to how many people you can refer.',
  },
  {
    q: 'When do I receive my credit?',
    a: 'Your $50 spa credit is added to your account within 7 days of your referred friend completing their first paid appointment.',
  },
  {
    q: 'Does my credit expire?',
    a: 'Spa credits are valid for 12 months from the date they are issued.',
  },
  {
    q: 'Can I combine my credit with other offers?',
    a: 'Referral credits can be used toward any service but cannot be combined with other promotional discounts or gift cards.',
  },
  {
    q: 'Is there a limit on referral rewards?',
    a: 'No limit — refer as many friends as you like and earn $50 for each one who completes a visit.',
  },
]

export default function ReferralPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-dark pt-36 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-mauve/15 blur-3xl pointer-events-none" />
        <Container className="relative">
          <p className="eyebrow mb-4 text-mauve-300">Referral Program</p>
          <h1 className="display-xl text-white max-w-2xl leading-tight mb-6">
            Share the Glow,<br />
            <em className="not-italic text-mauve">Earn Rewards</em>
          </h1>
          <p className="text-lg text-white/50 max-w-xl leading-relaxed mb-10">
            Love your results? Refer a friend and you'll both receive{' '}
            <span className="text-white/80 font-medium">$50 in spa credit</span> — no limits,
            no expiration tricks, just our way of saying thank you.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg" asChild>
              <Link href="/contact">Refer a Friend</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">Browse Treatments</Link>
            </Button>
          </div>
        </Container>
      </div>

      {/* Reward callout */}
      <div className="bg-mauve">
        <Container>
          <div className="py-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-white">
            <div className="flex items-center gap-5">
              <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-2xl font-light">$50</span>
              </div>
              <div>
                <p className="font-semibold tracking-wide">You Receive</p>
                <p className="text-sm text-white/60">$50 spa credit added to your account</p>
              </div>
            </div>
            <div className="flex items-center gap-5 sm:border-l sm:border-white/20 sm:pl-6">
              <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-2xl font-light">$50</span>
              </div>
              <div>
                <p className="font-semibold tracking-wide">Your Friend Receives</p>
                <p className="text-sm text-white/60">$50 off their first treatment</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-20">
        {/* How it works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">How It Works</p>
            <h2 className="display-md text-dark-50">Three Simple Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="relative bg-white rounded-3xl p-8 shadow-luxury">
                {/* Step number */}
                <span className="absolute top-6 right-6 font-display text-5xl font-light text-cream-200 leading-none select-none">
                  {i + 1}
                </span>
                <div className="size-12 rounded-2xl bg-mauve/10 flex items-center justify-center mb-6">
                  <step.icon size={22} className="text-mauve" />
                </div>
                <h3 className="font-display text-xl font-light text-dark-50 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-dark-50/60 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">Questions</p>
            <h2 className="display-md text-dark-50">Program Details</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl p-6 shadow-luxury">
                <h3 className="font-medium text-dark-50 mb-2">{faq.q}</h3>
                <p className="text-sm text-dark-50/60 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-dark rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-80 rounded-full bg-mauve/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="eyebrow mb-4 text-mauve-300">Ready to Share?</p>
            <h2 className="display-md text-white mb-4">
              Start Earning Today
            </h2>
            <p className="text-white/50 max-w-md mx-auto mb-8 leading-relaxed">
              Contact us to get your referral set up, or simply tell your friend to mention
              your name when they call or book online.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary" size="lg" asChild>
                <Link href="/contact">Get Started</Link>
              </Button>
              <a
                href="tel:+13057053997"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm border border-white/20 hover:border-white/40 text-xs font-medium tracking-widest uppercase text-white/60 hover:text-white transition-colors"
              >
                Call 305-705-3997
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
