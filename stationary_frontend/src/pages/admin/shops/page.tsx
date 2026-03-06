'use client';

import { useState, useEffect } from 'react';
import { Store, MapPin, Star, Check, X, MoreHorizontal, Eye, Edit, Ban } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/Button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Input } from '../../../components/ui/Input';

interface Shop {
  id: string;
  name: string;
  owner: string;
  address: string;
  latitude: number;
  longitude: number;
  isVerified: boolean;
  isAcceptingOrders: boolean;
  subscriptionTier: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  rating: number;
  pricing: ShopPricing[];
  discounts: PageRangeDiscount[];
}

interface ShopPricing {
  id: string;
  serviceType: string;
  basePrice: number;
}

interface PageRangeDiscount {
  id: string;
  minPages: number;
  maxPages: number;
  discountPercent: number;
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const mockShops: Shop[] = [
          {
            id: '1',
            name: 'Print Shop Dar',
            owner: 'owner@example.com',
            address: 'Dar es Salaam, Tanzania',
            latitude: -6.7924,
            longitude: 39.2083,
            isVerified: true,
            isAcceptingOrders: true,
            subscriptionTier: 'PREMIUM',
            rating: 4.5,
            pricing: [
              { id: '1', serviceType: 'PRINTING', basePrice: 1000 },
              { id: '2', serviceType: 'BINDING', basePrice: 500 },
            ],
            discounts: [
              { id: '1', minPages: 10, maxPages: 50, discountPercent: 10 },
              { id: '2', minPages: 51, maxPages: 100, discountPercent: 15 },
            ],
          },
          {
            id: '2',
            name: 'Quick Print Center',
            owner: 'quick@example.com',
            address: 'Dodoma, Tanzania',
            latitude: -6.1630,
            longitude: 35.7516,
            isVerified: false,
            isAcceptingOrders: true,
            subscriptionTier: 'FREE',
            rating: 3.8,
            pricing: [
              { id: '3', serviceType: 'PRINTING', basePrice: 800 },
            ],
            discounts: [],
          },
        ];
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShops(mockShops);
      } catch (error) {
        console.error('Failed to fetch shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'verified' && shop.isVerified) ||
                         (statusFilter === 'unverified' && !shop.isVerified) ||
                         (statusFilter === 'accepting' && shop.isAcceptingOrders) ||
                         (statusFilter === 'not_accepting' && !shop.isAcceptingOrders);
    
    return matchesSearch && matchesStatus;
  });

  const getVerificationBadge = (isVerified: boolean) => (
    <Badge className={isVerified ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
      {isVerified ? (
        <><Check className="h-3 w-3 mr-1" />Verified</>
      ) : (
        <><X className="h-3 w-3 mr-1" />Pending</>
      )}
    </Badge>
  );

  const getSubscriptionBadge = (tier: string) => {
    const styles = {
      FREE: 'bg-gray-100 text-gray-800 border-gray-200',
      PREMIUM: 'bg-blue-100 text-blue-800 border-blue-200',
      ENTERPRISE: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return (
      <Badge className={styles[tier as keyof typeof styles]}>
        {tier}
      </Badge>
    );
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white rounded px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
          <option value="accepting">Accepting Orders</option>
          <option value="not_accepting">Not Accepting</option>
        </select>
      </div>

      {/* Shops Table */}
      <div className="space-y-4">
        {filteredShops.map((shop) => (
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
                  <p className="text-sm text-gray-400">Owner: {shop.owner}</p>
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

        {filteredShops.length === 0 && (
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
