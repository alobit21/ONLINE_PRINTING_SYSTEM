import { useMemo } from 'react';
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
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GET_ALL_MY_SHOP_ORDERS } from '../../features/customer/orders/api';
import { GET_MY_SHOPS, GET_SHOP_DETAILS_WITH_PRICING } from '../../features/shops/api';
import type { GetAllMyShopOrdersData } from '../../features/customer/orders/types';
import type { GetShopDetailsWithPricingData } from '../../features/shops/types';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { format, subDays, parseISO } from 'date-fns';

// Order status display
const STATUS_COLORS: Record<string, string> = {
    UPLOADED: '#3b82f6',
    ACCEPTED: '#6366f1',
    PRINTING: '#f59e0b',
    READY: '#22c55e',
    COMPLETED: '#64748b',
    CANCELLED: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
    UPLOADED: 'Uploaded',
    ACCEPTED: 'Accepted',
    PRINTING: 'Printing',
    READY: 'Ready',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
};

function OrderStatusBadge({ status }: { status: string }) {
    const color = STATUS_COLORS[status] || '#94a3b8';
    return (
        <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
        >
            {STATUS_LABELS[status] || status}
        </span>
    );
}

// KPI card accent variants (Stripe/Vercel-style)
const KPI_ACCENTS = {
    revenue: {
        gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-600',
        accentBar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    },
    orders: {
        gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-600',
        accentBar: 'bg-gradient-to-r from-blue-500 to-blue-400',
    },
    products: {
        gradient: 'from-violet-500/10 via-violet-500/5 to-transparent',
        iconBg: 'bg-violet-500/10',
        iconColor: 'text-violet-600',
        accentBar: 'bg-gradient-to-r from-violet-500 to-violet-400',
    },
    customers: {
        gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
        iconBg: 'bg-indigo-500/10',
        iconColor: 'text-indigo-600',
        accentBar: 'bg-gradient-to-r from-indigo-500 to-indigo-400',
    },
    pending: {
        gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
        iconBg: 'bg-amber-500/10',
        iconColor: 'text-amber-600',
        accentBar: 'bg-gradient-to-r from-amber-500 to-amber-400',
    },
    completed: {
        gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-600',
        accentBar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    },
} as const;

type KPIAccentKey = keyof typeof KPI_ACCENTS;

// Premium KPI Card — visual upgrade only, same props/data
function KPICard({
    title,
    value,
    icon: Icon,
    subtitle,
    trend,
    accent = 'orders',
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    subtitle?: string;
    trend?: { value: string; up: boolean };
    accent?: KPIAccentKey;
}) {
    const styles = KPI_ACCENTS[accent];

    return (

   <Card
  className={cn(
    "relative overflow-hidden rounded-xl border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg",
    "transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.01]"
  )}
>
  {/* Left decorative gradient bar */}
  <div
    className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
    style={{ backgroundImage: styles.gradient }}
  />

  {/* Subtle border */}
  <div className="absolute inset-0 rounded-xl border border-gray-700/30" />

  <CardContent className="relative p-4">
    <div className="flex items-center gap-3">
      
      {/* Icon */}
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg shadow-sm flex-shrink-0",
          styles.iconBg,
          "relative overflow-hidden"
        )}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: styles.gradient }}
        />
        <Icon className={cn("h-5 w-5 relative z-10", styles.iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        
        {/* Title + trend */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {title}
          </p>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold",
                trend.up
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              )}
            >
              <TrendingUp
                className={cn("h-3 w-3", !trend.up && "rotate-180")}
              />
              {trend.value}
            </div>
          )}
        </div>

        {/* Value */}
        <div>
          <p className="text-xl font-bold text-white tracking-tight">
            {value}
          </p>

          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  </CardContent>
</Card>
 
);
}

// Chart tooltip label formatter
const formatChartDate = (label: string) => {
    try {
        return format(parseISO(label), 'MMM d');
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

    // Order status distribution (for pie chart)
    const statusDistribution = useMemo(() => {
        const counts: Record<string, number> = {};
        orders.forEach((o) => {
            counts[o.status] = (counts[o.status] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({
            name: STATUS_LABELS[name] || name,
            value,
            color: STATUS_COLORS[name] || '#94a3b8',
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
                        <Card key={i} className="border border-gray-700 bg-gray-800">
                            <CardContent className="p-6">
                                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse mb-4" />
                                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Card className="border border-gray-700 bg-gray-800">
                    <CardContent className="p-12 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-400">Loading dashboard…</span>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (hasError) {
        return (
            <Card className="border border-red-700 bg-red-900/50">
                <CardContent className="py-12 flex flex-col items-center justify-center gap-2 text-red-400">
                    <AlertCircle className="h-10 w-10" />
                    <p className="font-medium">Failed to load dashboard</p>
                    <p className="text-sm">{ordersError?.message || 'Please try again.'}</p>
                    <Button variant="outline" onClick={() => refetchOrders()} className="mt-2">
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            {/* Section A — KPI Summary Cards */}
            <section>
                <h2 className="sr-only">Key metrics</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <KPICard
                        title="Total Revenue"
                        value={`TZS ${metrics.totalRevenue.toLocaleString()}`}
                        icon={DollarSign}
                        subtitle="Completed orders"
                        accent="revenue"
                    />
                    <KPICard
                        title="Total Orders"
                        value={metrics.totalOrders}
                        icon={Package}
                        accent="orders"
                    />
                    <KPICard
                        title="Products / Services"
                        value={metrics.totalProducts}
                        icon={LayoutGrid}
                        subtitle="Pricing rules"
                        accent="products"
                    />
                    <KPICard
                        title="Total Customers"
                        value={metrics.totalCustomers}
                        icon={Users}
                        accent="customers"
                    />
                    <KPICard
                        title="Pending Orders"
                        value={metrics.pendingOrders}
                        icon={Clock}
                        subtitle="Awaiting action"
                        accent="pending"
                    />
                    <KPICard
                        title="Completed Orders"
                        value={metrics.completedOrders}
                        icon={CheckCircle2}
                        accent="completed"
                    />
                </div>
            </section>

            {/* Section B — Primary Charts */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="border border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Sales Over Time</CardTitle>
                        <CardDescription className="text-gray-400">Revenue by day (last 30 days, completed orders)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px] w-full">
                            {salesOverTime.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesOverTime} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-600" />
                                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip
                                            formatter={(value: number) => [`TZS ${Number(value).toLocaleString()}`, 'Revenue']}
                                            labelFormatter={formatChartDate}
                                        />
                                        <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Revenue" />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                                    No sales data yet
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Orders Over Time</CardTitle>
                        <CardDescription className="text-gray-400">Order count by day (last 30 days)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px] w-full">
                            {ordersOverTime.some((d) => d.count > 0) ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={ordersOverTime} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-600" />
                                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                        <Tooltip labelFormatter={formatChartDate} />
                                        <Area type="monotone" dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Orders" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                                    No orders yet
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Section C — Secondary Analytics */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="border border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Order Status Distribution</CardTitle>
                        <CardDescription className="text-gray-400">Current order status breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[260px] w-full">
                            {statusDistribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {statusDistribution.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => [value, 'Orders']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                                    No orders yet
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Revenue by Service Type</CardTitle>
                        <CardDescription className="text-gray-400">From order items (Color, B&W, Binding, Lamination)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[260px] w-full">
                            {revenueByServiceType.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueByServiceType} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-600" />
                                        <XAxis type="number" tickFormatter={(v) => `TZS ${(v / 1000).toFixed(0)}k`} />
                                        <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 11 }} />
                                        <Tooltip formatter={(value: number) => [`TZS ${Number(value).toLocaleString()}`, 'Revenue']} />
                                        <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} name="Revenue" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                                    No revenue data yet
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Section D — Recent Orders */}
            <section>
                <Card className="border border-gray-700 bg-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-white">Recent Orders</CardTitle>
                            <CardDescription className="text-gray-400">Latest 8 orders from your shop</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/shop/orders')}>
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <div className="py-12 text-center text-gray-400">
                                <Package className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                                <p className="font-medium">No orders yet</p>
                                <p className="text-sm">Orders will appear here when customers place them.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-600 text-left text-gray-400 font-medium">
                                            <th className="pb-3 pr-4">Order ID</th>
                                            <th className="pb-3 pr-4">Customer</th>
                                            <th className="pb-3 pr-4">Date</th>
                                            <th className="pb-3 pr-4">Status</th>
                                            <th className="pb-3 pr-4 text-right">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => {
                                            const customerName =
                                                order.customer?.firstName && order.customer?.lastName
                                                    ? `${order.customer.firstName} ${order.customer.lastName}`
                                                    : order.customer?.email || '—';
                                            return (
                                                <tr
                                                    key={order.id}
                                                    className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                                                >
                                                    <td className="py-3 pr-4 font-mono text-xs text-gray-300">
                                                        {order.id.slice(0, 8).toUpperCase()}
                                                    </td>
                                                    <td className="py-3 pr-4 text-white">{customerName}</td>
                                                    <td className="py-3 pr-4 text-gray-400">
                                                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <OrderStatusBadge status={order.status} />
                                                    </td>
                                                    <td className="py-3 pr-4 text-right font-medium text-white">
                                                        TZS {Number(order.totalPrice).toLocaleString()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
