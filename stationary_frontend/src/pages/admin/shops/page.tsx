'use client';

import { useState } from 'react';

import { useQuery } from '@apollo/client/react';
import { Store, MapPin, Star, Check, MoreHorizontal, Eye, Edit, Ban, CheckCircle, ShieldCheck, TrendingUp, Plus, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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

  const totalShops = shops.length;
  const verifiedShops = shops.filter((s: any) => s.isVerified).length;
  const acceptingOrders = shops.filter((s: any) => s.isAcceptingOrders).length;
  const premiumShops = shops.filter((s: any) => s.subscriptionTier !== 'FREE').length;

  const totalPages = Math.ceil(shops.length / ITEMS_PER_PAGE);
  const paginatedShops = shops.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-hp-primary/10 flex items-center justify-center flex-shrink-0">
            <Store className="h-6 w-6 text-hp-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Total Shops</p>
            <p className="text-2xl font-bold text-ink leading-tight">{totalShops}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Verified</p>
            <p className="text-2xl font-bold text-ink leading-tight">{verifiedShops}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center flex-shrink-0">
            <Activity className="h-6 w-6 text-info" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Accepting Orders</p>
            <p className="text-2xl font-bold text-ink leading-tight">{acceptingOrders}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Premium / Ent.</p>
            <p className="text-2xl font-bold text-ink leading-tight">{premiumShops}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main / Centered Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Shops List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedShops.map((shop: any) => (
              <div key={shop.id} className="bg-cloud border border-fog rounded-xl overflow-hidden hover:border-steel transition-colors">
                {/* Shop Header */}
                <div className="p-5 border-b border-fog bg-paper">
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
                <div className="px-5 py-3 flex items-center justify-between">
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

          {shops.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-steel">
                Showing <span className="font-medium text-ink">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-ink">{Math.min(page * ITEMS_PER_PAGE, shops.length)}</span> of <span className="font-medium text-ink">{shops.length}</span> shops
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="h-8 border-fog text-ink"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="h-8 border-fog text-ink"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-cloud border border-fog rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-hp-primary hover:bg-hp-primary/90 text-white rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add New Shop
              </Button>
              <Button variant="outline" className="w-full justify-start border-fog hover:bg-paper text-ink rounded-lg">
                <ShieldCheck className="h-4 w-4 mr-2 text-success" />
                Verify Pending Shops
              </Button>
            </div>
          </div>

          {/* Summary Widget */}
          <div className="bg-cloud border border-fog rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4">Platform Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-steel">Verification Rate</span>
                  <span className="font-medium text-ink">
                    {totalShops > 0 ? Math.round((verifiedShops / totalShops) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-fog rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-success h-2 rounded-full" 
                    style={{ width: `${totalShops > 0 ? (verifiedShops / totalShops) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-steel">Premium Conversion</span>
                  <span className="font-medium text-ink">
                    {totalShops > 0 ? Math.round((premiumShops / totalShops) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-fog rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${totalShops > 0 ? (premiumShops / totalShops) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
