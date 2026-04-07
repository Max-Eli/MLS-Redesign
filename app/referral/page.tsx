import type { Metadata } from 'next'
import Link from 'next/link'

import { CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Tiered Referral Program | Earn Rewards at Manhattan Laser Spa',
  description:
    'Refer friends to Manhattan Laser Spa and unlock tiered rewards — from a free laser facial to a full year of unlimited laser hair removal. The more you refer, the bigger the reward.',
  alternates: { canonical: 'https://manhattanlaserspa.com/referral' },
}

const tiers = [
  {
    tier: 1,
    label: 'Refer 1 Friend',
    color: 'bg-mauve',
    lightColor: 'bg-mauve/8',
    borderColor: 'border-mauve/20',
    rewards: [
      'Manhattan Laser Facial',
      '1 Session of Laser Hair Removal on any area',
      '1 Endosphere Therapy Treatment',
      '1 IV Vitamin Infusion',
    ],
  },
  {
    tier: 2,
    label: 'Refer 3 Friends',
    color: 'bg-mauve-600',
    lightColor: 'bg-mauve/10',
    borderColor: 'border-mauve/25',
    rewards: [
      'Signature Facial',
      '20 Units of Botox',
      '2 Endosphere Therapy Treatments',
      '1 Full Body Laser Hair Removal Session',
      '1 Session of IPL',
    ],
  },
  {
    tier: 3,
    label: 'Refer 5 Friends',
    color: 'bg-dark-50',
    lightColor: 'bg-dark-50/5',
    borderColor: 'border-dark-50/15',
    rewards: [
      '50 Units of Botox',
      'Full EMSculpt Treatment (4 Sessions)',
      '1 Syringe of Lip Filler',
      '1 Session of RF Microneedling',
      '1 Session of Clear + Brilliant',
    ],
  },
  {
    tier: 4,
    label: 'Refer 10 Friends',
    color: 'bg-gold-400',
    lightColor: 'bg-gold/8',
    borderColor: 'border-gold/25',
    rewards: [
      '1 Year of Unlimited Laser Hair Removal',
      'Botox Every 3 Months',
      '5 Treatments of Your Choice',
    ],
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
            Earn More with<br />
            <em className="not-italic text-mauve">Every Referral</em>
          </h1>
          <p className="text-lg text-white/50 max-w-xl leading-relaxed mb-10">
            Share your unique referral code with friends and family. Once they book and complete their first appointment, you unlock rewards. The more referrals you make, the bigger the reward.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg" asChild>
              <Link href="/contact">Get My Referral Code</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">Browse Treatments</Link>
            </Button>
          </div>
        </Container>
      </div>

      {/* How it works strip */}
      <div className="bg-mauve">
        <Container>
          <div className="py-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-white text-center">
            {['Share your code', 'Friend books & visits', 'You unlock rewards'].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="size-7 rounded-full bg-white/15 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium tracking-wide">{step}</span>
                </div>
                {i < 2 && <span className="hidden sm:block text-white/30 text-lg">→</span>}
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-20">
        {/* Tier cards */}
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">Choose Your Reward</p>
          <h2 className="display-md text-dark-50">
            Four Tiers, Bigger Rewards
          </h2>
          <p className="mt-3 text-sm text-dark-50/50 max-w-lg mx-auto leading-relaxed">
            Each tier lets you choose <strong>one reward</strong> from the options listed. Unlock higher tiers by referring more friends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {tiers.map((t) => (
            <div
              key={t.tier}
              className={`relative bg-white rounded-3xl shadow-luxury border ${t.borderColor} overflow-hidden`}
            >
              {/* Tier badge */}
              <div className={`${t.color} px-8 py-5 flex items-center justify-between`}>
                <div>
                  <p className="text-white/60 text-2xs font-semibold tracking-widest uppercase mb-0.5">
                    Tier {t.tier}
                  </p>
                  <h3 className="font-display text-2xl font-light text-white">
                    {t.label}
                  </h3>
                </div>
                <span className="font-display text-6xl font-light text-white/15 leading-none select-none">
                  {t.tier}
                </span>
              </div>

              {/* Rewards */}
              <div className="p-8">
                <p className="text-2xs font-semibold tracking-widest uppercase text-dark-50/40 mb-4">
                  Choose One Reward
                </p>
                <ul className="space-y-3">
                  {t.rewards.map((reward) => (
                    <li key={reward} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-mauve flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-dark-50/70 leading-relaxed">{reward}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-dark rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-80 rounded-full bg-mauve/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="eyebrow mb-4 text-mauve-300">Ready to Start?</p>
            <h2 className="display-md text-white mb-4">Get Your Referral Code</h2>
            <p className="text-white/50 max-w-md mx-auto mb-8 leading-relaxed">
              Contact us to receive your unique referral code. Track your referrals and unlock rewards as your friends visit.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary" size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
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
