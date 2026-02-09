import { useQuery } from '@apollo/client/react';
import { GET_SHOPS } from '../../../shops/api';
import type { GetShopsData } from '../../../shops/types';
import { ShopMap } from '../../../shops/components/ShopMap';
import { useCustomerStore } from '../../../../stores/customerStore';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Star, MapPin, Navigation, Clock, Check, Search, Filter, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../../../lib/utils';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const ShopSelector = () => {
    const { selectedShopId, setSelectedShopId } = useCustomerStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(true);

    // Get user's geolocation
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                    setIsGettingLocation(false);
                    setLocationError(null);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    // Fallback to default location (Dodoma, Tanzania)
                    setUserLocation([-6.17, 35.74]);
                    setLocationError('Using default location (Dodoma). Please enable location access for accurate results.');
                    setIsGettingLocation(false);
                }
            );
        } else {
            // Fallback if geolocation is not supported
            setUserLocation([-6.17, 35.74]);
            setLocationError('Geolocation not supported. Using default location (Dodoma).');

            setIsGettingLocation(false);
        }
    }, []);

    const { data, loading } = useQuery<GetShopsData>(GET_SHOPS, {
        variables: {
            filterInput: {
                radiusKm: 50, // Increased radius to ensure we get results
                latitude: userLocation?.[0],
                longitude: userLocation?.[1],
                searchTerm: searchTerm || undefined
            }
        },
        skip: !userLocation // Don't query until we have location
    });


    // Calculate distances and sort shops by distance
    const shopsWithDistance = (data?.shops?.data || []).map(shop => ({
        ...shop,
        calculatedDistance: userLocation
            ? calculateDistance(userLocation[0], userLocation[1], shop.latitude, shop.longitude)
            : shop.distance || 0
    })).sort((a, b) => a.calculatedDistance - b.calculatedDistance);

    return (
        <div className="space-y-6 fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Select Print Shop</h2>
                <p className="text-slate-500">Choose a shop based on proximity, rating, and estimated pickup time.</p>
            </div>

            {/* Location Status */}
            {locationError && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-amber-900">Location Notice</p>
                        <p className="text-xs text-amber-700 mt-1">{locationError}</p>
                    </div>
                </div>
            )}

            {userLocation && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <p className="text-xs font-bold text-green-800">
                        Your location: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                    </p>
                </div>
            )}

            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search for a specific shop..."
                        className="pl-12 h-12 glass border-white/20 shadow-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-12 px-6 gap-2 glass border-white/20">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                {/* Shop List */}
                <div className="overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                    {isGettingLocation || loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
                            <span className="flex items-center gap-2 text-brand-600 font-bold">
                                {isGettingLocation ? 'Getting your location...' : 'Locating shops...'}
                            </span>
                        </div>
                    ) : shopsWithDistance.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                                <MapPin className="h-8 w-8 text-slate-400" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">No shops found nearby</p>
                                <p className="text-sm text-slate-500 mt-1">Try expanding your search radius or check back later.</p>
                            </div>
                        </div>
                    ) : shopsWithDistance.map((shop, index) => (
                        <Card
                            key={shop.id}
                            className={cn(
                                "cursor-pointer transition-all duration-300 border-2 slide-in-right overflow-hidden",
                                selectedShopId === shop.id
                                    ? "border-brand-500 bg-brand-50 shadow-lg scale-[1.02]"
                                    : "border-slate-100 hover:border-brand-200"
                            )}
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => setSelectedShopId(shop.id)}
                        >
                            <CardContent className="p-0 flex h-32">
                                <div className="w-32 bg-slate-200 relative overflow-hidden">
                                    <img
                                        src={shop.banner || `https://api.dicebear.com/7.x/initials/svg?seed=${shop.name}`}
                                        alt={shop.name}
                                        className="h-full w-full object-cover"
                                    />
                                    {shop.isAcceptingOrders && (
                                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-green-500 text-white rounded text-[8px] font-bold uppercase">
                                            Open
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-900 line-clamp-1">{shop.name}</h3>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                <MapPin className="h-3 w-3" />
                                                {shop.address}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-lg text-xs font-bold ring-1 ring-amber-100">
                                            <Star className="h-3 w-3 fill-amber-500" />
                                            {shop.rating != null ? Number(shop.rating).toFixed(1) : '4.8'}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                <Navigation className="h-3 w-3" />
                                                {Number(shop.calculatedDistance).toFixed(1)} km
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {Math.ceil(shop.calculatedDistance * 3)}-{Math.ceil(shop.calculatedDistance * 4)} min
                                            </span>
                                        </div>
                                        {selectedShopId === shop.id ? (
                                            <div className="h-6 w-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg transform scale-110 motion-safe:animate-bounce-short">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-brand-600">Select</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Map View */}
                <div className="hidden lg:block rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-full relative group">
                    {userLocation && <ShopMap shops={shopsWithDistance} center={userLocation} />}
                    <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-xl border border-white/20 shadow-lg text-xs font-bold text-slate-700 pointer-events-none group-hover:scale-105 transition-transform">
                        Interactive Map View
                    </div>
                </div>
            </div>
        </div>
    );
};
