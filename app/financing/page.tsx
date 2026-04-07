import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Zap, Shield, Clock, CreditCard, ChevronRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { FinancingCalculator } from '@/components/financing/FinancingCalculator'

const CHERRY_URL = 'https://pay.withcherry.com/manhattanlaserspa?utm_source=merchant&utm_medium=website'

export const metadata: Metadata = {
  title: 'Financing with Cherry | Manhattan Laser Spa',
  description: 'Get the treatments you want now and pay over time with Cherry financing. 0% APR options available. Apply in seconds with no hard credit pull.',
}

const steps = [
  {
    icon: Zap,
    title: 'Apply in Seconds',
    description: 'Fill out a simple application online. No hard credit inquiry — your score is safe.',
  },
  {
    icon: CheckCircle2,
    title: 'Get Instantly Approved',
    description: 'Receive an instant decision and see your approved amount and available plans.',
  },
  {
    icon: CreditCard,
    title: 'Book Your Treatment',
    description: 'Use your Cherry approval to pay for any service at Manhattan Laser Spa.',
  },
  {
    icon: Clock,
    title: 'Pay Over Time',
    description: 'Make simple monthly payments. 0% APR options available for qualified patients.',
  },
]

const benefits = [
  '0% APR plans available for 3 and 6 months',
  'No hard credit inquiry to apply',
  'Instant approval decision',
  'Plans from 3 to 24 months',
  'No prepayment penalties',
  'HIPAA-compliant and secure',
  'Works for any treatment or package',
  'Apply once, use for future visits',
]

const faqs = [
  {
    question: 'Does applying affect my credit score?',
    answer: 'Cherry uses a soft credit check for the initial application, which does not affect your credit score. A hard pull may only occur if you accept a financing offer.',
  },
  {
    question: 'What credit score do I need?',
    answer: 'Cherry works with a wide range of credit profiles. Many patients with less-than-perfect credit are approved. Apply and find out in seconds.',
  },
  {
    question: 'Can I use Cherry for any treatment?',
    answer: 'Yes — Cherry financing can be applied to any service or package at Manhattan Laser Spa, including laser hair removal, injectables, body contouring, skin care, and more.',
  },
  {
    question: 'How do I use my Cherry approval in the spa?',
    answer: 'Once approved, simply let our front desk know you\'d like to use Cherry when you arrive for your appointment. We\'ll process the payment through Cherry seamlessly.',
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'No hidden fees. Your monthly payment amount is clearly shown before you accept any plan. 0% APR plans mean you pay exactly the treatment cost — nothing more.',
  },
  {
    question: 'Can I pay off my balance early?',
    answer: 'Absolutely. Cherry has no prepayment penalties. Pay off your balance at any time with no additional charges.',
  },
]

export default function FinancingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-dark pt-36 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mauve/15 via-transparent to-transparent pointer-events-none" />
        <Container className="relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-semibold text-white">Cherry</span>
              <span className="text-2xs text-white/40 tracking-wider">Official Financing Partner</span>
            </div>
            <h1 className="display-xl text-white leading-tight mb-4">
              Get the Treatment<br />You Deserve Now
            </h1>
            <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl">
              Don't let budget hold you back. Cherry financing lets you split the cost of any treatment into simple monthly payments — with 0% APR options available.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={CHERRY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-mauve text-white text-sm font-semibold tracking-wider px-8 py-4 rounded-sm hover:bg-mauve-600 transition-colors"
              >
                Apply Now — It's Free
                <ChevronRight size={16} />
              </a>
              <Button variant="outline" size="lg" asChild>
                <Link href="/shop">Browse Treatments</Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Stats bar */}
      <div className="bg-mauve">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-mauve-600">
            {[
              { value: '0%', label: 'APR Available' },
              { value: 'Instant', label: 'Approval Decision' },
              { value: 'No Hard', label: 'Credit Inquiry' },
              { value: '3–24', label: 'Month Plans' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-5 text-center">
                <p className="font-display text-2xl font-light text-white">{value}</p>
                <p className="text-2xs text-white/60 tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* Left — content */}
          <div className="space-y-16">

            {/* How it works */}
            <section>
              <p className="eyebrow mb-4">Simple Process</p>
              <h2 className="display-md text-dark-50 mb-10">How Cherry Works</h2>
              <div className="space-y-8">
                {steps.map((step, i) => (
                  <div key={step.title} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="size-11 rounded-full bg-mauve/10 border border-mauve/20 flex items-center justify-center flex-shrink-0">
                        <step.icon size={18} className="text-mauve" />
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-px flex-1 bg-mauve/10 mt-3" />
                      )}
                    </div>
                    <div className="pt-2 pb-8 last:pb-0">
                      <h3 className="font-medium text-dark-50 mb-1">{step.title}</h3>
                      <p className="text-sm text-dark-50/60 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Benefits */}
            <section>
              <h2 className="display-md text-dark-50 mb-8">Why Cherry?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-mauve flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-dark-50/70">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="display-md text-dark-50 mb-8">FAQ</h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="bg-white border border-cream-200 rounded-2xl p-6">
                    <h3 className="font-medium text-dark-50 mb-2">{faq.question}</h3>
                    <p className="text-sm text-dark-50/60 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right — calculator (sticky) */}
          <div className="lg:sticky lg:top-28">
            <FinancingCalculator />

            <div className="mt-6 bg-white border border-cream-200 rounded-2xl p-5 flex items-center gap-4">
              <Shield size={20} className="text-mauve flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-dark-50">Secure & HIPAA Compliant</p>
                <p className="text-xs text-dark-50/50 leading-relaxed mt-0.5">
                  Cherry is a licensed lender. Your data is encrypted and never shared without consent.
                </p>
              </div>
            </div>
          </div>

        </div>
      </Container>

      {/* Bottom CTA */}
      <div className="bg-dark py-16">
        <Container className="text-center">
          <p className="eyebrow mb-4 text-mauve-300">Ready to Get Started?</p>
          <h2 className="display-md text-white mb-4">Your Dream Treatment Awaits</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Apply for Cherry financing in seconds and book your treatment today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={CHERRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-mauve text-white text-sm font-semibold tracking-wider px-8 py-4 rounded-sm hover:bg-mauve-600 transition-colors"
            >
              Apply with Cherry
              <ChevronRight size={16} />
            </a>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Speak to Our Team</Link>
            </Button>
          </div>
        </Container>
      </div>
    </div>
  )
}
