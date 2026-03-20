import { getSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const source = getSource(locale);
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{ title: locale === 'en' ? 'SaleAds.ai Help Center' : 'Centro de Ayuda SaleAds.ai' }}
      themeSwitch={{ enabled: false }}
    >
      {children}
    </DocsLayout>
  );
}
