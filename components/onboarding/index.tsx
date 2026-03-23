'use client';

import { useState, useEffect } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  X,
  UserPlus,
  CreditCard,
  Building2,
  Link2,
  Rocket,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
  actionHref: string;
  docsHref: string;
  isCompleted: boolean;
}

interface OnboardingWizardProps {
  locale: string;
}

const getSteps = (locale: string): OnboardingStep[] => [
  {
    id: 'account',
    title: locale === 'es' ? 'Crea tu Cuenta' : 'Create Your Account',
    description: locale === 'es' 
      ? 'Regístrate con Google o Microsoft para comenzar'
      : 'Sign up with Google or Microsoft to get started',
    icon: <UserPlus className="h-5 w-5" />,
    actionLabel: locale === 'es' ? 'Crear cuenta' : 'Create account',
    actionHref: 'https://saleads.ai',
    docsHref: `/${locale}/docs/primeros-pasos/crear-cuenta`,
    isCompleted: false,
  },
  {
    id: 'plan',
    title: locale === 'es' ? 'Selecciona tu Plan' : 'Select Your Plan',
    description: locale === 'es'
      ? 'Elige entre PRO, BUSINESS o AGENCY según tus necesidades'
      : 'Choose between PRO, BUSINESS, or AGENCY based on your needs',
    icon: <CreditCard className="h-5 w-5" />,
    actionLabel: locale === 'es' ? 'Ver planes' : 'View plans',
    actionHref: 'https://saleads.ai/pricing',
    docsHref: `/${locale}/docs/primeros-pasos/seleccionar-plan`,
    isCompleted: false,
  },
  {
    id: 'business',
    title: locale === 'es' ? 'Configura tu Negocio' : 'Set Up Your Business',
    description: locale === 'es'
      ? 'Graba tu audio para crear el Brief con IA'
      : 'Record your audio to create the AI Brief',
    icon: <Building2 className="h-5 w-5" />,
    actionLabel: locale === 'es' ? 'Configurar' : 'Set up',
    actionHref: 'https://saleads.ai/dashboard/business',
    docsHref: `/${locale}/docs/configurar-negocio/informacion-del-negocio`,
    isCompleted: false,
  },
  {
    id: 'connect',
    title: locale === 'es' ? 'Conecta Plataformas' : 'Connect Platforms',
    description: locale === 'es'
      ? 'Vincula Meta, Google o TikTok para lanzar campañas'
      : 'Connect Meta, Google, or TikTok to launch campaigns',
    icon: <Link2 className="h-5 w-5" />,
    actionLabel: locale === 'es' ? 'Conectar' : 'Connect',
    actionHref: 'https://saleads.ai/dashboard/connections',
    docsHref: `/${locale}/docs/conectar-plataformas`,
    isCompleted: false,
  },
  {
    id: 'launch',
    title: locale === 'es' ? 'Lanza tu Primera Campaña' : 'Launch Your First Campaign',
    description: locale === 'es'
      ? 'Usa la IA para crear y publicar tu primera estrategia'
      : 'Use AI to create and publish your first strategy',
    icon: <Rocket className="h-5 w-5" />,
    actionLabel: locale === 'es' ? 'Lanzar' : 'Launch',
    actionHref: 'https://saleads.ai/dashboard/strategies',
    docsHref: `/${locale}/docs/lanzar-campana/lanzar-meta`,
    isCompleted: false,
  },
];

export function OnboardingWizard({ locale }: OnboardingWizardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setSteps(getSteps(locale));
    
    // Check if user has seen the wizard before
    const dismissed = localStorage.getItem('onboarding-dismissed');
    const completed = localStorage.getItem('onboarding-completed');
    
    if (!dismissed && !completed) {
      setIsOpen(true);
    }
  }, [locale]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    setIsDismissed(true);
    localStorage.setItem('onboarding-dismissed', 'true');
  };

  const handleComplete = () => {
    setIsOpen(false);
    localStorage.setItem('onboarding-completed', 'true');
  };

  const markStepComplete = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, isCompleted: true } : step
    ));
  };

  const completedCount = steps.filter(s => s.isCompleted).length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  if (!isOpen || isDismissed) {
    // Show mini progress indicator if not completed
    if (completedCount < steps.length && steps.length > 0) {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-fd-primary text-fd-primary-foreground rounded-full shadow-lg hover:bg-fd-primary/90 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">
            {locale === 'es' ? 'Guía de inicio' : 'Getting Started'}
          </span>
          <span className="text-xs bg-fd-primary-foreground/20 px-2 py-0.5 rounded-full">
            {completedCount}/{steps.length}
          </span>
        </button>
      );
    }
    return null;
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-fd-background rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border">
        {/* Header */}
        <div className="bg-gradient-to-r from-fd-primary to-fd-primary/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-fd-primary-foreground" />
            <h2 className="text-lg font-semibold text-fd-primary-foreground">
              {locale === 'es' ? 'Bienvenido a SaleAds.ai' : 'Welcome to SaleAds.ai'}
            </h2>
          </div>
          <button
            onClick={handleDismiss}
            className="text-fd-primary-foreground/80 hover:text-fd-primary-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between text-sm text-fd-muted-foreground mb-2">
            <span>
              {locale === 'es' ? 'Progreso' : 'Progress'}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-fd-accent rounded-full overflow-hidden">
            <div 
              className="h-full bg-fd-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {currentStepData && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${currentStepData.isCompleted ? 'bg-green-100 text-green-600' : 'bg-fd-accent text-fd-primary'}`}>
                  {currentStepData.isCompleted ? <Check className="h-6 w-6" /> : currentStepData.icon}
                </div>
                <div>
                  <span className="text-xs text-fd-muted-foreground uppercase tracking-wide">
                    {locale === 'es' ? 'Paso' : 'Step'} {currentStep + 1} {locale === 'es' ? 'de' : 'of'} {steps.length}
                  </span>
                  <h3 className="text-xl font-semibold text-fd-foreground">
                    {currentStepData.title}
                  </h3>
                </div>
              </div>

              <p className="text-fd-muted-foreground leading-relaxed">
                {currentStepData.description}
              </p>

              {/* Step Checklist */}
              <div className="bg-fd-accent/50 rounded-lg p-4 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={currentStepData.isCompleted}
                    onChange={(e) => {
                      if (e.target.checked) {
                        markStepComplete(currentStepData.id);
                      }
                    }}
                    className="h-5 w-5 rounded border-fd-border text-fd-primary focus:ring-fd-primary"
                  />
                  <span className={`text-sm ${currentStepData.isCompleted ? 'line-through text-fd-muted-foreground' : 'text-fd-foreground'}`}>
                    {locale === 'es' ? 'He completado este paso' : 'I have completed this step'}
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={currentStepData.actionHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-fd-primary text-fd-primary-foreground rounded-lg hover:bg-fd-primary/90 transition-colors font-medium"
                >
                  {currentStepData.actionLabel}
                  <ChevronRight className="h-4 w-4" />
                </a>
                <Link
                  href={currentStepData.docsHref}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-fd-muted-foreground hover:text-fd-foreground transition-colors text-sm"
                >
                  {locale === 'es' ? 'Ver guía completa' : 'View full guide'}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-fd-accent/30 border-t flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 text-sm text-fd-muted-foreground hover:text-fd-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === 'es' ? 'Anterior' : 'Previous'}
          </button>

          <div className="flex gap-1">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-fd-primary' 
                    : index < currentStep 
                      ? 'bg-fd-primary/50' 
                      : 'bg-fd-border'
                }`}
              />
            ))}
          </div>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleComplete}
              className="flex items-center gap-1 text-sm font-medium text-fd-primary hover:text-fd-primary/80 transition-colors"
            >
              {locale === 'es' ? 'Finalizar' : 'Finish'}
              <Check className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-sm font-medium text-fd-primary hover:text-fd-primary/80 transition-colors"
            >
              {locale === 'es' ? 'Siguiente' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
