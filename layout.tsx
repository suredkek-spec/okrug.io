import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      'https://okrug-kaliningrad.suredkek.chatgpt.site',
  ),
  title: 'ОКРУГ — барбершоп и салон красоты | Онлайн-запись',
  description:
    'Барбершоп, парикмахерская и салон красоты «ОКРУГ» в Калининграде, ул. Черняховского, 20. Мужские стрижки, борода, уход и онлайн-запись.',
  applicationName: 'ОКРУГ',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    title: 'ОКРУГ — твоё место рядом',
    description: 'Барбершоп и салон красоты на ул. Черняховского, 20 в Калининграде.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'ОКРУГ — твоё место рядом' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ОКРУГ — твоё место рядом',
    description: 'Барбершоп и салон красоты в Калининграде.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#202020',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
