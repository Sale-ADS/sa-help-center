import { sourceEs, sourceEn } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Combined search across both language sources
export const { GET } = createFromSource(sourceEs);
