'use client';

import { Pencil } from 'lucide-react';

interface EditPageProps {
  path: string;
}

export function EditPage({ path }: EditPageProps) {
  const editUrl = `https://github.com/saleads-ai/sa-help-center/edit/main/content/${path}`;

  return (
    <a
      href={editUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
    >
      <Pencil className="h-4 w-4" />
      <span>Editar esta página</span>
    </a>
  );
}
