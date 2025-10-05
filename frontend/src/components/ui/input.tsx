import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
  ariaAutocomplete?: 'none' | 'inline' | 'list' | 'both';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    ariaLabel,
    ariaDescribedBy,
    ariaInvalid,
    ariaRequired,
    ariaAutocomplete,
    ...props 
  }, ref) => {
    const ariaProps = {
      ...(ariaLabel && { 'aria-label': ariaLabel }),
      ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
      ...(ariaInvalid !== undefined && { 'aria-invalid': ariaInvalid }),
      ...(ariaRequired !== undefined && { 'aria-required': ariaRequired }),
      ...(ariaAutocomplete && { 'aria-autocomplete': ariaAutocomplete }),
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500",
          className
        )}
        ref={ref}
        {...ariaProps}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
