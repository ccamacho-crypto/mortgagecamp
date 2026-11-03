import { useEffect, useRef } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { buildHomepageJsonLd } from '@/lib/organization-json-ld';
import ConsultationForm from '@/components/ConsultationForm';

const siteUrl = 'https://www.mortgagecamp.pro';
const pageTitle = 'Mortgage Camp | Trusted Mortgage Broker | Best Rates in Florida';
const pageDesc =
  'Mortgage Camp offers ultra-competitive mortgage rates, full-transparency service, and concierge support for home buyers, refinancers, and investors. FHA, VA, Conventional, Jumbo & HELOC. Call (786) 397-4552.';

const homepageJsonLd = buildHomepageJsonLd({
  siteUrl,
  organizationName: 'Mortgage Camp',
  logo: siteUrl + '/logo.png',
  datePublished: '2026-10-29',
  dateModified: '2026-10-29',
});

const financialServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['FinancialService', 'LocalBusiness'],
  name: 'Mortgage Camp',
  description:
    'Trusted mortgage broker offering competitive rates, full-transparency service, and concierge support for home buyers, refinancers, and investors.',
  url: siteUrl,
  telephone: '+17863974552',
  email: 'info@mortgagecamp.pro',
  priceRange: '$$',
  areaServed: 'Florida',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Mortgage Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Home Purchase Loans' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mortgage Refinancing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'HELOC / Home Equity Loans' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'VA Loans' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'FHA Loans' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Jumbo Loans' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Investment Property Loans' } },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '100',
    bestRating: '5',
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Adam G.' },
      reviewRating: { '@type': 'Rating', ratingValue: '5' },
      reviewBody:
        "The team was incredibly communicative and helpful. I always felt confident and secure throughout the entire process. Best mortgage experience I've ever had.",
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Gregory L.' },
      reviewRating: { '@type': 'Rating', ratingValue: '5' },
      reviewBody:
        'Within a few business days we got pre-approved and ended up with our dream home. Supported immensely throughout the journey without any hiccups.',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Michael G.' },
      reviewRating: { '@type': 'Rating', ratingValue: '5' },
      reviewBody:
        'Responsive, knowledgeable, transparent, and genuinely cared about helping me. What had been a stressful experience felt smooth and manageable.',
    },
  ],
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gold-metallic">
      {children}
    </p>
  );
}

function WhyCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-card rounded-xl p-5 flex gap-4 items-start border border-border shadow-sm hover:shadow-md transition-shadow"
    >
      <div
        className="w-11 h-11 min-w-11 rounded-xl flex items-center justify-center text-xl"
        style={{ background: 'hsl(var(--primary) / 0.08)' }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function LoanSubOpt({ title, desc }: { title: string; desc: string }) {
  return (
    <a
      href="#schedule"
      className="block rounded-xl p-4 border border-border bg-muted transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary"
    >
      <p className="text-sm font-bold text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </a>
  );
}

function LoanBlock({
  icon,
  title,
  desc,
  children,
}: {
  icon: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-card rounded-2xl border border-border p-6 mb-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4 items-start mb-5">
        <span className="text-3xl mt-0.5" aria-hidden="true">{icon}</span>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{children}</div>
    </motion.div>
  );
}

function RateFactor({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      <div className="text-2xl mb-3" aria-hidden="true">{icon}</div>
      <h3 className="text-sm font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function CalcCard({
  href,
  icon,
  title,
  desc,
  tag,
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
  tag: string;
}) {
  return (
    <motion.a
      variants={fadeUp}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-card rounded-xl border border-border p-5 flex flex-col gap-2 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
    >
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-secondary transition-colors">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">{desc}</p>
      <span
        className="inline-flex items-center text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full w-fit text-gold-metallic" style={{ background: 'hsl(var(--gold-glow) / 0.1)' }}
      >
        {tag}
      </span>
    </motion.a>
  );
}

export default function HomePage() {
  const heroBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroBgRef.current) {
        const scrollY = window.scrollY;
        heroBgRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intercept all same-page #hash anchor clicks and smooth-scroll instead of
  // letting the browser push a new history entry (which resets scrollY to 0,
  // snaps the parallax image, and flips the header shadow).
  useEffect(() => {
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    document.addEventListener('click', handleHashClick);
    return () => document.removeEventListener('click', handleHashClick);
  }, []);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={siteUrl + '/'} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl + '/'} />
        <meta property="og:image" content={siteUrl + '/og-image.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={siteUrl + '/og-image.png'} />
        <script type="application/ld+json">
          {JSON.stringify(homepageJsonLd).replace(/</g, '\u003c')}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(financialServiceJsonLd).replace(/</g, '\u003c')}
        </script>
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section
          id="home"
          aria-labelledby="hero-heading"
          className="relative overflow-hidden pt-28 pb-20 px-6"
          style={{ scrollMarginTop: '64px' }}
        >
          {/* Parallax background image */}
          <div
            ref={heroBgRef}
            className="absolute inset-0 pointer-events-none will-change-transform"
            aria-hidden="true"
            style={{
              backgroundImage: `url(${import.meta.env.BASE_URL}assets/mortgagecamp-hero.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              top: '-20%',
              bottom: '-20%',
            }}
          />
          {/* Dark overlay for text legibility */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: 'linear-gradient(135deg, hsl(var(--noir-surface) / 0.465) 0%, hsl(var(--noir-surface) / 0.39) 50%, hsl(var(--noir-surface) / 0.275) 100%)' }}
          />
          <div
            className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 70% 80% at 80% 30%, hsl(var(--primary) / 0.06) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse at 0% 100%, hsl(var(--primary) / 0.15) 0%, transparent 60%)',
            }}
          />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp}>
                <span
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 border bg-gold-shimmer-once"
                  style={{
                    borderColor: 'hsl(var(--gold-glow) / 0.6)',
                    color: 'hsl(var(--gold-on-shimmer))',
                  }}
                >
                  ★ Your Trusted Mortgage Broker
                </span>
              </motion.div>

              <motion.h1
                id="hero-heading"
                variants={fadeUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 text-primary-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Your mortgage,{' '}
                <em className="not-italic text-gold-metallic">your terms.</em>{' '}
                Zero compromises.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: 'hsl(var(--primary-foreground) / 0.8)' }}
              >
                Ultra-competitive rates. Full-transparency options. Concierge service from real
                people who put your financial future first — not their bottom line.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
                <a
                  href="#schedule"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base bg-gold-metallic hover:-translate-y-0.5 shadow-lg transition-all duration-200"
                  style={{ boxShadow: '0 4px 24px hsl(var(--gold-glow) / 0.45)' }}
                >
                  📅 Schedule a Free Call
                </a>
                <a
                  href="#loans"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base border transition-all duration-200 hover:bg-white/5 text-gold-metallic" style={{ borderColor: 'hsl(var(--gold-glow) / 0.55)' }}
                >
                  Explore Loan Options
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-8">
                {[
                  { num: '100+', label: 'Reviews' },
                  { num: '2k+', label: 'Happy Homeowners' },
                  { num: '10+', label: 'Years Experience' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-extrabold text-gold-metallic">{s.num}</div>
                    <div className="text-xs mt-0.5 text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Consultation form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
              id="schedule"
              className="bg-card rounded-2xl border border-border relative"
              style={{ boxShadow: '0 8px 40px hsl(var(--gold-glow) / 0.22)', scrollMarginTop: '80px' }}
            >
              <div
                className="absolute top-0 left-8 right-8 h-0.5 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
                }}
                aria-hidden="true"
              />
              <div className="p-7">
                <p className="text-xs font-bold uppercase tracking-widest mb-1 text-gold-metallic">
                  Get Started Today
                </p>
                <h2
                  className="text-xl font-bold text-foreground mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Schedule Your Free Consultation
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Talk to a mortgage expert in minutes. No pressure, no pushy sales.
                </p>
                <ConsultationForm />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── WHY US ── */}
        <section
          id="why"
          aria-labelledby="why-heading"
          className="py-24 px-6 bg-muted"
        >
          <div className="max-w-7xl mx-auto">
            <SectionLabel>Why Mortgage Camp</SectionLabel>
            <h2
              id="why-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              You deserve <em className="not-italic text-gold-metallic">confidence</em> and clarity.
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mb-12 leading-relaxed">
              Mortgage shopping is confusing. Pushy lenders rocket you through a loan without
              showing all your options. We do things differently.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col gap-4"
              >
                <WhyCard
                  icon="🏦"
                  title="Lender Matching"
                  desc="We shop your loan across multiple lenders to find the ideal match for your unique situation."
                />
                <WhyCard
                  icon="👁️"
                  title="See Every Option"
                  desc="We show you the actual rates available for your personal circumstances — no hidden fees, no surprises."
                />
                <WhyCard
                  icon="🧭"
                  title="Unbiased Advice"
                  desc="We recommend the ideal option based on your goals, not our commission. Your win is our win."
                />
                <WhyCard
                  icon="🤝"
                  title="Concierge Service"
                  desc="Your dedicated concierge team keeps you informed at every step — from application to close."
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: 'easeOut' as const }}
                className="rounded-2xl p-8 relative overflow-hidden bg-gold-shimmer-once"
                style={{
                  boxShadow: '0 0 48px hsl(var(--gold-glow) / 0.45), 0 2px 0 hsl(var(--gold-glow) / 0.6) inset',
                  border: '1px solid hsl(var(--gold-glow) / 0.5)',
                }}
              >
                {/* Shimmer top-edge accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 bg-gold-shimmer-once"
                  aria-hidden="true"
                />
                {/* Subtle dark veil so text stays legible over the bright shimmer */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  aria-hidden="true"
                  style={{ background: 'hsl(var(--gold-on-shimmer) / 0.18)' }}
                />
                <div
                  className="absolute top-4 left-6 text-8xl font-serif leading-none pointer-events-none select-none"
                  style={{ color: 'hsl(var(--gold-on-shimmer) / 0.10)' }}
                  aria-hidden="true"
                >
                  "
                </div>
                <p
                  className="text-xl font-bold leading-relaxed mb-6 relative"
                  style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--gold-on-shimmer))' }}
                >
                  Our Full-Transparency Promise — you&apos;ll never be left in the dark about your
                  mortgage.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    'No hidden costs or shady fine print',
                    'Real rates based on your actual profile',
                    'Side-by-side lender comparison',
                    'Fast, efficient closings — no delays',
                    'Human experts, not AI bots',
                    'Ongoing rate monitoring after closing',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm font-semibold"
                      style={{ color: 'hsl(var(--gold-on-shimmer) / 0.85)' }}
                    >
                      <span
                        className="w-5 h-5 min-w-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'hsl(var(--gold-on-shimmer) / 0.18)', color: 'hsl(var(--gold-on-shimmer))' }}
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a
                    href="#schedule"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90"
                    style={{
                      background: 'hsl(var(--gold-on-shimmer))',
                      color: 'hsl(var(--primary))',
                    }}
                  >
                    Get Expert Guidance →
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── LOAN OPTIONS ── */}
        <section id="loans" aria-labelledby="loans-heading" className="py-24 px-6 bg-background" style={{ scrollMarginTop: '64px' }}>
          <div className="max-w-7xl mx-auto">
            <SectionLabel>Loan Options</SectionLabel>
            <h2
              id="loans-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Every path to homeownership,{' '}
              <em className="not-italic text-gold-metallic">covered.</em>
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mb-10 leading-relaxed">
              Whether you're buying your first home, refinancing, investing, or tapping equity — we
              have a program for your exact situation.
            </p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <LoanBlock icon="🏡" title="I'm Buying" desc="First-time buyer? Second home? Investment property? We'll guide you to the right mortgage for your situation.">
                <LoanSubOpt title="First-Time Homebuyer" desc="Down payment options, credit requirements, and programs designed for first-time buyers." />
                <LoanSubOpt title="Second Home" desc="Financing a vacation home or second property. Down payments, rates, and requirements explained." />
                <LoanSubOpt title="Investment Property" desc="Buying a rental property? Loan options, down payments, and financing strategies for investors." />
                <LoanSubOpt title="Family Buyout" desc="Buying from parents or other family members — gift of equity, family sale transactions explained." />
                <LoanSubOpt title="New Construction" desc="Construction loans and builder incentives for new builds and custom homes." />
                <LoanSubOpt title="Medical Professionals & Educators" desc="Physician loans, teacher programs, and first-responder homebuying options." />
              </LoanBlock>

              <LoanBlock icon="💸" title="I'm Refinancing" desc="Lower your rate, reduce your payment, access cash, or simplify your finances. We'll find the right approach.">
                <LoanSubOpt title="Lower My Rate" desc="Learn when a rate-and-term refinance makes sense and how much you could save." />
                <LoanSubOpt title="Lower My Payment" desc="Reduce your monthly mortgage payment by extending your term or locking a lower rate." />
                <LoanSubOpt title="Cash-Out Refinance" desc="Turn your home equity into cash for renovations, debt payoff, or other financial goals." />
                <LoanSubOpt title="Debt Consolidation" desc="Consolidate high-interest debt into your mortgage. Simplify payments and lower your rate." />
                <LoanSubOpt title="Divorce Refinance" desc="Options for handling the mortgage through a divorce, including buyouts and removing a spouse." />
                <LoanSubOpt title="Remove a Cosigner" desc="Need to remove a parent or cosigner from your mortgage? We'll guide you through it." />
              </LoanBlock>

              <LoanBlock icon="📈" title="I'm Investing" desc="Build your real estate portfolio with the right financing partner — from first rentals to commercial.">
                <LoanSubOpt title="Rental Properties" desc="Single-family rentals and small portfolios — loan options, down payments, and qualifications." />
                <LoanSubOpt title="Short-Term Rentals (Airbnb / VRBO)" desc="Finance your vacation rental or Airbnb with programs built for short-term rental investors." />
                <LoanSubOpt title="Multi-Family (2–4 Units)" desc="Duplexes, triplexes, and fourplexes — residential loans for multi-family investment properties." />
                <LoanSubOpt title="Commercial Financing" desc="Office, retail, industrial, mixed-use, and other commercial property loans." />
              </LoanBlock>

              <LoanBlock icon="💰" title="I Need Cash — HELOC" desc="Keep your low rate. Access your equity. Apply in 5 minutes, funded in as few as 5 days.">
                <div className="col-span-full grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {[
                    { num: '5 min', label: 'Online application' },
                    { num: '5 days', label: 'Time to funding' },
                    { num: '$25K–$750K', label: 'Borrow amount' },
                    { num: '600+', label: 'Min. credit score' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-3 text-center border"
                      style={{
                        background: 'hsl(var(--gold-glow) / 0.07)',
                        borderColor: 'hsl(var(--gold-glow) / 0.2)',
                      }}
                    >
                      <span className="block text-base font-extrabold text-gold-metallic">{s.num}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{s.label}</span>
                    </div>
                  ))}
                </div>
                <LoanSubOpt title="No Cash Out of Pocket" desc="Closing costs are rolled into your loan balance — you bring nothing to the table." />
                <LoanSubOpt title="No Appraisal Needed" desc="Automated property valuation — no need to schedule or pay for an in-person appraisal." />
                <LoanSubOpt title="Flexible Terms" desc="Choose from 10, 15, 20, or 30-year terms with fixed-rate, mortgage-style payments." />
                <LoanSubOpt title="Popular Uses" desc="Renovations, debt consolidation (avg. credit card APR 28%+), bridge financing, medical bills, education, business capital." />
              </LoanBlock>

              <LoanBlock icon="🏛️" title="Loan Programs" desc="Traditional and flexible loan programs to match any financial situation — we'll create your tailored strategy.">
                <LoanSubOpt title="Conventional Loans" desc="Ideal for borrowers with strong credit and steady income. Competitive terms, hassle-free processing." />
                <LoanSubOpt title="FHA Loans" desc="Lower down payments, flexible credit requirements. Makes homeownership accessible for more buyers." />
                <LoanSubOpt title="VA Loans" desc="For veterans, active-duty service members, and spouses. No down payment, lower rates. Your service deserves these benefits." />
                <LoanSubOpt title="Jumbo Loans" desc="Finance high-value homes beyond standard limits — tailored solutions for competitive and luxury markets." />
                <LoanSubOpt title="DSCR & Bank Statement Loans" desc="Qualify based on property cash flow or bank statements — perfect for self-employed investors." />
                <LoanSubOpt title="HomeReady, Bridge & Specialty" desc="HomeReady / Home Possible, bridge loans, foreign national loans, non-warrantable condos, renovation and construction loans." />
              </LoanBlock>

              <LoanBlock icon="⚙️" title="Loan Features" desc="Beyond the basics — combine these features with any loan program to create the right solution for you.">
                <LoanSubOpt title="3-2-1 Buydown" desc="Reduce your rate by 3% in year one, 2% in year two, 1% in year three. Great when sellers offer concessions." />
                <LoanSubOpt title="2-1 Buydown" desc="Lower your rate by 2% in year one and 1% in year two — a popular option for easing into your payment." />
                <LoanSubOpt title="Permanent Buydown" desc="Pay discount points upfront to permanently reduce your interest rate for the life of your loan." />
                <LoanSubOpt title="Interest-Only Payments" desc="Pay only interest for an initial period — keeping monthly payments lower while you get established." />
                <LoanSubOpt title="100% Financing" desc="Buy a home with no down payment through VA, USDA, or down payment assistance programs." />
                <LoanSubOpt title="Low Down Payment" desc="As little as 3% down with conventional loans or 3.5% with FHA — keep more cash in your pocket." />
              </LoanBlock>
            </motion.div>
          </div>
        </section>

        {/* ── RATE FACTORS ── */}
        <section id="rates" aria-labelledby="rates-heading" className="py-24 px-6 bg-muted">
          <div className="max-w-7xl mx-auto">
            <SectionLabel>Today's Rates</SectionLabel>
            <h2
              id="rates-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Factors that affect <em className="not-italic text-gold-metallic">YOUR</em> rate
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mb-12 leading-relaxed">
              You'll see rates everywhere online, but they're riddled with assumptions. Your rate is
              the rate YOU choose — and the reality is you have many rates available to you.
            </p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
            >
              <RateFactor icon="📊" title="Credit Score" desc="Higher scores unlock better rates. Even a 20-point difference can impact your rate and available options." />
              <RateFactor icon="💵" title="Down Payment Amount" desc="5%, 10%, 20% or more? Each tier can mean different rates, loan options, and PMI requirements." />
              <RateFactor icon="🏠" title="Property Type" desc="Single-family, condo, multi-unit? Each property type carries different rate adjustments." />
              <RateFactor icon="💎" title="Points vs. No Points" desc="Pay points for a lower rate or get lender credits for a higher rate — you choose what fits your goals." />
              <RateFactor icon="💼" title="Cash at Closing" desc="Need less cash upfront? We can structure your rate to reduce closing costs and keep money in your pocket." />
              <RateFactor icon="🎯" title="Loan Purpose" desc="Purchase, rate/term refinance, or cash-out? Each has different pricing structures with us." />
              <RateFactor icon="🏡" title="Occupancy Type" desc="Primary home, second home, or investment property? Rates vary by how you intend to use the property." />
              <RateFactor icon="🏛️" title="Loan Program" desc="Conventional, FHA, VA, Jumbo — each program has unique rate structures. We find your best match." />
              <RateFactor icon="⚖️" title="Debt-to-Income Ratio" desc="Your monthly debts vs. income affects loan pricing and the options available to you at closing." />
            </motion.div>

            {/* Rate table example */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
              className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-1 text-gold-metallic">
                Example: Same loan, different rate options
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                You have many rates available for the same scenario — here's what that looks like on a $350,000 loan:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {['Rate', 'APR', 'Points', 'Cash at Closing', 'Monthly Payment'].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-foreground">6.500%</td>
                      <td className="py-3 px-4 text-foreground">6.625%</td>
                      <td className="py-3 px-4 text-success">-1.00 (Credit)</td>
                      <td className="py-3 px-4 text-foreground">$68,500</td>
                      <td className="py-3 px-4 text-foreground">$2,212</td>
                    </tr>
                    <tr className="border-b border-border bg-primary/5">
                      <td className="py-3 px-4 font-semibold text-gold-metallic">6.250%</td>
                      <td className="py-3 px-4 font-semibold text-gold-metallic">6.395%</td>
                      <td className="py-3 px-4 font-semibold text-gold-metallic">0.00</td>
                      <td className="py-3 px-4 font-semibold text-gold-metallic">$72,000</td>
                      <td className="py-3 px-4 font-semibold text-gold-metallic">$2,155</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-foreground">6.000%</td>
                      <td className="py-3 px-4 text-foreground">6.185%</td>
                      <td className="py-3 px-4 text-accent">1.00 (Points)</td>
                      <td className="py-3 px-4 text-foreground">$75,500</td>
                      <td className="py-3 px-4 text-foreground">$2,098</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-foreground">5.750%</td>
                      <td className="py-3 px-4 text-foreground">5.985%</td>
                      <td className="py-3 px-4 text-accent">2.00 (Points)</td>
                      <td className="py-3 px-4 text-foreground">$79,000</td>
                      <td className="py-3 px-4 text-foreground">$2,043</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-4 opacity-70">
                Hypothetical example for illustration only. Your options will vary based on your personal scenario.
              </p>
            </motion.div>

            {/* Sample rates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' as const }}
              className="bg-card rounded-2xl border border-border p-6 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-1 text-gold-metallic">
                Sample rates — June 2026
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                These are representative rates. Your actual rate depends on your unique situation. Talk to an expert for a real quote.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {['Loan Type', '30-Year', '15-Year', '10-Year'].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: 'Conventional', y30: '6.875%', apr30: '6.995%', y15: '6.125%', apr15: '6.285%', y10: '5.875%', apr10: '6.095%' },
                      { type: 'FHA', y30: '6.750%', apr30: '7.125%', y15: '6.000%', apr15: '6.395%', y10: '5.750%', apr10: '6.195%' },
                      { type: 'VA', y30: '6.625%', apr30: '6.785%', y15: '5.875%', apr15: '6.095%', y10: '5.625%', apr10: '5.895%' },
                      { type: 'Jumbo', y30: '7.125%', apr30: '7.215%', y15: '6.625%', apr15: '6.745%', y10: '6.375%', apr10: '6.525%' },
                    ].map((row, i) => (
                      <tr key={row.type} className={i < 3 ? 'border-b border-border' : ''}>
                        <td className="py-3 px-4 font-semibold text-foreground">{row.type}</td>
                        <td className="py-3 px-4 text-foreground">{row.y30} <span className="text-xs text-muted-foreground">APR {row.apr30}</span></td>
                        <td className="py-3 px-4 text-foreground">{row.y15} <span className="text-xs text-muted-foreground">APR {row.apr15}</span></td>
                        <td className="py-3 px-4 text-foreground">{row.y10} <span className="text-xs text-muted-foreground">APR {row.apr10}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-4 opacity-70">
                Don't trust what you see online — talk to an expert and get a REAL quote based on your actual scenario.
              </p>
            </motion.div>

            <div className="text-center mt-10">
              <a
                href="#schedule"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base bg-gold-metallic hover:-translate-y-0.5 shadow-lg transition-all duration-200"
                style={{ boxShadow: '0 4px 20px hsl(var(--gold-glow) / 0.35)' }}
              >
                Get My Personalized Rate →
              </a>
            </div>
          </div>
        </section>

        {/* ── CALCULATORS ── */}
        <section id="calculators" aria-labelledby="calculators-heading" className="py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <SectionLabel>Planning Resources</SectionLabel>
            <h2
              id="calculators-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Mortgage <em className="not-italic text-gold-metallic">Calculators</em>
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mb-10 leading-relaxed">
              Plan your home financing with confidence. Each calculator opens in a new tab — powered by Freddie Mac's trusted suite of mortgage calculators.
            </p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <CalcCard href="https://www.mortgagenewsdaily.com/mortgage-rates" icon="🏘️" title="Today's Rates" desc="Daily rate index published weekdays around 4PM EST." tag="Buying" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/rent-vs-buy" icon="🏘️" title="Rent vs. Buy Calculator" desc="Understand the financial differences between renting and owning to make the right decision." tag="Buying" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/how-much-can-you-afford" icon="🏠" title="Homebuying Budget Calculator" desc="Determine how much house works within your budget based on your income and expenses." tag="Buying" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/debt-to-income-ratio-calculator" icon="⚖️" title="Debt-to-Income Ratio Calculator" desc="Assess your financial readiness to buy a home by calculating your debt-to-income ratio." tag="Qualifying" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/housing-expense-ratio-calculator" icon="📊" title="Housing Expense Ratio Calculator" desc="Determine how much of your monthly income goes into your monthly mortgage payment." tag="Qualifying" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/how-much-can-you-borrow" icon="🔢" title="Mortgage Amount Calculator" desc="Estimate how much mortgage you may be able to qualify for based on your financial profile." tag="Qualifying" />
              <CalcCard href="https://www.calculatestuff.com/financial/mortgage-calculator" icon="🔢" title="Mortgage Calculator" desc="Estimate how much mortgage you may be able to qualify for based on your financial profile." tag="Qualifying" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/which-loan-is-better" icon="📋" title="Loan Comparison Calculator" desc="Compare different loans side-by-side and determine which is best for your housing goals." tag="Comparing" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/fixed-rate-mortgages" icon="📌" title="Fixed-Rate Mortgage Calculator" desc="Find out how much your monthly payment might be with a fixed-rate mortgage." tag="Payment" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/adjustable-rate-mortgages" icon="📈" title="Adjustable-Rate Mortgage Calculator" desc="Find out how much your monthly payment might be with an adjustable-rate mortgage." tag="Payment" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/fixed-or-adjustable-rate" icon="🔄" title="Fixed vs. Adjustable Rate Calculator" desc="Compare loan types and determine which is the right choice for your situation." tag="Comparing" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/15-or-30-year-term" icon="📅" title="15-Year vs. 30-Year Term Calculator" desc="Compare how the term of your loan affects your monthly payment and total cost over time." tag="Comparing" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/down-payment" icon="💰" title="Down Payment Calculator" desc="Explore how much money you should put down on your home and how it affects your loan." tag="Buying" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/mortgage-insurance" icon="🛡️" title="PMI Calculator" desc="Find your monthly private mortgage insurance premium based on your down payment amount." tag="Payment" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/closing-costs" icon="📝" title="Closing Costs Calculator" desc="Determine how much you should expect to pay for closing costs when purchasing a home." tag="Buying" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/home-equity-calculator" icon="🏦" title="Home Equity Calculator" desc="Find out how much equity you have in your home based on its current value and loan balance." tag="Equity" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/extra-payments" icon="⚡" title="Extra Payments Calculator" desc="Learn how making extra payments affects your mortgage payoff timeline and total interest paid." tag="Owning" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/tax-savings" icon="💸" title="Tax Savings Calculator" desc="Find out how much you can save on your taxes as a homeowner through mortgage interest deductions." tag="Owning" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/am-i-better-off-refinancing" icon="🔃" title="Refinance Calculator" desc="Determine if refinancing your mortgage makes sense for your situation and financial goals." tag="Refinancing" />
              <CalcCard href="https://myhome.freddiemac.com/resources/calculators/refinancing-costs" icon="🧮" title="Refinancing Cost Calculator" desc="Determine how much it will cost you to refinance your mortgage and whether it's worth it." tag="Refinancing" />
            </motion.div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section id="process" aria-labelledby="process-heading" className="py-24 px-6 bg-muted">
          <div className="max-w-7xl mx-auto">
            <SectionLabel>How It Works</SectionLabel>
            <h2
              id="process-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              From first call to <em className="not-italic text-gold-metallic">closing day</em> — we're with you.
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mb-12 leading-relaxed">
              Four simple steps. One dedicated team. A mortgage experience you'll actually enjoy.
            </p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { n: '1', title: 'Schedule a Call', desc: "Book a free 30-minute consultation. We'll review your goals with zero pressure." },
                { n: '2', title: 'See Your Options', desc: 'We shop multiple lenders and show you every real rate available for your situation.' },
                { n: '3', title: 'Choose Your Loan', desc: "Pick the option that fits your goals. We'll guide you with unbiased, expert advice." },
                { n: '4', title: 'Close with Confidence', desc: 'Your concierge team handles everything — fast, smooth, and transparent to the end.' },
              ].map((step) => (
                <motion.div key={step.n} variants={fadeUp} className="text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-extrabold mx-auto mb-4 bg-gold-metallic">
                    {step.n}
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="reviews" aria-labelledby="reviews-heading" className="py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <SectionLabel>Client Reviews</SectionLabel>
            <h2
              id="reviews-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              A five-star experience you can{' '}
              <em className="not-italic text-gold-metallic">actually enjoy.</em>
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mb-12 leading-relaxed">
              Don't take our word for it. Here's what our clients say about working with Mortgage Camp.
            </p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { initials: 'AG', name: 'Adam G.', text: "\"The team was incredibly communicative and helpful. I always felt confident and secure throughout the entire process. Best mortgage experience I've ever had.\"" },
                { initials: 'GL', name: 'Gregory L.', text: '"Within a few business days we got pre-approved and ended up with our dream home. Supported immensely throughout the journey without any hiccups."' },
                { initials: 'MG', name: 'Michael G.', text: '"Responsive, knowledgeable, transparent, and genuinely cared about helping me. What had been a stressful experience felt smooth and manageable."' },
              ].map((r) => (
                <motion.div
                  key={r.name}
                  variants={fadeUp}
                  className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-base mb-4 tracking-widest text-gold-metallic" aria-label="5 stars">★★★★★</div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic mb-5">{r.text}</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border text-gold-metallic"
                      style={{
                        background: 'hsl(var(--gold-glow) / 0.1)',
                        borderColor: 'hsl(var(--gold-glow) / 0.25)',
                      }}
                    >
                      {r.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">Verified Google Review</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── OB WIDGET ── */}
        <section id="WIDGET" aria-labelledby="widget-heading" className="py-16 px-6 bg-muted">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-secondary">
              Live Market Intelligence
            </p>
            <h2
              id="widget-heading"
              className="text-2xl md:text-3xl font-bold text-foreground mb-8"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Today's <em className="not-italic text-gold-metallic">mortgage market</em> at a glance
            </h2>
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex justify-center overflow-hidden">
              <iframe
                src="https://www2.optimalblue.com/OBMMI/widgetConfig.php"
                width="750"
                height="462"
                frameBorder={0}
                scrolling="no"
                title="Optimal Blue Mortgage Market Indices"
                style={{ maxWidth: '100%', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section aria-label="Call to action" className="py-10 px-6 bg-primary">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">📅</span>
              <div>
                <h2 className="text-lg font-bold text-primary-foreground">Ready to get started?</h2>
                <p className="text-sm" style={{ color: 'hsl(var(--primary-foreground) / 0.75)' }}>
                  Schedule a free call and get the confidence and clarity you deserve.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="#schedule"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-primary-foreground text-primary transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
              >
                Schedule a Free Call
              </a>
              <a
                href="tel:+17863974552"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-primary-foreground border transition-all duration-200 hover:opacity-90"
                style={{ borderColor: 'hsl(var(--primary-foreground) / 0.3)' }}
              >
                📞 (786) 397-4552
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
