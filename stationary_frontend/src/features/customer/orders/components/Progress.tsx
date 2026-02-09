import { cn } from '../../../../lib/utils';

interface ProgressProps {
    value: number;
    className?: string;
    barClassName?: string;
}

export const Progress = ({ value, className, barClassName }: ProgressProps) => {
    return (
        <div className={cn("w-full bg-slate-200 rounded-full overflow-hidden", className)}>
            <div
                className={cn("h-full transition-all duration-500 ease-out", barClassName)}
                style={{ width: `${value}%` }}
            />
        </div>
    );
};
