'use client';

import { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, Lightbulb } from 'lucide-react';
import Link from 'next/link';

interface SearchSuggestion {
  query: string;
  category: string;
}

interface SearchSuggestionsProps {
  locale: string;
}

const suggestions: Record<string, SearchSuggestion[]> = {
  es: [
    { query: 'conectar meta', category: 'Primeros pasos' },
    { query: 'cómo crear campaña', category: 'Lanzar campaña' },
    { query: 'seleccionar plan', category: 'Planes' },
    { query: 'business manager', category: 'Meta Ads' },
    { query: 'configurar negocio', category: 'Configuración' },
    { query: 'créditos', category: 'Facturación' },
    { query: 'google ads', category: 'Plataformas' },
    { query: 'tiktok', category: 'Plataformas' },
  ],
  en: [
    { query: 'connect meta', category: 'Getting Started' },
    { query: 'create campaign', category: 'Launch Campaign' },
    { query: 'select plan', category: 'Plans' },
    { query: 'business manager', category: 'Meta Ads' },
    { query: 'configure business', category: 'Configuration' },
    { query: 'credits', category: 'Billing' },
    { query: 'google ads', category: 'Platforms' },
    { query: 'tiktok', category: 'Platforms' },
  ],
};

const intentRoutes: Record<string, string> = {
  // Spanish
  'conectar meta': '/es/docs/conectar-plataformas/meta-ads/conectar-facebook',
  'conectar facebook': '/es/docs/conectar-plataformas/meta-ads/conectar-facebook',
  'business manager': '/es/docs/conectar-plataformas/meta-ads/seleccionar-business-manager',
  'seleccionar plan': '/es/docs/primeros-pasos/seleccionar-plan',
  'planes': '/es/docs/primeros-pasos/planes-disponibles',
  'crear campaña': '/es/docs/lanzar-campana/lanzar-meta',
  'lanzar': '/es/docs/lanzar-campana',
  'google ads': '/es/docs/conectar-plataformas/google/conectar-google',
  'tiktok': '/es/docs/conectar-plataformas/tiktok/conectar-tiktok',
  'configurar negocio': '/es/docs/configurar-negocio/informacion-del-negocio',
  'créditos': '/es/docs/planes-creditos/sistema-creditos',
  'facturación': '/es/docs/planes-creditos/facturacion',
  'soporte': '/es/docs/solucion-problemas/contactar-soporte',
  
  // English
  'connect meta': '/en/docs/conectar-plataformas/meta-ads/conectar-facebook',
  'connect facebook': '/en/docs/conectar-plataformas/meta-ads/conectar-facebook',
  'select plan': '/en/docs/primeros-pasos/seleccionar-plan',
  'plans': '/en/docs/primeros-pasos/planes-disponibles',
  'create campaign': '/en/docs/lanzar-campana/lanzar-meta',
  'launch': '/en/docs/lanzar-campana',
  'configure business': '/en/docs/configurar-negocio/informacion-del-negocio',
  'billing': '/en/docs/planes-creditos/facturacion',
  'support': '/en/docs/solucion-problemas/contactar-soporte',
};

export function SearchSuggestions({ locale }: SearchSuggestionsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedIntent, setMatchedIntent] = useState<string | null>(null);

  const localeSuggestions = suggestions[locale] || suggestions['es'];

  useEffect(() => {
    // Check if search dialog is open
    const observer = new MutationObserver(() => {
      const searchDialog = document.querySelector('[data-search-dialog]') || 
                          document.querySelector('[role="dialog"]');
      setIsVisible(!!searchDialog);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Listen for search input
  useEffect(() => {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.placeholder?.toLowerCase().includes('search')) {
        setSearchQuery(target.value.toLowerCase());
      }
    };

    document.addEventListener('input', handleInput);
    return () => document.removeEventListener('input', handleInput);
  }, []);

  // Check for intent matches
  useEffect(() => {
    if (searchQuery.length > 2) {
      const matched = Object.keys(intentRoutes).find(key => 
        searchQuery.includes(key) || key.includes(searchQuery)
      );
      setMatchedIntent(matched || null);
    } else {
      setMatchedIntent(null);
    }
  }, [searchQuery]);

  if (!isVisible) return null;

  return (
    <div className="px-4 pb-4 border-t pt-4 mt-2">
      {/* AI Suggestion */}
      {matchedIntent && (
        <div className="mb-4 p-3 bg-gradient-to-r from-fd-primary/10 to-fd-primary/5 rounded-lg border border-fd-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-fd-primary" />
            <span className="text-sm font-medium text-fd-foreground">
              {locale === 'es' ? 'Sugerencia de IA' : 'AI Suggestion'}
            </span>
          </div>
          <p className="text-sm text-fd-muted-foreground mb-2">
            {locale === 'es' 
              ? 'Parece que estás buscando información sobre:' 
              : 'It looks like you are looking for information about:'}
            <span className="font-medium text-fd-foreground"> "{matchedIntent}"</span>
          </p>
          <Link
            href={intentRoutes[matchedIntent]}
            className="inline-flex items-center gap-1 text-sm text-fd-primary hover:underline"
          >
            {locale === 'es' ? 'Ir a la guía →' : 'Go to guide →'}
          </Link>
        </div>
      )}

      {/* Popular Searches */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-fd-muted-foreground" />
          <span className="text-xs font-medium text-fd-muted-foreground uppercase tracking-wide">
            {locale === 'es' ? 'Búsquedas populares' : 'Popular searches'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {localeSuggestions.map((suggestion) => (
            <Link
              key={suggestion.query}
              href={`/api/search?q=${encodeURIComponent(suggestion.query)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-fd-accent hover:bg-fd-accent/80 rounded-full transition-colors"
            >
              <Search className="h-3 w-3 text-fd-muted-foreground" />
              <span className="text-fd-foreground">{suggestion.query}</span>
              <span className="text-xs text-fd-muted-foreground">· {suggestion.category}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-fd-muted-foreground" />
          <span className="text-xs font-medium text-fd-muted-foreground uppercase tracking-wide">
            {locale === 'es' ? 'Consejo rápido' : 'Quick tip'}
          </span>
        </div>
        <p className="text-sm text-fd-muted-foreground">
          {locale === 'es'
            ? 'Usa términos específicos como "business manager", "pixel" o "créditos" para encontrar resultados más precisos.'
            : 'Use specific terms like "business manager", "pixel", or "credits" to find more precise results.'}
        </p>
      </div>
    </div>
  );
}
