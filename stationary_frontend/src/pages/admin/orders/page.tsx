'use client';

import { useQuery } from '@apollo/client/react';
import { ShoppingCart, Package, Clock, CheckCircle, XCircle, MoreHorizontal, Eye, Download, Truck } from 'lucide-react';
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
          Total: {orders.length} orders
        </div>
      </div>

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
            {orders.map((order: any) => (
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
    </div>
  );
}
