import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { PageHero, CtaBanner, SectionLabel, fadeUp, stagger } from '@/components/PageShell';

const WIDGET_CSS = `
  * { box-sizing: border-box; }
  body, html {
    background: #141414 !important;
    color: #F0EAD6 !important;
    font-family: Lato, sans-serif !important;
  }
  body * {
    background-color: transparent !important;
    color: #F0EAD6 !important;
    border-color: #2a2a2a !important;
    font-family: Lato, sans-serif !important;
  }
  table, thead, tbody, tr, td, th,
  div, section, article, aside, header, footer, main, nav,
  [class*="container"], [class*="wrapper"], [class*="panel"],
  [class*="card"], [class*="box"], [class*="widget"], [class*="row"],
  [class*="col"], [class*="block"], [class*="inner"], [class*="outer"] {
    background-color: #141414 !important;
    background: #141414 !important;
    border-color: #2a2a2a !important;
    color: #F0EAD6 !important;
  }
  th, [class*="header"], [class*="heading"], [class*="title"], h1, h2, h3, h4, h5, h6 {
    background-color: #0A0A0A !important;
    background: #0A0A0A !important;
    color: #C9A84C !important;
    font-style: italic !important;
  }
  [class*="rate"], [class*="price"], [class*="value"], [class*="percent"],
  [class*="highlight"], [class*="accent"], [class*="primary"], strong, b {
    color: #C9A84C !important;
  }
  a, [class*="link"] {
    color: #C9A84C !important;
    text-decoration: none !important;
  }
  a:hover { opacity: 0.8 !important; }
  button, [class*="btn"], [type="button"], [type="submit"] {
    background: #C9A84C !important;
    background-color: #C9A84C !important;
    color: #0A0A0A !important;
    border-color: #C9A84C !important;
    border-radius: 6px !important;
    font-weight: 600 !important;
  }
  button:hover, [class*="btn"]:hover {
    background: #B8922A !important;
    background-color: #B8922A !important;
  }
  input, select, textarea {
    background: #0A0A0A !important;
    background-color: #0A0A0A !important;
    color: #F0EAD6 !important;
    border: 1px solid #2a2a2a !important;
    border-radius: 4px !important;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #C9A84C !important;
    outline: none !important;
  }
  label, [class*="label"], [class*="caption"], [class*="subtitle"], [class*="muted"] {
    color: #888 !important;
  }
  [class*="active"], [class*="selected"], [class*="current"] {
    border-color: #C9A84C !important;
    color: #C9A84C !important;
  }
  ::-webkit-scrollbar { width: 6px; background: #0A0A0A; }
  ::-webkit-scrollbar-thumb { background: #C9A84C; border-radius: 3px; }
`;

function useWidgetTheme() {
  useEffect(() => {
    let observer: MutationObserver | null = null;

    const injectIntoIframe = (iframe: HTMLIFrameElement) => {
      const tryInject = () => {
        try {
          const doc = iframe.contentDocument;
          if (!doc || !doc.head) return false;
          if (doc.getElementById('mc-theme')) return true;
          const style = doc.createElement('style');
          style.id = 'mc-theme';
          style.textContent = WIDGET_CSS;
          doc.head.appendChild(style);
          // Also set body bg directly
          if (doc.body) {
            doc.body.style.setProperty('background', '#141414', 'important');
            doc.body.style.setProperty('color', '#F0EAD6', 'important');
          }
          return true;
        } catch {
          return false;
        }
      };

      if (!tryInject()) {
        iframe.addEventListener('load', tryInject);
      }
    };

    const scanForIframes = () => {
      const widget = document.getElementById('WIDGET');
      if (!widget) return;
      widget.querySelectorAll('iframe').forEach((iframe) => {
        injectIntoIframe(iframe as HTMLIFrameElement);
      });
    };

    // Watch for iframes being added to #WIDGET
    observer = new MutationObserver(() => scanForIframes());
    const widget = document.getElementById('WIDGET');
    if (widget) {
      observer.observe(widget, { childList: true, subtree: true });
    }
    // Also scan immediately in case widget already rendered
    scanForIframes();

    // Retry a few times to catch late-loading iframes
    const timers = [500, 1500, 3000, 6000].map((ms) =>
      setTimeout(scanForIframes, ms)
    );

    return () => {
      observer?.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);
}

const siteUrl = 'https://www.mortgagecamp.pro';

const rateFactors = [
  { icon: '📊', title: 'Credit Score', desc: 'Higher scores unlock lower rates. We help you optimize before you apply.' },
  { icon: '🏠', title: 'Loan-to-Value Ratio', desc: 'More equity means less risk — and better pricing for you.' },
  { icon: '📋', title: 'Loan Type', desc: 'Conventional, FHA, VA, and Jumbo each carry different rate structures.' },
  { icon: '📅', title: 'Loan Term', desc: '15-year loans typically carry lower rates than 30-year terms.' },
  { icon: '📍', title: 'Property Location', desc: 'State and county regulations affect available programs and pricing.' },
  { icon: '💼', title: 'Employment & Income', desc: 'Stable W-2 income vs. self-employment affects how lenders price risk.' },
  { icon: '💰', title: 'Down Payment', desc: 'Larger down payments reduce lender risk and often lower your rate.' },
  { icon: '🔒', title: 'Rate Lock Period', desc: 'Shorter lock periods typically come with slightly lower rates.' },
  { icon: '📈', title: 'Market Conditions', desc: 'Fed policy, inflation, and bond yields all move mortgage rates daily.' },
];

export default function RatesPage() {
  useWidgetTheme();
  return (
    <>
      <Helmet>
        <title>Today&apos;s Mortgage Rates | Mortgage Camp</title>
        <meta name="description" content="See today&apos;s live mortgage rates and understand the key factors that affect your rate. Mortgage Camp — Florida&apos;s trusted mortgage broker." />
        <link rel="canonical" href={siteUrl + '/rates'} />
        <meta property="og:title" content="Today&apos;s Mortgage Rates | Mortgage Camp" />
        <meta property="og:url" content={siteUrl + '/rates'} />
        <meta property="og:type" content="website" />
      </Helmet>
      <main>
        <h1 className="sr-only">Today's Mortgage Rates</h1>
        <PageHero
          eyebrow="Live Market Rates"
          title="Today's mortgage"
          highlight="rates."
          subtitle="Real-time rates updated daily. We shop dozens of lenders so you don't have to — and we always show you the full picture."
        />

        {/* Live widget */}
        <section className="py-16 px-6 bg-background">
          <div className="max-w-5xl mx-auto">
            <SectionLabel>Optimal Blue Live Rates</SectionLabel>
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-8"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Live market <em className="not-italic text-gold-metallic">pricing</em>
            </h2>

            <div
              className="rounded-2xl border border-border overflow-hidden"
              style={{ background: 'hsl(var(--card))' }}
            >
              <div id="WIDGET" className="p-6">
                <script
                  id="ob-widget-script"
                  src="https://widget.optimalblue.com/widget.js"
                  data-widget-id="mortgagecamp"
                  async
                />
                <noscript>
                  <p className="text-muted-foreground text-sm">
                    Enable JavaScript to view live rate data.
                  </p>
                </noscript>
                <p className="text-sm text-muted-foreground mt-4">
                  This third-party feed may be unavailable. For a personalized quote, call{' '}
                  <a href="tel:+17863974552" className="text-primary underline">(786) 397-4552</a>.
                  {' '}Any market data is indicative, not a lending offer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rate factors */}
        <section id="factors" className="py-16 px-6" style={{ background: 'hsl(var(--noir-surface))', scrollMarginTop: '80px' }}>
          <div className="max-w-6xl mx-auto">
            <SectionLabel>What Moves Your Rate</SectionLabel>
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-10"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              9 factors that shape your <em className="not-italic text-gold-metallic">rate</em>
            </h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {rateFactors.map((f) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="text-2xl mb-3" aria-hidden="true">{f.icon}</div>
                  <h3 className="text-sm font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <CtaBanner />
      </main>
    </>
  );
}
