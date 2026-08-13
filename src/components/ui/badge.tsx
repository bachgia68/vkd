import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      tone: {
        neutral: 'bg-forest-50 text-forest-700',
        gold: 'bg-gold-400/15 text-gold-700',
        success: 'bg-forest-50 text-forest-700',
        warning: 'bg-amber-50 text-amber-700',
        danger: 'bg-red-50 text-red-600',
        muted: 'bg-cream-200 text-cream-800',
      },
    },
    defaultVariants: { tone: 'neutral' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}

export { Badge, badgeVariants };
