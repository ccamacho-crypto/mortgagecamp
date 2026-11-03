import { Link, useNavigate, useLocation } from 'react-router';
import { Menu, X, Phone } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const navLinks = [
  { label: "Today's Rates", href: '/rates' },
  { label: 'Loan Options', href: '/loans' },
  { label: 'Why Us', href: '/why' },
  { label: 'Rate Factors', href: '/rates#factors' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Process', href: '/process' },
  { label: 'Reviews', href: '/reviews' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (window.scrollY > 20) {
        // Scrolled down — set immediately
        if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
        setScrolled(true);
      } else {
        // Back near top — delay the reset so hash-nav scroll jumps don't flicker
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => setScrolled(false), 150);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, []);

  // Smooth-scroll to #schedule without triggering a page reload / scroll-reset
  const handleSchedule = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname === '/') {
      document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#schedule');
    }
  }, [location.pathname, navigate]);



  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background"
      style={{
        boxShadow: scrolled
          ? '0 2px 20px hsl(var(--primary) / 0.10)'
          : '0 1px 0 hsl(var(--border))',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0" aria-label="Mortgage Camp home">
          <img
            src={`${import.meta.env.BASE_URL}assets/mortgagecamp-logo.png`}
            alt="Mortgage Camp"
            className="block h-auto w-auto object-contain self-center"
            style={{ maxHeight: '52px', maxWidth: '200px' }}
            loading="eager"
            fetchPriority="high"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium italic text-gold-metallic hover:opacity-80 transition-opacity duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+17863974552"
            className="flex items-center gap-1.5 text-sm font-medium text-gold-metallic hover:opacity-80 transition-opacity"
          >
            <Phone size={14} />
            (786) 397-4552
          </a>
          <a
            href="/#schedule"
            onClick={handleSchedule}
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-gold-metallic text-background transition-all duration-150 hover:opacity-90"
          >
            Schedule a Call
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-md text-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-navigation" className="lg:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium py-1 text-foreground hover:text-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/#schedule"
            onClick={handleSchedule}
            className="mt-2 text-sm font-semibold px-4 py-2.5 rounded-lg text-center bg-primary text-primary-foreground"
          >
            Schedule a Free Call
          </a>
          <a href="tel:+17863974552" className="text-sm font-medium text-center text-primary">
            📞 (786) 397-4552
          </a>
        </div>
      )}
    </header>
  );
}
