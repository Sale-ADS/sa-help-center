import { getSource, sourceEs, sourceEn } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { GoogleDriveEmbed } from '@/components/google-drive-embed';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug } = await params;
  const source = getSource(locale);
  const page = source.getPage(slug);
  if (!page) notFound();
  const footerItems = findNeighbour(source.pageTree, page.url);

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} footer={{ items: footerItems }}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            GoogleDriveEmbed,
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return [
    ...sourceEs.generateParams().map((p) => ({ locale: 'es', ...p })),
    ...sourceEn.generateParams().map((p) => ({ locale: 'en', ...p })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const source = getSource(locale);
  const page = source.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
