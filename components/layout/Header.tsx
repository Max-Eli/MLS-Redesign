'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Phone, Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'

const services = [
  {
    label: 'Laser Treatments',
    href: '/shop?category=laser-treatments',
    items: [
      { label: 'Laser Hair Removal',    href: '/services/laser-hair-removal' },
      { label: 'CO2 Laser',             href: '/services/co2-laser' },
      { label: 'Laser Genesis',         href: '/services/laser-genesis' },
      { label: 'Laser Skin Tightening', href: '/services/laser-skin-tightening' },
    ],
  },
  {
    label: 'Body Contouring',
    href: '/shop?category=body-contouring',
    items: [
      { label: 'CoolSculpting', href: '/services/coolsculpting' },
      { label: 'EMSculpt',      href: '/services/emsculpt' },
      { label: 'Endosphere',    href: '/services/endosphere' },
      { label: 'LPG',           href: '/services/lpg' },
    ],
  },
  {
    label: 'Injectables',
    href: '/shop?category=injectables',
    items: [
      { label: 'Botox',          href: '/services/botox' },
      { label: 'Dermal Fillers', href: '/services/dermal-fillers' },
      { label: 'Kybella',        href: '/services/kybella' },
      { label: 'PDO Thread Lift',href: '/services/pdo-thread-lift' },
      { label: 'PRP Facelift',   href: '/services/prp-facelift' },
    ],
  },
  {
    label: 'Skin Care',
    href: '/shop?category=skin-care',
    items: [
      { label: 'HydraFacial',   href: '/services/hydrafacial' },
      { label: 'Microneedling', href: '/services/microneedling' },
      { label: 'JetPeel',       href: '/services/jetpeel' },
      { label: 'PRX-T33 Peel',  href: '/services/prx-t33' },
    ],
  },
  {
    label: 'Wellness & IV Therapy',
    href: '/shop?category=wellness-iv-therapy',
    items: [
      { label: 'IV Therapy',           href: '/services/iv-therapy' },
      { label: 'PRP Hair Restoration', href: '/services/prp-hair-restoration' },
      { label: 'Medical Weight Loss',  href: '/services/weight-loss' },
    ],
  },
  {
    label: 'Gift Cards',
    href: '/shop?category=gift-cards',
    items: [
      { label: '$50 Gift Card',   href: '/product/gift-card-50' },
      { label: '$100 Gift Card',  href: '/product/gift-card-100' },
      { label: '$200 Gift Card',  href: '/product/gift-card-200' },
      { label: '$500 Gift Card',  href: '/product/gift-card-500' },
      { label: 'View All',        href: '/shop?category=gift-cards' },
    ],
  },
]

const navLinks = [
  { label: 'Services', href: '/services', hasDropdown: true },
  { label: 'Shop', href: '/shop' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const { itemCount, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isHome = pathname === '/'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-luxury',
        scrolled || !isHome
          ? 'bg-white/95 backdrop-blur-md shadow-luxury border-b border-cream-200'
          : 'bg-transparent'
      )}
    >
      {/* Top bar */}
      <div
        className={cn(
          'border-b transition-all duration-500',
          scrolled || !isHome ? 'border-cream-200' : 'border-white/10',
          'hidden md:block'
        )}
      >
        <Container>
          <div className="flex items-center justify-between h-9">
            <p
              className={cn(
                'text-2xs font-medium tracking-widest uppercase transition-colors',
                scrolled || !isHome ? 'text-dark-50/50' : 'text-white/60'
              )}
            >
              Sunny Isles Beach, Florida — 16850 Collins Ave, Suite 105
            </p>
            <div className="flex items-center gap-6">
              <a
                href="tel:+13057053997"
                className={cn(
                  'flex items-center gap-1.5 text-2xs font-medium tracking-wider transition-colors',
                  scrolled || !isHome
                    ? 'text-dark-50/70 hover:text-mauve'
                    : 'text-white/70 hover:text-white'
                )}
              >
                <Phone size={11} />
                305-705-3997
              </a>
              <a
                href="https://pay.withcherry.com/manhattanlaserspa?utm_source=merchant&utm_medium=website"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-1.5 text-2xs font-medium tracking-wider transition-colors border-r pr-6',
                  scrolled || !isHome
                    ? 'text-dark-50/50 hover:text-mauve border-cream-200'
                    : 'text-white/40 hover:text-white/70 border-white/10'
                )}
              >
                <span className="font-semibold">Cherry</span>
                <span>Financing — Apply Now</span>
              </a>
              <Link
                href="/shop"
                className={cn(
                  'text-2xs font-medium tracking-widest uppercase transition-colors',
                  scrolled || !isHome
                    ? 'text-mauve hover:text-mauve-600'
                    : 'text-mauve-200 hover:text-white'
                )}
              >
                Shop Treatments
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main nav */}
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="flex flex-col">
              <span
                className={cn(
                  'font-display text-xl md:text-2xl font-light tracking-wider transition-colors leading-none',
                  scrolled || !isHome ? 'text-dark-50' : 'text-white'
                )}
              >
                Manhattan
              </span>
              <span
                className={cn(
                  'font-display text-xl md:text-2xl font-light tracking-widest2 transition-colors leading-none',
                  scrolled || !isHome ? 'text-mauve-500' : 'text-mauve-300'
                )}
              >
                Laser Spa
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={cn(
                      'flex items-center gap-1 text-xs font-medium tracking-widest uppercase transition-colors',
                      scrolled || !isHome
                        ? 'text-dark-50/70 hover:text-mauve'
                        : 'text-white/70 hover:text-white',
                      pathname.startsWith('/services') && (scrolled || !isHome)
                        ? 'text-mauve'
                        : ''
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      size={12}
                      className={cn(
                        'transition-transform duration-200',
                        activeDropdown === link.label ? 'rotate-180' : ''
                      )}
                    />
                  </button>

                  {/* Mega dropdown */}
                  <div
                    className={cn(
                      'absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200',
                      activeDropdown === link.label
                        ? 'opacity-100 pointer-events-auto translate-y-0'
                        : 'opacity-0 pointer-events-none -translate-y-2'
                    )}
                  >
                    <div className="bg-white rounded-2xl shadow-luxury-lg border border-cream-200 p-6 w-[640px] grid grid-cols-3 gap-4">
                      {services.map((cat) => (
                        <div key={cat.label}>
                          <Link
                            href={cat.href}
                            className="block text-2xs font-semibold tracking-widest uppercase text-mauve mb-2 hover:text-mauve-600 transition-colors"
                          >
                            {cat.label}
                          </Link>
                          <ul className="space-y-1">
                            {cat.items.map((item) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  className="text-xs text-dark-50/60 hover:text-dark-50 transition-colors leading-relaxed"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'text-xs font-medium tracking-widest uppercase transition-colors',
                    scrolled || !isHome
                      ? 'text-dark-50/70 hover:text-mauve'
                      : 'text-white/70 hover:text-white',
                    pathname === link.href && (scrolled || !isHome) ? 'text-mauve' : ''
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className={cn(
                'relative p-2 transition-colors',
                scrolled || !isHome
                  ? 'text-dark-50/70 hover:text-mauve'
                  : 'text-white/70 hover:text-white'
              )}
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-mauve text-white text-2xs font-bold flex items-center justify-center leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <Button
              variant="primary"
              size="sm"
              asChild
              className="hidden md:inline-flex"
            >
              <Link href="/contact">Book Now</Link>
            </Button>

            {/* Mobile menu toggle */}
            <button
              className={cn(
                'lg:hidden p-2 transition-colors',
                scrolled || !isHome ? 'text-dark-50' : 'text-white'
              )}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-500 ease-luxury bg-white border-t border-cream-200',
          mobileOpen ? 'max-h-screen' : 'max-h-0'
        )}
      >
        <Container>
          <nav className="py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'block py-3 text-sm font-medium tracking-widest uppercase border-b border-cream-100 transition-colors',
                  pathname === link.href ? 'text-mauve' : 'text-dark-50/70'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Button variant="primary" size="lg" className="w-full">
                <Link href="/contact">Book a Consultation</Link>
              </Button>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  )
}
