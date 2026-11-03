import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { PageHero, CtaBanner, SectionLabel, fadeUp, stagger } from '@/components/PageShell';

const siteUrl = 'https://www.mortgagecamp.pro';

const reviews = [
  {
    name: 'Adam G.',
    initials: 'AG',
    rating: 5,
    text: "The team was incredibly communicative and helpful. I always felt confident and secure throughout the entire process. Best mortgage experience I've ever had.",
    context: 'Home Purchase — Miami, FL',
  },
  {
    name: 'Gregory L.',
    initials: 'GL',
    rating: 5,
    text: 'Within a few business days we got pre-approved and ended up with our dream home. Supported immensely throughout the journey without any hiccups.',
    context: 'First-Time Buyer — Coral Gables, FL',
  },
  {
    name: 'Michael G.',
    initials: 'MG',
    rating: 5,
    text: 'Responsive, knowledgeable, transparent, and genuinely cared about helping me. What had been a stressful experience felt smooth and manageable.',
    context: 'Refinance — Boca Raton, FL',
  },
  {
    name: 'Sarah T.',
    initials: 'ST',
    rating: 5,
    text: 'I was nervous as a first-time buyer but they walked me through every step. Closed in 28 days. Could not recommend them more highly.',
    context: 'First-Time Buyer — Fort Lauderdale, FL',
  },
  {
    name: 'James R.',
    initials: 'JR',
    rating: 5,
    text: 'Got a rate 0.5% lower than my bank offered. The savings over 30 years are enormous. Wish I had called them first.',
    context: 'Conventional Purchase — Naples, FL',
  },
  {
    name: 'Diana M.',
    initials: 'DM',
    rating: 5,
    text: 'Used them for a VA loan. They knew every detail of the program and made the whole process effortless. True professionals.',
    context: 'VA Loan — Tampa, FL',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-gold-metallic text-sm" aria-hidden="true">★</span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <Helmet>
        <title>Client Reviews | Mortgage Camp</title>
        <meta name="description" content="Read 100+ five-star reviews from Florida homeowners who trusted Mortgage Camp for their purchase, refinance, VA, and FHA loans." />
        <link rel="canonical" href={siteUrl + '/reviews'} />
        <meta property="og:title" content="Client Reviews | Mortgage Camp" />
        <meta property="og:url" content={siteUrl + '/reviews'} />
        <meta property="og:type" content="website" />
      </Helmet>
      <main>
        <h1 className="sr-only">Client Reviews</h1>
        <PageHero
          eyebrow="Client Reviews"
          title="100+ five-star"
          highlight="reviews."
          subtitle="Real clients. Real results. See what Florida homeowners say about working with Mortgage Camp."
        />

        {/* Aggregate badge */}
        <section className="py-10 px-6 bg-background border-b border-border">
          <div className="max-w-sm mx-auto text-center">
            <div className="flex justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-gold-metallic text-2xl" aria-hidden="true">★</span>
              ))}
            </div>
            <p className="text-3xl font-extrabold text-gold-metallic mb-1">5.0</p>
            <p className="text-sm text-muted-foreground">Based on 100+ Google reviews</p>
          </div>
        </section>

        {/* Reviews grid */}
        <section className="py-16 px-6" style={{ background: 'hsl(var(--noir-surface))' }}>
          <div className="max-w-6xl mx-auto">
            <SectionLabel>What Clients Say</SectionLabel>
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-10"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Stories from real <em className="not-italic text-gold-metallic">homeowners</em>
            </h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {reviews.map((r) => (
                <motion.div
                  key={r.name}
                  variants={fadeUp}
                  className="bg-card rounded-xl border border-border p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Stars count={r.rating} />
                  <p className="text-sm text-foreground leading-relaxed flex-1">{r.text}</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--gold-dark)) 0%, hsl(var(--gold-mid)) 50%, hsl(var(--gold-light)) 100%)',
                        color: 'hsl(var(--background))',
                      }}
                    >
                      {r.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.context}</p>
                    </div>
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
