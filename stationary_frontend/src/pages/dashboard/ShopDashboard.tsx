import { useState, useEffect } from 'react';
import {
    Package,
    TrendingUp,
    Users,
    DollarSign,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    BarChart3,
    Settings,
    Bell,
    Search,
    Filter,
    Download,
    Plus,
    LayoutGrid,
    FileText
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { useAuthStore } from '../../stores/authStore';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MY_SHOPS, CREATE_SHOP } from '../../features/shops/api';
import { GET_ALL_MY_SHOP_ORDERS, UPDATE_ORDER_STATUS } from '../../features/customer/orders/api';
import { Loader2, Store } from 'lucide-react';
import { ProductsPage } from './ProductsPage';
import { OrdersPage } from './OrdersPage';
import { ShopDashboardPage } from './ShopDashboardPage';

interface MyShopsData {
    myShops: {
        response: {
            status: string;
            message: string;
        };
        data: Array<{
            id: string;
            name: string;
            address: string;
            isAcceptingOrders: boolean;
        }>;
    };
}

interface CreateShopData {
    createShop: {
        response: {
            status: string;
            message: string;
        };
        shop: {
            id: string;
            name: string;
        };
    };
}

// StatCard Component
const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card className="glass card-hover border-0 shadow-lg">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">{title}</p>
                    <p className="text-3xl font-bold text-slate-900">{value}</p>
                    {change && (
                        <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            <TrendingUp className={`h-4 w-4 ${trend === 'down' && 'rotate-180'}`} />
                            <span>{change}</span>
                        </div>
                    )}
                </div>
                <div className={`p-4 rounded-xl ${trend === 'up' ? 'bg-green-100' : 'bg-brand-100'}`}>
                    <Icon className={`h-6 w-6 ${trend === 'up' ? 'text-green-600' : 'text-brand-600'}`} />
                </div>
            </div>
        </CardContent>
    </Card>
);

// OrderStatusBadge Component
const OrderStatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        processing: 'bg-blue-100 text-blue-700 border-blue-200',
        completed: 'bg-green-100 text-green-700 border-green-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200',
        UPLOADED: 'bg-blue-100 text-blue-700 border-blue-200',
        ACCEPTED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        PRINTING: 'bg-amber-100 text-amber-700 border-amber-200',
        READY: 'bg-green-100 text-green-700 border-green-200',
        COMPLETED: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    const icons: Record<string, any> = {
        pending: Clock,
        processing: AlertCircle,
        completed: CheckCircle2,
        cancelled: XCircle,
        UPLOADED: Package,
        ACCEPTED: CheckCircle2,
        PRINTING: TrendingUp,
        READY: CheckCircle2,
        COMPLETED: CheckCircle2,
    };

    const Icon = icons[status] || Clock;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
            <Icon className="h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </span>
    );
};

export const ShopDashboard = () => {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    // Role check
    useEffect(() => {
        if (user && user.role !== 'SHOP_OWNER' && user.role !== 'ADMIN') {
            navigate('/dashboard/customer');
        }
    }, [user, navigate]);

    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/orders')) return 'orders';
        if (path.includes('/products')) return 'products';
        if (path.includes('/settings')) return 'settings';
        if (path.includes('/analytics')) return 'analytics';
        return 'overview';
    };

    const activeTab = getActiveTab();
    const setActiveTab = (tab: string) => {
        const path = tab === 'overview' ? '/dashboard/shop' : `/dashboard/shop/${tab}`;
        navigate(path);
    };

    // Fetch Shop Data
    const { data: myShopsData, loading: shopsLoading, error: shopsError, refetch: refetchShops } = useQuery<MyShopsData>(GET_MY_SHOPS, {
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        if (shopsError) console.error("Error fetching shops:", shopsError);
        if (myShopsData) console.log("Fetched shops:", myShopsData);
    }, [shopsError, myShopsData]);

    const shopId = myShopsData?.myShops?.data?.[0]?.id;
    const myShopsStatus = myShopsData?.myShops?.response?.status;
    const myShopsMessage = myShopsData?.myShops?.response?.message;

    const [createShop, { loading: creatingShop, error: createError }] = useMutation<CreateShopData>(CREATE_SHOP, {
        onCompleted: (data) => {
            console.log("Shop created:", data);
            if (data?.createShop?.response?.status) {
                refetchShops();
            } else {
                console.error("Shop creation failed:", data?.createShop?.response?.message);
                alert(`Failed to create shop: ${data?.createShop?.response?.message}`);
            }
        },
        onError: (err) => {
            console.error("Mutation error:", err);
            alert(`Error creating shop: ${err.message}`);
        }
    });

    const handleCreateShop = () => {
        // Quick seed for demo purposes since we don't have a full form yet
        createShop({
            variables: {
                name: `${user?.email?.split('@')[0]}'s Print Shop`,
                address: "Dodoma, Tanzania",
                latitude: -6.1630,
                longitude: 35.7516,
                description: "Professional printing services for students and businesses."
            }
        });
    };

    // Fetch Orders - Using ALL MY SHOP ORDERS to get everything across all owner's shops
    const { data: ordersData, refetch: refetchOrders } = useQuery(GET_ALL_MY_SHOP_ORDERS);

    const [updateStatus] = useMutation(UPDATE_ORDER_STATUS, {
        onCompleted: () => refetchOrders()
    });

    const shopOrders = (ordersData as any)?.allMyShopOrders || [];
    const pendingOrdersCount = shopOrders.filter((o: any) => o.status === 'UPLOADED' || o.status === 'ACCEPTED').length;

    // Override mock stats
    const stats = {
        totalOrders: shopOrders.length,
        pendingOrders: pendingOrdersCount,
        completedOrders: shopOrders.filter((o: any) => o.status === 'COMPLETED').length,
        revenue: shopOrders.reduce((acc: number, o: any) => acc + (o.status === 'COMPLETED' ? Number(o.totalPrice) : 0), 0),
        customerCount: new Set(shopOrders.map((o: any) => o.customer?.id)).size
    };



    // Loading State
    if (shopsLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 text-brand-600 animate-spin mx-auto" />
                    <p className="text-slate-500 font-medium animate-pulse">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Render "Create Shop" state if no shop exists or there's an API-level error
    if (!shopId) {
        const isAuthError = myShopsStatus === false && myShopsMessage?.toLowerCase().includes('auth');

        if (shopsError || myShopsStatus === false) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
                    <Card className="max-w-md w-full shadow-2xl border-none overflow-hidden">
                        <div className="h-2 bg-red-500" />
                        <CardHeader>
                            <CardTitle className="text-red-700 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                {isAuthError ? 'Session Expired' : 'Connection Error'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-slate-600 text-sm">
                                {isAuthError
                                    ? "Your session has expired. Please log in again to manage your shops."
                                    : (shopsError?.message || myShopsMessage || "We couldn't fetch your shop details.")}
                            </p>
                            <div className="flex gap-3">
                                <Button onClick={() => isAuthError ? navigate('/login') : refetchShops()} className="flex-1 gradient-brand">
                                    {isAuthError ? 'Go to Login' : 'Retry Connection'}
                                </Button>
                                {!isAuthError && (
                                    <Button variant="outline" onClick={() => navigate('/login')} className="flex-1">
                                        Back to Login
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8 space-y-6 shadow-xl border-none">
                    <div className="h-20 w-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto text-brand-600">
                        <Store className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome to PrintSync!</h1>
                        <p className="text-slate-500 mt-2">To start accepting orders, you need to set up your shop profile first.</p>

                        <div className="mt-6 p-4 bg-slate-50 rounded-2xl text-left space-y-2 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Context</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-600">Logged in as:</span>
                                <span className="text-xs font-bold text-slate-900">{user?.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-600">Role:</span>
                                <span className="text-xs font-bold text-brand-600">{user?.role}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
                                <span className="text-xs text-slate-600">Shops Found:</span>
                                <span className="text-xs font-bold text-slate-900">0</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleCreateShop}
                        disabled={creatingShop}
                        className="w-full h-12 gradient-brand text-white font-bold text-lg shadow-lg shadow-brand-500/30"
                    >
                        {creatingShop ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />}
                        Create My Shop
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="sticky top-0 z-10 glass border-b border-white/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gradient-brand">Shop Dashboard</h1>
                            <p className="text-sm text-slate-600 mt-1">Welcome back, {user?.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                                    3
                                </span>
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Settings className="h-5 w-5" />
                            </Button>
                            <div className="h-10 w-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold shadow-lg">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-6 border-b border-slate-200 overflow-x-auto">
                        {['overview', 'orders', 'products', 'analytics', 'settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 font-medium text-sm transition-all relative whitespace-nowrap ${activeTab === tab
                                    ? 'text-brand-600'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 gradient-brand" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'overview' && (
                    <div className="fade-in">
                        <ShopDashboardPage />
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="fade-in">
                        <OrdersPage />
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-6 fade-in">
                        <Card className="glass border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Analytics Dashboard</CardTitle>
                                <CardDescription>Insights and performance metrics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12 text-slate-500">
                                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                                    <p className="text-lg font-medium">Analytics coming soon</p>
                                    <p className="text-sm">Detailed charts and insights will be available here</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="fade-in">
                        <ProductsPage />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-6 fade-in">
                        <Card className="glass border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Shop Settings</CardTitle>
                                <CardDescription>Configure your shop profile and preferences</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12 text-slate-500">
                                    <Settings className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                                    <p className="text-lg font-medium">Settings</p>
                                    <p className="text-sm">Manage operating hours, location, and account details.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div >
    );
};
