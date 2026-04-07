import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'
import { Container } from '@/components/ui/Container'

const footerServices = [
  { label: 'Laser Hair Removal', href: '/services/laser-hair-removal' },
  { label: 'CoolSculpting Elite', href: '/services/coolsculpting' },
  { label: 'Botox & Fillers', href: '/services/injectables' },
  { label: 'HydraFacial', href: '/services/hydrafacial' },
  { label: 'EMSculpt', href: '/services/emsculpt' },
  { label: 'Microneedling', href: '/services/microneedling' },
  { label: 'IV Therapy', href: '/services/iv-therapy' },
  { label: 'Chemical Peels', href: '/services/chemical-peels' },
  { label: 'Laser Skin Resurfacing', href: '/services/laser-skin-resurfacing' },
  { label: 'PRP Facelift', href: '/services/prp-facelift' },
]

const footerLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Shop Treatments', href: '/shop' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Financing', href: '/financing' },
  { label: 'Membership', href: '/membership' },
  { label: 'Gift Cards', href: '/shop?category=166' },
  { label: 'Referral Program', href: '/referral' },
]

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Top CTA strip */}
      <div className="bg-mauve py-4">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-display text-xl md:text-2xl font-light text-white">
              Ready to start your transformation?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-mauve font-sans text-xs font-semibold tracking-widest uppercase px-6 py-3 hover:bg-cream transition-colors"
            >
              Book a Free Consultation
            </Link>
          </div>
        </Container>
      </div>

      {/* Main footer */}
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <p className="font-display text-2xl font-light tracking-wider text-white leading-none">
                Manhattan
              </p>
              <p className="font-display text-2xl font-light tracking-widest2 text-mauve leading-none">
                Laser Spa
              </p>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Sunny Isles Beach&apos;s premier luxury medical spa, offering advanced aesthetic
              treatments in a world-class environment.
            </p>
            <div className="space-y-3">
              <a
                href="https://maps.google.com/?q=16850+Collins+Ave+Suite+105+Sunny+Isles+Beach+FL+33160"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-white/50 hover:text-mauve transition-colors group"
              >
                <MapPin size={16} className="mt-0.5 flex-shrink-0 group-hover:text-mauve transition-colors" />
                <span>16850 Collins Ave, Suite 105<br />Sunny Isles Beach, FL 33160</span>
              </a>
              <a
                href="tel:+13057053997"
                className="flex items-center gap-3 text-sm text-white/50 hover:text-mauve transition-colors"
              >
                <Phone size={16} />
                305-705-3997
              </a>
              <a
                href="mailto:info@manhattanlaserspa.com"
                className="flex items-center gap-3 text-sm text-white/50 hover:text-mauve transition-colors"
              >
                <Mail size={16} />
                info@manhattanlaserspa.com
              </a>
            </div>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/manhattanlaserspa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="size-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-mauve hover:border-mauve transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.facebook.com/manhattanlaserspa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="size-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-mauve hover:border-mauve transition-colors"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-2xs font-semibold tracking-widest2 uppercase text-mauve mb-6">
              Treatments
            </h3>
            <ul className="space-y-2.5">
              {footerServices.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-2xs font-semibold tracking-widest2 uppercase text-mauve mb-6">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours + Payments */}
          <div>
            <h3 className="text-2xs font-semibold tracking-widest2 uppercase text-mauve mb-6">
              Hours
            </h3>
            <ul className="space-y-2 mb-8">
              {[
                { day: 'Mon – Fri', hours: '9:00 AM – 6:00 PM' },
                { day: 'Saturday', hours: '10:00 AM – 4:00 PM' },
                { day: 'Sunday', hours: 'Closed' },
              ].map(({ day, hours }) => (
                <li key={day} className="flex justify-between text-sm">
                  <span className="text-white/40">{day}</span>
                  <span className="text-white/70">{hours}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-2xs font-semibold tracking-widest2 uppercase text-mauve mb-4">
              We Accept
            </h3>
            <p className="text-xs text-white/40 leading-relaxed mb-6">
              Visa · Mastercard · Amex · Discover
              <br />
              Stripe · Affirm · Klarna
              <br />
              HSA/FSA accepted for eligible treatments
            </p>

            <h3 className="text-2xs font-semibold tracking-widest2 uppercase text-mauve mb-4">
              Financing Partner
            </h3>
            <a
              href="https://pay.withcherry.com/manhattanlaserspa?utm_source=merchant&utm_medium=website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col gap-2 group"
            >
              <div className="flex items-center gap-2">
                <div className="bg-white/8 border border-white/10 rounded-lg px-3 py-2 group-hover:border-mauve/40 transition-colors">
                  <span className="text-sm font-semibold text-white tracking-wide">Cherry</span>
                </div>
                <span className="text-2xs text-white/30 group-hover:text-white/50 transition-colors">Official Partner</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                0% APR financing available.<br />
                Apply in seconds — no hard credit pull.
              </p>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Manhattan Laser Spa. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'HIPAA Notice', href: '/hipaa' },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-xs text-white/30 hover:text-white/60 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
