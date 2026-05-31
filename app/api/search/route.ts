import { sourceEs, sourceEn } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

const searchEs = createFromSource(sourceEs);
const searchEn = createFromSource(sourceEn);

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale');

  if (locale === 'en') {
    return searchEn.GET(request);
  }

  return searchEs.GET(request);
}
