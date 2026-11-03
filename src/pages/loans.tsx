import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { PageHero, CtaBanner, SectionLabel, fadeUp, stagger } from '@/components/PageShell';

const siteUrl = 'https://www.mortgagecamp.pro';

const loanTypes = [
  {
    icon: '🏡',
    title: 'Home Purchase Loans',
    desc: "Whether it's your first home or your fifth, we find the best purchase financing for your situation.",
    options: [
      { title: 'First-Time Homebuyer', desc: 'Low down payment programs and down payment assistance for new buyers.' },
      { title: 'Move-Up Buyer', desc: 'Bridge the gap between selling your current home and buying your next.' },
      { title: 'Vacation / Second Home', desc: 'Finance a getaway property with competitive second-home rates.' },
      { title: 'New Construction', desc: 'One-time close construction loans that convert to permanent financing.' },
    ],
  },
  {
    icon: '🔄',
    title: 'Refinance',
    desc: 'Lower your rate, reduce your term, or tap your equity — we find the refinance that makes sense.',
    options: [
      { title: 'Rate & Term Refi', desc: 'Reduce your interest rate or shorten your loan term.' },
      { title: 'Cash-Out Refinance', desc: 'Access your home equity for renovations, debt payoff, or investments.' },
      { title: 'Streamline Refi', desc: 'Simplified refinancing for existing FHA or VA loan holders.' },
      { title: 'No-Cost Refi', desc: 'Roll closing costs into the loan — zero out-of-pocket to refinance.' },
    ],
  },
  {
    icon: '🏛️',
    title: 'Conventional Loans',
    desc: 'Flexible, widely available financing with competitive rates for qualified borrowers.',
    options: [
      { title: 'Conforming Loans', desc: 'Standard loans within Fannie Mae / Freddie Mac limits.' },
      { title: '3% Down Programs', desc: 'Conventional financing with as little as 3% down.' },
      { title: 'No-PMI Options', desc: 'Strategies to eliminate private mortgage insurance.' },
      { title: 'Fixed & ARM', desc: 'Choose stability with fixed rates or flexibility with adjustable.' },
    ],
  },
  {
    icon: '🎖️',
    title: 'VA Loans',
    desc: 'Exclusive benefits for veterans, active-duty service members, and surviving spouses.',
    options: [
      { title: 'VA Purchase', desc: 'Zero down payment with no PMI for eligible veterans.' },
      { title: 'VA IRRRL', desc: 'Interest Rate Reduction Refinance Loan — streamlined VA refi.' },
      { title: 'VA Cash-Out', desc: "Access up to 100% of your home's equity." },
      { title: 'VA Jumbo', desc: 'VA financing above conforming limits for high-value properties.' },
    ],
  },
  {
    icon: '🏦',
    title: 'FHA Loans',
    desc: 'Government-backed loans with flexible credit requirements and low down payments.',
    options: [
      { title: 'FHA Purchase', desc: '3.5% down with credit scores as low as 580.' },
      { title: 'FHA 203(k)', desc: 'Finance a home purchase and renovation in a single loan.' },
      { title: 'FHA Streamline', desc: 'Simplified refinancing for existing FHA borrowers.' },
      { title: 'FHA Cash-Out', desc: 'Tap your equity with an FHA-backed cash-out refinance.' },
    ],
  },
  {
    icon: '💎',
    title: 'Jumbo Loans',
    desc: 'High-value financing above conforming limits for luxury and high-cost market properties.',
    options: [
      { title: 'Jumbo Purchase', desc: 'Financing above $766,550 for high-value properties.' },
      { title: 'Super Jumbo', desc: 'Loans above $3M for ultra-luxury real estate.' },
      { title: 'Jumbo ARM', desc: 'Adjustable-rate jumbo loans for short-term ownership strategies.' },
      { title: 'Jumbo Refi', desc: 'Refinance your existing jumbo loan to a better rate or term.' },
    ],
  },
];

export default function LoansPage() {
  return (
    <>
      <Helmet>
        <title>Loan Options | Mortgage Camp</title>
        <meta name="description" content="Explore every loan type — FHA, VA, Conventional, Jumbo, HELOC, and more. Mortgage Camp finds the right program for your situation." />
        <link rel="canonical" href={siteUrl + '/loans'} />
        <meta property="og:title" content="Loan Options | Mortgage Camp" />
        <meta property="og:url" content={siteUrl + '/loans'} />
        <meta property="og:type" content="website" />
      </Helmet>
      <main>
        <h1 className="sr-only">Loan Options</h1>
        <PageHero
          eyebrow="Every Loan Type"
          title="The right loan for"
          highlight="your situation."
          subtitle="From first-time buyers to seasoned investors, we have a program for every borrower. Explore your options below."
        />

        <section className="py-16 px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <SectionLabel>Loan Programs</SectionLabel>
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-10"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              32 loan options, <em className="not-italic text-gold-metallic">one team</em>
            </h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-col gap-6"
            >
              {loanTypes.map((loan) => (
                <motion.div
                  key={loan.title}
                  variants={fadeUp}
                  className="bg-card rounded-2xl border border-border p-6 shadow-sm"
                >
                  <div className="flex gap-4 items-start mb-5">
                    <span className="text-3xl mt-0.5" aria-hidden="true">{loan.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{loan.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{loan.desc}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {loan.options.map((opt) => (
                      <a
                        key={opt.title}
                        href="/#schedule"
                        className="block rounded-xl p-4 border border-border bg-muted transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary"
                      >
                        <p className="text-sm font-bold text-foreground mb-1">{opt.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
                      </a>
                    ))}
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
