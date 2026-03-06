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
        <div className={cn("flex bg-slate-800/50 p-1 rounded-xl sticky top-20 z-20 backdrop-blur-md border border-slate-700/50 shadow-sm", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all relative",
                        activeTab === tab.id
                            ? "bg-slate-700 text-cyan-400 shadow-sm border border-cyan-400/30"
                            : "text-slate-400 hover:text-slate-200"
                    )}
                >
                    {tab.label}
                    {tab.count > 0 && (
                        <span className={cn(
                            "px-1.5 py-0.5 rounded-md text-[10px] min-w-[18px]",
                            activeTab === tab.id ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" : "bg-slate-700/50 text-slate-400 border border-slate-600/50"
                        )}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};
