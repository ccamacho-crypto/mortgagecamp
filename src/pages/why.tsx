import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { PageHero, CtaBanner, SectionLabel, fadeUp, stagger } from '@/components/PageShell';

const siteUrl = 'https://www.mortgagecamp.pro';

const whyCards = [
  { icon: '🔍', title: 'Full Transparency', desc: 'No hidden fees, no bait-and-switch. Every cost is explained before you sign anything.' },
  { icon: '⚡', title: 'Fast Pre-Approvals', desc: 'Get pre-approved in as little as 24 hours so you can move fast in competitive markets.' },
  { icon: '🏆', title: '100+ 5-Star Reviews', desc: 'Our clients speak for us. Real reviews from real homeowners across Florida.' },
  { icon: '🤝', title: 'Concierge Service', desc: 'A dedicated loan officer guides you from application to closing — no call centers.' },
  { icon: '💡', title: 'Expert Guidance', desc: 'Over 10 years of Florida mortgage expertise. We know the market, the programs, and the pitfalls.' },
  { icon: '🏦', title: 'Dozens of Lenders', desc: 'We shop your loan across our network to find the best rate and terms for your profile.' },
  { icon: '📱', title: 'Always Accessible', desc: 'Text, call, or email — we respond fast because your timeline matters.' },
  { icon: '🔐', title: 'Secure Process', desc: 'Bank-level encryption and secure document handling throughout your application.' },
  { icon: '🌴', title: 'Florida Specialists', desc: 'We live and work here. Local knowledge means better outcomes for Florida buyers.' },
];

const stats = [
  { num: '100+', label: 'Five-Star Reviews' },
  { num: '2k+', label: 'Happy Homeowners' },
  { num: '10+', label: 'Years Experience' },
  { num: '50+', label: 'Lender Partners' },
];

export default function WhyPage() {
  return (
    <>
      <Helmet>
        <title>Why Choose Us | Mortgage Camp</title>
        <meta name="description" content="Discover why Florida homebuyers trust Mortgage Camp. Transparent pricing, fast approvals, concierge service, and 100+ five-star reviews." />
        <link rel="canonical" href={siteUrl + '/why'} />
        <meta property="og:title" content="Why Choose Us | Mortgage Camp" />
        <meta property="og:url" content={siteUrl + '/why'} />
        <meta property="og:type" content="website" />
      </Helmet>
      <main>
        <h1 className="sr-only">Why Choose Mortgage Camp</h1>
        <PageHero
          eyebrow="Why Mortgage Camp"
          title="The broker that puts"
          highlight="YOU first."
          subtitle="We built Mortgage Camp around one idea: you deserve a mortgage experience that is honest, fast, and genuinely on your side."
        />

        {/* Stats */}
        <section className="py-12 px-6 bg-background border-b border-border">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {stats.map((s) => (
                <motion.div key={s.label} variants={fadeUp}>
                  <div className="text-3xl font-extrabold text-gold-metallic mb-1">{s.num}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why cards */}
        <section className="py-16 px-6" style={{ background: 'hsl(var(--noir-surface))' }}>
          <div className="max-w-6xl mx-auto">
            <SectionLabel>Our Difference</SectionLabel>
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-10"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              9 reasons clients choose <em className="not-italic text-gold-metallic">us</em>
            </h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {whyCards.map((c) => (
                <motion.div
                  key={c.title}
                  variants={fadeUp}
                  className="bg-card rounded-xl p-5 flex gap-4 items-start border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-11 h-11 min-w-11 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: 'hsl(var(--primary) / 0.08)' }}
                    aria-hidden="true"
                  >
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{c.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
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
