# Implementation Plan: Top 3 Critical Features

## Feature 1: AI-Powered Smart Search

### Why This Matters
Current Fumadocs search is basic keyword matching. Users type "conectar facebook" and only get exact matches. With AI search, they could type "how do I link my meta account" and get the right results.

### Implementation Options

#### Option A: Algolia DocSearch (Recommended)
**Pros**: Free for open source, easy setup, instant results
**Cons**: Requires indexing setup

**Steps**:
1. Apply at https://docsearch.algolia.com/apply/
2. Add DocSearch component to layout
3. Configure crawlers for ES and EN content

```tsx
// app/[locale]/docs/layout.tsx
import { DocSearch } from '@docsearch/react';

<DocSearch
  appId="YOUR_APP_ID"
  apiKey="YOUR_SEARCH_API_KEY"
  indexName="saleads-docs"
/>
```

#### Option B: Custom AI Search with Embeddings
**Pros**: Full control, understands semantic meaning
**Cons**: More complex, requires OpenAI API

**Architecture**:
```
User Query → OpenAI Embedding → Vector Search (Pinecone) → Results
```

### Estimated Time: 3-4 days

---

## Feature 2: Interactive Onboarding Wizard

### Why This Matters
New users see 82 pages of documentation and don't know where to start. A wizard guides them based on their specific needs.

### User Flow

```
Landing Page
    ↓
[Start Wizard Button]
    ↓
Q1: "What's your main goal?"
   - Launch my first campaign
   - Connect advertising platforms
   - Learn the basics
   - Troubleshoot an issue
    ↓
Q2: "What's your experience level?"
   - Complete beginner
   - Some experience with ads
   - Experienced marketer
    ↓
Q3: "Which platform?" (if applicable)
   - Meta (Facebook/Instagram)
   - Google Ads
   - TikTok
   - Multiple
    ↓
[Generate Personalized Path]
    ↓
Show 3-5 recommended articles in order
With progress tracking
```

### Component Structure

```tsx
// components/onboarding-wizard.tsx
export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  
  const steps = [
    { id: 1, question: "What's your main goal?", options: [...] },
    { id: 2, question: "Experience level?", options: [...] },
    { id: 3, question: "Which platform?", options: [...] }
  ];
  
  const recommendations = generatePath(answers);
  
  return (
    <Dialog>
      <WizardProgress currentStep={step} totalSteps={3} />
      <QuestionCard 
        question={steps[step-1]}
        onAnswer={(answer) => {
          setAnswers({...answers, [step]: answer});
          setStep(step + 1);
        }}
      />
      {step > 3 && <ResultsPage recommendations={recommendations} />}
    </Dialog>
  );
}
```

### Integration Points

1. **Home Page**: "First time here? Start the guided tour" button
2. **Navigation**: "Getting Started" persistent button
3. **Empty States**: Show wizard when users haven't completed onboarding

### Estimated Time: 2-3 days

---

## Feature 3: "Was This Helpful?" Feedback System

### Why This Matters
We have 368 Callouts but no idea if they're actually helpful. This gives us data to improve content.

### Implementation

#### Database Schema (Vercel Postgres)
```sql
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(255),
  is_helpful BOOLEAN,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  user_agent TEXT,
  session_id VARCHAR(100)
);
```

#### API Route
```typescript
// app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
  const { pagePath, isHelpful, comment } = await req.json();
  
  await sql`
    INSERT INTO feedback (page_path, is_helpful, comment)
    VALUES (${pagePath}, ${isHelpful}, ${comment})
  `;
  
  return NextResponse.json({ success: true });
}
```

#### React Component
```tsx
// components/feedback-widget.tsx
'use client';

export function FeedbackWidget({ pagePath }: { pagePath: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [showComment, setShowComment] = useState(false);
  
  const submitFeedback = async (isHelpful: boolean) => {
    if (!isHelpful) setShowComment(true);
    else {
      await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ pagePath, isHelpful })
      });
      setSubmitted(true);
    }
  };
  
  if (submitted) return <ThankYouMessage />;
  
  return (
    <div className="border-t pt-6 mt-12">
      <p className="text-sm font-medium mb-3">Was this page helpful?</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => submitFeedback(true)}>
          👍 Yes
        </Button>
        <Button variant="outline" onClick={() => submitFeedback(false)}>
          👎 No
        </Button>
      </div>
      
      {showComment && (
        <CommentForm 
          onSubmit={async (comment) => {
            await fetch('/api/feedback', {
              method: 'POST',
              body: JSON.stringify({ pagePath, isHelpful: false, comment })
            });
            setSubmitted(true);
          }}
        />
      )}
    </div>
  );
}
```

#### Analytics Dashboard (Simple)
```tsx
// app/admin/feedback/page.tsx (protected route)
async function getFeedbackStats() {
  const { rows } = await sql`
    SELECT 
      page_path,
      COUNT(*) as total,
      SUM(CASE WHEN is_helpful THEN 1 ELSE 0 END) as helpful_count,
      AVG(CASE WHEN is_helpful THEN 1 ELSE 0 END) * 100 as helpful_percentage
    FROM feedback
    GROUP BY page_path
    ORDER BY total DESC
  `;
  return rows;
}
```

### Estimated Time: 1 day

---

## Implementation Schedule

### Day 1: Feedback System (Quick Win)
- [ ] Set up Vercel Postgres database
- [ ] Create API route for feedback submission
- [ ] Build FeedbackWidget component
- [ ] Add widget to docs layout (bottom of each page)
- [ ] Test submission flow

### Day 2-3: Onboarding Wizard
- [ ] Design wizard questions and logic
- [ ] Build wizard components (progress, questions, results)
- [ ] Create recommendation algorithm
- [ ] Add to home page
- [ ] Style and polish

### Day 4-7: AI Search
- [ ] Apply for Algolia DocSearch (or set up custom)
- [ ] Configure search crawler
- [ ] Customize search UI to match brand
- [ ] Test with real queries
- [ ] Optimize search results ranking

---

## Testing Checklist

### Feedback System
- [ ] Submit positive feedback
- [ ] Submit negative feedback with comment
- [ ] Check data appears in database
- [ ] Verify no duplicate submissions from same session
- [ ] Test responsive design

### Onboarding Wizard
- [ ] Complete wizard as beginner
- [ ] Complete wizard as advanced user
- [ ] Verify recommendations make sense
- [ ] Test "skip" functionality
- [ ] Check progress persists on refresh
- [ ] Test on mobile

### AI Search
- [ ] Search "connect facebook" → finds Meta connection page
- [ ] Search "how do I create a campaign" → finds strategy creation
- [ ] Search Spanish queries → finds Spanish results
- [ ] Test search with typos
- [ ] Verify keyboard navigation (Cmd+K)

---

## Success Metrics

| Feature | Metric | Target |
|---------|--------|--------|
| Feedback System | Feedback submission rate | >5% of page views |
| Feedback System | Pages with <70% helpful score | Identify for rewrite |
| Onboarding Wizard | Wizard completion rate | >60% |
| Onboarding Wizard | Time to first campaign (via wizard) | <10 minutes |
| AI Search | Search usage rate | >20% of visitors |
| AI Search | Click-through rate on results | >40% |
| AI Search | "No results" queries | <5% |

---

## Next Steps

1. **Decide on search approach**: Algolia (faster) vs Custom (more control)
2. **Set up database**: Vercel Postgres for feedback
3. **Prioritize**: Which feature to build first?
4. **Design**: Get UI designs for wizard and search

**Recommendation**: Start with Feedback System (1 day), then Wizard (2 days), then Search (3-4 days).
