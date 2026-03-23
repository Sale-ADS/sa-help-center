'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  User,
  Loader2,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Minimize2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePageContext } from './page-context';
import { MarkdownMessage } from './markdown-message';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  sources?: { title: string; href: string }[];
  feedback?: 'helpful' | 'not-helpful';
}

interface AIAssistantProps {
  locale: string;
}

const quickQuestions: Record<string, string[]> = {
  es: [
    '¿Cómo conecto Meta Ads?',
    '¿Qué plan debo elegir?',
    '¿Cómo creo el Brief?',
    '¿Cómo lanzo una campaña?',
    '¿Cómo genero imágenes con IA?',
  ],
  en: [
    'How do I connect Meta Ads?',
    'Which plan should I choose?',
    'How do I create the Brief?',
    'How do I launch a campaign?',
    'How do I generate AI images?',
  ],
};

const welcomeMessages: Record<string, { title: string; description: string }> = {
  es: {
    title: '¡Hola! Soy tu asistente de SaleAds.ai 👋',
    description: 'Puedo ayudarte a encontrar respuestas en la documentación. ¿Qué necesitas saber?',
  },
  en: {
    title: 'Hello! I am your SaleAds.ai assistant 👋',
    description: 'I can help you find answers in the documentation. What do you need to know?',
  },
};

/** SaleAds-style violet → purple chrome (distinct from docs theme primary). */
const assistantChromeGradient =
  'bg-gradient-to-r from-violet-950 via-purple-950 to-violet-900';

/** Darker purple for welcome hero icon, send CTA, and matching accents. */
const assistantPurpleDarkBr =
  'bg-gradient-to-br from-violet-950 via-purple-950 to-black';

const ASSISTANT_BRAND_IMG = '/images/saleads-app-icon.png';

function AssistantBrandIcon({
  size,
  className = '',
  priority = false,
}: {
  size: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={ASSISTANT_BRAND_IMG}
      alt=""
      width={size}
      height={size}
      className={`object-cover ${className}`}
      priority={priority}
    />
  );
}

export function AIAssistant({ locale }: AIAssistantProps) {
  const pageContext = usePageContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversation history
  useEffect(() => {
    const stored = localStorage.getItem(`ai-assistant-history-${locale}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      setHasStarted(parsed.length > 0);
    }
  }, [locale]);

  // Save conversation history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`ai-assistant-history-${locale}`, JSON.stringify(messages));
    }
  }, [messages, locale]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setHasStarted(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          locale,
          history: messages.slice(-5),
          pageContext: pageContext ? {
            title: pageContext.title,
            description: pageContext.description,
            url: pageContext.url,
          } : null,
        }),
      });

      const data = await response.json();
      console.log('[AI Assistant] API Response:', data);

      // Check if API returned an error
      if (data.error) {
        console.error('[AI Assistant] API Error:', data.error, data.errorCode);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.error,
          timestamp: new Date(),
          sources: data.sources || [],
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        suggestions: data.suggestions,
        sources: data.sources,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('[AI Assistant] Fetch Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: locale === 'es' 
          ? 'Error de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.'
          : 'Connection error. Please check your internet connection and try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId: string, feedback: 'helpful' | 'not-helpful') => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, feedback } : m
    ));

    fetch('/api/chat/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId, feedback }),
    }).catch(console.error);
  };

  const clearHistory = () => {
    setMessages([]);
    setHasStarted(false);
    localStorage.removeItem(`ai-assistant-history-${locale}`);
  };

  const welcome = welcomeMessages[locale];
  const questions = quickQuestions[locale];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 ${assistantChromeGradient} text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105`}
      >
        <AssistantBrandIcon size={20} className="rounded-md shrink-0" />
        <span className="text-sm font-medium">
          {locale === 'es' ? 'Pregunta a la IA' : 'Ask AI'}
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isMinimized 
        ? 'bottom-6 right-6 w-auto' 
        : 'bottom-6 right-6 w-[400px] h-[600px] max-h-[calc(100vh-100px)]'
    }`}>
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-2 px-4 py-3 ${assistantChromeGradient} text-white rounded-full shadow-lg hover:shadow-xl transition-all`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm font-medium">
            {locale === 'es' ? 'Continuar chat' : 'Continue chat'}
          </span>
          {messages.length > 0 && (
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
              {messages.filter(m => m.role === 'assistant').length}
            </span>
          )}
        </button>
      ) : (
        <div className="flex flex-col h-full bg-fd-background rounded-2xl shadow-2xl border overflow-hidden">
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 ${assistantChromeGradient} flex-shrink-0`}>
            <div className="flex items-center gap-2">
              <div className="p-0.5 bg-white/20 rounded-lg overflow-hidden">
                <AssistantBrandIcon size={28} className="rounded-md" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  SaleDocs AI
                </h3>
                <p className="text-xs text-white/70">
                  {locale === 'es' ? 'Asistente inteligente' : 'Smart assistant'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {hasStarted && (
                <button
                  onClick={clearHistory}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                  title={locale === 'es' ? 'Nueva conversación' : 'New conversation'}
                >
                  <span className="text-xs">{locale === 'es' ? 'Nuevo' : 'New'}</span>
                </button>
              )}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!hasStarted ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="inline-flex mb-4 shadow-lg rounded-2xl overflow-hidden ring-1 ring-fd-border/60">
                    <AssistantBrandIcon size={64} className="rounded-2xl" priority />
                  </div>
                  <h4 className="text-lg font-semibold text-fd-foreground mb-2">
                    {welcome.title}
                  </h4>
                  <p className="text-sm text-fd-muted-foreground">
                    {welcome.description}
                  </p>
                </div>

                {/* Quick Questions */}
                <div>
                  <p className="text-xs text-fd-muted-foreground mb-2 uppercase tracking-wide">
                    {locale === 'es' ? 'Preguntas populares' : 'Popular questions'}
                  </p>
                  <div className="space-y-2">
                    {questions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => sendMessage(question)}
                        className="w-full text-left px-3 py-2.5 text-sm bg-fd-accent/50 hover:bg-fd-accent rounded-lg transition-colors text-fd-foreground"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center ${
                        message.role === 'user' ? 'bg-fd-primary/10' : ''
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-fd-primary" />
                      ) : (
                        <AssistantBrandIcon size={32} className="rounded-lg" />
                      )}
                    </div>
                    <div className={`flex-1 space-y-2 ${message.role === 'user' ? 'items-end' : ''}`}>
                      <div className={`inline-block max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                        message.role === 'user'
                          ? 'bg-fd-primary text-fd-primary-foreground rounded-tr-sm'
                          : 'bg-fd-accent text-fd-foreground rounded-tl-sm'
                      }`}>
                        {message.role === 'assistant' ? (
                          <MarkdownMessage content={message.content} />
                        ) : (
                          message.content
                        )}
                      </div>

                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source, idx) => (
                            <Link
                              key={idx}
                              href={source.href}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-fd-accent/50 hover:bg-fd-accent text-fd-primary rounded-full transition-colors"
                            >
                              <BookOpen className="h-3 w-3" />
                              {source.title}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => sendMessage(suggestion)}
                              className="text-xs text-fd-muted-foreground hover:text-fd-primary underline"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Feedback */}
                      {message.role === 'assistant' && !message.feedback && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-fd-muted-foreground">
                            {locale === 'es' ? '¿Fue útil?' : 'Was this helpful?'}
                          </span>
                          <button
                            onClick={() => handleFeedback(message.id, 'helpful')}
                            className="p-1 text-fd-muted-foreground hover:text-green-500 transition-colors"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, 'not-helpful')}
                            className="p-1 text-fd-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                      <AssistantBrandIcon size={32} className="rounded-lg" />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-fd-accent rounded-2xl rounded-tl-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-fd-muted-foreground" />
                      <span className="text-sm text-fd-muted-foreground">
                        {locale === 'es' ? 'Pensando...' : 'Thinking...'}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-fd-accent/20 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={locale === 'es' ? 'Escribe tu pregunta...' : 'Type your question...'}
                className="flex-1 px-4 py-2.5 text-sm bg-fd-background border rounded-full focus:outline-none focus:ring-2 focus:ring-fd-primary/50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2.5 ${assistantPurpleDarkBr} text-white rounded-full hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="text-xs text-fd-muted-foreground mt-2 text-center">
              {locale === 'es' 
                ? 'La IA puede cometer errores. Verifica la información importante.'
                : 'AI can make mistakes. Verify important information.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
