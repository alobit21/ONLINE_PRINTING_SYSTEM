import { useQuery } from '@apollo/client/react';
import { GET_SHOPS } from '../../features/shops/api';
import type { GetShopsData, Shop } from '../../features/shops/types';
import { ShopCard } from '../../features/shops/components/ShopCard';
import { ShopMap } from '../../features/shops/components/ShopMap';
import { Input } from '../../components/ui/Input';
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CustomerDashboard = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // Example center (London). In real app use Geolocation API
    const center: [number, number] = [51.505, -0.09];

    const { data, loading, error } = useQuery<GetShopsData>(GET_SHOPS, {
        variables: {
            filterInput: {
                radiusKm: 10,
                latitude: center[0],
                longitude: center[1],
                searchTerm: searchTerm || undefined // Only sending if present
            }
        }
    });

    const shops = data?.shops?.data || [];

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <h1 className="text-xl font-bold text-brand-700">PrintSync Marketplace</h1>
                <div className="flex items-center gap-4">
                    <div className="relative w-64 md:w-96">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search stations..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="h-8 w-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold border border-brand-200">
                        U
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* List View */}
                <div className="w-1/3 bg-white border-r overflow-y-auto p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-semibold text-slate-700">Nearby Stations ({shops.length})</h2>
                        <Button variant="ghost" size="sm">Filter</Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-600" /></div>
                    ) : error ? (
                        <div className="text-red-500 text-center p-4">Error loading shops</div>
                    ) : shops.length === 0 ? (
                        <div className="text-slate-500 text-center p-8">No shops found within range.</div>
                    ) : (
                        shops.map((shop: Shop) => (
                            <ShopCard key={shop.id} shop={shop} />
                        ))
                    )}
                </div>

                {/* Map View */}
                <div className="flex-1 relative bg-slate-100">
                    {/* Leaflet Map */}
                    <div className="absolute inset-0 p-4">
                        <ShopMap shops={shops} center={center} />
                    </div>
                </div>
            </div>
        </div>
    );
};
