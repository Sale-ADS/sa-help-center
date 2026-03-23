# AI "Ask Questions" Button - Implementation Plan

## Current State Analysis

The repository already has a complete AI assistant implementation that's **not yet integrated**:

### ✅ What's Already Built

1. **AI Assistant Component** (`components/ai-assistant/index.tsx`)
   - Floating chat widget with "Ask AI" button
   - Full chat interface with messages, quick questions, suggestions
   - Local storage for conversation history
   - Feedback system (thumbs up/down)
   - Bilingual support (ES/EN)
   - Rate limiting on client side

2. **Chat API** (`app/api/chat/route.ts`)
   - Keyword-based matching system
   - Hardcoded knowledge base with 10 topics
   - Rate limiting (20 requests/hour per IP)
   - Fallback responses when no match found

3. **Feedback API** (`app/api/chat/feedback/route.ts`)
   - Endpoint to collect user feedback on AI responses

## Implementation Plan

### Phase 1: Basic Integration (5 minutes)

**Goal:** Make the AI button appear on all documentation pages.

#### Step 1.1: Add AI Assistant to Docs Layout
**File:** `app/[locale]/docs/layout.tsx`

```tsx
import { getSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { AIAssistant } from '@/components/ai-assistant';

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
      <AIAssistant locale={locale} />
    </DocsLayout>
  );
}
```

**Impact:** The floating "Ask AI" button will appear on all documentation pages.

---

### Phase 2: Content-Aware AI (Recommended)

**Goal:** Make the AI aware of the current page content for better contextual answers.

#### Step 2.1: Pass Current Page Context to AI Component
**File:** `app/[locale]/docs/[[...slug]]/page.tsx`

Add page data as a data attribute or pass through a context:

```tsx
// Option A: Using data attributes on body
<DocsBody data-page-content={page.data.content}>
  ...
</DocsBody>

// Option B: Better - use React Context (recommended)
```

#### Step 2.2: Create Page Context Provider
**New File:** `components/ai-assistant/page-context.tsx`

```tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

interface PageContextType {
  title: string;
  description: string;
  url: string;
  content?: string;
}

const PageContext = createContext<PageContextType | null>(null);

export function PageContextProvider({ 
  children, 
  value 
}: { 
  children: ReactNode; 
  value: PageContextType;
}) {
  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
```

#### Step 2.3: Modify AI Component to Use Context
**File:** `components/ai-assistant/index.tsx`

```tsx
import { usePageContext } from './page-context';

export function AIAssistant({ locale }: AIAssistantProps) {
  const pageContext = usePageContext();
  
  const sendMessage = async (content: string) => {
    // ... existing code ...
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: content.trim(),
        locale,
        history: messages.slice(-5),
        pageContext: pageContext ? {
          title: pageContext.title,
          url: pageContext.url,
        } : null,
      }),
    });
    
    // ... rest of existing code ...
  };
  
  // ... rest of component ...
}
```

#### Step 2.4: Update API to Use Page Context
**File:** `app/api/chat/route.ts`

```tsx
const body = await request.json();
const { message, locale = 'es', history = [], pageContext } = body;

// Include page context in response when available
if (pageContext) {
  // Could prioritize knowledge base entries matching the current page
  // or include page title in the response
}
```

---

### Phase 3: Real Documentation Indexing (Future-Proofing)

**Goal:** Replace hardcoded knowledge base with indexed MDX content.

#### Step 3.1: Create Documentation Indexer Script
**New File:** `scripts/index-docs.ts`

```typescript
import { docsEs, docsEn } from '../.source';
import fs from 'fs';
import path from 'path';

interface DocEntry {
  title: string;
  description: string;
  content: string;
  url: string;
  keywords: string[];
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - could use NLP in production
  const commonWords = new Set(['el', 'la', 'de', 'en', 'y', 'a', 'los', 'las', 'the', 'and', 'of', 'to']);
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 4 && !commonWords.has(w))
    .slice(0, 10);
}

async function indexDocs() {
  const index: Record<string, DocEntry[]> = {
    es: [],
    en: [],
  };
  
  // Process Spanish docs
  for (const doc of docsEs) {
    index.es.push({
      title: doc.title,
      description: doc.description,
      content: doc.content,
      url: `/es/docs/${doc.slug}`,
      keywords: extractKeywords(doc.title + ' ' + doc.description + ' ' + doc.content),
    });
  }
  
  // Process English docs similarly...
  
  // Write index to file
  fs.writeFileSync(
    path.join(process.cwd(), 'lib/docs-index.json'),
    JSON.stringify(index, null, 2)
  );
  
  console.log('Documentation indexed successfully!');
}

indexDocs();
```

#### Step 3.2: Update Chat API to Use Indexed Content
**File:** `app/api/chat/route.ts`

```tsx
import docsIndex from '@/lib/docs-index.json';

// Replace hardcoded knowledgeBase with indexed content
function findBestAnswer(query: string, locale: string, pageContext?: any) {
  const index = docsIndex[locale as keyof typeof docsIndex] || docsIndex.es;
  
  // Search through indexed content
  const matches = index.map(doc => {
    const score = calculateRelevanceScore(query, doc);
    return { doc, score };
  }).filter(m => m.score > 0.3).sort((a, b) => b.score - a.score);
  
  if (matches.length > 0) {
    const best = matches[0];
    return {
      answer: generateAnswerFromDoc(best.doc, query),
      sources: [{ title: best.doc.title, href: best.doc.url }],
      confidence: best.score,
    };
  }
  
  return null;
}
```

#### Step 3.3: Add Build Script
**File:** `package.json`

```json
{
  "scripts": {
    "build": "npm run index-docs && next build",
    "index-docs": "tsx scripts/index-docs.ts",
    "dev": "npm run index-docs && next dev"
  }
}
```

---

### Phase 4: Integration with Real LLM (Production-Ready)

**Goal:** Connect to OpenAI, Anthropic, or similar for intelligent responses.

#### Step 4.1: Add Environment Variables
**File:** `.env.local`

```bash
# Required for real AI responses
OPENAI_API_KEY=sk-...

# Optional: Use Anthropic instead
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Vector database for RAG
PINECONE_API_KEY=...
PINECONE_INDEX=docs
```

#### Step 4.2: Create RAG Pipeline
**New File:** `lib/ai/rag.ts`

```typescript
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function getRelevantContext(query: string, locale: string) {
  // Generate embedding for query
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  
  // Search vector database
  const index = pinecone.index(process.env.PINECONE_INDEX!);
  const results = await index.namespace(locale).query({
    vector: embedding.data[0].embedding,
    topK: 3,
    includeMetadata: true,
  });
  
  return results.matches?.map(m => m.metadata) || [];
}

export async function generateResponse(
  query: string, 
  context: any[], 
  locale: string
) {
  const systemPrompt = locale === 'es' 
    ? `Eres un asistente útil para SaleAds.ai. Usa el siguiente contexto para responder:\n\n${context.map(c => c.content).join('\n\n')}`
    : `You are a helpful assistant for SaleAds.ai. Use the following context to answer:\n\n${context.map(c => c.content).join('\n\n')}`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });
  
  return response.choices[0].message.content;
}
```

#### Step 4.3: Update Chat API
**File:** `app/api/chat/route.ts`

```tsx
import { getRelevantContext, generateResponse } from '@/lib/ai/rag';

export async function POST(request: NextRequest) {
  // ... rate limiting ...
  
  const body = await request.json();
  const { message, locale = 'es', history = [], pageContext } = body;
  
  // Get relevant documentation context
  const context = await getRelevantContext(message, locale);
  
  // Generate AI response
  const answer = await generateResponse(message, context, locale);
  
  return NextResponse.json({
    answer,
    sources: context.map(c => ({ title: c.title, href: c.url })),
    confidence: 1,
  });
}
```

---

## Implementation Checklist

### Phase 1 (Quick Win)
- [ ] Add `<AIAssistant locale={locale} />` to `app/[locale]/docs/layout.tsx`
- [ ] Test that button appears on all docs pages
- [ ] Verify basic chat functionality works

### Phase 2 (Enhanced UX)
- [ ] Create `PageContextProvider` component
- [ ] Wrap docs page content with provider
- [ ] Update AI component to send page context
- [ ] Update API to use page context for better responses

### Phase 3 (Content-Aware)
- [ ] Create `scripts/index-docs.ts` to index MDX content
- [ ] Run indexer to generate `lib/docs-index.json`
- [ ] Update chat API to search indexed content
- [ ] Add build script to auto-index on build

### Phase 4 (Production AI)
- [ ] Set up vector database (Pinecone/Weaviate)
- [ ] Add environment variables for AI provider
- [ ] Install AI SDK dependencies
- [ ] Create RAG pipeline
- [ ] Update chat API to use LLM
- [ ] Add streaming responses for better UX

---

## UI/UX Variations to Consider

### Option A: Floating Button (Current - Recommended)
- Fixed position bottom-right
- Opens chat overlay
- Non-intrusive, always accessible

### Option B: Inline "Ask AI" Input
- At bottom of each docs page
- Integrated into page flow
- Good for page-specific questions

### Option C: Header Button
- In top navigation bar
- Opens full-page or modal chat
- More prominent discovery

### Option D: Contextual Inline Help
- Small "?" icons near complex sections
- Clicking opens targeted Q&A
- Highly contextual but more work

**Recommendation:** Start with Option A (already built), add Option B later for page-specific questions.

---

## Testing Plan

1. **Unit Tests**
   - Test keyword matching algorithm
   - Test rate limiting logic
   - Test component rendering

2. **Integration Tests**
   - Test API endpoint with sample queries
   - Test local storage persistence
   - Test bilingual responses

3. **E2E Tests**
   - User can open chat
   - User can send message
   - User receives response
   - Sources are clickable
   - History persists on refresh

---

## Security Considerations

1. **Rate Limiting** - ✅ Already implemented (20 req/hour)
2. **Input Sanitization** - Add validation for message length/content
3. **API Key Protection** - Keep AI provider keys server-side only
4. **CORS** - Ensure API only accepts requests from your domain
5. **Content Safety** - Add moderation for user inputs and AI outputs

---

## Success Metrics

- **Adoption:** % of users who click the AI button
- **Engagement:** Average messages per session
- **Helpfulness:** Feedback scores (thumbs up/down)
- **Resolution:** % of users who don't contact support after using AI
- **Performance:** API response time (< 2 seconds target)
