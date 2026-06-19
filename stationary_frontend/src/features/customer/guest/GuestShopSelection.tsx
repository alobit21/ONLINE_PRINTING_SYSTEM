import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_SHOPS } from '../../shops/api';
import { useCustomerStore } from '../../../stores/customerStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  address: string;
  rating: number | string;
  distance?: number;
  isAcceptingOrders: boolean;
  banner?: string;
  subscriptionTier?: string;
}

interface GetShopsData {
  shops: {
    response: {
      status: boolean;
      message: string;
    };
    data: Shop[];
  };
}

export const GuestShopSelection = () => {
  const { selectedShopId, setSelectedShopId, setCurrentStep } = useCustomerStore();
  const [selectedShop, setSelectedShop] = useState<string | null>(selectedShopId);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Get user's geolocation (same as ShopSelector)
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to default location (Dodoma, Tanzania)
          setUserLocation([-6.17, 35.74]);
        }
      );
    } else {
      // Fallback if geolocation is not supported
      setUserLocation([-6.17, 35.74]);
    }
  }, []);

  const { data, loading, error } = useQuery<GetShopsData>(GET_SHOPS, {
    variables: {
      filterInput: {
        radiusKm: userLocation ? 500 : null,
        latitude: userLocation?.[0] ?? null,
        longitude: userLocation?.[1] ?? null,
        searchTerm: null
      }
    },
    fetchPolicy: 'network-only'
  });

  const allShops = data?.shops?.data || [];
  const shops = allShops.filter(shop => shop.isAcceptingOrders);
  
  const handleShopSelect = (shopId: string) => {
    setSelectedShop(shopId);
    setSelectedShopId(shopId);
  };

  const handleContinue = () => {
    if (selectedShop) {
      setCurrentStep('checkout');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hp-primary mx-auto"></div>
          <p className="mt-4 text-charcoal">Loading available shops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-[16px] text-center">
          <p className="text-red-800 dark:text-red-400">Error loading shops: {error.message}</p>
        </div>
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-[16px] text-center">
          <p className="text-yellow-800 dark:text-yellow-400">No shops are currently accepting orders.</p>
          <p className="text-yellow-700 dark:text-yellow-500 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto p-4 pb-28">
      <div className="mb-8">
        <h2 className="text-[28px] font-medium text-ink mb-2">Choose a Printing Shop</h2>
        <p className="text-charcoal">Select a shop to handle your printing order</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <div 
            key={shop.id}
            className={`cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(26,26,26,0.12)] bg-canvas border rounded-[16px] p-6 ${
              selectedShop === shop.id 
                ? 'border-hp-primary ring-1 ring-hp-primary' 
                : 'border-fog hover:border-hp-primary/50'
            }`}
            onClick={() => handleShopSelect(shop.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="font-semibold text-lg text-ink mb-1 cursor-help">{shop.name}</h3>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{shop.name}</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex items-center text-sm text-charcoal">
                  <MapPin className="w-4 h-4 mr-1 text-steel" />
                  <span className="truncate">{shop.address}</span>
                </div>
              </div>
              {selectedShop === shop.id && (
                <CheckCircle className="w-6 h-6 text-hp-primary flex-shrink-0 ml-2" />
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium text-ink">
                  {typeof shop.rating === 'number' 
                    ? shop.rating.toFixed(1) 
                    : typeof shop.rating === 'string' 
                    ? parseFloat(shop.rating).toFixed(1) 
                    : '0.0'}
                </span>
              </div>
              {shop.distance && (
                <div className="text-sm text-steel">
                  {shop.distance.toFixed(1)} km away
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className={`flex items-center text-sm ${
                shop.isAcceptingOrders ? 'text-green-600 dark:text-green-400' : 'text-steel'
              }`}>
                <Clock className="w-4 h-4 mr-1" />
                {shop.isAcceptingOrders ? 'Accepting orders' : 'Not accepting'}
              </div>
              {shop.subscriptionTier && (
                <div className="text-xs bg-cloud text-hp-primary px-2 py-1 rounded-[4px] font-semibold tracking-[0.5px] uppercase">
                  {shop.subscriptionTier}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-canvas/80 backdrop-blur-lg border-t border-fog p-4 transform transition-all duration-300 z-50 shadow-[0_-4px_24px_rgba(26,26,26,0.08)] ${
          selectedShop ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="text-ink font-medium">Shop Selected</p>
            <p className="text-charcoal text-sm">Ready to finalize your order?</p>
          </div>
          <button 
            onClick={handleContinue}
            className="w-full sm:w-auto bg-hp-primary text-canvas hover:bg-hp-primary/90 px-8 py-3.5 rounded-[4px] font-semibold transition-colors tracking-[0.7px] shadow-lg flex items-center justify-center gap-2"
          >
            Continue to Checkout
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};
