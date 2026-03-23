# AI Assistant Setup Guide

The AI Assistant feature has been successfully integrated into your documentation site. It uses Google's Gemini AI to provide intelligent answers about SaleAds.ai.

## ✅ What's Implemented

### Features
- **Floating "Ask AI" button** on all documentation pages
- **Chat interface** with conversation history (stored locally)
- **Page context awareness** - AI knows which page you're viewing
- **Bilingual support** (Spanish/English)
- **Suggested questions** based on conversation
- **Relevant documentation links** in responses
- **Feedback system** (thumbs up/down)
- **Rate limiting** (20 messages/hour per IP)

### Technical Stack
- **AI Model**: Google Gemini 1.5 Flash (configurable)
- **Framework**: Next.js App Router
- **UI**: Fumadocs + Tailwind CSS
- **SDK**: @google/generative-ai

## 🔧 Setup Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Required
GEMINI_API_KEY=your_actual_api_key_here

# Optional (defaults to gemini-1.5-flash)
GEMINI_MODEL=gemini-1.5-flash
```

**Available models:**
- `gemini-1.5-flash` (default) - Fast, cost-effective
- `gemini-1.5-pro` - More capable, higher quality
- `gemini-1.0-pro` - Older version, not recommended

### 3. Run the Development Server

```bash
npm run dev
```

The AI button will appear on all documentation pages at the bottom-right corner.

### 4. Deploy to Production

Make sure to add the environment variable to your hosting platform:

**Vercel:**
```bash
vercel env add GEMINI_API_KEY
```

Or set it in the Vercel dashboard under Settings → Environment Variables.

## 🏗️ Architecture

### Files Structure
```
app/
├── [locale]/
│   └── docs/
│       ├── layout.tsx          # AIAssistant added here
│       └── [[...slug]]/
│           └── page.tsx        # PageContextProvider wraps content
├── api/
│   └── chat/
│       ├── route.ts            # Gemini API integration
│       └── feedback/
│           └── route.ts        # Feedback collection
components/
├── ai-assistant/
│   ├── index.tsx               # Main chat widget UI
│   └── page-context.tsx        # React context for page info
```

### Data Flow
1. User clicks "Ask AI" button → Opens chat widget
2. User sends message → Component sends POST to `/api/chat`
3. API receives message + page context + history
4. Gemini generates response with system prompt
5. API finds relevant documentation links
6. Response returned with answer, sources, and suggestions
7. UI displays message with sources as clickable links

## 🎨 Customization

### Change Button Position
Edit `components/ai-assistant/index.tsx`:

```tsx
// Line ~180
<button
  onClick={() => setIsOpen(true)}
  className="fixed bottom-6 right-6 z-50 ..."  // Change position here
>
```

Options: `bottom-6 right-6`, `bottom-6 left-6`, `top-6 right-6`, etc.

### Update System Prompt
Edit `app/api/chat/route.ts` - modify `systemPrompts` object:

```typescript
const systemPrompts: Record<string, string> = {
  es: `Tu prompt personalizado en español...`,
  en: `Your custom prompt in English...`,
};
```

### Add More Documentation Links
Edit `app/api/chat/route.ts` - extend `docLinks` object:

```typescript
const docLinks = {
  es: {
    'nueva-seccion': [
      { title: 'Título', href: '/es/docs/ruta/pagina' },
    ],
  },
};
```

### Change Quick Questions
Edit `components/ai-assistant/index.tsx` - modify `quickQuestions`:

```typescript
const quickQuestions: Record<string, string[]> = {
  es: [
    'Tu pregunta personalizada?',
    '¿Otra pregunta?',
  ],
};
```

## 📊 Monitoring

### View Feedback
Feedback is sent to `/api/chat/feedback` endpoint. Currently logs to console. To store feedback:

1. Connect to a database (PostgreSQL, MongoDB, etc.)
2. Update `app/api/chat/feedback/route.ts` to persist data

### Analytics
Track these events in your analytics platform:
- `ai_button_opened` - User clicked the Ask AI button
- `ai_message_sent` - User sent a message
- `ai_response_received` - Response received successfully
- `ai_feedback_given` - User gave thumbs up/down

## 🛠️ Troubleshooting

### "AI service not configured" Error
The `GEMINI_API_KEY` environment variable is not set. Check your `.env.local` file.

### Rate Limit Exceeded
Users are limited to 20 messages per hour per IP. This is configurable in `app/api/chat/route.ts`:

```typescript
const RATE_LIMIT_MAX = 20; // Change this number
```

### API Errors
Check server logs for detailed error messages. Common issues:
- Invalid API key
- API quota exceeded
- Network connectivity issues

### TypeScript Errors
Run type checking:
```bash
npx tsc --noEmit
```

## 🔮 Future Enhancements

### Potential Improvements
1. **Streaming responses** - Show text as it's generated
2. **Vector search** - Index documentation for semantic search
3. **Conversation history** - Store in database instead of localStorage
4. **Multi-language support** - Add more languages beyond ES/EN
5. **Analytics dashboard** - View usage and feedback statistics
6. **Custom training** - Fine-tune model on your documentation

### Adding Streaming (Advanced)
To implement streaming responses, modify the API route:

```typescript
// Use streaming response
const streamingResp = await chat.sendMessageStream(message);

// Return streaming response
return new NextResponse(streamingResp.stream, {
  headers: { 'Content-Type': 'text/plain' },
});
```

And update the frontend to handle streaming chunks.

## 📞 Support

For issues with:
- **Gemini API**: [Google AI Documentation](https://ai.google.dev/docs)
- **Fumadocs**: [Fumadocs Documentation](https://fumadocs.dev)
- **This implementation**: Check the implementation files in this repository
