'use client';

import { useState } from 'react';

import { useQuery } from '@apollo/client/react';
import { ShoppingCart, Package, Clock, CheckCircle, XCircle, MoreHorizontal, Eye, Download, Truck, Activity, DollarSign, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { GET_ALL_ORDERS } from '../../../features/admin/api';

export default function AdminOrdersPage() {
  const { data, loading, error } = useQuery(GET_ALL_ORDERS);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const orders = data?.orders?.data || [];

  const getStatusBadge = (status: string) => {
    const styles = {
      UPLOADED: 'bg-warning/10 text-warning border-warning/20',
      ACCEPTED: 'bg-info/10 text-info border-info/20',
      PRINTING: 'bg-hp-primary/10 text-hp-primary border-hp-primary/20',
      READY: 'bg-success/10 text-success border-success/20',
      COMPLETED: 'bg-success/10 text-success border-success/20',
      CANCELLED: 'bg-error/10 text-error border-error/20',
    };
    
    const icons = {
      UPLOADED: <Clock className="h-3 w-3 mr-1" />,
      ACCEPTED: <Package className="h-3 w-3 mr-1" />,
      PRINTING: <Package className="h-3 w-3 mr-1" />,
      READY: <CheckCircle className="h-3 w-3 mr-1" />,
      COMPLETED: <CheckCircle className="h-3 w-3 mr-1" />,
      CANCELLED: <XCircle className="h-3 w-3 mr-1" />,
    };
    
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o: any) => o.status === 'COMPLETED').length;
  const activeOrders = orders.filter((o: any) => o.status === 'ACCEPTED' || o.status === 'PRINTING' || o.status === 'READY').length;
  const totalRevenue = orders.filter((o: any) => o.status === 'COMPLETED').reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-1 flex items-center gap-3">
            <ShoppingCart className="h-7 w-7 text-hp-primary" />
            Order Management
          </h1>
          <p className="text-steel text-sm">Manage all platform orders and fulfillment</p>
        </div>
        <div className="text-sm font-medium text-steel bg-cloud border border-fog px-4 py-2 rounded-lg">
          Total: {totalOrders} orders
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-hp-primary/10 flex items-center justify-center flex-shrink-0">
            <ShoppingCart className="h-6 w-6 text-hp-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Total Orders</p>
            <p className="text-2xl font-bold text-ink leading-tight">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center flex-shrink-0">
            <Activity className="h-6 w-6 text-info" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Active / Printing</p>
            <p className="text-2xl font-bold text-ink leading-tight">{activeOrders}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Completed</p>
            <p className="text-2xl font-bold text-ink leading-tight">{completedOrders}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Est. Revenue</p>
            <p className="text-xl font-bold text-ink leading-tight">TZS {totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main / Centered Content */}
        <div className="xl:col-span-3 space-y-6">

      {/* Orders Table */}
      <div className="bg-cloud border border-fog rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-fog bg-paper">
              <TableHead className="text-graphite font-semibold">Order ID</TableHead>
              <TableHead className="text-graphite font-semibold">Customer</TableHead>
              <TableHead className="text-graphite font-semibold">Shop</TableHead>
              <TableHead className="text-graphite font-semibold">Status</TableHead>
              <TableHead className="text-graphite font-semibold">Total Price</TableHead>
              <TableHead className="text-graphite font-semibold">Date</TableHead>
              <TableHead className="text-graphite font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order: any) => (
              <TableRow key={order.id} className="border-fog hover:bg-paper/50 transition-colors">
                <TableCell className="text-ink font-medium">
                  {order.id?.substring(0, 8)}...
                </TableCell>
                <TableCell className="text-steel">
                  <div>
                    <p className="font-medium text-ink">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                    <p className="text-xs text-graphite">{order.customer?.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-steel">
                  <div>
                    <p className="font-medium text-ink">{order.shop?.name}</p>
                    <p className="text-xs text-graphite">{order.shop?.owner?.firstName} {order.shop?.owner?.lastName}</p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-ink font-medium">
                  TZS {order.totalPrice?.toLocaleString()}
                </TableCell>
                <TableCell className="text-steel">
                  {order.createdAt && formatDate(order.createdAt)}
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
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-ink hover:bg-cloud cursor-pointer">
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-fog" />
                      <DropdownMenuItem className="text-info hover:bg-info/10 cursor-pointer focus:bg-info/10 focus:text-info">
                        <Package className="h-4 w-4 mr-2" />
                        Accept Order
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-success hover:bg-success/10 cursor-pointer focus:bg-success/10 focus:text-success">
                        <Truck className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-error hover:bg-error/10 cursor-pointer focus:bg-error/10 focus:text-error">
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

          {orders.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-fog rounded-xl">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-steel opacity-50" />
              <p className="text-lg font-medium text-ink">No orders found</p>
              <p className="text-sm text-steel mt-1">Orders will appear here when customers place them</p>
            </div>
          )}

          {orders.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-steel">
                Showing <span className="font-medium text-ink">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-ink">{Math.min(page * ITEMS_PER_PAGE, orders.length)}</span> of <span className="font-medium text-ink">{orders.length}</span> orders
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
              <button className="w-full flex items-center justify-start gap-2 bg-hp-primary hover:bg-hp-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Download className="h-4 w-4" />
                Export Orders CSV
              </button>
              <button className="w-full flex items-center justify-start gap-2 border border-fog hover:bg-paper text-ink px-4 py-2 rounded-lg font-medium transition-colors">
                <Calendar className="h-4 w-4 text-graphite" />
                Filter by Date
              </button>
            </div>
          </div>

          {/* Fulfillment Summary */}
          <div className="bg-cloud border border-fog rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4">Fulfillment Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-steel">Completion Rate</span>
                  <span className="font-medium text-ink">
                    {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-fog rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-success h-2 rounded-full" 
                    style={{ width: `${totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-steel">Active Load</span>
                  <span className="font-medium text-info">
                    {totalOrders > 0 ? Math.round((activeOrders / totalOrders) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-fog rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-info h-2 rounded-full" 
                    style={{ width: `${totalOrders > 0 ? (activeOrders / totalOrders) * 100 : 0}%` }}
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
