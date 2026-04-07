import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | Book a Consultation',
  description:
    'Book a free consultation at Manhattan Laser Spa in Sunny Isles Beach, FL. Located at 16850 Collins Ave, Suite 105. Call 305-705-3997.',
  alternates: { canonical: 'https://manhattanlaserspa.com/contact' },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-dark pt-32 pb-20">
        <Container>
          <p className="eyebrow mb-4 text-mauve-400">Get in Touch</p>
          <h1 className="display-xl text-white max-w-xl">
            Book Your Consultation
          </h1>
          <p className="mt-6 text-base text-white/50 max-w-lg leading-relaxed">
            Ready to start your transformation? Our team at Sunny Isles Beach is here to
            create a personalized treatment plan for you.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-3xl shadow-luxury p-8 md:p-10">
            <h2 className="font-display text-2xl font-light text-dark-50 mb-8">
              Send Us a Message
            </h2>
            <ContactForm />
          </div>

          {/* Info */}
          <div className="space-y-8">
            {/* Location card */}
            <div className="bg-white rounded-3xl shadow-luxury p-8">
              <h2 className="font-display text-2xl font-light text-dark-50 mb-6">
                Our Location
              </h2>
              <div className="space-y-5">
                <a
                  href="https://maps.google.com/?q=16850+Collins+Ave+Suite+105+Sunny+Isles+Beach+FL+33160"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="size-10 rounded-full bg-mauve-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-mauve" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-50 group-hover:text-mauve transition-colors">
                      16850 Collins Ave, Suite 105
                    </p>
                    <p className="text-sm text-dark-50/50">
                      Sunny Isles Beach, FL 33160
                    </p>
                    <p className="text-xs text-mauve mt-1 group-hover:underline">
                      Get Directions →
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+13057053997"
                  className="flex items-center gap-4 group"
                >
                  <div className="size-10 rounded-full bg-mauve-50 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-mauve" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-50 group-hover:text-mauve transition-colors">
                      305-705-3997
                    </p>
                    <p className="text-xs text-dark-50/40">Call or text</p>
                  </div>
                </a>

                <a
                  href="mailto:florida@manhattanlaserspa.com"
                  className="flex items-center gap-4 group"
                >
                  <div className="size-10 rounded-full bg-mauve-50 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-mauve" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-50 group-hover:text-mauve transition-colors">
                      florida@manhattanlaserspa.com
                    </p>
                    <p className="text-xs text-dark-50/40">We reply within 24 hours</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Hours card */}
            <div className="bg-white rounded-3xl shadow-luxury p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={20} className="text-mauve" />
                <h2 className="font-display text-2xl font-light text-dark-50">Hours</h2>
              </div>
              <ul className="space-y-3">
                {[
                  { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM' },
                  { day: 'Saturday', hours: '10:00 AM – 4:00 PM' },
                  { day: 'Sunday', hours: 'Closed' },
                ].map(({ day, hours }) => (
                  <li key={day} className="flex justify-between text-sm border-b border-cream-100 pb-3 last:border-0 last:pb-0">
                    <span className="text-dark-50/60">{day}</span>
                    <span className="font-medium text-dark-50">{hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className="bg-dark rounded-3xl p-8">
              <h2 className="font-display text-2xl font-light text-white mb-2">
                Follow Our Work
              </h2>
              <p className="text-sm text-white/40 mb-6">
                See real results from our clients on Instagram.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/manhattanlaserspa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/8 border border-white/12 text-white/70 hover:text-white hover:border-white/30 text-xs font-medium px-4 py-2.5 rounded-full transition-colors"
                >
                  <Instagram size={14} />
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/manhattanlaserspa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/8 border border-white/12 text-white/70 hover:text-white hover:border-white/30 text-xs font-medium px-4 py-2.5 rounded-full transition-colors"
                >
                  <Facebook size={14} />
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map embed */}
        <div className="mt-12 rounded-3xl overflow-hidden shadow-luxury h-80">
          <iframe
            title="Manhattan Laser Spa Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3589.4!2d-80.1228!3d25.9340!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s16850+Collins+Ave+Suite+105+Sunny+Isles+Beach+FL!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </div>
  )
}
