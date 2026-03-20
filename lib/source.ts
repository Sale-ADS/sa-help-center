import { docsEs, docsEn } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { createElement } from 'react';
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
import { MetaIcon, GoogleIcon, TikTokIcon } from '@/components/icons';

const iconMap: Record<string, React.ComponentType> = {
  UserPlus,
  Link2,
  Building2,
  CreditCard,
  Target,
  Sparkles,
  Rocket,
  HelpCircle,
  BookOpen,
  Meta: MetaIcon,
  Google: GoogleIcon,
  TikTok: TikTokIcon,
};

function resolveIcon(icon: string | undefined) {
  if (!icon || !(icon in iconMap)) return undefined;
  return createElement(iconMap[icon]);
}

export const sourceEs = loader({
  baseUrl: '/es/docs',
  source: docsEs.toFumadocsSource(),
  icon: resolveIcon,
});

export const sourceEn = loader({
  baseUrl: '/en/docs',
  source: docsEn.toFumadocsSource(),
  icon: resolveIcon,
});

export function getSource(locale: string) {
  return locale === 'en' ? sourceEn : sourceEs;
}
