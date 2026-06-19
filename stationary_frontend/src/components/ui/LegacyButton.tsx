import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {

        const variants = {
            primary: 'bg-hp-primary text-canvas hover:bg-hp-primary/90 shadow-[0_2px_8px_rgba(26,26,26,0.08)] focus-visible:ring-hp-primary',
            secondary: 'bg-cloud text-ink hover:bg-fog shadow-[0_2px_8px_rgba(26,26,26,0.08)] focus-visible:ring-fog',
            outline: 'border border-fog dark:border-charcoal bg-transparent hover:bg-cloud text-ink focus-visible:ring-fog',
            ghost: 'hover:bg-cloud hover:text-ink text-charcoal focus-visible:ring-fog',
            danger: 'bg-red-500 text-canvas hover:bg-red-600 shadow-[0_2px_8px_rgba(26,26,26,0.08)] focus-visible:ring-red-500',
        };

        const sizes = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 py-2',
            lg: 'h-12 px-8 text-lg',
            icon: 'h-10 w-10',
        };

        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(
                    'inline-flex items-center justify-center rounded-[4px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, cn };
