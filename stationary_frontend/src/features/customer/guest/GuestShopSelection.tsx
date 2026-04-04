import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_SHOPS } from '../../shops/api';
import { useCustomerStore } from '../../../stores/customerStore';
import { Card, CardContent } from '../../../components/ui/Card';
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
  
  console.log("All shops from API:", allShops);
  console.log("Filtered accepting shops:", shops);
  
  // Log first shop details for debugging
  if (shops.length > 0) {
    console.log("First shop details:", shops[0]);
    console.log("First shop rating type:", typeof shops[0].rating);
    console.log("First shop rating value:", shops[0].rating);
  }

  const handleShopSelect = (shopId: string) => {
    console.log("Selected shop:", shopId);
    setSelectedShop(shopId);
    setSelectedShopId(shopId);
  };

  const handleContinue = () => {
    if (selectedShop) {
      console.log("Continuing to checkout with shop:", selectedShop);
      setCurrentStep('checkout');
    } else {
      console.log("No shop selected");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading available shops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 p-4 rounded text-center">
          <p className="text-red-800 dark:text-red-400">Error loading shops: {error.message}</p>
        </div>
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 p-4 rounded text-center">
          <p className="text-yellow-800 dark:text-yellow-400">No shops are currently accepting orders.</p>
          <p className="text-yellow-700 dark:text-yellow-500 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Choose a Printing Shop</h2>
        <p className="text-gray-600 dark:text-gray-400">Select a shop to handle your printing order</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <Card 
            key={shop.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedShop === shop.id 
                ? 'ring-2 ring-brand-600 border-brand-600 dark:ring-brand-400 dark:border-brand-400' 
                : 'hover:border-brand-300 dark:hover:border-brand-500'
            }`}
            onClick={() => handleShopSelect(shop.id)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1 cursor-help">{shop.name}</h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{shop.name}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{shop.address}</span>
                  </div>
                </div>
                {selectedShop === shop.id && (
                  <CheckCircle className="w-6 h-6 text-brand-600 flex-shrink-0 ml-2" />
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {typeof shop.rating === 'number' 
                      ? shop.rating.toFixed(1) 
                      : typeof shop.rating === 'string' 
                      ? parseFloat(shop.rating).toFixed(1) 
                      : '0.0'}
                  </span>
                </div>
                {shop.distance && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {shop.distance.toFixed(1)} km away
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className={`flex items-center text-sm ${
                  shop.isAcceptingOrders ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  <Clock className="w-4 h-4 mr-1" />
                  {shop.isAcceptingOrders ? 'Accepting orders' : 'Not accepting'}
                </div>
                {shop.subscriptionTier && (
                  <div className="text-xs bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 px-2 py-1 rounded">
                    {shop.subscriptionTier}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedShop && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={handleContinue}
            className="bg-brand-600 dark:bg-brand-500 text-white hover:bg-brand-700 dark:hover:bg-brand-600 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Continue to Checkout
          </button>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
};
