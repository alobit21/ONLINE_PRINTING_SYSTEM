import { Shield, Users, Store, FileText, BarChart3, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { GET_ADMIN_STATS, GET_PENDING_SHOPS } from '../../features/admin/api';


// ──────────────────────────────────────────────
// Stat Card — fully semantic, theme-aware
// ──────────────────────────────────────────────
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    footnote?: string;
}

function StatCard({ title, value, icon: Icon, iconBg, iconColor, footnote }: StatCardProps) {
    return (
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors duration-200">
            <div className={`h-12 w-12 flex items-center justify-center rounded-xl flex-shrink-0 ${iconBg}`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-semibold text-steel uppercase tracking-wide">{title}</p>
                <p className="text-2xl font-bold text-ink leading-tight">{value}</p>
                {footnote && <p className="text-xs text-steel mt-0.5">{footnote}</p>}
            </div>
        </div>
    );
}

// ──────────────────────────────────────────────
// Main AdminDashboard — pure content, no layout wrapper
// ──────────────────────────────────────────────
export const AdminDashboard = () => {
    const { data: statsData, loading: statsLoading, error: statsError } = useQuery(GET_ADMIN_STATS);
    const { data: pendingData, loading: pendingLoading } = useQuery(GET_PENDING_SHOPS);

    // ── Loading skeleton ──
    if (statsLoading || pendingLoading) {
        return (
            <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-cloud border border-fog rounded-xl p-5">
                            <div className="animate-pulse flex items-center gap-4">
                                <div className="h-12 w-12 bg-fog rounded-xl flex-shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-3 bg-fog rounded w-2/3" />
                                    <div className="h-6 bg-fog rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="h-64 bg-cloud border border-fog rounded-xl flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-steel" />
                </div>
            </div>
        );
    }

    // ── Error state ──
    if (statsError) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-error" />
                <h2 className="text-xl font-bold text-ink">Error Loading Admin Data</h2>
                <p className="text-steel max-w-sm">{statsError.message}</p>
            </div>
        );
    }

    const stats = (statsData as any)?.adminStats?.data;
    const pendingShops: any[] =
        (pendingData as any)?.pendingShops?.data ||
        (pendingData as any)?.pending_shops?.data ||
        [];

    const statCards: StatCardProps[] = [
        {
            title: 'Total Revenue',
            value: `TZS ${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: BarChart3,
            iconBg: 'bg-emerald-500/10',
            iconColor: 'text-emerald-500',
            footnote: 'Platform-wide earnings',
        },
        {
            title: 'Total Shops',
            value: stats?.totalShops || 0,
            icon: Store,
            iconBg: 'bg-hp-primary/10',
            iconColor: 'text-hp-primary',
            footnote: 'Registered shops',
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: FileText,
            iconBg: 'bg-violet-500/10',
            iconColor: 'text-violet-500',
            footnote: 'All time',
        },
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            iconBg: 'bg-amber-500/10',
            iconColor: 'text-amber-500',
            footnote: 'Active accounts',
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in">

            {/* ── Page header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-ink">System Administration</h1>
                    <p className="text-steel mt-1 text-sm">Monitor and manage the platform.</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-error/10 border border-error/30 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-error" />
                </div>
            </div>

            {/* ── Efferd Dashboard Grid Layout ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Top Row: KPI Stat Cards */}
                {statCards.map((card) => (
                    <StatCard key={card.title} {...card} />
                ))}



                {/* Bottom Row: Pending Shops & Activity */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                    <div className="bg-cloud border border-fog rounded-xl h-full">
                        <div className="px-6 py-4 border-b border-fog flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-ink">Pending Verifications</h2>
                                <p className="text-xs text-steel mt-0.5">Shops awaiting approval</p>
                            </div>
                            {pendingShops.length > 0 && (
                                <span className="h-5 min-w-5 px-1.5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {pendingShops.length}
                                </span>
                            )}
                        </div>
                        <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                            {pendingShops.length === 0 ? (
                                <div className="py-10 text-center text-steel text-sm">
                                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500/50" />
                                    No pending verifications
                                </div>
                            ) : (
                                pendingShops.map((shop: any) => (
                                    <div
                                        key={shop.id}
                                        className="flex items-center justify-between p-3 bg-paper border border-fog rounded-lg hover:border-steel transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-8 w-8 bg-hp-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Store className="h-4 w-4 text-hp-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-ink text-sm truncate">{shop.name}</p>
                                                <p className="text-xs text-steel truncate">{shop.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0 ml-3">
                                            <button className="text-xs px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-md font-medium transition-colors flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" /> Approve
                                            </button>
                                            <button className="text-xs px-3 py-1 bg-error/10 hover:bg-error/20 text-error rounded-md font-medium transition-colors flex items-center gap-1">
                                                <XCircle className="h-3 w-3" /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
