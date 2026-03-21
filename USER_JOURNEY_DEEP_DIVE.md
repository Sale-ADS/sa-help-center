# User Journey Deep Dive: Friction Points & Solutions

## Persona 1: Maria - First-Time Entrepreneur

**Profile:**
- 32 years old, Colombia
- Owns small online boutique
- Never run ads before
- Spanish speaker
- Limited budget ($200/month for ads)
- Tech comfort: Medium (uses Instagram, not technical)

**Goals:**
1. Get first sales through Instagram ads
2. Understand what she's paying for
3. Not waste money on mistakes

**Fears:**
- Wasting money on ads that don't work
- Looking unprofessional
- Getting overwhelmed by complexity

---

### Maria's Journey: Current State

#### Step 1: Discovers SaleAds.ai (External)
**Channel:** Instagram ad or word of mouth
**Mindset:** Curious but skeptical

---

#### Step 2: Lands on Help Center (Current Experience)
**URL:** `/es/docs`

**What She Sees:**
```
Centro de Ayuda SaleAds.ai

[9 Cards with icons]
Primeros Pasos | Conectar Plataformas | Configurar Negocio | ...
```

**Her Thoughts:**
> "Okay, I need to create an account first? But I want to understand what I'm getting into..."

**FRICTION POINT #1:** No preview of what the platform looks like
- She wants to see screenshots before signing up
- No "see it in action" option

**SOLUTION:** Add "Platform Tour" card with video/screenshot preview

---

#### Step 3: Clicks "Primeros Pasos"
**URL:** `/es/docs/primeros-pasos/crear-cuenta`

**What She Sees:**
Text about creating an account, but she's still not sure which plan to pick.

**FRICTION POINT #2:** Forced to pick a plan blindly
- She doesn't understand difference between PRO/BUSINESS
- No visual comparison
- No "what's right for me" guide

**Her Thoughts:**
> "$59 vs $119... I don't know what I need. What if I pick wrong?"

**SOLUTION:** 
- Add interactive quiz: "Which plan is right for you?"
- Show screenshot of plan selection interface
- Add calculator: "How many campaigns per month?"

---

#### Step 4: Clicks "Seleccionar Plan" (IF she finds it)
**URL:** `/es/docs/primeros-pasos/seleccionar-plan`

**What She Sees:**
- Text description of plans
- Comparison table
- **NO SCREENSHOTS**

**FRICTION POINT #3:** Critical page has zero visuals
- She's a visual learner
- Can't visualize what she's buying
- Decision paralysis

**Her Thoughts:**
> "I need to see what the dashboard looks like before I pay..."

**SOLUTION:** 
- Add screenshot of plan selection modal
- Add screenshot of dashboard preview
- Add video walkthrough

---

#### Step 5: Signs Up & Enters Platform
**Platform UI:** Plan selection modal appears

**Her Reaction:**
> "Oh! This is what the docs were describing. I wish I'd seen this earlier..."

**Picks PRO plan** (safer choice for beginner)

---

#### Step 6: First Login - Empty Dashboard
**What She Sees:** Empty dashboard with "Connect Meta" CTA

**Her Action:** Clicks "Connect Meta"

**FRICTION POINT #4:** No guidance on what "Connect Meta" means
- Doesn't understand Business Manager vs Ad Account
- Doesn't know if she has the right permissions
- Confused by 4 different pages of docs

**Her Path Through Docs:**
1. `/es/docs/conectar-plataformas/meta-ads/requisitos-previos`
2. `/es/docs/conectar-plataformas/meta-ads/conectar-facebook`
3. `/es/docs/conectar-plataformas/meta-ads/seleccionar-business-manager`
4. `/es/docs/conectar-plataformas/meta-ads/cuenta-publicitaria`

**Total Reading Time:** 25 minutes
**Confusion Level:** HIGH

**Her Thoughts:**
> "Wait, do I need Business Manager? I just have a Facebook page... This is too complicated."

**FRICTION POINT #5:** 4 separate pages for one task
- Loses context switching between pages
- Can't see overall progress
- Doesn't know which step she's on

**SOLUTION:**
- Single-page consolidated guide
- Progress tracker (Step 1 of 4)
- Decision tree: "Do you have Business Manager?"

---

#### Step 7: Gets Stuck on Business Manager
**Problem:** She doesn't have Business Manager set up

**Current Doc Says:**
> "Select your Business Manager from the dropdown"

**Her Reality:** Dropdown is empty

**FRICTION POINT #6:** Docs assume she has everything set up
- No guidance on creating Business Manager
- No troubleshooting for empty dropdown
- Link to Meta docs (confusing)

**Her Reaction:**
> "I guess this tool isn't for beginners like me..."

**ABANDONMENT RISK: HIGH**

**SOLUTION:**
- Add "Don't see your Business Manager?" section
- Link to Meta's setup (but with context)
- Offer alternative: "Connect without Business Manager first"

---

#### Step 8: Finally Connects Meta (45 minutes later)
**Success!** But she's exhausted.

---

#### Step 9: Configure Business (Brief)
**URL:** `/es/docs/configurar-negocio/brief-audio`

**What She Sees:** Instructions to record audio about her business

**Her Thoughts:**
> "I have to record audio? What should I say? Will AI understand my accent?"

**FRICTION POINT #7:** No examples of good brief recordings
- No script template
- No example audio
- No "what makes a good brief" guide

**SOLUTION:**
- Add 2-3 example recordings (different accents)
- Provide script template
- Show before/after: bad brief vs good brief

---

#### Step 10: Records Brief (20 minutes)
**Nervous but completes it**

---

#### Step 11: Strategy Selection
**URL:** `/es/docs/estrategias/explorar-estrategias`

**What She Sees:** Catalog of 20+ strategies with names like:
- "SaleADS.AI | VENTAS Instagram | +Advantage 5 | IMG"
- "SaleADS.AI | VENTAS WhatsApp | Flexible +Advantage | VID"

**Her Thoughts:**
> "What does +Advantage 5 mean? What's Flexible? IMG vs VID? Which one should I pick??"

**FRICTION POINT #8:** Strategy names are jargon-heavy
- No recommendation engine
- No "for beginners" filter
- No guidance on which fits her business

**SOLUTION:**
- Add "Recommended for You" based on brief
- Add difficulty level: Beginner/Intermediate/Advanced
- Add "Most Popular for Boutiques" tag

---

#### Step 12: Picks Strategy Randomly (10 minutes of confusion)
**Chooses:** "VENTAS Instagram | +Advantage 5 | IMG"

**Why?** Because Instagram = familiar, images = easier than video

---

#### Step 13: Upload Creatives
**URL:** `/es/docs/estrategias/subir-creativos`

**What She Sees:** Instructions to upload 5 images

**Her Reality:** She has product photos on her phone, not optimized for ads

**FRICTION POINT #9:** No guidance on what makes good ad images
- Just says "upload images"
- No examples of good vs bad product photos
- No size/format guidance

**Her Thoughts:**
> "Should I use my product photos? Do they need text on them? I'm not a designer..."

**SOLUTION:**
- Add "Image Best Practices" section
- Show 3 examples: Poor → Okay → Great
- Recommend using AI generator if no good photos

---

#### Step 14: Uses AI Image Generator
**Relief!** This is easier than expected.

---

#### Step 15: Launch Campaign
**Finally!** 2.5 hours after starting.

---

### Maria's Summary

| Metric | Time | Emotion |
|--------|------|---------|
| Sign up | 10 min | Anxious |
| Connect Meta | 45 min | Frustrated |
| Configure Business | 25 min | Nervous |
| Pick Strategy | 15 min | Confused |
| Upload Creatives | 30 min | Overwhelmed |
| **TOTAL** | **2.5 hours** | **Exhausted** |

**Success:** Yes, but barely
**Will she recommend it?** "It's powerful but complicated"
**Will she run a second campaign?** Maybe, after she recovers

---

## Persona 2: Carlos - Marketing Manager

**Profile:**
- 38 years old, Mexico
- Marketing manager at mid-size company
- Runs campaigns on Meta already
- Bilingual (ES/EN)
- Budget: $2,000/month
- Tech comfort: High

**Goals:**
1. Scale campaigns efficiently
2. Reduce time spent on campaign setup
3. Get better ROAS

**Fears:**
- Tool being too basic for his needs
- Losing control over targeting
- Platform not supporting advanced features

---

### Carlos's Journey: Current State

#### Step 1: Evaluates SaleAds.ai
**Action:** Checks documentation before signing up

**What He Sees:**
- Basic feature descriptions
- No advanced use cases
- No agency/multi-brand features documented

**FRICTION POINT #10:** No advanced documentation
- Can't evaluate if tool meets his needs
- No comparison to manual Meta Ads Manager
- No API/webhook documentation

**His Thoughts:**
> "This looks like it's for beginners. Can it handle my volume?"

**ABANDONMENT RISK: MEDIUM**

**SOLUTION:**
- Add "For Marketing Teams" section
- Document API capabilities
- Add advanced strategy guides
- Case study: "How X Company Scaled to $50K/month"

---

#### Step 2: Signs Up for BUSINESS Plan
**Quick decision** - he knows what he needs

---

#### Step 3: Connects Meta
**Smooth** - he already has Business Manager

---

#### Step 4: Explores Strategies
**Issue:** Can't find strategies for his specific goals

**What He Needs:**
- Retargeting strategies
- Lookalike audience strategies
- Catalog sales (dynamic ads)

**What Docs Show:**
- Generic "VENTAS" strategies
- No advanced targeting options

**FRICTION POINT #11:** Strategies documented are too basic
- No retargeting flow
- No dynamic product ads
- No custom audience documentation

**His Thoughts:**
> "I need retargeting for cart abandonment. Does this tool do that?"

**SOLUTION:**
- Add "Advanced Strategies" category
- Document retargeting flows
- Add audience strategy guides

---

#### Step 5: Can't Find Answers
**Searches:** "retargeting", "cart abandonment", "dynamic ads"

**Results:** No relevant pages

**FRICTION POINT #12:** Search can't handle advanced queries
- Keyword matching only
- No semantic understanding
- No synonyms ("retargeting" ≠ "remarketing")

**His Reaction:**
> "I'll stick with Ads Manager for now. This is too limiting."

**ABANDONMENT RISK: VERY HIGH**

**SOLUTION:**
- AI-powered semantic search
- Document advanced use cases
- Add "Not finding what you need? Contact us" with intent capture

---

## Universal Friction Points Summary

### Critical (Fix Immediately)

| # | Friction Point | Impact | Solution |
|---|---------------|--------|----------|
| 1 | Plan selection page has NO screenshots | 40% abandon at signup | Add screenshots |
| 2 | Meta connection split across 4 pages | 25 min longer than needed | Consolidate to 1 page |
| 3 | No guidance when Business Manager missing | Beginners abandon | Add setup guide |
| 4 | Strategy selection is overwhelming | Decision paralysis | Add recommendation engine |
| 5 | Can't search "retargeting" and find results | Power users leave | AI semantic search |

### High Priority (Fix This Month)

| # | Friction Point | Impact | Solution |
|---|---------------|--------|----------|
| 6 | No examples of good brief recordings | Poor AI output | Add examples |
| 7 | No image best practices | Low ad quality | Add visual guide |
| 8 | No advanced use cases | Power users churn | Add advanced section |
| 9 | No progress tracking | Users get lost | Add progress indicator |
| 10 | No "what to expect" content | Unrealistic expectations | Add ROI benchmarks |

---

## Recommended Solutions with Wireframes

### Solution 1: Interactive Plan Selector

```
┌─────────────────────────────────────────┐
│  ¿Qué plan necesitas?                   │
│                                         │
│  [¿Cuántas marcas gestionas?]           │
│  ○ 1 marca  ○ 2-3 marcas  ○ 4+ marcas   │
│                                         │
│  [¿Cuántas campañas al mes?]            │
│  ○ 1-5  ○ 6-15  ○ 16+                   │
│                                         │
│  [¿Usarás IA para imágenes?]            │
│  ○ Sí, mucho  ○ Algunas  ○ No          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Tu recomendación: BUSINESS     │   │
│  │  [Ver screenshot] [Elegir]      │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Solution 2: Consolidated Meta Connection Guide

```
┌─────────────────────────────────────────┐
│  Conectar Meta - Paso 1 de 4            │
│  ████████░░░░ 50%                       │
│                                         │
│  ✅ Requisitos previos                  │
│  🔄 Iniciar sesión en Facebook          │
│  ⏳ Seleccionar Business Manager        │
│  ⏳ Elegir cuenta publicitaria          │
│                                         │
│  [CONTENIDO DEL PASO ACTUAL]            │
│                                         │
│  [Anterior]        [Siguiente →]        │
└─────────────────────────────────────────┘
```

### Solution 3: Strategy Recommendation

```
┌─────────────────────────────────────────┐
│  Estrategias recomendadas para ti       │
│                                         │
│  Basado en: Boutique, Instagram,        │
│  Principiante                           │
│                                         │
│  🏆 MEJOR OPCIÓN                        │
│  VENTAS Instagram | +Advantage 5 | IMG  │
│  Ideal para: Tu primera campaña         │
│  [Usar esta]                            │
│                                         │
│  OTRAS OPCIONES:                        │
│  [Estrategia 2]  [Estrategia 3]         │
│                                         │
│  ¿Por qué esta? [Ver explicación ↓]     │
└─────────────────────────────────────────┘
```

---

## Success Metrics by Persona

### For Maria (Beginners)
- Time to first campaign: 2.5 hours → 45 minutes
- Completion rate: 60% → 85%
- Support tickets: "How do I..." → -50%

### For Carlos (Advanced)
- Time to find advanced features: 15 min → 2 min
- Feature adoption: Retargeting, API → +200%
- Upgrade rate: PRO → BUSINESS → +30%

---

## Implementation Priority

### Week 1: Fix Critical Friction
1. Add screenshots to plan selection
2. Consolidate Meta connection docs
3. Add Business Manager setup guide

### Week 2: Reduce Overwhelm
1. Strategy recommendation engine
2. Progress tracking
3. Brief recording examples

### Week 3: Enable Power Users
1. AI semantic search
2. Advanced strategy documentation
3. API/developer docs

---

## Conclusion

The help center works for users who are:
- ✅ Patient enough to read 4 pages for one task
- ✅ Technical enough to understand "Business Manager"
- ✅ Confident enough to pick from 20+ strategies

It fails for:
- ❌ Beginners who need visual guidance
- ❌ Busy professionals who need speed
- ❌ Advanced users who need specific features

**The fix:** Visual guidance, consolidated flows, and smart recommendations.
