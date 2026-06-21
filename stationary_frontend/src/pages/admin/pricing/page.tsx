'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Edit, Trash2, Plus, MoreHorizontal } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/LegacyButton';
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
    <Badge className={isActive ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );

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

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-1 flex items-center gap-3">
            <DollarSign className="h-7 w-7 text-hp-primary" />
            Pricing Management
          </h1>
          <p className="text-steel text-sm">Manage service pricing rules and discounts</p>
        </div>
        <Button className="bg-hp-primary hover:bg-hp-primary/90 text-white rounded-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add New Rule
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-cloud border border-fog p-1 rounded-xl max-w-sm">
        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            activeTab === 'pricing'
              ? 'bg-paper text-ink shadow-sm'
              : 'text-steel hover:bg-paper/50'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Pricing Rules
        </button>
        <button
          onClick={() => setActiveTab('discounts')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            activeTab === 'discounts'
              ? 'bg-paper text-ink shadow-sm'
              : 'text-steel hover:bg-paper/50'
          }`}
        >
          <TrendingDown className="h-4 w-4" />
          Page Discounts
        </button>
      </div>

      {activeTab === 'pricing' && (
        /* Pricing Rules */
        <div className="bg-cloud border border-fog rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-fog bg-paper">
                <TableHead className="text-graphite font-semibold">Service Type</TableHead>
                <TableHead className="text-graphite font-semibold">Base Price</TableHead>
                <TableHead className="text-graphite font-semibold">Description</TableHead>
                <TableHead className="text-graphite font-semibold">Status</TableHead>
                <TableHead className="text-graphite font-semibold">Created</TableHead>
                <TableHead className="text-graphite font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingRules.map((rule) => (
                <TableRow key={rule.id} className="border-fog hover:bg-paper/50 transition-colors">
                  <TableCell className="text-ink font-medium">
                    {rule.serviceType.replace('_', ' ')}
                  </TableCell>
                  <TableCell className="text-ink font-medium">
                    TZS {rule.basePrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-steel">
                    {rule.description}
                  </TableCell>
                  <TableCell>{getStatusBadge(rule.isActive)}</TableCell>
                  <TableCell className="text-steel">
                    {new Date(rule.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
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
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Rule
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-success hover:bg-success/10 cursor-pointer focus:bg-success/10 focus:text-success">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-error hover:bg-error/10 cursor-pointer focus:bg-error/10 focus:text-error">
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
        <div className="bg-cloud border border-fog rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-fog bg-paper">
                <TableHead className="text-graphite font-semibold">Page Range</TableHead>
                <TableHead className="text-graphite font-semibold">Service Type</TableHead>
                <TableHead className="text-graphite font-semibold">Discount</TableHead>
                <TableHead className="text-graphite font-semibold">Status</TableHead>
                <TableHead className="text-graphite font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id} className="border-fog hover:bg-paper/50 transition-colors">
                  <TableCell className="text-ink font-medium">
                    {discount.minPages} - {discount.maxPages} pages
                  </TableCell>
                  <TableCell className="text-steel">
                    {discount.serviceType.replace('_', ' ')}
                  </TableCell>
                  <TableCell className="text-success font-medium">
                    {discount.discountPercent}% off
                  </TableCell>
                  <TableCell>{getStatusBadge(discount.isActive)}</TableCell>
                  <TableCell className="text-right">
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
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Discount
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-success hover:bg-success/10 cursor-pointer focus:bg-success/10 focus:text-success">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-error hover:bg-error/10 cursor-pointer focus:bg-error/10 focus:text-error">
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
