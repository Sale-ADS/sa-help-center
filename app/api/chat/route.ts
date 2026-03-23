import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 20; // max 20 messages per hour per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  const validRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (validRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return true;
}

// System prompts for different locales
const systemPrompts: Record<string, string> = {
  es: `Eres un asistente de documentación útil y amigable para SaleAds.ai, una plataforma de publicidad digital con inteligencia artificial.

Tu objetivo es ayudar a los usuarios a encontrar respuestas sobre cómo usar la plataforma SaleAds.ai.

Directrices importantes:
1. Responde en español de manera clara y concisa
2. Usa un tono profesional pero cercano
3. Si no tienes información específica, sugiere consultar la documentación oficial o contactar a soporte
4. Incluye enlaces a documentación relevante cuando sea posible
5. Si el usuario pregunta sobre algo fuera del alcance de SaleAds.ai, indica amablemente que solo puedes ayudar con temas relacionados a la plataforma
6. Usa formato markdown para mejor legibilidad (negritas, listas, etc.)

IMPORTANTE - Formato para generar imágenes:
Cuando el usuario pregunte sobre cómo crear prompts para generar imágenes, indica el formato de 4 componentes:
1. Nombre del negocio (puede ser genérico como "floristeria en medellin" o específico como "La Pampa")
2. Descripción del negocio (qué vende o hace)
3. 4 beneficios específicos separados por comas
4. Descuento (porcentaje específico o "sin descuento")

Ejemplo: "La Pampa Burger | Hamburguesas artesanales | Pan recién horneado, Papas caseras, Salsas artesanales, Refil gratis | 20% de descuento"

Recuerda: SaleAds.ai ayuda a usuarios a crear y lanzar campañas publicitarias en Meta Ads, Google Ads y TikTok usando inteligencia artificial.`,

  en: `You are a helpful and friendly documentation assistant for SaleAds.ai, a digital advertising platform with artificial intelligence.

Your goal is to help users find answers about how to use the SaleAds.ai platform.

Important guidelines:
1. Answer in English clearly and concisely
2. Use a professional but friendly tone
3. If you don't have specific information, suggest checking the official documentation or contacting support
4. Include links to relevant documentation when possible
5. If the user asks about something outside SaleAds.ai scope, kindly indicate you can only help with platform-related topics
6. Use markdown formatting for better readability (bold, lists, etc.)

IMPORTANT - Format for generating images:
When users ask about how to create prompts for generating images, indicate the 4-component format:
1. Business name (can be generic like "flower shop in miami" or specific like "The Burger Joint")
2. Business description (what they sell or do)
3. 4 specific benefits separated by commas
4. Discount (specific percentage or "no discount")

Example: "The Burger Joint | Artisan burgers | Fresh baked buns, Homemade fries, Artisan sauces, Free refills | 20% off"

Remember: SaleAds.ai helps users create and launch advertising campaigns on Meta Ads, Google Ads, and TikTok using artificial intelligence.`,
};

// Documentation URLs for common topics
const docLinks: Record<string, Record<string, { title: string; href: string }[]>> = {
  es: {
    'meta': [
      { title: 'Conectar Facebook', href: '/es/docs/conectar-plataformas/meta-ads/conectar-facebook' },
      { title: 'Requisitos Previos', href: '/es/docs/conectar-plataformas/meta-ads/requisitos-previos' },
    ],
    'facebook': [
      { title: 'Conectar Facebook', href: '/es/docs/conectar-plataformas/meta-ads/conectar-facebook' },
    ],
    'google': [
      { title: 'Conectar Google Ads', href: '/es/docs/conectar-plataformas/google/conectar-google' },
    ],
    'tiktok': [
      { title: 'Conectar TikTok', href: '/es/docs/conectar-plataformas/tiktok/conectar-tiktok' },
    ],
    'plan': [
      { title: 'Seleccionar Plan', href: '/es/docs/primeros-pasos/seleccionar-plan' },
      { title: 'Planes Disponibles', href: '/es/docs/primeros-pasos/planes-disponibles' },
    ],
    'brief': [
      { title: 'Crear Brief con Audio', href: '/es/docs/configurar-negocio/brief-audio' },
      { title: 'Información del Negocio', href: '/es/docs/configurar-negocio/informacion-del-negocio' },
    ],
    'campaña': [
      { title: 'Lanzar en Meta', href: '/es/docs/lanzar-campana/lanzar-meta' },
      { title: 'Explorar Estrategias', href: '/es/docs/estrategias/explorar-estrategias' },
    ],
    'creativos': [
      { title: 'Generador de Creativos', href: '/es/docs/generar-creativos/introduccion-al-generador' },
    ],
    'imágenes': [
      { title: 'Generador de Creativos', href: '/es/docs/generar-creativos/introduccion-al-generador' },
    ],
    'créditos': [
      { title: 'Sistema de Créditos', href: '/es/docs/planes-creditos/sistema-creditos' },
    ],
    'facturación': [
      { title: 'Gestionar Facturación', href: '/es/docs/planes-creditos/facturacion' },
    ],
  },
  en: {
    'meta': [
      { title: 'Connect Facebook', href: '/en/docs/conectar-plataformas/meta-ads/conectar-facebook' },
      { title: 'Requirements', href: '/en/docs/conectar-plataformas/meta-ads/requisitos-previos' },
    ],
    'facebook': [
      { title: 'Connect Facebook', href: '/en/docs/conectar-plataformas/meta-ads/conectar-facebook' },
    ],
    'google': [
      { title: 'Connect Google Ads', href: '/en/docs/conectar-plataformas/google/conectar-google' },
    ],
    'tiktok': [
      { title: 'Connect TikTok', href: '/en/docs/conectar-plataformas/tiktok/conectar-tiktok' },
    ],
    'plan': [
      { title: 'Select Plan', href: '/en/docs/primeros-pasos/seleccionar-plan' },
      { title: 'Available Plans', href: '/en/docs/primeros-pasos/planes-disponibles' },
    ],
    'brief': [
      { title: 'Create Brief with Audio', href: '/en/docs/configurar-negocio/brief-audio' },
      { title: 'Business Information', href: '/en/docs/configurar-negocio/informacion-del-negocio' },
    ],
    'campaign': [
      { title: 'Launch on Meta', href: '/en/docs/lanzar-campana/lanzar-meta' },
      { title: 'Explore Strategies', href: '/en/docs/estrategias/explorar-estrategias' },
    ],
    'creatives': [
      { title: 'Creative Generator', href: '/en/docs/generar-creativos/introduccion-al-generador' },
    ],
    'images': [
      { title: 'Creative Generator', href: '/en/docs/generar-creativos/introduccion-al-generador' },
    ],
    'credits': [
      { title: 'Credits System', href: '/en/docs/planes-creditos/sistema-creditos' },
    ],
    'billing': [
      { title: 'Manage Billing', href: '/en/docs/planes-creditos/facturacion' },
    ],
  },
};

function findRelevantSources(query: string, locale: string): { title: string; href: string }[] {
  const links = docLinks[locale] || docLinks['es'];
  const queryLower = query.toLowerCase();
  const sources = new Set<{ title: string; href: string }>();
  
  for (const [keyword, docs] of Object.entries(links)) {
    if (queryLower.includes(keyword.toLowerCase())) {
      docs.forEach(doc => sources.add(doc));
    }
  }
  
  return Array.from(sources).slice(0, 3); // Max 3 sources
}

export async function POST(request: NextRequest) {
  try {
    // Get environment variables inside the handler
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';
    
    console.log('[Chat API] Request received');
    console.log('[Chat API] API Key present:', apiKey ? 'YES (hidden)' : 'NO');
    console.log('[Chat API] Model:', modelName);

    // Check if API key is configured
    if (!apiKey) {
      console.error('[Chat API] ERROR: GEMINI_API_KEY not set');
      return NextResponse.json(
        { 
          error: 'AI service not configured. Please set GEMINI_API_KEY environment variable.',
          errorCode: 'MISSING_API_KEY'
        },
        { status: 503 }
      );
    }

    // Initialize Gemini API inside the handler
    let genAI;
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      console.log('[Chat API] Gemini AI initialized successfully');
    } catch (initError) {
      console.error('[Chat API] ERROR initializing Gemini:', initError);
      return NextResponse.json(
        { 
          error: 'Failed to initialize AI service. Please check your API key.',
          errorCode: 'INIT_FAILED'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, locale = 'es', history = [], pageContext } = body;
    
    console.log('[Chat API] Message:', message?.substring(0, 50) + '...');
    console.log('[Chat API] Locale:', locale);
    
    // Rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0] || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { 
          error: locale === 'es' 
            ? 'Has alcanzado el límite de mensajes. Por favor, intenta de nuevo más tarde.' 
            : 'You have reached the message limit. Please try again later.',
          errorCode: 'RATE_LIMIT'
        },
        { status: 429 }
      );
    }
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required', errorCode: 'INVALID_MESSAGE' },
        { status: 400 }
      );
    }

    // Prepare the model
    let model;
    try {
      model = genAI.getGenerativeModel({ model: modelName });
      console.log('[Chat API] Model ready:', modelName);
    } catch (modelError) {
      console.error('[Chat API] ERROR getting model:', modelError);
      return NextResponse.json(
        { 
          error: 'Failed to load AI model. Please try again later.',
          errorCode: 'MODEL_ERROR'
        },
        { status: 500 }
      );
    }

    // Build conversation history for context
    const conversationHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Add page context if available
    let contextMessage = '';
    if (pageContext) {
      contextMessage = locale === 'es'
        ? `\n\nContexto: El usuario está viendo la página "${pageContext.title}" (${pageContext.url}). Puedes referenciar esta página en tu respuesta si es relevante.`
        : `\n\nContext: The user is viewing the page "${pageContext.title}" (${pageContext.url}). You can reference this page in your response if relevant.`;
    }

    // Start chat with system prompt
    let chat;
    try {
      chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemPrompts[locale] || systemPrompts['es'] }],
          },
          {
            role: 'model',
            parts: [{ text: locale === 'es' 
              ? 'Entendido. Estoy listo para ayudar con preguntas sobre SaleAds.ai.' 
              : 'Understood. I am ready to help with questions about SaleAds.ai.' 
            }],
          },
          ...conversationHistory,
        ],
      });
      console.log('[Chat API] Chat session started');
    } catch (chatError) {
      console.error('[Chat API] ERROR starting chat:', chatError);
      return NextResponse.json(
        { 
          error: 'Failed to start conversation. Please try again.',
          errorCode: 'CHAT_ERROR'
        },
        { status: 500 }
      );
    }

    // Generate response
    let result;
    try {
      result = await chat.sendMessage(message + contextMessage);
      console.log('[Chat API] Response generated successfully');
    } catch (generateError: any) {
      console.error('[Chat API] ERROR generating response:', generateError);
      
      // Check for specific Gemini API errors
      const errorMessage = generateError?.message || '';
      if (errorMessage.includes('API key')) {
        return NextResponse.json(
          { 
            error: 'Invalid API key. Please check your GEMINI_API_KEY configuration.',
            errorCode: 'INVALID_API_KEY'
          },
          { status: 401 }
        );
      }
      if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        return NextResponse.json(
          { 
            error: 'API quota exceeded. Please try again later.',
            errorCode: 'QUOTA_EXCEEDED'
          },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to generate response. Please try again.',
          errorCode: 'GENERATION_ERROR'
        },
        { status: 500 }
      );
    }

    const answer = result.response.text();

    // Find relevant documentation sources
    const sources = findRelevantSources(message, locale);
    
    // Add current page as source if available
    if (pageContext && !sources.find(s => s.href === pageContext.url)) {
      sources.unshift({
        title: pageContext.title,
        href: pageContext.url,
      });
    }

    // Generate follow-up suggestions based on the conversation
    const suggestions = generateSuggestions(message, locale, sources);

    console.log('[Chat API] Request completed successfully');

    return NextResponse.json({
      answer,
      sources: sources.slice(0, 3),
      suggestions: suggestions.slice(0, 3),
      confidence: 1,
    });
    
  } catch (error: any) {
    console.error('[Chat API] UNEXPECTED ERROR:', error);
    
    const errorLocale = 'es';
    return NextResponse.json(
      { 
        error: errorLocale === 'es'
          ? 'Lo siento, tuve un problema al procesar tu pregunta. Por favor, intenta de nuevo o consulta la documentación directamente.'
          : 'Sorry, I had trouble processing your question. Please try again or check the documentation directly.',
        errorCode: 'UNKNOWN_ERROR',
        details: error?.message || 'Unknown error'
      },
      { status: 200 } // Return 200 with error message to show in UI
    );
  }
}

function generateSuggestions(query: string, locale: string, sources: { title: string; href: string }[]): string[] {
  const queryLower = query.toLowerCase();
  const suggestions: string[] = [];
  
  if (locale === 'es') {
    if (queryLower.includes('meta') || queryLower.includes('facebook')) {
      suggestions.push('¿Cómo selecciono mi Business Manager?');
      suggestions.push('¿Qué hacer si tengo problemas con Meta?');
    }
    if (queryLower.includes('plan')) {
      suggestions.push('¿Cuántos créditos incluye cada plan?');
      suggestions.push('¿Cómo cambio de plan?');
    }
    if (queryLower.includes('campaña') || queryLower.includes('estrategia')) {
      suggestions.push('¿Cómo configuro el presupuesto?');
      suggestions.push('¿Cómo subo creativos?');
    }
    if (queryLower.includes('imagen') || queryLower.includes('creativo')) {
      suggestions.push('¿Qué son los niveles de calidad?');
      suggestions.push('¿Cómo escribir buenos prompts?');
    }
    if (suggestions.length === 0) {
      suggestions.push('¿Cómo conecto Meta Ads?');
      suggestions.push('¿Qué plan debo elegir?');
    }
  } else {
    if (queryLower.includes('meta') || queryLower.includes('facebook')) {
      suggestions.push('How do I select my Business Manager?');
      suggestions.push('What if I have problems with Meta?');
    }
    if (queryLower.includes('plan')) {
      suggestions.push('How many credits does each plan include?');
      suggestions.push('How do I change plans?');
    }
    if (queryLower.includes('campaign') || queryLower.includes('strategy')) {
      suggestions.push('How do I configure the budget?');
      suggestions.push('How do I upload creatives?');
    }
    if (queryLower.includes('image') || queryLower.includes('creative')) {
      suggestions.push('What are the quality levels?');
      suggestions.push('How do I write good prompts?');
    }
    if (suggestions.length === 0) {
      suggestions.push('How do I connect Meta Ads?');
      suggestions.push('Which plan should I choose?');
    }
  }
  
  return suggestions;
}
