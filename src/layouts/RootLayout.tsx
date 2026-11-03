import { Helmet } from '@dr.pogodin/react-helmet';
import { type ReactElement, useEffect } from 'react';
import { ScrollRestoration, useLocation } from 'react-router';

import HomepageSameAsJsonLd from '@/components/HomepageSameAsJsonLd';
import Footer from '@/layouts/parts/Footer';
import Header from '@/layouts/parts/Header';
import Website from '@/layouts/Website';

/**
 * Root layout component that wraps all pages with consistent header and footer.
 *
 * To customize the header or footer, directly edit the Header.tsx and Footer.tsx
 * files in the layouts/parts directory.
 *
 * Site-wide <title> and <meta> live in the <Helmet> below. Individual pages can
 * override them by rendering their own <Helmet> — last-mounted wins.
 */
interface RootLayoutProps {
  children: ReactElement;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <Website>
      <Helmet>
        <title>Mortgage Camp</title>
        <meta name="description" content="Mortgage Camp" />
      </Helmet>
      <HomepageSameAsJsonLd />
      <ScrollRestoration />
      <Header />
      {children}
      <Footer />
    </Website>
  );
}
