'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Edit, Trash2, Plus, MoreHorizontal, Settings, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [rulesPage, setRulesPage] = useState(1);
  const [discountsPage, setDiscountsPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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

  const totalRules = pricingRules.length;
  const activeRules = pricingRules.filter(r => r.isActive).length;
  const totalDiscounts = discounts.length;
  const activeDiscounts = discounts.filter(d => d.isActive).length;

  const totalRulesPages = Math.ceil(totalRules / ITEMS_PER_PAGE);
  const paginatedRules = pricingRules.slice((rulesPage - 1) * ITEMS_PER_PAGE, rulesPage * ITEMS_PER_PAGE);

  const totalDiscountsPages = Math.ceil(totalDiscounts / ITEMS_PER_PAGE);
  const paginatedDiscounts = discounts.slice((discountsPage - 1) * ITEMS_PER_PAGE, discountsPage * ITEMS_PER_PAGE);

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
        <div className="text-sm font-medium text-steel bg-cloud border border-fog px-4 py-2 rounded-lg">
          {totalRules} Rules • {totalDiscounts} Discounts
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-hp-primary/10 flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-6 w-6 text-hp-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Base Rules</p>
            <p className="text-2xl font-bold text-ink leading-tight">{totalRules}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Active Rules</p>
            <p className="text-2xl font-bold text-ink leading-tight">{activeRules}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <Tag className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Total Discounts</p>
            <p className="text-2xl font-bold text-ink leading-tight">{totalDiscounts}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="h-6 w-6 text-info" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Active Discounts</p>
            <p className="text-2xl font-bold text-ink leading-tight">{activeDiscounts}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main / Centered Content */}
        <div className="xl:col-span-3 space-y-6">

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
              {paginatedRules.map((rule) => (
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

          {totalRules > 0 && totalRulesPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-fog bg-cloud">
              <p className="text-sm text-steel">
                Showing <span className="font-medium text-ink">{(rulesPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-ink">{Math.min(rulesPage * ITEMS_PER_PAGE, totalRules)}</span> of <span className="font-medium text-ink">{totalRules}</span> rules
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRulesPage(Math.max(1, rulesPage - 1))}
                  disabled={rulesPage === 1}
                  className="h-8 border-fog text-ink"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRulesPage(Math.min(totalRulesPages, rulesPage + 1))}
                  disabled={rulesPage === totalRulesPages}
                  className="h-8 border-fog text-ink"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
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
              {paginatedDiscounts.map((discount) => (
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

          {totalDiscounts > 0 && totalDiscountsPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-fog bg-cloud">
              <p className="text-sm text-steel">
                Showing <span className="font-medium text-ink">{(discountsPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-ink">{Math.min(discountsPage * ITEMS_PER_PAGE, totalDiscounts)}</span> of <span className="font-medium text-ink">{totalDiscounts}</span> discounts
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDiscountsPage(Math.max(1, discountsPage - 1))}
                  disabled={discountsPage === 1}
                  className="h-8 border-fog text-ink"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDiscountsPage(Math.min(totalDiscountsPages, discountsPage + 1))}
                  disabled={discountsPage === totalDiscountsPages}
                  className="h-8 border-fog text-ink"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
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
                Add Pricing Rule
              </Button>
              <Button variant="outline" className="w-full justify-start border-fog hover:bg-paper text-ink rounded-lg">
                <Tag className="h-4 w-4 mr-2 text-purple-500" />
                Add Discount Range
              </Button>
            </div>
          </div>

          {/* Pricing Config Summary */}
          <div className="bg-cloud border border-fog rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4">Configuration Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-steel">Rules Coverage</span>
                  <span className="font-medium text-ink">
                    {totalRules > 0 ? Math.round((activeRules / totalRules) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-fog rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-success h-2 rounded-full" 
                    style={{ width: `${totalRules > 0 ? (activeRules / totalRules) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-steel">Discount Usage</span>
                  <span className="font-medium text-info">
                    {totalDiscounts > 0 ? Math.round((activeDiscounts / totalDiscounts) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-fog rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-info h-2 rounded-full" 
                    style={{ width: `${totalDiscounts > 0 ? (activeDiscounts / totalDiscounts) * 100 : 0}%` }}
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
