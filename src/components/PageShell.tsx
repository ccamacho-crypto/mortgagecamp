import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gold-metallic">
      {children}
    </p>
  );
}

export function PageHero({
  eyebrow,
  title,
  highlight,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle: string;
}) {
  return (
    <section
      aria-labelledby="page-heading"
      className="relative overflow-hidden pt-32 pb-20 px-6"
      style={{
        background:
          'linear-gradient(135deg, hsl(var(--noir-surface)) 0%, hsl(var(--background)) 100%)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 80% 20%, hsl(var(--primary) / 0.10) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 0% 100%, hsl(var(--primary) / 0.18) 0%, transparent 60%)',
        }}
      />
      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp}>
            <span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 border text-white"
              style={{
                background: 'hsl(var(--gold-glow) / 0.12)',
                borderColor: 'hsl(var(--gold-glow) / 0.45)',
              }}
            >
              ★ {eyebrow}
            </span>
          </motion.div>
          <motion.h1
            id="page-heading"
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 text-primary-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}{' '}
            {highlight && (
              <em className="not-italic text-gold-metallic">{highlight}</em>
            )}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'hsl(var(--primary-foreground) / 0.75)' }}
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section className="relative py-16 px-6 overflow-hidden" style={{ background: 'hsl(var(--noir-surface))' }}>
      {/* Shimmer gold strip across the top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gold-shimmer" aria-hidden="true" />
      {/* Subtle gold glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, hsl(var(--gold-glow) / 0.07) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-3xl mx-auto text-center relative">
        <h2
          className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Ready to get <em className="not-italic text-gold-metallic">started?</em>
        </h2>
        <p className="text-muted-foreground mb-8">
          Schedule a free consultation with our team today.
        </p>
        <Link
          to="/#schedule"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base bg-gold-metallic hover:-translate-y-0.5 shadow-lg transition-all duration-200"
          style={{ boxShadow: '0 4px 24px hsl(var(--gold-glow) / 0.45)' }}
        >
          📅 Schedule a Free Call
        </Link>
      </div>
    </section>
  );
}
