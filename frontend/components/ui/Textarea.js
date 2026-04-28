import * as React from 'react';
import { cn } from './utils';
import { mowbyFormFieldClass } from './formFieldStyles';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        mowbyFormFieldClass,
        'min-h-[120px] resize-y px-4 py-3',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
