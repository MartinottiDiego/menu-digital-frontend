import type { Metadata } from 'next';
import { Anton, Zilla_Slab, Manrope } from 'next/font/google';
import './globals.css';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import { SettingsProvider } from '@/components/layout/SettingsProvider';
import { AnalyticsTracker } from '@/components/layout/AnalyticsTracker';
import { NoFieldTextDrag } from '@/components/layout/NoFieldTextDrag';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { SITE_LANDING_IMAGE_URL, SITE_NAME } from '@/lib/constants';

function getMetadataBase(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL('http://localhost:3000');
}

const siteDescription =
  'La verdadera milanesa artesanal. Crujiente por fuera, increíble por dentro.';

const anton = Anton({
  variable: '--font-anton-var',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const zillaSlab = Zilla_Slab({
  variable: '--font-zilla-var',
  weight: ['600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-manrope-var',
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: `${SITE_NAME} — Milanesas con mucho sabor`,
  description: siteDescription,
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Milanesas con mucho sabor`,
    description: siteDescription,
    images: [
      {
        url: SITE_LANDING_IMAGE_URL,
        width: 1200,
        height: 1200,
        alt: `${SITE_NAME} — Carnes y milanesas`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Milanesas con mucho sabor`,
    description: siteDescription,
    images: [SITE_LANDING_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${anton.variable} ${zillaSlab.variable} ${manrope.variable} flex min-h-screen flex-col antialiased`}
      >
        <SettingsProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </SettingsProvider>
        <AnalyticsTracker />
        <NoFieldTextDrag />
        <ToastContainer />
      </body>
    </html>
  );
}
