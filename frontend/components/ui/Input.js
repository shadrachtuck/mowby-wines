import * as React from 'react';
import { cn } from './utils';
import { mowbyFormFieldClass } from './formFieldStyles';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        mowbyFormFieldClass,
        /* Native <input> + display:flex breaks vertical sizing on mobile Safari; use block + padding. */
        'box-border block w-full min-h-11 px-4 py-2.5 leading-normal',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
