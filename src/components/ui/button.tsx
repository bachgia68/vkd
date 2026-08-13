import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Bộ nút chuẩn dùng chung cho toàn bộ cổng quản trị — thay cho từng trang tự
// viết className nút riêng (khác nhau về bo góc/padding/màu qua từng lần sửa).
// Theo đúng token thương hiệu trong tailwind.config.js, không tự chế màu mới.
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50',
  {
    variants: {
      variant: {
        primary: 'bg-forest-900 text-white hover:bg-forest-800',
        gold: 'bg-gold-400 text-forest-900 hover:bg-gold-500 font-semibold',
        outline: 'border border-forest-200 text-forest-800 bg-white hover:bg-forest-50',
        ghost: 'text-forest-700 hover:bg-forest-50',
        danger: 'text-red-600 hover:bg-red-50',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        icon: 'h-9 w-9 shrink-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
