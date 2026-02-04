import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'muted' | 'primary';
  size?: 'default' | 'large';
}

export function Section({ children, className, variant = 'default', size = 'default' }: SectionProps) {
  return (
    <section
      className={cn(
        size === 'default' ? 'py-16 md:py-24' : 'py-24 md:py-32',
        variant === 'muted' && 'bg-muted/50',
        variant === 'primary' && 'bg-primary text-primary-foreground',
        className
      )}
    >
      <div className="container">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ title, subtitle, centered = false, className }: SectionHeaderProps) {
  return (
    <div className={cn('max-w-3xl', centered && 'mx-auto text-center', className)}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-muted-foreground font-body leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
