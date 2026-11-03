import { Link, useLocation, useNavigate } from 'react-router';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHashLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const hash = href.replace('/#', '');
    if (location.pathname === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(href);
    }
  };

  return (
    <footer
      className="text-muted-foreground"
      style={{ background: 'hsl(var(--noir-footer))' }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Grid */}
        <div
          className="grid gap-10 mb-12"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
        >
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4" aria-label="Mortgage Camp home">
              <img
                src={`${import.meta.env.BASE_URL}assets/mortgagecamp-logo.png`}
                alt="Mortgage Camp"
                className="block h-auto w-auto object-contain"
                style={{ maxHeight: '48px', maxWidth: '180px' }}
                loading="lazy"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'hsl(var(--text-light))' }}>
              Your trusted mortgage broker delivering ultra-competitive rates, full-transparency
              options, and concierge service you can actually count on.
            </p>
            <div className="flex flex-col gap-1.5 text-sm">
              <a
                href="tel:+17863974552"
                className="hover:underline text-gold-metallic"
              >
                📞 (786) 397-4552
              </a>
              <a
                href="mailto:info@mortgagecamp.pro"
                className="hover:underline text-gold-metallic"
              >
                ✉️ info@mortgagecamp.pro
              </a>
            </div>
          </div>

          {/* Loan Options */}
          <div>
            <h4
              className="text-sm font-semibold mb-4"
              style={{ color: 'hsl(var(--primary-foreground))' }}
            >
              Loan Options
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                'Purchase Loans',
                'Refinancing',
                'Investment Properties',
                'HELOC / Cash Out',
                'VA Loans',
                'FHA Loans',
                'Jumbo Loans',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="/#loans"
                    onClick={(e) => handleHashLink(e, '/#loans')}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'hsl(var(--text-light))' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="text-sm font-semibold mb-4"
              style={{ color: 'hsl(var(--primary-foreground))' }}
            >
              Company
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'About Us', href: '/#why' },
                { label: 'Testimonials', href: '/#reviews' },
                { label: 'How It Works', href: '/#process' },
                { label: 'Contact Us', href: '/#schedule' },
                { label: 'Schedule a Meeting', href: '/#schedule' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleHashLink(e, item.href)}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'hsl(var(--text-light))' }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4
              className="text-sm font-semibold mb-4"
              style={{ color: 'hsl(var(--primary-foreground))' }}
            >
              Resources
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'First-Time Buyer Guide', href: '/#loans' },
                { label: 'Mortgage Calculators', href: '/calculators' },
                { label: 'Rate Monitoring', href: '/rates' },
                { label: 'Loan Programs', href: '/#loans' },
                { label: 'Education Center', href: '/#schedule' },
                { label: 'FAQ', href: '/#schedule' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    onClick={(e) => item.href.startsWith('/#') ? handleHashLink(e, item.href) : undefined}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'hsl(var(--text-light))' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-wrap items-center justify-between gap-4"
          style={{ borderTop: '1px solid hsl(var(--primary-foreground) / 0.08)' }}
        >
          <p className="text-xs" style={{ color: 'hsl(var(--text-subtle))' }}>
            © 2026 Mortgage Camp. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Licensing'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors hover:text-white"
                style={{ color: 'hsl(var(--text-subtle))' }}
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-xs w-full md:w-auto" style={{ color: 'hsl(var(--text-subtle))' }}>
            NMLS ID # [Your NMLS ID] | Equal Housing Opportunity Lender
          </p>
        </div>
      </div>
    </footer>
  );
}
