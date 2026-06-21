import { useNavigate } from 'react-router-dom';
import { FileUp, Clock, MapPin, Zap, TrendingUp, ChevronRight, Star, AlertCircle } from 'lucide-react';
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
        <div className="space-y-8 fade-in">
            {/* Hero Welcome Card */}
            <div className="bg-hp-primary rounded-[16px] p-8 md:p-12 text-white relative overflow-hidden shadow-sm">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Need prints fast? <br />
                        <span className="text-blue-200">We've got you covered.</span>
                    </h2>
                    <p className="text-blue-100 mt-4 text-lg font-medium max-w-md">
                        The smartest way to upload, optimize, and print documents at nearby stations.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Button
                            className="bg-white text-hp-primary hover:bg-cloud h-14 px-8 rounded-[4px] font-bold flex items-center gap-3 transition-transform"
                            onClick={() => navigate('/checkout')}
                        >
                            <FileUp className="h-6 w-6" />
                            Start New Job
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/10 h-14 px-8 rounded-[4px] font-bold flex items-center gap-2 border border-white/20"
                            onClick={() => navigate('/dashboard/customer/orders')}
                        >
                            Track Recent
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Background decoration icon */}
                <FileUp className="absolute right-12 bottom-12 h-48 w-48 text-white/10 rotate-12" />
            </div>

            {/* Quick Stats / Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {isLoading ? (
                    <>
                        <StatSkeleton />
                        <StatSkeleton />
                        <StatSkeleton />
                        <StatSkeleton />
                    </>
                ) : (
                    <>
                        <QuickStat icon={Zap} label="Average Speed" value={stats.avgSpeed} color="bg-amber-500/20 text-amber-400 border border-amber-500/30" />
                        <QuickStat icon={MapPin} label="Nearby Shops" value={`${stats.nearbyCount} active`} color="bg-blue-500/20 text-blue-400 border border-blue-500/30" />
                        <QuickStat 
                            icon={TrendingUp} 
                            label="Total Spent" 
                            value={`$${Number(stats?.totalSpent || 0).toFixed(2)}`} 
                            color="bg-green-500/20 text-green-400 border border-green-500/30" 
                        />
                        <QuickStat icon={Clock} label="Recent Job" value={stats.recentStatus} color="bg-purple-500/20 text-purple-400 border border-purple-500/30" />
                    </>
                )}
            </div>

            {/* Section: Recent Orders */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xl font-bold text-ink">Recent Print Jobs</h3>
                    <Button variant="ghost" size="sm" className="text-hp-primary font-bold hover:bg-cloud" onClick={() => navigate('/dashboard/customer/orders')}>See all</Button>
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        <>
                            <JobCardSkeleton />
                            <JobCardSkeleton />
                        </>
                    ) : recentOrders.length === 0 ? (
                        <Card className="border border-fog bg-canvas shadow-sm rounded-[16px]">
                            <CardContent className="p-8 text-center flex flex-col items-center">
                                <div className="h-12 w-12 rounded-full bg-cloud flex items-center justify-center mb-4">
                                    <FileUp className="h-6 w-6 text-charcoal" />
                                </div>
                                <p className="font-bold text-ink">No recent orders yet</p>
                                <p className="text-sm text-charcoal mt-1 mb-4">Start your first print job today!</p>
                                <Button 
                                    className="bg-hp-primary text-white hover:bg-blue-800 rounded-[4px]"
                                    onClick={() => navigate('/checkout')}
                                >
                                    Upload Document
                                </Button>
                            </CardContent>
                        </Card>
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
                                rating={shop.rating || 4.8}
                                distance={shop.distance !== undefined ? `${Number(shop.distance).toFixed(1)}km` : undefined}
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
    color: string;
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
    rating: number;
    distance?: string;
}

const QuickStat = ({ icon: Icon, label, value, color }: QuickStatProps) => (
    <Card className="border border-fog shadow-sm bg-canvas rounded-[16px]">
        <CardContent className="p-4 flex flex-col items-center text-center">
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-2 shadow-sm", color)}>
                <Icon className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-bold text-charcoal uppercase tracking-wider">{label}</p>
            <p className="text-sm font-black text-ink mt-0.5 truncate w-full">{value}</p>
        </CardContent>
    </Card>
);

const RecentJobCard = ({ id, shop, status, time, price, files }: RecentJobCardProps) => (
    <Card className="border border-fog shadow-sm bg-canvas rounded-[16px] hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "h-12 w-12 rounded-[8px] flex items-center justify-center",
                    status === 'ready' || status === 'completed' ? "bg-green-100" : "bg-blue-100"
                )}>
                    {status === 'ready' || status === 'pending' ? <Clock className={cn("h-6 w-6", status === 'ready' ? "text-green-600" : "text-blue-600")} /> : <TrendingUp className="h-6 w-6 text-blue-600" />}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-black text-ink">{id}</span>
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                            status === 'ready' || status === 'completed' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        )}>
                            {status}
                        </span>
                    </div>
                    <p className="text-xs font-bold text-charcoal mt-0.5">{shop} • {files} files</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-black text-ink">${Number(price || 0).toFixed(2)}</p>
                <p className="text-[10px] font-medium text-charcoal">{time}</p>
            </div>
        </CardContent>
    </Card>
);

const RecommendedShop = ({ name, rating, distance }: RecommendedShopProps) => (
    <div className="min-w-[200px] bg-canvas rounded-[16px] p-5 shadow-sm border border-fog group cursor-pointer hover:shadow-md transition-shadow">
        <div className="h-28 w-full bg-cloud rounded-lg mb-4 overflow-hidden relative">
            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} className="h-full w-full object-cover" alt={name} />
            <div className="absolute top-2 right-2 h-7 w-7 bg-white rounded-md flex items-center justify-center shadow-sm border border-fog">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span className="ml-1 text-[10px] font-bold text-ink">{rating}</span>
            </div>
        </div>
        <h4 className="font-bold text-ink truncate">{name}</h4>
        <div className="flex items-center justify-between mt-2">
            {distance && <p className="text-xs font-bold text-charcoal">{distance}</p>}
            <div className="flex items-center gap-1 text-xs font-bold text-hp-primary ml-auto">
                View <ChevronRight className="h-3 w-3" />
            </div>
        </div>
    </div>
);

// Skeletons
const StatSkeleton = () => (
    <Card className="border border-fog shadow-sm bg-canvas rounded-[16px]">
        <CardContent className="p-4 flex flex-col items-center">
            <Skeleton className="h-10 w-10 rounded-xl mb-2 bg-cloud" />
            <Skeleton className="h-3 w-16 mb-1 bg-cloud" />
            <Skeleton className="h-4 w-20 bg-cloud" />
        </CardContent>
    </Card>
);

const JobCardSkeleton = () => (
    <Card className="border border-fog shadow-sm bg-canvas rounded-[16px]">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-[8px] bg-cloud" />
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <Skeleton className="h-4 w-20 bg-cloud" />
                        <Skeleton className="h-4 w-12 rounded-full bg-cloud" />
                    </div>
                    <Skeleton className="h-3 w-32 bg-cloud" />
                </div>
            </div>
            <div className="text-right space-y-2">
                <Skeleton className="h-4 w-12 ml-auto bg-cloud" />
                <Skeleton className="h-3 w-16 ml-auto bg-cloud" />
            </div>
        </CardContent>
    </Card>
);

const ShopSkeleton = () => (
    <div className="min-w-[200px] bg-canvas rounded-[16px] p-5 shadow-sm border border-fog">
        <Skeleton className="h-28 w-full rounded-lg mb-4 bg-cloud" />
        <Skeleton className="h-5 w-3/4 mb-3 bg-cloud" />
        <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-12 bg-cloud" />
            <Skeleton className="h-3 w-8 bg-cloud" />
        </div>
    </div>
);
