import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from './utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-mowby-cream',
  {
    variants: {
      variant: {
        /** Primary — Surf Blue */
        default:
          'bg-mowby-blue text-white hover:bg-mowby-blue-dark focus-visible:ring-mowby-blue',
        /** Secondary — Coral Pink */
        secondary:
          'bg-mowby-coral text-gray-900 hover:bg-mowby-coral-dark focus-visible:ring-mowby-coral',
        outline:
          'border border-gray-300 bg-mowby-cream text-gray-900 hover:bg-mowby-cream/80 focus-visible:ring-mowby-blue',
        /** Tertiary — Coral outline */
        tertiary:
          'border-2 border-mowby-coral bg-mowby-cream text-gray-900 hover:bg-mowby-coral/35 focus-visible:ring-mowby-coral',
        ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400',
        /** Success — Seaweed Green */
        success:
          'bg-mowby-seaweed text-white hover:bg-mowby-seaweed-dark focus-visible:ring-mowby-seaweed',
        /** Warning — Sea Lemon */
        warning:
          'bg-mowby-sea-lemon text-gray-900 hover:bg-mowby-sea-lemon-dark focus-visible:ring-mowby-sea-lemon',
        /** Danger — Red Fishy */
        destructive:
          'bg-mowby-red-fishy text-white hover:bg-mowby-red-fishy-dark focus-visible:ring-mowby-red-fishy',
      },
      size: {
        default: 'h-9 px-4 py-2',
        lg: 'h-12 px-8 py-6 text-lg',
        sm: 'h-8 px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
