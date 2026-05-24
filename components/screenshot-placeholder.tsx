import type { ReactNode } from 'react';

type ScreenshotPlaceholderProps = {
  label: string;
  /** Optional description of what the screenshot should show */
  description?: string;
  /** Aspect ratio: 'wide' (16/9), 'tall' (4/3), 'square' — default 'wide' */
  aspect?: 'wide' | 'tall' | 'square';
};

const aspectClasses: Record<string, string> = {
  wide: 'aspect-video',
  tall: 'aspect-[4/3]',
  square: 'aspect-square',
};

export function ScreenshotPlaceholder({
  label,
  description,
  aspect = 'wide',
}: ScreenshotPlaceholderProps) {
  return (
    <div className="not-prose my-4 overflow-hidden rounded-xl border-2 border-dashed border-fd-border bg-fd-muted/40">
      <div
        className={`${aspectClasses[aspect]} flex flex-col items-center justify-center gap-2 p-6 text-center`}
      >
        <span className="text-3xl">📸</span>
        <p className="text-sm font-semibold text-fd-muted-foreground">{label}</p>
        {description && (
          <p className="max-w-xs text-xs text-fd-muted-foreground/70">
            {description}
          </p>
        )}
        <span className="mt-2 inline-flex items-center rounded-full bg-fd-primary/10 px-3 py-1 text-xs font-medium text-fd-primary">
          Screenshot próximamente
        </span>
      </div>
    </div>
  );
}
