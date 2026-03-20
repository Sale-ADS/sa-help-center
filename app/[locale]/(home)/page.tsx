import { Card, Cards } from 'fumadocs-ui/components/card';
import {
  UserPlus,
  Link2,
  Building2,
  CreditCard,
  Target,
  Sparkles,
  Rocket,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface CardItem {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}

const content: Record<string, { title: string; subtitle: string; cards: CardItem[] }> = {
  es: {
    title: 'Centro de Ayuda SaleAds.ai',
    subtitle:
      'De la idea a la campaña en minutos. Encuentra guías y tutoriales para sacar el máximo provecho de SaleAds.ai.',
    cards: [
      {
        icon: <UserPlus />,
        title: 'Primeros Pasos',
        description: 'Crea tu cuenta y selecciona tu plan',
        href: '/es/docs/primeros-pasos/crear-cuenta',
      },
      {
        icon: <Link2 />,
        title: 'Conectar Plataformas',
        description: 'Conecta Meta Ads, Google y TikTok',
        href: '/es/docs/conectar-plataformas',
      },
      {
        icon: <Building2 />,
        title: 'Configurar Negocio',
        description: 'Define tu marca, audiencia y brief con IA',
        href: '/es/docs/configurar-negocio/informacion-del-negocio',
      },
      {
        icon: <CreditCard />,
        title: 'Planes y Créditos',
        description: 'Entiende créditos, planes y facturación',
        href: '/es/docs/planes-creditos/sistema-creditos',
      },
      {
        icon: <Target />,
        title: 'Crear Estrategias',
        description: 'Elige y configura estrategias publicitarias',
        href: '/es/docs/estrategias/que-es-estrategia',
      },
      {
        icon: <Sparkles />,
        title: 'Generar Creativos con IA',
        description: 'Genera imágenes profesionales en segundos',
        href: '/es/docs/generar-creativos/introduccion-al-generador',
      },
      {
        icon: <Rocket />,
        title: 'Lanzar Campaña',
        description: 'Revisa, edita copies y lanza en Meta',
        href: '/es/docs/lanzar-campana/gestionar-campanas',
      },
      {
        icon: <HelpCircle />,
        title: 'Solución de Problemas',
        description: 'Errores comunes y cómo resolverlos',
        href: '/es/docs/solucion-problemas/preguntas-frecuentes',
      },
      {
        icon: <BookOpen />,
        title: 'Glosario',
        description: 'Términos y definiciones de la plataforma',
        href: '/es/docs/informacion-general/glosario',
      },
    ],
  },
  en: {
    title: 'SaleAds.ai Help Center',
    subtitle:
      'From idea to campaign in minutes. Find guides and tutorials to get the most out of SaleAds.ai.',
    cards: [
      {
        icon: <UserPlus />,
        title: 'Getting Started',
        description: 'Create your account and select your plan',
        href: '/en/docs/primeros-pasos/crear-cuenta',
      },
      {
        icon: <Link2 />,
        title: 'Connect Platforms',
        description: 'Connect Meta Ads, Google and TikTok',
        href: '/en/docs/conectar-plataformas',
      },
      {
        icon: <Building2 />,
        title: 'Configure Business',
        description: 'Define your brand, audience and AI brief',
        href: '/en/docs/configurar-negocio/informacion-del-negocio',
      },
      {
        icon: <CreditCard />,
        title: 'Plans & Credits',
        description: 'Understand credits, plans and billing',
        href: '/en/docs/planes-creditos/sistema-creditos',
      },
      {
        icon: <Target />,
        title: 'Create Strategies',
        description: 'Choose and configure advertising strategies',
        href: '/en/docs/estrategias/que-es-estrategia',
      },
      {
        icon: <Sparkles />,
        title: 'Generate Creatives with AI',
        description: 'Generate professional images in seconds',
        href: '/en/docs/generar-creativos/introduccion-al-generador',
      },
      {
        icon: <Rocket />,
        title: 'Launch Campaign',
        description: 'Review, edit copy and launch on Meta',
        href: '/en/docs/lanzar-campana/gestionar-campanas',
      },
      {
        icon: <HelpCircle />,
        title: 'Troubleshooting',
        description: 'Common errors and how to fix them',
        href: '/en/docs/solucion-problemas/preguntas-frecuentes',
      },
      {
        icon: <BookOpen />,
        title: 'Glossary',
        description: 'Platform terms and definitions',
        href: '/en/docs/informacion-general/glosario',
      },
    ],
  },
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = locale === 'en' ? content.en : content.es;

  return (
    <main className="w-full max-w-5xl mx-auto [grid-area:main] px-4 py-6 md:px-6 md:pt-8 xl:px-8 xl:pt-14">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">{t.title}</h1>
        <p className="mx-auto max-w-2xl text-lg text-fd-muted-foreground">
          {t.subtitle}
        </p>
      </div>

      <Cards>
        {t.cards.map((card) => (
          <Card
            key={card.href}
            icon={card.icon}
            title={card.title}
            description={card.description}
            href={card.href}
          />
        ))}
      </Cards>
    </main>
  );
}
