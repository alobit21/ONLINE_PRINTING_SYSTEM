'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Edit, Trash2, Plus, MoreHorizontal } from 'lucide-react';
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

interface PricingRule {
  id: string;
  serviceType: string;
  basePrice: number;
  description: string;
  isActive: boolean;
  createdAt: string;
}

interface PageRangeDiscount {
  id: string;
  minPages: number;
  maxPages: number;
  discountPercent: number;
  serviceType: string;
  isActive: boolean;
}

export default function AdminPricingPage() {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [discounts, setDiscounts] = useState<PageRangeDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pricing' | 'discounts'>('pricing');

  useEffect(() => {
    const fetchPricingData = async () => {
      setLoading(true);
      try {
        const mockPricingRules: PricingRule[] = [
          {
            id: '1',
            serviceType: 'PRINTING',
            basePrice: 1000,
            description: 'Standard black and white printing per page',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '2',
            serviceType: 'COLOR_PRINTING',
            basePrice: 2000,
            description: 'Color printing per page',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '3',
            serviceType: 'BINDING_SPIRAL',
            basePrice: 500,
            description: 'Spiral binding per document',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '4',
            serviceType: 'BINDING_HARD',
            basePrice: 2000,
            description: 'Hard cover binding per document',
            isActive: false,
            createdAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '5',
            serviceType: 'LAMINATION_GLOSSY',
            basePrice: 100,
            description: 'Glossy lamination per page',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
          },
        ];

        const mockDiscounts: PageRangeDiscount[] = [
          {
            id: '1',
            minPages: 10,
            maxPages: 50,
            discountPercent: 10,
            serviceType: 'PRINTING',
            isActive: true,
          },
          {
            id: '2',
            minPages: 51,
            maxPages: 100,
            discountPercent: 15,
            serviceType: 'PRINTING',
            isActive: true,
          },
          {
            id: '3',
            minPages: 101,
            maxPages: 500,
            discountPercent: 20,
            serviceType: 'PRINTING',
            isActive: true,
          },
          {
            id: '4',
            minPages: 20,
            maxPages: 100,
            discountPercent: 5,
            serviceType: 'COLOR_PRINTING',
            isActive: true,
          },
        ];
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPricingRules(mockPricingRules);
        setDiscounts(mockDiscounts);
      } catch (error) {
        console.error('Failed to fetch pricing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  const getStatusBadge = (isActive: boolean) => (
    <Badge className={isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );

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
            <DollarSign className="h-8 w-8 text-blue-400" />
            Pricing Management
          </h1>
          <p className="text-gray-400">Manage service pricing rules and discounts</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Rule
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'pricing'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Pricing Rules
        </button>
        <button
          onClick={() => setActiveTab('discounts')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'discounts'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <TrendingDown className="h-4 w-4" />
          Page Discounts
        </button>
      </div>

      {activeTab === 'pricing' && (
        /* Pricing Rules */
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Service Type</TableHead>
                <TableHead className="text-gray-300">Base Price</TableHead>
                <TableHead className="text-gray-300">Description</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Created</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingRules.map((rule) => (
                <TableRow key={rule.id} className="border-gray-700 hover:bg-gray-750">
                  <TableCell className="text-gray-100 font-medium">
                    {rule.serviceType.replace('_', ' ')}
                  </TableCell>
                  <TableCell className="text-gray-100 font-medium">
                    TZS {rule.basePrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {rule.description}
                  </TableCell>
                  <TableCell>{getStatusBadge(rule.isActive)}</TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(rule.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
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
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Rule
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-green-400 hover:bg-gray-700 hover:text-green-400">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-gray-700 hover:text-red-400">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {activeTab === 'discounts' && (
        /* Page Range Discounts */
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Page Range</TableHead>
                <TableHead className="text-gray-300">Service Type</TableHead>
                <TableHead className="text-gray-300">Discount</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id} className="border-gray-700 hover:bg-gray-750">
                  <TableCell className="text-gray-100 font-medium">
                    {discount.minPages} - {discount.maxPages} pages
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {discount.serviceType.replace('_', ' ')}
                  </TableCell>
                  <TableCell className="text-green-400 font-medium">
                    {discount.discountPercent}% off
                  </TableCell>
                  <TableCell>{getStatusBadge(discount.isActive)}</TableCell>
                  <TableCell className="text-right">
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
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Discount
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-green-400 hover:bg-gray-700 hover:text-green-400">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-gray-700 hover:text-red-400">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
