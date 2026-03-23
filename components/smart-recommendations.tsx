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

// Content graph - defines relationships between pages
const contentGraph: Record<string, {
  prerequisites: string[];
  nextSteps: string[];
  related: string[];
}> = {
  '/es/docs/primeros-pasos/crear-cuenta': {
    prerequisites: [],
    nextSteps: ['/es/docs/primeros-pasos/seleccionar-plan'],
    related: ['/es/docs/primeros-pasos/navegacion-dashboard'],
  },
  '/es/docs/primeros-pasos/seleccionar-plan': {
    prerequisites: ['/es/docs/primeros-pasos/crear-cuenta'],
    nextSteps: ['/es/docs/configurar-negocio/informacion-del-negocio'],
    related: ['/es/docs/primeros-pasos/planes-disponibles'],
  },
  '/es/docs/configurar-negocio/informacion-del-negocio': {
    prerequisites: ['/es/docs/primeros-pasos/seleccionar-plan'],
    nextSteps: ['/es/docs/configurar-negocio/brief-audio'],
    related: [],
  },
  '/es/docs/configurar-negocio/brief-audio': {
    prerequisites: ['/es/docs/configurar-negocio/informacion-del-negocio'],
    nextSteps: ['/es/docs/conectar-plataformas'],
    related: ['/es/docs/configurar-negocio/revisar-brief'],
  },
  '/es/docs/conectar-plataformas': {
    prerequisites: ['/es/docs/configurar-negocio/brief-audio'],
    nextSteps: ['/es/docs/conectar-plataformas/meta-ads/requisitos-previos'],
    related: ['/es/docs/conectar-plataformas/meta-ads/conectar-facebook'],
  },
  '/es/docs/conectar-plataformas/meta-ads/requisitos-previos': {
    prerequisites: ['/es/docs/conectar-plataformas'],
    nextSteps: ['/es/docs/conectar-plataformas/meta-ads/conectar-facebook'],
    related: ['/es/docs/conectar-plataformas/meta-ads/problemas-meta'],
  },
  '/es/docs/conectar-plataformas/meta-ads/conectar-facebook': {
    prerequisites: ['/es/docs/conectar-plataformas/meta-ads/requisitos-previos'],
    nextSteps: ['/es/docs/conectar-plataformas/meta-ads/seleccionar-business-manager'],
    related: ['/es/docs/conectar-plataformas/meta-ads/cuenta-publicitaria'],
  },
  '/es/docs/conectar-plataformas/meta-ads/seleccionar-business-manager': {
    prerequisites: ['/es/docs/conectar-plataformas/meta-ads/conectar-facebook'],
    nextSteps: ['/es/docs/conectar-plataformas/meta-ads/cuenta-publicitaria'],
    related: ['/es/docs/conectar-plataformas/meta-ads/activos-opcionales'],
  },
  '/es/docs/conectar-plataformas/meta-ads/cuenta-publicitaria': {
    prerequisites: ['/es/docs/conectar-plataformas/meta-ads/seleccionar-business-manager'],
    nextSteps: ['/es/docs/estrategias/que-es-estrategia'],
    related: ['/es/docs/conectar-plataformas/meta-ads/activos-opcionales'],
  },
  '/es/docs/estrategias/que-es-estrategia': {
    prerequisites: ['/es/docs/conectar-plataformas/meta-ads/cuenta-publicitaria'],
    nextSteps: ['/es/docs/estrategias/explorar-estrategias'],
    related: ['/es/docs/estrategias/configurar-estrategia'],
  },
  '/es/docs/estrategias/explorar-estrategias': {
    prerequisites: ['/es/docs/estrategias/que-es-estrategia'],
    nextSteps: ['/es/docs/generar-creativos/introduccion-al-generador'],
    related: ['/es/docs/estrategias/configurar-estrategia'],
  },
  '/es/docs/generar-creativos/introduccion-al-generador': {
    prerequisites: ['/es/docs/estrategias/explorar-estrategias'],
    nextSteps: ['/es/docs/lanzar-campana/lanzar-meta'],
    related: ['/es/docs/generar-creativos/prompts-efectivos'],
  },
  '/es/docs/lanzar-campana/lanzar-meta': {
    prerequisites: ['/es/docs/generar-creativos/introduccion-al-generador'],
    nextSteps: ['/es/docs/lanzar-campana/gestionar-campanas'],
    related: ['/es/docs/lanzar-campana/revision-final'],
  },
  '/es/docs/lanzar-campana/gestionar-campanas': {
    prerequisites: ['/es/docs/lanzar-campana/lanzar-meta'],
    nextSteps: ['/es/docs/lanzar-campana/estrategias-lanzadas'],
    related: ['/es/docs/lanzar-campana/editar-copies'],
  },
};

// Popular content across all users
const popularContent: Recommendation[] = [
  {
    id: 'pop-1',
    type: 'popular',
    title: 'Seleccionar tu Plan',
    description: 'Compara planes PRO, BUSINESS y AGENCY',
    href: '/es/docs/primeros-pasos/seleccionar-plan',
    priority: 'high',
  },
  {
    id: 'pop-2',
    type: 'popular',
    title: 'Conectar Meta Ads',
    description: 'Vincula tu cuenta de Facebook e Instagram',
    href: '/es/docs/conectar-plataformas/meta-ads/conectar-facebook',
    priority: 'high',
  },
  {
    id: 'pop-3',
    type: 'popular',
    title: 'Lanzar tu Primera Campaña',
    description: 'Guía paso a paso para publicar en Meta',
    href: '/es/docs/lanzar-campana/lanzar-meta',
    priority: 'high',
  },
];

export function SmartRecommendations({ currentPath }: { currentPath: string }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Load user journey from localStorage
    const stored = localStorage.getItem('user-journey');
    const journey: UserJourney = stored 
      ? JSON.parse(stored)
      : { currentPath: '', visitedPaths: [], completedSteps: [] };

    // Update journey
    if (!journey.visitedPaths.includes(currentPath)) {
      journey.visitedPaths.push(currentPath);
    }
    journey.currentPath = currentPath;
    localStorage.setItem('user-journey', JSON.stringify(journey));

    // Generate recommendations
    const recs = generateRecommendations(currentPath, journey);
    setRecommendations(recs);
  }, [currentPath]);

  const generateRecommendations = (
    path: string,
    journey: UserJourney
  ): Recommendation[] => {
    const recs: Recommendation[] = [];
    const graph = contentGraph[path];

    if (graph) {
      // Add next steps
      graph.nextSteps.forEach((nextPath, index) => {
        if (!journey.completedSteps.includes(nextPath)) {
          recs.push({
            id: `next-${index}`,
            type: 'next-step',
            title: getPageTitle(nextPath),
            description: 'Siguiente paso recomendado',
            href: nextPath,
            priority: 'high',
          });
        }
      });

      // Add prerequisites if not completed
      graph.prerequisites.forEach((prereq, index) => {
        if (!journey.completedSteps.includes(prereq)) {
          recs.push({
            id: `pre-${index}`,
            type: 'prerequisite',
            title: getPageTitle(prereq),
            description: 'Contenido recomendado antes de continuar',
            href: prereq,
            priority: 'high',
          });
        }
      });

      // Add related content
      graph.related.slice(0, 2).forEach((related, index) => {
        if (!journey.visitedPaths.includes(related)) {
          recs.push({
            id: `rel-${index}`,
            type: 'related',
            title: getPageTitle(related),
            description: 'Contenido relacionado',
            href: related,
            priority: 'medium',
          });
        }
      });
    }

    // Add popular content if few recommendations
    if (recs.length < 3) {
      const remainingPopular = popularContent.filter(
        pop => !journey.visitedPaths.includes(pop.href) && pop.href !== path
      );
      recs.push(...remainingPopular.slice(0, 3 - recs.length));
    }

    return recs.slice(0, 4);
  };

  const getPageTitle = (path: string): string => {
    const titles: Record<string, string> = {
      '/es/docs/primeros-pasos/crear-cuenta': 'Crear Cuenta',
      '/es/docs/primeros-pasos/seleccionar-plan': 'Seleccionar Plan',
      '/es/docs/primeros-pasos/planes-disponibles': 'Planes Disponibles',
      '/es/docs/configurar-negocio/informacion-del-negocio': 'Información del Negocio',
      '/es/docs/configurar-negocio/brief-audio': 'Crear Brief con Audio',
      '/es/docs/configurar-negocio/revisar-brief': 'Revisar Brief',
      '/es/docs/conectar-plataformas': 'Conectar Plataformas',
      '/es/docs/conectar-plataformas/meta-ads/requisitos-previos': 'Requisitos Meta Ads',
      '/es/docs/conectar-plataformas/meta-ads/conectar-facebook': 'Conectar Facebook',
      '/es/docs/conectar-plataformas/meta-ads/seleccionar-business-manager': 'Seleccionar Business Manager',
      '/es/docs/conectar-plataformas/meta-ads/cuenta-publicitaria': 'Cuenta Publicitaria',
      '/es/docs/conectar-plataformas/meta-ads/activos-opcionales': 'Activos Opcionales',
      '/es/docs/conectar-plataformas/meta-ads/problemas-meta': 'Solución de Problemas Meta',
      '/es/docs/estrategias/que-es-estrategia': '¿Qué es una Estrategia?',
      '/es/docs/estrategias/explorar-estrategias': 'Explorar Estrategias',
      '/es/docs/estrategias/configurar-estrategia': 'Configurar Estrategia',
      '/es/docs/generar-creativos/introduccion-al-generador': 'Generador de Creativos',
      '/es/docs/generar-creativos/prompts-efectivos': 'Prompts Efectivos',
      '/es/docs/lanzar-campana/lanzar-meta': 'Lanzar en Meta',
      '/es/docs/lanzar-campana/revision-final': 'Revisión Final',
      '/es/docs/lanzar-campana/gestionar-campanas': 'Gestionar Campañas',
      '/es/docs/lanzar-campana/estrategias-lanzadas': 'Estrategias Lanzadas',
      '/es/docs/lanzar-campana/editar-copies': 'Editar Copies',
    };
    return titles[path] || 'Documentación';
  };

  const markCompleted = (href: string) => {
    const stored = localStorage.getItem('user-journey');
    const journey: UserJourney = stored 
      ? JSON.parse(stored)
      : { currentPath: '', visitedPaths: [], completedSteps: [] };
    
    if (!journey.completedSteps.includes(href)) {
      journey.completedSteps.push(href);
      localStorage.setItem('user-journey', JSON.stringify(journey));
      
      // Update recommendations
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
      case 'next-step': return 'Siguiente paso';
      case 'prerequisite': return 'Recomendado primero';
      case 'related': return 'Relacionado';
      case 'popular': return 'Popular';
      default: return 'Recomendado';
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
            Recomendaciones
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
                title="Marcar como completado"
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
          href="/es"
          className="text-xs text-fd-muted-foreground hover:text-fd-primary transition-colors inline-flex items-center gap-1"
        >
          Ver todo el contenido
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
