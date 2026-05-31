'use client';

import { useState, useEffect } from 'react';
import {
  Lightbulb,
  ArrowRight,
  BookOpen,
  Target,
  CheckCircle2,
  Circle,
  Sparkles,
  X
} from 'lucide-react';
import Link from 'next/link';

interface Recommendation {
  id: string;
  type: 'next-step' | 'related' | 'prerequisite' | 'popular';
  title: string;
  description: string;
  href: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

interface UserJourney {
  currentPath: string;
  visitedPaths: string[];
  completedSteps: string[];
}

// Locale-agnostic content graph - uses paths without locale prefix
const contentGraph: Record<string, {
  prerequisites: string[];
  nextSteps: string[];
  related: string[];
}> = {
  '/docs/primeros-pasos/crear-cuenta': {
    prerequisites: [],
    nextSteps: ['/docs/primeros-pasos/seleccionar-plan'],
    related: ['/docs/primeros-pasos/navegacion-dashboard'],
  },
  '/docs/primeros-pasos/seleccionar-plan': {
    prerequisites: ['/docs/primeros-pasos/crear-cuenta'],
    nextSteps: ['/docs/configurar-negocio/informacion-del-negocio'],
    related: ['/docs/primeros-pasos/planes-disponibles', '/docs/planes-creditos/bonos-educacion'],
  },
  '/docs/primeros-pasos/planes-disponibles': {
    prerequisites: [],
    nextSteps: ['/docs/primeros-pasos/seleccionar-plan'],
    related: ['/docs/planes-creditos/bonos-educacion', '/docs/planes-creditos/sistema-creditos'],
  },
  '/docs/planes-creditos/bonos-educacion': {
    prerequisites: [],
    nextSteps: [],
    related: ['/docs/primeros-pasos/planes-disponibles', '/docs/planes-creditos/creditos-incluidos'],
  },
  '/docs/planes-creditos/creditos-incluidos': {
    prerequisites: [],
    nextSteps: [],
    related: ['/docs/planes-creditos/bonos-educacion', '/docs/planes-creditos/sistema-creditos'],
  },
  '/docs/planes-creditos/sistema-creditos': {
    prerequisites: [],
    nextSteps: [],
    related: ['/docs/planes-creditos/creditos-incluidos', '/docs/planes-creditos/bonos-educacion'],
  },
  '/docs/configurar-negocio/informacion-del-negocio': {
    prerequisites: ['/docs/primeros-pasos/seleccionar-plan'],
    nextSteps: ['/docs/configurar-negocio/brief-audio'],
    related: [],
  },
  '/docs/configurar-negocio/brief-audio': {
    prerequisites: ['/docs/configurar-negocio/informacion-del-negocio'],
    nextSteps: ['/docs/conectar-plataformas'],
    related: ['/docs/configurar-negocio/revisar-brief'],
  },
  '/docs/conectar-plataformas': {
    prerequisites: ['/docs/configurar-negocio/brief-audio'],
    nextSteps: ['/docs/conectar-plataformas/meta-ads/requisitos-previos'],
    related: ['/docs/conectar-plataformas/meta-ads/conectar-facebook'],
  },
  '/docs/conectar-plataformas/meta-ads/requisitos-previos': {
    prerequisites: ['/docs/conectar-plataformas'],
    nextSteps: ['/docs/conectar-plataformas/meta-ads/conectar-facebook'],
    related: ['/docs/conectar-plataformas/meta-ads/problemas-meta'],
  },
  '/docs/conectar-plataformas/meta-ads/conectar-facebook': {
    prerequisites: ['/docs/conectar-plataformas/meta-ads/requisitos-previos'],
    nextSteps: ['/docs/conectar-plataformas/meta-ads/seleccionar-business-manager'],
    related: ['/docs/conectar-plataformas/meta-ads/cuenta-publicitaria'],
  },
  '/docs/conectar-plataformas/meta-ads/seleccionar-business-manager': {
    prerequisites: ['/docs/conectar-plataformas/meta-ads/conectar-facebook'],
    nextSteps: ['/docs/conectar-plataformas/meta-ads/cuenta-publicitaria'],
    related: ['/docs/conectar-plataformas/meta-ads/activos-digitales'],
  },
  '/docs/conectar-plataformas/meta-ads/cuenta-publicitaria': {
    prerequisites: ['/docs/conectar-plataformas/meta-ads/seleccionar-business-manager'],
    nextSteps: ['/docs/estrategias/que-es-estrategia'],
    related: ['/docs/conectar-plataformas/meta-ads/activos-digitales'],
  },
  '/docs/estrategias/que-es-estrategia': {
    prerequisites: ['/docs/conectar-plataformas/meta-ads/cuenta-publicitaria'],
    nextSteps: ['/docs/estrategias/explorar-estrategias'],
    related: ['/docs/estrategias/configurar-estrategia'],
  },
  '/docs/estrategias/explorar-estrategias': {
    prerequisites: ['/docs/estrategias/que-es-estrategia'],
    nextSteps: ['/docs/generar-creativos/introduccion-al-generador'],
    related: ['/docs/estrategias/configurar-estrategia'],
  },
  '/docs/generar-creativos/introduccion-al-generador': {
    prerequisites: ['/docs/estrategias/explorar-estrategias'],
    nextSteps: ['/docs/lanzar-campana/lanzar-meta'],
    related: ['/docs/generar-creativos/prompts-efectivos'],
  },
  '/docs/lanzar-campana/lanzar-meta': {
    prerequisites: ['/docs/generar-creativos/introduccion-al-generador'],
    nextSteps: ['/docs/lanzar-campana/gestionar-campanas'],
    related: ['/docs/lanzar-campana/revision-final'],
  },
  '/docs/lanzar-campana/gestionar-campanas': {
    prerequisites: ['/docs/lanzar-campana/lanzar-meta'],
    nextSteps: ['/docs/lanzar-campana/estrategias-lanzadas'],
    related: ['/docs/lanzar-campana/editar-copies'],
  },
};

const titles: Record<string, Record<string, string>> = {
  es: {
    '/docs/primeros-pasos/crear-cuenta': 'Crear Cuenta',
    '/docs/primeros-pasos/seleccionar-plan': 'Seleccionar Plan',
    '/docs/primeros-pasos/planes-disponibles': 'Planes Disponibles',
    '/docs/primeros-pasos/navegacion-dashboard': 'Navegación del Dashboard',
    '/docs/planes-creditos/bonos-educacion': 'Bonos de educación',
    '/docs/planes-creditos/creditos-incluidos': 'Créditos Incluidos',
    '/docs/planes-creditos/sistema-creditos': 'Sistema de Créditos',
    '/docs/configurar-negocio/informacion-del-negocio': 'Información del Negocio',
    '/docs/configurar-negocio/brief-audio': 'Crear Brief con Audio',
    '/docs/configurar-negocio/revisar-brief': 'Revisar Brief',
    '/docs/conectar-plataformas': 'Conectar Plataformas',
    '/docs/conectar-plataformas/meta-ads/requisitos-previos': 'Requisitos Meta Ads',
    '/docs/conectar-plataformas/meta-ads/conectar-facebook': 'Conectar Facebook',
    '/docs/conectar-plataformas/meta-ads/seleccionar-business-manager': 'Seleccionar Business Manager',
    '/docs/conectar-plataformas/meta-ads/cuenta-publicitaria': 'Cuenta Publicitaria',
    '/docs/conectar-plataformas/meta-ads/activos-digitales': 'Activos digitales',
    '/docs/conectar-plataformas/meta-ads/problemas-meta': 'Solución de Problemas Meta',
    '/docs/estrategias/que-es-estrategia': '¿Qué es una Estrategia?',
    '/docs/estrategias/explorar-estrategias': 'Explorar Estrategias',
    '/docs/estrategias/configurar-estrategia': 'Configurar Estrategia',
    '/docs/generar-creativos/introduccion-al-generador': 'Generador de Creativos',
    '/docs/generar-creativos/prompts-efectivos': 'Prompts Efectivos',
    '/docs/lanzar-campana/lanzar-meta': 'Lanzar en Meta',
    '/docs/lanzar-campana/revision-final': 'Revisión Final',
    '/docs/lanzar-campana/gestionar-campanas': 'Gestionar Campañas',
    '/docs/lanzar-campana/estrategias-lanzadas': 'Estrategias Lanzadas',
    '/docs/lanzar-campana/editar-copies': 'Editar Copies',
  },
  en: {
    '/docs/primeros-pasos/crear-cuenta': 'Create Account',
    '/docs/primeros-pasos/seleccionar-plan': 'Select Plan',
    '/docs/primeros-pasos/planes-disponibles': 'Available Plans',
    '/docs/primeros-pasos/navegacion-dashboard': 'Dashboard Navigation',
    '/docs/planes-creditos/bonos-educacion': 'Education Bonuses',
    '/docs/planes-creditos/creditos-incluidos': 'Credits Included',
    '/docs/planes-creditos/sistema-creditos': 'Credits System',
    '/docs/configurar-negocio/informacion-del-negocio': 'Business Information',
    '/docs/configurar-negocio/brief-audio': 'Create Brief with Audio',
    '/docs/configurar-negocio/revisar-brief': 'Review Brief',
    '/docs/conectar-plataformas': 'Connect Platforms',
    '/docs/conectar-plataformas/meta-ads/requisitos-previos': 'Meta Ads Prerequisites',
    '/docs/conectar-plataformas/meta-ads/conectar-facebook': 'Connect Facebook',
    '/docs/conectar-plataformas/meta-ads/seleccionar-business-manager': 'Select Business Manager',
    '/docs/conectar-plataformas/meta-ads/cuenta-publicitaria': 'Ad Account',
    '/docs/conectar-plataformas/meta-ads/activos-digitales': 'Digital Assets',
    '/docs/conectar-plataformas/meta-ads/problemas-meta': 'Meta Troubleshooting',
    '/docs/estrategias/que-es-estrategia': 'What is a Strategy?',
    '/docs/estrategias/explorar-estrategias': 'Explore Strategies',
    '/docs/estrategias/configurar-estrategia': 'Configure Strategy',
    '/docs/generar-creativos/introduccion-al-generador': 'Creative Generator',
    '/docs/generar-creativos/prompts-efectivos': 'Effective Prompts',
    '/docs/lanzar-campana/lanzar-meta': 'Launch on Meta',
    '/docs/lanzar-campana/revision-final': 'Final Review',
    '/docs/lanzar-campana/gestionar-campanas': 'Manage Campaigns',
    '/docs/lanzar-campana/estrategias-lanzadas': 'Launched Strategies',
    '/docs/lanzar-campana/editar-copies': 'Edit Copies',
  },
};

const i18n = {
  es: {
    recommendations: 'Recomendaciones',
    nextStep: 'Siguiente paso',
    prerequisite: 'Recomendado primero',
    related: 'Relacionado',
    popular: 'Popular',
    recommended: 'Recomendado',
    nextStepDesc: 'Siguiente paso recomendado',
    prerequisiteDesc: 'Contenido recomendado antes de continuar',
    relatedDesc: 'Contenido relacionado',
    viewAll: 'Ver todo el contenido',
    markCompleted: 'Marcar como completado',
    fallbackTitle: 'Documentación',
    popularItems: [
      { id: 'pop-1', title: 'Seleccionar tu Plan', description: 'Compara planes PRO y BUSINESS', href: '/docs/primeros-pasos/seleccionar-plan' },
      { id: 'pop-2', title: 'Conectar Meta Ads', description: 'Vincula tu cuenta de Facebook e Instagram', href: '/docs/conectar-plataformas/meta-ads/conectar-facebook' },
      { id: 'pop-3', title: 'Lanzar tu Primera Estrategia', description: 'Guía paso a paso para publicar en Meta', href: '/docs/lanzar-campana/lanzar-meta' },
    ],
  },
  en: {
    recommendations: 'Recommendations',
    nextStep: 'Next step',
    prerequisite: 'Recommended first',
    related: 'Related',
    popular: 'Popular',
    recommended: 'Recommended',
    nextStepDesc: 'Recommended next step',
    prerequisiteDesc: 'Recommended content before continuing',
    relatedDesc: 'Related content',
    viewAll: 'View all content',
    markCompleted: 'Mark as completed',
    fallbackTitle: 'Documentation',
    popularItems: [
      { id: 'pop-1', title: 'Select Your Plan', description: 'Compare PRO and BUSINESS plans', href: '/docs/primeros-pasos/seleccionar-plan' },
      { id: 'pop-2', title: 'Connect Meta Ads', description: 'Link your Facebook and Instagram accounts', href: '/docs/conectar-plataformas/meta-ads/conectar-facebook' },
      { id: 'pop-3', title: 'Launch Your First Strategy', description: 'Step-by-step guide to publish on Meta', href: '/docs/lanzar-campana/lanzar-meta' },
    ],
  },
};

function stripLocale(path: string): string {
  return path.replace(/^\/(es|en)/, '');
}

function addLocale(path: string, locale: string): string {
  return `/${locale}${path}`;
}

export function SmartRecommendations({ currentPath, locale = 'es' }: { currentPath: string; locale?: string }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const t = i18n[locale as keyof typeof i18n] || i18n.es;
  const localeTitles = titles[locale] || titles.es;

  useEffect(() => {
    const stored = localStorage.getItem('user-journey');
    const journey: UserJourney = stored
      ? JSON.parse(stored)
      : { currentPath: '', visitedPaths: [], completedSteps: [] };

    if (!journey.visitedPaths.includes(currentPath)) {
      journey.visitedPaths.push(currentPath);
    }
    journey.currentPath = currentPath;
    localStorage.setItem('user-journey', JSON.stringify(journey));

    const recs = generateRecommendations(currentPath, journey);
    setRecommendations(recs);
  }, [currentPath]);

  const generateRecommendations = (
    path: string,
    journey: UserJourney
  ): Recommendation[] => {
    const recs: Recommendation[] = [];
    const normalizedPath = stripLocale(path);
    const graph = contentGraph[normalizedPath];

    if (graph) {
      graph.nextSteps.forEach((nextPath, index) => {
        const fullPath = addLocale(nextPath, locale);
        if (!journey.completedSteps.includes(fullPath)) {
          recs.push({
            id: `next-${index}`,
            type: 'next-step',
            title: localeTitles[nextPath] || t.fallbackTitle,
            description: t.nextStepDesc,
            href: fullPath,
            priority: 'high',
          });
        }
      });

      graph.prerequisites.forEach((prereq, index) => {
        const fullPath = addLocale(prereq, locale);
        if (!journey.completedSteps.includes(fullPath)) {
          recs.push({
            id: `pre-${index}`,
            type: 'prerequisite',
            title: localeTitles[prereq] || t.fallbackTitle,
            description: t.prerequisiteDesc,
            href: fullPath,
            priority: 'high',
          });
        }
      });

      graph.related.slice(0, 2).forEach((related, index) => {
        const fullPath = addLocale(related, locale);
        if (!journey.visitedPaths.includes(fullPath)) {
          recs.push({
            id: `rel-${index}`,
            type: 'related',
            title: localeTitles[related] || t.fallbackTitle,
            description: t.relatedDesc,
            href: fullPath,
            priority: 'medium',
          });
        }
      });
    }

    if (recs.length < 3) {
      const popularContent: Recommendation[] = t.popularItems.map(item => ({
        ...item,
        type: 'popular' as const,
        href: addLocale(item.href, locale),
        priority: 'high' as const,
      }));
      const remainingPopular = popularContent.filter(
        pop => !journey.visitedPaths.includes(pop.href) && pop.href !== path
      );
      recs.push(...remainingPopular.slice(0, 3 - recs.length));
    }

    return recs.slice(0, 4);
  };

  const markCompleted = (href: string) => {
    const stored = localStorage.getItem('user-journey');
    const journey: UserJourney = stored
      ? JSON.parse(stored)
      : { currentPath: '', visitedPaths: [], completedSteps: [] };

    if (!journey.completedSteps.includes(href)) {
      journey.completedSteps.push(href);
      localStorage.setItem('user-journey', JSON.stringify(journey));

      const recs = generateRecommendations(currentPath, journey);
      setRecommendations(recs);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'next-step': return Target;
      case 'prerequisite': return CheckCircle2;
      case 'related': return BookOpen;
      case 'popular': return Sparkles;
      default: return Lightbulb;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'next-step': return t.nextStep;
      case 'prerequisite': return t.prerequisite;
      case 'related': return t.related;
      case 'popular': return t.popular;
      default: return t.recommended;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'next-step': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'prerequisite': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'related': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      case 'popular': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-fd-accent text-fd-foreground';
    }
  };

  if (!isVisible || recommendations.length === 0) return null;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-3 py-2 bg-fd-primary text-fd-primary-foreground rounded-l-lg shadow-lg hover:bg-fd-primary/90 transition-all"
      >
        <Lightbulb className="h-4 w-4" />
        <span className="text-xs font-medium">{recommendations.length}</span>
      </button>
    );
  }

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 w-72 bg-fd-background rounded-xl shadow-xl border max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-fd-accent/30 border-b">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-fd-primary" />
          <span className="text-sm font-medium text-fd-foreground">
            {t.recommendations}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            <span className="text-xs">−</span>
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(80vh-60px)]">
        {recommendations.map((rec) => {
          const Icon = getIcon(rec.type);
          return (
            <div
              key={rec.id}
              className="group relative bg-fd-accent/20 rounded-lg p-3 hover:bg-fd-accent/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded ${getColor(rec.type)}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] uppercase tracking-wide font-medium ${getColor(rec.type)} px-1.5 py-0.5 rounded`}>
                    {getLabel(rec.type)}
                  </span>
                  <Link
                    href={rec.href}
                    className="block mt-1.5 text-sm font-medium text-fd-foreground hover:text-fd-primary transition-colors"
                  >
                    {rec.title}
                  </Link>
                  <p className="text-xs text-fd-muted-foreground mt-0.5">
                    {rec.description}
                  </p>
                </div>
              </div>

              {/* Mark as completed */}
              <button
                onClick={() => markCompleted(rec.href)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title={t.markCompleted}
              >
                <Circle className="h-4 w-4 text-fd-muted-foreground hover:text-green-500" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-fd-accent/20 border-t text-center">
        <Link
          href={`/${locale}`}
          className="text-xs text-fd-muted-foreground hover:text-fd-primary transition-colors inline-flex items-center gap-1"
        >
          {t.viewAll}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
