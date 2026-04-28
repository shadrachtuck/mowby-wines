import { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const DEFAULT_FOOTER_NAV = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const DEFAULT_LEGAL_LINKS = [
  { label: 'Privacy Policy', url: '#' },
  { label: 'Terms & Conditions', url: '#' },
  { label: 'Shipping Policy', url: '#' },
  { label: 'Other', url: '#' },
];

function normalizeHref(path) {
  if (!path || typeof path !== 'string') return '#';
  const p = path.trim();
  if (!p) return '#';
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return p.startsWith('/') ? p : `/${p}`;
}

function acfImageUrl(imageField) {
  if (!imageField) return null;
  return imageField.node?.sourceUrl ?? null;
}

function acfImageAlt(imageField, fallback = '') {
  if (!imageField) return fallback;
  return imageField?.node?.altText ?? fallback;
}

export default function WineFooter({ siteGlobals }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const footer = siteGlobals?.footer ?? {};

  const navHeading = footer.navHeading?.trim() || 'Navigation';
  const legalHeading = footer.legalHeading?.trim() || 'Legal';
  const socialHeading = footer.socialHeading?.trim() || 'Social';

  const rawFooterNav = footer.footerNavItems;
  const navLinks =
    rawFooterNav?.length > 0
      ? rawFooterNav
          .filter((row) => row?.label?.trim() && row?.path)
          .map((row) => ({
            name: row.label.trim(),
            path: normalizeHref(row.path),
          }))
      : DEFAULT_FOOTER_NAV;

  const rawLegal = footer.legalLinks;
  const legalLinks =
    rawLegal?.length > 0
      ? rawLegal.filter((row) => row?.label?.trim())
      : DEFAULT_LEGAL_LINKS;

  const nl = footer.newsletter ?? {};
  const newsletterHeading = nl.heading?.trim() || 'Subscribe to our newsletter!';
  const newsletterPlaceholder = nl.placeholder?.trim() || 'you@example.com';
  const submitLabel = nl.submitLabel?.trim() || 'Submit';
  const successMessage = nl.successMessage?.trim() || 'Thanks for subscribing!';

  const instagramUrl = (footer.instagramUrl && footer.instagramUrl.trim()) || 'https://instagram.com';
  const facebookUrl = (footer.facebookUrl && footer.facebookUrl.trim()) || 'https://facebook.com';

  const logoSrc = acfImageUrl(footer.footerLogo) || '/mowby-assets/mowby-wines-transparent-logo.png';
  const logoAlt = acfImageAlt(footer.footerLogo, 'Mowby Wines');

  const copyright =
    footer.copyright?.trim() ||
    '© 2026 Mowby Wines; Site built, designed, & maintained by Mishap Creative Works';

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      const existing = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
      localStorage.setItem(
        'newsletterSubscribers',
        JSON.stringify([...existing, { email, timestamp: Date.now() }])
      );
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const FooterNavLink = ({ href, children, className }) => {
    const external = href.startsWith('http://') || href.startsWith('https://');
    if (external) {
      return (
        <a href={href} className={className}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  };

  return (
    <footer className="bg-mowby-cream py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12 md:mb-16">
          <div className="order-1 flex justify-center md:order-3 md:items-center">
            <Link href="/" className="block">
              <img
                src={logoSrc}
                alt={logoAlt}
                className="h-64 w-auto max-w-[min(100%,360px)] object-contain sm:h-72 sm:max-w-[420px] md:h-72 md:max-w-none lg:h-64"
              />
            </Link>
          </div>

          <div className="order-2 grid grid-cols-2 gap-x-8 gap-y-0 md:contents">
            <div className="md:order-2">
              <h3 className="text-2xl md:text-3xl font-display text-black tracking-tight uppercase mb-6">
                {navHeading}
              </h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={`${link.name}-${link.path}`}>
                    <FooterNavLink
                      href={link.path}
                      className="text-black hover:opacity-70 text-base transition-opacity font-sans"
                    >
                      {link.name}
                    </FooterNavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right md:order-4">
              <h3 className="text-2xl md:text-3xl font-display text-black tracking-tight uppercase mb-6">
                {legalHeading}
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.url?.trim() || '#'}
                      className="text-black hover:opacity-70 text-base transition-opacity font-sans block"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="order-3 flex flex-col items-center md:order-5 md:col-span-4">
            <p className="text-base font-semibold text-black mb-4 font-sans">{newsletterHeading}</p>
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-3 w-full max-w-[340px]">
                <Input
                  type="email"
                  placeholder={newsletterPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 min-w-0"
                />
                <Button
                  type="submit"
                  className="px-6 py-3 h-auto text-base font-sans shrink-0"
                >
                  {submitLabel}
                </Button>
              </form>
            ) : (
              <p className="text-base text-mowby-seaweed font-medium font-sans">{successMessage}</p>
            )}
          </div>

          <div className="order-4 text-center md:order-1 md:text-left">
            <h3 className="text-2xl md:text-3xl font-display text-black tracking-tight uppercase mb-6">
              {socialHeading}
            </h3>
            <div className="flex justify-center gap-4 md:justify-start">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 text-black hover:opacity-70 transition-opacity"
                aria-label="Instagram"
              >
                <Instagram className="w-full h-full" strokeWidth={1.5} />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 text-black hover:opacity-70 transition-opacity"
                aria-label="Facebook"
              >
                <Facebook className="w-full h-full" fill="currentColor" />
              </a>
            </div>
          </div>
        </div>

        <p className="text-sm text-black text-left md:text-center font-sans whitespace-pre-line">{copyright}</p>
      </div>
    </footer>
  );
}
