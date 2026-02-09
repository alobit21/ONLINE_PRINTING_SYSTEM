import { cn } from '../../../../lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    className?: string;
}

export const Badge = ({ children, className }: BadgeProps) => {
    return (
        <span className={cn(
            "px-2 py-0.5 rounded-full text-white text-[10px] font-bold inline-flex items-center justify-center",
            className
        )}>
            {children}
        </span>
    );
};
