import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Steps, Step } from 'fumadocs-ui/components/steps';
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
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Steps,
    Step,
    UserPlus,
    Link2,
    Building2,
    CreditCard,
    Target,
    Sparkles,
    Rocket,
    HelpCircle,
    BookOpen,
    MetaIcon,
    GoogleIcon,
    TikTokIcon,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
