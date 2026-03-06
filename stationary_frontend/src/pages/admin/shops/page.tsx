'use client';

import { useQuery } from '@apollo/client/react';
import { Store, MapPin, Star, Check, MoreHorizontal, Eye, Edit, Ban } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { GET_ALL_SHOPS } from '../../../features/admin/api';

export default function AdminShopsPage() {
  const { data, loading, error } = useQuery(GET_ALL_SHOPS);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              <div className="h-6 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">Error loading shops</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  const shops = data?.shops?.data || [];

  const getVerificationBadge = (isVerified: boolean) => (
    <Badge className={isVerified ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
      {isVerified ? 'Verified' : 'Unverified'}
    </Badge>
  );

  const getSubscriptionBadge = (tier: string) => {
    const colors = {
      'FREE': 'bg-gray-100 text-gray-800 border-gray-200',
      'PREMIUM': 'bg-blue-100 text-blue-800 border-blue-200',
      'ENTERPRISE': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return (
      <Badge className={colors[tier as keyof typeof colors] || colors.FREE}>
        {tier}
      </Badge>
    );
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Store className="h-8 w-8 text-blue-400" />
            Shop Management
          </h1>
          <p className="text-gray-400">Manage printing shops and verification</p>
        </div>
        <div className="text-sm text-gray-400">
          Total: {shops.length} shops
        </div>
      </div>

      {/* Shops List */}
      <div className="space-y-4">
        {shops.map((shop: any) => (
          <div key={shop.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            {/* Shop Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{shop.name}</h3>
                    {getVerificationBadge(shop.isVerified)}
                    {getSubscriptionBadge(shop.subscriptionTier)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Rating:</span>
                      <div className="flex">
                        {getRatingStars(shop.rating)}
                      </div>
                      <span className="text-gray-400">({shop.rating})</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Owner: {shop.owner?.firstName} {shop.owner?.lastName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={shop.isAcceptingOrders ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                    {shop.isAcceptingOrders ? 'Accepting Orders' : 'Not Accepting'}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                      <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Shop
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="text-green-400 hover:bg-gray-700 hover:text-green-400">
                        <Check className="h-4 w-4 mr-2" />
                        Verify Shop
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-gray-700 hover:text-red-400">
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend Shop
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        ))}

        {shops.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Store className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium">No shops found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
