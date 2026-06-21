'use client';

import { useQuery } from '@apollo/client/react';
import { Store, MapPin, Star, Check, MoreHorizontal, Eye, Edit, Ban } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/LegacyButton';
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
      <div className="space-y-4 animate-in fade-in">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-cloud border border-fog rounded-xl p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-fog rounded w-1/3"></div>
              <div className="h-6 bg-fog rounded w-1/2"></div>
              <div className="h-4 bg-fog rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <Ban className="h-12 w-12 text-error" />
        <h2 className="text-xl font-bold text-ink">Error loading shops</h2>
        <p className="text-steel max-w-sm">{error.message}</p>
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
    <div className="space-y-6 animate-in fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-1 flex items-center gap-3">
            <Store className="h-7 w-7 text-hp-primary" />
            Shop Management
          </h1>
          <p className="text-steel text-sm">Manage printing shops and verification</p>
        </div>
        <div className="text-sm font-medium text-steel bg-cloud border border-fog px-4 py-2 rounded-lg">
          Total: {shops.length} shops
        </div>
      </div>

      {/* Shops List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {shops.map((shop: any) => (
          <div key={shop.id} className="bg-cloud border border-fog rounded-xl overflow-hidden hover:border-steel transition-colors">
            {/* Shop Header */}
            <div className="p-6 border-b border-fog bg-paper">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-ink truncate">{shop.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {getVerificationBadge(shop.isVerified)}
                    {getSubscriptionBadge(shop.subscriptionTier)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-steel">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-graphite" />
                      <span className="truncate">{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-graphite font-medium">Rating:</span>
                      <div className="flex">
                        {getRatingStars(shop.rating)}
                      </div>
                      <span className="text-steel">({shop.rating})</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions Menu */}
                <div className="flex items-center gap-2 shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-steel hover:text-ink hover:bg-cloud border border-transparent hover:border-fog">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-canvas border-fog shadow-lg">
                      <DropdownMenuLabel className="text-ink">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-fog" />
                      <DropdownMenuItem className="text-ink hover:bg-cloud cursor-pointer">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-ink hover:bg-cloud cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Shop
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-fog" />
                      <DropdownMenuItem className="text-success hover:bg-success/10 cursor-pointer focus:bg-success/10 focus:text-success">
                        <Check className="h-4 w-4 mr-2" />
                        Verify Shop
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-error hover:bg-error/10 cursor-pointer focus:bg-error/10 focus:text-error">
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend Shop
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            {/* Shop Footer */}
            <div className="px-6 py-4 flex items-center justify-between">
              <p className="text-xs font-medium text-graphite">
                Owner: <span className="text-ink">{shop.owner?.firstName} {shop.owner?.lastName}</span>
              </p>
              <Badge className={shop.isAcceptingOrders ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}>
                {shop.isAcceptingOrders ? 'Accepting Orders' : 'Not Accepting'}
              </Badge>
            </div>
          </div>
        ))}

        {shops.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-fog rounded-xl">
            <Store className="h-12 w-12 mx-auto mb-3 text-steel opacity-50" />
            <p className="text-lg font-medium text-ink">No shops found</p>
            <p className="text-sm text-steel mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
