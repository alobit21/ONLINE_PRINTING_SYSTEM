import { cn } from '../../../../lib/utils';

interface OrdersTabsProps {
    activeTab: 'active' | 'completed' | 'cancelled';
    onTabChange: (tab: 'active' | 'completed' | 'cancelled') => void;
    counts: {
        active: number;
        completed: number;
        cancelled: number;
    };
    className?: string;
}

export const OrdersTabs = ({ activeTab, onTabChange, counts, className }: OrdersTabsProps) => {
    const tabs = [
        { id: 'active', label: 'Active', count: counts.active },
        { id: 'completed', label: 'Completed', count: counts.completed },
        { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
    ] as const;

    return (
        <div className={cn("flex bg-cloud p-1 rounded-[8px] sticky top-20 z-20 shadow-sm", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[4px] text-sm font-bold transition-all relative",
                        activeTab === tab.id
                            ? "bg-white text-hp-primary shadow-sm"
                            : "text-charcoal hover:text-ink hover:bg-white/50"
                    )}
                >
                    {tab.label}
                    {tab.count > 0 && (
                        <span className={cn(
                            "px-1.5 py-0.5 rounded-md text-[10px] min-w-[18px]",
                            activeTab === tab.id ? "bg-blue-50 text-hp-primary" : "bg-fog text-charcoal"
                        )}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};
