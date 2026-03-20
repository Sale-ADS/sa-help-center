import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

export const docsEs = defineDocs({
  dir: 'content/docs/es',
  docs: { schema: pageSchema },
  meta: { schema: metaSchema },
});

export const docsEn = defineDocs({
  dir: 'content/docs/en',
  docs: { schema: pageSchema },
  meta: { schema: metaSchema },
});

export default defineConfig({
  mdxOptions: {},
});
