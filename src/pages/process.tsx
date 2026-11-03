import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { PageHero, CtaBanner, SectionLabel, fadeUp, stagger } from '@/components/PageShell';

const siteUrl = 'https://www.mortgagecamp.pro';

const steps = [
  {
    num: '01',
    title: 'Schedule a Free Consultation',
    desc: 'A quick 15-minute call with your dedicated loan officer. We listen first — no pressure, no sales pitch. Just an honest conversation about your goals.',
    detail: 'Available by phone, text, or video call. Same-day appointments often available.',
  },
  {
    num: '02',
    title: 'Get Pre-Approved',
    desc: 'We gather your documents, run a soft credit check, and submit your file to our lender network. Most clients receive a pre-approval letter within 24 hours.',
    detail: 'Soft pull only — no impact to your credit score at this stage.',
  },
  {
    num: '03',
    title: 'Shop with Confidence',
    desc: 'Armed with your pre-approval, you can make competitive offers. We stay on standby to answer questions and update your letter as needed.',
    detail: 'We coordinate directly with your real estate agent to keep things moving.',
  },
  {
    num: '04',
    title: 'Lock Your Rate',
    desc: 'Once your offer is accepted, we lock in your rate and begin processing. We shop our full lender network one final time to make sure you have the best deal.',
    detail: 'Rate lock periods from 15 to 60 days available depending on your timeline.',
  },
  {
    num: '05',
    title: 'Underwriting & Appraisal',
    desc: 'Our team manages the entire underwriting process and coordinates the appraisal. We keep you informed at every step so there are no surprises.',
    detail: 'Average underwriting turnaround: 3–5 business days with our lender partners.',
  },
  {
    num: '06',
    title: 'Clear to Close',
    desc: 'Once underwriting approves your file, you receive a clear-to-close. We review your final closing disclosure with you line by line before you sign.',
    detail: 'Closing typically takes 30–45 days from application. We often beat that.',
  },
];

export default function ProcessPage() {
  return (
    <>
      <Helmet>
        <title>Our Process | Mortgage Camp</title>
        <meta name="description" content="A simple, transparent 6-step mortgage process. From consultation to closing, Mortgage Camp guides you every step of the way." />
        <link rel="canonical" href={siteUrl + '/process'} />
        <meta property="og:title" content="Our Process | Mortgage Camp" />
        <meta property="og:url" content={siteUrl + '/process'} />
        <meta property="og:type" content="website" />
      </Helmet>
      <main>
        <h1 className="sr-only">Our Mortgage Process</h1>
        <PageHero
          eyebrow="How It Works"
          title="Simple. Transparent."
          highlight="Yours."
          subtitle="Six steps from first call to closing day. No surprises, no runaround — just a clear path to your new home."
        />

        <section className="py-16 px-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <SectionLabel>The Process</SectionLabel>
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-12"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              From call to <em className="not-italic text-gold-metallic">closing</em>
            </h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-col gap-0"
            >
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  variants={fadeUp}
                  className="flex gap-6 pb-10 relative"
                >
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div
                      className="absolute left-6 top-14 bottom-0 w-px pointer-events-none"
                      style={{ background: 'hsl(var(--gold-glow) / 0.25)' }}
                      aria-hidden="true"
                    />
                  )}
                  {/* Number circle */}
                  <div
                    className="w-12 h-12 min-w-12 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 z-10"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--gold-dark)) 0%, hsl(var(--gold-mid)) 40%, hsl(var(--gold-light)) 60%, hsl(var(--gold-shine)) 80%, hsl(var(--gold-dark)) 100%)',
                      color: 'hsl(var(--background))',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {step.num}
                  </div>
                  <div className="pt-2">
                    <h3
                      className="text-lg font-bold text-foreground mb-2"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">{step.desc}</p>
                    <p
                      className="text-xs font-medium"
                      style={{ color: 'hsl(var(--primary) / 0.8)' }}
                    >
                      {step.detail}
                    </p>
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
