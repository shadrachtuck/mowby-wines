import * as React from 'react';
import { cn } from './utils';
import { mowbyFormFieldClass } from './formFieldStyles';

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        mowbyFormFieldClass,
        'box-border min-h-11 cursor-pointer px-4 py-2 leading-normal',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';

export { Select };
