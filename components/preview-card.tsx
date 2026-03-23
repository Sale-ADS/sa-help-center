import Link from 'fumadocs-core/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type PreviewCardProps = {
  href: string;
  title: string;
  description: string;
  /** Path under `public/`, e.g. `/images/screenshots/...` */
  image: string;
  icon?: ReactNode;
  className?: string;
};

export function PreviewCard({
  href,
  title,
  description,
  image,
  icon,
  className,
}: PreviewCardProps) {
  return (
    <Link
      href={href}
      data-card
      className={cn(
        'block overflow-hidden rounded-xl border bg-fd-card text-fd-card-foreground transition-colors @max-lg:col-span-full',
        'hover:bg-fd-accent/80',
        className
      )}
    >
      <div className="relative aspect-[16/10] min-h-[10rem] w-full shrink-0 overflow-hidden bg-fd-muted">
        {/* Native img: public paths; avoids next/image + client Link edge cases where previews did not paint */}
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-4">
        {icon ? (
          <div className="not-prose mb-2 w-fit rounded-lg border bg-fd-muted p-1.5 text-fd-muted-foreground shadow-md [&_svg]:size-4">
            {icon}
          </div>
        ) : null}
        <h3 className="not-prose mb-1 text-sm font-medium">{title}</h3>
        {description ? (
          <p className="prose-no-margin my-0! text-sm text-fd-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
