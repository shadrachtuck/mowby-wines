import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

const DEFAULT_NAV_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Shop', path: '/shop' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

/**
 * Active state only: each nav slot has its own color. Home (0) = Seaweed + dark text.
 * Inactive links stay neutral (no fill).
 */
const NAV_ACTIVE_STYLES = [
  { bg: 'bg-mowby-seaweed', text: 'text-[#1e1e1e]' },
  { bg: 'bg-mowby-sea-lemon', text: 'text-gray-900' },
  /** Shop — `mowby-blue`, same as primary buttons */
  { bg: 'bg-mowby-blue', text: 'text-white' },
  /** Blog — coral */
  { bg: 'bg-mowby-coral', text: 'text-gray-900' },
  { bg: 'bg-mowby-red-fishy', text: 'text-white' },
];

const NAV_INACTIVE_CLASS =
  'text-gray-700 hover:text-mowby-blue bg-transparent font-normal';

const NAV_INACTIVE_CLASS_MOBILE =
  'text-gray-700 hover:text-mowby-blue hover:bg-mowby-cream/80 font-normal';

function navItemClasses(index, active, variant = 'desktop') {
  if (!active) {
    return variant === 'mobile' ? NAV_INACTIVE_CLASS_MOBILE : NAV_INACTIVE_CLASS;
  }
  const s = NAV_ACTIVE_STYLES[index % NAV_ACTIVE_STYLES.length];
  return `${s.bg} ${s.text} font-semibold`;
}

function normalizeHref(path) {
  if (!path || typeof path !== 'string') return '/';
  const p = path.trim();
  if (!p) return '/';
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return p.startsWith('/') ? p : `/${p}`;
}

export default function WineNavigation({ siteGlobals }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rawNav = siteGlobals?.header?.navItems;
  const navItems =
    rawNav?.length > 0
      ? rawNav
          .filter((row) => row?.label?.trim() && row?.path)
          .map((row) => ({
            name: row.label.trim(),
            path: normalizeHref(row.path),
          }))
      : DEFAULT_NAV_ITEMS;

  const ctaLabel = siteGlobals?.header?.cta?.label?.trim() || 'Reserve a Bottle';
  const ctaHref = normalizeHref(siteGlobals?.header?.cta?.path) || '/shop';
  const ctaExternal =
    ctaHref.startsWith('http://') || ctaHref.startsWith('https://');

  const isActive = (path) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  const NavLink = ({ href, children, className, onClick }) => {
    const external = href.startsWith('http://') || href.startsWith('https://');
    if (external) {
      return (
        <a href={href} className={className} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-mowby-cream/95 backdrop-blur-sm shadow-mowby-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center">
            <img
              src="/mowby-assets/mowby-wines-transparent-logo.png"
              alt="Mowby Wines"
              className="h-28 w-auto md:h-[7.25rem]"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <NavLink key={`${item.name}-${item.path}`} href={item.path}>
                <span
                  className={`text-sm font-sans transition-colors inline-flex items-center px-3 py-2 rounded-[10px] ${navItemClasses(
                    index,
                    isActive(item.path),
                    'desktop'
                  )}`}
                >
                  {item.name}
                </span>
              </NavLink>
            ))}
          </div>

          <div className="hidden md:block">
            {ctaExternal ? (
              <Button asChild className="h-10 min-h-10 rounded-xl px-6 py-0 font-sans">
                <a href={ctaHref}>{ctaLabel}</a>
              </Button>
            ) : (
              <Button asChild className="h-10 min-h-10 rounded-xl px-6 py-0 font-sans">
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-mowby-blue transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-[30px] h-[30px]" /> : <Menu className="w-[30px] h-[30px]" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-mowby-cream/98 backdrop-blur-md shadow-[0_-4px_16px_-6px_rgba(0,0,0,0.07)]">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item, index) => (
              <NavLink
                key={`${item.name}-${item.path}`}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div
                  className={`block px-4 py-2 rounded-[10px] font-sans transition-colors ${navItemClasses(
                    index,
                    isActive(item.path),
                    'mobile'
                  )}`}
                >
                  {item.name}
                </div>
              </NavLink>
            ))}
            {ctaExternal ? (
              <Button
                asChild
                className="w-full h-12 min-h-12 text-base rounded-[10px] py-0 font-sans"
              >
                <a href={ctaHref} onClick={() => setMobileMenuOpen(false)}>
                  {ctaLabel}
                </a>
              </Button>
            ) : (
              <Button
                asChild
                className="w-full h-12 min-h-12 text-base rounded-[10px] py-0 font-sans"
              >
                <Link href={ctaHref} onClick={() => setMobileMenuOpen(false)}>
                  {ctaLabel}
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
