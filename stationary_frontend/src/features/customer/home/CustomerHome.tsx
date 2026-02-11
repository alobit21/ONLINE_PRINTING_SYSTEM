import { useNavigate } from 'react-router-dom';
import { FileUp, Clock, MapPin, Zap, TrendingUp, ChevronRight, Star, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { cn } from '../../../lib/utils';
import { useQuery } from '@apollo/client/react';
import { GET_MY_ORDERS } from '../orders/api';
import { GET_SHOPS } from '../../shops/api';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

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

    const { data: ordersData, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useQuery(GET_MY_ORDERS);

    const { data: shopsData, loading: shopsLoading, error: shopsError, refetch: refetchShops } = useQuery(GET_SHOPS, {
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
    const completedOrders = ordersData?.myOrders?.filter((o: any) => o.status === 'COMPLETED' && o.completedAt && o.createdAt) || [];
    const avgSpeed = completedOrders.length > 0
        ? Math.round(completedOrders.reduce((acc: number, curr: any) => {
            const duration = (new Date(curr.completedAt).getTime() - new Date(curr.createdAt).getTime()) / (1000 * 60);
            return acc + duration;
        }, 0) / completedOrders.length)
        : null;

    const stats = {
        avgSpeed: avgSpeed ? `${avgSpeed} mins` : "N/A",
        nearbyCount: shopsData?.shops?.page?.totalElements || 0,
        totalSpent: ordersData?.myOrders?.reduce((acc: number, curr: any) => acc + curr.totalPrice, 0) || 0,
        recentStatus: ordersData?.myOrders?.[0]?.status || 'None'
    };

    if (hasError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                    <p className="font-bold text-slate-900">Unable to load dashboard data</p>
                    <p className="text-sm text-slate-500 mt-1">Please check your connection and try again.</p>
                </div>
                <Button
                    onClick={() => { refetchOrders(); refetchShops(); }}
                    className="mt-2"
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 fade-in">
            {/* Hero Welcome Card */}
            <div className="gradient-brand rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-brand-500/20">
                <div className="absolute top-0 right-0 h-64 w-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 h-48 w-48 bg-brand-400/20 rounded-full -ml-24 -mb-24 blur-3xl" />

                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Need prints fast? <br />
                        <span className="text-brand-200">We've got you covered.</span>
                    </h2>
                    <p className="text-brand-100 mt-4 text-lg font-medium max-w-md">
                        The smartest way to upload, optimize, and print documents at nearby stations.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Button
                            className="bg-white text-brand-700 hover:bg-brand-50 h-14 px-8 rounded-2xl font-bold shadow-xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                            onClick={() => navigate('/dashboard/customer/upload')}
                        >
                            <FileUp className="h-6 w-6" />
                            Start New Job
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/10 h-14 px-8 rounded-2xl font-bold flex items-center gap-2"
                            onClick={() => navigate('/dashboard/customer/orders')}
                        >
                            Track Recent
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Background decoration icon */}
                <FileUp className="absolute right-12 bottom-12 h-48 w-48 text-white/5 rotate-12" />
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
                        <QuickStat icon={Zap} label="Average Speed" value={stats.avgSpeed} color="bg-amber-100 text-amber-600" />
                        <QuickStat icon={MapPin} label="Nearby Shops" value={`${stats.nearbyCount} active`} color="bg-blue-100 text-blue-600" />
                        <QuickStat 
                            icon={TrendingUp} 
                            label="Total Spent" 
                            value={`$${Number(stats?.totalSpent || 0).toFixed(2)}`} 
                            color="bg-green-100 text-green-600" 
                        />
                        <QuickStat icon={Clock} label="Recent Job" value={stats.recentStatus} color="bg-purple-100 text-purple-600" />
                    </>
                )}
            </div>

            {/* Section: Recent Orders */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xl font-bold text-slate-800">Recent Print Jobs</h3>
                    <Button variant="ghost" size="sm" className="text-brand-600 font-bold" onClick={() => navigate('/dashboard/customer/orders')}>See all</Button>
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        <>
                            <JobCardSkeleton />
                            <JobCardSkeleton />
                        </>
                    ) : recentOrders.length === 0 ? (
                        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
                            <CardContent className="p-8 text-center text-slate-500">
                                <p className="font-bold">No recent orders yet</p>
                                <p className="text-sm mt-1">Start your first print job today!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        recentOrders.map((order: any) => (
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
                <h3 className="text-xl font-bold text-slate-800 px-2">Popular Nearby Stations</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                    {isLoading ? (
                        <>
                            <ShopSkeleton />
                            <ShopSkeleton />
                            <ShopSkeleton />
                        </>
                    ) : nearbyShops.length === 0 ? (
                        <p className="text-slate-500 text-sm px-2">No shops found in your immediate area.</p>
                    ) : (
                        nearbyShops.map((shop: any) => (
                            <RecommendedShop
                                key={shop.id}
                                name={shop.name}
                                rating={shop.rating || 4.8}
                                distance={`${Number(shop.distance || 0).toFixed(1)}km`}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const QuickStat = ({ icon: Icon, label, value, color }: any) => (
    <Card className="border-none shadow-md overflow-hidden bg-white/90 backdrop-blur-sm group hover:scale-105 transition-all">
        <CardContent className="p-4 flex flex-col items-center text-center">
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-2 shadow-sm", color)}>
                <Icon className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-black text-slate-900 mt-0.5 truncate w-full">{value}</p>
        </CardContent>
    </Card>
);

const RecentJobCard = ({ id, shop, status, time, price, files }: any) => (
    <Card className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white/80 backdrop-blur-sm group">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12",
                    status === 'ready' || status === 'completed' ? "bg-green-500" : "bg-brand-500"
                )}>
                    {status === 'ready' || status === 'pending' ? <Clock className="h-6 w-6 text-white" /> : <TrendingUp className="h-6 w-6 text-white" />}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{id}</span>
                        <span className={cn(
                            "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                            status === 'ready' || status === 'completed' ? "bg-green-100 text-green-700" : "bg-brand-100 text-brand-700"
                        )}>
                            {status}
                        </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">{shop} • {files} files</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-black text-slate-900">${Number(price || 0).toFixed(2)}</p>
                <p className="text-[10px] font-medium text-slate-400">{time}</p>
            </div>
        </CardContent>
    </Card>
);

const RecommendedShop = ({ name, rating, distance }: any) => (
    <div className="min-w-[200px] bg-white rounded-3xl p-5 shadow-lg border border-slate-100 group cursor-pointer hover:border-brand-500 transition-all hover:scale-[1.02]">
        <div className="h-28 w-full bg-slate-100 rounded-2xl mb-4 overflow-hidden relative">
            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={name} />
            <div className="absolute top-2 right-2 h-7 w-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-amber-600 shadow-sm">
                <Star className="h-3 w-3 fill-amber-500" />
                <span className="ml-1 text-[10px] font-bold">{rating}</span>
            </div>
        </div>
        <h4 className="font-bold text-slate-900 truncate">{name}</h4>
        <div className="flex items-center justify-between mt-2">
            <p className="text-xs font-bold text-slate-400">{distance}</p>
            <div className="flex items-center gap-1 text-xs font-black text-brand-600">
                View <ChevronRight className="h-3 w-3" />
            </div>
        </div>
    </div>
);

// Skeletons
const StatSkeleton = () => (
    <Card className="border-none shadow-md bg-white">
        <CardContent className="p-4 flex flex-col items-center">
            <Skeleton className="h-10 w-10 rounded-xl mb-2" />
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-4 w-20" />
        </CardContent>
    </Card>
);

const JobCardSkeleton = () => (
    <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
            <div className="text-right space-y-2">
                <Skeleton className="h-4 w-12 ml-auto" />
                <Skeleton className="h-3 w-16 ml-auto" />
            </div>
        </CardContent>
    </Card>
);

const ShopSkeleton = () => (
    <div className="min-w-[200px] bg-white rounded-3xl p-5 shadow-lg border border-slate-100">
        <Skeleton className="h-28 w-full rounded-2xl mb-4" />
        <Skeleton className="h-5 w-3/4 mb-3" />
        <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-8" />
        </div>
    </div>
);
