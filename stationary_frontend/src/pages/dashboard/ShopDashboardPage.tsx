import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    DollarSign,
    Package,
    Users,
    Clock,
    CheckCircle2,
    LayoutGrid,
    Loader2,
    AlertCircle,
    TrendingUp,
} from 'lucide-react';
import { DashboardStats, type Stat } from "../../components/stats";
import { ConversationVolumeChart, type VolumeRow } from "../../components/conversation-volume-chart";
import { ChannelBreakdownChart, type ChannelDatum } from "../../components/channel-breakdown-chart";
import { RecentConversations, type OrderRow } from "../../components/recent-conversations";
import { GET_ALL_MY_SHOP_ORDERS } from '../../features/customer/orders/api';
import { GET_MY_SHOPS, GET_SHOP_DETAILS_WITH_PRICING } from '../../features/shops/api';
import type { GetAllMyShopOrdersData } from '../../features/customer/orders/types';
import type { GetShopDetailsWithPricingData } from '../../features/shops/types';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { format, subDays, parseISO } from 'date-fns';



// Chart tooltip label formatter
const formatChartDate = (label: ReactNode, payload?: readonly any[]) => {
    try {
        if (typeof label === 'string') {
            return format(parseISO(label), 'MMM d');
        }
        return label;
    } catch {
        return label;
    }
};

export function ShopDashboardPage() {
    const navigate = useNavigate();

    const { data: ordersData, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useQuery<GetAllMyShopOrdersData>(
        GET_ALL_MY_SHOP_ORDERS,
        { fetchPolicy: 'network-only' }
    );

    const { data: shopsData } = useQuery<{ myShops: { response: { status: boolean }; data: Array<{ id: string }> } }>(
        GET_MY_SHOPS,
        { fetchPolicy: 'network-only' }
    );

    const shopId = shopsData?.myShops?.data?.[0]?.id;

    const { data: shopDetailsData } = useQuery<GetShopDetailsWithPricingData>(
        GET_SHOP_DETAILS_WITH_PRICING,
        { variables: { id: shopId }, skip: !shopId, fetchPolicy: 'network-only' }
    );

    const orders = ordersData?.allMyShopOrders ?? [];
    const productsCount = shopDetailsData?.shopDetails?.data?.pricingRules?.length ?? 0;

    // Derived metrics (computed on frontend from raw orders)
    const metrics = useMemo(() => {
        const completed = orders.filter((o) => o.status === 'COMPLETED');
        const pending = orders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status));
        const totalRevenue = completed.reduce((sum, o) => sum + Number(o.totalPrice), 0);
        const uniqueCustomers = new Set(orders.map((o) => o.customer?.id).filter(Boolean)).size;

        return {
            totalRevenue,
            totalOrders: orders.length,
            totalProducts: productsCount,
            totalCustomers: uniqueCustomers,
            pendingOrders: pending.length,
            completedOrders: completed.length,
        };
    }, [orders, productsCount]);

    // Sales over time (revenue by date - completed orders only)
    const salesOverTime = useMemo(() => {
        const completed = orders.filter((o) => o.status === 'COMPLETED');
        const byDate: Record<string, number> = {};
        const start = subDays(new Date(), 30);
        for (let d = 0; d <= 30; d++) {
            const date = format(subDays(new Date(), 30 - d), 'yyyy-MM-dd');
            byDate[date] = 0;
        }
        completed.forEach((o) => {
            const date = format(new Date(o.completedAt || o.createdAt), 'yyyy-MM-dd');
            if (!byDate[date]) byDate[date] = 0;
            byDate[date] += Number(o.totalPrice);
        });
        return Object.entries(byDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, revenue]) => ({ date, revenue, label: formatChartDate(date) }));
    }, [orders]);

    // Orders over time (count by date)
    const ordersOverTime = useMemo(() => {
        const byDate: Record<string, number> = {};
        for (let d = 0; d <= 30; d++) {
            const date = format(subDays(new Date(), 30 - d), 'yyyy-MM-dd');
            byDate[date] = 0;
        }
        orders.forEach((o) => {
            const date = format(new Date(o.createdAt), 'yyyy-MM-dd');
            if (!byDate[date]) byDate[date] = 0;
            byDate[date] += 1;
        });
        return Object.entries(byDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, count]) => ({ date, count, label: formatChartDate(date) }));
    }, [orders]);

    const statusDistribution = useMemo(() => {
        const counts: Record<string, number> = {};
        orders.forEach((o) => {
            const s = o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase();
            counts[s] = (counts[s] || 0) + 1;
        });
        const colors = [
            "var(--chart-1)",
            "var(--chart-2)",
            "var(--chart-3)",
            "var(--chart-4)",
            "var(--chart-5)"
        ];
        return Object.entries(counts).map(([name, value], i) => ({
            name,
            value,
            fill: colors[i % colors.length],
        }));
    }, [orders]);

    // Revenue by service type (from order items configSnapshot: Color vs B&W, Binding, Lamination)
    const revenueByServiceType = useMemo(() => {
        const map: Record<string, number> = { 'Color': 0, 'B&W': 0, 'Binding': 0, 'Lamination': 0 };
        orders.forEach((o) => {
            o.items?.forEach((item) => {
                const price = Number(item.price);
                const config = item.configSnapshot || {};
                if (config.is_color) map['Color'] += price;
                else map['B&W'] += price;
                if (config.binding) map['Binding'] += price;
                if (config.lamination) map['Lamination'] += price;
            });
        });
        return Object.entries(map)
            .filter(([, v]) => v > 0)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [orders]);

    const recentOrders = useMemo(() => orders.slice(0, 8), [orders]);

    const isLoading = ordersLoading;
    const hasError = !!ordersError;

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border border-fog bg-canvas rounded-xl p-6 shadow-sm">
                            <div className="h-4 w-32 bg-fog rounded animate-pulse mb-4" />
                            <div className="h-8 w-24 bg-fog rounded animate-pulse" />
                        </div>
                    ))}
                </div>
                <div className="border border-fog bg-canvas rounded-xl p-12 flex items-center justify-center shadow-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-steel" />
                    <span className="ml-2 text-steel">Loading dashboard…</span>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-red-400">
                <AlertCircle className="h-10 w-10" />
                <p className="font-medium">Failed to load dashboard</p>
                <p className="text-sm">{ordersError?.message || 'Please try again.'}</p>
                <button onClick={() => refetchOrders()} className="mt-2 text-sm text-brand-600 underline">
                    Retry
                </button>
            </div>
        );
    }

    const dashboardStats: Stat[] = [
        { label: "Total Revenue", value: `TZS ${metrics.totalRevenue.toLocaleString()}`, lowerIsBetter: false },
        { label: "Total Orders", value: String(metrics.totalOrders), footnote: "All time", lowerIsBetter: false },
        { label: "Pending Orders", value: String(metrics.pendingOrders), footnote: "Awaiting action", lowerIsBetter: true },
        { label: "Completed", value: String(metrics.completedOrders), footnote: "Delivered", lowerIsBetter: false },
    ];

    const volumeChartData: VolumeRow[] = ordersOverTime.map((d) => ({
        date: d.date,
        conversations: d.count,
    }));

    const recentOrderRows: OrderRow[] = recentOrders.map((o) => ({
        id: o.id,
        customer: (o.customer?.firstName && o.customer?.lastName) ? `${o.customer.firstName} ${o.customer.lastName}` : (o.customer?.email || '—'),
        date: format(new Date(o.createdAt), 'MMM d, yyyy'),
        status: o.status,
        revenue: Number(o.totalPrice).toLocaleString()
    }));

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardStats stats={dashboardStats} />
            <ConversationVolumeChart chartData={volumeChartData} />
            <ChannelBreakdownChart chartData={statusDistribution} title="Orders by Status" description="Breakdown of all active and past orders" />
            <RecentConversations orders={recentOrderRows} />
        </div>
    );
}
