'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface LastUpdatedProps {
  date?: string;
  locale?: string;
}

export function LastUpdated({ date, locale = 'es' }: LastUpdatedProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !date) return null;

  const dateLocale = locale === 'en' ? 'en-US' : 'es-ES';
  const label = locale === 'en' ? 'Last updated' : 'Última actualización';
  const formattedDate = new Date(date).toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex items-center gap-2 text-sm text-fd-muted-foreground mt-8 pt-6 border-t">
      <Clock className="h-4 w-4" />
      <span>{label}: {formattedDate}</span>
    </div>
  );
}
