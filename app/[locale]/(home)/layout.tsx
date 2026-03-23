import { getSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { DocsNavBrand } from '@/components/docs-nav-brand';

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
      nav={{ title: <DocsNavBrand /> }}
      themeSwitch={{ enabled: false }}
    >
      {children}
    </DocsLayout>
  );
}
