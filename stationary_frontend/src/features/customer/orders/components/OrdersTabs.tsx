import { cn } from '../../../../lib/utils';

interface OrdersTabsProps {
    activeTab: 'active' | 'completed' | 'cancelled';
    onTabChange: (tab: 'active' | 'completed' | 'cancelled') => void;
    counts: {
        active: number;
        completed: number;
        cancelled: number;
    };
}

export const OrdersTabs = ({ activeTab, onTabChange, counts }: OrdersTabsProps) => {
    const tabs = [
        { id: 'active', label: 'Active', count: counts.active },
        { id: 'completed', label: 'Completed', count: counts.completed },
        { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
    ] as const;

    return (
        <div className="flex bg-slate-100 p-1 rounded-xl sticky top-20 z-20 backdrop-blur-md bg-white/50 border border-white/20 shadow-sm">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all relative",
                        activeTab === tab.id
                            ? "bg-white text-brand-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    {tab.label}
                    {tab.count > 0 && (
                        <span className={cn(
                            "px-1.5 py-0.5 rounded-md text-[10px] min-w-[18px]",
                            activeTab === tab.id ? "bg-brand-100 text-brand-600" : "bg-slate-200 text-slate-500"
                        )}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};
