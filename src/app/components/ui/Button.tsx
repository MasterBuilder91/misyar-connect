// src/app/components/ui/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-700",
        secondary: "bg-white text-teal-700 border border-teal-700 hover:bg-teal-50 focus-visible:ring-teal-700",
        tertiary: "bg-transparent text-teal-700 hover:bg-teal-50 focus-visible:ring-teal-700",
        gold: "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500",
      },
      size: {
        sm: "h-9 px-3 py-2",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 py-3",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
