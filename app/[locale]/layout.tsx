import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import { i18n } from '@/lib/i18n';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale} className={`${inter.className} dark`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={i18n.provider(locale)} theme={{ enabled: false }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
