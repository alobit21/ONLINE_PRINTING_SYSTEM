import { useNavigate } from 'react-router-dom';
import { FileUp, Clock, MapPin, Zap, TrendingUp, ChevronRight, Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/LegacyCard';
import { Button } from '../../../components/ui/LegacyButton';
import { Skeleton } from '../../../components/ui/skeleton';
import { cn } from '../../../lib/utils';
import { useQuery } from '@apollo/client/react';
import { GET_MY_ORDERS } from '../orders/api';
import { GET_SHOPS } from '../../shops/api';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

// Define TypeScript types for the GraphQL response
interface OrderItem {
    id: string;
    pageCount: number;
    price: number;
    configSnapshot: any;
    document: {
        id: string;
        fileName: string;
        fileType: string;
        fileSize: number;
        uploadUrl: string;
        downloadUrl: string;
        createdAt: string;
    };
}

interface Order {
    id: string;
    status: string;
    totalPrice: number;
    createdAt: string;
    estimatedCompletionTime?: string;
    completedAt?: string;
    shop: {
        id: string;
        name: string;
        address: string;
        banner?: string;
    };
    items: OrderItem[];
}

interface MyOrdersResponse {
    myOrders: Order[];
}

interface Shop {
    id: string;
    name: string;
    rating?: number;
    distance?: number;
    banner?: string | null;
}

interface ShopsResponse {
    shops: {
        data: Shop[];
        page: {
            totalElements: number;
        };
    };
}

export const CustomerHome = () => {
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    // Get user's geolocation
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                () => {
                    // Fallback to default location (Dodoma, Tanzania)
                    setUserLocation([-6.17, 35.74]);
                }
            );
        } else {
            setUserLocation([-6.17, 35.74]);
        }
    }, []);

    const { data: ordersData, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useQuery<MyOrdersResponse>(GET_MY_ORDERS);

    const { data: shopsData, loading: shopsLoading, error: shopsError, refetch: refetchShops } = useQuery<ShopsResponse>(GET_SHOPS, {
        variables: {
            filterInput: {
                radiusKm: 20,
                latitude: userLocation?.[0],
                longitude: userLocation?.[1],
            }
        },
        skip: !userLocation
    });

    const isLoading = ordersLoading || shopsLoading || !userLocation;
    const hasError = ordersError || shopsError;

    const recentOrders = ordersData?.myOrders?.slice(0, 3) || [];
    const nearbyShops = shopsData?.shops?.data?.slice(0, 4) || [];

    // Calculate average speed from completed orders
    const completedOrders = ordersData?.myOrders?.filter((o: Order) => o.status === 'COMPLETED' && o.completedAt && o.createdAt) || [];
    const avgSpeed = completedOrders.length > 0
        ? Math.round(completedOrders.reduce((acc: number, curr: Order) => {
            const duration = (new Date(curr.completedAt!).getTime() - new Date(curr.createdAt).getTime()) / (1000 * 60);
            return acc + duration;
        }, 0) / completedOrders.length)
        : null;

    const stats = {
        avgSpeed: avgSpeed ? `${avgSpeed} mins` : "N/A",
        nearbyCount: shopsData?.shops?.page?.totalElements || 0,
        totalSpent: ordersData?.myOrders?.reduce((acc: number, curr: Order) => acc + curr.totalPrice, 0) || 0,
        recentStatus: ordersData?.myOrders?.[0]?.status || 'None'
    };

    if (hasError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center border border-red-200">
                    <AlertCircle className="h-8 w-8 text-error" />
                </div>
                <div>
                    <p className="font-bold text-ink">Unable to load dashboard data</p>
                    <p className="text-sm text-charcoal mt-1">Please check your connection and try again.</p>
                </div>
                <Button
                    onClick={() => { refetchOrders(); refetchShops(); }}
                    className="mt-2 bg-error hover:bg-red-700 text-white border-0"
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-10 fade-in pb-12">
            {/* Hero Welcome Card */}
            <div className="bg-gradient-to-br from-hp-primary to-blue-900 rounded-[4px] text-white relative overflow-hidden shadow-md border border-blue-800/50 flex flex-col md:flex-row items-center min-h-[360px]">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-[4px] blur-3xl -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-blue-500/20 rounded-[4px] blur-2xl translate-y-1/3"></div>
                
                <div className="relative z-10 p-8 md:p-14 flex-1 w-full md:w-[60%]">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-white/10 backdrop-blur-md border border-white/10 mb-6">
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span className="text-xs font-semibold text-blue-50 uppercase tracking-widest">Enterprise Printing</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15]">
                        Need prints fast? <br />
                        <span className="text-blue-200">We've got you covered.</span>
                    </h2>
                    <p className="text-blue-100/90 mt-5 text-lg font-normal max-w-lg leading-relaxed">
                        Upload your documents, choose finishing options, and pick them up at a nearby station. The smartest way to print.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button
                            className="bg-white text-hp-primary hover:bg-cloud h-14 px-8 w-full sm:w-auto rounded-[4px] font-semibold flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                            onClick={() => navigate('/checkout')}
                        >
                            <FileUp className="h-5 w-5" />
                            Start New Job
                        </button>
                        <button
                            className="text-white hover:bg-white/10 h-14 px-8 w-full sm:w-auto rounded-[4px] font-semibold flex items-center justify-center gap-2 border border-white/20 transition-colors backdrop-blur-sm"
                            onClick={() => navigate('/dashboard/customer/orders')}
                        >
                            Track Recent
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Hero Image Side */}
                <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[45%] z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent z-10"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=2070&auto=format&fit=crop" 
                        alt="Enterprise Printing" 
                        className="w-full h-full object-cover opacity-80"
                    />
                </div>
            </div>

            {/* Quick Stats / Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {isLoading ? (
                    <>
                        <StatSkeleton />
                        <StatSkeleton />
                        <StatSkeleton />
                        <StatSkeleton />
                    </>
                ) : (
                    <>
                        <QuickStat icon={Zap} label="Average Speed" value={stats.avgSpeed} />
                        <QuickStat icon={MapPin} label="Nearby Shops" value={`${stats.nearbyCount} active`} />
                        <QuickStat icon={TrendingUp} label="Total Spent" value={`TZS ${Number(stats?.totalSpent || 0).toLocaleString()}`} />
                        <QuickStat icon={Clock} label="Recent Job" value={stats.recentStatus} />
                    </>
                )}
            </div>

            {/* Section: Recent Orders */}
            <div className="space-y-6">
                <div className="flex justify-between items-end px-2">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-ink tracking-tight">Recent Print Jobs</h3>
                        <p className="text-sm text-steel mt-1">Track the status of your latest documents.</p>
                    </div>
                    <button 
                        className="text-sm font-semibold text-hp-primary hover:text-blue-800 transition-colors flex items-center gap-1" 
                        onClick={() => navigate('/dashboard/customer/orders')}
                    >
                        View All <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        <>
                            <JobCardSkeleton />
                            <JobCardSkeleton />
                            <JobCardSkeleton />
                        </>
                    ) : recentOrders.length === 0 ? (
                        <div className="lg:col-span-3 border border-dashed border-fog bg-cloud/50 rounded-[4px] p-12 text-center flex flex-col items-center justify-center min-h-[250px]">
                            <div className="h-16 w-16 rounded-full bg-canvas flex items-center justify-center mb-5 shadow-sm">
                                <FileUp className="h-8 w-8 text-steel" />
                            </div>
                            <p className="text-lg font-semibold text-ink">No recent orders found</p>
                            <p className="text-sm text-charcoal mt-2 mb-6 max-w-sm">
                                You haven't placed any print orders recently. Upload a document to get started.
                            </p>
                            <button 
                                className="bg-hp-primary text-canvas hover:bg-hp-primary/90 px-6 py-3 rounded-[4px] font-semibold tracking-wide transition-colors"
                                onClick={() => navigate('/checkout')}
                            >
                                Upload Document
                            </button>
                        </div>
                    ) : (
                        recentOrders.map((order: Order) => (
                            <RecentJobCard
                                key={order.id}
                                id={`ORD-${order.id.split('-')[0].toUpperCase()}`}
                                shop={order.shop?.name}
                                status={order.status.toLowerCase()}
                                time={formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                                price={order.totalPrice}
                                files={order.items?.length || 0}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Section: Recommended for You */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-ink px-2">Popular Nearby Stations</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                    {isLoading ? (
                        <>
                            <ShopSkeleton />
                            <ShopSkeleton />
                            <ShopSkeleton />
                        </>
                    ) : nearbyShops.length === 0 ? (
                        <p className="text-charcoal text-sm px-2">No shops found in your immediate area.</p>
                    ) : (
                        nearbyShops.map((shop: Shop) => (
                            <RecommendedShop
                                key={shop.id}
                                name={shop.name}
                                rating={shop.rating}
                                distance={shop.distance !== undefined ? `${Number(shop.distance).toFixed(1)}km` : undefined}
                                banner={shop.banner}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// TypeScript types for component props
interface QuickStatProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}

interface RecentJobCardProps {
    id: string;
    shop: string;
    status: string;
    time: string;
    price: number;
    files: number;
}

interface RecommendedShopProps {
    name: string;
    rating?: number;
    distance?: string;
    banner?: string | null;
}

const QuickStat = ({ icon: Icon, label, value }: QuickStatProps) => (
    <div className="bg-canvas border border-fog rounded-[4px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-[140px]">
        <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-cloud flex items-center justify-center text-hp-primary shrink-0">
                <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-steel">{label}</p>
        </div>
        <p className="text-2xl md:text-3xl font-bold text-ink tracking-tight truncate w-full">{value}</p>
    </div>
);

const RecentJobCard = ({ id, shop, status, time, price, files }: RecentJobCardProps) => {
    const isCompleted = status === 'completed' || status === 'ready';
    return (
        <div className="bg-canvas border border-fog rounded-[4px] p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-start mb-4">
                <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                    isCompleted ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                )}>
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div className="text-right">
                    <span className={cn(
                        "text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px]",
                        isCompleted ? "bg-green-100/50 text-green-700" : "bg-blue-100/50 text-blue-700"
                    )}>
                        {status}
                    </span>
                    <p className="text-[11px] font-medium text-steel mt-2">{time}</p>
                </div>
            </div>
            <div>
                <p className="font-semibold text-ink text-sm mb-1">{id}</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-charcoal truncate pr-2 max-w-[70%]">{shop}</p>
                    <p className="text-xs text-steel font-medium">{files} files</p>
                </div>
                <div className="h-[1px] w-full bg-fog my-3" />
                <div className="flex justify-between items-center">
                    <span className="text-xs text-steel">Total Amount</span>
                    <span className="font-bold text-ink">TZS {Number(price || 0).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

const RecommendedShop = ({ name, rating, distance, banner }: RecommendedShopProps) => {
    return (
        <div className="min-w-[260px] bg-canvas rounded-[4px] shadow-sm border border-fog group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
            <div className="h-32 w-full bg-cloud relative overflow-hidden flex items-center justify-center">
                {banner ? (
                    <img src={banner} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" alt={name} />
                ) : (
                    <div className="text-steel flex flex-col items-center">
                        <MapPin className="h-8 w-8 mb-1 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-white">{rating ? Number(rating).toFixed(1) : 'New'}</span>
                    </div>
                    {distance && <div className="text-xs font-medium text-white/90 bg-black/30 backdrop-blur-md px-2 py-1 rounded-md">{distance}</div>}
                </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
                <h4 className="font-semibold text-ink truncate mb-2">{name}</h4>
                <div className="flex items-center text-xs font-medium text-hp-primary group-hover:text-blue-700 transition-colors">
                    Start printing here <ChevronRight className="h-4 w-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
};

// Skeletons
const StatSkeleton = () => (
    <div className="bg-canvas border border-fog rounded-[4px] p-6 shadow-sm flex flex-col justify-between h-[140px]">
        <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-10 w-10 rounded-full bg-cloud" />
            <Skeleton className="h-4 w-24 bg-cloud" />
        </div>
        <Skeleton className="h-8 w-20 bg-cloud mt-4" />
    </div>
);

const JobCardSkeleton = () => (
    <div className="bg-canvas border border-fog rounded-[4px] p-5 shadow-sm min-h-[160px] flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-10 w-10 rounded-full bg-cloud" />
            <Skeleton className="h-6 w-16 rounded-full bg-cloud" />
        </div>
        <div>
            <Skeleton className="h-4 w-24 mb-2 bg-cloud" />
            <Skeleton className="h-3 w-32 mb-4 bg-cloud" />
            <div className="h-[1px] w-full bg-fog my-3" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20 bg-cloud" />
                <Skeleton className="h-4 w-16 bg-cloud" />
            </div>
        </div>
    </div>
);

const ShopSkeleton = () => (
    <div className="min-w-[260px] bg-canvas rounded-[4px] p-0 shadow-sm border border-fog flex flex-col overflow-hidden">
        <Skeleton className="h-32 w-full bg-cloud rounded-none" />
        <div className="p-4">
            <Skeleton className="h-5 w-3/4 mb-3 bg-cloud" />
            <Skeleton className="h-4 w-1/2 bg-cloud" />
        </div>
    </div>
);
