import * as React from 'react';
import { cn } from './utils';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col gap-6 rounded-[12px] border-0 bg-mowby-cream shadow-mowby-soft',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export { Card };
